export const ROUTES = {
  signup: "signup",
  login: "login",
  forgotPassword: "forgot-password",
  patients: "patients",
  therapists: "therapists",
  addNewPatient: (therapistId: string, therapistName: string) =>
    `patients/new?therapistID=${therapistId}&therapistName=${therapistName}`,
  patient: (patientId: number) => `patients/${patientId}`,
};

export const NAVBAR_EXCLUDED_PATHS = [ROUTES.login, ROUTES.signup];

export const AUTH_PATHS = [ROUTES.login, ROUTES.signup, ROUTES.forgotPassword];
