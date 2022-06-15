import { Injectable } from '@nestjs/common';
import { DatabaseSchema, Entity, Table } from '../database/types';
import { DatabaseService } from '../database/database.service';
import { remove } from 'lodash';

export interface UpdateParams {
  tableName: keyof DatabaseSchema;
  newRow: Partial<Entity> & Required<Pick<Entity, 'name'>>;
}

export interface CreateParams {
  tableName: keyof DatabaseSchema;
  row: Entity;
}

export interface FindParams {
  tableName: keyof DatabaseSchema;
  name: string;
}

@Injectable()
export class EntityService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(tableName: keyof DatabaseSchema): Promise<Table> {
    return await this.getTable(tableName);
  }

  async findByName({ tableName, name }: FindParams): Promise<Entity> {
    const table = await this.getTable(tableName);
    return table.find((row: Record<string, any>) => row.name === name);
  }

  async create({ tableName, row }: CreateParams): Promise<void> {
    const table = await this.getTable(tableName);
    table.push(row);
    await this.updateTable(tableName, table);
  }

  async update({ tableName, newRow }: UpdateParams): Promise<void> {
    const table = await this.getTable(tableName);
    const oldRow = await this.findByName({
      tableName: tableName,
      name: newRow.name,
    });
    Object.assign(oldRow, newRow);
    await this.updateTable(tableName, table);
  }

  async remove({ tableName, name }: FindParams): Promise<void> {
    const table = await this.getTable(tableName);
    remove(table, (row) => row.name === name);

    await this.updateTable(tableName, table);
  }

  private async getTable(tableName: keyof DatabaseSchema): Promise<Table> {
    const db = await this.databaseService.openDB();
    return db[tableName];
  }

  private async updateTable(
    tableName: keyof DatabaseSchema,
    table: Table,
  ): Promise<void> {
    const database = await this.databaseService.openDB();
    database[tableName] = table;
    await this.databaseService.saveDB(database);
  }
}
