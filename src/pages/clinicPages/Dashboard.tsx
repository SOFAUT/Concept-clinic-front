import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { FaturamentoBarChart } from '../../components/charts/FaturamentoBarChart';
import { FaturamentoPieChart } from '../../components/charts/FaturamentoPieChart';
import { useAppSelector } from '../../core/store/hooks';

const PATIENT_APPOINTMENTS_STORAGE_PREFIX = 'patient_agendamentos_';
const CLINIC_PATIENTS_STORAGE_PREFIX = 'clinic_patients_';
const MOCK_PROCEDURES_KEY = 'mock_procedures';
const PATIENT_PAYMENTS_STORAGE_PREFIX = 'patient_pagamentos_';

interface AgendamentoPaciente {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId?: number;
  procedimentoNome?: string;
  dataAgendada: string;
}

interface PacienteAssociado {
  userId: number;
  nome: string;
  email: string;
  dataAssociacao: string;
}

function loadClinicPatients(clinicId: number): PacienteAssociado[] {
  try {
    const key = CLINIC_PATIENTS_STORAGE_PREFIX + clinicId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as PacienteAssociado[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Retorna a quantidade de agendamentos realizados com a clínica */
function countAppointmentsForClinic(clinicId: number): number {
  if (!clinicId) return 0;
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PATIENT_APPOINTMENTS_STORAGE_PREFIX)) continue;
    const stored = localStorage.getItem(key);
    if (!stored) continue;
    try {
      const list = JSON.parse(stored) as AgendamentoPaciente[];
      if (!Array.isArray(list)) continue;
      count += list.filter((a) => a.clinicaId === clinicId).length;
    } catch {
      // ignore
    }
  }
  return count;
}

/** Retorna a quantidade de procedimentos cadastrados pelo perfil da clínica */
function countProceduresForClinic(clinicId: number): number {
  if (!clinicId) return 0;
  try {
    const stored = localStorage.getItem(MOCK_PROCEDURES_KEY);
    if (!stored) return 0;
    const list = JSON.parse(stored) as Array<{ clinicaId?: number }>;
    if (!Array.isArray(list)) return 0;
    return list.filter((p) => p.clinicaId === clinicId).length;
  } catch {
    return 0;
  }
}

/** Converte string de valor pt-BR (ex: "1.500,00" ou "150,00") para número */
function parseValorToNumber(valor: string): number {
  if (!valor || typeof valor !== 'string') return 0;
  const normalized = valor.replace(/\./g, '').replace(',', '.');
  const n = parseFloat(normalized);
  return Number.isNaN(n) ? 0 : n;
}

/** Verifica se a data do pagamento é do mês/ano atual (data pode ser pt-BR "DD/MM/YYYY, HH:mm:ss" ou ISO) */
function isCurrentMonth(dataStr: string): boolean {
  if (!dataStr) return false;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  if (dataStr.includes('/')) {
    const parts = dataStr.split(/[/,\s]/);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (Number.isNaN(m) || Number.isNaN(y)) return false;
    return y === year && m === month;
  }
  try {
    const d = new Date(dataStr);
    return d.getFullYear() === year && d.getMonth() === now.getMonth();
  } catch {
    return false;
  }
}

/** Retorna o total em R$ de pagamentos realizados pelos pacientes a esta clínica no mês atual */
function getReceitaMesClinic(clinicId: number): number {
  if (!clinicId) return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PATIENT_PAYMENTS_STORAGE_PREFIX)) continue;
    const stored = localStorage.getItem(key);
    if (!stored) continue;
    try {
      const list = JSON.parse(stored) as Array<{ clinicaId?: number; valor?: string; data?: string }>;
      if (!Array.isArray(list)) continue;
      list
        .filter((p) => p.clinicaId === clinicId && isCurrentMonth(p.data ?? ''))
        .forEach((p) => { total += parseValorToNumber(p.valor ?? '0'); });
    } catch {
      // ignore
    }
  }
  return total;
}

const MESES_NOMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/** Extrai ano e mês de uma string de data (pt-BR "DD/MM/YYYY, HH:mm" ou ISO) */
function parsePaymentDate(dataStr: string): { year: number; month: number } | null {
  if (!dataStr) return null;
  if (dataStr.includes('/')) {
    const parts = dataStr.split(/[/,\s]/);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (Number.isNaN(m) || Number.isNaN(y)) return null;
    return { year: y, month: m };
  }
  try {
    const d = new Date(dataStr);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  } catch {
    return null;
  }
}

/** Faturamento por mês (últimos 12 meses) com valores recebidos pela clínica */
function getFaturamentoPorMesClinic(clinicId: number): Array<{ mes: string; valor: number }> {
  const now = new Date();
  const buckets: Array<{ year: number; month: number; mes: string; valor: number }> = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      mes: `${MESES_NOMES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
      valor: 0,
    });
  }
  if (!clinicId) return buckets.map((b) => ({ mes: b.mes, valor: b.valor }));

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PATIENT_PAYMENTS_STORAGE_PREFIX)) continue;
    const stored = localStorage.getItem(key);
    if (!stored) continue;
    try {
      const list = JSON.parse(stored) as Array<{ clinicaId?: number; valor?: string; data?: string }>;
      if (!Array.isArray(list)) continue;
      list
        .filter((p) => p.clinicaId === clinicId)
        .forEach((p) => {
          const parsed = parsePaymentDate(p.data ?? '');
          if (!parsed) return;
          const b = buckets.find((x) => x.year === parsed.year && x.month === parsed.month);
          if (b) b.valor += parseValorToNumber(p.valor ?? '0');
        });
    } catch {
      // ignore
    }
  }
  return buckets.map((b) => ({ mes: b.mes, valor: b.valor }));
}

/** Faturamento agregado por nome do procedimento (para gráfico de pizza) */
function getFaturamentoPorProcedimento(clinicId: number): Array<{ name: string; value: number }> {
  const map = new Map<string, number>();
  if (!clinicId) return [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PATIENT_PAYMENTS_STORAGE_PREFIX)) continue;
    const stored = localStorage.getItem(key);
    if (!stored) continue;
    try {
      const list = JSON.parse(stored) as Array<{
        clinicaId?: number;
        procedimentoNome?: string;
        valor?: string;
      }>;
      if (!Array.isArray(list)) continue;
      list
        .filter((p) => p.clinicaId === clinicId)
        .forEach((p) => {
          const name = (p.procedimentoNome || 'Outros').trim();
          const current = map.get(name) ?? 0;
          map.set(name, current + parseValorToNumber(p.valor ?? '0'));
        });
    } catch {
      // ignore
    }
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);
}

export default function ClinicDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const clinicId = user?.id ?? 0;

  const [totalAgendamentos, setTotalAgendamentos] = useState(0);
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [totalProcedimentos, setTotalProcedimentos] = useState(0);
  const [receitaMes, setReceitaMes] = useState(0);
  const [faturamentoPorMes, setFaturamentoPorMes] = useState<Array<{ mes: string; valor: number }>>([]);
  const [faturamentoPorProcedimento, setFaturamentoPorProcedimento] = useState<Array<{ name: string; value: number }>>([]);

  const refresh = () => {
    setTotalAgendamentos(countAppointmentsForClinic(clinicId));
    setTotalPacientes(loadClinicPatients(clinicId).length);
    setTotalProcedimentos(countProceduresForClinic(clinicId));
    setReceitaMes(getReceitaMesClinic(clinicId));
    setFaturamentoPorMes(getFaturamentoPorMesClinic(clinicId));
    setFaturamentoPorProcedimento(getFaturamentoPorProcedimento(clinicId));
  };

  useEffect(() => {
    refresh();
  }, [clinicId]);

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [clinicId]);

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}> {/* ← Margem superior adicionada */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Dashboard - Clínica
      </Typography>
      
      {/* Cards de Estatísticas */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Agendamentos
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {totalAgendamentos}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Realizados com a clínica
            </Typography>
          </Paper>
        </Box>
        
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total de Pacientes
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {totalPacientes}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Que realizaram pagamento
            </Typography>
          </Paper>
        </Box>
        
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Procedimentos
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {totalProcedimentos}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cadastrados pela clínica
            </Typography>
          </Paper>
        </Box>
        
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Receita do Mês
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              R$ {receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pagamentos realizados à clínica
            </Typography>
          </Paper>
        </Box>
      </Stack>

      {/* Box única: gráfico de barras (65%) + gráfico de pizza por procedimento (35%) */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Faturamento
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Por mês (últimos 12 meses) e por procedimento (valores pagos à clínica)
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '65% 35%' },
            gap: 3,
            alignItems: 'start',
            width: '100%',
          }}
        >
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <FaturamentoBarChart data={faturamentoPorMes} width={700} height={320} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              color: 'text.primary',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Por procedimento (pago à clínica)
            </Typography>
            <Box component="span" sx={{ color: 'text.primary' }}>
              <FaturamentoPieChart data={faturamentoPorProcedimento} width={280} height={280} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}