import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { MockRecipeService } from './recipe.service.mock';
import {
  IceCream,
  MockDatabase,
  RootBeerFloat,
  Sourdough,
} from '../database/database.service.mock';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { HttpException } from '@nestjs/common';

describe('RecipeController', () => {
  let controller: RecipeController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [RecipeService],
    })
      .overrideProvider(RecipeService)
      .useValue(MockRecipeService)
      .compile();

    controller = module.get<RecipeController>(RecipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all recipe names', async () => {
    MockRecipeService.findAll.mockImplementation(() => MockDatabase.recipes);
    const recipeNames = MockDatabase.recipes.map((recipe) => recipe.name);
    const actual = await controller.findAll();

    expect(MockRecipeService.findAll).toHaveBeenCalled();
    expect(actual).toStrictEqual({ recipeNames });
  });

  it('should return a recipe if it exists', async () => {
    MockRecipeService.findOne.mockImplementation((name: string) =>
      MockDatabase.recipes.find((recipe) => recipe.name === name),
    );

    const iceCream = await controller.findOne(IceCream.name);

    expect(MockRecipeService.findOne).toHaveBeenCalledWith(IceCream.name);
    expect(iceCream).toStrictEqual({
      details: {
        ingredients: IceCream.ingredients,
        numSteps: IceCream.instructions.length,
      },
    });

    const notFound = await controller.findOne('pizza');
    expect(MockRecipeService.findOne).toHaveBeenCalledWith('pizza');
    expect(notFound).toStrictEqual({});
  });

  it('does not add a recipe if it already exists', async () => {
    MockRecipeService.findOne.mockImplementation(() => IceCream);

    await expect(async () => await controller.create(IceCream)).rejects.toThrow(
      new HttpException({ error: 'Recipe already exists' }, 404),
    );
    expect(MockRecipeService.create).not.toHaveBeenCalled();
  });

  it('adds new recipes', async () => {
    MockRecipeService.findOne.mockImplementation(() => undefined);
    const response = await controller.create(RootBeerFloat);

    expect(MockRecipeService.create).toHaveBeenCalledWith<[CreateRecipeDto]>(
      RootBeerFloat,
    );
    expect(response).toBeUndefined();
  });

  it('does not update a recipe that does not exist', async () => {
    MockRecipeService.findOne.mockImplementation(() => undefined);

    await expect(
      async () =>
        await controller.update('pizza', {
          ingredients: ['dough', 'cheese', 'sauce'],
        }),
    ).rejects.toThrowError(
      new HttpException({ error: 'Recipe does not exist' }, 404),
    );
    expect(MockRecipeService.update).not.toHaveBeenCalled();
  });

  it('updates an existing recipe', async () => {
    MockRecipeService.findOne.mockImplementation(() => Sourdough);

    const sourdoughPartial = {
      ingredients: [...Sourdough.ingredients, 'salt'],
    };
    const response = await controller.update(Sourdough.name, sourdoughPartial);

    expect(MockRecipeService.update).toHaveBeenCalledWith<
      [string, UpdateRecipeDto]
    >(Sourdough.name, sourdoughPartial);
    expect(response).toBeUndefined();
  });
});
