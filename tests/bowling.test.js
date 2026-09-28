// Pruebas unitarias del cálculo de puntaje. Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateGame, BowlingError } from "../src/libs/bowling.js";

const repeat = (frame, n = 10) => Array.from({ length: n }, () => [...frame]);

test("CP-01 Juego perfecto: 12 strikes = 300", () => {
  const frames = [...repeat([10], 9), [10, 10, 10]];
  const game = calculateGame(frames);
  assert.equal(game.total, 300);
  assert.equal(game.stats.perfectGame, true);
  assert.equal(game.stats.strikes, 10);
});

test("CP-02 Todos a la canal (gutter game) = 0", () => {
  assert.equal(calculateGame(repeat([0, 0])).total, 0);
});

test("CP-03 Todos 1 pin por lanzamiento = 20", () => {
  assert.equal(calculateGame(repeat([1, 1])).total, 20);
});

test("CP-04 Todos spares 5/5 con bono 5 = 150", () => {
  const frames = [...repeat([5, 5], 9), [5, 5, 5]];
  const game = calculateGame(frames);
  assert.equal(game.total, 150);
  assert.equal(game.stats.spares, 10);
  assert.equal(game.stats.sparePercentage, 100);
});

test("CP-05 Un spare suma 10 + el siguiente lanzamiento", () => {
  const frames = [[7, 3], [4, 2], ...repeat([0, 0], 8)];
  const game = calculateGame(frames);
  assert.equal(game.frames[0].score, 14);
  assert.equal(game.total, 20);
});

test("CP-06 Un strike suma 10 + los dos lanzamientos siguientes", () => {
  const frames = [[10], [3, 4], ...repeat([0, 0], 8)];
  const game = calculateGame(frames);
  assert.equal(game.frames[0].score, 17);
  assert.equal(game.total, 24);
});

test("CP-07 Partida mixta conocida = 133", () => {
  const frames = [[1, 4], [4, 5], [6, 4], [5, 5], [10], [0, 1], [7, 3], [6, 4], [10], [2, 8, 6]];
  const game = calculateGame(frames);
  assert.deepEqual(
    game.frames.map((f) => f.cumulative),
    [5, 14, 29, 49, 60, 61, 77, 97, 117, 133]
  );
});

test("CP-08 Rechaza un frame que suma más de 10 pines", () => {
  assert.throws(() => calculateGame([[7, 5], ...repeat([0, 0], 9)]), BowlingError);
});

test("CP-09 Rechaza valores negativos o mayores a 10", () => {
  assert.throws(() => calculateGame([[11], ...repeat([0, 0], 9)]), BowlingError);
  assert.throws(() => calculateGame([[-1, 2], ...repeat([0, 0], 9)]), BowlingError);
});

test("CP-10 Rechaza tercer lanzamiento en el décimo frame sin strike ni spare", () => {
  assert.throws(() => calculateGame([...repeat([0, 0], 9), [3, 4, 5]]), BowlingError);
});

test("CP-11 Rechaza partida incompleta cuando se exige completa", () => {
  assert.throws(() => calculateGame(repeat([1, 1], 9)), BowlingError);
});

test("CP-12 Permite partida en curso y deja pendiente el strike sin bono", () => {
  const game = calculateGame([[3, 4], [10]], { complete: false });
  assert.equal(game.frames[0].cumulative, 7);
  assert.equal(game.frames[1].cumulative, null);
  assert.equal(game.total, 7);
});

test("CP-13 Décimo frame: strike y bonos que suman más de 10 es inválido", () => {
  assert.throws(() => calculateGame([...repeat([0, 0], 9), [10, 6, 7]]), BowlingError);
});
