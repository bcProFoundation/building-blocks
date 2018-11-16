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
import { UserService } from '../../../models/user/user.service';
import { CreateScopeDto } from '../../../models/user/create-scope.dto';

@Controller('scope')
export class ScopeController {
  constructor(
    private readonly scopeService: ScopeService,
    private readonly userService: UserService,
  ) {}

  @Get('v1/list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    await this.userService.checkAdministrator(req.user.user);
    return await this.scopeService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }

  @Get('v1/find')
  async find() {
    return this.scopeService.find({});
  }

  @Get('v1/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    await this.userService.checkAdministrator(req.user.user);
    return await this.scopeService.findOne({ uuid });
  }

  @Post('v1/update')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async update(@Body() payload, @Req() req, @Res() res) {
    await this.userService.checkAdministrator(req.user.user);
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
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async create(@Body() body: CreateScopeDto, @Req() req, @Res() res) {
    await this.userService.checkAdministrator(req.user.user);
    const scope = await this.scopeService.save(body);

    scope._id = undefined;
    res.json(scope);
  }
}
