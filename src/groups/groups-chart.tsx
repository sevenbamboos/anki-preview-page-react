import React, {useRef, useEffect} from 'react';
import { GroupData } from '../types';
import * as ls from './styles';
import * as d3 from 'd3'

type GroupsChartProp = {
  groups: GroupData[]
};

function createCanvas(ref: any, width: number, height: number) {
  return d3.select(ref)
    .append('svg')
    .attr('width', width)
    .attr('height', height);  
}

type GroupStat = {
  basic: number,
  clozing: number,
  total: number,
  name: string
}

type GroupStatsWithMaxCard = [number, GroupStat[]];

function convertGroupDatas(groups: GroupData[]): GroupStatsWithMaxCard {
  let maxCards = 0;

  const groupStats = groups
    .filter(g => g.previewCards.length)
    .map(g => {
      const cards = g.previewCards;
      const stat = {clozing: 0, basic: 0};

      cards.reduce((accu, curr) => {
        if (curr.forBasic) accu.basic++;
        if (curr.forCloze) accu.clozing++;
        return accu;
      }, stat);
      
      const total = stat.basic+stat.clozing;
      if (total > maxCards) {
        maxCards = total;
      }

      return {...stat, total, name: g.name};
    });

  return [maxCards, groupStats];
}

function drawAxis(canvas: any, max: number, width: number) {
  const xScale = d3.scaleLinear()
    .domain([0, max])
    .range([10, width-10]);
  
  const axisGen = d3.axisBottom(xScale);

  canvas.append('g').call(axisGen);
}

const barWidth = 5,
      barSpace = 20;

function drawBars(groups: GroupData[], headerCanvas: any, canvas: any, width: number, height: number) {

  const [maxCards, barsData] = convertGroupDatas(groups); 

  drawAxis(headerCanvas, maxCards, width);

  const calcVal = (y:number) => (width-10)*y/maxCards;
  const bars = canvas.selectAll('rect').data(barsData);

  bars.enter()
    .append("rect")
    .attr('fill', 'green')
    .attr('x', (_bar: GroupStat, i: number) => 10)
    .attr('y', (_bar: GroupStat, i: number) => i*barSpace)
    .attr('width', (bar: GroupStat) => calcVal(bar.total)-10)
    .attr('height', barWidth)
    .append('title')
    .text((bar: GroupStat) => bar.name);

  bars.enter()
    .append("rect")
    .attr('fill', 'blue')
    .attr('x', (_bar: GroupStat, i: number) => 10)
    .attr('y', (_bar: GroupStat, i: number) => i*barSpace + barWidth)
    .attr('width', (bar: GroupStat) => calcVal(bar.clozing)-10)
    .attr('height', barWidth);

  bars.enter()
    .append("rect")
    .attr('fill', 'red')
    .attr('x', (_bar: GroupStat, i: number) => 10)
    .attr('y', (_bar: GroupStat, i: number) => i*barSpace + 2*barWidth)
    .attr('width', (bar: GroupStat) => calcVal(bar.basic)-10)
    .attr('height', barWidth);

  bars.exit().remove();
}

export default ({groups}: GroupsChartProp) => {

  const groupsHeaderCanvasRef = useRef(null);
  const groupsCanvasRef = useRef(null);

  const width = 450,
        height = barSpace * groups.length;

  useEffect(() => {
    const canvas = createCanvas(groupsCanvasRef.current, width, height);
    const headerCanvas = createCanvas(groupsHeaderCanvasRef.current, width, 20);
    drawBars(groups, headerCanvas, canvas, width, height);

  }, [groups, height]);

  return (
    <>
    <ls.GroupsChartContents ref={groupsCanvasRef}></ls.GroupsChartContents >
    <ls.GroupsChartHeader>
      <div ref={groupsHeaderCanvasRef}></div>
    </ls.GroupsChartHeader>
    </>
  );
};
