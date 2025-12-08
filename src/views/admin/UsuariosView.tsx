// src/views/admin/UsuariosView.tsx
'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, User, Building, Calendar } from 'lucide-react';
import { getAllUsers, countFluxosByUserId } from '@/lib/firebase';
import { UserData, DadosVendedor, DadosEmpresa } from '@/types/user';

interface UsuarioComFluxos extends UserData {
  quantidadeFluxos: number;
}

export default function UsuariosView() {
  const [usuarios, setUsuarios] = useState<UsuarioComFluxos[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        setIsLoading(true);
        const allUsers = await getAllUsers();
        
        // Buscar quantidade de fluxos para cada usuário
        const usuariosComFluxos = await Promise.all(
          allUsers.map(async (user) => {
            const quantidadeFluxos = await countFluxosByUserId(user.uid);
            return {
              ...user,
              quantidadeFluxos
            } as UsuarioComFluxos;
          })
        );
        
        setUsuarios(usuariosComFluxos);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsuarios();
  }, []);

  const getNomeUsuario = (user: UserData): string => {
    if (user.dadosPessoais) {
      if ('nome' in user.dadosPessoais) {
        return (user.dadosPessoais as DadosVendedor).nome;
      } else if ('razaoSocial' in user.dadosPessoais) {
        return (user.dadosPessoais as DadosEmpresa).razaoSocial;
      }
    }
    return 'Sem nome';
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return 'N/A';
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Usuários</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gerencie todos os usuários da plataforma
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Users className="w-4 h-4 mr-1" />
            {usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Lista de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usuarios.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ramo</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Fluxos</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plano</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.uid} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <code className="text-xs text-gray-600 font-mono">
                          {usuario.uid.substring(0, 8)}...
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {usuario.tipo === 'vendedor' ? (
                            <User className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Building className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {getNomeUsuario(usuario)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{usuario.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={
                            usuario.tipo === 'vendedor' 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }
                        >
                          {usuario.tipo === 'vendedor' ? 'Vendedor' : 'Empresa'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {usuario.ramo || '---'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          {usuario.quantidadeFluxos}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={
                            usuario.status === 'ativo' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : usuario.status === 'pendente'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }
                        >
                          {usuario.status === 'ativo' ? 'Ativo' : 
                           usuario.status === 'pendente' ? 'Pendente' : 
                           usuario.status === 'suspenso' ? 'Suspenso' : 'Cancelado'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {usuario.plano?.nome || 'N/A'}
                          </span>
                          {usuario.plano?.preco && (
                            <span className="text-xs text-gray-500">
                              {formatarMoeda(usuario.plano.preco)}/mês
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatarData(usuario.createdAt)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

