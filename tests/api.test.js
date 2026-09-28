// Pruebas de integración de la API con una base de datos MongoDB en memoria.
// Ejecutar con: npm test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.JWT_SECRET = "clave-de-prueba";
process.env.NODE_ENV = "test";

const { default: app } = await import("../src/app.js");
const { seedLessons } = await import("../src/controllers/lesson.controller.js");
const { default: User } = await import("../src/models/user.model.js");

let mongo;
const tokens = {};
const ids = {};

const api = () => request(app);
const auth = (who) => ({ Authorization: `Bearer ${tokens[who]}` });

const openFrames = (pins) => Array.from({ length: 10 }, () => [pins, 0]);

before(async () => {
  // Si existe TEST_MONGO_URI se usa esa base; si no, una MongoDB temporal en memoria
  let uri = process.env.TEST_MONGO_URI;
  if (!uri) {
    mongo = await MongoMemoryServer.create();
    uri = mongo.getUri();
  }
  await mongoose.connect(uri, { dbName: `bowlingpro_test_${Date.now()}` });
  await seedLessons();
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

test("CP-14 Registro de jugador devuelve token y rol jugador", async () => {
  const res = await api().post("/api/register").send({
    username: "laura", email: "laura@test.com", password: "123456", group: "liga-a"
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.user.role, "jugador");
  assert.equal(res.body.user.level, "principiante");
  tokens.player = res.body.token;
  ids.player = res.body.user.id;
});

test("CP-15 No se puede registrar el mismo correo dos veces", async () => {
  const res = await api().post("/api/register").send({
    username: "laura2", email: "laura@test.com", password: "123456"
  });
  assert.equal(res.status, 400);
});

test("CP-16 Registro rechaza contraseña corta y correo inválido", async () => {
  const res = await api().post("/api/register").send({ username: "ab", email: "no-es-correo", password: "1" });
  assert.equal(res.status, 400);
});

test("CP-17 No se puede auto-registrar como administrador", async () => {
  const res = await api().post("/api/register").send({
    username: "hacker", email: "h@test.com", password: "123456", role: "admin"
  });
  assert.equal(res.status, 400);
});

test("CP-18 Login con credenciales correctas e incorrectas", async () => {
  const ok = await api().post("/api/login").send({ email: "laura@test.com", password: "123456" });
  assert.equal(ok.status, 200);
  assert.ok(ok.body.token);

  const bad = await api().post("/api/login").send({ email: "laura@test.com", password: "equivocada" });
  assert.equal(bad.status, 401);
});

test("CP-19 Rutas protegidas exigen token", async () => {
  const res = await api().get("/api/games");
  assert.equal(res.status, 401);
});

test("CP-20 Registrar partida calcula el puntaje en el servidor", async () => {
  const frames = [[1, 4], [4, 5], [6, 4], [5, 5], [10], [0, 1], [7, 3], [6, 4], [10], [2, 8, 6]];
  const res = await api().post("/api/games").set(auth("player")).send({ frames, place: "Bolera Norte", total: 999 });
  assert.equal(res.status, 201);
  assert.equal(res.body.total, 133); // ignora el total enviado por el cliente
  assert.equal(res.body.strikes, 2);
});

test("CP-21 Partida inválida es rechazada con mensaje claro", async () => {
  const frames = [[8, 5], ...openFrames(0).slice(1)];
  const res = await api().post("/api/games").set(auth("player")).send({ frames });
  assert.equal(res.status, 400);
  assert.match(res.body.message, /más de 10/);
});

test("CP-22 Estadísticas e historial del jugador", async () => {
  await api().post("/api/games").set(auth("player")).send({ frames: [...Array(9).fill([10]), [10, 10, 10]] });
  const stats = await api().get("/api/games/stats").set(auth("player"));
  assert.equal(stats.body.gamesPlayed, 2);
  assert.equal(stats.body.bestScore, 300);
  assert.equal(stats.body.average, 216.5);
  assert.ok(stats.body.recommendations.length > 0);

  const history = await api().get("/api/games").set(auth("player"));
  assert.equal(history.body.length, 2);
});

test("CP-23 Retos se validan contra el historial", async () => {
  const res = await api().get("/api/challenges").set(auth("player"));
  const byId = Object.fromEntries(res.body.challenges.map((c) => [c.id, c]));
  assert.equal(byId["primer-strike"].completed, true);
  assert.equal(byId["perfecto"].completed, true);
  assert.equal(byId["turkey"].completed, true);
  assert.equal(byId["constancia"].completed, false); // solo 2 de 5 partidas
});

test("CP-24 Lecciones avanzadas bloqueadas para principiante", async () => {
  const list = await api().get("/api/lessons").set(auth("player"));
  const spare = list.body.lessons.find((l) => l.id === "spare");
  assert.equal(spare.locked, true);

  const res = await api().get("/api/lessons/spare").set(auth("player"));
  assert.equal(res.status, 403);
});

test("CP-25 Evaluación reprobada no avanza de nivel", async () => {
  const res = await api().post("/api/lessons/postura/quiz").set(auth("player")).send({ answers: [0, 0, 1] });
  assert.equal(res.body.passed, false);
  assert.equal(res.body.level, "principiante");
});

test("CP-26 Aprobar todas las lecciones del nivel sube al jugador de nivel", async () => {
  const lessons = (await api().get("/api/lessons").set(auth("player"))).body.lessons
    .filter((l) => l.level === "principiante");
  const answers = { postura: [1, 1, 0], agarre: [1, 0, 1], aproximacion: [1, 0, 0] };

  let last;
  for (const l of lessons) {
    last = await api().post(`/api/lessons/${l.id}/quiz`).set(auth("player")).send({ answers: answers[l.id] });
    assert.equal(last.body.passed, true);
  }
  assert.equal(last.body.levelUp, true);
  assert.equal(last.body.level, "intermedio");
});

test("CP-27 Solo el administrador puede crear lecciones", async () => {
  const lesson = { slug: "nueva", level: "principiante", title: "Nueva lección" };
  const denied = await api().post("/api/lessons").set(auth("player")).send(lesson);
  assert.equal(denied.status, 403);

  await User.create({ username: "admin", email: "admin@test.com", password: "123456", role: "admin" });
  const login = await api().post("/api/login").send({ email: "admin@test.com", password: "123456" });
  tokens.admin = login.body.token;

  const ok = await api().post("/api/lessons").set(auth("admin")).send(lesson);
  assert.equal(ok.status, 201);
});

test("CP-28 El entrenador solo ve y comenta jugadores de su grupo", async () => {
  const coach = await api().post("/api/register").send({
    username: "profe", email: "profe@test.com", password: "123456", role: "entrenador", group: "liga-a"
  });
  tokens.coach = coach.body.token;

  const other = await api().post("/api/register").send({
    username: "otro", email: "otro@test.com", password: "123456", group: "liga-b"
  });

  const players = await api().get("/api/coach/players").set(auth("coach"));
  assert.deepEqual(players.body.map((p) => p.username), ["laura"]);

  const ok = await api().post("/api/feedback").set(auth("coach"))
    .send({ player: ids.player, text: "Buen trabajo en los strikes", kind: "observacion" });
  assert.equal(ok.status, 201);

  const denied = await api().post("/api/feedback").set(auth("coach"))
    .send({ player: other.body.user.id, text: "Hola" });
  assert.equal(denied.status, 403);

  const noAccess = await api().get("/api/coach/players").set(auth("player"));
  assert.equal(noAccess.status, 403);
});

test("CP-29 El jugador recibe notificación de retroalimentación", async () => {
  const res = await api().get("/api/notifications").set(auth("player"));
  const types = res.body.map((n) => n.type);
  assert.ok(types.includes("tip"));
  assert.ok(types.includes("feedback"));
});

test("CP-30 Tabla de clasificación por grupo", async () => {
  const res = await api().get("/api/leaderboard").set(auth("player"));
  assert.equal(res.body.group, "liga-a");
  assert.equal(res.body.ranking[0].username, "laura");
});

test("CP-31 Entrenamiento: iniciar, registrar intentos y finalizar", async () => {
  const start = await api().post("/api/training/start").set(auth("player")).send({ type: "spare" });
  assert.equal(start.status, 201);
  const id = start.body._id;
  await api().post(`/api/training/${id}/attempt`).set(auth("player")).send({ successful: true });
  await api().post(`/api/training/${id}/attempt`).set(auth("player")).send({ successful: false });
  const end = await api().post(`/api/training/${id}/finish`).set(auth("player"));
  assert.equal(end.body.status, "completed");
  assert.equal(end.body.accuracy, 50);
});
