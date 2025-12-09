'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, User, Mail, Building, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DadosVendedor, DadosEmpresa, UserData, RamoNegocio } from '@/types/user';
import { updateUser } from '@/lib/firebase';
// Valores dos ramos conforme o tipo RamoNegocio
const ramoOptions = [
  { value: 'imóveis', label: 'Imóveis' },
  { value: 'automóveis', label: 'Automóveis' },
  { value: 'seguros', label: 'Seguros' },
  { value: 'planos de saúde', label: 'Planos de Saúde' },
  { value: 'vendedor digital', label: 'Vendedor Digital' },
  { value: 'outros', label: 'Outros' }
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpfCnpj: '',
    ramo: '',
    foto: null as File | null
  });

  // Inicializar dados do usuário
  useEffect(() => {
    if (user) {
      const dadosPessoais = user.dadosPessoais;
      let nome = '';
      let cpfCnpj = '';
      const ramo = user.ramo || '';

      if (dadosPessoais) {
        if ('nome' in dadosPessoais) {
          nome = (dadosPessoais as DadosVendedor).nome || '';
          cpfCnpj = (dadosPessoais as DadosVendedor).cpf || '';
        } else if ('razaoSocial' in dadosPessoais) {
          nome = (dadosPessoais as DadosEmpresa).razaoSocial || '';
          cpfCnpj = (dadosPessoais as DadosEmpresa).cnpj || '';
        }
      }

      setFormData({
        nome,
        email: user.email || '',
        cpfCnpj,
        ramo,
        foto: null
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('foto', file);
  };

  const formatCNPJ = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length === 14) {
      return numericValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length === 11) {
      return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const getFormattedCpfCnpj = () => {
    if (!formData.cpfCnpj) return '';
    const isEmpresa = user?.dadosPessoais && 'razaoSocial' in user.dadosPessoais;
    return isEmpresa ? formatCNPJ(formData.cpfCnpj) : formatCPF(formData.cpfCnpj);
  };

  const handleSave = async () => {
    if (!user?.uid) {
      console.error('Usuário não encontrado');
      return;
    }

    setIsLoading(true);
    
    try {
      // Preparar dados para atualização
      const updates: Partial<UserData> = {
        ramo: formData.ramo as RamoNegocio | ''
      };

      // Atualizar dados pessoais (nome ou razaoSocial)
      if (user.dadosPessoais) {
        if ('nome' in user.dadosPessoais) {
          // É vendedor - atualizar nome
          updates.dadosPessoais = {
            ...(user.dadosPessoais as DadosVendedor),
            nome: formData.nome
          };
        } else if ('razaoSocial' in user.dadosPessoais) {
          // É empresa - atualizar razaoSocial
          updates.dadosPessoais = {
            ...(user.dadosPessoais as DadosEmpresa),
            razaoSocial: formData.nome
          };
        }
      }

      // Atualizar no Firestore
      await updateUser(user.uid, updates);
      
      setShowSuccess(true);
      
      // Recarregar a página após 2 segundos para atualizar os dados
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        // Recarregar a página para atualizar os dados do usuário
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header Fixo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">Configurações</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Seção de Foto */}
          <div className="space-y-4 pb-6 border-b border-gray-200 opacity-60">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Foto do Perfil
            </h3>
            
            <div className="flex items-center gap-4">
              {/* Foto atual */}
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {formData.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={URL.createObjectURL(formData.foto)} 
                    alt="Nova foto" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              {/* Botão de upload */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled
                  className="flex items-center gap-2 border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {formData.foto ? 'Alterar Foto' : 'Adicionar Foto'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled
                />
                <p className="text-xs text-gray-500">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
            </div>
          </div>

          {/* Seção de Informações Pessoais */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  {user?.dadosPessoais && 'razaoSocial' in user.dadosPessoais ? 'Razão Social' : 'Nome Completo'}
                </Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder={user?.dadosPessoais && 'razaoSocial' in user.dadosPessoais ? 'Razão social da empresa' : 'Seu nome completo'}
                  className="bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              {/* Email (readonly) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">
                  O email não pode ser alterado
                </p>
              </div>

              {/* CPF/CNPJ */}
              <div className="space-y-2">
                <Label htmlFor="cpfCnpj" className="text-sm font-medium text-gray-700">
                  {user?.dadosPessoais && 'razaoSocial' in user.dadosPessoais ? 'CNPJ' : 'CPF'}
                </Label>
                <Input
                  id="cpfCnpj"
                  type="text"
                  value={getFormattedCpfCnpj()}
                  disabled
                  className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                  placeholder={user?.dadosPessoais && 'razaoSocial' in user.dadosPessoais ? '00.000.000/0000-00' : '000.000.000-00'}
                />
                <p className="text-xs text-gray-500">
                  {user?.dadosPessoais && 'razaoSocial' in user.dadosPessoais ? 'CNPJ não pode ser alterado' : 'CPF não pode ser alterado'}
                </p>
              </div>

              {/* Ramo */}
              <div className="space-y-2">
                <Label htmlFor="ramo" className="text-sm font-medium text-gray-700">
                  Ramo/Área de Atuação
                </Label>
                <Select
                  value={formData.ramo}
                  onValueChange={(value) => handleInputChange('ramo', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                    <SelectValue placeholder="Selecione seu ramo" />
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
          </div>

          {/* Seção de Segurança */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </h3>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Senha da Conta
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled
                  className="border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                >
                  Alterar Senha
                </Button>
                <p className="text-xs text-gray-500">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
            </div>
          </div>

          {/* Informações Adicionais do Usuário */}
          {user && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Informações da Conta
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ID do Usuário:</span>
                  <span className="text-sm font-mono text-gray-900">{user.uid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tipo de Conta:</span>
                  <span className="text-sm text-gray-900">
                    {user.dadosPessoais && 'nome' in user.dadosPessoais ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data de Criação:</span>
                  <span className="text-sm text-gray-900">
                    {user.metadata?.creationTime ? 
                      new Date(user.metadata.creationTime).toLocaleDateString('pt-BR') : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Fixo */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-lg">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleCancel}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="button"
            className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : showSuccess ? 'Salvo!' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
