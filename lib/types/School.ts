export interface SchoolData {
  id: string;
  name: string;
  address: string | null;
  affiliationBoard: string | null;
  establishmentYear: number | null;
  schoolCode: string | null;
  contact: string | null;
  emailOfficial: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  schoolTimingStart: string | null;
  schoolTimingEnd: string | null;
  mediumOfInstruction: string | null;
}

export interface SchoolResponse {
  statusCode: number;
  message: string;
  data: SchoolData;
}
