import { select } from 'd3';
import { FIELD_SIZE, CELL_SIZE_PX, CELL_GAP_PX } from './constants';
import { Cell } from './interfaces';
import { drawField } from './utils';

export const field: Cell[][] = [];

for (let i = 0; i < FIELD_SIZE; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < FIELD_SIZE; j++) {
        row.push({
            alive: false,
            row: i,
            col: j,
        })
    }
    field.push(row);
}

const rows = select('body')
    .append('svg')
    .attr('width', () => FIELD_SIZE * (CELL_SIZE_PX + CELL_GAP_PX))
    .attr('height', () => FIELD_SIZE * (CELL_SIZE_PX + CELL_GAP_PX))
    .on('mousedown', function (event: MouseEvent) {
        const cellRectElement = <SVGRectElement>event.target;
        if (cellRectElement.tagName !== 'rect') return;

        const { row, col } = cellRectElement.dataset;

        field[+row][+col].alive = !field[+row][+col].alive;

        drawField(rows, field);
    })
    .selectAll('g');

drawField(rows, field);
