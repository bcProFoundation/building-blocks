export interface IDTokenClaims {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  email?: string;
  email_verified?: boolean;
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
  at_hash?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  [key: string]: unknown | unknown[];
}

export interface JWK {
  iss?: string;
  kty?: string;
  alg?: string;
  n?: string;
  e?: string;
  kid?: string;
}
