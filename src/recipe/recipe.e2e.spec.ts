import { Test, TestingModule } from '@nestjs/testing';
import { RecipeModule } from './recipe.module';
import { INestApplication } from '@nestjs/common';
import {
  BeefWellington,
  MockDatabase,
  MockDatabaseService,
  RootBeerFloat,
  Sourdough,
} from '../database/database.service.mock';
import { DatabaseSchema } from '../database/types';
import { EntityModule } from '../entity/entity.module';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import request from 'supertest';

describe('Recipes', () => {
  let app: INestApplication;
  let mockDB: DatabaseSchema;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
      imports: [RecipeModule, EntityModule, DatabaseModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(MockDatabaseService)
      .compile();

    app = module.createNestApplication();
    await app.init();

    mockDB = { ...MockDatabase };
    MockDatabaseService.openDB.mockImplementation(() => mockDB);
    MockDatabaseService.saveDB.mockImplementation(
      (newDB: DatabaseSchema) => (mockDB = newDB),
    );
  });

  it('/GET recipes', () => {
    const recipeNames = MockDatabase.recipes.map((recipe) => recipe.name);

    return request(app.getHttpServer())
      .get('/recipes')
      .expect(200)
      .expect({ recipeNames });
  });

  it('/GET recipe details', () => {
    const result = {
      details: {
        ingredients: Sourdough.ingredients,
        numSteps: Sourdough.instructions.length,
      },
    };

    return request(app.getHttpServer())
      .get(`/recipes/details/${Sourdough.name}`)
      .expect(200)
      .expect(result);
  });

  it('/PUT updates existing recipes', () => {
    return request(app.getHttpServer())
      .put('/recipes')
      .send({
        name: BeefWellington.name,
        instructions: [...BeefWellington.instructions, 'add some sauce'],
      })
      .expect(204)
      .expect({});
  });

  it('/PUT cannot update a recipe that does not exist', () => {
    return request(app.getHttpServer())
      .put('/recipes')
      .send(RootBeerFloat)
      .expect(404)
      .expect({ error: 'Recipe does not exist' });
  });

  it('/POST adds a recipe', () => {
    return request(app.getHttpServer())
      .post('/recipes')
      .send(RootBeerFloat)
      .expect(201)
      .expect({});
  });

  it('/POST successfully added recipe', () => {
    expect(mockDB.recipes).toContainEqual(RootBeerFloat);
  });

  /* It's a placeholder for a test that I haven't written yet. */
  it('/POST cannot add a recipe that already exists', () => {
    return request(app.getHttpServer())
      .post('/recipes')
      .send(RootBeerFloat)
      .expect(400)
      .expect({ error: 'Recipe already exists' });
  });

  //TODO doesn't work
  // it('/POST cannot add a recipe without a name', () => {
  //   const noName = omit(RootBeerFloat, 'name');
  //   return request(app.getHttpServer())
  //     .post('/recipes')
  //     .send(noName)
  //     .expect(400)
  //     .expect({
  //       error: 'Bad Request',
  //     });
  // });

  afterAll(async () => {
    await app.close();
  });
});
