
import { getDatabase } from '@/lib/database';
import { DashboardStats } from '@/types';

export class DashboardService {
  private db = getDatabase();

  async getStats(): Promise<DashboardStats> {
    return this.db.getDashboardStats();
  }

  async getRe
MaterialRequests() {
    return this.db.getAllMaterialRequests().slice(0, 5); // Solo las 5 más recientes
  }
}

export const dashboardService = new DashboardService();
