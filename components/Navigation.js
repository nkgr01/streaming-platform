'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <span className="text-3xl">🎬</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Ciné Now
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/">
            <span className="text-white hover:text-blue-400 transition-colors cursor-pointer font-semibold">
              Accueil
            </span>
          </Link>
          <Link href="/discover">
            <span className="text-white hover:text-purple-400 transition-colors font-semibold">
              🌟 Découvrir
            </span>
          </Link>
          <Link href="/shorts">
            <span className="text-white hover:text-yellow-400 transition-colors font-semibold">
              🎬 Extraits
            </span>
          </Link>
          <Link href="/trending">
            <span className="text-white hover:text-red-400 transition-colors font-semibold">
              🔥 Tendances
            </span>
          </Link>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="text-white hover:text-green-400 transition-colors font-semibold cursor-pointer"
          >
            ℹ️ À propos
          </button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>

        {isMounted && isOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 border-b border-gray-700 p-6 md:hidden">
            <div className="space-y-4">
              <Link href="/">
                <span className="block text-white hover:text-blue-400 transition-colors cursor-pointer font-semibold">
                  Accueil
                </span>
              </Link>
              <Link href="/discover">
                <span className="block text-white hover:text-purple-400 transition-colors font-semibold">
                  🌟 Découvrir
                </span>
              </Link>
              <Link href="/shorts">
                <span className="block text-white hover:text-yellow-400 transition-colors font-semibold">
                  🎬 Extraits
                </span>
              </Link>
              <Link href="/trending">
                <span className="block text-white hover:text-red-400 transition-colors font-semibold">
                  🔥 Tendances
                </span>
              </Link>
              <button
                onClick={() => {
                  setIsAboutOpen(true);
                  setIsOpen(false);
                }}
                className="block w-full text-left text-white hover:text-green-400 transition-colors font-semibold cursor-pointer"
              >
                ℹ️ À propos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modale À propos */}
      {isMounted && isAboutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">À propos</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Contenu */}
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  💡 La Curiosité Derrière Ce Projet
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Ce projet est né d'un problème simple mais fondamental : 
                  <span className="font-semibold"> comment regrouper tous les films et séries TV dans un seul endroit? </span>
                  J'ai souhaité créer une plateforme centralisée où les utilisateurs 
                  pourraient facilement découvrir, rechercher et explorer des contenus cinématographiques. 
                  Avec accès aux <span className="font-semibold">bandes-annonces</span>, 
                  <span className="font-semibold"> casting complet</span>, 
                  <span className="font-semibold"> synopsis détaillés</span>, 
                  et <span className="font-semibold"> recommandations intelligentes</span>. 
                  Ce projet combine innovation technique avec une expérience utilisateur intuitive pour transformer 
                  la manière dont on recherche et découvre le divertissement.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  👨‍💼 Créateur
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <p className="text-xl font-bold text-gray-800">
                    Rodrigue N'GUESSAN
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Développeur Full Stack | Passionné par l'Innovation Web
                  </p>
                </div>
              </div>



              <div className="border-t border-gray-200 pt-6 bg-blue-50 -mx-8 -mb-8 px-8 py-6 rounded-b-lg">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  🚀 Version Actuelle
                </h3>
                <p className="text-gray-700">
                  Ciné Now v1.0 - Une plateforme complète pour découvrir le cinéma et les séries TV
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
