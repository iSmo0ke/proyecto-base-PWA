// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import ActivityForm from './components/ActivityForm.tsx';
import ActivityList from './components/ativityList.tsx';
import ActivitiesPage from './pages/ActivitiesPage.tsx';

// Ocultar splash screen cuando React esté listo
const hideSplashScreen = () => {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.classList.add('splash-hidden');
    setTimeout(() => {
      splashScreen.remove();
    }, 500);
  }
  
  // Actualizar footer cuando la app cargue
  const footer = document.querySelector('.app-footer p');
  if (footer) {
    footer.textContent = '© 2024 Mi App PWA - Cargada ✅';
  }
}

// 1. Define tus rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'formulario',
        // 👇 2. USA EL NUEVO COMPONENTE AQUÍ
        element: <ActivitiesPage />,
      },
    ],
  },
]);

// 2. Renderiza el proveedor de rutas
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Ocultar splash screen después de que React renderice
setTimeout(hideSplashScreen, 1000);

