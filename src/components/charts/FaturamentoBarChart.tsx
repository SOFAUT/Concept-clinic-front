import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
// import type { Selection } from 'd3';

export interface FaturamentoMes {
  mes: string;
  valor: number;
}

interface FaturamentoBarChartProps {
  data: FaturamentoMes[];
  width?: number;
  height?: number;
}

const MARGIN = { top: 24, right: 24, bottom: 48, left: 56 };

export function FaturamentoBarChart({ data, width = 600, height = 320 }: FaturamentoBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const innerWidth = width - MARGIN.left - MARGIN.right;
    const innerHeight = height - MARGIN.top - MARGIN.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const xScale = d3
      .scaleBand<string>()
      .domain(data.map((d: FaturamentoMes) => d.mes))
      .range([0, innerWidth])
      .padding(0.35);

    const maxVal = Math.max(d3.max(data, (d: FaturamentoMes) => d.valor) ?? 0, 0);
    const yMax = maxVal > 0 ? maxVal * 1.1 : 1;
    const yScale = d3
      .scaleLinear<number, number>()
      .domain([0, yMax])
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(6)
      .tickFormat((d: d3.NumberValue) => `R$ ${Number(d) / 1000}k`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-35)')
      .style('text-anchor', 'end');

    g.append('g').call(yAxis);

    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d: FaturamentoMes) => xScale(d.mes) ?? 0)
      .attr('y', (d: FaturamentoMes) => yScale(d.valor))
      .attr('width', xScale.bandwidth())
      .attr('height', (d: FaturamentoMes) => innerHeight - yScale(d.valor))
      .attr('fill', 'rgba(25, 118, 210, 0.85)')
      .attr('rx', 4);
  }, [data, width, height]);

  return <svg ref={svgRef} style={{ overflow: 'visible', maxWidth: '100%' }} />;
}
