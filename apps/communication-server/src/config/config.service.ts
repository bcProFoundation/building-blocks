import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

export interface EnvConfig {
  [prop: string]: string;
}

export const NODE_ENV = 'NODE_ENV';
export const DB_NAME = 'DB_NAME';
export const DB_HOST = 'DB_HOST';
export const DB_USER = 'DB_USER';
export const DB_PASSWORD = 'DB_PASSWORD';
export const ES_HOST = 'ES_HOST';
export const ES_USER = 'ES_USER';
export const ES_PASSWORD = 'ES_PASSWORD';
export const ES_STREAM = 'ES_STREAM';
export const MONGO_URI_PREFIX = 'MONGO_URI_PREFIX';
export const BROADCAST_HOST = 'BROADCAST_HOST';
export const BROADCAST_PORT = 'BROADCAST_PORT';

@Injectable()
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
        .valid('development', 'production', 'test', 'provision', 'staging')
        .default('development'),
      DB_NAME: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_USER: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      MONGO_URI_PREFIX: Joi.string().optional(),
      ES_HOST: Joi.string().optional(),
      ES_USER: Joi.string().optional(),
      ES_PASSWORD: Joi.string().optional(),
      ES_STREAM: Joi.string().optional(),
      BROADCAST_HOST: Joi.string().optional(),
      BROADCAST_PORT: Joi.string().optional(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  getEventStoreConfig() {
    const hostname = this.get(ES_HOST);
    const username = this.get(ES_USER);
    const password = this.get(ES_PASSWORD);
    const stream = this.get(ES_STREAM);
    return { hostname, username, password, stream };
  }
}
