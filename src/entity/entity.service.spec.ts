import { Test, TestingModule } from '@nestjs/testing';
import { EntityService } from './entity.service';
import { DatabaseService } from '../database/database.service';
import {
  BeefWellington,
  IceCream,
  MockDatabase,
  MockDatabaseService,
} from '../database/database.service.mock';
import { Recipe } from '../recipe/entities/recipe.entity';
import { DatabaseSchema } from '../database/types';

describe('EntityService', () => {
  let service: EntityService;
  let mockDB: DatabaseSchema;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(MockDatabaseService)
      .compile();

    service = module.get<EntityService>(EntityService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDB = { ...MockDatabase };
    MockDatabaseService.openDB.mockImplementation(() => mockDB);
    MockDatabaseService.saveDB.mockImplementation(
      (newDB: DatabaseSchema) => (mockDB = newDB),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a named table', async () => {
    expect(await service.findAll('recipes')).toStrictEqual(
      MockDatabase.recipes,
    );
  });

  it('should find a row by name', async () => {
    expect(
      await service.findByName('recipes', BeefWellington.name),
    ).toStrictEqual(BeefWellington);

    expect(await service.findByName('recipes', IceCream.name)).toStrictEqual(
      IceCream,
    );
  });

  it('should create a row', async () => {
    const float: Recipe = {
      name: 'rootBeerFloat',
      ingredients: ['ice cream', 'root beer'],
      instructions: ['put them in a cup'],
    };

    await service.create('recipes', float);

    expect(mockDB.recipes).toContainEqual(float);
  });

  it('should update a row', async () => {
    const oldWellington = { ...BeefWellington };

    const newWellington: Recipe = {
      ...BeefWellington,
      instructions: [...BeefWellington.instructions, 'add some sauce'],
    };

    await service.update('recipes', newWellington);

    expect(mockDB.recipes).toContainEqual(newWellington);
    expect(mockDB.recipes).not.toContainEqual(oldWellington);
  });

  it('removes table rows', async () => {
    await service.remove('recipes', BeefWellington.name);

    expect(mockDB.recipes).not.toContainEqual(BeefWellington);
  });
});
