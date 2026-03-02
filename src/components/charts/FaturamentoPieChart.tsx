import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface FaturamentoPorProcedimento {
  name: string;
  value: number;
  /** Opcional: última data de pagamento para exibir no tooltip */
  lastPayment?: string;
}

interface FaturamentoPieChartProps {
  data: FaturamentoPorProcedimento[];
  width?: number;
  height?: number;
}

const MARGIN = 8;
const DEFAULT_COLORS = [
  '#1976d2',
  '#2e7d32',
  '#ed6c02',
  '#9c27b0',
  '#0288d1',
  '#388e3c',
  '#d32f2f',
  '#7b1fa2',
  '#00796b',
  '#f57c00',
];

export function FaturamentoPieChart({
  data,
  width = 280,
  height = 280,
}: FaturamentoPieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const filtered = data.filter((d) => d.value > 0);
    if (!filtered.length) {
      const g = d3
        .select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .style('font-size', '14px')
        .style('opacity', '0.8')
        .text('Nenhum pagamento por procedimento');
      return;
    }

    const pieHeight = Math.min(width, height) - MARGIN * 2;
    const radius = pieHeight / 2 - MARGIN;
    const centerY = MARGIN + radius;
    const color = d3.scaleOrdinal<string>().domain(filtered.map((d) => d.name)).range(DEFAULT_COLORS);

    const pie = d3
      .pie<FaturamentoPorProcedimento>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<FaturamentoPorProcedimento>>().innerRadius(0).outerRadius(radius);

    const arcLabel = d3
      .arc<d3.PieArcDatum<FaturamentoPorProcedimento>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    const legendRowHeight = 18;
    const totalHeight = pieHeight + MARGIN + filtered.length * legendRowHeight;
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', totalHeight)
      .attr('viewBox', `0 0 ${width} ${totalHeight}`);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${centerY})`);

    const arcs = g
      .selectAll('.arc')
      .data(pie(filtered))
      .join('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.name))
      .attr('stroke', 'rgba(255,255,255,0.5)')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.9);

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arcLabel.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '12px')
      .style('font-weight', '700')
      .style('pointer-events', 'none')
      .style('paint-order', 'stroke')
      .style('stroke', 'rgba(0,0,0,0.35)')
      .style('stroke-width', '2px')
      .text((d) => {
        const v = d.data.value;
        if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
        return `R$ ${v.toFixed(0)}`;
      });

    // Legenda abaixo do gráfico: nome do procedimento + valor pago
    const legendTop = pieHeight + MARGIN;
    const legend = svg.append('g').attr('class', 'legend').attr('transform', `translate(0, ${legendTop})`);

    filtered.forEach((d, i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * legendRowHeight})`);
      row.append('rect').attr('width', 12).attr('height', 12).attr('y', 1).attr('fill', color(d.name)).attr('rx', 2);
      row
        .append('text')
        .attr('x', 16)
        .attr('y', 12)
        .attr('fill', 'currentColor')
        .style('font-size', '13px')
        .style('font-weight', '600')
        .text(`${d.name.length > 22 ? d.name.slice(0, 22) + '…' : d.name} — R$ ${d.value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`);
    });
  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      style={{ overflow: 'visible', maxWidth: '100%' }}
      className="FaturamentoPieChart-root"
    />
  );
}
