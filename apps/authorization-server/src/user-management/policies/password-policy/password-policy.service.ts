import { Injectable } from '@nestjs/common';
import * as owasp from 'owasp-password-strength-test';

@Injectable()
export class PasswordPolicyService {
  validatePassword(password: string) {
    return owasp.test(password);
  }
}
