'use client'

import { useEffect, useState } from 'react';
import { getAllBoletoRequests, updateBoletoRequestStatus, BoletoRequest } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timestamp } from 'firebase/firestore';
import { 
  FileText, 
  CheckCircle, 
  X, 
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard
} from 'lucide-react';
import { formatarDataBrasil } from '@/lib/dateUtils';

export default function BoletosPage() {
  const [solicitacoes, setSolicitacoes] = useState<(BoletoRequest & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<(BoletoRequest & { id: string }) | null>(null);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [dataPagamento, setDataPagamento] = useState('');

  useEffect(() => {
    loadSolicitacoes();
  }, []);

  const loadSolicitacoes = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBoletoRequests();
      setSolicitacoes(data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      alert('Erro ao carregar solicitações de boleto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsBoletoGerado = async (requestId: string) => {
    try {
      await updateBoletoRequestStatus(requestId, 'boleto_gerado');
      await loadSolicitacoes();
      alert('Status atualizado: Boleto gerado');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const handleMarkAsPaid = async () => {
    if (!selectedRequest || !dataPagamento) {
      alert('Por favor, selecione uma data de pagamento');
      return;
    }

    try {
      const data = new Date(dataPagamento);
      await updateBoletoRequestStatus(selectedRequest.id, 'pago', data);
      await loadSolicitacoes();
      setShowMarkPaidModal(false);
      setSelectedRequest(null);
      setDataPagamento('');
      alert('Status atualizado: Pagamento confirmado');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const handleCancel = async (requestId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta solicitação?')) {
      return;
    }

    try {
      await updateBoletoRequestStatus(requestId, 'cancelado');
      await loadSolicitacoes();
      alert('Solicitação cancelada');
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      alert('Erro ao cancelar solicitação');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'boleto_gerado':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Boleto Gerado</Badge>;
      case 'pago':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pago</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarTimestamp = (timestamp: unknown) => {
    if (!timestamp) return 'N/A';
    try {
      // Verificar se é uma instância de Timestamp do Firebase
      if (timestamp instanceof Timestamp) {
        return formatarDataBrasil(timestamp.toDate());
      }
      // Verificar se tem o método toDate (fallback)
      if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
        const ts = timestamp as { toDate: () => Date };
        return formatarDataBrasil(ts.toDate());
      }
      return 'N/A';
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Solicitações de Boleto</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie as solicitações de boleto dos usuários
          </p>
        </div>
      </div>

      {solicitacoes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma solicitação de boleto encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {solicitacoes.map((solicitacao) => (
            <Card key={solicitacao.id} className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{solicitacao.userName}</CardTitle>
                      <p className="text-sm text-gray-600">{solicitacao.userEmail}</p>
                    </div>
                  </div>
                  {getStatusBadge(solicitacao.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{solicitacao.userTipo === 'vendedor' ? 'Vendedor' : 'Empresa'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{solicitacao.userTipo === 'vendedor' ? 'CPF:' : 'CNPJ:'}</span>
                      <span className="font-medium">{solicitacao.cpfCnpj}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Telefone:</span>
                      <span className="font-medium">{solicitacao.telefone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Plano:</span>
                      <span className="font-medium">{solicitacao.planoNome}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-semibold text-lg">{formatarMoeda(solicitacao.planoPreco)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Solicitado em:</span>
                      <span className="font-medium">{formatarTimestamp(solicitacao.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Endereço para Boleto
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p className="font-medium">{solicitacao.endereco.rua}, {solicitacao.endereco.numero}</p>
                    {solicitacao.endereco.complemento && (
                      <p className="text-gray-600">{solicitacao.endereco.complemento}</p>
                    )}
                    <p className="text-gray-600">
                      {solicitacao.endereco.bairro} - {solicitacao.endereco.cidade}/{solicitacao.endereco.estado}
                    </p>
                    <p className="text-gray-600">CEP: {solicitacao.endereco.cep}</p>
                  </div>
                </div>

                {solicitacao.status === 'boleto_gerado' && solicitacao.dataBoletoGerado ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Boleto gerado em:</strong> {formatarTimestamp(solicitacao.dataBoletoGerado)}
                    </p>
                  </div>
                ) : null}

                {solicitacao.status === 'pago' && solicitacao.dataPagamento ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      <strong>Pagamento confirmado em:</strong> {formatarTimestamp(solicitacao.dataPagamento)}
                    </p>
                  </div>
                ) : null}

                <div className="flex gap-2 flex-wrap">
                  {solicitacao.status === 'pendente' && (
                    <Button
                      onClick={() => handleMarkAsBoletoGerado(solicitacao.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Marcar como Boleto Gerado
                    </Button>
                  )}
                  {solicitacao.status === 'boleto_gerado' && (
                    <Button
                      onClick={() => {
                        setSelectedRequest(solicitacao);
                        setShowMarkPaidModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Pago
                    </Button>
                  )}
                  {solicitacao.status !== 'cancelado' && solicitacao.status !== 'pago' && (
                    <Button
                      onClick={() => handleCancel(solicitacao.id)}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para marcar como pago */}
      {showMarkPaidModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Pagamento</h3>
              <p className="text-sm text-gray-600 mb-4">
                Confirme a data de pagamento do boleto para <strong>{selectedRequest.userName}</strong>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Data de Pagamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dataPagamento}
                    onChange={(e) => setDataPagamento(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMarkPaidModal(false);
                      setSelectedRequest(null);
                      setDataPagamento('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleMarkAsPaid}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Confirmar Pagamento
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}