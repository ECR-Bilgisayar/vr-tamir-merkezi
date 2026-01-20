
import React from 'react';
import { Filter } from 'lucide-react';

const FiltersBar = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm">
      <div className="flex items-center space-x-2 text-purple-400">
        <Filter className="w-5 h-5" />
        <span className="font-semibold">Filtrele:</span>
      </div>

      {filters.map((filter) => (
        <select
          key={filter.name}
          value={filter.value}
          onChange={(e) => onFilterChange(filter.name, e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
        >
          <option value="all">{filter.label}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default FiltersBar;
