import Joi from 'joi';
import dotenv from 'dotenv';
import { Injectable, Logger } from '@nestjs/common';

export interface EnvConfig {
  [prop: string]: string;
}

export const NODE_ENV = 'NODE_ENV';
export const SESSION_SECRET = 'SESSION_SECRET';
export const COOKIE_MAX_AGE = 'COOKIE_MAX_AGE';
export const SESSION_NAME = 'SESSION_NAME';
export const TOKEN_VALIDITY = 'TOKEN_VALIDITY';
export const DB_NAME = 'DB_NAME';
export const DB_HOST = 'DB_HOST';
export const DB_USER = 'DB_USER';
export const DB_PASSWORD = 'DB_PASSWORD';
export const EVENTS_PROTO = 'EVENTS_PROTO';
export const EVENTS_HOST = 'EVENTS_HOST';
export const EVENTS_PORT = 'EVENTS_PORT';
export const EVENTS_USER = 'EVENTS_USER';
export const EVENTS_PASSWORD = 'EVENTS_PASSWORD';
export const MONGO_URI_PREFIX = 'MONGO_URI_PREFIX';

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
      [NODE_ENV]: Joi.string()
        .valid('development', 'production', 'test', 'provision', 'staging')
        .default('development'),
      [SESSION_SECRET]: Joi.string().required(),
      [COOKIE_MAX_AGE]: Joi.number().required(),
      [SESSION_NAME]: Joi.string().required(),
      [TOKEN_VALIDITY]: Joi.string().required(),
      [DB_NAME]: Joi.string().required(),
      [DB_HOST]: Joi.string().required(),
      [DB_USER]: Joi.string().required(),
      [DB_PASSWORD]: Joi.string().required(),
      [EVENTS_PROTO]: Joi.string().required(),
      [EVENTS_USER]: Joi.string().required(),
      [EVENTS_PASSWORD]: Joi.string().required(),
      [EVENTS_HOST]: Joi.string().required(),
      [EVENTS_PORT]: Joi.string().required(),
      [MONGO_URI_PREFIX]: Joi.string().optional(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      Logger.error(error, error.stack, this.constructor.name);
      process.exit(1);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    switch (key) {
      case DB_NAME:
        return process.env.NODE_ENV === 'test-e2e'
          ? `test_${this.envConfig[key]}`
          : this.envConfig[key];
      default:
        return this.envConfig[key];
    }
  }
}
