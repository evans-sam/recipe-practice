import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { EntityModule } from '../entity/entity.module';

@Module({
  imports: [EntityModule],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
