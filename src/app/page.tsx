// src/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  CheckCircle,
  Lock,
} from "lucide-react";
import { plans } from "@/constants/plans-mock";

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: "Gestão de Comissões",
      description:
        "Organize e acompanhe todas as suas comissões em um só lugar",
    },
    {
      icon: DollarSign,
      title: "Antecipação Inteligente",
      description: "Antecipe seus recebimentos com taxas transparentes",
    },
    {
      icon: TrendingUp,
      title: "Dashboard Completo",
      description: "Visualize sua performance e planeje seu crescimento",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Seus dados protegidos com a mais alta segurança",
    },
  ];

  const benefits = [
    "Controle total dos seus recebimentos",
    "Antecipação com as melhores taxas",
    "Interface intuitiva e fácil de usar",
    "Suporte especializado",
    "Integração com principais fundos",
    "Relatórios detalhados",
  ];


  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <div
        className="relative"
        style={{
          backgroundImage: "url(/images/pattern-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-32">
          <div className="text-center">
            {/* Logo e título */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Image
                  src="/images/icone.png"
                  alt="Charts"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
                <h1 className="text-6xl font-semibold tracking-tight text-gray-900">
                  Commish
                </h1>
              </div>
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
                Conectamos vendedores, empresas e fundos em uma plataforma
                única. Gerencie suas comissões, antecipe recebimentos e tenha
                controle total sobre sua vida financeira.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white border-0 h-11 px-8 rounded-md font-medium transition-all duration-200"
                >
                  <Link href="/cadastro">
                    Começar Agora
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-8 rounded-md font-medium border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  <Link href="/login">Já tenho conta</Link>
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

              const getIconColors = () => {
                return {
                  bg: "bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)]",
                  icon: "text-white",
                };
              };

              const colors = getIconColors();

              return (
                <Card
                  key={index}
                  className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-colors"
                >
                  <CardContent className="p-0">
                    <div
                      className={`w-10 h-10 ${colors.bg} rounded-md flex items-center justify-center mb-4`}
                    >
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
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

      {/* Pricing Section - NOVA */}
      <div className="py-20 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-lg text-gray-600">
              Comece gratuitamente e escale conforme seu crescimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {plans.map((plan, index) => {
              return (
                <Card
                  key={index}
                  className={`
                    border-2 rounded-xl transition-all duration-300 relative overflow-hidden
                    ${
                      plan.available
                        ? "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                        : "border-gray-100 opacity-60"
                    }
                    ${
                      plan.popular ? "ring-2 ring-purple-500 ring-offset-2" : ""
                    }
                  `}
                >
                  {/* Badge "Em Breve" ou "Popular" */}
                  {!plan.available && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Em Breve
                      </div>
                    </div>
                  )}

                  {plan.popular && plan.available && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                  )}

                  <CardContent className="p-4">
                    {/* Nome do plano */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>

                    {/* Preço */}
                    <div className="mb-4">
                      <span className="text-gray-700 text-sm font-medium mr-1">R$</span>
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 text-sm">/mês</span>
                    </div>

                    {/* Descrição */}
                    <p className="text-sm text-gray-600 mb-6 min-h-[40px]">
                      {plan.description}
                    </p>

                    {/* Botão CTA */}
                    <Button
                      asChild={plan.available}
                      disabled={!plan.available}
                      className={`
                        w-full mb-6 h-10 rounded-md font-medium transition-all duration-200
                        ${
                          plan.available
                            ? "bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white border-0"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed border-0"
                        }
                      `}
                    >
                      {plan.available ? (
                        <Link href={`/cadastro?plano=${plan.name.toLowerCase()}`}>Contratar</Link>
                      ) : (
                        <span>Em Breve</span>
                      )}
                    </Button>

                    {/* Lista de features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              plan.available
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              plan.available ? "text-gray-700" : "text-gray-500"
                            }`}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Nota de rodapé */}
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">
              💡 Todos os planos incluem 14 dias de teste gratuito. Cancele
              quando quiser.
            </p>
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
                O Commish oferece uma solução completa para vendedores que
                querem ter controle total sobre suas comissões e acelerar seus
                recebimentos.
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
                  Faça parte da comunidade que está revolucionando a gestão de
                  comissões na América Latina.
                </p>
                <Button
                  asChild
                  className="w-1/2 bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white border-0 h-10 rounded-md font-medium transition-all duration-200"
                >
                  <Link href="/cadastro">
                    Criar conta 
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
            Comece agora mesmo e veja como é fácil ter controle total dos seus
            recebimentos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[var(--custom-green)] to-[var(--custom-cyan)] hover:from-[var(--custom-green)]/90 hover:to-[var(--custom-cyan)]/90 text-white border-0 h-11 px-8 rounded-md font-medium transition-all duration-200"
            >
              <Link href="/cadastro">
                Comece agora
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
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Commish
            </h3>
            <p className="text-gray-500 mb-8 text-sm">
              Plataforma de gestão e antecipação de comissões para América
              Latina
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
