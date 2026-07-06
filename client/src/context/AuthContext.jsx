import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isFirebaseConfigured, auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const AuthContext = createContext(null);

const STORAGE_KEY = 'eatwise_users';
const SESSION_KEY = 'eatwise_session';

const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase Auth State listener OR LocalStorage Session restoring
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Get user preferences from Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUser({ id: firebaseUser.uid, email: firebaseUser.email, ...docSnap.data() });
          } else {
            setUser({ id: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || 'User', dietaryPrefs: [], dietType: 'veg', viewedRecipes: [], likedRecipes: [], viewedCategories: [] });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
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
    }
  }, []);

  const register = useCallback(async ({ name, email, password, dietaryPrefs = [], dietType = 'veg' }) => {
    if (isFirebaseConfigured) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        name,
        email,
        dietaryPrefs,
        dietType,
        viewedRecipes: [],
        likedRecipes: [],
        viewedCategories: [],
        joinedAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      };
      // Save metadata in Firestore
      await setDoc(doc(db, 'users', cred.user.uid), userData);
      setUser({ id: cred.user.uid, ...userData });
      return cred.user;
    } else {
      const users = getUsers();
      if (users.find(u => u.email === email)) {
        throw new Error('An account with this email already exists.');
      }
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, 
        dietaryPrefs,
        dietType,
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
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    if (isFirebaseConfigured) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'users', cred.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser({ id: cred.user.uid, email, ...docSnap.data() });
      }
      return cred.user;
    } else {
      const users = getUsers();
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) throw new Error('Invalid email or password.');
      setUser(found);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: found.id }));
      return found;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (isFirebaseConfigured) {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const docRef = doc(db, 'users', cred.user.uid);
      const docSnap = await getDoc(docRef);
      let userData;
      if (!docSnap.exists()) {
        userData = {
          name: cred.user.displayName || 'EatWise User',
          email: cred.user.email,
          dietaryPrefs: [],
          dietType: 'veg',
          viewedRecipes: [],
          likedRecipes: [],
          viewedCategories: [],
          joinedAt: new Date().toISOString(),
          avatar: cred.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cred.user.displayName || 'user')}`,
        };
        await setDoc(docRef, userData);
      } else {
        userData = docSnap.data();
      }
      setUser({ id: cred.user.uid, email: cred.user.email, ...userData });
      return cred.user;
    } else {
      // Mock Google Login for LocalStorage
      const users = getUsers();
      let found = users.find(u => u.email === 'googleuser@example.com');
      if (!found) {
        found = {
          id: 'google-mock-id',
          name: 'EatWise User',
          email: 'googleuser@example.com',
          dietaryPrefs: [],
          dietType: 'veg',
          viewedRecipes: [],
          likedRecipes: [],
          viewedCategories: [],
          joinedAt: new Date().toISOString(),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleMock',
        };
        users.push(found);
        saveUsers(users);
      }
      setUser(found);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: found.id }));
      return found;
    }
  }, []);

  const logout = useCallback(async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
      setUser(null);
    } else {
      setUser(null);
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const updateUserActivity = useCallback(async (recipeId, category, action = 'view') => {
    if (!user) return;

    if (isFirebaseConfigured) {
      const docRef = doc(db, 'users', user.id);
      if (action === 'view') {
        const hasViewed = user.viewedRecipes.includes(recipeId);
        const hasCat = user.viewedCategories.includes(category);
        
        const updates = {};
        if (!hasViewed) {
          updates.viewedRecipes = [recipeId, ...user.viewedRecipes].slice(0, 50);
        }
        
        let newCats = [...user.viewedCategories];
        if (!hasCat) {
          newCats = [category, ...newCats].slice(0, 10);
        } else {
          newCats = [category, ...newCats.filter(c => c !== category)];
        }
        updates.viewedCategories = newCats;
        
        await updateDoc(docRef, updates);
        setUser(u => ({ ...u, ...updates }));
      } else if (action === 'like') {
        const isLiked = user.likedRecipes.includes(recipeId);
        if (isLiked) {
          await updateDoc(docRef, {
            likedRecipes: arrayRemove(recipeId)
          });
          setUser(u => ({ ...u, likedRecipes: u.likedRecipes.filter(id => id !== recipeId) }));
        } else {
          await updateDoc(docRef, {
            likedRecipes: arrayUnion(recipeId)
          });
          setUser(u => ({ ...u, likedRecipes: [recipeId, ...u.likedRecipes] }));
        }
      }
    } else {
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
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateUserActivity }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
