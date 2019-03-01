import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile/profile.service';
import { Profile } from './profile/profile.entity';
import { CommandBus } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileManagementEntitiesModule {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command: CommandBus,
  ) {}
  onModuleInit() {
    this.command.setModuleRef(this.moduleRef);
  }
}
