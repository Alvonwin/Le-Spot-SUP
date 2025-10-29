"use client";

import { MapPin, Award, AlertTriangle, Wind, Droplet, Navigation2 } from "lucide-react";

interface SpotRecommendation {
  spot: {
    id: number;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    description?: string;
  };
  score: number;
  factors: {
    wind: number;
    temperature: number;
    waterType: number;
    distance: number;
    experience: number;
  };
  warnings: string[];
}

interface Props {
  recommendations: SpotRecommendation[];
  onSelectSpot: (spot: any) => void;
}

export default function SpotRecommendations({ recommendations, onSelectSpot }: Props) {
  if (recommendations.length === 0) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <p className="text-gray-300">
          Aucune recommandation disponible. Vérifiez votre position.
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-green-500/20";
    if (score >= 70) return "bg-yellow-500/20";
    return "bg-orange-500/20";
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-ocean-light/20 p-4 rounded-lg border border-ocean-light/30">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-6 h-6 text-ocean-light" />
          <h3 className="font-bold text-white">Meilleurs Spots en Ce Moment</h3>
        </div>
        <p className="text-sm text-gray-300">
          Basé sur les conditions météo actuelles et votre niveau
        </p>
      </div>

      {/* Recommendations List */}
      {recommendations.map((rec, index) => (
        <div
          key={rec.spot.id}
          className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
          onClick={() => onSelectSpot(rec.spot)}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getMedalEmoji(index)}</span>
              <div>
                <h4 className="font-bold text-white">{rec.spot.name}</h4>
                <p className="text-xs text-gray-400">{rec.spot.description}</p>
              </div>
            </div>
            <div className={`${getScoreBgColor(rec.score)} px-3 py-1 rounded-full`}>
              <span className={`font-bold text-lg ${getScoreColor(rec.score)}`}>
                {rec.score}/100
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="px-4 py-2 bg-gray-900/50">
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <MapPin size={16} className="mt-0.5 flex-shrink-0 text-ocean-light" />
              <span>{rec.spot.location}</span>
            </div>
          </div>

          {/* Factors - Simple Bar */}
          <div className="px-4 py-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Wind size={12} className="text-ocean-light" />
                  <span className="text-gray-400">Vent</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      rec.factors.wind >= 80 ? "bg-green-500" : rec.factors.wind >= 60 ? "bg-yellow-500" : "bg-orange-500"
                    }`}
                    style={{ width: `${rec.factors.wind}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Droplet size={12} className="text-ocean-light" />
                  <span className="text-gray-400">T° Eau</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      rec.factors.temperature >= 80 ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${rec.factors.temperature}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Navigation2 size={12} className="text-ocean-light" />
                  <span className="text-gray-400">Distance</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-ocean-light h-1.5 rounded-full"
                    style={{ width: `${rec.factors.distance}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {rec.warnings.length > 0 && (
            <div className="px-4 pb-3">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                {rec.warnings.map((warning, idx) => (
                  <p key={idx} className="text-xs text-yellow-200 mb-1 last:mb-0">
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Safety Footer */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-300 mb-2">Sécurité Obligatoire</h4>
            <ul className="text-xs text-red-200 space-y-1">
              <li>🦺 VFI (gilet de sauvetage) - À PORTER en permanence</li>
              <li>📢 Sifflet attaché au VFI</li>
              <li>🔦 Lampe étanche (navigation de nuit)</li>
              <li>🏄 Leash de cheville (attache planche-jambe)</li>
              <li>👥 Ne partez JAMAIS seul sans prévenir quelqu'un</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
