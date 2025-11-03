import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Clients from './components/Clients';
import Footer from './components/Footer';
import ContactMap from './components/ContactMap';

const App: React.FC = () => {
  return (
    <div className="bg-slate-50 text-gray-800">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <ContactMap />
        <Clients />
      </main>
      <Footer />
    </div>
  );
};

export default App;