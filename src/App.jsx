import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import PlayerGrid         from "./integrantes/components/PlayerGrid";
import PlayerProfilePage  from "./integrantes/components/PlayerProfilePage";
import PersonajesValorant from "./ValorantData/agentes/components/agenteValorant";
import MapasValorant      from "./ValorantData/mapas/components/mapsValorant";
import Navbar             from "./layout/navbar";
import HomePage           from "./layout/HomePage";
import MainContentLayout  from "./ValorantData/noticias/components/MainContentLayout";
import ValorantStore      from "./ValorantData/tienda/tienda.Valorant";
import PlaylistEmbed      from "./ValorantData/jugadasYbloopers/PlaylistEmbed";
import ArsenalValorant    from "./ValorantData/arsenal/components/arsenalValorant";
import TournamentPage     from "./torneos/TournamentPage";
import AccesoriosPage     from "./ValorantData/accesorios/components/AccesoriosPage";
import './App.css';

const NotFound = () => (
  <div className="min-h-screen bg-spectrum-darker flex items-center justify-center px-4">
    <div className="text-center">
      <p className="text-8xl font-display font-black text-spectrum-cyan mb-4 animate-glow-pulse">404</p>
      <h2 className="text-2xl font-bold text-white mb-2">Página no encontrada</h2>
      <p className="text-slate-400 text-sm">La ruta que buscas no existe en este universo.</p>
    </div>
  </div>
);

const App = () => (
  <Router>
    <Navbar />
    <div className="main-content-wrapper content-area">
      <Routes>
        <Route path="/"                         element={<HomePage />} />
        <Route path="/integrantes"              element={<PlayerGrid />} />
        <Route path="/integrantes/:name/:tag"   element={<PlayerProfilePage />} />
        <Route path="/agentes"                  element={<PersonajesValorant />} />
        <Route path="/mapas"                    element={<MapasValorant />} />
        <Route path="/valorant"                 element={<MainContentLayout />} />
        <Route path="/tienda"                   element={<ValorantStore />} />
        <Route path="/jugadas"                  element={<PlaylistEmbed />} />
        <Route path="/arsenal"                  element={<ArsenalValorant />} />
        <Route path="/torneos"                  element={<TournamentPage />} />
        <Route path="/accesorios"               element={<AccesoriosPage />} />
        <Route path="*"                         element={<NotFound />} />
      </Routes>
    </div>
  </Router>
);

export default App;
