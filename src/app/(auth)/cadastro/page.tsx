// src/app/(auth)/cadastro/page.tsx
'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle, User, Briefcase, Building } from 'lucide-react';
import { CadastroData } from '@/types/user';

const ramos = [
  { value: 'imoveis', label: 'Imóveis' },
  { value: 'automoveis', label: 'Automóveis' },
  { value: 'seguros', label: 'Seguros' },
  { value: 'planos-saude', label: 'Planos de Saúde' },
  { value: 'vendedor-digital', label: 'Vendedor Digital' },
  { value: 'outros', label: 'Outros' }
];

export default function CadastroPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CadastroData>({
    nome: '',
    cpf: '',
    tipo: 'vendedor',
    ramo: ''
  });

  const totalSteps = 3;

  const handleInputChange = (field: keyof CadastroData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Dados do cadastro:', formData);
    
    // Simular cadastro bem-sucedido
    localStorage.setItem('user', JSON.stringify({
      email: 'usuario@exemplo.com', // Simular email
      nome: formData.nome,
      cpf: formData.cpf,
      tipo: formData.tipo,
      ramo: formData.ramo
    }));
    
    alert('Cadastro realizado com sucesso!');
    
    // Redirecionar para dashboard
    window.location.href = '/agenda';
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.nome.trim() !== '' && formData.cpf.trim() !== '';
      case 2:
        return formData.tipo !== '';
      case 3:
        return formData.ramo !== '';
      default:
        return false;
    }
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

  const stepIcons = [User, Briefcase, Building];
  const stepTitles = ['Dados Pessoais', 'Tipo de Usuário', 'Área de Atuação'];

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Cabeçalho com logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Commish</h1>
          </Link>
          <p className="text-gray-600 text-sm">Plataforma de Gestão de Comissões</p>
        </div>

        {/* Indicador de progresso */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;
              const IconComponent = stepIcons[i];
              
              return (
                <div key={stepNum} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all border ${
                      isCompleted
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : isActive
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs text-center leading-tight ${
                    isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {stepTitles[i]}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div
              className="bg-gray-900 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border border-gray-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg font-semibold text-gray-900">
              Etapa {currentStep} de {totalSteps}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Dados Pessoais */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome Completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="mt-2 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => handleCPFChange(e.target.value)}
                    className="mt-2 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Tipo de Usuário */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-6 text-sm">Você é:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Opção Vendedor */}
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-center space-x-3">
                        <Briefcase className="w-5 h-5 text-gray-700" />
                        <span className="text-gray-900 font-medium">Vendedor</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                        Gerencie suas comissões e antecipe recebimentos
                      </p>
                    </div>

                    {/* Opção Empresa */}
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-center space-x-3">
                        <Building className="w-5 h-5 text-gray-700" />
                        <span className="text-gray-900 font-medium">Empresa</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                        Gerencie pagamentos de comissões e fluxos financeiros
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Ramo de Atuação */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ramo" className="text-sm font-medium text-gray-700">Seu Ramo de Atuação</Label>
                  <Select
                    value={formData.ramo}
                    onValueChange={(value) => handleInputChange('ramo', value)}
                  >
                    <SelectTrigger className="mt-2 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0">
                      <SelectValue placeholder="Selecione seu ramo de atuação" />
                    </SelectTrigger>
                    <SelectContent>
                      {ramos.map((ramo) => (
                        <SelectItem key={ramo.value} value={ramo.value}>
                          {ramo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Preview dos dados */}
                {formData.ramo && (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm">Resumo do cadastro:</h4>
                    <div className="space-y-2 text-xs">
                      <p><span className="font-medium text-gray-700">Nome:</span> <span className="text-gray-600">{formData.nome}</span></p>
                      <p><span className="font-medium text-gray-700">CPF:</span> <span className="text-gray-600">{formData.cpf}</span></p>
                      <p><span className="font-medium text-gray-700">Tipo:</span> <span className="text-gray-600">Vendedor</span></p>
                      <p><span className="font-medium text-gray-700">Ramo:</span> <span className="text-gray-600">{ramos.find(r => r.value === formData.ramo)?.label}</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botões de navegação */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 border-gray-200 text-gray-700 hover:bg-gray-50 h-10 px-4 rounded-md font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white h-10 px-4 rounded-md font-medium"
                >
                  <span>Próximo</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="bg-gray-900 hover:bg-gray-800 text-white h-10 px-4 rounded-md font-medium"
                >
                  Finalizar Cadastro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Separador e botão do Google */}
        <div className="mt-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-medium">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-10 border-gray-200 hover:bg-gray-50 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700">Continuar com Google</span>
          </Button>
        </div>

        {/* Link para login */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-gray-900 hover:text-gray-700 font-medium underline underline-offset-4">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}