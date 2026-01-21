import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GameCard = ({ game, index, onVideoClick }) => {
  const platformColors = {
    Meta: 'bg-blue-500',
    HTC: 'bg-green-500',
    PSVR: 'bg-purple-500',
    Samsung: 'bg-orange-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group rounded-2xl overflow-hidden 
        bg-white dark:bg-[#0d1229]
        border border-gray-200 dark:border-white/10 
        shadow-sm dark:shadow-none
        hover:border-purple-500/30 transition-all"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-white/5">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Play Button Overlay */}
        <button
          onClick={() => onVideoClick && onVideoClick(game)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
        >
          <div className="w-16 h-16 rounded-full bg-purple-500/90 backdrop-blur-sm flex items-center justify-center hover:bg-purple-600/90 transition-colors">
            <Play className="w-8 h-8 text-white" fill="white" />
          </div>
        </button>

        {/* Platform Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {game.platform.map((platform) => (
            <span
              key={platform}
              className={`px-2 py-1 rounded-lg ${platformColors[platform] || 'bg-gray-500'} text-white text-xs font-semibold`}
            >
              {platform}
            </span>
          ))}
        </div>

        {/* Age Rating */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full bg-purple-500/90 backdrop-blur-sm text-white text-xs font-semibold flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{game.ageRating}</span>
          </span>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-transparent">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {game.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {game.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
            {game.category === 'action' ? 'Aksiyon' : 
             game.category === 'puzzle' ? 'Bulmaca' : 
             game.category === 'sports' ? 'Spor' : 'Macera'}
          </span>
          <Link to={`/oyunlar/${game.slug}`}>
            <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-white/5">
              Detaylar
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;