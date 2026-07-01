import Navbar from './Navbar';
import Footer from './Footer';

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Barra de navegación superior fija (consume el store directamente) */}
      <Navbar />

      {/* Contenido principal de la página, desplazado para no quedar oculto bajo el navbar */}
      <main className="flex-grow pt-16 flex flex-col">
        {children}
      </main>

      {/* Footer de la página */}
      <Footer />
    </div>
  );
};

export default PageLayout;
