import 'dotenv/config';

import app from './app.js';
import {connectDB} from './db.js';

connectDB();
app.listen(3000)
console.log("puerto 3000 funcional",3000);
