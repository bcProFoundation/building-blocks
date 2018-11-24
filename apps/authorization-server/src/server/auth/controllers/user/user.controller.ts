import {
  Controller,
  UseGuards,
  Body,
  Post,
  Req,
  Query,
  Get,
  Res,
  UnauthorizedException,
  Param,
  UsePipes,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { UserService } from '../../../models/user/user.service';
import { AuthGuard } from '../../guards/auth.guard';
import { callback } from '../../passport/local.strategy';
import { CreateUserDto } from '../../../models/user/create-user.dto';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { i18n } from '../../../i18n/i18n.config';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptographerService,
    private readonly authDataService: AuthDataService,
  ) {}

  @Post('v1/change_password')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async updatePassword(@Req() req, @Body() body, @Res() res) {
    const authData = await this.userService.getUserSaltedHashPassword(
      req.user.user,
    );
    const validPassword = this.cryptoService.checkPassword(
      authData.password,
      body.currentPassword,
    );
    if (validPassword) {
      authData.password = this.cryptoService.hashPassword(body.newPassword);
      await authData.save();
      res.json({ message: 'updated' });
    } else throw new UnauthorizedException(i18n.__('Invalid Password'));
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
    return await this.userService.initializeMfa(
      req.user.user,
      restart || false,
    );
  }

  @Post('v1/verify_2fa')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async verify2fa(@Req() req, @Body('otp') otp: string) {
    return await this.userService.verify2fa(req.user.user, otp);
  }

  @Post('v1/disable_2fa')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async disable2fa(@Req() req) {
    return await this.userService.disable2fa(req.user.user);
  }

  @Get('v1/get_user')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async getUser(@Req() req, @Res() res) {
    const user = await this.userService.findOne({ uuid: req.user.user });
    res.json(user);
  }

  @Post('v1/create')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async create(@Body() body: CreateUserDto, @Req() req, @Res() res) {
    const user = await this.userService.save(body);

    // create Password
    const authData = new (this.authDataService.getModel())();
    authData.password = this.cryptoService.hashPassword(body.password);
    await authData.save();

    // link password with user
    user.password = authData.uuid;
    user.createdBy = req.user.user;
    user.creation = new Date();
    await user.save();

    // delete mongodb _id
    user._id = undefined;
    res.json(user);
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async update(@Body() payload, @Req() req, @Res() res) {
    const user = await this.userService.findOne({
      uuid: payload.uuid,
    });
    user.name = payload.name;
    user.roles = payload.roles;

    // Set password if exists
    if (payload.password) {
      const authData = await this.authDataService.findOne({
        uuid: user.password,
      });
      authData.password = this.cryptoService.hashPassword(payload.password);
      await authData.save();
    }

    user.modifiedBy = req.user.user;
    user.modified = new Date();
    await user.save();
    user._id, (user.password = undefined);
    res.json(user);
  }

  @Get('v1/list')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    return await this.userService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }

  @Get('v1/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async findOne(@Param('uuid') uuid: number, @Req() req) {
    let user;
    if (await this.userService.checkAdministrator(req.user.user)) {
      user = await this.userService.findOne({ uuid });
    } else {
      user = await this.userService.findOne({ uuid, createdBy: req.user.user });
    }
    if (!user) throw new ForbiddenException();
    return user;
  }
}
