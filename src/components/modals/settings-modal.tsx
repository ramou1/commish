'use client'

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, User, Mail, Building, Palette, Check, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ExtendedUser, DadosVendedor, DadosEmpresa } from '@/types/user';
import { ramos as ramoOptions } from '@/constants/ramos';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    ramo: '',
    foto: null as File | null,
    tema: 'claro' as 'claro' | 'escuro'
  });

  // Inicializar dados do usuário
  useState(() => {
    if (user) {
      const dadosPessoais = user.dadosPessoais;
      let nome = '';
      let ramo = '';

      if (dadosPessoais) {
        if ('nome' in dadosPessoais) {
          nome = (dadosPessoais as DadosVendedor).nome || '';
          ramo = (dadosPessoais as DadosVendedor).ramo || '';
        } else if ('razaoSocial' in dadosPessoais) {
          nome = (dadosPessoais as DadosEmpresa).razaoSocial || '';
          ramo = (dadosPessoais as DadosEmpresa).ramo || '';
        }
      }

      setFormData({
        nome,
        email: user.email || '',
        ramo,
        foto: null,
        tema: 'claro'
      });
    }
  });

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

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simular salvamento (implementar lógica real depois)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Foto do Perfil
            </h3>
            
            <div className="flex items-center gap-4">
              {/* Foto atual */}
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {formData.foto ? (
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
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
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
                />
                <p className="text-xs text-gray-500">
                  JPG, PNG ou GIF (máx. 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Seção de Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Seu nome completo"
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

              {/* Ramo */}
              <div className="space-y-2 md:col-span-2">
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

          {/* Seção de Aparência */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Aparência
            </h3>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Tema da Interface
              </Label>
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => handleInputChange('tema', 'claro')}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    formData.tema === 'claro'
                      ? 'border-gray-300 bg-gray-50 text-gray-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Claro
                </button>
                
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                >
                  Escuro
                </button>
              </div>
            </div>
          </div>

          {/* Seção de Segurança */}
          <div className="space-y-4">
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
                  <span className="text-sm text-gray-600">Email Verificado:</span>
                  <span className="text-sm text-gray-900">
                    {user.emailVerified ? 'Sim' : 'Não'}
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
        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
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
