import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ title, subtitle, description, centered = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      {subtitle && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-600 dark:text-purple-300 text-sm font-medium mb-4">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;