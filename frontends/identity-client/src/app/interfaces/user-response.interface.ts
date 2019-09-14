export interface UserResponse {
  disabled?: boolean;
  email?: string;
  enable2fa?: boolean;
  name?: string;
  otpPeriod?: number;
  phone?: string;
  roles?: string[];
  uuid?: string;
  isPasswordSet?: boolean;
  enablePasswordLess: boolean;
}
