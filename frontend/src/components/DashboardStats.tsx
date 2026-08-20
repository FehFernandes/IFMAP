import React, { useState, useEffect } from 'react';
import { locationService, sectorService, serviceService, photoService, phoneService, newsService } from '../services/api';

interface DashboardStatsProps {
  onNavigate?: (tab: string) => void;
}

interface StatCardProps {
  title: string;
  value: number;
  color: string;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, loading }) => {
  return (
    <div className={`rounded-xl shadow-lg p-6 ${color}`}>
      <div>
        <p className="text-sm font-medium text-white/90 mb-2">{title}</p>
        {loading ? (
          <div className="w-16 h-8 bg-white/20 animate-pulse rounded"></div>
        ) : (
          <p className="text-4xl font-bold text-white">{value}</p>
        )}
      </div>
    </div>
  );
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    locations: 0,
    sectors: 0,
    services: 0,
    photos: 0,
    phones: 0,
    news: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [locationsRes, sectorsRes, servicesRes, photosRes, phonesRes, newsRes] = await Promise.all([
        locationService.getLocations(),
        sectorService.getSectors(),
        serviceService.getServices(),
        photoService.getPhotos(),
        phoneService.getPhones(),
        newsService.getAll(),
      ]);

      setStats({
        locations: locationsRes.data?.length || 0,
        sectors: sectorsRes.data?.length || 0,
        services: servicesRes.data?.length || 0,
        photos: photosRes.data?.length || 0,
        phones: phonesRes.data?.length || 0,
        news: newsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: 'Total de Localizações',
      value: stats.locations,
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
    },
    {
      title: 'Total de Setores',
      value: stats.sectors,
      color: 'bg-gradient-to-br from-purple-500 to-purple-700',
    },
    {
      title: 'Total de Serviços',
      value: stats.services,
      color: 'bg-gradient-to-br from-green-500 to-green-700',
    },
    {
      title: 'Total de Fotos',
      value: stats.photos,
      color: 'bg-gradient-to-br from-pink-500 to-pink-700',
    },
    {
      title: 'Total de Telefones',
      value: stats.phones,
      color: 'bg-gradient-to-br from-orange-500 to-orange-700',
    },
    {
      title: 'Total de Notícias',
      value: stats.news,
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-700',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Visão Geral</h2>
        <p className="text-gray-600">Estatísticas gerais do sistema IFMAP</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            loading={loading}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <button 
            onClick={() => onNavigate?.('locations')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-blue-200 bg-blue-50 transition-all duration-200 active:scale-95"
          >
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-blue-700">Nova Localização</span>
          </button>
          
          <button 
            onClick={() => onNavigate?.('sectors')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-purple-200 bg-purple-50 transition-all duration-200 active:scale-95"
          >
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-purple-700">Novo Setor</span>
          </button>

          <button 
            onClick={() => onNavigate?.('services')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-green-200 bg-green-50 transition-all duration-200 active:scale-95"
          >
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-green-700">Novo Serviço</span>
          </button>

          <button 
            onClick={() => onNavigate?.('photos')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-pink-200 bg-pink-50 transition-all duration-200 active:scale-95"
          >
            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-pink-700">Nova Foto</span>
          </button>

          <button 
            onClick={() => onNavigate?.('phones')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-orange-200 bg-orange-50 transition-all duration-200 active:scale-95"
          >
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-orange-700">Novo Telefone</span>
          </button>

          <button 
            onClick={() => onNavigate?.('news')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-cyan-200 bg-cyan-50 transition-all duration-200 active:scale-95"
          >
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-cyan-700">Nova Notícia</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
