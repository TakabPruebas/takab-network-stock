
import { userOperations } from '@/lib/database';
import { User } from '@/types';

export const userService = {
  // Authenticate user
  authenticate: async (username: string, password: string): Promise<User | null> => {
    try {
      const user = userOperations.getUserByUsername(username);
      
      if (user && user.password === password && user.active) {
        // Remove password from returned user object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      
      return null;
    } catch (error) {
      console.error('Error en autenticación:', error);
      return null;
    }
  },

  // Get all users (admin only)
  getAllUsers: (): User[] => {
    return userOperations.getAllUsers();
  },

  // Create user (admin only)
  createUser: async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): Promise<boolean> => {
    return userOperations.createUser(userData);
  },

  // Update user (admin only)
  updateUser: async (id: number, userData: Partial<User>): Promise<boolean> => {
    return userOperations.updateUser(id, userData);
  },

  // Delete user (admin only)
  deleteUser: async (id: number): Promise<boolean> => {
    return userOperations.deleteUser(id);
  },

  // Toggle user status (admin only)
  toggleUserStatus: async (id: number): Promise<boolean> => {
    return userOperations.toggleUserStatus(id);
  }
};
