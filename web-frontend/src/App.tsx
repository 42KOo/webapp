import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { register } from './serviceWorkerRegistration';
import Shipments from './pages/Shipments';

export default function App(){
  // register service worker for background sync
  if (typeof window !== 'undefined') { register(); }
  return (
    <AuthProvider>
      <div style={{padding:20}}>
        <h1>Kubiciranje Paleta - PWA</h1>
        <Shipments />
      </div>
    </AuthProvider>
  );
}
