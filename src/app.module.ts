import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipeModule } from './recipe/recipe.module';
import { EntityModule } from './entity/entity.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [RecipeModule, EntityModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
