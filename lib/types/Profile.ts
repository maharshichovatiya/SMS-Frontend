export interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  school: string;
}

export interface ProfileResponse {
  statusCode: number;
  message: string;
  data: ProfileData;
}
