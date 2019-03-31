import { Controller, Get, Res } from '@nestjs/common';
import { WellKnownService } from './well-known.service';

@Controller('.well-known')
export class WellKnownController {
  constructor(private readonly wellKnownService: WellKnownService) {}

  @Get('openid-configuration')
  async openidConfiguration(@Res() res) {
    const out = await this.wellKnownService.getOpenidConfiguration();
    res.json(out);
  }

  @Get('jwks')
  async jwks(@Res() res) {
    const out = await this.wellKnownService.getJWKs();
    res.json(out);
  }
}
