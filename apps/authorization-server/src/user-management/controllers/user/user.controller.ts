import {
  Controller,
  UseGuards,
  Body,
  Post,
  Req,
  Query,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserService } from '../../entities/user/user.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { RemoveUserAccountCommand } from '../../commands/remove-user-account/remove-user-account.command';
import { GenerateForgottenPasswordCommand } from '../../commands/generate-forgotten-password/generate-forgotten-password.command';
import {
  VerifyEmailDto,
  ChangePasswordDto,
  UserAccountDto,
} from '../../policies';
import { ChangePasswordCommand } from '../../commands/change-password/change-password.command';
import { VerifyEmailAndSetPasswordCommand } from '../../commands/verify-email-and-set-password/verify-email-and-set-password.command';
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
import { UpdateUserFullNameCommand } from '../../commands/update-user-full-name/update-user-full-name.command';
import { ListQueryDto } from '../../../common/policies/list-query/list-query';
import { AddUnverifiedMobileCommand } from '../../../auth/commands/add-unverified-phone/add-unverified-phone.command';
import { UnverifiedPhoneDto } from '../../policies/unverified-phone/unverified-phone.dto';
import { VerifyPhoneDto } from '../../policies/verify-phone/verify-phone.dto';
import { VerifyPhoneCommand } from '../../../auth/commands/verify-phone/verify-phone.command';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('v1/change_password')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePassword(@Req() req, @Body() passwordPayload: ChangePasswordDto) {
    const userUuid = req.user.user;
    return await this.commandBus.execute(
      new ChangePasswordCommand(userUuid, passwordPayload),
    );
  }

  @Post('v1/update_full_name')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async updateFullName(@Req() req, @Body('name') name) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new UpdateUserFullNameCommand(actorUserUuid, name),
    );
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
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async create(@Body() payload: UserAccountDto, @Req() req) {
    const createdBy = req.user.user;
    return await this.commandBus.execute(
      new AddUserAccountCommand(createdBy, payload),
    );
  }

  @Post('v1/update/:userUuidToBeModified')
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

  @Post('v1/delete/:userUuidToBeDeleted')
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
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async list(@Query() query: ListQueryDto) {
    const { offset, limit, search, sort } = query;
    const where = { deleted: { $eq: false } };
    const sortQuery = { name: sort || 'asc' };
    return await this.userService.list(offset, limit, search, where, sortQuery);
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
  @UsePipes(new ValidationPipe({ whitelist: true }))
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
  async enablePasswordLess(@Req() req, @Body('userUuid') userUuid) {
    const actorUserUuid = req.user.user;
    await this.commandBus.execute(
      new TogglePasswordLessLoginCommand(
        actorUserUuid,
        userUuid,
        TogglePasswordLessLogin.Enable,
      ),
    );
  }

  @Post('v1/disable_password_less_login')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async disablePasswordLess(@Req() req, @Body('userUuid') userUuid) {
    const actorUserUuid = req.user.user;
    await this.commandBus.execute(
      new TogglePasswordLessLoginCommand(
        actorUserUuid,
        userUuid,
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

  @Post('v1/add_unverified_phone')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async addUnverifiedPhone(@Body() payload: UnverifiedPhoneDto, @Req() req) {
    const userUuid = req.user.user;
    const { unverifiedPhone } = payload;
    return await this.commandBus.execute(
      new AddUnverifiedMobileCommand(userUuid, unverifiedPhone),
    );
  }

  @Post('v1/verify_phone')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async verifyPhone(@Body() payload: VerifyPhoneDto, @Req() req) {
    const userUuid = req.user.user;
    const { otp } = payload;
    return await this.commandBus.execute(new VerifyPhoneCommand(userUuid, otp));
  }
}
