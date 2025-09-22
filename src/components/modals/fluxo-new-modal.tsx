// src/components/modals/fluxo-new-modal.tsx
'use client'

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ramos as ramoOptions } from '@/constants/ramos';
import { colors } from '@/constants/fluxos-mock';
import { NovoFluxoFormData } from '@/types';
import { calcularDataFinal } from '@/lib/dateUtils';

interface NovoFluxoFormProps {
  onSubmit: (data: NovoFluxoFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NovoFluxoForm({ onSubmit, onCancel, isLoading = false }: NovoFluxoFormProps) {
  const [formData, setFormData] = useState<NovoFluxoFormData>({
    descricao: '', // Novo campo adicionado
    cnpj: '',
    nomeEmpresa: '',
    ramo: '',
    valor: '',
    recorrencia: '',
    dataInicio: '',
    quantidadeParcelas: 1,
    dataFim: '',
    color: undefined,
    documento: null
  });

  const [showSummary, setShowSummary] = useState(false);
  const [loadingCNPJ, setLoadingCNPJ] = useState(false);

  type FormErrors = Partial<Record<keyof NovoFluxoFormData, string>>;
  const [errors, setErrors] = useState<FormErrors>({});

  // Calcular data final baseada na quantidade de parcelas usando date-fns
  const dataFimCalculada = useMemo(() => {
    if (!formData.dataInicio || !formData.quantidadeParcelas || formData.recorrencia === 'unica') {
      return formData.dataInicio; // Para cobrança única, data fim = data início
    }

    return calcularDataFinal(
      formData.dataInicio,
      formData.recorrencia as 'unica' | 'semanal' | 'mensal',
      formData.quantidadeParcelas
    );
  }, [formData.dataInicio, formData.quantidadeParcelas, formData.recorrencia]);

  // Calcular valor por parcela
  const valorPorParcela = useMemo(() => {
    if (!formData.valor || formData.quantidadeParcelas <= 0) return 'R$ 0,00';
    
    const valorNumerico = parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.'));
    const valorPorParcela = valorNumerico / formData.quantidadeParcelas;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorPorParcela);
  }, [formData.valor, formData.quantidadeParcelas]);

  const handleInputChange = (field: keyof NovoFluxoFormData, value: string | number | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando usuário digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('documento', file);
  };

  const formatCNPJ = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleCNPJChange = async (value: string) => {
    const formatted = formatCNPJ(value);
    if (formatted.length <= 18) {
      handleInputChange('cnpj', formatted);
      
      // Buscar dados da empresa quando CNPJ estiver completo (14 dígitos)
      const cnpjNumerico = value.replace(/\D/g, '');
      if (cnpjNumerico.length === 14) {
        setLoadingCNPJ(true);
        try {
          const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjNumerico}`);
          const data = await response.json();
          
          if (data.razao_social) {
            handleInputChange('nomeEmpresa', data.razao_social);
          } else {
            console.log('CNPJ não encontrado ou dados inválidos:', data);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do CNPJ:', error);
        } finally {
          setLoadingCNPJ(false);
        }
      }
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const numberValue = parseInt(numericValue) / 100;
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleCurrencyChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      handleInputChange('valor', formatCurrency(numericValue));
    }
  };

  const handleParcelasChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const parcelas = Math.min(Math.max(parseInt(numericValue) || 1, 1), 20);
    handleInputChange('quantidadeParcelas', parcelas);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    if (!formData.nomeEmpresa.trim()) {
      newErrors.nomeEmpresa = 'Razão Social é obrigatória';
    }

    if (!formData.valor.trim()) {
      newErrors.valor = 'Valor é obrigatório';
    }

    if (!formData.recorrencia) {
      newErrors.recorrencia = 'Recorrência é obrigatória';
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data é obrigatória';
    }

    if (formData.recorrencia !== 'unica' && formData.quantidadeParcelas < 1) {
      newErrors.quantidadeParcelas = 'Quantidade de parcelas deve ser pelo menos 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Atualizar data fim calculada antes de mostrar o resumo
    setFormData(prev => ({
      ...prev,
      dataFim: dataFimCalculada
    }));
    
    setShowSummary(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit({
      ...formData,
      dataFim: dataFimCalculada
    });
    setShowSummary(false);
  };

  const handleEditForm = () => {
    setShowSummary(false);
  };

  // Função para formatar data corretamente sem problemas de fuso horário
  const formatarDataParaResumo = (dataString: string) => {
    const [ano, mes, dia] = dataString.split('-');
    return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)).toLocaleDateString('pt-BR');
  };

  if (showSummary) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Resumo do Fluxo</h3>
        
        <div className="bg-gray-50 p-4 rounded-md space-y-3">
          {/* Descrição - adicionada no resumo */}
          {formData.descricao && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Descrição:</span>
              <span className="text-sm text-gray-900">{formData.descricao}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">CNPJ:</span>
            <span className="text-sm text-gray-900">{formData.cnpj}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Razão Social:</span>
            <span className="text-sm text-gray-900">{formData.nomeEmpresa}</span>
          </div>
          
          {formData.ramo && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Ramo:</span>
              <span className="text-sm text-gray-900">
                {ramoOptions.find(opt => opt.value === formData.ramo)?.label || formData.ramo}
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Valor a Receber:</span>
            <span className="text-sm text-gray-900">{formData.valor}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Recorrência:</span>
            <span className="text-sm text-gray-900">
              {formData.recorrencia === 'unica' && 'Cobrança Única'}
              {formData.recorrencia === 'semanal' && 'Semanalmente'}
              {formData.recorrencia === 'mensal' && 'Mensalmente'}
            </span>
          </div>

          {formData.recorrencia !== 'unica' && (
            <>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Quantidade de Parcelas:</span>
                <span className="text-sm text-gray-900">{formData.quantidadeParcelas}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Valor por Parcela:</span>
                <span className="text-sm text-gray-900">{valorPorParcela}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Data de Início:</span>
            <span className="text-sm text-gray-900">
              {formatarDataParaResumo(formData.dataInicio)}
            </span>
          </div>

          {formData.recorrencia !== 'unica' && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Data Final:</span>
              <span className="text-sm text-gray-900">
                {formatarDataParaResumo(dataFimCalculada)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Cor escolhida:</span>
            <span className="text-sm text-gray-900 flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded"
                style={{ backgroundColor: formData.color || '#E5E7EB', border: '1px solid #D1D5DB' }}
              />
              {formData.color || 'Automática'}
            </span>
          </div>

          {formData.documento && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Documento:</span>
              <span className="text-sm text-gray-900">
                {formData.documento.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleEditForm}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Editar
          </Button>
          <Button 
            type="button"
            className="bg-gray-900 hover:bg-gray-800 text-white"
            onClick={handleConfirmSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Criando...' : 'Confirmar Criação'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">
          Descrição (Opcional)
        </Label>
        <Input
          id="descricao"
          type="text"
          placeholder="Ex: Comissão de venda do apartamento XYZ"
          value={formData.descricao}
          onChange={(e) => handleInputChange('descricao', e.target.value)}
          className="bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Adicione uma descrição para identificar facilmente este fluxo
        </p>
      </div>

      {/* CNPJ */}
      <div className="space-y-2">
        <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">
          CNPJ
        </Label>
        <div className="relative">
          <Input
            id="cnpj"
            type="text"
            placeholder="00.000.000/0000-00"
            value={formData.cnpj}
            onChange={(e) => handleCNPJChange(e.target.value)}
            className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
              errors.cnpj ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            disabled={isLoading}
          />
          {loadingCNPJ && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
        {errors.cnpj && (
          <p className="text-xs text-red-500">{errors.cnpj}</p>
        )}
        {loadingCNPJ && (
          <p className="text-xs text-blue-500">Buscando dados da empresa...</p>
        )}
      </div>

      {/* Razão Social */}
      <div className="space-y-2">
        <Label htmlFor="nomeEmpresa" className="text-sm font-medium text-gray-700">
          Razão Social
        </Label>
        <Input
          id="nomeEmpresa"
          type="text"
          placeholder="Ex: Imobiliária Santos Ltda"
          value={formData.nomeEmpresa}
          onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
          className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
            errors.nomeEmpresa ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          disabled={isLoading}
        />
        {errors.nomeEmpresa && (
          <p className="text-xs text-red-500">{errors.nomeEmpresa}</p>
        )}
      </div>

      {/* Valor a Receber e Recorrência na mesma linha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Valor a Receber */}
        <div className="space-y-2">
          <Label htmlFor="valor" className="text-sm font-medium text-gray-700">
            Valor a Receber
          </Label>
          <Input
            id="valor"
            type="text"
            placeholder="R$ 0,00"
            value={formData.valor}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
              errors.valor ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            disabled={isLoading}
          />
          {errors.valor && (
            <p className="text-xs text-red-500">{errors.valor}</p>
          )}
        </div>

        {/* Recorrência */}
        <div className="space-y-2">
          <Label htmlFor="recorrencia" className="text-sm font-medium text-gray-700">
            Recorrência
          </Label>
          <Select
            value={formData.recorrencia}
            onValueChange={(value: 'unica' | 'semanal' | 'mensal') => handleInputChange('recorrencia', value)}
            disabled={isLoading}
          >
            <SelectTrigger className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
              errors.recorrencia ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}>
              <SelectValue placeholder="Selecione a recorrência" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              <SelectItem value="unica" className="hover:bg-gray-50">Cobrança Única</SelectItem>
              <SelectItem value="semanal" className="hover:bg-gray-50">Semanalmente</SelectItem>
              <SelectItem value="mensal" className="hover:bg-gray-50">Mensalmente</SelectItem>
            </SelectContent>
          </Select>
          {errors.recorrencia && (
            <p className="text-xs text-red-500">{errors.recorrencia}</p>
          )}
        </div>
      </div>

      {/* Quantidade de Parcelas, Data de Início e Ramo na mesma linha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Quantidade de Parcelas */}
        {formData.recorrencia !== 'unica' && (
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="quantidadeParcelas" className="text-sm font-medium text-gray-700">
              Qtd de Parcelas
            </Label>
            <Input
              id="quantidadeParcelas"
              type="number"
              min="1"
              max="20"
              value={formData.quantidadeParcelas}
              onChange={(e) => handleParcelasChange(e.target.value)}
              className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
                errors.quantidadeParcelas ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.quantidadeParcelas && (
              <p className="text-xs text-red-500">{errors.quantidadeParcelas}</p>
            )}
            {/* Espaço reservado para o valor por parcela - sempre ocupa o mesmo espaço */}
            <div className="h-5">
              {formData.valor && formData.quantidadeParcelas > 1 && (
                <p className="text-xs text-gray-500">
                  Valor por parcela: {valorPorParcela}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Data de Início */}
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="dataInicio" className="text-sm font-medium text-gray-700">
            {formData.recorrencia === 'unica' ? 'Data da Cobrança' : 'Data de Início'}
          </Label>
          <Input
            id="dataInicio"
            type="date"
            value={formData.dataInicio}
            onChange={(e) => handleInputChange('dataInicio', e.target.value)}
            className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
              errors.dataInicio ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            disabled={isLoading}
          />
          {errors.dataInicio && (
            <p className="text-xs text-red-500">{errors.dataInicio}</p>
          )}
        </div>

        {/* Ramo */}
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="ramo" className="text-sm font-medium text-gray-700">
            Ramo (Opcional)
          </Label>
          <Select
            value={formData.ramo}
            onValueChange={(value) => handleInputChange('ramo', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500">
              <SelectValue placeholder="Selecione o ramo" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              {ramoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="hover:bg-gray-50">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload de Documento */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Anexo (Opcional)
        </Label>
        <div className="flex items-center gap-3 max-w-md">
          <input
            id="documento"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('documento')?.click()}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex-shrink-0"
            disabled={isLoading}
          >
            {formData.documento ? 'Alterar Arquivo' : 'Selecionar Arquivo'}
          </Button>
          {formData.documento && (
            <span className="text-sm text-gray-600 truncate flex-1">
              {formData.documento.name}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 10MB)
        </p>
      </div>

      {/* Cor do Cliente */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Cor</Label>
        <div className="flex flex-wrap gap-3">
          {colors.map((cor) => {
            const selecionada = formData.color === cor;
            return (
              <button
                key={cor}
                type="button"
                onClick={() => handleInputChange('color', cor)}
                className={`w-7 h-7 rounded-full border transition-shadow ${selecionada ? 'ring-2 ring-gray-700' : 'border-gray-300'}`}
                style={{ backgroundColor: cor }}
                aria-label={`Selecionar cor ${cor}`}
              />
            );
          })}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button 
          type="button"
          variant="outline" 
          onClick={onCancel}
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="bg-gray-900 hover:bg-gray-800 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Criando...' : 'Criar Fluxo'}
        </Button>
      </div>
    </form>
  );
}