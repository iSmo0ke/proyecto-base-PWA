// src/App.tsx
import './App.css';
import { Outlet, Link } from 'react-router-dom'; // Importa Outlet y Link
import { useOnlineStatus } from './hooks/useOnlineStatus';

function App() {
  const isOnline = useOnlineStatus();

  return (
    // Ya no necesitas la clase 'app-content' aquí, sino en las páginas
    <div>
      <header className="app-header">
        {/* Enlace para volver al inicio */}
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <h1>Mi PWA de Actividades</h1>
        </Link>
        <div className={`status ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? '🟢 Conectado' : '🔴 Sin Conexión'}
        </div>
      </header>
      <main className="app-main">
        {/* 👇 Outlet es el marcador de posición donde se dibujará la página actual */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default App;