import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

export interface EnvConfig {
  [prop: string]: string;
}

export const NODE_ENV = 'NODE_ENV';
export const SESSION_SECRET = 'SESSION_SECRET';
export const EXPIRY_DAYS = 'EXPIRY_DAYS';
export const COOKIE_MAX_AGE = 'COOKIE_MAX_AGE';
export const SESSION_NAME = 'SESSION_NAME';
export const TOKEN_VALIDITY = 'TOKEN_VALIDITY';
export const DB_NAME = 'DB_NAME';
export const DB_HOST = 'DB_HOST';
export const DB_USER = 'DB_USER';
export const DB_PASSWORD = 'DB_PASSWORD';
export const BULL_QUEUE_REDIS_HOST = 'BULL_QUEUE_REDIS_HOST';
export const BULL_QUEUE_REDIS_PORT = 'BULL_QUEUE_REDIS_PORT';
export const BULL_QUEUE_REDIS_PASSWORD = 'BULL_QUEUE_REDIS_PASSWORD';
export const ES_HOST = 'ES_HOST';
export const ES_USER = 'ES_USER';
export const ES_PASSWORD = 'ES_PASSWORD';
export const ES_STREAM = 'ES_STREAM';

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
      ES_HOST: Joi.string().optional(),
      ES_USER: Joi.string().optional(),
      ES_PASSWORD: Joi.string().optional(),
      ES_STREAM: Joi.string().optional(),
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

  getEventStoreConfig() {
    const hostname = this.get(ES_HOST);
    const username = this.get(ES_USER);
    const password = this.get(ES_PASSWORD);
    const stream = this.get(ES_STREAM);
    return { hostname, username, password, stream };
  }
}
