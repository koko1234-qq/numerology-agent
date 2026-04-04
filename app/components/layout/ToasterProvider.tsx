'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          padding: '1rem',
          fontSize: '0.875rem',
          maxWidth: '400px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            borderLeft: '4px solid #10b981',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            borderLeft: '4px solid #ef4444',
          },
        },
        loading: {
          style: {
            borderLeft: '4px solid #8b5cf6',
          },
        },
      }}
    />
  );
}