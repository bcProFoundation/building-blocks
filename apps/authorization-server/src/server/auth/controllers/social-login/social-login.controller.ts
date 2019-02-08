import {
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Body,
  Req,
  Res,
  Put,
  Param,
  UnauthorizedException,
  Get,
  Query,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { callback } from '../../passport/strategies/local.strategy';
import { CreateSocialLoginDto } from './social-login-create.dto';
import { INDEX_HTML } from '../../../constants/app-strings';
import { SocialLoginService } from '../../../auth/entities/social-login/social-login.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';

@Controller('social_login')
export class SocialLoginController {
  constructor(
    private readonly socialLoginService: SocialLoginService,
    private readonly userService: UserService,
    private readonly crudService: CRUDOperationService,
  ) {}

  @Get()
  root(@Res() res) {
    res.sendFile(INDEX_HTML);
  }

  @Post('v1/create')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateSocialLoginDto, @Req() req, @Res() res) {
    const payload: any = body;
    if (!(await this.userService.checkAdministrator(req.user.user))) {
      payload.isTrusted = 0;
    }
    payload.createdBy = req.user.user;
    payload.creation = new Date();
    const socialLogin = await this.socialLoginService.save(payload);
    res.json(socialLogin);
  }

  @Put('v1/update/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async update(
    @Body() payload: CreateSocialLoginDto,
    @Param('uuid') uuid: string,
    @Req() req,
  ) {
    const socialLogin = await this.socialLoginService.findOne({ uuid });
    if (
      (await this.userService.checkAdministrator(req.user.user)) ||
      socialLogin.createdBy === req.user.user
    ) {
      Object.assign(socialLogin, payload);
      socialLogin.modified = new Date();
      await socialLogin.save();
      return socialLogin;
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
      this.socialLoginService.getModel(),
      offset,
      limit,
      search,
      query,
      ['name', 'uuid'],
      sortQuery,
    );
  }

  @Get('v1/get/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
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

  @Delete('v1/delete/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async deleteByUUID(@Param('uuid') uuid, @Req() req) {
    const socialLogin = await this.socialLoginService.findOne({ uuid });
    if (
      (await this.userService.checkAdministrator(req.user.user)) ||
      socialLogin.createdBy === req.user.user
    ) {
      return await this.socialLoginService.deleteOne({ uuid });
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get('callback/:socialLogin')
  @UseGuards(AuthGuard('oauth2-client', { session: true }))
  oauth2Callback(
    @Param('socialLogin') socialLogin,
    @Query('redirect') redirect,
    @Req() req,
    @Res() res,
  ) {
    const parsedState = JSON.parse(
      Buffer.from(req.session.state, 'base64').toString(),
    );
    const out: any = { user: req.user.email };
    out.path = parsedState.redirect;
    res.redirect(out.path);
  }

  @Get('v1/list_logins')
  async listLogins() {
    const logins = await this.socialLoginService
      .getModel()
      .where('clientId')
      .ne(null);
    return logins.map(login => ({
      name: login.name,
      uuid: login.uuid,
    }));
  }

  @Get('*')
  wildcard(@Res() res) {
    res.sendFile(INDEX_HTML);
  }
}
