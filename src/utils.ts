import { Selection } from "d3";
import { produce } from 'immer';

import { CELL_SIZE_PX, CELL_GAP_PX } from "./constants";
import { Cell } from "./interfaces";

/** Draws svg field in the DOM */
export function drawField(svgContainer: Selection<SVGSVGElement, unknown, HTMLElement, any>, data: Cell[][]): void {
  // I've no idea why it only works this way, but here we go...
  // if we don't call remove(), it duplicates all the <g> elements on every render
  // if we leave just the first remove, it removes everything
  // if we leave just the second remove, it duplicates all <g> elements once and then properly updates the second set of them
  // wtf?
  svgContainer
    .selectAll('g')
    .remove()
    .data(data)
    .exit()
    .remove()
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