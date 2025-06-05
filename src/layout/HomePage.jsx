import React, { useState, useEffect } from "react";
import "./HomePage.css";

function HomePage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showWords, setShowWords] = useState(true);

  const words = ["SOMOS", "VALORANT", "SOMOS"]; // Cambié la última palabra para variedad

  // Duraciones de las animaciones de texto
  const typingSpeed = 150; // Ms por letra al escribir
  const deletingSpeed = 100; // Ms por letra al borrar
  const pauseAfterTyping = 500; // Pausa después de escribir una palabra
  const pauseAfterDeleting = 370; // Pausa después de borrar una palabra

  useEffect(() => {
    if (!showWords) return;

    const currentWord = words[currentWordIndex];
    let timer;

    if (isTyping) {
      if (currentText.length < currentWord.length) {
        timer = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => setIsTyping(false), pauseAfterTyping);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
      } else {
        if (currentWordIndex === words.length - 1) {
          setTimeout(() => setShowWords(false), pauseAfterDeleting);
        } else {
          timer = setTimeout(() => {
            setCurrentWordIndex(prev => prev + 1);
            setIsTyping(true);
          }, pauseAfterDeleting);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isTyping, currentWordIndex, showWords]);


  return (
    <div className="homepage-container">
        <video autoPlay muted loop playsInline className="background-video">
          <source src="/videos/valoFONDO.webm" type="video/webm" />
        </video>

      <div className="overlay" />

 <div className="content">
        {showWords ? (
          <div className="typing-container">
            <h1 className="typing-text">
              {currentText}
              <span className="cursor">|</span>
            </h1>
          </div>
        ) : (
          <img
            src="/public/image/LOGO.png"
            alt="Logo Spectrum home"
            className="logo"
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
