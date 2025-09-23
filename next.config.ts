import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Otimizações para reduzir problemas de permissão
    optimizeCss: false,
  },
  // Configurações para melhor compatibilidade com Windows
  webpack: (config, { dev }) => {
    if (dev) {
      // Desabilita algumas otimizações em desenvolvimento para reduzir uso de arquivos
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // Otimizações para navegação mais rápida
  compiler: {
    // Remove console.log em produção
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
