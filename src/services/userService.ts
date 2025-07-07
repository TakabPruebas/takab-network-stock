
import { getDatabase } from '@/lib/database';
import { User, UserRole } from '@/types';

export class UserService {
  private db = getDatabase();

  async login(username: string, password: string): Promise<User | null> {
    return this.db.getUserByCredentials(username, password);
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.getAllUsers();
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): Promise<boolean> {
    return this.db.createUser(userData);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<boolean> {
    return this.db.updateUser(id, userData);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.db.deleteUser(id);
  }

  async toggleUserStatus(id: number): Promise<boolean> {
    const users = this.db.getAllUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) return false;
    
    return this.db.updateUser(id, { active: !user.active });
  }
}

export const userService = new UserService();
