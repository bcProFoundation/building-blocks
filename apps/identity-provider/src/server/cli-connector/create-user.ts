import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { AuthService } from 'auth/controllers/auth/auth.service';
import { CreateUserDto } from 'models/user/create-user.dto';
import { createUserCLI } from 'nestjs-console-connector';

const app = NestFactory.create(AppModule);
const args = createUserCLI();
app.then(r => {
    const authService = r.get(AuthService);
    const user: CreateUserDto = {
      name: args.name || 'Administartor',
      email: args.email,
      password: args.password,
    };
    authService.signUp(user).then(() => process.exit());
});
