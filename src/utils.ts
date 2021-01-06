import { BaseType, Selection } from "d3";
import { produce } from 'immer';

import { CELL_SIZE_PX, CELL_GAP_PX } from "./constants";
import { Cell } from "./interfaces";

export function drawField(rowsSelection: Selection<BaseType, unknown, SVGSVGElement, unknown>, data: Cell[][]): Selection<SVGRectElement, Cell, SVGGElement, Cell[]> {
  return rowsSelection
    .data(data)
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

/** Applies game rules for one game step and returns next field state */
export function execGameStep(currentField: Cell[][]): Cell[][] {
  const nextField = produce(currentField, draftField => {
    for (let rowIndex = 0; rowIndex < currentField.length; rowIndex += 1) {
      const row = currentField[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
        const currentCell = currentField[rowIndex][colIndex];
        const draftCell = draftField[rowIndex][colIndex];
        const neighboursAlive = getNeighboursAlive(currentCell, currentField);
        if (currentCell.alive) {
          if (neighboursAlive == 2 || neighboursAlive == 3) {
            continue;
          } else {
            draftCell.alive = false;
          }
        } else {
          if (neighboursAlive === 3) {
            draftCell.alive = true;
          } else {
            continue;
          }
        }
      }
    }
  });

  return nextField;
}

/** Returns amount of neighbours alive near the given cell */
function getNeighboursAlive(cell: Cell, field: Cell[][]): number {
  const positionsAround = [
    [0, 1],
    [1, 0],
    [1, 1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];

  const neightbours: Cell[] = [];

  positionsAround.forEach(position => {
    neightbours.push(field[cell.row + position[0]]?.[cell.col + position[1]]);
  });

  return neightbours.filter(neightbour => neightbour?.alive).length;
}