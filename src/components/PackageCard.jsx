
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Rocket, Briefcase, Building2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap = {
  Rocket, Briefcase, Building2, Package
};

const PackageCard = ({ package: pkg, index }) => {
  const Icon = iconMap[pkg.icon] || Package;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={`relative p-8 rounded-3xl border backdrop-blur-sm transition-all ${
        pkg.popular
          ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/50 shadow-lg shadow-purple-500/20'
          : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-purple-500/30'
      }`}
    >
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold shadow-lg">
            En Popüler
          </span>
        </div>
      )}

      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl font-bold mb-2 text-white">{pkg.name}</h3>
      <p className="text-gray-400 mb-4">{pkg.subtitle}</p>
      <div className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        {pkg.price}
      </div>

      <ul className="space-y-3 mb-8">
        {pkg.features.slice(0, 5).map((feature, i) => (
          <li key={i} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Link to="/paketler">
        <Button className={`w-full ${
          pkg.popular
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
            : 'bg-white/10 hover:bg-white/20'
        } text-white font-semibold`}>
          Detaylı İncele
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
};

export default PackageCard;
