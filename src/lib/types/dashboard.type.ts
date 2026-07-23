export type AdminDashboardStats = {
  totalClientCompanies: number;
  activeEmployees: number;
  totalModules: number;
};

export type CompanyBreakdown = {
  companyId: string;
  company: string;
  activeUsers: number;
  modulesBuilt: number;
  platformStatus: string;
};

export type AdminDashboardData = {
  stats: AdminDashboardStats;
  companyBreakdown: CompanyBreakdown[];
};
