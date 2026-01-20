
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';

const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all"
        >
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          <Quote className="w-8 h-8 text-purple-400/30 mb-3" />

          <p className="text-gray-300 text-sm mb-6 italic">
            "{testimonial.text}"
          </p>

          <div className="flex items-center space-x-3">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold">{testimonial.name}</p>
              <p className="text-gray-400 text-xs">{testimonial.role}</p>
              <p className="text-purple-400 text-xs">{testimonial.company}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Testimonials;
