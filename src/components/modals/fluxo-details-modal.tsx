'use client'

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { FluxoComissao } from '@/constants/fluxos-mock';

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
}

export function FluxoDetalhesModal({ fluxo, onClose, formatarMoeda, formatarData, onMarkAsPaid, showMarkAsPaidButton }: FluxoDetalhesModalProps) {
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
                {fluxo.recorrencia}
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-200 text-gray-700">
                {fluxo.status}
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

          <div className="flex justify-end gap-2 pt-2">
            {showMarkAsPaidButton && onMarkAsPaid && fluxo.status !== 'finalizado' && (
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white" 
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
  );
}


