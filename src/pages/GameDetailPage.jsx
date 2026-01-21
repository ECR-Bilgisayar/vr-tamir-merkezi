import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameVideoDialog from '@/components/GameVideoDialog';
import GameCard from '@/components/GameCard';
import { games } from '@/data/games';

const GameDetailPage = () => {
  const { slug } = useParams();
  const game = games.find(g => g.slug === slug);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  if (!game) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Oyun Bulunamadı</h2>
          <Link to="/oyunlar">
            <Button>Oyunlara Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedGames = games
    .filter(g => g.id !== game.id && g.category === game.category)
    .slice(0, 3);

  const platformColors = {
    Meta: 'bg-blue-500',
    HTC: 'bg-green-500',
    PSVR: 'bg-purple-500',
    Samsung: 'bg-orange-500'
  };

  return (
    <>
      <Helmet>
        <title>{game.name} - VR Oyunu | VR Kiralama</title>
        <meta name="description" content={game.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/oyunlar">
            <Button variant="ghost" className="mb-8 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Oyunlara Dön
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 group cursor-pointer shadow-lg dark:shadow-none"
              onClick={() => setIsVideoOpen(true)}
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 rounded-full bg-purple-500/90 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-10 h-10 text-white" fill="white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-sm font-medium mb-4">
                  {game.category === 'action' ? 'Aksiyon' : 
                   game.category === 'puzzle' ? 'Bulmaca' : 
                   game.category === 'sports' ? 'Spor' : 'Macera'}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{game.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{game.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-500 dark:text-gray-400">Yaş Sınırı:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{game.ageRating}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-500 dark:text-gray-400">Oyun Alanı:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{game.playArea}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block mb-2">Desteklenen Platformlar:</span>
                    <div className="flex flex-wrap gap-2">
                      {game.platform.map((platform) => (
                        <span
                          key={platform}
                          className={`px-3 py-1.5 rounded-lg ${platformColors[platform] || 'bg-gray-500'} text-white text-sm font-semibold`}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block mb-2">Önerilen Senaryo:</span>
                    <span className="inline-block px-4 py-2 rounded-lg bg-purple-100 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-blue-500/20 text-purple-600 dark:text-purple-300 font-semibold">
                      {game.scenario}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block mb-2">Zorluk Seviyesi:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{game.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setIsVideoOpen(true)}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Oynanış Videosunu İzle
                </Button>
                <Link to="/iletisim" className="block">
                  <Button size="lg" variant="outline" className="w-full border-2 border-purple-500/50 hover:bg-purple-100 dark:hover:bg-purple-500/10 text-purple-600 dark:text-white font-semibold">
                    Bu Oyunla Teklif Al
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {relatedGames.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Benzer Oyunlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedGames.map((relatedGame, index) => (
                  <GameCard
                    key={relatedGame.id}
                    game={relatedGame}
                    index={index}
                    onVideoClick={() => {
                      setIsVideoOpen(false);
                      setTimeout(() => {
                        window.location.href = `/oyunlar/${relatedGame.slug}`;
                      }, 100);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <GameVideoDialog
        game={game}
        open={isVideoOpen}
        onOpenChange={setIsVideoOpen}
      />
    </>
  );
};

export default GameDetailPage;
