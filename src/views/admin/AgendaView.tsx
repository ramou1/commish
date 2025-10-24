// src/views/admin/AgendaView.tsx
'use client'

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export default function AgendaView() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Dados mockados para demonstração - substituir por dados reais do Firebase
  const statsData = {
    totalUsers: 1847,
    totalCompanies: 342,
    activeFluxos: 5621,
    totalVolume: 12847320.50,
    pendingApprovals: 47,
    completedPayments: 2134,
    overduePayments: 23,
    averageTicket: 2287.45,
  };

  const recentActivity = [
    { id: 1, type: 'new_user', user: 'João Silva', company: 'Tech Corp', date: new Date(), status: 'success' },
    { id: 2, type: 'new_fluxo', user: 'Maria Santos', company: 'Vendas Plus', date: new Date(Date.now() - 3600000), status: 'pending' },
    { id: 3, type: 'payment', user: 'Carlos Souza', company: 'Inovação Ltda', date: new Date(Date.now() - 7200000), status: 'success' },
    { id: 4, type: 'approval', user: 'Ana Costa', company: 'Premium Sales', date: new Date(Date.now() - 10800000), status: 'success' },
    { id: 5, type: 'new_company', user: 'Pedro Lima', company: 'Nova Era', date: new Date(Date.now() - 14400000), status: 'success' },
  ];

  const topCompanies = [
    { name: 'Tech Corp', users: 234, volume: 1847320.50, growth: 12.5 },
    { name: 'Vendas Plus', users: 189, volume: 1523450.30, growth: 8.3 },
    { name: 'Inovação Ltda', users: 156, volume: 1234567.80, growth: 15.2 },
    { name: 'Premium Sales', users: 142, volume: 987654.20, growth: -3.1 },
    { name: 'Nova Era', users: 128, volume: 876543.10, growth: 22.8 },
  ];

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: Date) => {
    const agora = new Date();
    const diff = agora.getTime() - data.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    
    if (minutos < 60) return `${minutos} min atrás`;
    if (horas < 24) return `${horas}h atrás`;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_user': return <Users className="w-4 h-4 text-blue-500" />;
      case 'new_company': return <Building2 className="w-4 h-4 text-purple-500" />;
      case 'new_fluxo': return <FileText className="w-4 h-4 text-orange-500" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'approval': return <CheckCircle className="w-4 h-4 text-teal-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: typeof recentActivity[0]) => {
    switch (activity.type) {
      case 'new_user': return `${activity.user} se cadastrou`;
      case 'new_company': return `${activity.company} criou conta empresarial`;
      case 'new_fluxo': return `${activity.user} criou novo fluxo em ${activity.company}`;
      case 'payment': return `Pagamento processado para ${activity.user}`;
      case 'approval': return `${activity.company} aprovou fluxo de ${activity.user}`;
      default: return 'Atividade desconhecida';
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simular carregamento - aqui você faria a chamada real ao Firebase
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Visão geral da plataforma Commish
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 border-gray-200 text-gray-700"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-gray-200 text-gray-700">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtro de Período */}
      <div className="flex gap-2">
        <Button 
          variant={selectedPeriod === '7d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('7d')}
          className={selectedPeriod === '7d' ? 'bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] text-white' : ''}
        >
          7 dias
        </Button>
        <Button 
          variant={selectedPeriod === '30d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('30d')}
          className={selectedPeriod === '30d' ? 'bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] text-white' : ''}
        >
          30 dias
        </Button>
        <Button 
          variant={selectedPeriod === '90d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('90d')}
          className={selectedPeriod === '90d' ? 'bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] text-white' : ''}
        >
          90 dias
        </Button>
        <Button 
          variant={selectedPeriod === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('all')}
          className={selectedPeriod === 'all' ? 'bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] text-white' : ''}
        >
          Tudo
        </Button>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Usuários */}
        <Card className="border border-gray-200 hover:border-blue-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                +12.5%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total de Usuários</p>
            <p className="text-2xl font-bold text-gray-900">
              {statsData.totalUsers.toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        {/* Total de Empresas */}
        <Card className="border border-gray-200 hover:border-purple-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                +8.3%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total de Empresas</p>
            <p className="text-2xl font-bold text-gray-900">
              {statsData.totalCompanies.toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        {/* Fluxos Ativos */}
        <Card className="border border-gray-200 hover:border-green-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                +15.2%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Fluxos Ativos</p>
            <p className="text-2xl font-bold text-gray-900">
              {statsData.activeFluxos.toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        {/* Volume Total */}
        <Card className="border border-gray-200 hover:border-emerald-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                +22.8%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Volume Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatarMoeda(statsData.totalVolume)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes Aprovação</p>
                <p className="text-xl font-bold text-orange-600">
                  {statsData.pendingApprovals}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagamentos Concluídos</p>
                <p className="text-xl font-bold text-green-600">
                  {statsData.completedPayments.toLocaleString('pt-BR')}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagamentos Atrasados</p>
                <p className="text-xl font-bold text-red-600">
                  {statsData.overduePayments}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatarMoeda(statsData.averageTicket)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid com 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">
                      {getActivityText(activity)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatarData(activity.date)}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      activity.status === 'success' 
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-orange-50 text-orange-700 border-orange-200'
                    }
                  >
                    {activity.status === 'success' ? 'Sucesso' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-gray-200 text-gray-700"
            >
              Ver todas as atividades
            </Button>
          </CardContent>
        </Card>

        {/* Top Empresas */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Empresas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {company.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {company.users} usuários • {formatarMoeda(company.volume)}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      company.growth > 0
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }
                  >
                    {company.growth > 0 ? '+' : ''}{company.growth}%
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-gray-200 text-gray-700"
            >
              Ver todas as empresas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">Gerenciar Usuários</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
            >
              <Building2 className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">Gerenciar Empresas</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
            >
              <FileText className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium">Ver Fluxos</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
            >
              <BarChart3 className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}