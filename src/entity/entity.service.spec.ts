import { Test, TestingModule } from '@nestjs/testing';
import { EntityService } from './entity.service';
import { DatabaseService } from '../database/database.service';
import {
  BeefWellington,
  MockDatabase,
  MockDatabaseService,
} from '../database/database.service.mock';

describe('EntityService', () => {
  let service: EntityService;

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
    MockDatabaseService.openDB.mockReturnValue(MockDatabase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a named table', async () => {
    expect(await service.findAll('recipes')).toBe(MockDatabase.recipes);
  });

  it('should find a row by name', async () => {
    expect(await service.findByName('recipes', 'beefWellington')).toBe(
      BeefWellington,
    );
  });
});
