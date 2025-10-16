// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h2>Home Screen</h2>
      <p>¡Bienvenido a tu PWA con React!</p>
      {/* Este es el nuevo botón que usa Link */}
      <Link to="/formulario">
        <button>Ir al Formulario de Actividades</button>
      </Link>
    </div>
  );
}

export default HomePage;