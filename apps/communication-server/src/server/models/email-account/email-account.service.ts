import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { EmailAccount } from './email-account.entity';
import { DELETED } from '../../constants/messages';
import { CreateEmailDto } from '../../controllers/email/create-email-dto';

@Injectable()
export class EmailAccountService {
  constructor(
    @InjectRepository(EmailAccount)
    private readonly emailAccountRepository: MongoRepository<EmailAccount>,
  ) {}

  public async save(params: EmailAccount | CreateEmailDto) {
    const emailAccount = new EmailAccount();
    Object.assign(emailAccount, params);
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

  public async list(skip, take) {
    const emailAccount = await this.emailAccountRepository.find({ skip, take });
    return emailAccount;
  }

  public async find(params) {
    return await this.emailAccountRepository.find(params);
  }
}
