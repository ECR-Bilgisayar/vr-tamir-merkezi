
import React from 'react';
import { Check, X } from 'lucide-react';
import { packages } from '@/data/packages';

const ComparisonTable = () => {
  const features = [
    { key: 'device', label: 'VR Başlıkları' },
    { key: 'games', label: 'Oyun Kütüphanesi' },
    { key: 'setup', label: 'Kurulum' },
    { key: 'staff', label: 'Teknik Personel' },
    { key: 'area', label: 'Alan Desteği' },
    { key: 'delivery', label: 'Teslimat' },
    { key: 'hygiene', label: 'Hijyen' },
    { key: 'support', label: 'Teknik Destek' }
  ];

  return (
    <div className="overflow-x-auto rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-4 text-left text-white font-semibold">Özellik</th>
            {packages.map((pkg) => (
              <th key={pkg.id} className="p-4 text-center text-white font-semibold">
                <div className="flex flex-col items-center">
                  <span>{pkg.name}</span>
                  {pkg.popular && (
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-purple-500 text-xs">
                      Popüler
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={feature.key} className={index !== features.length - 1 ? 'border-b border-white/5' : ''}>
              <td className="p-4 text-gray-300 font-medium">{feature.label}</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 text-center text-gray-400 text-sm">
                  {pkg.detailedFeatures[feature.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
