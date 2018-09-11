export interface IDTokenClaims {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  email?: string;
  verified_email?: string;
  name?: string;
  family_name?: string;
  given_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  updated_at?: Date;
  roles?: string[];
  nonce?: string;
}

export interface JWK {
  iss?: string;
  kty?: string;
  alg?: string;
  n?: string;
  e?: string;
  kid?: string;
}
