
import { userOperations } from '@/lib/database';
import { User, DatabaseUser } from '@/types';

export const userService = {
  // Authenticate user
  authenticate: async (username: string, password: string): Promise<User | null> => {
    try {
      const dbUser = userOperations.getUserByUsername(username) as DatabaseUser | null;
      
      if (dbUser && dbUser.password === password && dbUser.active) {
        // Remove password from returned user object
        const { password: _, ...userWithoutPassword } = dbUser;
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
    try {
      return userOperations.getAllUsers();
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  },

  // Create user (admin only)
  createUser: async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): Promise<boolean> => {
    try {
      return userOperations.createUser(userData);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return false;
    }
  },

  // Update user (admin only)
  updateUser: async (id: number, userData: Partial<User>): Promise<boolean> => {
    try {
      return userOperations.updateUser(id, userData);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return false;
    }
  },

  // Delete user (admin only)
  deleteUser: async (id: number): Promise<boolean> => {
    try {
      return userOperations.deleteUser(id);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  },

  // Toggle user status (admin only)
  toggleUserStatus: async (id: number): Promise<boolean> => {
    try {
      return userOperations.toggleUserStatus(id);
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      return false;
    }
  }
};
