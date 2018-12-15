import * as Joi from 'joi';
import * as dotenv from 'dotenv';

export interface EnvConfig {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const config = dotenv.config().parsed;
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision', 'staging'])
        .default('development'),
      DB_NAME: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      AMQP_HOST: Joi.string().required(),
      AMQP_USER: Joi.string().required(),
      AMQP_PASSWORD: Joi.string().required(),
      AMQP_PORT: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  getRabbitMQConfig() {
    if (process.env.NODE_ENV !== 'test') {
      const ampqHost = this.get('AMQP_HOST');
      const ampqUser = this.get('AMQP_USER');
      const ampqPort = this.get('AMQP_PORT');
      const ampqPassword = this.get('AMQP_PASSWORD');
      return `amqp://${ampqUser}:${ampqPassword}@${ampqHost}:${ampqPort}`;
    } else {
      return '';
    }
  }
}
