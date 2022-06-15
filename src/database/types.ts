import { Recipe } from '../recipe/entities/recipe.entity';

export type Entity = Recipe;
export type Table = Entity[];
export type Schema = Record<string, Table>;

export interface DatabaseSchema extends Schema {
  recipes: Recipe[];
}
