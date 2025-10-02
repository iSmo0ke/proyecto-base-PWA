// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Ocultar splash screen después de que React renderice
setTimeout(hideSplashScreen, 1000);