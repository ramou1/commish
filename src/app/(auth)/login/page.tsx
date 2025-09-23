// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginData {
  email: string;
  senha: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [authError, setAuthError] = useState('');

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar erro do campo quando usuário digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    // Limpar erro de autenticação
    if (authError) {
      setAuthError('');
    }
  };

  const validateForm = () => {
    const newErrors: Partial<LoginData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setAuthError('');

    try {
      await signIn(formData.email, formData.senha);
      // Redirecionar para dashboard após login bem-sucedido
      router.push('/agenda');
    } catch (error: any) {
      console.error('Erro no login:', error);
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError('');

    try {
      await signInWithGoogle();
      // Redirecionar para dashboard após login bem-sucedido
      router.push('/agenda');
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Cabeçalho com logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Commish</h1>
          </Link>
          <p className="text-gray-600 text-sm">Faça login em sua conta</p>
        </div>

        <Card className="border border-gray-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-center text-gray-900">Entrar</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Exibir erro de autenticação */}
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 h-10 border-gray-200 rounded-md focus:border-gray-400 focus:ring-0 ${errors.email ? 'border-red-300' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-medium text-gray-700">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
                    className={`pl-10 pr-10 h-10 border-gray-200 rounded-md focus:border-gray-400 focus:ring-0 ${errors.senha ? 'border-red-300' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.senha && (
                  <p className="text-xs text-red-500">{errors.senha}</p>
                )}
              </div>

              {/* Esqueci a senha */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-gray-900 hover:text-gray-700 underline underline-offset-4"
                  disabled={isLoading}
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Botão de login */}
              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white h-10 rounded-md font-medium flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Separador */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-medium">ou</span>
              </div>
            </div>

            {/* Botão do Google */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full h-10 border-gray-200 hover:bg-gray-50 flex items-center justify-center space-x-2 mb-8"
              disabled={isLoading}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700">Continuar com Google</span>
            </Button>

            {/* Link para cadastro */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Não tem uma conta?{' '}
                <Link 
                  href="/cadastro" 
                  className="text-gray-900 hover:text-gray-700 font-medium underline underline-offset-4"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Gerencie suas comissões de forma simples e eficiente
          </p>
        </div>
      </div>
    </div>
  );
}