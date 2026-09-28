// Contenido base de la plataforma: lecciones, retos y glosario.
// En producción el administrador lo gestiona desde la base de datos;
// para el prototipo se carga desde aquí (y se usa como semilla).

export const LEVELS = ["principiante", "intermedio", "avanzado"];

// Calificación mínima (sobre 100) para aprobar una evaluación.
export const MIN_SCORE = 70;

export const LESSONS = [
  {
    id: "postura",
    level: "principiante",
    order: 1,
    title: "Postura y alineación corporal",
    summary: "La base de todo lanzamiento: cómo pararte y alinear tu cuerpo con el objetivo.",
    video: "https://www.youtube.com/results?search_query=bowling+stance+for+beginners",
    steps: [
      "Párate a unos 4 o 5 pasos de la línea de falta, de frente a los pines.",
      "Pies juntos o ligeramente separados, rodillas un poco flexionadas.",
      "Hombros cuadrados hacia el objetivo (las flechas de la pista).",
      "Sostén la bola a la altura de la cintura con la mano de apoyo debajo.",
      "Mantén la mirada en las flechas, no en los pines.",
    ],
    quiz: [
      { q: "¿Hacia dónde debes mirar al iniciar el lanzamiento?", options: ["Los pines", "Las flechas de la pista", "El suelo junto a tus pies"], answer: 1 },
      { q: "¿Cómo deben estar las rodillas en la postura inicial?", options: ["Totalmente rectas", "Ligeramente flexionadas", "Muy dobladas"], answer: 1 },
      { q: "¿Cómo deben quedar los hombros?", options: ["Cuadrados hacia el objetivo", "Girados hacia la izquierda", "Inclinados hacia atrás"], answer: 0 },
    ],
  },
  {
    id: "agarre",
    level: "principiante",
    order: 2,
    title: "Tipos de agarre del balón",
    summary: "Agarre convencional, fingertip y semi-fingertip: cuándo usar cada uno.",
    video: "https://www.youtube.com/results?search_query=bowling+ball+grip+types",
    steps: [
      "Convencional: dedos medio y anular entran hasta la segunda falange. Ideal para empezar.",
      "Fingertip: los dedos entran solo hasta la primera falange. Da más efecto (rotación).",
      "Semi-fingertip: punto medio entre ambos.",
      "El pulgar entra completo y sale primero al soltar la bola.",
      "La bola no debe quedar ni muy suelta ni apretada.",
    ],
    quiz: [
      { q: "¿Qué agarre se recomienda para principiantes?", options: ["Fingertip", "Convencional", "Sin pulgar"], answer: 1 },
      { q: "¿Qué dedo sale primero al soltar la bola?", options: ["El pulgar", "El medio", "El anular"], answer: 0 },
      { q: "¿Qué agarre genera más rotación?", options: ["Convencional", "Fingertip", "Ninguno"], answer: 1 },
    ],
  },
  {
    id: "aproximacion",
    level: "principiante",
    order: 3,
    title: "Técnica de aproximación y lanzamiento",
    summary: "La aproximación de 4 pasos y la suelta de la bola.",
    video: "https://www.youtube.com/results?search_query=bowling+4+step+approach",
    steps: [
      "Paso 1: empuja la bola hacia adelante mientras das el primer paso con el pie de la mano que lanza.",
      "Paso 2: la bola baja y comienza el péndulo hacia atrás.",
      "Paso 3: la bola llega al punto más alto del backswing.",
      "Paso 4: deslízate con el pie contrario mientras la bola baja y la sueltas junto al tobillo.",
      "Termina con el brazo extendido hacia el objetivo (follow-through).",
    ],
    quiz: [
      { q: "¿Cuántos pasos tiene la aproximación clásica?", options: ["2", "4", "6"], answer: 1 },
      { q: "¿Qué es el follow-through?", options: ["Extender el brazo hacia el objetivo tras soltar", "Correr después del lanzamiento", "Soltar la bola antes"], answer: 0 },
      { q: "¿Dónde se suelta la bola?", options: ["Junto al tobillo del pie que desliza", "A la altura del hombro", "Detrás del cuerpo"], answer: 0 },
    ],
  },
  {
    id: "tipos-lanzamiento",
    level: "intermedio",
    order: 1,
    title: "Tipos de lanzamiento: recto, curvo y gancho",
    summary: "Cómo la rotación de la mano cambia la trayectoria de la bola.",
    video: "https://www.youtube.com/results?search_query=bowling+straight+vs+hook",
    steps: [
      "Recto: la mano detrás de la bola, sin rotación. Es el más fácil de controlar.",
      "Curvo: una rotación suave produce una curva amplia y constante.",
      "Gancho (hook): la mano gira al soltar y la bola cambia de dirección al final de la pista.",
      "El gancho entra al bolsillo (pines 1-3 para diestros) con mejor ángulo.",
      "Practica primero el recto hasta ser consistente.",
    ],
    quiz: [
      { q: "¿Cuál es el lanzamiento más fácil de controlar?", options: ["Gancho", "Recto", "Curvo"], answer: 1 },
      { q: "¿Qué pines forman el bolsillo para un diestro?", options: ["1 y 3", "7 y 10", "2 y 8"], answer: 0 },
      { q: "¿Qué produce el gancho?", options: ["La rotación de la mano al soltar", "Lanzar más fuerte", "Usar una bola más pesada"], answer: 0 },
    ],
  },
  {
    id: "lectura-pista",
    level: "intermedio",
    order: 2,
    title: "Lectura de la pista y posicionamiento",
    summary: "Aceite, flechas y ajustes de posición.",
    video: "https://www.youtube.com/results?search_query=bowling+lane+oil+pattern",
    steps: [
      "La pista tiene aceite en la parte delantera: ahí la bola patina.",
      "Donde termina el aceite, la bola engancha y cambia de dirección.",
      "Usa las 7 flechas como referencia; la central es la número 4.",
      "Regla 3-1: mueve los pies 3 tablas y el objetivo 1 tabla en la misma dirección.",
      "Observa dónde golpea tu bola y ajusta en el siguiente frame.",
    ],
    quiz: [
      { q: "¿Qué pasa con la bola en la zona con aceite?", options: ["Patina", "Engancha", "Se detiene"], answer: 0 },
      { q: "¿Cuántas flechas hay en la pista?", options: ["5", "7", "10"], answer: 1 },
      { q: "En la regla 3-1, ¿cuánto mueves los pies?", options: ["1 tabla", "3 tablas", "7 tablas"], answer: 1 },
    ],
  },
  {
    id: "spare",
    level: "avanzado",
    order: 1,
    title: "Estrategias para pines difíciles (spare)",
    summary: "Sistemas para convertir spares y splits.",
    video: "https://www.youtube.com/results?search_query=bowling+spare+shooting+system",
    steps: [
      "Para pines a la derecha, lanza desde la izquierda de la pista (y viceversa): lanzamiento cruzado.",
      "Para spares usa un tiro recto: reduce el efecto del aceite.",
      "Sistema 3-6-9: por cada pin hacia un lado, mueve los pies 3 tablas en dirección contraria.",
      "En un split (ej. 7-10), prioriza asegurar un pin si el split es muy difícil.",
      "Practica los pines 7 y 10, los más comunes de fallar.",
    ],
    quiz: [
      { q: "¿Desde dónde lanzas para derribar el pin 10 (diestro)?", options: ["Desde la izquierda de la pista", "Desde la derecha", "Desde el centro"], answer: 0 },
      { q: "¿Qué tipo de tiro se recomienda para spares?", options: ["Gancho fuerte", "Recto", "Muy lento"], answer: 1 },
      { q: "¿Qué es un split?", options: ["Pines separados con un hueco entre ellos", "Un strike doble", "Una falta"], answer: 0 },
    ],
  },
];

// Retos: la condición se valida contra el historial de partidas del jugador.
// metric: nombre de la estadística; target: valor a alcanzar.
export const CHALLENGES = [
  { id: "primer-strike", title: "Primer strike", description: "Consigue tu primer strike en una partida.", metric: "maxStrikesInGame", target: 1, badge: "⚡" },
  { id: "primer-spare", title: "Primer spare", description: "Convierte un spare en una partida.", metric: "maxSparesInGame", target: 1, badge: "🎯" },
  { id: "100-puntos", title: "Club de los 100", description: "Alcanza 100 puntos en una partida.", metric: "bestScore", target: 100, badge: "💯" },
  { id: "150-puntos", title: "Jugador sólido", description: "Alcanza 150 puntos en una partida.", metric: "bestScore", target: 150, badge: "🏅" },
  { id: "turkey", title: "Turkey", description: "Consigue 3 strikes seguidos.", metric: "maxStrikeStreak", target: 3, badge: "🦃" },
  { id: "constancia", title: "Constancia", description: "Registra 5 partidas.", metric: "gamesPlayed", target: 5, badge: "📅" },
  { id: "200-puntos", title: "Nivel pro", description: "Alcanza 200 puntos en una partida.", metric: "bestScore", target: 200, badge: "🏆" },
  { id: "perfecto", title: "Juego perfecto", description: "Consigue 300 puntos.", metric: "bestScore", target: 300, badge: "👑" },
];

export const GLOSSARY = [
  { term: "Strike", definition: "Derribar los 10 pines con el primer lanzamiento del frame. Vale 10 más los dos lanzamientos siguientes. Se marca con X." },
  { term: "Spare", definition: "Derribar los 10 pines usando los dos lanzamientos del frame. Vale 10 más el siguiente lanzamiento. Se marca con /." },
  { term: "Split", definition: "Pines que quedan en pie separados, sin el pin delantero entre ellos (ej. 7-10)." },
  { term: "Gutter (canal)", definition: "Bola que cae al canal lateral. Vale 0 pines. Se marca con -." },
  { term: "Frame", definition: "Cada una de las 10 entradas de una partida. Hasta 2 lanzamientos (3 en el décimo frame)." },
  { term: "Perfect game", definition: "Partida perfecta: 12 strikes seguidos, 300 puntos." },
  { term: "Turkey", definition: "Tres strikes consecutivos." },
  { term: "Bolsillo (pocket)", definition: "Espacio entre los pines 1 y 3 (diestros) o 1 y 2 (zurdos), el mejor punto de impacto para un strike." },
  { term: "Línea de falta", definition: "Línea que separa la zona de aproximación de la pista. Pisarla anula el lanzamiento." },
  { term: "Gancho (hook)", definition: "Lanzamiento con rotación que curva la bola al final de la pista." },
  { term: "Open frame", definition: "Frame en el que no se derriban los 10 pines." },
];

export const RULES = [
  "Una partida tiene 10 frames. En cada frame el jugador tiene hasta dos lanzamientos para derribar los 10 pines.",
  "Strike: 10 pines en el primer lanzamiento. Suma 10 más los pines de los dos lanzamientos siguientes.",
  "Spare: 10 pines con los dos lanzamientos. Suma 10 más los pines del siguiente lanzamiento.",
  "Frame abierto: suma solo los pines derribados.",
  "En el décimo frame, un strike o un spare otorga lanzamientos extra (hasta 3 en total) para completar la bonificación.",
  "El puntaje máximo es 300 (12 strikes seguidos).",
  "Pisar o cruzar la línea de falta anula el lanzamiento (cuenta 0 pines).",
];

export const DAILY_TIPS = [
  "Mira las flechas, no los pines.",
  "Una buena postura vale más que la fuerza.",
  "Para spares, tira recto y cruzado.",
  "Termina siempre con el brazo apuntando al objetivo.",
  "Respira y mantén el mismo ritmo en cada aproximación.",
  "Si fallas a la derecha, mueve los pies a la derecha (regla 3-1).",
  "Registra cada partida: lo que se mide, mejora.",
];
