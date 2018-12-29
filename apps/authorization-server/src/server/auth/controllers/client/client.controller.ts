import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Query,
  Param,
  Req,
  Res,
  ForbiddenException,
  SerializeOptions,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  Delete,
  Put,
} from '@nestjs/common';
import { ClientService } from '../../../models/client/client.service';
import { callback } from '../../passport/local.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateClientDto } from '../../../models/client/create-client.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { UserService } from '../../../models/user/user.service';
import { CRUDOperationService } from '../common/crudoperation/crudoperation.service';
import { randomBytes32 } from '../../../models/client/client.schema';

@Controller('client')
@SerializeOptions({ excludePrefixes: ['_'] })
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly crudService: CRUDOperationService,
  ) {}

  @Post('v1/create')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateClientDto, @Req() req, @Res() res) {
    const payload: any = body;
    if (!(await this.userService.checkAdministrator(req.user.user))) {
      payload.isTrusted = 0;
    }
    payload.createdBy = req.user.user;
    payload.creation = new Date();
    const client = await this.clientService.save(payload);
    res.json(client);
  }

  @Put('v1/update/:clientId')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async update(
    @Body() payload: CreateClientDto,
    @Param('clientId') clientId: string,
    @Req() req,
  ) {
    const client = await this.clientService.findOne({ clientId });
    if (
      (await this.userService.checkAdministrator(req.user.user)) ||
      client.createdBy === req.user.user
    ) {
      Object.assign(client, payload);
      await client.save();
      return client;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Put('v1/update_secret/:clientId')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async updateSecret(@Param('clientId') clientId: string, @Req() req) {
    const client = await this.clientService.findOne({ clientId });
    if (
      (await this.userService.checkAdministrator(req.user.user)) ||
      client.createdBy === req.user.user
    ) {
      client.clientSecret = randomBytes32();
      await client.save();
      return client;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get('v1/list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    const query: { createdBy?: string } = {};

    if (!(await this.userService.checkAdministrator(req.user.user))) {
      query.createdBy = req.user.user;
    }

    const sortQuery = { name: sort };
    return this.crudService.listPaginate(
      this.clientService.getModel(),
      offset,
      limit,
      search,
      query,
      ['name', 'clientId'],
      sortQuery,
    );
  }

  @Get('v1/trusted_clients')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findAllTrustedClients(@Req() req) {
    return await this.clientService.find({ isTrusted: 1 });
  }

  @Get('v1/get/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    let client;
    if (await this.userService.checkAdministrator(req.user.user)) {
      client = await this.clientService.findOne({ uuid });
    } else {
      client = await this.clientService.findOne({
        uuid,
        createdBy: req.user.user,
      });
    }
    if (!client) throw new ForbiddenException();
    return client;
  }

  @Delete('v1/delete/:clientId')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async deleteByUUID(@Param('clientId') clientId, @Req() req) {
    const client = await this.clientService.findOne({ clientId });
    if (
      (await this.userService.checkAdministrator(req.user.user)) ||
      client.createdBy === req.user.user
    ) {
      return await this.clientService.deleteByClientId(clientId);
    } else {
      throw new UnauthorizedException();
    }
  }
}
