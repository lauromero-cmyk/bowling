import 'dotenv/config';

import app from './app.js';
import { connectDB } from './db.js';
import { seedLessons } from './controllers/lesson.controller.js';

await connectDB();
await seedLessons().catch((error) => console.log("No se pudieron cargar las lecciones:", error.message));

app.listen(3000);
console.log("puerto 3000 funcional", 3000);
