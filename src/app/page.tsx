// src/app/page.tsx
'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield,
  Users,
  CheckCircle
} from 'lucide-react';
export default function HomePage() {

  const features = [
    {
      icon: Calendar,
      title: 'Gestão de Comissões',
      description: 'Organize e acompanhe todas as suas comissões em um só lugar'
    },
    {
      icon: DollarSign,
      title: 'Antecipação Inteligente',
      description: 'Antecipe seus recebimentos com taxas transparentes'
    },
    {
      icon: TrendingUp,
      title: 'Dashboard Completo',
      description: 'Visualize sua performance e planeje seu crescimento'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com a mais alta segurança'
    }
  ];

  const benefits = [
    'Controle total dos seus recebimentos',
    'Antecipação com as melhores taxas',
    'Interface intuitiva e fácil de usar',
    'Suporte especializado',
    'Integração com principais fundos',
    'Relatórios detalhados'
  ];

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <div className="relative bg-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center">
            {/* Logo e título */}
            <div className="mb-12">
              <h1 className="text-6xl font-semibold tracking-tight text-gray-900 mb-6">
                Commish
              </h1>
              <p className="text-xl text-gray-600 mb-3 font-medium">
                Plataforma de Gestão e Antecipação de Comissões
              </p>
              <p className="text-base text-gray-500">
                Brasil + América Latina | Modelo B2B2C
              </p>
            </div>

            {/* Descrição principal */}
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Conectamos vendedores, empresas e fundos em uma plataforma única. 
                Gerencie suas comissões, antecipe recebimentos e tenha controle total 
                sobre sua vida financeira.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white border-0 h-11 px-8 rounded-md font-medium transition-all duration-200">
                  <Link href="/cadastro" prefetch={false}>
                    Começar Agora
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-11 px-8 rounded-md font-medium border-gray-200 hover:bg-gray-50 transition-all duration-200">
                  <Link href="/login" prefetch={false}>
                    Já tenho conta
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
              Por que escolher o Commish?
            </h2>
            <p className="text-lg text-gray-600">
              Recursos pensados especialmente para vendedores que querem crescer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-colors">
                  <CardContent className="p-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-6">
                Tudo o que você precisa em uma única plataforma
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                O Commish oferece uma solução completa para vendedores que querem 
                ter controle total sobre suas comissões e acelerar seus recebimentos.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-gray-700 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-8">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-700 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Junte-se aos vendedores que estão crescendo
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Faça parte da comunidade que está revolucionando 
                  a gestão de comissões na América Latina.
                </p>
                <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 h-10 rounded-md font-medium transition-all duration-200">
                  <Link href="/cadastro" prefetch={false}>
                    Criar conta gratuita
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
            Pronto para transformar sua gestão de comissões?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Comece agora mesmo e veja como é fácil ter controle total dos seus recebimentos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white border-0 h-11 px-8 rounded-md font-medium transition-all duration-200">
              <Link href="/cadastro" prefetch={false}>
                Começar gratuitamente
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Commish</h3>
            <p className="text-gray-500 mb-8 text-sm">
              Plataforma de gestão e antecipação de comissões para América Latina
            </p>
            <div className="border-t border-gray-100 pt-8">
              <p className="text-gray-400 text-xs">
                © 2025 Commish. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}