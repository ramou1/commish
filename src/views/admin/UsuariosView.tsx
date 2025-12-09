// src/views/admin/UsuariosView.tsx
'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, User, Building, Calendar, X } from 'lucide-react';
import { getAllUsers, countFluxosByUserId } from '@/lib/firebase';
import { UserData, DadosVendedor, DadosEmpresa } from '@/types/user';

interface UsuarioComFluxos extends UserData {
  quantidadeFluxos: number;
}

export default function UsuariosView() {
  const [usuarios, setUsuarios] = useState<UsuarioComFluxos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioComFluxos | null>(null);

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

  const capitalizarRamo = (ramo: string | undefined): string => {
    if (!ramo) return '---';
    return ramo.charAt(0).toUpperCase() + ramo.slice(1);
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ramo</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Fluxos</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plano</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr 
                      key={usuario.uid} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedUsuario(usuario)}
                    >
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
                        <span className="text-sm font-medium text-gray-900">
                          {getNomeUsuario(usuario)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{usuario.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {capitalizarRamo(usuario.ramo)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          {usuario.quantidadeFluxos}
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

      {/* Modal de Detalhes do Usuário */}
      {selectedUsuario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 rounded-t-lg">
              <h3 className="text-xl font-semibold text-gray-900">Detalhes do Usuário</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUsuario(null)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Conteúdo Scrollável */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Informações Básicas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">ID</label>
                      <p className="text-sm text-gray-900 font-mono mt-1 break-all">{selectedUsuario.uid}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedUsuario.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Tipo</label>
                      <div className="mt-1">
                        <Badge 
                          variant="outline" 
                          className={
                            selectedUsuario.tipo === 'vendedor' 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }
                        >
                          {selectedUsuario.tipo === 'vendedor' ? 'Vendedor' : 'Empresa'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Ramo</label>
                      <p className="text-sm text-gray-900 mt-1">{capitalizarRamo(selectedUsuario.ramo)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                      <div className="mt-1">
                        <Badge 
                          variant="outline" 
                          className={
                            selectedUsuario.status === 'ativo' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : selectedUsuario.status === 'pendente'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }
                        >
                          {selectedUsuario.status === 'ativo' ? 'Ativo' : 
                           selectedUsuario.status === 'pendente' ? 'Pendente' : 
                           selectedUsuario.status === 'suspenso' ? 'Suspenso' : 'Cancelado'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Liberado</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedUsuario.liberado ? 'Sim' : 'Não'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dados Pessoais */}
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Dados Pessoais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUsuario.tipo === 'vendedor' ? (
                      <>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Nome</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {(selectedUsuario.dadosPessoais as DadosVendedor)?.nome || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">CPF</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {(selectedUsuario.dadosPessoais as DadosVendedor)?.cpf || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Telefone</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {(selectedUsuario.dadosPessoais as DadosVendedor)?.tel || 'N/A'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Razão Social</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {(selectedUsuario.dadosPessoais as DadosEmpresa)?.razaoSocial || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">CNPJ</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {(selectedUsuario.dadosPessoais as DadosEmpresa)?.cnpj || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Telefone</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {(selectedUsuario.dadosPessoais as DadosEmpresa)?.tel || 'N/A'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Plano */}
                {selectedUsuario.plano && (
                  <div className="border-b border-gray-200 pb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Plano</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Nome do Plano</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedUsuario.plano.nome}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Preço</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {formatarMoeda(selectedUsuario.plano.preco)}/mês
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Data de Início</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {formatarData(selectedUsuario.plano.dataInicio)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Data de Renovação</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {formatarData(selectedUsuario.plano.dataRenovacao)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comprovante */}
                {selectedUsuario.comprovante && (
                  <div className="border-b border-gray-200 pb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Comprovante de Pagamento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Nome do Arquivo</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedUsuario.comprovante.nomeArquivo}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                        <div className="mt-1">
                          <Badge 
                            variant="outline" 
                            className={
                              selectedUsuario.comprovante.status === 'aprovado'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : selectedUsuario.comprovante.status === 'pendente'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }
                          >
                            {selectedUsuario.comprovante.status === 'aprovado' ? 'Aprovado' :
                             selectedUsuario.comprovante.status === 'pendente' ? 'Pendente' : 'Rejeitado'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Data de Upload</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {formatarData(selectedUsuario.comprovante.dataUpload)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estatísticas */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Estatísticas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Quantidade de Fluxos</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedUsuario.quantidadeFluxos}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Data de Cadastro</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatarData(selectedUsuario.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Última Atualização</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatarData(selectedUsuario.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-lg">
              <Button
                variant="outline"
                onClick={() => setSelectedUsuario(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

