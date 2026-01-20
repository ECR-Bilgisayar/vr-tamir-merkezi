
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Users, Shield, Headphones, Package, TrendingUp, 
  Award, Store, Building2, School, FileSearch, Settings, 
  PackageCheck, Clock 
} from 'lucide-react';

const iconMap = {
  Zap, Users, Shield, Headphones, Package, TrendingUp, 
  Award, Store, Building2, School, FileSearch, Settings, 
  PackageCheck, Clock
};

const FeatureGrid = ({ features }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const Icon = iconMap[feature.icon] || Zap;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeatureGrid;
