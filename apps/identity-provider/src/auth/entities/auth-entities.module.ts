import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenCache } from './token-cache/token-cache.entity';
import { TokenCacheService } from './token-cache/token-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([TokenCache])],
  providers: [TokenCacheService],
  exports: [TokenCacheService],
})
export class AuthEntitiesModule {}
