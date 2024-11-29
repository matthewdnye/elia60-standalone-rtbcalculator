import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const TEST_EMAIL = 'demo@eliteadvisortools.com';
const TEST_PASSWORD = 'Elite2024!';

export async function setupTestUser() {
  try {
    // Try to sign in first
    try {
      console.log('Attempting to sign in test user...');
      await signInWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
      console.log('Test user signed in successfully');
      return true;
    } catch (signInError: any) {
      console.log('Sign in failed, attempting to create user...');
      // If user doesn't exist, create new user
      if (signInError.code === 'auth/user-not-found') {
        await createUserWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
        console.log('Test user created successfully');
        return true;
      }
      throw signInError;
    }
  } catch (error) {
    console.error('Error setting up test user:', error);
    throw error;
  }
}