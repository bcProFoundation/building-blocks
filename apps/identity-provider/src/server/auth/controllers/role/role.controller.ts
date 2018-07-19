import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Delete,
  Patch,
  Res,
} from '@nestjs/common';
import { callback } from '../../passport/http-bearer.strategy';
import { Roles } from '../../guards/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';

@Controller('role')
export class RoleController {
  @Post('create')
  create(@Body() body) {}

  @Get('read-bearer')
  @Roles('admin')
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RolesGuard)
  readBearer(@Body() payload, @Res() res) {
    res.json({ bearer: 'Yas!' });
  }

  @Get('read-session')
  @Roles('admin')
  @UseGuards(EnsureLoginGuard, RolesGuard)
  readSession(@Body() payload, @Res() res) {
    res.json({ session: 'Yas!' });
  }

  @Patch('update')
  update(@Body() payload) {}

  @Delete('delete')
  delete(@Body() payload) {}

  // add role to a user (only admins)
  @Post('add/user')
  addUser() {}
}
