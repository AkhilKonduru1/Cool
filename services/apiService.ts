import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5001/api'; // Change this to your backend URL

interface User {
  id: number;
  username: string;
  email: string;
  level: number;
  points: number;
  streak: number;
  adventures_completed: number;
  badges_earned: number;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface Adventure {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  points_earned: number;
  completed_at: string;
}

interface Friend {
  id: number;
  username: string;
  level: number;
  adventures_completed: number;
  points?: number;
}

interface FriendRequest {
  id: number;
  sender: Friend;
  message: string;
  created_at: string;
}

interface Memory {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

class ApiService {
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getToken();
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async signUp(email: string, password: string, username: string): Promise<AuthResponse> {
    const response = await this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });

    await this.setToken(response.token);
    return response;
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    await this.setToken(response.token);
    return response;
  }

  async signOut(): Promise<void> {
    await this.removeToken();
  }

  async getProfile(): Promise<User> {
    const response = await this.makeRequest('/user/profile');
    return response;
  }

  // Adventure methods
  async saveAdventure(adventure: {
    title: string;
    description: string;
    location: string;
    category: string;
    points_earned?: number;
  }): Promise<Adventure> {
    const response = await this.makeRequest('/adventures', {
      method: 'POST',
      body: JSON.stringify(adventure),
    });

    return response.adventure;
  }

  async getAdventures(): Promise<Adventure[]> {
    const response = await this.makeRequest('/adventures');
    return response.adventures;
  }

  // Friend methods
  async searchFriends(query: string): Promise<Friend[]> {
    const response = await this.makeRequest(`/friends/search?q=${encodeURIComponent(query)}`);
    return response.users;
  }

  async sendFriendRequest(friendId: number, message?: string): Promise<void> {
    await this.makeRequest('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ friend_id: friendId, message }),
    });
  }

  async getFriendRequests(): Promise<FriendRequest[]> {
    const response = await this.makeRequest('/friends/requests');
    return response.requests;
  }

  async respondToFriendRequest(requestId: number, action: 'accept' | 'decline'): Promise<void> {
    await this.makeRequest(`/friends/requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  async getFriends(): Promise<Friend[]> {
    const response = await this.makeRequest('/friends');
    return response.friends;
  }

  // Memory methods
  async saveMemory(memory: {
    title: string;
    description: string;
    adventure_id?: number;
  }): Promise<Memory> {
    const response = await this.makeRequest('/memories', {
      method: 'POST',
      body: JSON.stringify(memory),
    });

    return response.memory;
  }

  async getMemories(): Promise<Memory[]> {
    const response = await this.makeRequest('/memories');
    return response.memories;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;

    try {
      await this.getProfile();
      return true;
    } catch (error) {
      await this.removeToken();
      return false;
    }
  }
}

export const apiService = new ApiService();
export type { Adventure, Friend, FriendRequest, Memory, User };

