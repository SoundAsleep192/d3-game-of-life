import { select } from 'd3';
import { produce } from 'immer';

import { FIELD_SIZE, CELL_SIZE_PX, CELL_GAP_PX } from './constants';
import { Cell } from './interfaces';
import { drawField, execGameStep } from './utils';

// --- create field data model ---
let field: Cell[][] = [];

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

// --- initialize rendering process ---
const container = select('body')
    .append('svg')
    .attr('width', () => FIELD_SIZE * (CELL_SIZE_PX + CELL_GAP_PX))
    .attr('height', () => FIELD_SIZE * (CELL_SIZE_PX + CELL_GAP_PX))
    .on('mousedown', function (event: MouseEvent) {
        const cellRectElement = <SVGRectElement>event.target;
        if (cellRectElement.tagName !== 'rect') return;

        const { row, col } = cellRectElement.dataset;

        field = produce(field, draftField => {
            draftField[+row][+col].alive = !field[+row][+col].alive;
        });

        drawField(container, field);
    });

drawField(container, field);

// -- create a button and interval for game loop
let intervalRef;
select('body')
    .append('button')
    .text('PLAY')
    .on('click', function () {
        if (intervalRef) {
            clearInterval(intervalRef);
            intervalRef = null;
            select(this).text('PLAY');
            return;
        }

        select(this).text('STOP');
        intervalRef = setInterval(() => {
            field = execGameStep(field);
            drawField(container, field);
        }, 250);
    });
