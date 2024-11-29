import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { auth } from './lib/firebase'

// Debug Firebase initialization in main
console.log('Main.tsx - Firebase auth:', auth);
console.log('Main.tsx - Current user:', auth.currentUser);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)