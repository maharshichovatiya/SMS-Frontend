export interface ProfileData {
  id?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
}
export interface ProfileResponse {
  statusCode: number;
  message: string;
  data: ProfileData;
}
