import { Injectable } from '@nestjs/common';
import { DatabaseSchema } from '../database/types';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class EntityService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(tableName: keyof DatabaseSchema) {
    const db = await this.databaseService.openDB();
    return db[tableName];
  }

  async findByName(tableName: keyof DatabaseSchema, name: string) {
    const db = await this.databaseService.openDB();
    const table = db[tableName];
    return table.find((row: Record<string, any>) => row.name === name);
  }
}
