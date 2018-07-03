import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { callback } from '../../../auth/passport/local.strategy';
import { Roles } from '../../guards/roles.decorator';
import { AuthGuard } from 'nestjs-auth-guard';

@Controller('role')
@Roles('admin')
@UseGuards(AuthGuard('bearer', { session: false, callback }))
export class RoleController {
  @Post('create')
  create(@Body() body) {}

  @Post('read')
  read(@Body() payload) {}

  @Post('update')
  update(@Body() payload) {}

  @Post('delete')
  delete(@Body() payload) {}

  // add role to a user (only admins)
  @Post('add/user')
  addUser() {}
}
