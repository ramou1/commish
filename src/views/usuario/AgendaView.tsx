// src/views/usuario/AgendaView.tsx
'use client'

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NovoFluxoForm } from '@/components/modals/fluxo-new-modal';
import { FluxoDetalhesModal } from '@/components/modals/fluxo-details-modal';
import { 
  Plus, 
  Filter,
  Download,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { FluxoComissao } from '@/types/fluxo';
import { colors } from '@/constants/fluxos-mock';
import { NovoFluxoFormData } from '@/types/fluxo';
import { 
  criarDataLocal, 
  gerarDatasPagamento
} from '@/lib/dateUtils';
import { useAuth } from '@/contexts/AuthContext';
import { createFluxo, getFluxosByUserId } from '@/lib/firebase';
import { convertFormDataToFirebase, convertFirebaseFluxosToComissao } from '@/lib/fluxoUtils';

export default function AgendaView() {
  const { user } = useAuth();
  const [firebaseFluxos, setFirebaseFluxos] = useState<FluxoComissao[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedFluxo, setSelectedFluxo] = useState<FluxoComissao | null>(null);

  // Carregar fluxos do Firebase quando o usuário estiver logado
  useEffect(() => {
    const loadFirebaseFluxos = async () => {
      if (user?.uid) {
        try {
          setIsLoading(true);
          const firebaseData = await getFluxosByUserId(user.uid);
          const convertedFluxos = convertFirebaseFluxosToComissao(firebaseData);
          setFirebaseFluxos(convertedFluxos);
        } catch (error) {
          console.error('Erro ao carregar fluxos do Firebase:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadFirebaseFluxos();
  }, [user?.uid]);

  // Usar apenas os fluxos do Firebase
  const allFluxos = useMemo(() => {
    return firebaseFluxos;
  }, [firebaseFluxos]);

  // Calcular apenas os meses que têm fluxos ativos
  const months = useMemo(() => {
    const activeFluxos = allFluxos.filter(f => f.status === 'ativo');
    
    if (activeFluxos.length === 0) {
      return [];
    }

    // Criar um Set com todos os meses únicos que têm pagamentos
    const monthsSet = new Set<string>();
    
    activeFluxos.forEach(fluxo => {
      const paymentDate = fluxo.proximoPagamento instanceof Date 
        ? fluxo.proximoPagamento 
        : new Date(fluxo.proximoPagamento);
      const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
      monthsSet.add(monthKey);
    });

    // Converter para array de Dates e ordenar
    const monthsArray = Array.from(monthsSet)
      .map(monthKey => {
        const [year, month] = monthKey.split('-').map(Number);
        return new Date(year, month - 1, 1);
      })
      .sort((a, b) => a.getTime() - b.getTime());

    return monthsArray;
  }, [allFluxos]);

  // Função para agrupar fluxos por mês
  const groupFluxosByMonth = () => {
    const grouped: { [key: string]: FluxoComissao[] } = {};
    
    allFluxos.forEach(fluxo => {
      if (fluxo.status === 'ativo') {
        const paymentDate = fluxo.proximoPagamento instanceof Date 
          ? fluxo.proximoPagamento 
          : new Date(fluxo.proximoPagamento);
        const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
        if (!grouped[monthKey]) {
          grouped[monthKey] = [];
        }
        grouped[monthKey].push(fluxo);
      }
    });
    
    // Ordenar fluxos por data dentro de cada mês
    Object.keys(grouped).forEach(monthKey => {
      grouped[monthKey].sort((a, b) => {
        const dateA = a.proximoPagamento instanceof Date 
          ? a.proximoPagamento 
          : new Date(a.proximoPagamento);
        const dateB = b.proximoPagamento instanceof Date 
          ? b.proximoPagamento 
          : new Date(b.proximoPagamento);
        return dateA.getTime() - dateB.getTime();
      });
    });
    
    return grouped;
  };

  const fluxosPorMes = groupFluxosByMonth();

  // Calcular total por mês
  const calcularTotalMes = (monthKey: string) => {
    const fluxosDoMes = fluxosPorMes[monthKey] || [];
    return fluxosDoMes.reduce((total, fluxo) => total + fluxo.valor, 0);
  };

  // Navegar entre meses
  const handlePrevMonth = () => {
    setCurrentMonthIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex(prev => Math.min(months.length - 1, prev + 1));
  };

  // Calcular quantas colunas mostrar
  const getColumnCount = () => {
    if (typeof window === 'undefined') return 3;
    
    const width = window.innerWidth;
    if (width >= 1536) return 5;
    if (width >= 1280) return 4;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  const columnCount = getColumnCount();
  const visibleMonths = months.slice(currentMonthIndex, currentMonthIndex + columnCount);

  const handleNovoFluxo = async (formData: NovoFluxoFormData) => {
    if (!user?.uid) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      setIsLoading(true);

      // Atribuir cor automaticamente se não fornecida
      const corAuto = colors[firebaseFluxos.length % colors.length];

      const dataInicioLocal = criarDataLocal(formData.dataInicio);
      
      // Para fluxos recorrentes, gerar todas as datas de pagamento
      const datasPagamento = gerarDatasPagamento(
        formData.dataInicio,
        formData.recorrencia as 'semanal' | 'mensal',
        formData.quantidadeParcelas
      );

      // Criar um fluxo para cada data de pagamento (exceto cobrança única)
      if (formData.recorrencia === 'unica') {
        const proximoPagamento = dataInicioLocal;
        
        const firebaseData = convertFormDataToFirebase(
          formData,
          user.uid,
          proximoPagamento,
          corAuto
        );

        await createFluxo(firebaseData);
      } else {
        // Para fluxos recorrentes, criar um documento para cada parcela
        for (let i = 0; i < datasPagamento.length; i++) {
          const proximoPagamento = datasPagamento[i];
          
          const firebaseData = convertFormDataToFirebase(
            formData,
            user.uid,
            proximoPagamento,
            corAuto
          );

          await createFluxo(firebaseData);
        }
      }

      // Recarregar fluxos do Firebase
      const firebaseData = await getFluxosByUserId(user.uid);
      const convertedFluxos = convertFirebaseFluxosToComissao(firebaseData);
      setFirebaseFluxos(convertedFluxos);

      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar fluxo:', error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    } finally {
      setIsLoading(false);
    }
  };

  // Função para marcar como pago (visualização de usuário)
  const handleMarkAsPaid = (fluxoId: string) => {
    // Aqui você implementaria a lógica para marcar como pago
    // Por exemplo, fazer uma chamada para API ou atualizar o estado local
    console.log('Marcando como pago (usuário):', fluxoId);
    setSelectedFluxo(null);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: Date) => {
    // Corrigir problema de fuso horário criando uma nova data no fuso horário local
    const dataLocal = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dataLocal);
  };

  const formatarMesAnoBrasil = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).format(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Agenda - Visão Usuário</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gerencie seus fluxos de comissão e acompanhe recebimentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 border-gray-200 text-gray-700">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-gray-200 text-gray-700">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 h-9 text-white"
          >
            <Plus className="w-4 h-4" />
            Criar Fluxo
          </Button>
        </div>
      </div>

      {/* Card de visualização mensal */}
      <Card className="border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Visão Mensal
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              disabled={currentMonthIndex === 0}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              disabled={currentMonthIndex >= months.length - columnCount}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {months.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <img 
                  src="/images/calendar-empty.png" 
                  alt="Calendário vazio" 
                  className="w-16 h-16 mx-auto opacity-60"
                />
              </div>
              <p className="text-gray-400 text-lg">Nenhum fluxo ativo</p>
              <p className="text-gray-500 text-sm mt-2">
                Crie seu primeiro fluxo para ver a agenda mensal
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6`}>
              {visibleMonths.map((month) => {
                const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
                const fluxosDoMes = fluxosPorMes[monthKey] || [];
                const totalMes = calcularTotalMes(monthKey);

                return (
                  <div 
                    key={monthKey} 
                    className="border border-gray-200 rounded-lg p-4 flex flex-col min-h-[500px] bg-white"
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {formatarMesAnoBrasil(month)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {fluxosDoMes.length} recebimento{fluxosDoMes.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="flex-1 space-y-2 mb-4 overflow-y-auto max-h-80">
                      {fluxosDoMes.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400 text-sm">Nenhum recebimento</p>
                        </div>
                      ) : (
                        fluxosDoMes.map((fluxo) => (
                          <div
                            key={fluxo.id}
                            className="rounded-md p-3 shadow-sm cursor-pointer hover:shadow-md transition"
                              onClick={() => setSelectedFluxo(fluxo)}
                              style={{ 
                                backgroundColor: fluxo.color || '#f9fafb',
                                borderLeft: `4px solid ${fluxo.color ? fluxo.color : '#d1d5db'}`
                              }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-900 text-sm">
                                {fluxo.nomeEmpresa}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-200 text-gray-600 bg-white/80"
                              >
                                {fluxo.recorrencia}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">
                                {formatarData(fluxo.proximoPagamento)}
                              </span>
                              <span className="font-semibold text-gray-900 text-sm">
                                {formatarMoeda(fluxo.valor)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-3 mt-auto">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total do mês:</span>
                        <span className="font-bold text-gray-900 text-lg">
                          {formatarMoeda(totalMes)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para criar novo fluxo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Criar Novo Fluxo</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <NovoFluxoForm 
                onSubmit={handleNovoFluxo}
                onCancel={() => setIsModalOpen(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalhes do fluxo */}
      {selectedFluxo && (
        <FluxoDetalhesModal
          fluxo={selectedFluxo}
          onClose={() => setSelectedFluxo(null)}
          formatarMoeda={formatarMoeda}
          formatarData={formatarData}
          onMarkAsPaid={() => handleMarkAsPaid(selectedFluxo.id)}
          showMarkAsPaidButton={true}
        />
      )}
    </div>
  );
}
