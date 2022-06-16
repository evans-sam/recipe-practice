import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { BaseRecipe } from '../../database/types';

export class CreateRecipeDto implements BaseRecipe {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsArray()
  @IsString({ each: true })
  instructions: string[];
}
