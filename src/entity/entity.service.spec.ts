import { Test, TestingModule } from '@nestjs/testing';
import { EntityService } from './entity.service';
import { DatabaseService } from '../database/database.service';
import {
  BeefWellington,
  IceCream,
  MockDatabase,
  MockDatabaseService,
  RootBeerFloat,
} from '../database/database.service.mock';
import { Recipe } from '../recipe/entities/recipe.entity';
import { DatabaseSchema } from '../database/types';

describe('EntityService', () => {
  let entityService: EntityService;
  let mockDB: DatabaseSchema;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(MockDatabaseService)
      .compile();

    entityService = module.get<EntityService>(EntityService);
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
    expect(entityService).toBeDefined();
  });

  it('should return a named table', async () => {
    expect(await entityService.findAll('recipes')).toStrictEqual(
      MockDatabase.recipes,
    );
  });

  it('should find a row by name', async () => {
    expect(
      await entityService.findByName({
        tableName: 'recipes',
        name: BeefWellington.name,
      }),
    ).toStrictEqual(BeefWellington);

    expect(
      await entityService.findByName({
        tableName: 'recipes',
        name: IceCream.name,
      }),
    ).toStrictEqual(IceCream);
  });

  it('should create a row', async () => {
    await entityService.create({ tableName: 'recipes', row: RootBeerFloat });

    expect(mockDB.recipes).toContainEqual(RootBeerFloat);
    expect(MockDatabaseService.saveDB).toHaveBeenCalled();
  });

  it('should update a row', async () => {
    const oldWellington = { ...BeefWellington };

    const newWellington: Recipe = {
      ...BeefWellington,
      instructions: [...BeefWellington.instructions, 'add some sauce'],
    };

    await entityService.update({ tableName: 'recipes', newRow: newWellington });

    expect(MockDatabaseService.saveDB).toHaveBeenCalled();
    expect(mockDB.recipes).toContainEqual(newWellington);
    expect(mockDB.recipes).not.toContainEqual(oldWellington);
  });

  it('removes table rows', async () => {
    await entityService.remove({
      tableName: 'recipes',
      name: BeefWellington.name,
    });

    expect(MockDatabaseService.saveDB).toHaveBeenCalled();
    expect(mockDB.recipes).not.toContainEqual(BeefWellington);
  });
});
