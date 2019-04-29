import {
  Controller,
  UseGuards,
  Body,
  Post,
  Req,
  Query,
  Get,
  Res,
  Param,
  UsePipes,
  ValidationPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserService } from '../../entities/user/user.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';
import { RemoveUserAccountCommand } from '../../commands/remove-user-account/remove-user-account.command';
import { GenerateForgottenPasswordCommand } from '../../commands/generate-forgotten-password/generate-forgotten-password.command';
import {
  VerifyEmailDto,
  ChangePasswordDto,
  UserAccountDto,
} from '../../policies';
import { ChangePasswordCommand } from '../../commands/change-password/change-password.command';
import { VerifyEmailAndSetPasswordCommand } from '../../commands/verify-email-and-set-passsword/verify-email-and-set-password.command';
import { AddUserAccountCommand } from '../../commands/add-user-account/add-user-account.command';
import { ModifyUserAccountCommand } from '../../commands/modify-user-account/modify-user-account.command';
import { SendLoginOTPCommand } from '../../../auth/commands/send-login-otp/send-login-otp.command';
import {
  TogglePasswordLessLoginCommand,
  TogglePasswordLessLogin,
} from '../../commands/toggle-password-less-login/toggle-password-less-login.command';
import { Initialize2FACommand } from '../../commands/initialize-2fa/initialize-2fa.command';
import { Verify2FACommand } from '../../commands/verify-2fa/verify-2fa.command';
import { Disable2FACommand } from '../../commands/disable-2fa/disable-2fa.command';
import { ListSessionUsersQuery } from '../../queries/list-session-users/list-session-users.query';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly crudService: CRUDOperationService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('v1/change_password')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  @UsePipes(ValidationPipe)
  async updatePassword(@Req() req, @Body() passwordPayload: ChangePasswordDto) {
    const userUuid = req.user.user;
    return await this.commandBus.execute(
      new ChangePasswordCommand(userUuid, passwordPayload),
    );
  }

  @Post('v1/update_full_name')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async updateFullName(@Req() req, @Body('name') name, @Res() res) {
    const user = await this.userService.findOne({ uuid: req.user.user });
    user.name = name;
    await user.save();
    res.json(user);
  }

  @Post('v1/initialize_2fa')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async initialize2fa(@Req() req, @Query('restart') restart) {
    return await this.commandBus.execute(
      new Initialize2FACommand(req.user.user, restart || false),
    );
  }

  @Post('v1/verify_2fa')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async verify2fa(@Req() req, @Body('otp') otp: string) {
    return await this.commandBus.execute(
      new Verify2FACommand(req.user.user, otp),
    );
  }

  @Post('v1/disable_2fa')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async disable2fa(@Req() req) {
    return await this.commandBus.execute(new Disable2FACommand(req.user.user));
  }

  @Get('v1/get_user')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async getUser(@Req() req) {
    const actorUserUuid = req.user.user;
    return await this.userService.getAuthorizedUser(actorUserUuid);
  }

  @Post('v1/create')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async create(@Body() payload: UserAccountDto, @Req() req) {
    const createdBy = req.user.user;
    return await this.commandBus.execute(
      new AddUserAccountCommand(createdBy, payload),
    );
  }

  @Put('v1/update/:userUuidToBeModified')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async update(
    @Param('userUuidToBeModified') userUuidToBeModified,
    @Body() payload: UserAccountDto,
    @Req() req,
  ) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new ModifyUserAccountCommand(
        actorUserUuid,
        userUuidToBeModified,
        payload,
      ),
    );
  }

  @Delete('v1/delete/:userUuidToBeDeleted')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async deleteUser(
    @Param('userUuidToBeDeleted') userUuidToBeDeleted,
    @Req() req,
  ) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new RemoveUserAccountCommand(actorUserUuid, userUuidToBeDeleted),
    );
  }

  @Get('v1/list')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    const query = { deleted: { $eq: false } };
    const sortQuery = { name: sort || 'asc' };
    return this.crudService.listPaginate(
      this.userService.getModel(),
      offset,
      limit,
      search,
      query,
      ['name', 'phone', 'email'],
      sortQuery,
    );
  }

  @Get('v1/get/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    return await this.userService.getAuthorizedUser(uuid);
  }

  @Post('v1/forgot_password')
  async forgotPassword(@Body('emailOrPhone') emailOrPhone: string) {
    return await this.commandBus.execute(
      new GenerateForgottenPasswordCommand(emailOrPhone),
    );
  }

  @Post('v1/generate_password')
  @UsePipes(ValidationPipe)
  async verifyEmail(@Body() payload: VerifyEmailDto) {
    return await this.commandBus.execute(
      new VerifyEmailAndSetPasswordCommand(payload),
    );
  }

  @Post('v1/send_login_otp')
  async sendOTP(@Body('emailOrPhone') emailOrPhone) {
    const user = await this.userService.findUserByEmailOrPhone(emailOrPhone);
    await this.commandBus.execute(new SendLoginOTPCommand(user));
  }

  @Post('v1/enable_password_less_login')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async enablePasswordLess(@Req() req) {
    const actorUserUuid = req.user.user;
    await this.commandBus.execute(
      new TogglePasswordLessLoginCommand(
        actorUserUuid,
        TogglePasswordLessLogin.Enable,
      ),
    );
  }

  @Post('v1/disable_password_less_login')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async disablePasswordLess(@Req() req) {
    const actorUserUuid = req.user.user;
    await this.commandBus.execute(
      new TogglePasswordLessLoginCommand(
        actorUserUuid,
        TogglePasswordLessLogin.Disable,
      ),
    );
  }

  @Post('v1/delete_me')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async deleteMe(@Req() req) {
    const user = req.user.user;
    await this.commandBus.execute(new RemoveUserAccountCommand(user, user));
    req.logout();
  }

  @Get('v1/list_session_users')
  async listSessionUsers(@Req() req) {
    return await this.queryBus.execute(new ListSessionUsersQuery(req));
  }
}
