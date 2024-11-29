import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export async function setupTestUser() {
  const email = 'test@example.com';
  const password = 'password123';

  try {
    // Try to sign in first
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Test user signed in successfully');
    } catch (signInError: any) {
      // If user doesn't exist, create new user
      if (signInError.code === 'auth/user-not-found') {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Test user created successfully');
      } else {
        throw signInError;
      }
    }
  } catch (error) {
    console.error('Error setting up test user:', error);
  }
}