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
import { SocialLoginService } from '../../../models/social-login/social-login.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { UserService } from '../../../models/user/user.service';
import { callback } from '../../../auth/passport/local.strategy';
import { CRUDOperationService } from '../common/crudoperation/crudoperation.service';
import { CreateSocialLoginDto } from './social-login-create.dto';

@Controller('social_login')
export class SocialLoginController {
  constructor(
    private readonly socialLoginService: SocialLoginService,
    private readonly userService: UserService,
    private readonly crudService: CRUDOperationService,
  ) {}

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
}
