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
      SESSION_SECRET: Joi.string().required(),
      EXPIRY_DAYS: Joi.number().required(),
      COOKIE_MAX_AGE: Joi.number().required(),
      SESSION_NAME: Joi.string().required(),
      TOKEN_VALIDITY: Joi.string().required(),
      DB_NAME: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_USER: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      BULL_QUEUE_REDIS_HOST: Joi.string().required(),
      BULL_QUEUE_REDIS_PORT: Joi.number().required(),
      BULL_QUEUE_REDIS_PASSWORD: Joi.string().required(),
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
    switch (key) {
      case 'DB_NAME':
        return process.env.NODE_ENV === 'test-e2e'
          ? `test_${this.envConfig[key]}`
          : this.envConfig[key];
      default:
        return this.envConfig[key];
    }
  }
}
