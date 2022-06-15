import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { EntityService } from '../entity/entity.service';
import { MockEntityService } from '../entity/entity.service.mock';
import { MockDatabase } from '../database/database.service.mock';
import { head } from 'lodash';

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

    expect(await recipeService.findAll()).toBe(result);
  });

  it('should find a recipe by name', async () => {
    const result = head(MockDatabase.recipes);
    // MockEntityService;
  });
});
