import { DatabaseSchema, Entity } from '../database/types';

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
