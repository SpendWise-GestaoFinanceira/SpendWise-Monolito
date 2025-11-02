'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Download,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { CategoryDonutChart } from '@/components/charts/category-donut-chart';
import { DailyEvolutionChart } from '@/components/charts/daily-evolution-chart';
import { MonthlyComparisonChart } from '@/components/charts/monthly-comparison-chart';
import { YearlyComparisonChart } from '@/components/charts/yearly-comparison-chart';
import { useTransacoes } from '@/hooks/use-transacoes';
import { getCategoryHexColor } from '@/lib/category-colors';
import { tailwindToHex } from '@/lib/utils/tailwind-to-hex';

export default function RelatoriosPage() {
  const { transacoes } = useTransacoes();
  const [activeTab, setActiveTab] = useState('Por Categoria');
  const currentDate = new Date();
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];
  const currentMonth = `${months[currentDate.getMonth()]}/${currentDate.getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Calcular dados reais das categorias do mês selecionado
  const dadosCategorias: Array<{ name: string; value: number; color: string }> =
    useMemo(() => {
      const [monthName, yearStr] = selectedMonth.split('/');
      const monthIndex = months.indexOf(monthName);
      const year = parseInt(yearStr);

      const despesas = transacoes.filter(t => {
        const dataT = new Date(t.dataTransacao);
        return (
          t.tipo === 2 &&
          dataT.getMonth() === monthIndex &&
          dataT.getFullYear() === year
        );
      });
      const total = despesas.reduce(
        (sum, t) =>
          sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
        0
      );

      const grouped = despesas.reduce(
        (
          acc: Record<string, { name: string; value: number; color: string }>,
          t
        ) => {
          const catNome = t.categoria?.nome || 'Outros';
          const catCor = t.categoria?.cor;
          const valor =
            typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;

          const corFinal =
            catCor && catCor.startsWith('bg-')
              ? tailwindToHex(catCor)
              : catCor || getCategoryHexColor(catNome);

          if (!acc[catNome]) {
            acc[catNome] = { name: catNome, value: 0, color: corFinal };
          }
          acc[catNome].value += valor;
          return acc;
        },
        {}
      );

      return Object.values(grouped).sort((a, b) => b.value - a.value);
    }, [transacoes, selectedMonth, months]);

  // Calcular receitas, despesas e saldo do mês selecionado
  const { receitas, despesas, saldo } = useMemo(() => {
    const [monthName, yearStr] = selectedMonth.split('/');
    const monthIndex = months.indexOf(monthName);
    const year = parseInt(yearStr);

    const transacoesDoMes = transacoes.filter(t => {
      const dataT = new Date(t.dataTransacao);
      return dataT.getMonth() === monthIndex && dataT.getFullYear() === year;
    });

    const rec = transacoesDoMes
      .filter(t => t.tipo === 1)
      .reduce(
        (sum, t) =>
          sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
        0
      );
    const desp = transacoesDoMes
      .filter(t => t.tipo === 2)
      .reduce(
        (sum, t) =>
          sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
        0
      );
    return { receitas: rec, despesas: desp, saldo: rec - desp };
  }, [transacoes, selectedMonth, months]);

  // Calcular evolução diária do saldo para o gráfico
  const evolucaoDiariaData = useMemo(() => {
    // Extrair mês e ano do selectedMonth (formato: "Out/2025")
    const [monthName, yearStr] = selectedMonth.split('/');
    const monthIndex = months.indexOf(monthName);
    const year = parseInt(yearStr);

    if (monthIndex === -1) return [];

    // Filtrar transações do mês
    const transacoesDoMes = transacoes.filter(t => {
      const dataT = new Date(t.dataTransacao);
      return dataT.getMonth() === monthIndex && dataT.getFullYear() === year;
    });

    // Agrupar por dia
    const porDia = transacoesDoMes
      .reduce((acc: any[], t) => {
        const dia = new Date(t.dataTransacao).getDate();
        const diaStr = String(dia).padStart(2, '0');
        const valorNum =
          typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;
        const valor = t.tipo === 1 ? valorNum : -valorNum;

        const existente = acc.find(item => item.day === diaStr);
        if (existente) {
          existente.saldo += valor;
        } else {
          acc.push({ day: diaStr, saldo: valor });
        }
        return acc;
      }, [])
      .sort((a, b) => parseInt(a.day) - parseInt(b.day));

    // Calcular saldo acumulado
    let saldoAcumulado = 0;
    return porDia.map(item => {
      saldoAcumulado += item.saldo;
      return { day: item.day, saldo: saldoAcumulado };
    });
  }, [transacoes, selectedMonth, months]);

  // Gerar últimos 12 meses para os dropdowns
  const generateMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const options = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      options.push({
        value: `${monthName}/${year}`,
        label: `${monthName}/${year}`,
        month: date.getMonth(),
        year: year,
      });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  // Função de exportação CSV melhorada
  const exportarCSV = () => {
    // Cabeçalho detalhado
    const csvLines = [
      '"RELATÓRIO FINANCEIRO - SPENDWISE"',
      `"Período: ${selectedMonth}"`,
      `"Data de Geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}"`,
      '',
      '"RESUMO DO PERÍODO"',
      `"Total de Receitas","R$ ${receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}"`,
      `"Total de Despesas","R$ ${despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}"`,
      `"Saldo do Período","R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}"`,
      `"Quantidade de Transações","${transacoes.length}"`,
      '',
      '"DISTRIBUIÇÃO POR CATEGORIA"',
      '"Categoria","Valor","Percentual"',
    ];

    // Adicionar categorias
    const totalDespesas = dadosCategorias.reduce(
      (sum, cat) => sum + cat.value,
      0
    );
    dadosCategorias.forEach(cat => {
      const percentual =
        totalDespesas > 0
          ? ((cat.value / totalDespesas) * 100).toFixed(1)
          : '0.0';
      csvLines.push(
        `"${cat.name}","R$ ${cat.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}","${percentual}%"`
      );
    });

    csvLines.push('');
    csvLines.push('"DETALHAMENTO DE TRANSAÇÕES"');
    csvLines.push(
      '"Data","Descrição","Tipo","Categoria","Valor","Saldo Acumulado"'
    );

    // Ordenar transações por data
    const transacoesOrdenadas = [...transacoes].sort(
      (a, b) =>
        new Date(a.dataTransacao).getTime() -
        new Date(b.dataTransacao).getTime()
    );

    let saldoAcum = 0;
    transacoesOrdenadas.forEach(t => {
      const valor = typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;
      saldoAcum += t.tipo === 1 ? valor : -valor;

      csvLines.push(
        [
          `"${new Date(t.dataTransacao).toLocaleDateString('pt-BR')}"`,
          `"${t.descricao.replace(/"/g, '""')}"`,
          `"${t.tipo === 1 ? 'Receita' : 'Despesa'}"`,
          `"${t.categoria?.nome || 'Sem categoria'}"`,
          `"R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}"`,
          `"R$ ${saldoAcum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}"`,
        ].join(',')
      );
    });

    const csvContent = '\uFEFF' + csvLines.join('\n'); // BOM para UTF-8
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_spendwise_${selectedMonth.replace('/', '-')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Função de exportação PDF real
  const exportarPDF = async () => {
    try {
      // Importar jsPDF e autoTable dinamicamente
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();

      // Adicionar autoTable ao doc
      if (typeof autoTable === 'function') {
        autoTable(doc, {});
      }
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Título
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('RELATÓRIO FINANCEIRO', pageWidth / 2, yPos, {
        align: 'center',
      });
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('SpendWise - Finanças Pessoais', pageWidth / 2, yPos, {
        align: 'center',
      });
      yPos += 15;

      // Informações do relatório
      doc.setFontSize(10);
      doc.text(`Período: ${selectedMonth}`, 14, yPos);
      yPos += 6;
      doc.text(
        `Data de Geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
        14,
        yPos
      );
      yPos += 12;

      // Resumo Financeiro
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMO DO PERÍODO', 14, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const resumoData = [
        [
          'Total de Receitas',
          `R$ ${receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        ],
        [
          'Total de Despesas',
          `R$ ${despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        ],
        [
          'Saldo do Período',
          `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        ],
        ['Quantidade de Transações', transacoes.length.toString()],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [],
        body: resumoData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 14, right: 14 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Distribuição por Categoria
      if (dadosCategorias.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('DISTRIBUIÇÃO POR CATEGORIA', 14, yPos);
        yPos += 8;

        const totalDespesas = dadosCategorias.reduce(
          (sum, cat) => sum + cat.value,
          0
        );
        const categoriasData = dadosCategorias.map(cat => {
          const percentual =
            totalDespesas > 0
              ? ((cat.value / totalDespesas) * 100).toFixed(1)
              : '0.0';
          return [
            cat.name,
            `R$ ${cat.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            `${percentual}%`,
          ];
        });

        autoTable(doc, {
          startY: yPos,
          head: [['Categoria', 'Valor', 'Percentual']],
          body: categoriasData,
          theme: 'striped',
          headStyles: { fillColor: [16, 185, 129] },
          margin: { left: 14, right: 14 },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
      }

      // Nova página para transações
      doc.addPage();
      yPos = 20;

      // Detalhamento de Transações
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DETALHAMENTO DE TRANSAÇÕES', 14, yPos);
      yPos += 8;

      const transacoesOrdenadas = [...transacoes].sort(
        (a, b) =>
          new Date(a.dataTransacao).getTime() -
          new Date(b.dataTransacao).getTime()
      );

      const transacoesData = transacoesOrdenadas.map(t => {
        const valor =
          typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;
        return [
          new Date(t.dataTransacao).toLocaleDateString('pt-BR'),
          t.descricao.substring(0, 30),
          t.tipo === 1 ? 'Receita' : 'Despesa',
          t.categoria?.nome || 'Sem categoria',
          `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor']],
        body: transacoesData,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 60 },
          2: { cellWidth: 25 },
          3: { cellWidth: 35 },
          4: { cellWidth: 30 },
        },
      });

      // Salvar PDF
      doc.save(
        `relatorio_spendwise_${selectedMonth.replace('/', '-')}_${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
    }
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthDropdownOpen &&
        !(event.target as Element).closest('.month-dropdown-container')
      ) {
        setMonthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [monthDropdownOpen]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className='space-y-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Relatórios</h1>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={exportarCSV}
            className='flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
          >
            <Download className='h-4 w-4' />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={exportarPDF}
            className='flex items-center space-x-2 bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-300/40 dark:border-slate-700/20 rounded-full px-6 py-3 text-slate-900 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-700/70 transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            <FileText className='h-4 w-4' />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>
      {/* Period Filter - Simplificado */}
      <div
        className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative'
        style={{ zIndex: 10 }}
      >
        <div className='flex items-center gap-4'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
            Mês:
          </h3>
          <div
            className='month-dropdown-container relative'
            style={{ zIndex: 999999 }}
          >
            <button
              type='button'
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
              className='px-4 py-2.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/20 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between min-w-[140px] relative z-[9999]'
            >
              <span className='flex items-center'>
                <Calendar className='w-4 h-4 mr-2 text-slate-500 dark:text-slate-400' />
                {selectedMonth}
              </span>
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform duration-200 ${monthDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {monthDropdownOpen && (
              <div
                className='absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto min-w-[140px]'
                style={{ zIndex: 999999 }}
              >
                {monthOptions.map(option => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => {
                      setSelectedMonth(option.value);
                      setMonthDropdownOpen(false);
                    }}
                    className='w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center'
                  >
                    <Calendar className='w-4 h-4 mr-2 text-slate-500 dark:text-slate-400' />
                    <span className='text-slate-900 dark:text-slate-100 text-sm'>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className='mb-6'>
        <div className='flex space-x-1 bg-slate-100/70 dark:bg-slate-700/30 backdrop-blur-sm p-1 rounded-xl border border-slate-200/30 dark:border-slate-600/20'>
          {['Por Categoria', 'Por Mês', 'Comparativo Ano a Ano'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-600/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      {activeTab === 'Por Categoria' && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Chart Area 1 */}
          <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                Distribuição por Categoria
              </h3>
              <PieChart className='h-5 w-5 text-emerald-500' />
            </div>
            <div className='text-slate-600 dark:text-slate-400 text-center'>
              <p className='mb-4'>{selectedMonth}</p>
              <CategoryDonutChart data={dadosCategorias} />
            </div>
          </div>

          {/* Ranking */}
          <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                Ranking de Categorias
              </h3>
              <BarChart3 className='h-5 w-5 text-emerald-500' />
            </div>
            <div className='space-y-3'>
              <p className='text-sm text-slate-600 dark:text-slate-400 mb-3'>
                Total: R${' '}
                {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              {dadosCategorias.map((item: any, index: number) => {
                const percent =
                  despesas > 0
                    ? ((item.value / despesas) * 100).toFixed(1)
                    : '0';
                return (
                  <div
                    key={index}
                    className='flex items-center justify-between py-2'
                  >
                    <div className='flex items-center space-x-3'>
                      <span className='text-slate-600 dark:text-slate-400 text-sm font-medium'>
                        {index + 1}
                      </span>
                      <span className='text-slate-900 dark:text-slate-100'>
                        {item.name}
                      </span>
                      <span className='text-sm text-slate-600 dark:text-slate-400'>
                        {percent}% do total
                      </span>
                    </div>
                    <span className='text-slate-900 dark:text-slate-100 font-medium'>
                      R${' '}
                      {item.value.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Por Mês' && (
        <div className='space-y-6'>
          {/* KPI Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                  Receitas
                </h4>
                <TrendingUp className='h-4 w-4 text-emerald-500' />
              </div>
              <div className='text-2xl font-bold text-emerald-500'>
                R${' '}
                {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                Total de entradas
              </p>
            </div>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                  Despesas
                </h4>
                <TrendingUp className='h-4 w-4 text-red-500 rotate-180' />
              </div>
              <div className='text-2xl font-bold text-red-500'>
                R${' '}
                {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                Total de saídas
              </p>
            </div>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                  Saldo
                </h4>
                <TrendingUp className='h-4 w-4 text-emerald-500' />
              </div>
              <div className='text-2xl font-bold text-emerald-500'>
                R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                Diferença total
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4'>
                Evolução do Saldo
              </h3>
              <p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>
                Mês selecionado
              </p>
              <DailyEvolutionChart
                selectedMonth={selectedMonth}
                data={evolucaoDiariaData}
              />
            </div>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4'>
                Receitas vs Despesas
              </h3>
              <p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>
                Últimos 7 meses
              </p>
              <MonthlyComparisonChart />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Comparativo Ano a Ano' && (
        <div className='space-y-6'>
          {/* KPI Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                  Total de Despesas
                </h4>
                <TrendingUp className='h-4 w-4 text-red-500 rotate-180' />
              </div>
              <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                R${' '}
                {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                Período selecionado
              </p>
            </div>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                  Média Mensal
                </h4>
                <BarChart3 className='h-4 w-4 text-slate-500' />
              </div>
              <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                R${' '}
                {transacoes.length > 0
                  ? (
                      despesas / transacoes.filter(t => t.tipo === 2).length
                    ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                  : '0,00'}
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                Gasto médio por transação
              </p>
            </div>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                  Total de Transações
                </h4>
                <BarChart3 className='h-4 w-4 text-blue-500' />
              </div>
              <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                {transacoes.length}
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                {transacoes.filter(t => t.tipo === 2).length} despesas
                registradas
              </p>
            </div>
          </div>

          {/* Comparative Chart */}
          <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4'>
              Comparativo Mensal {currentDate.getFullYear() - 1} vs{' '}
              {currentDate.getFullYear()}
            </h3>
            <p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>
              Despesas por mês
            </p>
            <YearlyComparisonChart />
          </div>
        </div>
      )}
    </div>
  );
}
