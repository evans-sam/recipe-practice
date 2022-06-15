import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    const recipe = await this.recipeService.findOne(createRecipeDto.name);
    if (recipe) throw new HttpException('Recipe already exists', 400);

    return this.recipeService.create(createRecipeDto);
  }

  @Get()
  async findAll() {
    const recipes = await this.recipeService.findAll();
    return {
      recipeNames: recipes.map((recipe) => recipe.name),
    };
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    const recipe = await this.recipeService.findOne(name);
    return recipe
      ? {
          details: {
            ingredients: recipe.ingredients,
            numSteps: recipe.instructions.length,
          },
        }
      : {};
  }

  @Patch(':name')
  async update(
    @Param('name') name: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    const recipe = await this.recipeService.findOne(name);
    if (!recipe) throw new HttpException('Recipe does not exist', 404);

    return this.recipeService.update(name, updateRecipeDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.recipeService.remove(name);
  }
}
