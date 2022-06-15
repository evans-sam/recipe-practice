import { Injectable } from '@nestjs/common';
import { DatabaseSchema, Entity, Table } from '../database/types';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class EntityService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(tableName: keyof DatabaseSchema): Promise<Table> {
    return await this.getTable(tableName);
  }

  async findByName(
    tableName: keyof DatabaseSchema,
    name: string,
  ): Promise<Entity> {
    const table = await this.getTable(tableName);
    return table.find((row: Record<string, any>) => row.name === name);
  }

  async create(tableName: keyof DatabaseSchema, row: Entity): Promise<void> {
    const table = await this.getTable(tableName);
    table.push(row);
    await this.updateTable(tableName, table);
  }

  async update(
    tableName: keyof DatabaseSchema,
    newRow: Partial<Entity>,
  ): Promise<void> {
    const table = await this.getTable(tableName);
    const oldRow = await this.findByName(tableName, newRow.name);
    Object.assign(oldRow, newRow);
    await this.updateTable(tableName, table);
  }

  async remove(tableName: keyof DatabaseSchema, name: string): Promise<void> {
    const table = await this.getTable(tableName);

    await this.updateTable(
      tableName,
      table.filter((row) => row.name !== name),
    );
  }

  private async getTable(tableName: keyof DatabaseSchema): Promise<Table> {
    const db = await this.databaseService.openDB();
    return db[tableName];
  }

  private async updateTable(
    tableName: keyof DatabaseSchema,
    table: Table,
  ): Promise<void> {
    const db = await this.databaseService.openDB();
    db[tableName] = table;
    await this.databaseService.saveDB(db);
  }
}
