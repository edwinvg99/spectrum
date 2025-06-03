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
import Navbar from "./layout/navbar"; // Asegúrate de que el path a Navbar es correcto
import HomePage from "./layout/HomePage"; // Asegúrate de que el path a HomePage es correcto
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="main-content-wrapper content-area"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/integrantes" element={<PlayerGrid />} />
          <Route path="/agentes" element={<PersonajesValorant />} />
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
