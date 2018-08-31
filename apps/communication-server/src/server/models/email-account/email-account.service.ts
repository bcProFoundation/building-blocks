import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailAccount } from './email-account.entity';
import { DELETED } from '../../constants/messages';

@Injectable()
export class EmailAccountService {
  constructor(
    @InjectRepository(EmailAccount)
    private readonly emailAccountRepository: Repository<EmailAccount>,
  ) {}

  public async create(emailAccount) {
    return await this.emailAccountRepository.save(emailAccount);
  }

  async findAll(): Promise<EmailAccount[]> {
    return await this.emailAccountRepository.find();
  }

  public async findOne(params): Promise<any> {
    return await this.emailAccountRepository.findOne(params);
  }

  public async delete(params): Promise<any> {
    return await this.findOne(params).then(emailAccount =>
      emailAccount.remove().then(() => Promise.resolve({ message: DELETED })),
    );
  }
}
