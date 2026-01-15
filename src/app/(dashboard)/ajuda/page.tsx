'use client'

import { useEffect, useState } from 'react';
import { getAllAjudaMessages, updateAjudaMessageStatus, AjudaMessage } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timestamp } from 'firebase/firestore';
import { 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  User,
  Mail,
  Filter
} from 'lucide-react';
import { formatarDataBrasil } from '@/lib/dateUtils';

const tipoLabels: Record<string, string> = {
  sugestao: 'Sugestão',
  duvida: 'Dúvida',
  problema: 'Problema',
  melhoria: 'Melhoria',
  outro: 'Outro'
};

const tipoColors: Record<string, string> = {
  sugestao: 'bg-purple-100 text-purple-800 border-purple-200',
  duvida: 'bg-blue-100 text-blue-800 border-blue-200',
  problema: 'bg-red-100 text-red-800 border-red-200',
  melhoria: 'bg-green-100 text-green-800 border-green-200',
  outro: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function AjudaPage() {
  const [mensagens, setMensagens] = useState<(AjudaMessage & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  useEffect(() => {
    loadMensagens();
  }, []);

  const loadMensagens = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAjudaMessages();
      setMensagens(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      alert('Erro ao carregar mensagens de ajuda');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (messageId: string, newStatus: 'pendente' | 'respondido' | 'resolvido') => {
    try {
      await updateAjudaMessageStatus(messageId, newStatus);
      await loadMensagens();
      alert(`Status atualizado para: ${newStatus === 'pendente' ? 'Pendente' : newStatus === 'respondido' ? 'Respondido' : 'Resolvido'}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'respondido':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Respondido</Badge>;
      case 'resolvido':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolvido</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatarTimestamp = (timestamp: unknown) => {
    if (!timestamp) return 'N/A';
    try {
      // Verificar se é uma instância de Timestamp do Firebase
      if (timestamp instanceof Timestamp) {
        return formatarDataBrasil(timestamp.toDate());
      }
      // Verificar se tem o método toDate (fallback)
      if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
        const ts = timestamp as { toDate: () => Date };
        return formatarDataBrasil(ts.toDate());
      }
      return 'N/A';
    } catch {
      return 'N/A';
    }
  };

  // Filtrar mensagens
  const mensagensFiltradas = mensagens.filter(msg => {
    const matchTipo = filtroTipo === 'todos' || msg.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || msg.status === filtroStatus;
    return matchTipo && matchStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Central de Ajuda</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie as mensagens de ajuda, sugestões e dúvidas dos usuários
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Tipo:</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="sugestao">Sugestão</option>
                <option value="duvida">Dúvida</option>
                <option value="problema">Problema</option>
                <option value="melhoria">Melhoria</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Status:</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="respondido">Respondido</option>
                <option value="resolvido">Resolvido</option>
              </select>
            </div>
            <div className="ml-auto text-sm text-gray-600">
              {mensagensFiltradas.length} de {mensagens.length} mensagens
            </div>
          </div>
        </CardContent>
      </Card>

      {mensagensFiltradas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {mensagens.length === 0 
                ? 'Nenhuma mensagem de ajuda encontrada' 
                : 'Nenhuma mensagem encontrada com os filtros selecionados'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mensagensFiltradas.map((mensagem) => (
            <Card key={mensagem.id} className="border border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      mensagem.tipo === 'sugestao' ? 'bg-purple-100' :
                      mensagem.tipo === 'duvida' ? 'bg-blue-100' :
                      mensagem.tipo === 'problema' ? 'bg-red-100' :
                      mensagem.tipo === 'melhoria' ? 'bg-green-100' :
                      'bg-gray-100'
                    }`}>
                      <MessageSquare className={`w-5 h-5 ${
                        mensagem.tipo === 'sugestao' ? 'text-purple-600' :
                        mensagem.tipo === 'duvida' ? 'text-blue-600' :
                        mensagem.tipo === 'problema' ? 'text-red-600' :
                        mensagem.tipo === 'melhoria' ? 'text-green-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={tipoColors[mensagem.tipo] || tipoColors.outro}>
                          {tipoLabels[mensagem.tipo] || mensagem.tipo}
                        </Badge>
                        {getStatusBadge(mensagem.status)}
                      </div>
                      <CardTitle className="text-lg mb-1">{mensagem.userName}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{mensagem.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatarTimestamp(mensagem.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Mensagem
                  </h4>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{mensagem.descricao}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {mensagem.status === 'pendente' && (
                    <>
                      <Button
                        onClick={() => handleUpdateStatus(mensagem.id, 'respondido')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Marcar como Respondido
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(mensagem.id, 'resolvido')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Resolvido
                      </Button>
                    </>
                  )}
                  {mensagem.status === 'respondido' && (
                    <Button
                      onClick={() => handleUpdateStatus(mensagem.id, 'resolvido')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Resolvido
                    </Button>
                  )}
                  {(mensagem.status === 'respondido' || mensagem.status === 'resolvido') && (
                    <Button
                      onClick={() => handleUpdateStatus(mensagem.id, 'pendente')}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      size="sm"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Reabrir
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}