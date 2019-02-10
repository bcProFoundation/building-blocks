import { Module } from '@nestjs/common';
import { TokenCacheService } from './token-cache/token-cache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenCache } from './token-cache/token-cache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenCache])],
  providers: [TokenCacheService],
  exports: [TokenCacheService],
})
export class AuthEntitiesModule {}
