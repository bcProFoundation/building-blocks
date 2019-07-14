import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { RetrieveBrandInfoQuery } from '../../queries/retrieve-brand-info/retrieve-brand-info.query';
import { UpdateBrandInfoDto } from '../../policies/update-brand-info/update-brand-info.dto';
import { UpdateBrandInfoCommand } from '../../commands/update-brand-info/update-brand-info.command';

@Controller('brand')
export class BrandController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('v1/retrieve_info')
  async retrieveBrandInfo() {
    return await this.queryBus.execute(new RetrieveBrandInfoQuery());
  }

  @Post('v1/update_info')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateBrandInfo(@Req() req, @Body() payload: UpdateBrandInfoDto) {
    return await this.commandBus.execute(
      new UpdateBrandInfoCommand(req, payload),
    );
  }
}
