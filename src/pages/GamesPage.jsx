
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import GameCard from '@/components/GameCard';
import GameVideoDialog from '@/components/GameVideoDialog';
import FiltersBar from '@/components/FiltersBar';
import { games } from '@/data/games';

const GamesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [filters, setFilters] = useState({
    platform: 'all',
    ageRating: 'all'
  });

  const categories = [
    { value: 'all', label: 'Tümü' },
    { value: 'action', label: 'Aksiyon' },
    { value: 'puzzle', label: 'Bulmaca' },
    { value: 'sports', label: 'Spor' },
    { value: 'adventure', label: 'Macera' }
  ];

  const filterOptions = [
    {
      name: 'platform',
      label: 'Tüm Platformlar',
      value: filters.platform,
      options: [
        { value: 'Meta', label: 'Meta Quest' },
        { value: 'HTC', label: 'HTC Vive' },
        { value: 'PSVR', label: 'PlayStation VR' },
        { value: 'Samsung', label: 'Samsung Gear' }
      ]
    },
    {
      name: 'ageRating',
      label: 'Tüm Yaşlar',
      value: filters.ageRating,
      options: [
        { value: '7+', label: '7+ Yaş' },
        { value: '12+', label: '12+ Yaş' },
        { value: '13+', label: '13+ Yaş' },
        { value: '16+', label: '16+ Yaş' },
        { value: '18+', label: '18+ Yaş' }
      ]
    }
  ];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filters.platform === 'all' || game.platform.includes(filters.platform);
    const matchesAge = filters.ageRating === 'all' || game.ageRating === filters.ageRating;
    
    return matchesCategory && matchesSearch && matchesPlatform && matchesAge;
  });

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

      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Oyun Kütüphanesi"
            title="100+ VR Oyunu ve Deneyim"
            description="Her yaşa ve ilgi alanına uygun zengin VR içerik kataloğu"
          />

          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <FiltersBar filters={filterOptions} onFilterChange={handleFilterChange} />
          </div>

          {filteredGames.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Aradığınız kriterlere uygun oyun bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={index}
                  onVideoClick={handleGameVideoClick}
                />
              ))}
            </div>
          )}
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
