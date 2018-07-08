import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

export interface EnvConfig {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;
  private readonly ormConfig: any;

  constructor() {
    const config = dotenv.parse(
      fs.readFileSync(`env/${process.env.NODE_ENV}.env`),
    );
    this.envConfig = this.validateInput(config);
    this.ormConfig = this.getConfig('ormconfig');
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      PORT: Joi.number().default(3000),
      SECRET_KEY: Joi.string().required(),
      SESSION_SECRET: Joi.string().required(),
      COOKIE_SECRET: Joi.string().required(),
      EXPIRE_DAYS: Joi.number().required(),
      TOKEN_VALIDITY: Joi.number().required(),
      IMPORT_FIXTURES: Joi.number().required(),
      ADMIN_PASSWORD: Joi.string().required(),
      CLIENT_SECRET: Joi.string().required(),
      CLIENT_REDIRECT_URI: Joi.string()
        .uri()
        .required(),
      COOKIE_MAX_AGE: Joi.number().required(),
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

  getORMConfig() {
    return this.ormConfig;
  }

  getConfig(configName) {
    return JSON.parse(
      fs.readFileSync(
        `src/server/config/${configName}/${configName}.${
          process.env.NODE_ENV
        }.json`,
        'utf-8',
      ),
    );
  }
}
