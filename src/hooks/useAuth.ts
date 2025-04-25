import { useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserPreferences {
  location: string;
  interests: string[];
  newsPreference: 'all' | 'left' | 'center' | 'right';
}

export interface UserData {
  uid: string;
  email: string;
  preferences: UserPreferences;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, preferences: UserPreferences) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        preferences
      });
      return userCredential.user;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const getUserData = async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as Omit<UserData, 'uid'>;
        return { ...data, uid };
      }
      return null;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      return null;
    }
  };

  const updateUserPreferences = async (uid: string, preferences: UserPreferences) => {
    try {
      await setDoc(doc(db, 'users', uid), { preferences }, { merge: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    getUserData,
    updateUserPreferences
  };
};

export default useAuth; 