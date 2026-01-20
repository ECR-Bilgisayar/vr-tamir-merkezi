
import React from 'react';
import { motion } from 'framer-motion';

const StepProcess = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-purple-500 to-blue-500 -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div key={index} className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive || isCompleted ? '#a855f7' : '#1e293b',
                  borderColor: isActive ? '#3b82f6' : 'transparent'
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 ${
                  isActive || isCompleted ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 border-gray-700'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </motion.div>
              <span className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-purple-400' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProcess;
