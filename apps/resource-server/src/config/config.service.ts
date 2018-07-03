import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

export interface EnvConfig {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;
  private readonly ormConfig: any;
  private readonly oauth2Client: any;

  constructor() {
    const config = dotenv.parse(
      fs.readFileSync(`env/${process.env.NODE_ENV}.env`),
    );
    this.envConfig = this.validateInput(config);

    this.ormConfig = this.getConfig('ormconfig');

    this.oauth2Client = this.getConfig('oauth2client');
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  getORMConfig() {
    return this.ormConfig;
  }

  getOAuth2Client() {
    return this.oauth2Client;
  }

  getConfig(configName) {
    return JSON.parse(
      fs.readFileSync(
        `src/config/${configName}/${configName}.${process.env.NODE_ENV}.json`,
        'utf-8',
      ),
    );
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
}
