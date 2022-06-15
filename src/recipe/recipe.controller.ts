import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
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
    if (recipe)
      throw new HttpException({ error: 'Recipe already exists' }, 400);

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

  @Get('/details/:name')
  async findDetails(@Param('name') name: string) {
    return this.findOne(name);
  }

  @Patch(':name')
  async update(
    @Param('name') name: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    const recipe = await this.recipeService.findOne(name);
    if (!recipe)
      throw new HttpException({ error: 'Recipe does not exist' }, 404);

    await this.recipeService.update(name, updateRecipeDto);

    return;
  }

  @Put()
  @HttpCode(204)
  async put(@Body() updatedRecipeDto: UpdateRecipeDto) {
    if (!updatedRecipeDto.name)
      throw new HttpException({ error: 'Recipe does not exist' }, 404);

    return await this.update(updatedRecipeDto.name, updatedRecipeDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.recipeService.remove(name);
  }
}
