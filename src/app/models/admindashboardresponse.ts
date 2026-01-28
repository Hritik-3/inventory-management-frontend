export interface AdminDashboardResponse {
  users: {
    userId: string;
    fullName: string;
    email: string;
    mobile: string;
    roleName: string;
    accountStatus: string;
    lastLoginAt: string;
  }[];

  roleStats: {
    roleName: string;
    count: number;
  }[];

  accountStatusStats: {
    accountStatus: string;
    count: number;
  }[];
}
