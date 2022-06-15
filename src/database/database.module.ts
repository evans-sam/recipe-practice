import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RecipeModule } from '../recipe/recipe.module';

@Module({
  imports: [RecipeModule],
  providers: [DatabaseService],
})
export class DatabaseModule {}
