'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, HelpCircle, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveAjudaMessage } from '@/lib/firebase';
import { ExtendedUser, DadosVendedor, DadosEmpresa } from '@/types/user';

interface AjudaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tipoOptions = [
  { value: 'sugestao', label: 'Sugestão' },
  { value: 'duvida', label: 'Dúvida' },
  { value: 'problema', label: 'Problema' },
  { value: 'melhoria', label: 'Melhoria' },
  { value: 'outro', label: 'Outro' }
];

export function AjudaModal({ isOpen, onClose }: AjudaModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo: '' as 'sugestao' | 'duvida' | 'problema' | 'melhoria' | 'outro' | '',
    descricao: ''
  });

  const handleSubmit = async () => {
    if (!formData.tipo || !formData.descricao.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (!user?.uid) {
      alert('Erro: Usuário não autenticado.');
      return;
    }

    try {
      setIsLoading(true);
      
      await saveAjudaMessage({
        userId: user.uid,
        userEmail: user.email || '',
        userName: getUserName(user),
        tipo: formData.tipo,
        descricao: formData.descricao.trim(),
      });

      setShowSuccess(true);
      
      // Limpar formulário
      setFormData({
        tipo: '',
        descricao: ''
      });

      // Fechar modal após 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      tipo: '',
      descricao: ''
    });
    setShowSuccess(false);
    onClose();
  };

  // Função helper para obter nome do usuário
  const getUserName = (user: ExtendedUser): string => {
    if (user?.dadosPessoais) {
      if ('nome' in user.dadosPessoais) {
        return (user.dadosPessoais as DadosVendedor).nome;
      } else if ('razaoSocial' in user.dadosPessoais) {
        return (user.dadosPessoais as DadosEmpresa).razaoSocial;
      }
    }
    return user?.email?.split('@')[0] || 'Usuário';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header Fixo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Central de Ajuda</h2>
          </div>
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
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mensagem enviada com sucesso!</h3>
              <p className="text-gray-600 text-center">
                Recebemos sua mensagem e entraremos em contato em breve.
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-600 mb-6">
                  Estamos aqui para ajudar! Envie sua sugestão, dúvida ou problema. 
                  Nossa equipe irá analisar e responder o mais breve possível.
                </p>
              </div>

              <div className="space-y-4">
                {/* Campo Tipo */}
                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">
                    Tipo de mensagem <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value as typeof formData.tipo })}
                  >
                    <SelectTrigger id="tipo" className="w-full">
                      <SelectValue placeholder="Selecione o tipo de mensagem" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Campo Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">
                    Descrição <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="descricao"
                    rows={10}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva sua sugestão, dúvida, problema ou melhoria com o máximo de detalhes possível..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    {formData.descricao.length} caracteres
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Fixo */}
        {!showSuccess && (
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-lg">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || !formData.tipo || !formData.descricao.trim()}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
