import { IsUrl, IsHexColor, ValidateIf, IsString } from 'class-validator';

export class UpdateBrandInfoDto {
  @IsUrl()
  @ValidateIf(dto => dto.logoURL !== '')
  logoURL: string;

  @IsUrl()
  @ValidateIf(dto => dto.privacyURL !== '')
  privacyURL: string;

  @IsUrl()
  @ValidateIf(dto => dto.termsURL !== '')
  termsURL: string;

  @IsUrl()
  @ValidateIf(dto => dto.helpURL !== '')
  helpURL: string;

  @IsUrl()
  @ValidateIf(dto => dto.faviconURL !== '')
  faviconURL: string;

  @IsHexColor()
  @ValidateIf(dto => dto.primaryColor !== '')
  primaryColor: string;

  @IsHexColor()
  @ValidateIf(dto => dto.accentColor !== '')
  accentColor: string;

  @IsHexColor()
  @ValidateIf(dto => dto.warnColor !== '')
  warnColor: string;

  @IsHexColor()
  @ValidateIf(dto => dto.backgroundColor !== '')
  backgroundColor: string;

  @IsHexColor()
  @ValidateIf(dto => dto.foregroundColor !== '')
  foregroundColor: string;

  @IsString()
  @ValidateIf(dto => dto.copyrightMessage !== '')
  copyrightMessage: string;
}
