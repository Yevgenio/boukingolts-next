
'use client';

import React, { useState } from 'react';
import './ColorGrid.css';

const GRID_WIDTH = 30;
const GRID_HEIGHT = 20;
const COLORS = [
    '#FFB3BA', // pastel red
    '#B3C6FF', // pastel blue
    '#BFFCC6', // pastel green
    '#FFB3FF', // pastel magenta
    '#B3FFF7', // pastel cyan
];

function getRandomColor(exclude: string) {
  const options = COLORS.filter(color => color !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

type CellState = {
  frontColor: string;
  backColor: string;
  isFlipped: boolean;
};

export default function ColorGrid() {
  const [cells, setCells] = useState<CellState[]>(
    Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, () => {
      const color = '#f5f5f5f5';
      return {
        frontColor: color,
        backColor: color,
        isFlipped: false,
      };
    })
  );

  const handleClick = (index: number) => {
    setCells(prev =>
      prev.map((cell, i) => {
        if (i !== index) return cell;

        const nextColor = getRandomColor(cell.isFlipped ? cell.frontColor : cell.backColor);

        return {
          frontColor: cell.isFlipped ? nextColor : cell.frontColor,
          backColor: !cell.isFlipped ? nextColor : cell.backColor,
          isFlipped: !cell.isFlipped,
        };
      })
    );
  };

  return (
    <div className="grid-wrapper">
      {cells.map((cell, index) => (
        <div key={index} className="card" onClick={() => handleClick(index)}>
          <div
            className={`card-inner ${cell.isFlipped ? 'flipped' : ''}`}
          >
            <div className="card-face front" style={{ backgroundColor: cell.frontColor }} />
            <div className="card-face back" style={{ backgroundColor: cell.backColor }} />
            <div className="shine" />
          </div>
        </div>
      ))}
    </div>
  );
}
