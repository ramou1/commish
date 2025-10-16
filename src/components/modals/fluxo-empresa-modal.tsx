// src/components/modals/fluxo-empresa-modal.tsx
'use client'

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ramos as ramoOptions } from '@/constants/ramos';
import { colors } from '@/constants/fluxos-mock';
import { ClientePagamento, clientesPagamento } from '@/constants/empresa-mock';
import { calcularDataFinal } from '@/lib/dateUtils';

interface NovoFluxoEmpresaFormData {
  tipo: 'empresa' | 'pessoa';
  // Campos para pessoa física
  nomeCompleto?: string;
  cpf?: string;
  // Campos para pessoa jurídica
  razaoSocial?: string;
  cnpj?: string;
  // Campos comuns
  valor: string;
  recorrencia: string;
  dataInicio: string;
  quantidadeParcelas: number;
  dataFim: string;
  ramo: string;
  color?: string;
  descricao?: string;
  documento?: File | null;
}

interface NovoFluxoEmpresaFormProps {
  onSubmit: (data: ClientePagamento) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NovoFluxoEmpresaForm({ onSubmit, onCancel, isLoading = false }: NovoFluxoEmpresaFormProps) {
  const [formData, setFormData] = useState<NovoFluxoEmpresaFormData>({
    tipo: 'empresa',
    valor: '',
    recorrencia: '',
    dataInicio: '',
    quantidadeParcelas: 1,
    dataFim: '',
    ramo: '',
    color: undefined,
    documento: null
  });

  const [showSummary, setShowSummary] = useState(false);

  type FormErrors = Partial<Record<keyof NovoFluxoEmpresaFormData, string>>;
  const [errors, setErrors] = useState<FormErrors>({});

  // Calcular data final baseada na quantidade de parcelas
  const dataFimCalculada = useMemo(() => {
    if (!formData.dataInicio || !formData.quantidadeParcelas || formData.recorrencia === 'unica') {
      return formData.dataInicio;
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

  const handleInputChange = (field: keyof NovoFluxoEmpresaFormData, value: string | number | File | null) => {
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

  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    if (formatted.length <= 14) {
      handleInputChange('cpf', formatted);
    }
  };

  const formatCNPJ = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    if (formatted.length <= 18) {
      handleInputChange('cnpj', formatted);
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

    if (formData.tipo === 'empresa') {
      if (!formData.cnpj?.trim()) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else if (formData.cnpj.replace(/\D/g, '').length !== 14) {
        newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
      }

      if (!formData.razaoSocial?.trim()) {
        newErrors.razaoSocial = 'Razão Social é obrigatória';
      }
    } else {
      if (!formData.cpf?.trim()) {
        newErrors.cpf = 'CPF é obrigatório';
      } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
        newErrors.cpf = 'CPF deve ter 11 dígitos';
      }

      if (!formData.nomeCompleto?.trim()) {
        newErrors.nomeCompleto = 'Nome completo é obrigatório';
      }
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
    const novoId = (Math.max(0, ...clientesPagamento.map(c => Number(c.id) || 0)) + 1).toString();
    const corAuto = colors[Math.floor(Math.random() * colors.length)];

    const novoCliente: ClientePagamento = {
      id: novoId,
      nomeEmpresa: formData.tipo === 'empresa' ? formData.razaoSocial! : formData.nomeCompleto!,
      cnpj: formData.tipo === 'empresa' ? formData.cnpj : undefined,
      cpf: formData.tipo === 'pessoa' ? formData.cpf : undefined,
      valor: Number(String(formData.valor).replace(/\D/g, '')) / 100,
      dataVencimento: new Date(formData.dataInicio),
      dataInicio: new Date(formData.dataInicio),
      dataFim: new Date(dataFimCalculada),
      status: 'pendente',
      ramo: formData.ramo || (formData.tipo === 'pessoa' ? 'Pessoa Física' : 'Empresa'),
      color: formData.color || corAuto,
      descricao: formData.descricao,
      documentoNome: formData.documento ? formData.documento.name : undefined,
      tipo: formData.tipo,
      recorrencia: formData.recorrencia as 'unica' | 'semanal' | 'mensal',
      quantidadeParcelas: formData.quantidadeParcelas
    };

    onSubmit(novoCliente);
    setShowSummary(false);
  };

  const handleEditForm = () => {
    setShowSummary(false);
  };

  // Função para formatar data corretamente
  const formatarDataParaResumo = (dataString: string) => {
    const [ano, mes, dia] = dataString.split('-');
    return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)).toLocaleDateString('pt-BR');
  };

  if (showSummary) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Resumo do Fluxo</h3>
        
        <div className="bg-gray-50 p-4 rounded-md space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Tipo:</span>
            <span className="text-sm text-gray-900">
              {formData.tipo === 'empresa' ? 'Pessoa Jurídica' : 'Pessoa Física'}
            </span>
          </div>

          {formData.tipo === 'empresa' ? (
            <>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Razão Social:</span>
                <span className="text-sm text-gray-900">{formData.razaoSocial}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">CNPJ:</span>
                <span className="text-sm text-gray-900">{formData.cnpj}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Nome:</span>
                <span className="text-sm text-gray-900">{formData.nomeCompleto}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">CPF:</span>
                <span className="text-sm text-gray-900">{formData.cpf}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Valor:</span>
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

          {formData.ramo && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Ramo:</span>
              <span className="text-sm text-gray-900">
                {ramoOptions.find(opt => opt.value === formData.ramo)?.label || formData.ramo}
              </span>
            </div>
          )}

          {formData.descricao && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Descrição:</span>
              <span className="text-sm text-gray-900">{formData.descricao}</span>
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
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[calc(100vh-12rem)] rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-4 px-6 py-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      {/* Campo Tipo */}
      <div className="space-y-2">
        <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">
          Tipo
        </Label>
        <Select
          value={formData.tipo}
          onValueChange={(value: 'empresa' | 'pessoa') => handleInputChange('tipo', value)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200">
            <SelectItem value="empresa" className="hover:bg-gray-50">Pessoa Jurídica</SelectItem>
            <SelectItem value="pessoa" className="hover:bg-gray-50">Pessoa Física</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campos condicionais baseados no tipo */}
      {formData.tipo === 'empresa' ? (
        <>
          {/* CNPJ */}
          <div className="space-y-2">
            <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">
              CNPJ
            </Label>
            <Input
              id="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              value={formData.cnpj || ''}
              onChange={(e) => handleCNPJChange(e.target.value)}
              className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
                errors.cnpj ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.cnpj && (
              <p className="text-xs text-red-500">{errors.cnpj}</p>
            )}
          </div>

          {/* Razão Social */}
          <div className="space-y-2">
            <Label htmlFor="razaoSocial" className="text-sm font-medium text-gray-700">
              Razão Social
            </Label>
            <Input
              id="razaoSocial"
              type="text"
              placeholder="Ex: Empresa Ltda"
              value={formData.razaoSocial || ''}
              onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
              className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
                errors.razaoSocial ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.razaoSocial && (
              <p className="text-xs text-red-500">{errors.razaoSocial}</p>
            )}
          </div>
        </>
      ) : (
        <>
          {/* CPF */}
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
              CPF
            </Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf || ''}
              onChange={(e) => handleCPFChange(e.target.value)}
              className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
                errors.cpf ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.cpf && (
              <p className="text-xs text-red-500">{errors.cpf}</p>
            )}
          </div>

          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="nomeCompleto" className="text-sm font-medium text-gray-700">
              Nome Completo
            </Label>
            <Input
              id="nomeCompleto"
              type="text"
              placeholder="Ex: João Silva Santos"
              value={formData.nomeCompleto || ''}
              onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
              className={`bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${
                errors.nomeCompleto ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.nomeCompleto && (
              <p className="text-xs text-red-500">{errors.nomeCompleto}</p>
            )}
          </div>
        </>
      )}

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
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
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

      {/* Descrição - Movido para o final */}
      <div className="space-y-2">
        <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">
          Descrição (Opcional)
        </Label>
        <Input
          id="descricao"
          type="text"
          placeholder="Ex: Comissão de venda do apartamento XYZ"
          value={formData.descricao || ''}
          onChange={(e) => handleInputChange('descricao', e.target.value)}
          className="bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Adicione uma descrição para identificar facilmente este fluxo
        </p>
      </div>

      </div>

      {/* Botões - Rodapé fixo */}
      <div className="flex justify-end items-center space-x-3 px-6 py-3 border-t border-gray-200 bg-white shrink-0 mt-auto rounded-b-lg">
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
          className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Criando...' : 'Criar Fluxo'}
        </Button>
      </div>
    </form>
  );
}
