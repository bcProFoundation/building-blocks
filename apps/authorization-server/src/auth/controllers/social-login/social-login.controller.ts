import {
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Body,
  Req,
  Res,
  Param,
  Get,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { callback } from '../../passport/strategies/local.strategy';
import { CreateSocialLoginDto } from './social-login-create.dto';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { SocialLoginService } from '../../../auth/entities/social-login/social-login.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { RemoveSocialLoginCommand } from '../../../auth/commands/remove-social-login/remove-social-login.command';
import { AddSocialLoginCommand } from '../../commands/add-social-login/add-social-login.command';
import { ModifySocialLoginCommand } from '../../commands/modify-social-login/modify-social-login.command';
import { ListQueryDto } from '../../../common/policies/list-query/list-query';

@Controller('social_login')
export class SocialLoginController {
  constructor(
    private readonly socialLoginService: SocialLoginService,
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('v1/create')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() body: CreateSocialLoginDto, @Req() req) {
    const createdBy = req.user.user;
    return await this.commandBus.execute(
      new AddSocialLoginCommand(body, createdBy),
    );
  }

  @Post('v1/update/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async update(
    @Body() payload: CreateSocialLoginDto,
    @Param('uuid') uuid: string,
  ) {
    return await this.commandBus.execute(
      new ModifySocialLoginCommand(payload, uuid),
    );
  }

  @Get('v1/list')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async list(@Query() query: ListQueryDto) {
    const { offset, limit, search, sort } = query;
    const where: { createdBy?: string } = {};
    const sortQuery = { name: sort };
    return await this.socialLoginService.list(
      offset,
      limit,
      search,
      where,
      sortQuery,
    );
  }

  @Get('v1/get/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    let socialLogin;
    if (await this.userService.checkAdministrator(req.user.user)) {
      socialLogin = await this.socialLoginService.findOne({ uuid });
    } else {
      socialLogin = await this.socialLoginService.findOne({
        uuid,
        createdBy: req.user.user,
      });
    }
    if (!socialLogin) throw new ForbiddenException();
    return socialLogin;
  }

  @Post('v1/delete/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async deleteByUUID(@Param('uuid') uuid, @Req() req) {
    const userUuid = req.user.user;
    return await this.commandBus.execute(
      new RemoveSocialLoginCommand(userUuid, uuid),
    );
  }

  @Get('callback/:socialLogin')
  @UseGuards(AuthGuard('oauth2-client', { session: true }))
  oauth2Callback(@Req() req, @Res() res) {
    const parsedState = JSON.parse(
      Buffer.from(req.session.state, 'base64').toString(),
    );
    res.redirect(parsedState.redirect);
  }

  @Get('v1/list_logins')
  async listLogins() {
    const logins = await this.socialLoginService.getAllWithClientId();
    return logins.map(login => ({
      name: login.name,
      uuid: login.uuid,
    }));
  }
}
