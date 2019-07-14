import { ICommand } from '@nestjs/cqrs';
import { UpdateBrandInfoDto } from '../../policies/update-brand-info/update-brand-info.dto';

export class UpdateBrandInfoCommand implements ICommand {
  constructor(
    public readonly req: { [key: string]: any },
    public readonly payload: UpdateBrandInfoDto,
  ) {}
}
