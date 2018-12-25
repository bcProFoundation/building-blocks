import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/controllers/auth/auth.service';
import { CreateUserDto } from '../models/user/create-user.dto';
import * as yargs from 'yargs';

const app = NestFactory.create(AppModule);

// TODO use Interface for args
const args: any = createUserCLI();

app.then(r => {
  const authService = r.get(AuthService);
  const user: CreateUserDto = {
    name: args.name || 'Administartor',
    email: args.email,
    password: args.password,
    phone: args.phone,
  };
  authService.signUp(user).then(() => process.exit());
});

function createUserCLI() {
  return yargs
    .option('name', {
      alias: 'n',
      describe: 'full name of user',
    })
    .option('email', {
      alias: 'e',
      describe: 'valid email id for user',
    })
    .option('password', {
      alias: 'p',
      describe: 'password for user',
    })
    .option('phone', {
      alias: 'm',
      describe: 'phone number of user',
    })
    .demandOption(
      ['email', 'phone', 'password'],
      'Please provide email, phone and password arguments.',
    )
    .help().argv;
}
