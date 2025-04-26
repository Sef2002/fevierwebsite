import React from 'react';
import { motion } from 'framer-motion';
import type { Service } from '@/lib/types';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        relative rounded-lg overflow-hidden cursor-pointer
        ${isSelected ? 'ring-2 ring-[#9333ea]' : 'ring-1 ring-gray-200'}
      `}
    >
      <img
        src={service.image_url}
        alt={service.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold">{service.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-[#9333ea] font-medium">
            {new Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: 'EUR'
            }).format(service.price)}
          </span>
          <span className="text-sm text-gray-500">
            {service.duration} min
          </span>
        </div>
      </div>
    </motion.div>
  );
}