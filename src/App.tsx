import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const GRID_ROWS = 20;
const GRID_COLUMNS = 20;
const SQUARE_WIDTH = 20;
const SQUARE_HEIGHT = 20;
const SIMULATION_SPEED = 10;

const generateEmptyGrid = () =>
  Array(GRID_ROWS).fill(Array(GRID_COLUMNS).fill(0));

const App: React.FC = () => {
  const [grid, setGrid] = useState(generateEmptyGrid());

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);

  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid(gridCurrent => {
      return produce(gridCurrent, gridCopy => {
        for (let i = 1; i < GRID_ROWS - 1; i += 1) {
          for (let j = 1; j < GRID_COLUMNS - 1; j += 1) {
            const neighbors =
              gridCurrent[i - 1][j - 1] +
              gridCurrent[i - 1][j] +
              gridCurrent[i - 1][j + 1] +
              gridCurrent[i][j - 1] +
              gridCurrent[i][j + 1] +
              gridCurrent[i + 1][j - 1] +
              gridCurrent[i + 1][j] +
              gridCurrent[i + 1][j + 1];

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (!gridCurrent[i][j] && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, SIMULATION_SPEED);
  }, []);

  return (
    <>
      <h1>Conway's Game of Life</h1>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          setGrid(
            Array.from({ length: GRID_ROWS }, () =>
              Array.from({ length: GRID_COLUMNS }, () =>
                Math.random() > 0.5 ? 1 : 0
              )
            )
          );
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </button>
      <div
        style={{
          display: "grid",
          marginTop: "1em",
          gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${SQUARE_WIDTH}px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((_: number, j: number) => (
            <div
              key={`${i}~${j}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = !gridCopy[i][j];
                });
                setGrid(newGrid);
              }}
              style={{
                width: SQUARE_WIDTH,
                height: SQUARE_HEIGHT,
                backgroundColor: grid[i][j] ? "pink" : undefined,
                border: "1px solid black"
              }}
            />
          ))
        )}
      </div>
      <p>
        <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
          About the game.
        </a>
      </p>
    </>
  );
};

export default App;
