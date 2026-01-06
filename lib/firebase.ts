/**
 * Firebase Configuration and Utilities
 * 
 * Client-side Firebase setup for authentication and Firestore database.
 * Uses environment variables for configuration.
 * 
 * NOTE: This module only initializes Firebase in browser environments.
 * Server-side code should use direct REST API calls or Firebase Admin SDK.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  Firestore
} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only in browser environment (singleton pattern)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

// Export Firebase services (will be undefined on server)
export { auth, db };

// Google Auth Provider (only initialized in browser)
let googleProvider: GoogleAuthProvider | undefined;
if (typeof window !== 'undefined' && auth) {
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

/**
 * Sign in with Google popup
 */
export async function signInWithGoogle() {
  if (!auth || !googleProvider) {
    return { user: null, error: 'Auth not initialized (server-side)' };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (!auth) {
    return { error: 'Auth not initialized (server-side)' };
  }
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    console.error('Sign-out error:', error);
    return { error: error.message };
  }
}

/**
 *if (!auth) {
    console.warn('Auth not initialized (server-side)');
    return () => {}; // Return empty unsubscribe function
  }
   Subscribe to authentication state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/*if (!db) {
    console.error('Firestore not initialized (server-side)');
    return false;
  }
  *
 * Check if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  try {
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
    return !usernameDoc.exists();
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string) {
  if (!db) {
    return { data: null, error: 'Firestore not initialized (server-side)' };
  }
  try {
    const profileDoc = await getDoc(doc(db, 'users', userId));
    if (profileDoc.exists()) {
      return { data: profileDoc.data(), error: null };
    }
    return { data: null, error: 'Profile not found' };
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get user config by username
 */
export async function getUserConfigByUsername(username: string) {
  if (!db) {
    return { data: null, error: 'Firestore not initialized (server-side)' };
  }
  try {
    const configDoc = await getDoc(doc(db, 'configs', username.toLowerCase()));
    if (configDoc.exists()) {
      return { data: configDoc.data(), error: null };
    }
    return { data: null, error: 'Config not found' };
  } catch (error: any) {
    console.error('Error fetching config:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Create or update user profile with username
 */
export async function saveUserProfile(userId: string, username: string, displayName: string, email: string) {
  if (!db) {
    return { success: false, error: 'Firestore not initialized (server-side)' };
  }
  try {
    const usernameLower = username.toLowerCase();
    
    // Check if username is available
    const isAvailable = await isUsernameAvailable(usernameLower);
    if (!isAvailable) {
      return { success: false, error: 'Username already taken' };
    }

    // Create username claim
    await setDoc(doc(db, 'usernames', usernameLower), {
      userId,
      createdAt: Timestamp.now()
    });

    // Create/update user profile
    await setDoc(doc(db, 'users', userId), {
      username: usernameLower,
      displayName,
      email,
      updatedAt: Timestamp.now()
    }, { merge: true });

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error saving profile:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save user wallpaper configuration
 */
export async function saveUserConfig(username: string, config: any) {
  if (!db) {
    return { success: false, error: 'Firestore not initialized (server-side)' };
  }
  try {
    const usernameLower = username.toLowerCase();
    
    await setDoc(doc(db, 'configs', usernameLower), {
      ...config,
      updatedAt: Timestamp.now()
    }, { merge: true });

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error saving config:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get available plugins from marketplace
 */
export async function getAvailablePlugins() {
  if (!db) {
    return { data: [], error: 'Firestore not initialized (server-side)' };
  }
  try {
    const pluginsQuery = query(
      collection(db, 'plugins'),
      where('approved', '==', true)
    );
    const snapshot = await getDocs(pluginsQuery);
    const plugins = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { data: plugins, error: null };
  } catch (error: any) {
    console.error('Error fetching plugins:', error);
    return { data: [], error: error.message };
  }
}

/**
 * Get plugin by ID
 */
export async function getPlugin(pluginId: string) {
  if (!db) {
    return { data: null, error: 'Firestore not initialized (server-side)' };
  }
  try {
    const pluginDoc = await getDoc(doc(db, 'plugins', pluginId));
    if (pluginDoc.exists()) {
      return { data: { id: pluginDoc.id, ...pluginDoc.data() }, error: null };
    }
    return { data: null, error: 'Plugin not found' };
  } catch (error: any) {
    console.error('Error fetching plugin:', error);
    return { data: null, error: error.message };
  }
}
