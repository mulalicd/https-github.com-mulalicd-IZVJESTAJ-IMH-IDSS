import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  CreditCard,
  AlertCircle,
  TrendingDown,
  Filter,
  Users,
  Clock,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  Download,
  FileSpreadsheet,
  TrendingUp,
  Activity,
  ArrowDownRight,
  Target,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export type EducationalLevel = 'ALL' | 'Toddler Group' | 'Primary Grade 1-4' | 'Primary Grade 5-9';

export interface PartnerDebtItem {
  id: string;
  partnerName: string;
  childName: string;
  eduLevel: 'Toddler Group' | 'Primary Grade 1-4' | 'Primary Grade 5-9';
  entity: 'IMH' | 'IDSS';
  totalDebt: number; // KM (positive = debt, negative = overpayment)
  ageGroup: '0-30' | '30-60' | '60-90' | '90+';
  daysOverdue: number; // Tačan broj dana kašnjenja
  dueDate: string;
  lastPaymentDate: string; // Datum posljednje uplate
  notes: string;
  status: 'critical' | 'warning' | 'normal' | 'overpayment';
}

export const PARTNER_DEBT_PORTFOLIO: PartnerDebtItem[] = [
  // Toddler Group (IMH)
  {
    id: 'P-101',
    partnerName: 'Porodica P-101',
    childName: 'Dijete P-101',
    eduLevel: 'Toddler Group',
    entity: 'IMH',
    totalDebt: 1950,
    ageGroup: '90+',
    daysOverdue: 117,
    dueDate: '15.07.2026.',
    lastPaymentDate: '10.06.2026.',
    notes: 'Neizmirena 3 mjeseca vrtića; čeka se doznaka subvencije',
    status: 'critical',
  },
  {
    id: 'P-102',
    partnerName: 'Porodica P-102',
    childName: 'Dijete P-102',
    eduLevel: 'Toddler Group',
    entity: 'IMH',
    totalDebt: 1300,
    ageGroup: '60-90',
    daysOverdue: 86,
    dueDate: '15.08.2026.',
    lastPaymentDate: '14.07.2026.',
    notes: 'Kašnjenje uplate jula i augusta',
    status: 'warning',
  },
  {
    id: 'P-103',
    partnerName: 'Porodica P-103',
    childName: 'Dijete P-103',
    eduLevel: 'Toddler Group',
    entity: 'IMH',
    totalDebt: -600, // Pretplata
    ageGroup: '0-30',
    daysOverdue: 0,
    dueDate: '01.09.2026.',
    lastPaymentDate: '04.11.2025.',
    notes: 'Pretplata nastala naknadnom doznakom kantonalne subvencije',
    status: 'overpayment',
  },
  {
    id: 'P-104',
    partnerName: 'Porodica P-104',
    childName: 'Dijete P-104',
    eduLevel: 'Toddler Group',
    entity: 'IMH',
    totalDebt: 650,
    ageGroup: '0-30',
    daysOverdue: 25,
    dueDate: '15.10.2026.',
    lastPaymentDate: '12.09.2026.',
    notes: 'Tekuća faktura oktobar',
    status: 'normal',
  },
  {
    id: 'P-105',
    partnerName: 'Porodica P-105',
    childName: 'Dijete P-105',
    eduLevel: 'Toddler Group',
    entity: 'IMH',
    totalDebt: -400,
    ageGroup: '30-60',
    daysOverdue: 0,
    dueDate: '15.09.2026.',
    lastPaymentDate: '15.09.2026.',
    notes: 'Pretplata po osnovu depozita',
    status: 'overpayment',
  },

  // Primary Grade 1-4 (IDSS)
  {
    id: 'P-201',
    partnerName: 'Porodica P-201',
    childName: 'Dijete P-201 (IV razred)',
    eduLevel: 'Primary Grade 1-4',
    entity: 'IDSS',
    totalDebt: 1880,
    ageGroup: '90+',
    daysOverdue: 211,
    dueDate: '12.04.2026.',
    lastPaymentDate: '12.04.2026.',
    notes: 'Djelimične uplate i neusklađeni popust 10%',
    status: 'critical',
  },
  {
    id: 'P-202',
    partnerName: 'Porodica P-202',
    childName: 'Dijete P-202 (II razred)',
    eduLevel: 'Primary Grade 1-4',
    entity: 'IDSS',
    totalDebt: 4700,
    ageGroup: '90+',
    daysOverdue: 178,
    dueDate: '15.05.2026.',
    lastPaymentDate: '18.01.2026.',
    notes: 'Neizmirena cjelokupna rata II polugodišta',
    status: 'critical',
  },
  {
    id: 'P-203',
    partnerName: 'Porodica P-203',
    childName: 'Dijete P-203 (III razred)',
    eduLevel: 'Primary Grade 1-4',
    entity: 'IDSS',
    totalDebt: 2350,
    ageGroup: '60-90',
    daysOverdue: 69,
    dueDate: '01.09.2026.',
    lastPaymentDate: '10.06.2026.',
    notes: 'I rata školarine za novu školsku godinu',
    status: 'warning',
  },
  {
    id: 'P-204',
    partnerName: 'Porodica P-204',
    childName: 'Dijete P-204 (I razred)',
    eduLevel: 'Primary Grade 1-4',
    entity: 'IDSS',
    totalDebt: 1200,
    ageGroup: '30-60',
    daysOverdue: 55,
    dueDate: '15.09.2026.',
    lastPaymentDate: '01.09.2026.',
    notes: 'Boravak i ishrana za 2 mjeseca',
    status: 'warning',
  },
  {
    id: 'P-205',
    partnerName: 'Porodica P-205',
    childName: 'Dijete P-205 (IV razred)',
    eduLevel: 'Primary Grade 1-4',
    entity: 'IDSS',
    totalDebt: -1500,
    ageGroup: '0-30',
    daysOverdue: 0,
    dueDate: '01.10.2026.',
    lastPaymentDate: '01.10.2026.',
    notes: 'Avansna uplata cijele školarine unaprijed uz 5% popusta',
    status: 'overpayment',
  },
  {
    id: 'P-206',
    partnerName: 'Porodica P-206',
    childName: 'Dijete P-206 (II razred)',
    eduLevel: 'Primary Grade 1-4',
    entity: 'IDSS',
    totalDebt: 950,
    ageGroup: '0-30',
    daysOverdue: 25,
    dueDate: '15.10.2026.',
    lastPaymentDate: '15.09.2026.',
    notes: 'Tekući račun za vanškolske aktivnosti',
    status: 'normal',
  },

  // Primary Grade 5-9 (IDSS)
  {
    id: 'P-301',
    partnerName: 'Porodica P-301',
    childName: 'Dijete P-301 (VIII razred)',
    eduLevel: 'Primary Grade 5-9',
    entity: 'IDSS',
    totalDebt: 3800,
    ageGroup: '90+',
    daysOverdue: 234,
    dueDate: '20.03.2026.',
    lastPaymentDate: '20.02.2026.',
    notes: 'Akumulirani dug školarine iz prethodne godine',
    status: 'critical',
  },
  {
    id: 'P-302',
    partnerName: 'Porodica P-302',
    childName: 'Dijete P-302 (VI razred)',
    eduLevel: 'Primary Grade 5-9',
    entity: 'IDSS',
    totalDebt: 2350,
    ageGroup: '60-90',
    daysOverdue: 86,
    dueDate: '15.08.2026.',
    lastPaymentDate: '14.05.2026.',
    notes: 'Prva polugodišnja rata neizmirena',
    status: 'warning',
  },
  {
    id: 'P-303',
    partnerName: 'Porodica P-303',
    childName: 'Dijete P-303 (VII razred)',
    eduLevel: 'Primary Grade 5-9',
    entity: 'IDSS',
    totalDebt: 1100,
    ageGroup: '30-60',
    daysOverdue: 69,
    dueDate: '01.09.2026.',
    lastPaymentDate: '10.07.2026.',
    notes: 'Dugovanje za laboratorijsku opremu i knjige',
    status: 'warning',
  },
  {
    id: 'P-304',
    partnerName: 'Porodica P-304',
    childName: 'Dijete P-304 (IX razred)',
    eduLevel: 'Primary Grade 5-9',
    entity: 'IDSS',
    totalDebt: -750,
    ageGroup: '0-30',
    daysOverdue: 0,
    dueDate: '01.10.2026.',
    lastPaymentDate: '28.09.2026.',
    notes: 'Preplaćena ekskurzija i školarina',
    status: 'overpayment',
  },
  {
    id: 'P-305',
    partnerName: 'Porodica P-305',
    childName: 'Dijete P-305 (V razred)',
    eduLevel: 'Primary Grade 5-9',
    entity: 'IDSS',
    totalDebt: 2800,
    ageGroup: '90+',
    daysOverdue: 208,
    dueDate: '15.04.2026.',
    lastPaymentDate: '15.03.2026.',
    notes: 'Sudska opomena pred utuženje',
    status: 'critical',
  },
];

// Historijski 6-mjesečni trend ukupnog duga (Maj 2026. - Oktobar 2026.)
export interface DebtTrendMonth {
  month: string;
  monthShort: string;
  totalDebt: number; // KM za sve nivoe
  toddlerDebt: number; // KM Toddler Group (IMH)
  primaryLowerDebt: number; // KM Grade 1-4 (IDSS)
  primaryUpperDebt: number; // KM Grade 5-9 (IDSS)
  collectionRate: number; // % naplaćenih tekućih potraživanja
}

export const HISTORICAL_DEBT_TREND: DebtTrendMonth[] = [
  {
    month: 'Maj 2026.',
    monthShort: 'Maj',
    totalDebt: 34200,
    toddlerDebt: 4800,
    primaryLowerDebt: 16100,
    primaryUpperDebt: 13300,
    collectionRate: 88.5,
  },
  {
    month: 'Juni 2026.',
    monthShort: 'Jun',
    totalDebt: 31500,
    toddlerDebt: 4200,
    primaryLowerDebt: 15300,
    primaryUpperDebt: 12000,
    collectionRate: 91.2,
  },
  {
    month: 'Juli 2026.',
    monthShort: 'Jul',
    totalDebt: 27800,
    toddlerDebt: 3600,
    primaryLowerDebt: 13400,
    primaryUpperDebt: 10800,
    collectionRate: 93.0,
  },
  {
    month: 'August 2026.',
    monthShort: 'Aug',
    totalDebt: 23600,
    toddlerDebt: 3100,
    primaryLowerDebt: 11500,
    primaryUpperDebt: 9000,
    collectionRate: 94.8,
  },
  {
    month: 'Septembar 2026.',
    monthShort: 'Sep',
    totalDebt: 26400, // Blagi skok sa novom školskom godinom / fakturisanjem
    toddlerDebt: 3900,
    primaryLowerDebt: 12800,
    primaryUpperDebt: 9700,
    collectionRate: 92.4,
  },
  {
    month: 'Oktobar 2026.',
    monthShort: 'Okt',
    totalDebt: 24530, // Trenutno aktivno stanje
    toddlerDebt: 3900,
    primaryLowerDebt: 10680,
    primaryUpperDebt: 9950,
    collectionRate: 95.1,
  },
];

interface CollectionStatusDashboardProps {
  onSelectPartner?: (name: string, entity: 'IMH' | 'IDSS') => void;
}

export const CollectionStatusDashboard: React.FC<CollectionStatusDashboardProps> = ({
  onSelectPartner,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EducationalLevel>('ALL');
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<string | null>(null);
  const [chartViewMode, setChartViewMode] = useState<'both' | 'aging' | 'trend'>('both');
  const chartRef = useRef<SVGSVGElement | null>(null);
  const trendChartRef = useRef<SVGSVGElement | null>(null);
  const [hoveredBucket, setHoveredBucket] = useState<string | null>(null);
  const [hoveredTrendMonth, setHoveredTrendMonth] = useState<DebtTrendMonth | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filtered dataset
  const filteredData = useMemo(() => {
    return PARTNER_DEBT_PORTFOLIO.filter((item) => {
      const matchLevel = selectedLevel === 'ALL' || item.eduLevel === selectedLevel;
      const matchAge = !selectedAgeFilter || item.ageGroup === selectedAgeFilter;
      return matchLevel && matchAge;
    });
  }, [selectedLevel, selectedAgeFilter]);

  // Top 10 Most Overdue Client Accounts (Actionable Recovery Targets)
  const topOverdueAccounts = useMemo(() => {
    return PARTNER_DEBT_PORTFOLIO
      .filter((item) => item.totalDebt > 0) // Only accounts with outstanding debt
      .sort((a, b) => {
        // Priority 1: Days overdue descending (most delinquent first)
        if (b.daysOverdue !== a.daysOverdue) {
          return b.daysOverdue - a.daysOverdue;
        }
        // Priority 2: Total amount descending
        return b.totalDebt - a.totalDebt;
      })
      .slice(0, 10);
  }, []);

  // CSV Export for Offline Accounting Review
  const handleExportDebtStructureCsv = () => {
    // UTF-8 BOM so Excel opens Bosnian/Croatian characters correctly
    const BOM = '\uFEFF';
    const headers = [
      'ID Kartice',
      'Naziv Partnera / Roditelja',
      'Ime Ucenika / Djeteta',
      'Pravni Entitet',
      'Obrazovni Nivo',
      'Starosna Struktura Duga',
      'Saldo Duga / Pretplata (KM)',
      'Tip Salda',
      'Datum Dospijeca',
      'Konto Glavne Knjige',
      'Status Rizika',
      'Forenzicka Napomena',
    ];

    const rows = filteredData.map((item) => {
      const isOverpaid = item.totalDebt < 0;
      const tipSalda = isOverpaid ? 'Pretplata (Potražuje)' : 'Dugovanje (Duguje)';
      const cleanNotes = `"${(item.notes || '').replace(/"/g, '""')}"`;
      const cleanPartner = `"${(item.partnerName || '').replace(/"/g, '""')}"`;
      const cleanChild = `"${(item.childName || '').replace(/"/g, '""')}"`;

      return [
        item.id,
        cleanPartner,
        cleanChild,
        item.entity,
        `"${item.eduLevel}"`,
        `"${item.ageGroup} dana"`,
        item.totalDebt.toFixed(2),
        `"${tipSalda}"`,
        item.dueDate,
        '2110',
        `"${item.status.toUpperCase()}"`,
        cleanNotes,
      ].join(';');
    });

    // Add summary section at the bottom of the CSV
    const totalDug = filteredData
      .filter((i) => i.totalDebt > 0)
      .reduce((sum, i) => sum + i.totalDebt, 0);
    const totalPretplata = filteredData
      .filter((i) => i.totalDebt < 0)
      .reduce((sum, i) => sum + Math.abs(i.totalDebt), 0);
    const netoSaldo = totalDug - totalPretplata;

    const summaryRows = [
      '',
      ';;;;;;UKUPNO BRUTO DUGOVANJE (KM);' + totalDug.toFixed(2) + ';;;;',
      ';;;;;;UKUPNE PRETLATE RODITELJA (KM);' + totalPretplata.toFixed(2) + ';;;;',
      ';;;;;;NETO POTRAZIVANJE GRUPE (KM);' + netoSaldo.toFixed(2) + ';;;;',
      ';;;;;;Filter obrazovnog nivoa;' + `"${selectedLevel}"` + ';;;;',
      ';;;;;;Datum kreiranja izvjestaja;' + `"${new Date().toLocaleDateString('bs-BA')} ${new Date().toLocaleTimeString('bs-BA')}"` + ';;;;',
    ];

    const csvContent = BOM + [headers.join(';'), ...rows, ...summaryRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanLevelName = selectedLevel.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `Struktura_Duga_Partneri_${cleanLevelName}_${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Aggregate Metrics in real-time
  const metrics = useMemo(() => {
    const subset =
      selectedLevel === 'ALL'
        ? PARTNER_DEBT_PORTFOLIO
        : PARTNER_DEBT_PORTFOLIO.filter((i) => i.eduLevel === selectedLevel);

    let totalGrossDebt = 0;
    let totalOverpayments = 0;
    let criticalOver90 = 0;
    let countDebtors = 0;
    let countPrepaid = 0;

    subset.forEach((item) => {
      if (item.totalDebt > 0) {
        totalGrossDebt += item.totalDebt;
        countDebtors++;
        if (item.ageGroup === '90+') {
          criticalOver90 += item.totalDebt;
        }
      } else if (item.totalDebt < 0) {
        totalOverpayments += Math.abs(item.totalDebt);
        countPrepaid++;
      }
    });

    const netReceivables = totalGrossDebt - totalOverpayments;

    // Age buckets calculation
    const buckets = [
      { key: '0-30', label: '0–30 dana', amount: 0, count: 0, color: '#3b82f6', risk: 'Nizak' },
      { key: '30-60', label: '30–60 dana', amount: 0, count: 0, color: '#f59e0b', risk: 'Srednji' },
      { key: '60-90', label: '60–90 dana', amount: 0, count: 0, color: '#ea580c', risk: 'Visok' },
      { key: '90+', label: '90+ dana', amount: 0, count: 0, color: '#dc2626', risk: 'Kritičan' },
    ];

    subset.forEach((item) => {
      if (item.totalDebt > 0) {
        const b = buckets.find((b) => b.key === item.ageGroup);
        if (b) {
          b.amount += item.totalDebt;
          b.count++;
        }
      }
    });

    return {
      totalGrossDebt,
      totalOverpayments,
      netReceivables,
      criticalOver90,
      countDebtors,
      countPrepaid,
      buckets,
    };
  }, [selectedLevel]);

  // D3 Chart Rendering
  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 560;
    const height = 260;
    const margin = { top: 25, right: 30, bottom: 45, left: 65 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = metrics.buckets;
    const maxVal = d3.max(data, (d) => d.amount) || 10000;

    // Scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.35);

    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.15])
      .nice()
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '3 3')
      .attr('opacity', 0.6);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('dy', '14px');

    g.select('.domain').attr('stroke', '#cbd5e1');

    // Y Axis
    g.append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d3.format(',.0f')(d as number)} KM`)
      )
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-weight', '600');

    g.select('.domain').remove();

    // Bar groups
    const barGroups = g
      .selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        setSelectedAgeFilter((prev) => (prev === d.key ? null : d.key));
      })
      .on('mouseenter', (_event, d) => setHoveredBucket(d.key))
      .on('mouseleave', () => setHoveredBucket(null));

    // Bars
    barGroups
      .append('rect')
      .attr('x', (d) => x(d.label) || 0)
      .attr('y', (d) => y(d.amount))
      .attr('width', x.bandwidth())
      .attr('height', (d) => innerHeight - y(d.amount))
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', (d) => d.color)
      .attr('opacity', (d) => {
        if (selectedAgeFilter && selectedAgeFilter !== d.key) return 0.35;
        if (hoveredBucket && hoveredBucket !== d.key) return 0.5;
        return 0.95;
      })
      .attr('stroke', (d) => (selectedAgeFilter === d.key ? '#0f172a' : 'transparent'))
      .attr('stroke-width', 2);

    // Value Labels on top of bars
    barGroups
      .append('text')
      .attr('x', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.amount) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.key === '90+' ? '#dc2626' : '#1e293b'))
      .attr('font-size', '11px')
      .attr('font-weight', '900')
      .text((d) => `${d.amount.toLocaleString('bs-BA')} KM`);

    // Count badge
    barGroups
      .append('text')
      .attr('x', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.amount) + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '9.5px')
      .attr('font-weight', '800')
      .text((d) => (d.count > 0 ? `${d.count} kup.` : ''));
  }, [metrics, selectedAgeFilter, hoveredBucket]);

  // D3 Line Chart Rendering for Historical 6-Month Trend
  useEffect(() => {
    if (!trendChartRef.current) return;

    const svg = d3.select(trendChartRef.current);
    svg.selectAll('*').remove();

    const width = 560;
    const height = 260;
    const margin = { top: 30, right: 35, bottom: 45, left: 65 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data based on selected educational level
    const trendData = HISTORICAL_DEBT_TREND.map((d) => {
      let value = d.totalDebt;
      if (selectedLevel === 'Toddler Group') value = d.toddlerDebt;
      else if (selectedLevel === 'Primary Grade 1-4') value = d.primaryLowerDebt;
      else if (selectedLevel === 'Primary Grade 5-9') value = d.primaryUpperDebt;
      return {
        ...d,
        activeValue: value,
      };
    });

    const maxVal = d3.max(trendData, (d) => d.activeValue) || 40000;
    const minVal = Math.max(0, (d3.min(trendData, (d) => d.activeValue) || 10000) * 0.7);

    // Scales
    const x = d3
      .scalePoint<string>()
      .domain(trendData.map((d) => d.monthShort))
      .range([0, innerWidth])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([minVal, maxVal * 1.15])
      .nice()
      .range([innerHeight, 0]);

    // Defs for gradient under area
    const defs = svg.append('defs');
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'debtTrendGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.35);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.0);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '3 3')
      .attr('opacity', 0.6);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('dy', '14px');

    g.select('.domain').attr('stroke', '#cbd5e1');

    // Y Axis
    g.append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d3.format(',.0f')(d as number)} KM`)
      )
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-weight', '600');

    g.select('.domain').remove();

    // Area Generator
    const area = d3
      .area<any>()
      .x((d) => x(d.monthShort) || 0)
      .y0(innerHeight)
      .y1((d) => y(d.activeValue))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(trendData)
      .attr('fill', 'url(#debtTrendGradient)')
      .attr('d', area);

    // Line Generator
    const line = d3
      .line<any>()
      .x((d) => x(d.monthShort) || 0)
      .y((d) => y(d.activeValue))
      .curve(d3.curveMonotoneX);

    // Draw Line
    g.append('path')
      .datum(trendData)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Interactive vertical crosshair guide
    const crosshair = g
      .append('line')
      .attr('class', 'trend-crosshair')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 4')
      .attr('opacity', 0)
      .style('pointer-events', 'none');

    // Group for each month's interactive node
    const dots = g
      .selectAll('.trend-dot')
      .data(trendData)
      .enter()
      .append('g')
      .attr('class', 'trend-dot')
      .style('cursor', 'pointer');

    // Outer ripple ring for hover animation
    dots
      .append('circle')
      .attr('class', 'ripple-ring')
      .attr('cx', (d) => x(d.monthShort) || 0)
      .attr('cy', (d) => y(d.activeValue))
      .attr('r', 6)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0)
      .style('transition', 'all 0.25s ease-out');

    // Main visible circular dot
    const circles = dots
      .append('circle')
      .attr('class', 'main-dot')
      .attr('cx', (d) => x(d.monthShort) || 0)
      .attr('cy', (d) => y(d.activeValue))
      .attr('r', 5.5)
      .attr('fill', '#ffffff')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 2.5)
      .style('transition', 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)');

    // Static label with value on top
    dots
      .append('text')
      .attr('class', 'static-label')
      .attr('x', (d) => x(d.monthShort) || 0)
      .attr('y', (d) => y(d.activeValue) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .attr('font-size', '10.5px')
      .attr('font-weight', '800')
      .text((d) => `${d.activeValue.toLocaleString('bs-BA')} KM`);

    // Invisible larger hit area for seamless hovering
    dots
      .append('circle')
      .attr('cx', (d) => x(d.monthShort) || 0)
      .attr('cy', (d) => y(d.activeValue))
      .attr('r', 24)
      .attr('fill', 'transparent')
      .on('mouseenter', function (event, d) {
        const parentNode = d3.select(this.parentNode as SVGGElement);
        
        // Animated expansion of target dot
        parentNode
          .select('.main-dot')
          .attr('r', 8.5)
          .attr('fill', '#2563eb')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 3);

        parentNode
          .select('.ripple-ring')
          .attr('r', 16)
          .attr('opacity', 0.28);

        // Show crosshair
        crosshair
          .attr('x1', x(d.monthShort) || 0)
          .attr('x2', x(d.monthShort) || 0)
          .attr('opacity', 0.85);

        // Calculate container-relative coordinates for floating tooltip
        const containerRect = trendChartRef.current?.getBoundingClientRect();
        if (containerRect) {
          const pointX = (x(d.monthShort) || 0) + margin.left;
          const pointY = y(d.activeValue) + margin.top;
          setTooltipPos({ x: pointX, y: pointY });
        }

        setHoveredTrendMonth(d);
      })
      .on('mouseleave', function () {
        const parentNode = d3.select(this.parentNode as SVGGElement);
        
        parentNode
          .select('.main-dot')
          .attr('r', 5.5)
          .attr('fill', '#ffffff')
          .attr('stroke', '#2563eb')
          .attr('stroke-width', 2.5);

        parentNode
          .select('.ripple-ring')
          .attr('r', 6)
          .attr('opacity', 0);

        crosshair.attr('opacity', 0);
        setHoveredTrendMonth(null);
      });
  }, [selectedLevel]);

  return (
    <div className="collection-status-dashboard bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 mb-8 shadow-sm">
      {/* Top Header & Educational Level Dropdown Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              STATUS NAPLATE I STAROSNA STRUKTURA POTRAŽIVANJA
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Konto 2110 (Kupci u zemlji)
            </span>
          </div>
          <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
            Nadzorna ploča naplate školarina: Analiza duga i pretplata u realnom vremenu
          </h4>
        </div>

        {/* Filter and Export Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Dropdown Filter for Educational Levels */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="eduLevelFilter"
              className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1"
            >
              <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Obrazovni nivo:
            </label>
            <div className="relative">
              <select
                id="eduLevelFilter"
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value as EducationalLevel);
                  setSelectedAgeFilter(null);
                }}
                className="appearance-none bg-white dark:bg-slate-800 border-2 border-blue-500/40 hover:border-blue-500 text-slate-800 dark:text-slate-100 text-xs font-bold py-2 pl-3 pr-8 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
              >
                <option value="ALL">Svi obrazovni nivoi (IMH + IDSS)</option>
                <option value="Toddler Group">Toddler Group (Vrtić IMH)</option>
                <option value="Primary Grade 1-4">Primary Grade 1-4 (Razredna nastava)</option>
                <option value="Primary Grade 5-9">Primary Grade 5-9 (Predmetna nastava)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Export to CSV Button for Offline Accounting Review */}
          <button
            type="button"
            onClick={handleExportDebtStructureCsv}
            title="Preuzmi trenutnu strukturu dugovanja i pretplata u CSV formatu za računovodstvenu analizu u Excelu"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black shadow-sm transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Izvoz u CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        {/* Ukupan dug */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>Ukupna dugovanja</span>
            <Users className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-lg md:text-xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
            {metrics.totalGrossDebt.toLocaleString('bs-BA')} KM
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {metrics.countDebtors} dužnika ({selectedLevel === 'ALL' ? 'grupa' : selectedLevel})
          </div>
        </div>

        {/* Ukupne pretplate */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>Pretplate roditelja</span>
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-lg md:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {metrics.totalOverpayments.toLocaleString('bs-BA')} KM
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {metrics.countPrepaid} pretplaćenih kartica
          </div>
        </div>

        {/* Neto potraživanje */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>Neto bilans naplate</span>
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-lg md:text-xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
            {metrics.netReceivables.toLocaleString('bs-BA')} KM
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Duguje minus Potražuje
          </div>
        </div>

        {/* Kritični dug preko 90 dana */}
        <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-800 dark:text-rose-300">
            <span>Kritično (90+ dana)</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-lg md:text-xl font-black text-rose-700 dark:text-rose-300 font-mono mt-1">
            {metrics.criticalOver90.toLocaleString('bs-BA')} KM
          </div>
          <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 font-semibold">
            {((metrics.criticalOver90 / (metrics.totalGrossDebt || 1)) * 100).toFixed(0)}% ukupnog duga
          </div>
        </div>
      </div>

      {/* Main Grid: D3 Aging Chart & 6-Month Historical Trend + Age Structure Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* D3 Visualizations Column with Tab Switcher */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          {/* Chart Header & Tab Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {chartViewMode === 'trend'
                  ? 'Historijski 6-mjesečni trend ukupnog duga (Maj - Okt 2026.)'
                  : 'Starosna struktura duga (Aging buckets)'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {chartViewMode === 'trend'
                  ? 'Kretanje potraživanja kroz vrijeme - identifikacija rasta ili pada naplate'
                  : 'Kliknite na stubac da filtrirate specifični starosni raspon'}
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-xs">
              <button
                type="button"
                onClick={() => setChartViewMode('aging')}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                  chartViewMode === 'aging'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Starost duga
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('trend')}
                className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 cursor-pointer ${
                  chartViewMode === 'trend'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                6-mj. trend
              </button>
            </div>
          </div>

          {/* Active Chart Display */}
          {chartViewMode === 'trend' ? (
            <div className="w-full flex flex-col justify-center items-center py-1 relative">
              <svg ref={trendChartRef} className="w-full max-w-[560px] h-auto overflow-visible" />

              {/* Floating Animated Tooltip */}
              {hoveredTrendMonth && (
                <div
                  className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full transition-all duration-150 ease-out"
                  style={{
                    left: `${(tooltipPos.x / 560) * 100}%`,
                    top: `${(tooltipPos.y / 260) * 100 - 4}%`,
                  }}
                >
                  <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-3 rounded-xl shadow-2xl border border-blue-500/50 backdrop-blur-md text-xs min-w-[200px] animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-700/80">
                      <span className="font-extrabold text-blue-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        {hoveredTrendMonth.month}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-bold">
                        {hoveredTrendMonth.collectionRate}% naplata
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-300 font-semibold">
                        <span>Ukupan dug (Konto 2110):</span>
                        <span className="font-mono text-sm font-black text-white">
                          {hoveredTrendMonth.totalDebt.toLocaleString('bs-BA')} KM
                        </span>
                      </div>

                      {/* Level Specific Breakdown in Tooltip */}
                      <div className="pt-1 mt-1 border-t border-slate-800 text-[10.5px] text-slate-400 space-y-0.5">
                        <div className="flex justify-between">
                          <span>• Toddler Group (IMH):</span>
                          <span className="font-mono text-slate-300">{hoveredTrendMonth.toddlerDebt.toLocaleString('bs-BA')} KM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Grade 1-4 (IDSS):</span>
                          <span className="font-mono text-slate-300">{hoveredTrendMonth.primaryLowerDebt.toLocaleString('bs-BA')} KM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Grade 5-9 (IDSS):</span>
                          <span className="font-mono text-slate-300">{hoveredTrendMonth.primaryUpperDebt.toLocaleString('bs-BA')} KM</span>
                        </div>
                      </div>
                    </div>

                    {/* Small Tooltip Arrow Pointing to Circle */}
                    <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-slate-900/95 rotate-45 border-r border-b border-blue-500/50"></div>
                  </div>
                </div>
              )}
              
              {/* Trend Analysis Callout */}
              <div className="w-full mt-2 p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <ArrowDownRight className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pad potraživanja: -28,3% u 6 mjeseci</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  Maj: 34.200 KM ➔ Okt: 24.530 KM
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col justify-center items-center py-1">
              {selectedAgeFilter && (
                <div className="self-end mb-1">
                  <button
                    onClick={() => setSelectedAgeFilter(null)}
                    className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  >
                    Poništi filter ({selectedAgeFilter}) ✕
                  </button>
                </div>
              )}
              <svg ref={chartRef} className="w-full max-w-[560px] h-auto overflow-visible" />
            </div>
          )}

          {/* Footer of Visualizations Column */}
          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-500">
            {chartViewMode === 'trend' ? (
              <>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-semibold">
                  <Activity className="w-3 h-3 text-blue-600" />
                  Plava linija: Ukupan dug po mjesecima (Konto 2110)
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Prosječna stopa naplate: 92,5%
                </span>
              </>
            ) : (
              <>
                <span>0–30d: Tekuće</span>
                <span>30–60d: Opomena I</span>
                <span>60–90d: Opomena II</span>
                <span className="font-bold text-rose-600">90+ dana: Utuženje</span>
              </>
            )}
          </div>
        </div>

        {/* Detailed Breakdown & Quick Actions Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Raščlamba po kupcima / karticama ({filteredData.length})
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {selectedLevel === 'ALL' ? 'Svi nivoi' : selectedLevel}
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredData.map((item) => {
                const isOverpaid = item.totalDebt < 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectPartner) {
                        onSelectPartner(item.partnerName, item.entity);
                      }
                    }}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition cursor-pointer ${
                      item.status === 'critical'
                        ? 'bg-rose-50/50 hover:bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/60'
                        : isOverpaid
                        ? 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60'
                        : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 dark:bg-slate-800/80 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex-1 pr-2 min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 truncate">
                        <span>{item.partnerName}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {item.entity}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {item.childName} · {item.eduLevel}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`font-black font-mono text-xs ${
                          isOverpaid
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : item.status === 'critical'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {isOverpaid ? '' : '+'}
                        {item.totalDebt.toLocaleString('bs-BA')} KM
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                          item.ageGroup === '90+'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                            : item.ageGroup === '60-90'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {item.ageGroup} dana
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
              Klik na stavku učitava partnera u obrazac analize
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Ažurirano: Danas
            </span>
          </div>
        </div>
      </div>

      {/* TOP 10 NAJSTARIJIH DUGOVANJA - STRATEŠKA LISTA PRIORITETNE NAPLATE ZA DIREKTORA */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                <Target className="w-3 h-3 text-rose-600" />
                PRIORITETNI CILJEVI NAPLATE (RECOVERY TARGETS)
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Top 10 najkritičnijih konta po danima kašnjenja
              </span>
            </div>
            <h5 className="text-sm font-black text-slate-900 dark:text-slate-100 mt-1">
              Pojedinačni tabelarni pregled 10 najvećih dospjelih potraživanja
            </h5>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <span className="font-bold text-rose-600 dark:text-rose-400">
              Ukupno u Top 10: {topOverdueAccounts.reduce((acc, curr) => acc + curr.totalDebt, 0).toLocaleString('bs-BA')} KM
            </span>
          </div>
        </div>

        {/* Granular Row-by-Row Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-700/60 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                <th scope="col" className="py-2.5 px-3 font-bold text-center w-10">#</th>
                <th scope="col" className="py-2.5 px-3 font-bold">Roditelj / Partner</th>
                <th scope="col" className="py-2.5 px-3 font-bold">Učenik & Nivo</th>
                <th scope="col" className="py-2.5 px-3 font-bold">Entitet</th>
                <th scope="col" className="py-2.5 px-3 font-bold text-right">Ukupan iznos</th>
                <th scope="col" className="py-2.5 px-3 font-bold text-center">Dana kašnjenja</th>
                <th scope="col" className="py-2.5 px-3 font-bold text-center">Datum dospijeća</th>
                <th scope="col" className="py-2.5 px-3 font-bold text-center">Zadnja uplata</th>
                <th scope="col" className="py-2.5 px-3 font-bold text-center">Status / Akcija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {topOverdueAccounts.map((account, index) => {
                const isVeryCritical = account.daysOverdue >= 90;
                return (
                  <tr
                    key={account.id}
                    onClick={() => {
                      if (onSelectPartner) {
                        onSelectPartner(account.partnerName, account.entity);
                      }
                    }}
                    className={`transition-colors cursor-pointer hover:bg-blue-50/60 dark:hover:bg-blue-950/30 ${
                      isVeryCritical ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center font-bold font-mono text-slate-400">
                      {index + 1}.
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span>{account.partnerName}</span>
                        {isVeryCritical && (
                          <span title="Kritično kašnjenje preko 90 dana" className="inline-flex">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        ID: {account.id} · Konto 2110
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      <span className="font-semibold block">{account.childName}</span>
                      <span className="text-[10px] text-slate-500">{account.eduLevel}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded ${
                          account.entity === 'IDSS'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {account.entity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
                      {account.totalDebt.toLocaleString('bs-BA', { minimumFractionDigits: 2 })} KM
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-black ${
                          account.daysOverdue >= 180
                            ? 'bg-rose-600 text-white shadow-xs'
                            : account.daysOverdue >= 90
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {account.daysOverdue} dana
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600 dark:text-slate-300">
                      {account.dueDate}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600 dark:text-slate-300">
                      {account.lastPaymentDate}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectPartner) {
                            onSelectPartner(account.partnerName, account.entity);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] font-bold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                        title="Učitaj karticu u forenzički analizator"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Forenzika</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <span>
            💡 <b>Uputa za direktora:</b> Redovi označeni sa više od 90 dana kašnjenja zahtijevaju slanje formalne pisane opomene pred utuženje sa rokom od 8 dana.
          </span>
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            Prikazano: 10 od 10 najkritičnijih dužnika
          </span>
        </div>
      </div>
    </div>
  );
};
