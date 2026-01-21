import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import GameCard from '@/components/GameCard';
import GameVideoDialog from '@/components/GameVideoDialog';
import { games } from '@/data/games';

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleGameVideoClick = (game) => {
    setSelectedGame(game);
    setIsVideoOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>VR Oyunları - 100+ VR Oyun ve Deneyim | VR Kiralama</title>
        <meta name="description" content="Beat Saber, Superhot VR, Job Simulator ve 100'den fazla VR oyunu. Her yaş ve ilgi alanına uygun zengin VR oyun kütüphanesi." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="100+ VR Oyunu ve Deneyim"
            description="Her yaşa ve ilgi alanına uygun zengin VR içerik kataloğu"
          />

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
                onVideoClick={handleGameVideoClick}
              />
            ))}
          </div>
        </div>
      </div>

      <GameVideoDialog
        game={selectedGame}
        open={isVideoOpen}
        onOpenChange={setIsVideoOpen}
      />
    </>
  );
};

export default GamesPage;