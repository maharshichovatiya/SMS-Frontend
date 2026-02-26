export type School = {
  id: string;
  name: string;
  address: string;
  affiliationBoard: string;
  establishmentYear: number;

  schoolCode: string | null;
  contact: string | null;
  emailOfficial: string | null;
  emailAdmin: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  schoolTimingStart: string | null;
  schoolTimingEnd: string | null;
  mediumOfInstruction: string | null;
  type: string | null;
};
