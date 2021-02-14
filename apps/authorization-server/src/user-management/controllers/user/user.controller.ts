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
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { RemoveUserAccountCommand } from '../../commands/remove-user-account/remove-user-account.command';
import { GenerateForgottenPasswordCommand } from '../../commands/generate-forgotten-password/generate-forgotten-password.command';
import {
  VerifyEmailDto,
  ChangePasswordDto,
  UserAccountDto,
  VerifyPhoneDto,
  VerifySignupViaPhoneDto,
  UnverifiedPhoneDto,
  UnverifiedEmailDto,
  VerifyUpdatedEmailDto,
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
import { VerifyPhoneCommand } from '../../../auth/commands/verify-phone/verify-phone.command';
import { BearerTokenGuard } from '../../../auth/guards/bearer-token.guard';
import { AddUnverifiedEmailCommand } from '../../../auth/commands/add-unverified-email/add-unverified-phone.command';
import { VerifyEmailCommand } from '../../../auth/commands/verify-email/verify-email.command';
import { EmailVerificationCodeCommand } from '../../commands/email-verification-code/email-verification-code.command';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('v1/change_password')
  @UseGuards(BearerTokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePassword(@Req() req, @Body() passwordPayload: ChangePasswordDto) {
    const userUuid = req.user.user;
    return await this.commandBus.execute(
      new ChangePasswordCommand(userUuid, passwordPayload),
    );
  }

  @Post('v1/update_full_name')
  @UseGuards(BearerTokenGuard)
  async updateFullName(@Req() req, @Body('name') name) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new UpdateUserFullNameCommand(actorUserUuid, name),
    );
  }

  @Post('v1/initialize_2fa')
  @UseGuards(BearerTokenGuard)
  async initialize2fa(@Req() req, @Query('restart') restart) {
    return await this.commandBus.execute(
      new Initialize2FACommand(req.user.user, restart || false),
    );
  }

  @Post('v1/verify_2fa')
  @UseGuards(BearerTokenGuard)
  async verify2fa(@Req() req, @Body('otp') otp: string) {
    return await this.commandBus.execute(
      new Verify2FACommand(req.user.user, otp),
    );
  }

  @Post('v1/disable_2fa')
  @UseGuards(BearerTokenGuard)
  async disable2fa(@Req() req) {
    return await this.commandBus.execute(new Disable2FACommand(req.user.user));
  }

  @Get('v1/get_user')
  @UseGuards(BearerTokenGuard)
  async getUser(@Req() req) {
    const actorUserUuid = req.user.user;
    return await this.userService.getAuthorizedUser(actorUserUuid);
  }

  @Post('v1/create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async create(@Body() payload: UserAccountDto, @Req() req) {
    const createdBy = req.user.user;
    return await this.commandBus.execute(
      new AddUserAccountCommand(createdBy, payload),
    );
  }

  @Post('v1/update/:userUuidToBeModified')
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
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
  @UseGuards(BearerTokenGuard, RoleGuard)
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
  @UseGuards(BearerTokenGuard, RoleGuard)
  async list(@Query() query: ListQueryDto) {
    const { offset, limit, search, sort } = query;
    const where = { deleted: { $eq: false } };
    const sortQuery = { name: sort || 'asc' };
    return await this.userService.list(offset, limit, search, where, sortQuery);
  }

  @Get('v1/get/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
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
  async verifyEmailAndGeneratePassword(@Body() payload: VerifyEmailDto) {
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
  @UseGuards(BearerTokenGuard)
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
  @UseGuards(BearerTokenGuard)
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
  @UseGuards(BearerTokenGuard)
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
  @UseGuards(BearerTokenGuard)
  async addUnverifiedPhone(@Body() payload: UnverifiedPhoneDto, @Req() req) {
    const userUuid = req.user.user;
    const { unverifiedPhone } = payload;
    return await this.commandBus.execute(
      new AddUnverifiedMobileCommand(userUuid, unverifiedPhone),
    );
  }

  @Post('v1/add_unverified_email')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @UseGuards(BearerTokenGuard)
  async addUnverifiedEmail(@Body() payload: UnverifiedEmailDto, @Req() req) {
    const userUuid = req.user.user;
    const { unverifiedEmail } = payload;
    return await this.commandBus.execute(
      new AddUnverifiedEmailCommand(userUuid, unverifiedEmail),
    );
  }

  @Post('v1/verify_email')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async verifyEmail(@Body() payload: VerifyUpdatedEmailDto) {
    const { verificationCode } = payload;
    return await this.commandBus.execute(
      new VerifyEmailCommand(verificationCode),
    );
  }

  @Post('v1/verify_phone')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @UseGuards(BearerTokenGuard)
  async verifyPhone(@Body() payload: VerifyPhoneDto, @Req() req) {
    const userUuid = req.user.user;
    const { otp } = payload;
    return await this.commandBus.execute(new VerifyPhoneCommand(userUuid, otp));
  }

  @Post('v1/verify_phone_signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async verifySignupByPhone(
    @Body() payload: VerifySignupViaPhoneDto,
    @Req() request,
  ) {
    const user = await this.userService.findOne({
      unverifiedPhone: payload.unverifiedPhone,
    });
    return await this.commandBus.execute(
      new VerifyPhoneCommand(user?.uuid, payload.otp, request),
    );
  }

  @Post('v1/email_verification_code')
  @UseGuards(BearerTokenGuard)
  async emailVerificationCode(@Req() req) {
    const userUuid = req?.user?.user;
    return await this.commandBus.execute(
      new EmailVerificationCodeCommand(userUuid),
    );
  }
}
