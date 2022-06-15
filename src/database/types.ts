import { Recipe } from '../recipe/entities/recipe.entity';

export interface DatabaseSchema {
  recipes: Recipe[];
}
