import { Module } from '@nestjs/common';
import {
  AllPopulationController,
  FlagController,
  PopulationController,
  ContinentColorController
} from './population/population.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'flag'),
      serveRoot: '/flags',
    }),
  ],
  controllers: [
    AllPopulationController,
    PopulationController,
    ContinentColorController,
    FlagController
  ],
  providers: [],
})
export class AppModule { }
