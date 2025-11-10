// src/app/(auth)/cadastro/page.tsx
'use client'

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle, User, Briefcase, Mail, Lock, Eye, EyeOff, CreditCard, Zap, Gift, Trophy, Star, Crown, Copy, Check, Upload } from 'lucide-react';
import { TipoUsuario, RamoNegocio } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { plans } from '@/constants/plans-mock';

function CadastroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedPix, setCopiedPix] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'vendedor' as TipoUsuario,
    ramo: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    plano: 'standart'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);
  const isSubmittingRef = useRef(false);

  const totalSteps = 5;

  // Detectar plano na URL
  useEffect(() => {
    const planoUrl = searchParams.get('plano');
    if (planoUrl) {
      setFormData(prev => ({ ...prev, plano: planoUrl }));
    }
  }, [searchParams]);


  const selectedPlan = plans.find(p => p.id === formData.plano) || plans[0];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (authError) {
      setAuthError('');
    }
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

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsLoading(true);
    setAuthError('');

    try {
      await signUp(formData.email, formData.senha, {
        tipo: formData.tipo,
        ramo: formData.ramo as RamoNegocio,
        dadosPessoais: formData.tipo === 'vendedor' 
          ? { nome: formData.nome, cpf: formData.cpf }
          : { razaoSocial: formData.nome, cnpj: formData.cpf }
      });
      
      router.push('/agenda');
    } catch (error: unknown) {
      console.error('Erro no cadastro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setAuthError(errorMessage);
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleCopyPixCode = () => {
    const pixCode = "00020126580014br.gov.bcb.pix0136exemplo-chave-pix-commish5204000053039865802BR5913Commish Ltda6009SAO PAULO62070503***6304ABCD";
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprovanteFile(file);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true; // Seleção de plano sempre válida (tem padrão)
      case 2:
        return formData.tipo === 'vendedor' || formData.tipo === 'empresa' && formData.ramo !== '';
      case 3:
        return formData.nome.trim() !== '' && formData.cpf.trim() !== '';
      case 4:
        return formData.email.trim() !== '' && formData.senha.trim() !== '' && formData.senha.length >= 6;
      case 5:
        return true; // Etapa de pagamento
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

  const stepIcons = [CreditCard, Briefcase, User, Mail, CreditCard];
  const stepTitles = ['Plano', 'Perfil', 'Dados', 'Credenciais', 'Pagamento'];

  return (
    <div 
      className="min-h-screen font-[family-name:var(--font-geist-sans)] flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url(/images/pattern-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md">
        {/* Cabeçalho com logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Commish</h1>
          </Link>
          <p className="text-gray-600 text-sm">Plataforma de Gestão de Comissões</p>
        </div>

        {/* Indicador de progresso */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;
              const IconComponent = stepIcons[i];
              
              return (
                <div key={stepNum} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all border text-xs ${
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
          
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] h-1.5 rounded-full transition-all duration-300"
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
            
            {/* Step 1: Seleção de Plano */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">Escolha seu plano:</p>
                </div>
                
                <div className="space-y-3">
                  {plans.map((plan) => {
                    const isSelected = formData.plano === plan.id;
                    
                    return (
                      <div
                        key={plan.id}
                        className={`
                          border-2 rounded-lg p-4 cursor-pointer transition-all
                          ${!plan.available ? 'opacity-50 cursor-not-allowed' : ''}
                          ${isSelected && plan.available
                            ? 'bg-gray-900 border-gray-900 text-white'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                          }
                        `}
                        onClick={() => plan.available && handleInputChange('plano', plan.id)}
                      >
                        <div className="flex items-center gap-3">                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-semibold ${isSelected && plan.available ? 'text-white' : 'text-gray-900'}`}>
                                {plan.name}
                              </h4>
                              <p className={`text-lg font-bold ${isSelected && plan.available ? 'text-white' : 'text-gray-900'}`}>
                                <span className="text-xs font-semibold mr-1">R$</span>{plan.price}<span className="text-xs font-normal">/mês</span>
                              </p>
                            </div>
                            <p className={`text-sm mb-2 ${isSelected && plan.available ? 'text-white/80' : 'text-gray-600'}`}>
                              {plan.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Tipo de Usuário + Área de Atuação */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-6 text-sm">Você é:</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.tipo === 'vendedor' 
                          ? 'bg-gray-900 border-gray-900 text-white' 
                          : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                      }`}
                      onClick={() => handleInputChange('tipo', 'vendedor')}
                    >
                      <div className="text-center">
                        <h3 className="font-semibold mb-1">Vendedor</h3>
                        <p className="text-xs opacity-75">Pessoa física</p>
                      </div>
                    </div>

                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.tipo === 'empresa' 
                          ? 'bg-gray-900 border-gray-900 text-white' 
                          : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                      }`}
                      onClick={() => handleInputChange('tipo', 'empresa')}
                    >
                      <div className="text-center">
                        <h3 className="font-semibold mb-1">Empresa</h3>
                        <p className="text-xs opacity-75">Pessoa jurídica</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ramo" className="text-sm font-medium text-gray-700">Sua Área de Atuação</Label>
                  <Select
                    value={formData.ramo}
                    onValueChange={(value) => handleInputChange('ramo', value)}
                  >
                    <SelectTrigger className="mt-2 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0">
                      <SelectValue placeholder="Selecione sua área de atuação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imóveis">Imóveis</SelectItem>
                      <SelectItem value="automóveis">Automóveis</SelectItem>
                      <SelectItem value="seguros">Seguros</SelectItem>
                      <SelectItem value="planos de saúde">Planos de Saúde</SelectItem>
                      <SelectItem value="vendedor digital">Vendedor Digital</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Dados Pessoais */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {formData.tipo === 'vendedor' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="razaoSocial" className="text-sm font-medium text-gray-700">Razão Social</Label>
                      <Input
                        id="razaoSocial"
                        type="text"
                        placeholder="Digite a razão social da empresa"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        className="mt-2 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">CNPJ</Label>
                      <Input
                        id="cnpj"
                        type="text"
                        placeholder="00.000.000/0000-00"
                        value={formData.cpf}
                        onChange={(e) => handleCPFChange(e.target.value)}
                        className="mt-2 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Credenciais */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-2 pl-10 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="senha" className="text-sm font-medium text-gray-700">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.senha}
                      onChange={(e) => handleInputChange('senha', e.target.value)}
                      className="mt-2 pl-10 pr-10 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
                </div>
              </div>
            )}

            {/* Step 5: Pagamento */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {/* Resumo do Plano */}
                <div className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Plano {selectedPlan.name}</h3>
                    <span className="text-2xl font-bold">
                      R$ {selectedPlan.priceValue.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">{selectedPlan.description}</p>
                </div>

                {/* QR Code Pix */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Escaneie o QR Code para pagar via Pix:</p>
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
                    <img 
                      src="/images/pixqrcode.png" 
                      alt="QR Code Pix" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                </div>

                {/* Código Pix Copia e Cola (DESABILITADO) */}
                <div className="opacity-50 cursor-not-allowed">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Ou use o código Pix copia e cola:
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value="00020126580014br.gov.bcb.pix...6304ABCD"
                      readOnly
                      className="border-gray-200 text-xs bg-gray-50"
                      disabled
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPixCode}
                      className="flex-shrink-0"
                      disabled
                    >
                      {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Funcionalidade temporariamente indisponível
                  </p>
                </div>

                {/* Aviso */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    Após o pagamento, envie o comprovante abaixo para que sua conta seja ativada.
                  </p>
                </div>

                {/* Upload de Comprovante */}
                <div>
                  <Label htmlFor="comprovante" className="text-sm font-medium text-gray-700 mb-2 block">
                    Envie o comprovante de pagamento:
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="comprovante"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="comprovante" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {comprovanteFile ? (
                          <span className="text-green-600 font-medium">
                            Arquivo selecionado: {comprovanteFile.name}
                          </span>
                        ) : (
                          <>Clique para selecionar o comprovante</>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos aceitos: JPG, PNG, PDF, DOC (máx. 10MB)
                      </p>
                    </label>
                  </div>
                </div>
                
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
                  className="flex items-center space-x-2 bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white h-10 px-4 rounded-md font-medium"
                >
                  <span>Próximo</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isLoading || !comprovanteFile}
                  className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white h-10 px-4 rounded-md font-medium disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner color="white" />
                      <span>Finalizando...</span>
                    </>
                  ) : (
                    'Finalizar Cadastro'
                  )}
                </Button>
              )}
            </div>

            {/* Erro de autenticação */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}
          </CardContent>
        </Card>

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

export default function CadastroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <CadastroContent />
    </Suspense>
  );
}