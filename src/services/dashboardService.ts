
import { dashboardOperations } from '@/lib/database';
import { DashboardStats } from '@/types';

export const dashboardService = {
  // Get dashboard statistics based on user role
  getDashboardStats: async (userRole: string): Promise<DashboardStats> => {
    return dashboardOperations.getDashboardStats(userRole);
  },

  // Get recent material requests
  getRecentRequests: async () => {
    return dashboardOperations.getRecentRequests();
  }
};
