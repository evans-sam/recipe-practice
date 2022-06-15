import { CreateRecipeDto } from '../dto/create-recipe.dto';

export class Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];

  constructor(recipe: CreateRecipeDto) {
    Object.assign(this, recipe);
  }
}
