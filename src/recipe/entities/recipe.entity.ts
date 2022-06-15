import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { BaseRecipe } from '../../database/types';

export class Recipe implements BaseRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];

  constructor(recipe: CreateRecipeDto) {
    Object.assign(this, recipe);
  }
}
