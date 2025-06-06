// PlaylistEmbed.jsx - Diseño renovado estilo gaming/Valorant
import React, { useState, useEffect } from "react";
import SpectrumLogo from "../../assets/images/spectrumLOGO.svg?react";

export default function PlaylistEmbed() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("highlights");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlists[activeTab]}`;

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

  return (
    <div className=" py-24 px-4 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] bg-repeat">
      <div className="max-w-7xl mx-auto  bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header Section - Estilo similar a la tienda */}

        {/* Logo central */}
        {/* <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative">
              <SpectrumLogo
                className="w-10 h-10 lg:w-24 lg:h-24 object-contain hover:scale-110 transition-transform duration-500"
                fill="url(#spectrumGradient)"
                stroke="rgba(132, 215, 203, 0.8)"
                strokeWidth="1"
              /> */}
        {/* SVG Gradient */}
        {/* <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#84d7cb" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div> */}

        {/* Main Content Card - Estilo similar a BundleCard */}
        <div className=" bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-purple-500/10">
          <div className="max-w-6xl mx-auto">
            {/* Tabs de navegación - Estilo mejorado */}
            <div className="mb-8">
              <div className="flex justify-center bg-slate-900/50 rounded-2xl p-3 backdrop-blur-sm border border-slate-700">
                {Object.entries(tabConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 ${
                      activeTab === key
                        ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105 ${config.shadowColor}`
                        : "text-slate-400 hover:text-white hover:bg-slate-700/50 hover:scale-105"
                    }`}
                  >
                    <span className="text-2xl">{config.icon}</span>
                    <span className="hidden sm:block">{config.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Section */}
            <div
              className={`bg-gradient-to-r ${currentTab.bgGradient} rounded-2xl p-6 lg:p-8 border ${currentTab.borderColor} backdrop-blur-sm mb-8`}
            >
              {/* Video Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl">{currentTab.icon}</span>
                  <h2 className="text-3xl lg:text-4xl font-black text-white tracking-wider">
                    {currentTab.title}
                  </h2>
                  <span className="text-4xl">{currentTab.icon}</span>
                </div>
                <p className="text-slate-200 text-lg lg:text-xl mb-2">
                  {currentTab.subtitle}
                </p>
              </div>

              {/* Video Container - Mejorado */}
              <div className="relative group">
                <div
                  className={`absolute -inset-3 bg-gradient-to-r ${currentTab.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500`}
                ></div>
                <div
                  className="relative bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-600/50"
                  style={{ paddingTop: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl}
                    title={`YouTube video player - ${currentTab.title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Stats Section - Estilo similar a items de bundle */}
            <div className="bg-slate-900/50 p-6 lg:p-8 rounded-2xl border border-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Stats Cards */}
                <div className="bg-slate-800/70 rounded-xl p-4 text-center border border-slate-600/30 hover:border-red-500/50 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-xl font-bold text-red-400">Ace</div>
                </div>

                <div className="bg-slate-800/70 rounded-xl p-4 text-center border border-slate-600/30 hover:border-orange-500/50 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-2">💀</div>
                  <div className="text-xl font-bold text-orange-400">
                    Clutch
                  </div>
                </div>

                <div className="bg-slate-800/70 rounded-xl p-4 text-center border border-slate-600/30 hover:border-purple-500/50 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-2">🥲</div>
                  <div className="text-xl font-bold text-purple-400">
                    Blooper
                  </div>
                </div>

                <div className="bg-slate-800/70 rounded-xl p-4 text-center border border-slate-600/30 hover:border-blue-500/50 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-2">🫂</div>
                  <div className="text-xl font-bold text-blue-400">Team</div>
                </div>
              </div>
            </div>
            
            {/* CTA Section - Estilo similar a BundlePricing */}
            <div
              className={`bg-gradient-to-r ${currentTab.color}/20 p-6 rounded-2xl border ${currentTab.borderColor} mb-6 mt-4`}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center justify-center lg:justify-start gap-3">
                    ✨Sube tu clip✨
                  </h3>
                  <p className="text-slate-300 text-lg">
                    Comparte tus mejores momentos o la jugadas mas lamentables
                    con el Clan
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
