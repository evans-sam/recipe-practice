import { Injectable } from '@nestjs/common';
import { DatabaseSchema } from './types';
import jsonfile from 'jsonfile';
import path from 'path';

@Injectable()
export class DatabaseService {
  private readonly filePath;

  constructor() {
    this.filePath = path.join(__dirname, 'data.json');
  }

  async openDB(): Promise<DatabaseSchema> {
    return await jsonfile.readFile(this.filePath);
  }

  async saveDB(database: DatabaseSchema): Promise<void> {
    return await jsonfile.writeFile(this.filePath, database);
  }
}
