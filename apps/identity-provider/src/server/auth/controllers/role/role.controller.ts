import { Controller, UseGuards, Body, Post, Get, Delete, Patch } from '@nestjs/common';
import { callback } from '../../passport/local.strategy';
import { Roles } from '../../guards/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

@Controller('role')
@UseGuards(
  AuthGuard('bearer', { session: false, callback }),
  RolesGuard,
)
export class RoleController {
  @Post('create')
  create(@Body() body) {}

  @Get('read')
  @Roles('admin')
  read(@Body() payload) {}

  @Patch('update')
  update(@Body() payload) {}

  @Delete('delete')
  delete(@Body() payload) {}

  // add role to a user (only admins)
  @Post('add/user')
  addUser() {}
}
