// src/App.tsx
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [content, setContent] = useState('Cargando contenido...');

  useEffect(() => {
    // Simular carga de contenido dinámico
    setTimeout(() => {
      setContent('¡Bienvenido a tu PWA con React!');
    }, 500);
  }, []);

  return (
    <div className="app-content">
      <h2>Home Screen</h2>
      <p>{content}</p>
      <button onClick={() => alert('¡Funciona!')}>
        Probar Interacción
      </button>
    </div>
  )
}

export default App