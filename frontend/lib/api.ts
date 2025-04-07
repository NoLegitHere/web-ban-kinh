import { toast } from "@/components/ui/use-toast";

const API_URL = 'http://localhost:5000/api';

/**
 * Basic fetch wrapper with error handling and auth token
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  // Get auth token from localStorage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
    cache: 'no-store' as RequestCache
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      // Clear token if it's invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      
      // Show toast notification about auth error
      toast({
        title: "Phiên đăng nhập hết hạn",
        description: "Vui lòng đăng nhập lại để tiếp tục.",
        variant: "destructive",
      });
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.message || 'API request failed');
      } catch (e) {
        throw new Error(`API request failed: ${errorText}`);
      }
    }
    
    // Return empty object for 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Authentication services
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await fetchAPI<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Save token to localStorage
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },
  
  register: async (userData: any) => {
    return fetchAPI<{ user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  logout: () => {
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  
  getCurrentUser: async () => {
    // Only attempt to get user if token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return null;
    
    try {
      return await fetchAPI<any>('/users/me');
    } catch (error) {
      return null;
    }
  },
};

// Product services
export const productAPI = {
  getAll: async (params?: { 
    category?: string; 
    search?: string; 
    sort?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    _t?: string; // Timestamp for cache busting
  }) => {
    let queryString = '';
    
    if (params) {
      const query = new URLSearchParams();
      
      // Handle each parameter carefully
      if (params.category && params.category.trim() !== '') {
        query.append('category', params.category);
      }
      
      if (params.search && params.search.trim() !== '') {
        query.append('search', params.search);
      }
      
      if (params.sort && params.sort !== 'newest') {
        query.append('sort', params.sort);
      }
      
      if (params.brand && params.brand.trim() !== '') {
        query.append('brand', params.brand);
      }
      
      // Make sure price parameters are valid numbers
      if (params.minPrice && !isNaN(Number(params.minPrice)) && Number(params.minPrice) > 0) {
        query.append('minPrice', params.minPrice);
      }
      
      if (params.maxPrice && !isNaN(Number(params.maxPrice))) {
        query.append('maxPrice', params.maxPrice);
      }
      
      if (params._t) {
        query.append('_t', params._t);
      }
      
      queryString = `?${query.toString()}`;
    }
    
    try {
      const result = await fetchAPI<any[]>(`/products${queryString}`);
      return result;
    } catch (error) {
      throw error;
    }
  },
  
  getById: async (id: string) => {
    return fetchAPI<any>(`/products/${id}`);
  },
  
  create: async (product: any) => {
    return fetchAPI<any>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },
  
  update: async (id: string, product: any) => {
    return fetchAPI<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },
  
  delete: async (id: string) => {
    return fetchAPI<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Cart services
export const cartAPI = {
  addToCart: async (productId: string, quantity: number) => {
    return fetchAPI<any>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },
  
  removeFromCart: async (productId: string) => {
    return fetchAPI<any>('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
  
  updateQuantity: async (productId: string, quantity: number) => {
    return fetchAPI<any>('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  },
  
  getCart: async () => {
    return fetchAPI<any>('/cart');
  },
  
  clearCart: async () => {
    return fetchAPI<any>('/cart/clear', {
      method: 'POST',
    });
  },
  
  checkout: async (orderData: any) => {
    return fetchAPI<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
};

// Order services
export const orderAPI = {
  getAll: async () => {
    return fetchAPI<any[]>('/orders');
  },
  
  getById: async (id: string) => {
    return fetchAPI<any>(`/orders/${id}`);
  },
  
  create: async (order: any) => {
    return fetchAPI<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },
  
  update: async (id: string, order: any) => {
    return fetchAPI<any>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  },
  
  delete: async (id: string) => {
    return fetchAPI<void>(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// User services
export const userAPI = {
  getAll: async () => {
    return fetchAPI<any[]>('/users');
  },
  
  getById: async (id: string) => {
    return fetchAPI<any>(`/users/${id}`);
  },
  
  update: async (id: string, userData: any) => {
    return fetchAPI<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  delete: async (id: string) => {
    return fetchAPI<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
}; 