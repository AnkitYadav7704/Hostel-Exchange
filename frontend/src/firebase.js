import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAxeuzAFcMkcMG8KVAt4470xyZViI0S1q8",
  authDomain: "hostel-exchange.firebaseapp.com",
  projectId: "hostel-exchange",
  storageBucket: "hostel-exchange.firebasestorage.app",
  messagingSenderId: "700598798980",
  appId: "1:700598798980:web:9ea8637891f426e4a250d1",
  measurementId: "G-SN8TFRVXH4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
