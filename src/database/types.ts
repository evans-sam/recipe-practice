export type Entity = BaseRecipe;
export type Table = Entity[];
export type Schema = Record<string, Table>;

export interface BaseRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

export interface DatabaseSchema extends Schema {
  recipes: BaseRecipe[];
}
