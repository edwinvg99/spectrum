// PlaylistEmbed.jsx - Con skeleton y carga mejorada
import React, { useState, useEffect } from "react";
import SpectrumLogo from "../../assets/images/spectrumLOGO.svg?react";
import { PlaylistLoadingSkeleton } from "../../sharred/loadingSkeletons";

// Skeleton específico para el iframe de YouTube
const VideoSkeleton = ({ currentTab }) => (
  <div
    className={`bg-gradient-to-r ${currentTab.bgGradient} rounded-2xl p-6 lg:p-8 border ${currentTab.borderColor} backdrop-blur-sm mb-8 animate-pulse`}
  >
    {/* Video Header Skeleton */}
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="text-4xl">{currentTab.icon}</span>
        <div className="h-12 bg-slate-600/50 rounded-lg w-64"></div>
        <span className="text-4xl">{currentTab.icon}</span>
      </div>
      <div className="h-6 bg-slate-600/30 rounded-lg max-w-md mx-auto mb-2"></div>
    </div>

    {/* Video Container Skeleton */}
    <div className="relative group">
      <div
        className="relative bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-600/50"
        style={{ paddingTop: "56.25%" }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          {/* Logo girando en el centro */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-full blur-lg animate-pulse"></div>
            <div className="relative bg-slate-800/60 backdrop-blur-md rounded-full p-4 border border-slate-700/50 animate-spin">
              <SpectrumLogo
                className="w-16 h-16 object-contain"
                fill="url(#videoLoadingGradient)"
                stroke="rgba(132, 215, 203, 0.8)"
                strokeWidth="1"
              />
            </div>
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient
                  id="videoLoadingGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#84d7cb" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Texto de carga */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <p className="text-white text-lg animate-pulse bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
            Cargando video de YouTube...
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function PlaylistEmbed() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("highlights");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(0);

  // IDs de playlists para el embed de YouTube
  const playlists = {
    highlights: "PLD3-ET5DlQ0pYfjFhL-lqgQy9BstIsPSO",
    bloopers: "PLD3-ET5DlQ0qlpgbRG1zFyyrjQ1dPX8VF",
  };

  // Enlaces para añadir clips
  const addClipLinks = {
    highlights:
      "https://www.youtube.com/playlist?list=PLD3-ET5DlQ0pYfjFhL-lqgQy9BstIsPSO&jct=QL-CHUkQzsfTiCH564o4zg",
    bloopers:
      "https://www.youtube.com/playlist?list=PLD3-ET5DlQ0qlpgbRG1zFyyrjQ1dPX8VF&jct=CKrWldwmGYKhtIxkfX0FLA",
  };

  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlists[activeTab]}&autoplay=0&rel=0`;

  const tabConfig = {
    highlights: {
      icon: "🏆",
      title: "HIGHLIGHTS",
      subtitle: "Las mejores jugadas épicas",
      color: "from-purple-800 to-orange-600",
      borderColor: "border-red-500/50",
      shadowColor: "shadow-red-500/20",
      bgGradient: "from-red-500/10 via-orange-500/10 to-red-500/10",
    },
    bloopers: {
      icon: "⚡",
      title: "BLOOPERS",
      subtitle: "Momentos divertidos y fails",
      color: "from-sky-800 to-purple-600",
      borderColor: "border-blue-500/50",
      shadowColor: "shadow-blue-500/20",
      bgGradient: "from-blue-500/10 via-purple-500/10 to-blue-500/10",
    },
  };

  const currentTab = tabConfig[activeTab];

  // Inicialización con delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // Delay adicional para mostrar el contenido
      setTimeout(() => {
        setShowContent(true);
        setVideoLoaded(true);
      }, 500);
    }, 500); // 1.5 segundos de loading inicial

    return () => clearTimeout(timer);
  }, []);

  // Manejar cambio de tab
  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setVideoLoaded(false);
      setActiveTab(newTab);
      setCurrentVideoKey((prev) => prev + 1); // Forzar re-render del iframe

      // Simular tiempo de carga del nuevo video
      setTimeout(() => {
        setVideoLoaded(true);
      }, 800);
    }
  };

  // Mostrar skeleton completo al inicio
  if (!showContent) {
    return <PlaylistLoadingSkeleton />;
  }

  return (
    <div className="py-24 px-4 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] bg-repeat min-h-screen">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header animado */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            SPECTRUM CLAN - VALORANT
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 mb-6">
            Colección de highlights y bloopers del clan
          </p>
        </div>

        {/* Main Content Card */}
        <div
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-purple-500/10 animate-fade-in-up"
          style={{
            animationDelay: "0.3s",
            animationFillMode: "both",
          }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Tabs de navegación */}
            <div
              className="mb-8 animate-fade-in-up"
              style={{
                animationDelay: "0.6s",
                animationFillMode: "both",
              }}
            >
              <div className="flex justify-center bg-slate-900/50 rounded-2xl p-3 backdrop-blur-sm border border-slate-700">
                {Object.entries(tabConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    disabled={!videoLoaded && key !== activeTab}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 ${
                      activeTab === key
                        ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105 ${config.shadowColor}`
                        : "text-slate-400 hover:text-white hover:bg-slate-700/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    <span className="text-2xl">{config.icon}</span>
                    <span className="hidden sm:block">{config.title}</span>
                    {!videoLoaded && key !== activeTab && (
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse ml-2"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Section */}
            <div
              className="animate-fade-in-up"
              style={{
                animationDelay: "0.9s",
                animationFillMode: "both",
              }}
            >
              {!videoLoaded ? (
                <VideoSkeleton currentTab={currentTab} />
              ) : (
                <div
                  className={`bg-gradient-to-r ${currentTab.bgGradient} rounded-2xl p-6 lg:p-8 border ${currentTab.borderColor} backdrop-blur-sm mb-8 transition-all duration-500`}
                >
                  {/* Video Header */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="text-4xl animate-bounce">{currentTab.icon}</span>
                      <h2 className="text-3xl lg:text-4xl font-black text-white tracking-wider">
                        {currentTab.title}
                      </h2>
                      <span
                        className="text-4xl animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      >
                        {currentTab.icon}
                      </span>
                    </div>
                    <p className="text-slate-200 text-lg lg:text-xl mb-2">
                      {currentTab.subtitle}
                    </p>
                  </div>

                  {/* Video Container */}
                  <div className="relative group">
                    <div
                      className={`absolute -inset-3 bg-gradient-to-r ${currentTab.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500`}
                    ></div>
                    <div
                      className="relative bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-600/50"
                      style={{ paddingTop: "56.25%" }}
                    >
                      <iframe
                        key={currentVideoKey} // Forzar re-render al cambiar tab
                        className="absolute top-0 left-0 w-full h-full transition-opacity duration-500"
                        src={embedUrl}
                        title={`YouTube video player - ${currentTab.title}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        loading="lazy"
                        onLoad={() => setVideoLoaded(true)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div
              className="bg-slate-900/50 p-6 lg:p-8 rounded-2xl border border-slate-700 animate-fade-in-up"
              style={{
                animationDelay: "1.2s",
                animationFillMode: "both",
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { icon: "🔥", text: "Ace", color: "red-400", delay: "0ms" },
                  { icon: "💀", text: "Clutch", color: "orange-400", delay: "100ms" },
                  { icon: "🥲", text: "Blooper", color: "purple-400", delay: "200ms" },
                  { icon: "🫂", text: "Team", color: "blue-400", delay: "300ms" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`bg-slate-800/70 rounded-xl p-4 text-center border border-slate-600/30 hover:border-${stat.color.split("-")[0]}-500/50 hover:scale-105 transition-all duration-300 animate-fade-in-up`}
                    style={{
                      animationDelay: `calc(1.5s + ${stat.delay})`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className={`text-xl font-bold text-${stat.color}`}>
                      {stat.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div
              className={`bg-gradient-to-r ${currentTab.color}/20 p-6 rounded-2xl border ${currentTab.borderColor} mb-6 mt-4 animate-fade-in-up`}
              style={{
                animationDelay: "1.8s",
                animationFillMode: "both",
              }}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center justify-center lg:justify-start gap-3">
                    ✨Sube tu clip✨
                  </h3>
                  <p className="text-slate-300 text-lg">
                    Comparte tus mejores momentos o las jugadas más lamentables con
                    el Clan
                  </p>
                </div>

                <a
                  href={addClipLinks[activeTab]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${currentTab.color} hover:scale-105 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 ease-out whitespace-nowrap`}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    ➕
                  </span>
                  AÑADIR MI CLIP
                  <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
