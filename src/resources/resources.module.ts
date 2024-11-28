import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { Resource } from './entities/resource.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resource, User])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
