import * as fs from 'fs';

export class ConfigService {
  getConfig(configName) {
    return JSON.parse(
      fs.readFileSync(
        `config/${configName}/${process.env.NODE_ENV}.json`,
        'utf-8',
      ),
    );
  }
}
