import { Injectable } from '@nestjs/common';
import { ScopeService } from '../../entities/scope/scope.service';
import { invalidScopeException } from '../../../common/filters/exceptions';
import { AllowedScopeDTO } from '../../entities/client/allowed-scopes.dto';

@Injectable()
export class OnlyAllowValidScopeService {
  constructor(private readonly scope: ScopeService) {}

  async validate(scope: string[] | AllowedScopeDTO[]) {
    for (const name of scope) {
      if (!(await this.scope.findOne({ name }))) {
        throw invalidScopeException;
      }
    }
  }
}
