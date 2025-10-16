// src/views/empresa/AgendaView.tsx
'use client'

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FluxoDetalhesModal } from '@/components/modals/fluxo-details-modal';
import { NovoFluxoEmpresaForm } from '@/components/modals/fluxo-empresa-modal';
import { 
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { clientesPagamento, ClientePagamento, fluxosPendentesAprovacao, FluxoPendenteAprovacao } from '@/constants/empresa-mock';

export default function AgendaView() {
  const [clientes] = useState<ClientePagamento[]>(clientesPagamento);
  const [fluxosPendentes, setFluxosPendentes] = useState<FluxoPendenteAprovacao[]>(fluxosPendentesAprovacao);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedCliente, setSelectedCliente] = useState<ClientePagamento | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprovalExpanded, setIsApprovalExpanded] = useState(false);

  // Calcular apenas os meses que têm pagamentos (incluindo pagos para visualização)
  const months = useMemo(() => {
    // Incluir todos os clientes para mostrar também os pagos
    const allClientes = clientes;
    
    if (allClientes.length === 0) {
      return [];
    }

    // Criar um Set com todos os meses únicos que têm pagamentos
    const monthsSet = new Set<string>();
    
    allClientes.forEach(cliente => {
      const paymentDate = cliente.dataVencimento instanceof Date 
        ? cliente.dataVencimento 
        : new Date(cliente.dataVencimento);
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
  }, [clientes]);

  // Função para agrupar clientes por mês (incluindo pagos para visualização)
  const groupClientesByMonth = () => {
    const grouped: { [key: string]: ClientePagamento[] } = {};
    
    clientes.forEach(cliente => {
      // Incluir todos os clientes, incluindo os pagos
      const paymentDate = cliente.dataVencimento instanceof Date 
        ? cliente.dataVencimento 
        : new Date(cliente.dataVencimento);
      const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(cliente);
    });
    
    // Ordenar clientes por data dentro de cada mês
    Object.keys(grouped).forEach(monthKey => {
      grouped[monthKey].sort((a, b) => {
        const dateA = a.dataVencimento instanceof Date 
          ? a.dataVencimento 
          : new Date(a.dataVencimento);
        const dateB = b.dataVencimento instanceof Date 
          ? b.dataVencimento 
          : new Date(b.dataVencimento);
        return dateA.getTime() - dateB.getTime();
      });
    });
    
    return grouped;
  };

  const clientesPorMes = groupClientesByMonth();

  // Calcular total por mês
  const calcularTotalMes = (monthKey: string) => {
    const clientesDoMes = clientesPorMes[monthKey] || [];
    return clientesDoMes.reduce((total, cliente) => total + cliente.valor, 0);
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
    if (width >= 1536) return 4;
    if (width >= 1280) return 4;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  const columnCount = getColumnCount();
  const visibleMonths = months.slice(currentMonthIndex, currentMonthIndex + columnCount);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: Date) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'atrasado':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pago':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'atrasado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pago':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'atrasado':
        return 'Atrasado';
      case 'pago':
        return 'Pago';
      default:
        return 'Pendente';
    }
  };

  // Converter ClientePagamento para formato do modal
  const converterParaFluxoModal = (cliente: ClientePagamento) => {
    return {
      id: cliente.id,
      nomeEmpresa: cliente.nomeEmpresa,
      valor: cliente.valor,
      recorrencia: 'unica' as const,
      dataInicio: cliente.dataInicio,
      dataFim: cliente.dataFim,
      status: cliente.status as 'pendente' | 'ativo' | 'finalizado',
      proximoPagamento: cliente.dataVencimento,
      color: cliente.color,
      cnpj: cliente.cnpj,
      cpf: cliente.cpf,
      ramo: cliente.ramo,
      documentoNome: cliente.documentoNome,
      descricao: cliente.descricao,
      tipo: cliente.tipo,
    };
  };

  // Função para marcar como pago
  const handleMarkAsPaid = (clienteId: string) => {
    // Aqui você implementaria a lógica para marcar como pago
    // Por exemplo, fazer uma chamada para API ou atualizar o estado local
    console.log('Marcando como pago:', clienteId);
    setSelectedCliente(null);
  };

  // Função para excluir fluxo
  const handleDeleteFluxo = (clienteId: string) => {
    // Aqui você implementaria a lógica para excluir o fluxo
    // Por exemplo, fazer uma chamada para API ou atualizar o estado local
    console.log('Excluindo fluxo:', clienteId);
    setSelectedCliente(null);
  };

  // Função para criar novo fluxo
  const handleNovoFluxo = (formData: ClientePagamento) => {
    // Aqui você implementaria a lógica para criar novo fluxo
    // Por exemplo, fazer uma chamada para API ou atualizar o estado local
    console.log('Criando novo fluxo:', formData);
    setIsModalOpen(false);
  };

  // Funções para aprovação de fluxos
  const handleAprovarFluxo = (fluxoId: string) => {
    // Aqui você implementaria a lógica para aprovar o fluxo
    // Por exemplo, fazer uma chamada para API ou atualizar o estado local
    console.log('Aprovando fluxo:', fluxoId);
    setFluxosPendentes(prev => prev.filter(fluxo => fluxo.id !== fluxoId));
  };

  const handleRecusarFluxo = (fluxoId: string) => {
    // Aqui você implementaria a lógica para recusar o fluxo
    // Por exemplo, fazer uma chamada para API ou atualizar o estado local
    console.log('Recusando fluxo:', fluxoId);
    setFluxosPendentes(prev => prev.filter(fluxo => fluxo.id !== fluxoId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Agenda - Visão Empresa</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gerencie pagamentos de comissões para toda a equipe
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 border-gray-200 text-gray-700" disabled>
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-gray-200 text-gray-700" disabled>
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 h-9 text-white"
          >
            <Plus className="w-4 h-4" />
            Criar Fluxo
          </Button>
        </div>
      </div>

      {/* Resumo dos Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {clientes.filter(c => c.status === 'pendente').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atrasados</p>
                <p className="text-2xl font-bold text-red-600">
                  {clientes.filter(c => c.status === 'atrasado').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagamentos Totais</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatarMoeda(clientes.reduce((total, c) => total + c.valor, 0))}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Aprovação de Fluxos - Accordion */}
      {fluxosPendentes.length > 0 && (
        <Card className="border border-orange-200 bg-orange-50">
          <CardHeader 
            className="pb-3 cursor-pointer hover:bg-orange-100 transition-colors"
            onClick={() => setIsApprovalExpanded(!isApprovalExpanded)}
          >
            <CardTitle className="text-lg font-semibold text-orange-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Fluxos Pendentes de Aprovação
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                  {fluxosPendentes.length}
                </Badge>
              </div>
              {isApprovalExpanded ? (
                <ChevronUp className="w-5 h-5 text-orange-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-orange-700" />
              )}
            </CardTitle>
            <p className="text-sm text-orange-700">
              Usuários criaram fluxos mencionando seu CNPJ. Clique para expandir e revisar.
            </p>
          </CardHeader>
          {isApprovalExpanded && (
            <CardContent>
              <div className="space-y-4">
                {fluxosPendentes.map((fluxo) => (
                  <div
                    key={fluxo.id}
                    className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{fluxo.nomeUsuario}</h4>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {fluxo.emailUsuario}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Empresa:</span> {fluxo.nomeEmpresa}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">CNPJ:</span> {fluxo.cnpjEmpresa}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Descrição:</span> {fluxo.descricao}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatarMoeda(fluxo.valor)}</p>
                        <p className="text-xs text-gray-500">
                          {fluxo.recorrencia === 'unica' ? 'Cobrança Única' : 
                           fluxo.recorrencia === 'semanal' ? 'Semanalmente' : 
                           fluxo.recorrencia === 'mensal' ? 'Mensalmente' : fluxo.recorrencia}
                          {fluxo.quantidadeParcelas && ` (${fluxo.quantidadeParcelas} parcelas)`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <p>Criado em: {formatarData(fluxo.dataCriacao)}</p>
                        <p>Vencimento: {formatarData(fluxo.dataVencimento)}</p>
                        {fluxo.observacoesUsuario && (
                          <p className="mt-1 text-blue-600">
                            <span className="font-medium">Observações:</span> {fluxo.observacoesUsuario}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecusarFluxo(fluxo.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Recusar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAprovarFluxo(fluxo.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Card de visualização mensal */}
      <Card className="border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Visão Mensal - Todos os Pagamentos
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
              <p className="text-gray-400 text-lg">Nenhum pagamento encontrado</p>
              <p className="text-gray-500 text-sm mt-2">
                Não há pagamentos registrados
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
              {visibleMonths.map((month) => {
                const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
                const clientesDoMes = clientesPorMes[monthKey] || [];
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
                        {clientesDoMes.length} pagamento{clientesDoMes.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="flex-1 space-y-2 mb-4 overflow-y-auto max-h-80">
                      {clientesDoMes.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400 text-sm">Nenhum pagamento</p>
                        </div>
                      ) : (
                        clientesDoMes.map((cliente) => (
                          <div
                            key={cliente.id}
                            className="rounded-md p-3 shadow-sm cursor-pointer hover:shadow-md transition"
                            onClick={() => setSelectedCliente(cliente)}
                            style={{ 
                              backgroundColor: cliente.color || '#f9fafb',
                              borderLeft: `4px solid ${cliente.color ? cliente.color : '#d1d5db'}`
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-900 text-sm">
                                {cliente.nomeEmpresa}
                              </span>
                              {getStatusIcon(cliente.status)}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">
                                {formatarData(cliente.dataVencimento)}
                              </span>
                              <span className="font-semibold text-gray-900 text-sm">
                                {formatarMoeda(cliente.valor)}
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

      {/* Modal de detalhes do cliente */}
      {selectedCliente && (
        <FluxoDetalhesModal
          fluxo={converterParaFluxoModal(selectedCliente)}
          onClose={() => setSelectedCliente(null)}
          formatarMoeda={formatarMoeda}
          formatarData={formatarData}
          onMarkAsPaid={() => handleMarkAsPaid(selectedCliente.id)}
          showMarkAsPaidButton={true}
          onDelete={() => handleDeleteFluxo(selectedCliente.id)}
          showDeleteButton={true}
        />
      )}

      {/* Modal de Novo Fluxo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            {/* Cabeçalho fixo */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
              <h3 className="text-xl font-semibold text-gray-900">Criar Novo Fluxo</h3>
            </div>
            
            {/* Conteúdo com scroll */}
            <div className="flex-1 overflow-hidden">
              <NovoFluxoEmpresaForm
                onSubmit={handleNovoFluxo}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
