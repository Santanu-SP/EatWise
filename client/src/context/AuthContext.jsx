import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'eatwise_users';
const SESSION_KEY = 'eatwise_session';

const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const users = getUsers();
        const found = users.find(u => u.id === parsed.id);
        if (found) setUser(found);
      } catch {}
    }
    setLoading(false);
  }, []);

  const register = useCallback(async ({ name, email, password, dietaryPrefs = [] }) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production this would be hashed on server
      dietaryPrefs,
      viewedRecipes: [],
      likedRecipes: [],
      viewedCategories: [],
      joinedAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: newUser.id }));
    return newUser;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password.');
    setUser(found);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: found.id }));
    return found;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const updateUserActivity = useCallback((recipeId, category, action = 'view') => {
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return;

    const updated = { ...users[idx] };

    if (action === 'view') {
      if (!updated.viewedRecipes.includes(recipeId)) {
        updated.viewedRecipes = [recipeId, ...updated.viewedRecipes].slice(0, 50);
      }
      if (!updated.viewedCategories.includes(category)) {
        updated.viewedCategories = [category, ...updated.viewedCategories].slice(0, 10);
      } else {
        // Move to front (most recent)
        updated.viewedCategories = [category, ...updated.viewedCategories.filter(c => c !== category)];
      }
    } else if (action === 'like') {
      if (updated.likedRecipes.includes(recipeId)) {
        updated.likedRecipes = updated.likedRecipes.filter(id => id !== recipeId);
      } else {
        updated.likedRecipes = [recipeId, ...updated.likedRecipes];
      }
    }

    users[idx] = updated;
    saveUsers(users);
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserActivity }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
