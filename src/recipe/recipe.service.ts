import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { EntityService } from '../entity/entity.service';

const tableName = 'recipes';
@Injectable()
export class RecipeService {
  constructor(private readonly entityService: EntityService) {}

  async create(createRecipeDto: CreateRecipeDto) {
    return await this.entityService.create({ tableName, row: createRecipeDto });
  }

  async findAll() {
    return this.entityService.findAll('recipes');
  }

  async findOne(name: string) {
    return await this.entityService.findByName({ tableName, name });
  }

  async update(name: string, updateRecipeDto: UpdateRecipeDto) {
    return await this.entityService.update({
      tableName,
      newRow: {
        ...updateRecipeDto,
        name,
      },
    });
  }

  async remove(name: string) {
    return await this.entityService.remove({ tableName, name });
  }
}
