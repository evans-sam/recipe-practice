import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { DatabaseModule } from '../database/database.module';
import { RecipeModule } from '../recipe/recipe.module';

@Module({
  imports: [DatabaseModule, RecipeModule],
  providers: [EntityService],
})
export class EntityModule {}
