"use client";

import { Anchor, Cloud, CheckCircle, Package, Search, Droplet, Phone, LifeBuoy, Eye, Wind, User, Sun, CloudRain, CloudLightning, CloudFog } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-light/10 to-white dark:from-ocean-dark dark:to-gray-900">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-ocean-dark via-ocean to-ocean-dark text-white py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full animate-pulse delay-75"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full animate-pulse delay-150"></div>
        </div>
        <div className="relative z-10">
          <div className="text-6xl mb-4">🏄‍♂️</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Le Guide Ultime du SUP
          </h1>
          <p className="text-2xl text-ocean-light font-light">
            Votre référence pour un moment sûr et génial sur l'eau.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Les 8 Règles d'Or du Paddle */}
        <section className="relative bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl border-4 border-yellow-400 dark:border-yellow-600 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-300 dark:bg-yellow-600 rounded-full blur-3xl opacity-20"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <Anchor className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-1">⭐ RÈGLES ESSENTIELLES</div>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  Les 8 Règles d'Or du Paddle
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="group bg-white dark:bg-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-l-4 border-yellow-500">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      🦺 Porte toujours ton VFI
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Un VFI (gilet de sauvetage) et un sifflet sont obligatoires au Canada. Le porter est la norme.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-l-4 border-blue-500">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      🔗 Utilise ta laisse (leash)
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Elle te connecte à ta planche, ton flotteur principal. Leash à la cheville en eau plate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-l-4 border-cyan-500">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      ⛅ Check la météo
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Vent, pluie, orages. Évite les vents de plus de 20 km/h. Méfie-toi du vent de dos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-l-4 border-green-500">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      📱 Informe quelqu'un de ton plan
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Dis où tu vas et quand tu rentres. Garde ton téléphone chargé avec la géolocalisation activée.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-l-4 border-purple-500">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      👀 Reste conscient de ton environnement
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Évite les zones de bateaux à moteur et les courants forts. Apprends à remonter rapidement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-l-4 border-pink-500">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    6
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      🥶 Habille-toi pour l'eau, pas pour l'air
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Si l'eau est à moins de 15 °C, le wetsuit n'est pas une option. L'hypothermie est rapide.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-l-4 border-indigo-500">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    7
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      💪 Connais tes limites
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Pas besoin de jouer les héros. Si tu es fatigué, assieds-toi, respire, et rentre.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-l-4 border-red-500">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                    8
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      🚫 Pas d'alcool, pas de drogue
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Pagayer sous influence est illégal et extrêmement dangereux. Une très mauvaise idée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Avant de Partir */}
        <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl border-4 border-green-400 dark:border-green-600 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-300 dark:bg-green-600 rounded-full blur-3xl opacity-20"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">✅ PRÉPARATION</div>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  Avant de Partir
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <Cloud className="w-12 h-12 text-green-500 mb-3" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  ⛅ Vérifier la météo
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Consultez les prévisions météo et les conditions de l'eau (vent, vagues, courant).
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <Phone className="w-12 h-12 text-blue-500 mb-3" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  📞 Informer un proche
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Communiquez votre itinéraire et l'heure estimée de votre retour à quelqu'un.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <Package className="w-12 h-12 text-purple-500 mb-3" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  👕 S'habiller intelligemment
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Portez des vêtements adaptés à la température de l'eau, pas seulement de l'air.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <Search className="w-12 h-12 text-orange-500 mb-3" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  🔍 Inspecter son matériel
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Vérifiez l'état de votre planche, de votre pagaie et de votre leash avant chaque sortie.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Équipement Essentiel */}
        <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl border-4 border-blue-400 dark:border-blue-600">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <LifeBuoy className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">🎒 ÉQUIPEMENT</div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Équipement Essentiel
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <Anchor className="w-10 h-10 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                    🔗 Le Leash
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    C'est votre ligne de vie. Il vous empêche d'être séparé de votre planche, qui est votre principale source de flottaison.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <LifeBuoy className="w-10 h-10 text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                    🦺 Vêtement de Flottaison (VFI)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Portez-le. Dans de nombreuses régions, c'est la loi, mais c'est surtout une assurance-vie.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <Phone className="w-10 h-10 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                    📱 Communication
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Emportez un téléphone dans une pochette étanche ou une radio VHF pour pouvoir appeler à l'aide.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <Droplet className="w-10 h-10 text-cyan-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                    💧 Hydratation et Protection
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Apportez de l'eau, de la crème solaire, un chapeau et une petite trousse de premiers soins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sur l'Eau */}
        <section className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl border-4 border-purple-400 dark:border-purple-600">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <Wind className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">🌊 EN ACTION</div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Sur l'Eau
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <Eye className="w-12 h-12 text-purple-500 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                👁️ Être attentif
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Soyez conscient de votre environnement : autres embarcations, nageurs, animaux et obstacles sous-marins.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <Wind className="w-12 h-12 text-cyan-500 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                💨 Comprendre les éléments
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Le vent et le courant peuvent vous épuiser rapidement. Pagayer contre le vent est bien plus difficile.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <User className="w-12 h-12 text-orange-500 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                🏊 Maîtriser la remontée
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Entraînez-vous à remonter sur votre planche rapidement et efficacement. C'est une compétence de base.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <User className="w-12 h-12 text-green-500 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                💪 Écouter son corps
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Restez hydraté, mangez une collation si nécessaire et n'hésitez pas à faire des pauses.
              </p>
            </div>
          </div>
        </section>

        {/* Vigilance Météo */}
        <section className="relative bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl border-4 border-orange-400 dark:border-orange-600 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <Sun className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">🌤️ MÉTÉO</div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Vigilance Météo
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <Sun className="w-12 h-12 text-orange-500 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                ☀️ Se protéger du soleil
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                La réverbération sur l'eau augmente l'exposition aux UV. Crème solaire, chapeau et lunettes sont indispensables.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <CloudRain className="w-12 h-12 text-blue-500 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                🌧️ Anticiper les changements
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Le temps peut changer très vite sur l'eau. Si le ciel s'assombrit ou que le vent se lève, rentrez.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <CloudLightning className="w-12 h-12 text-yellow-500 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                ⚡ Éviter les orages
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Ne pagayez jamais pendant un orage. Vous êtes le point le plus haut sur l'eau.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <CloudFog className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                🌫️ Attention au brouillard
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Le brouillard peut être très désorientant. Si la visibilité diminue, restez près du bord et utilisez une boussole ou un GPS.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
