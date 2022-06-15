import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import {
  CreateParams,
  EntityService,
  FindParams,
  UpdateParams,
} from '../entity/entity.service';
import { MockEntityService } from '../entity/entity.service.mock';
import {
  BeefWellington,
  IceCream,
  MockDatabase,
  RootBeerFloat,
} from '../database/database.service.mock';
import { remove } from 'lodash';

describe('RecipeService', () => {
  let recipeService: RecipeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeService, EntityService],
    })
      .overrideProvider(EntityService)
      .useValue(MockEntityService)
      .compile();

    recipeService = module.get<RecipeService>(RecipeService);
  });

  it('should be defined', () => {
    expect(recipeService).toBeDefined();
  });

  it('should find all recipes', async () => {
    const result = MockDatabase.recipes;
    MockEntityService.findAll.mockImplementation(async () => result);

    const actual = await recipeService.findAll();

    expect(MockEntityService.findAll).toHaveBeenCalledWith<[string]>('recipes');
    expect(actual).toBe(result);
  });

  it('should find a recipe by name', async () => {
    MockEntityService.findByName.mockImplementation(async (args: FindParams) =>
      args.name === IceCream.name ? IceCream : undefined,
    );

    const actual = await recipeService.findOne(IceCream.name);

    expect(MockEntityService.findByName).toHaveBeenCalledWith<[FindParams]>({
      tableName: 'recipes',
      name: IceCream.name,
    });
    expect(actual).toBe(IceCream);
  });

  it('should create a new recipe', async () => {
    const recipes = MockDatabase.recipes;
    MockEntityService.create.mockImplementation((args: CreateParams) =>
      recipes.push(args.row),
    );

    await recipeService.create(RootBeerFloat);

    expect(MockEntityService.create).toHaveBeenCalledWith<[CreateParams]>({
      tableName: 'recipes',
      row: RootBeerFloat,
    });
    expect(recipes).toContainEqual(RootBeerFloat);
  });

  it('should update an existing recipe', async () => {
    MockEntityService.update.mockImplementation((args: UpdateParams) =>
      Object.assign(oldWellington, args.newRow),
    );
    const oldWellington = { ...BeefWellington };

    const newWellington = {
      instructions: [...BeefWellington.instructions, 'add some sauce'],
    };

    await recipeService.update(BeefWellington.name, newWellington);

    expect(MockEntityService.update).toHaveBeenCalledWith<[UpdateParams]>({
      tableName: 'recipes',
      newRow: {
        ...newWellington,
        name: BeefWellington.name,
      },
    });

    expect(oldWellington).toBe({
      ...BeefWellington,
      instructions: newWellington.instructions,
    });
  });

  it('should remove a recipe from the table', async () => {
    const recipes = [...MockDatabase.recipes];
    MockEntityService.remove.mockImplementation((args: FindParams) =>
      remove(recipes, (recipe) => recipe.name === args.name),
    );

    await recipeService.remove(IceCream.name);

    expect(MockEntityService.remove).toHaveBeenCalledWith<[FindParams]>({
      tableName: 'recipes',
      name: IceCream.name,
    });

    expect(recipes).not.toContainEqual(IceCream);
  });
});
