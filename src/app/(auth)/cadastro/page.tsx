// src/app/(auth)/cadastro/page.tsx
'use client'

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle, User, Briefcase, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { TipoUsuario, RamoNegocio } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';


export default function CadastroPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tipo: 'vendedor' as TipoUsuario,
    ramo: '',
    nome: '',
    cpf: '',
    email: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const isSubmittingRef = useRef(false);

  const totalSteps = 4;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar erro de autenticação
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
    if (isSubmittingRef.current) return; // Prevenir cliques duplos
    
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
      
      // Redirecionar para dashboard após cadastro bem-sucedido
      router.push('/agenda');
      // Não definir setIsLoading(false) aqui - deixar o loading até a navegação
    } catch (error: unknown) {
      console.error('Erro no cadastro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setAuthError(errorMessage);
      setIsLoading(false); // Só parar o loading em caso de erro
      isSubmittingRef.current = false; // Reset apenas em caso de erro
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmittingRef.current) return; // Prevenir cliques duplos
    
    isSubmittingRef.current = true;
    setIsLoading(true);
    setAuthError('');

    try {
      await signInWithGoogle();
      // Redirecionar para dashboard após login bem-sucedido
      router.push('/agenda');
      // Não definir setIsLoading(false) aqui - deixar o loading até a navegação
    } catch (error: unknown) {
      console.error('Erro no login com Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setAuthError(errorMessage);
      setIsLoading(false); // Só parar o loading em caso de erro
      isSubmittingRef.current = false; // Reset apenas em caso de erro
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.tipo === 'vendedor' || formData.tipo === 'empresa';
      case 2:
        return formData.nome.trim() !== '' && formData.cpf.trim() !== '';
      case 3:
        return formData.ramo !== '';
      case 4:
        return formData.email.trim() !== '' && formData.senha.trim() !== '' && formData.senha.length >= 6;
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

  const stepIcons = [User, User, Briefcase, Mail];
  const stepTitles = ['Tipo de Usuário', 'Dados Pessoais', 'Área de Atuação', 'Credenciais'];

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
              className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] h-1 rounded-full transition-all duration-300"
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
            
            {/* Step 1: Tipo de Usuário */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-6 text-sm">Você é:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Opção Vendedor */}
                    <div 
                      className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                        formData.tipo === 'vendedor' 
                          ? 'bg-gray-900 border-gray-900 text-white' 
                          : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                      }`}
                      onClick={() => handleInputChange('tipo', 'vendedor')}
                    >
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2">Vendedor</h3>
                        <p className="text-sm opacity-75">Pessoa física que vende produtos ou serviços</p>
                      </div>
                    </div>

                    {/* Opção Empresa */}
                    <div 
                      className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                        formData.tipo === 'empresa' 
                          ? 'bg-gray-900 border-gray-900 text-white' 
                          : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                      }`}
                      onClick={() => handleInputChange('tipo', 'empresa')}
                    >
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2">Empresa</h3>
                        <p className="text-sm opacity-75">Pessoa jurídica que oferece produtos ou serviços</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Dados Pessoais */}
            {currentStep === 2 && (
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

            {/* Step 3: Área de Atuação */}
            {currentStep === 3 && (
              <div className="space-y-4">
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
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">A senha deve ter pelo menos 6 caracteres</p>
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
                  disabled={!isStepValid() || isLoading}
                  className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white h-10 px-4 rounded-md font-medium disabled:opacity-70 disabled:cursor-not-allowed"
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

            {/* Exibir erro de autenticação */}
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}
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
            onClick={handleGoogleSignIn}
            className="w-full h-10 border-gray-200 hover:bg-gray-50 flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed"
            disabled={true}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700">
              Continuar com Google (Em breve)
            </span>
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