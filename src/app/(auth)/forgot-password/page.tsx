// src/app/(auth)/forgot-password/page.tsx
'use client'

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/AuthContext';

export default function EsqueciSenhaPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const isSubmittingRef = useRef(false);

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch (error: unknown) {
      console.error('Erro ao enviar email de recuperação:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email de recuperação';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Cabeçalho com logo */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Commish</h1>
            </Link>
          </div>

          <Card className="border border-gray-200 rounded-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                {/* Ícone de sucesso */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                {/* Título */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Email enviado com sucesso!
                </h2>

                {/* Descrição */}
                <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                  Enviamos um link de recuperação para <strong>{email}</strong>. 
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>

                {/* Botão para voltar ao login */}
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white h-10 rounded-md font-medium"
                >
                  <Link href="/login">
                    Voltar ao Login
                  </Link>
                </Button>

                {/* Link para reenviar */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setIsEmailSent(false);
                      setEmail('');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4 transition-colors"
                  >
                    Enviar novamente
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações adicionais */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              Não recebeu o email? Verifique sua pasta de spam.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Cabeçalho com logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Commish</h1>
          </Link>
          <p className="text-gray-600 text-sm">Recuperar senha</p>
        </div>

        <Card className="border border-gray-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-center text-gray-900">
              Esqueci minha senha
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Descrição */}
            <p className="text-gray-600 mb-6 text-sm leading-relaxed text-center">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>

            {/* Exibir erro */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => handleInputChange(e.target.value)}
                    maxLength={50}
                    className="pl-10 h-10 border-gray-200 rounded-md focus:border-gray-400 focus:ring-0"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Botão de envio */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white h-10 rounded-md font-medium flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner color="white" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar link de recuperação</span>
                )}
              </Button>
            </form>

            {/* Botão para voltar */}
            <div className="mt-6">
              <Button
                asChild
                variant="outline"
                className="w-full h-10 border-gray-200 hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar ao login</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Lembrou da senha?{' '}
            <Link href="/login" className="text-gray-900 hover:text-gray-700 font-medium underline underline-offset-4">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
