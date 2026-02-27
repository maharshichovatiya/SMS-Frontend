export type Role = {
  id: string;
  roleName: string;
};

export type GetRoleResponse = {
  statusCode: number;
  message: string;
  data: Role[];
  Total_Records: number;
};
