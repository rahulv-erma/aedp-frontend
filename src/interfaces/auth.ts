export interface SignupData {
  data: {
    email: string;
    first_name: string;
    last_name: string;
    auth_token: string;
  };
}

export interface LoginData extends SignupData {}
