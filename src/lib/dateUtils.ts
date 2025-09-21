// src/lib/dateUtils.ts
import { 
  format, 
  addWeeks, 
  addMonths, 
  startOfWeek, 
  endOfWeek, 
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface para o tipo de fluxo usado nas funções
interface FluxoData {
  status: 'ativo' | 'pendente' | 'finalizado';
  proximoPagamento: Date | string;
}

// Função para criar data local sem problemas de timezone
export const criarDataLocal = (dataString: string): Date => {
  const [ano, mes, dia] = dataString.split('-');
  return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
};

// Função para formatar data no padrão brasileiro
export const formatarDataBrasil = (data: Date): string => {
  return format(data, 'dd/MM/yyyy', { locale: ptBR });
};

// Função para formatar mês/ano no padrão brasileiro
export const formatarMesAno = (data: Date): string => {
  return format(data, 'MMMM yyyy', { locale: ptBR });
};

// Função para calcular data final baseada na recorrência
export const calcularDataFinal = (
  dataInicio: string, 
  recorrencia: 'unica' | 'semanal' | 'mensal', 
  quantidadeParcelas: number
): string => {
  const dataInicioObj = criarDataLocal(dataInicio);
  
  if (recorrencia === 'unica') {
    return dataInicio;
  }
  
  if (recorrencia === 'semanal') {
    const dataFinal = addWeeks(dataInicioObj, quantidadeParcelas - 1);
    return format(dataFinal, 'yyyy-MM-dd');
  }
  
  if (recorrencia === 'mensal') {
    const dataFinal = addMonths(dataInicioObj, quantidadeParcelas - 1);
    return format(dataFinal, 'yyyy-MM-dd');
  }
  
  return dataInicio;
};

// Função para gerar datas de pagamento para fluxos recorrentes
export const gerarDatasPagamento = (
  dataInicio: string,
  recorrencia: 'semanal' | 'mensal',
  quantidadeParcelas: number
): Date[] => {
  const dataInicioObj = criarDataLocal(dataInicio);
  const datasPagamento: Date[] = [dataInicioObj];
  
  if (recorrencia === 'semanal') {
    for (let i = 1; i < quantidadeParcelas; i++) {
      datasPagamento.push(addWeeks(dataInicioObj, i));
    }
  } else if (recorrencia === 'mensal') {
    for (let i = 1; i < quantidadeParcelas; i++) {
      datasPagamento.push(addMonths(dataInicioObj, i));
    }
  }
  
  return datasPagamento;
};

// Função para agrupar fluxos por semana
export const agruparFluxosPorSemana = (fluxos: FluxoData[]) => {
  const agrupados: { [key: string]: FluxoData[] } = {};
  
  fluxos.forEach(fluxo => {
    if (fluxo.status === 'ativo') {
      // Lidar com objetos Date existentes ou strings
      const dataPagamento = fluxo.proximoPagamento instanceof Date 
        ? fluxo.proximoPagamento 
        : new Date(fluxo.proximoPagamento);
      const inicioSemana = startOfWeek(dataPagamento, { weekStartsOn: 1 }); // Segunda-feira
      const chaveSemana = format(inicioSemana, 'yyyy-MM-dd');
      
      if (!agrupados[chaveSemana]) {
        agrupados[chaveSemana] = [];
      }
      agrupados[chaveSemana].push(fluxo);
    }
  });
  
  return agrupados;
};

// Função para agrupar fluxos por mês
export const agruparFluxosPorMes = (fluxos: FluxoData[]) => {
  const agrupados: { [key: string]: FluxoData[] } = {};
  
  fluxos.forEach(fluxo => {
    if (fluxo.status === 'ativo') {
      // Lidar com objetos Date existentes ou strings
      const dataPagamento = fluxo.proximoPagamento instanceof Date 
        ? fluxo.proximoPagamento 
        : new Date(fluxo.proximoPagamento);
      const chaveMes = format(startOfMonth(dataPagamento), 'yyyy-MM-dd');
      
      if (!agrupados[chaveMes]) {
        agrupados[chaveMes] = [];
      }
      agrupados[chaveMes].push(fluxo);
    }
  });
  
  return agrupados;
};

// Função para obter todas as semanas que têm fluxos
export const obterSemanasComFluxos = (fluxos: FluxoData[]) => {
  const fluxosAtivos = fluxos.filter(f => f.status === 'ativo');
  
  if (fluxosAtivos.length === 0) return [];
  
  // Encontrar a data mais antiga e mais recente
  const datas = fluxosAtivos.map(f => 
    f.proximoPagamento instanceof Date 
      ? f.proximoPagamento 
      : new Date(f.proximoPagamento)
  );
  const dataMinima = new Date(Math.min(...datas.map(d => d.getTime())));
  const dataMaxima = new Date(Math.max(...datas.map(d => d.getTime())));
  
  // Gerar todas as semanas entre essas datas
  const semanas = eachWeekOfInterval(
    { start: startOfWeek(dataMinima, { weekStartsOn: 1 }), end: endOfWeek(dataMaxima, { weekStartsOn: 1 }) },
    { weekStartsOn: 1 }
  );
  
  return semanas;
};

// Função para obter todos os meses que têm fluxos
export const obterMesesComFluxos = (fluxos: FluxoData[]) => {
  const fluxosAtivos = fluxos.filter(f => f.status === 'ativo');
  
  if (fluxosAtivos.length === 0) return [];
  
  // Encontrar a data mais antiga e mais recente
  const datas = fluxosAtivos.map(f => 
    f.proximoPagamento instanceof Date 
      ? f.proximoPagamento 
      : new Date(f.proximoPagamento)
  );
  const dataMinima = new Date(Math.min(...datas.map(d => d.getTime())));
  const dataMaxima = new Date(Math.max(...datas.map(d => d.getTime())));
  
  // Gerar todos os meses entre essas datas
  const meses = eachMonthOfInterval(
    { start: startOfMonth(dataMinima), end: endOfMonth(dataMaxima) }
  );
  
  return meses;
};
