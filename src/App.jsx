import React from "react";
// Corrección: Importar BrowserRouter como Router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PlayerGrid from "./integrantes/components/PlayerGrid";
import PersonajesValorant from "./ValorantData/agentes/components/agenteValorant";
import MapasValorant from "./ValorantData/mapas/components/mapsValorant";
import Navbar from "./layout/navbar"; // Asegúrate de que el path a Navbar es correcto
import HomePage from "./layout/HomePage"; // Asegúrate de que el path a HomePage es correcto
import MainContentLayout from "./ValorantData/noticias/components/MainContentLayout";
import ValorantStore from "./ValorantData/tienda/tienda.Valorant"; // Asegúrate de que el path a ValorantStore es correcto
import PlaylistEmbed from "./ValorantData/jugadasYbloopers/PlaylistEmbed"; // Asegúrate de que el path a PlaylistEmbed es correcto
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="main-content-wrapper content-area"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/integrantes" element={<PlayerGrid />} />
          <Route path="/agentes" element={<PersonajesValorant />} />
          <Route path="/mapas" element={<MapasValorant/>} />
          <Route path="/valorant" element={<MainContentLayout />} />
          <Route path="/tienda" element={<ValorantStore />} />
          <Route path="/jugadas" element={<PlaylistEmbed />} />
          
          {/* Redirección de /noticias a /valorant */}
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
