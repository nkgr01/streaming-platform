'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pathname = usePathname();

  // Charger l'état de visibilité et monter le composant
  useEffect(() => {
    const hidden = localStorage.getItem('aboutModalHidden') === 'true';
    setIsHidden(hidden);
    setIsMounted(true);
  }, []);

  // Sauvegarder l'état caché
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aboutModalHidden', JSON.stringify(isHidden));
    }
  }, [isHidden, isMounted]);

  // Ne montrer que sur la page d'accueil
  if (!isMounted || pathname !== '/' || isHidden) {
    return null;
  }

  return (
    <>
      {/* Bouton flottant en bas à gauche */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-xl font-bold z-40"
        title="À propos de ce projet"
      >
        ℹ️
      </button>

      {/* Modale */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">À propos de ce projet</h2>
              <button
                onClick={() => setIsOpen(false)}
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

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  🛠️ Technologies Utilisées
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Next.js 16</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">React 19</span>
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">TMDB API</span>
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsHidden(true);
                }}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Ne plus afficher
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
