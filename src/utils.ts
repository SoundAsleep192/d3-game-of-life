import { BaseType, Selection } from "d3";
import { CELL_SIZE_PX, CELL_GAP_PX } from "./constants";
import { Cell } from "./interfaces";

export function drawField(rowsSelection: Selection<BaseType, unknown, SVGSVGElement, unknown>, data: Cell[][]): void {
  rowsSelection.data(data)
    .enter()
    .append('g')
    .attr('transform', (_, i) => `translate(0, ${i * (CELL_SIZE_PX + CELL_GAP_PX)})`)
    .selectAll('rect')
    .data((row) => row)
    .enter()
    .append('rect')
    .attr('x', (_, i) => i * (CELL_SIZE_PX + CELL_GAP_PX))
    .attr('y', 0)
    .attr('width', CELL_SIZE_PX)
    .attr('height', CELL_SIZE_PX)
    .attr('data-row', (cell) => cell.row)
    .attr('data-col', (cell) => cell.col)
    .attr('fill', (cell) => cell.alive ? 'cyan' : 'lightgrey')
    .style('cursor', 'pointer');
}
