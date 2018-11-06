// Thanks to https://github.com/cdiaz/nest-passport

import { pbkdf2Sync, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptographerService {
  private getHash(password, salt) {
    /**
     * Generate Hash using Password based key derivative function (PBKDF2)
     */
    return pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
  }

  public hashPassword(password) {
    /**
     * Salt is a pseudo-random data buffer contains raw bytes represented in hex
     */
    const salt = randomBytes(32).toString('hex');
    const hash = this.getHash(password, salt);
    /**
     * Return the salt + hash of the password
     */
    return [salt, hash].join('$');
  }

  public checkPassword(saltedPasswordHash, candidatePassword) {
    const originalHash = saltedPasswordHash.split('$')[1];
    const salt = saltedPasswordHash.split('$')[0];
    const hash = this.getHash(candidatePassword, salt);
    return hash === originalHash ? true : false;
  }

  /**
   * Return a unique identifier with the given `len`.
   *
   * @param {Number} length
   * @return {String}
   * @api private
   */
  public getUid(length: number) {
    let uid = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;

    for (let i = 0; i < length; ++i) {
      uid += chars[this.getRandomInt(0, charsLength - 1)];
    }

    return uid;
  }

  /**
   * Return a random int, used by `utils.getUid()`.
   *
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   * @api private
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
