'use client'

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { FluxoComissao } from '@/constants/fluxos-mock';
import { useState } from 'react';

interface FluxoComissaoExtended extends FluxoComissao {
  cpf?: string;
  tipo?: 'empresa' | 'pessoa';
}

interface FluxoDetalhesModalProps {
  fluxo: FluxoComissaoExtended;
  onClose: () => void;
  formatarMoeda: (valor: number) => string;
  formatarData: (data: Date) => string;
  onMarkAsPaid?: () => void;
  showMarkAsPaidButton?: boolean;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

export function FluxoDetalhesModal({ fluxo, onClose, formatarMoeda, formatarData, onMarkAsPaid, showMarkAsPaidButton, onDelete, showDeleteButton }: FluxoDetalhesModalProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Funções para status (iguais às da view da empresa)
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'atrasado':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pago':
      case 'finalizado':
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
      case 'finalizado':
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
      case 'finalizado':
        return 'Pago';
      default:
        return 'Pendente';
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteConfirmation(false);
    onClose();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  // Modal de confirmação de exclusão
  if (showDeleteConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Excluir Fluxo</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir este fluxo? Todos os dados serão removidos permanentemente.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={handleCancelDelete}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sim, Excluir
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Detalhes do Fluxo</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {fluxo.tipo === 'pessoa' ? 'Pessoa' : 'Empresa'}
              </p>
              <p className="text-base font-medium text-gray-900">{fluxo.nomeEmpresa}</p>
              {fluxo.cpf && (
                <p className="text-sm text-gray-800 mt-1">CPF: {fluxo.cpf}</p>
              )}
              {fluxo.cnpj && (
                <p className="text-sm text-gray-800 mt-1">CNPJ: {fluxo.cnpj}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-gray-200 text-gray-700">
                {fluxo.recorrencia === 'unica' ? 'Cobrança Única' : 
                 fluxo.recorrencia === 'semanal' ? 'Semanalmente' : 
                 fluxo.recorrencia === 'mensal' ? 'Mensalmente' : fluxo.recorrencia}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs flex items-center gap-1 ${getStatusColor(fluxo.status)}`}
              >
                {getStatusIcon(fluxo.status)}
                {getStatusText(fluxo.status)}
              </Badge>
              {fluxo.color && (
                <span
                  className="inline-block h-4 w-4 rounded"
                  style={{ backgroundColor: fluxo.color }}
                  aria-label="Cor do fluxo"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Para fluxos únicos, mostrar apenas o valor */}
            {fluxo.recorrencia === 'unica' ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Valor</p>
                <p className="text-base font-semibold text-gray-900">{formatarMoeda(fluxo.valor)}</p>
              </div>
            ) : (
              <>
                {/* Para fluxos recorrentes, mostrar valor da parcela */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Valor da Parcela</p>
                  <p className="text-base font-semibold text-gray-900">{formatarMoeda(fluxo.valor)}</p>
                </div>
                {/* Calcular e mostrar valor total e quantidade de parcelas */}
                {fluxo.quantidadeParcelas && fluxo.quantidadeParcelas > 1 && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Valor Total</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatarMoeda(fluxo.valor * fluxo.quantidadeParcelas)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Quantidade de Parcelas</p>
                      <p className="text-base font-medium text-gray-900">{fluxo.quantidadeParcelas}</p>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Próximo pagamento</p>
              <p className="text-base font-medium text-gray-900">{formatarData(fluxo.proximoPagamento)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Início</p>
              <p className="text-base font-medium text-gray-900">{formatarData(fluxo.dataInicio)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Fim</p>
              <p className="text-base font-medium text-gray-900">{formatarData(fluxo.dataFim)}</p>
            </div>
            {fluxo.ramo && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Ramo</p>
                <p className="text-base font-medium text-gray-900">{fluxo.ramo}</p>
              </div>
            )}
            {fluxo.documentoNome && (
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm text-gray-500">Anexo</p>
                {fluxo.documentoUrl ? (
                  <a
                    href={fluxo.documentoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {fluxo.documentoNome}
                  </a>
                ) : (
                  <p className="text-sm text-gray-700">{fluxo.documentoNome}</p>
                )}
              </div>
            )}
          </div>

          {fluxo.descricao && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Descrição</p>
              <p className="text-sm text-gray-900">{fluxo.descricao}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            {/* Botão de exclusão à esquerda */}
            {showDeleteButton && onDelete && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-8 px-3 text-xs"
                onClick={handleDeleteClick}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Excluir
              </Button>
            )}
            
            {/* Botões à direita */}
            <div className="flex gap-2">
              {showMarkAsPaidButton && onMarkAsPaid && fluxo.status !== 'finalizado' && (
                <Button 
                  className="bg-[var(--custom-green)] hover:bg-[var(--custom-green)]/90 text-white" 
                  onClick={onMarkAsPaid}
                >
                  Marcar como Pago
                </Button>
              )}
              <Button variant="outline" className="border-gray-200 text-gray-700" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


