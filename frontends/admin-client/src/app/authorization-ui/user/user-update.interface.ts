export interface UserUpdate {
  uuid?: string;
  roles?: string[] | any;
  name?: string;
  password?: string;
  disabled?: boolean;
}
