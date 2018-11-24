import {
  Controller,
  UseGuards,
  Get,
  Query,
  Req,
  Param,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { ScopeService } from '../../../models/scope/scope.service';
import { callback } from '../../passport/local.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateScopeDto } from '../../../models/user/create-scope.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';

@Controller('scope')
export class ScopeController {
  constructor(private readonly scopeService: ScopeService) {}

  @Get('v1/list')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    return await this.scopeService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }

  @Get('v1/find')
  async find() {
    return this.scopeService.find({});
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async update(@Body() payload, @Req() req, @Res() res) {
    const scope = await this.scopeService.findOne({
      uuid: payload.uuid,
    });
    scope.name = payload.name;
    scope.description = payload.description;
    await scope.save();
    res.json(scope);
  }

  @Post('v1/create')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async create(@Body() body: CreateScopeDto, @Res() res) {
    const scope = await this.scopeService.save(body);

    scope._id = undefined;
    res.json(scope);
  }

  @Get('v1/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    return await this.scopeService.findOne({ uuid });
  }
}
