// src/app/(auth)/cadastro/page.tsx
'use client'

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle, User, Briefcase, Mail, Lock, Eye, EyeOff, CreditCard, Copy, Check } from 'lucide-react';
import { TipoUsuario, RamoNegocio } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { plans } from '@/constants/plans-mock';
import { sanitizeEndereco } from '@/lib/validationUtils';

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
    tel: '',
    email: '',
    senha: '',
    plano: 'standart'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  // const [comprovanteFile, setComprovanteFile] = useState<File | null>(null); // Inserção de comprovante removido - comentado
  const [metodoPagamento, setMetodoPagamento] = useState<'boleto' | 'pix'>('boleto'); // Boleto como padrão
  const [dadosBoleto, setDadosBoleto] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
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
      // Buscar informações completas do plano selecionado
      const selectedPlan = plans.find(p => p.id === formData.plano);
      
      if (!selectedPlan) {
        throw new Error('Plano selecionado não encontrado');
      }

      // Criar usuário
      await signUp(formData.email, formData.senha, {
        tipo: formData.tipo,
        ramo: formData.ramo as RamoNegocio,
        dadosPessoais: formData.tipo === 'vendedor' 
          ? { nome: formData.nome, cpf: formData.cpf, tel: formData.tel }
          : { razaoSocial: formData.nome, cnpj: formData.cpf, tel: formData.tel },
        planoId: formData.plano,
        planoNome: selectedPlan.name,
        planoPreco: selectedPlan.priceValue,
        comprovanteFile: undefined // Comprovante removido temporariamente
      });

      // Se for boleto, salvar solicitação de boleto após criar o usuário
      if (metodoPagamento === 'boleto') {
        const { saveBoletoRequest, auth } = await import('@/lib/firebase');
        
        // Aguardar um pouco para garantir que o usuário foi criado e autenticado
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const currentUser = auth.currentUser;
        if (currentUser?.uid) {
          // Sanitizar dados de endereço antes de salvar (prevenção de segurança)
          const enderecoSanitizado = sanitizeEndereco({
            cep: dadosBoleto.cep,
            rua: dadosBoleto.rua,
            numero: dadosBoleto.numero,
            complemento: dadosBoleto.complemento,
            bairro: dadosBoleto.bairro,
            cidade: dadosBoleto.cidade,
            estado: dadosBoleto.estado
          });
          
          await saveBoletoRequest({
            userId: currentUser.uid,
            userEmail: formData.email,
            userName: formData.nome,
            userTipo: formData.tipo,
            cpfCnpj: formData.cpf,
            telefone: formData.tel,
            planoId: formData.plano,
            planoNome: selectedPlan.name,
            planoPreco: selectedPlan.priceValue,
            endereco: enderecoSanitizado
          });
        }
      }
      
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

  // Inserção de comprovante removido - função comentada
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setComprovanteFile(file);
  //   }
  // };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true; // Seleção de plano sempre válida (tem padrão)
      case 2:
        return formData.tipo === 'vendedor' || formData.tipo === 'empresa' && formData.ramo !== '';
      case 3:
        return formData.nome.trim() !== '' && formData.cpf.trim() !== '' && formData.tel.trim() !== '';
      case 4:
        return formData.email.trim() !== '' && formData.senha.trim() !== '' && formData.senha.length >= 6;
      case 5:
        if (metodoPagamento === 'boleto') {
          // Validar campos de endereço para boleto
          return dadosBoleto.cep.trim() !== '' && 
                 dadosBoleto.rua.trim() !== '' && 
                 dadosBoleto.numero.trim() !== '' && 
                 dadosBoleto.bairro.trim() !== '' && 
                 dadosBoleto.cidade.trim() !== '' && 
                 dadosBoleto.estado.trim() !== '';
        }
        return true; // Para PIX, não precisa validar nada (comprovante foi removido)
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

  const formatCNPJ = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    if (formatted.length <= 18) {
      handleInputChange('cpf', formatted);
    }
  };

  const handleTelefoneChange = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formatação para (00) 00000-0000
    let formatted = numbers;
    if (numbers.length > 0) {
      formatted = `(${numbers.substring(0, 2)}`;
    }
    if (numbers.length > 2) {
      formatted += `) ${numbers.substring(2, 7)}`;
    }
    if (numbers.length > 7) {
      formatted += `-${numbers.substring(7, 11)}`;
    }
    
    handleInputChange('tel', formatted);
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
                  <p className="text-sm text-gray-700 mb-2 font-medium">Escolha seu plano:</p>
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
                  <p className="text-sm text-gray-700 mb-2 font-medium">Você é:</p>
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

                <div className="flex flex-col items-center mt-8">
                  <Label htmlFor="ramo" className="text-sm text-gray-700 mb-2">Sua Área de Atuação:</Label>
                  <Select
                    value={formData.ramo}
                    onValueChange={(value) => handleInputChange('ramo', value)}
                  >
                    <SelectTrigger className="border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0">
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
                        maxLength={50}
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
                        maxLength={50}
                        className="mt-2 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tel" className="text-sm font-medium text-gray-700">Telefone</Label>
                      <Input
                        id="tel"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={formData.tel}
                        onChange={(e) => handleTelefoneChange(e.target.value)}
                        maxLength={50}
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
                        maxLength={50}
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
                        onChange={(e) => handleCNPJChange(e.target.value)}
                        maxLength={50}
                        className="mt-2 border-gray-200 rounded-md h-10 focus:border-gray-400 focus:ring-0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tel" className="text-sm font-medium text-gray-700">Telefone</Label>
                      <Input
                        id="tel"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={formData.tel}
                        onChange={(e) => handleTelefoneChange(e.target.value)}
                        maxLength={50}
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
                      maxLength={50}
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
                      maxLength={50}
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

                {/* Seleção de Método de Pagamento */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Escolha o método de pagamento:
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        metodoPagamento === 'boleto' 
                          ? 'bg-gray-900 border-gray-900 text-white' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setMetodoPagamento('boleto')}
                    >
                      <div className="text-center">
                        <CreditCard className={`w-6 h-6 mx-auto mb-2 ${metodoPagamento === 'boleto' ? 'text-white' : 'text-gray-600'}`} />
                        <h3 className="font-semibold mb-1">Boleto</h3>
                        <p className="text-xs opacity-75">Pagamento via boleto bancário</p>
                      </div>
                    </div>

                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        metodoPagamento === 'pix' 
                          ? 'bg-gray-900 border-gray-900 text-white' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setMetodoPagamento('pix')}
                    >
                      <div className="text-center">
                        <CreditCard className={`w-6 h-6 mx-auto mb-2 ${metodoPagamento === 'pix' ? 'text-white' : 'text-gray-600'}`} />
                        <h3 className="font-semibold mb-1">PIX</h3>
                        <p className="text-xs opacity-75">Pagamento instantâneo</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulário de Dados para Boleto */}
                {metodoPagamento === 'boleto' && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        Confirme os dados abaixo que serão utilizados para gerar o boleto. Após a confirmação, nossa equipe irá gerar o boleto e enviar para você.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nomeBoleto" className="text-sm font-medium text-gray-700">
                          {formData.tipo === 'vendedor' ? 'Nome Completo' : 'Razão Social'}
                        </Label>
                        <Input
                          id="nomeBoleto"
                          type="text"
                          value={formData.nome}
                          readOnly
                          className="mt-2 border-gray-200 rounded-md h-10 bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cpfCnpjBoleto" className="text-sm font-medium text-gray-700">
                          {formData.tipo === 'vendedor' ? 'CPF' : 'CNPJ'}
                        </Label>
                        <Input
                          id="cpfCnpjBoleto"
                          type="text"
                          value={formData.cpf}
                          readOnly
                          className="mt-2 border-gray-200 rounded-md h-10 bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emailBoleto" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="emailBoleto"
                          type="email"
                          value={formData.email}
                          readOnly
                          className="mt-2 border-gray-200 rounded-md h-10 bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telBoleto" className="text-sm font-medium text-gray-700">Telefone</Label>
                        <Input
                          id="telBoleto"
                          type="tel"
                          value={formData.tel}
                          readOnly
                          className="mt-2 border-gray-200 rounded-md h-10 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="cep" className="text-sm font-medium text-gray-700">CEP <span className="text-red-500">*</span></Label>
                        <Input
                          id="cep"
                          type="text"
                          placeholder="00000-000"
                          value={dadosBoleto.cep}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            const formatted = value.replace(/(\d{5})(\d{3})/, '$1-$2');
                            setDadosBoleto({ ...dadosBoleto, cep: formatted });
                          }}
                          maxLength={9}
                          className="mt-2 border-gray-200 rounded-md h-10"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="rua" className="text-sm font-medium text-gray-700">Rua <span className="text-red-500">*</span></Label>
                        <Input
                          id="rua"
                          type="text"
                          placeholder="Nome da rua"
                          value={dadosBoleto.rua}
                          onChange={(e) => setDadosBoleto({ ...dadosBoleto, rua: e.target.value })}
                          maxLength={100}
                          className="mt-2 border-gray-200 rounded-md h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="numero" className="text-sm font-medium text-gray-700">Número <span className="text-red-500">*</span></Label>
                        <Input
                          id="numero"
                          type="text"
                          placeholder="123"
                          value={dadosBoleto.numero}
                          onChange={(e) => setDadosBoleto({ ...dadosBoleto, numero: e.target.value })}
                          maxLength={10}
                          className="mt-2 border-gray-200 rounded-md h-10"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="complemento" className="text-sm font-medium text-gray-700">Complemento</Label>
                        <Input
                          id="complemento"
                          type="text"
                          placeholder="Apto, Bloco, etc."
                          value={dadosBoleto.complemento}
                          onChange={(e) => setDadosBoleto({ ...dadosBoleto, complemento: e.target.value })}
                          maxLength={100}
                          className="mt-2 border-gray-200 rounded-md h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bairro" className="text-sm font-medium text-gray-700">Bairro <span className="text-red-500">*</span></Label>
                        <Input
                          id="bairro"
                          type="text"
                          placeholder="Nome do bairro"
                          value={dadosBoleto.bairro}
                          onChange={(e) => setDadosBoleto({ ...dadosBoleto, bairro: e.target.value })}
                          maxLength={50}
                          className="mt-2 border-gray-200 rounded-md h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">Cidade <span className="text-red-500">*</span></Label>
                        <Input
                          id="cidade"
                          type="text"
                          placeholder="Nome da cidade"
                          value={dadosBoleto.cidade}
                          onChange={(e) => setDadosBoleto({ ...dadosBoleto, cidade: e.target.value })}
                          maxLength={50}
                          className="mt-2 border-gray-200 rounded-md h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="estado" className="text-sm font-medium text-gray-700">Estado <span className="text-red-500">*</span></Label>
                        <Input
                          id="estado"
                          type="text"
                          placeholder="UF"
                          value={dadosBoleto.estado}
                          onChange={(e) => setDadosBoleto({ ...dadosBoleto, estado: e.target.value.toUpperCase() })}
                          maxLength={2}
                          className="mt-2 border-gray-200 rounded-md h-10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Code Pix */}
                {metodoPagamento === 'pix' && (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">Escaneie o QR Code para pagar via Pix:</p>
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
                        <Image 
                          src="/images/pixqrcode.png" 
                          alt="QR Code Pix" 
                          width={192}
                          height={192}
                          className="mx-auto"
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
                    </div>

                    {/* Aviso PIX - Upload de comprovante comentado */}
                    {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        Após o pagamento, envie o comprovante abaixo para que sua conta seja ativada.
                      </p>
                    </div> */}

                    {/* Upload de Comprovante - COMENTADO TEMPORARIAMENTE */}
                    {/* <div>
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
                    </div> */}
                  </>
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
                  className="flex items-center space-x-2 bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white h-10 px-4 rounded-md font-medium"
                >
                  <span>Próximo</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isLoading}
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