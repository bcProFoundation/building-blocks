import { Injectable } from '@nestjs/common';
import { ScopeService } from '../../entities/scope/scope.service';
import { invalidScopeException } from '../../../common/filters/exceptions';

@Injectable()
export class OnlyAllowValidScopeService {
  constructor(private readonly scope: ScopeService) {}

  async validate(scope: string[]) {
    for (const name of scope) {
      if (!(await this.scope.findOne({ name }))) {
        throw invalidScopeException;
      }
    }
  }
}
