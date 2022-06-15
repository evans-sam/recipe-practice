import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { EntityService } from '../entity/entity.service';

@Injectable()
export class RecipeService {
  constructor(private readonly entityService: EntityService) {}

  async create(createRecipeDto: CreateRecipeDto) {
    return 'This action adds a new recipe';
  }

  async findAll() {
    return this.entityService.findAll('recipes');
  }

  async findOne(name: string) {
    return `This action returns a #${name} recipe`;
  }

  async update(name: string, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${name} recipe`;
  }

  async remove(name: string) {
    return `This action removes a #${name} recipe`;
  }
}
