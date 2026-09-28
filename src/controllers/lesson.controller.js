import Lesson from "../models/lesson.model.js";
import User from "../models/user.model.js";
import { LESSONS, LEVELS, MIN_SCORE } from "../libs/content.js";

// Carga las lecciones base si la colección está vacía
export const seedLessons = async () => {
    const count = await Lesson.countDocuments();
    if (count === 0) {
        await Lesson.insertMany(LESSONS.map(({ id, ...rest }) => ({ slug: id, ...rest })));
        console.log(">>> Lecciones base cargadas");
    }
};

const levelIndex = (level) => LEVELS.indexOf(level);

// Una lección está bloqueada si su nivel es superior al nivel actual del jugador
const isLocked = (lesson, user) =>
    user.role === "jugador" && levelIndex(lesson.level) > levelIndex(user.level);

const lessonView = (lesson, user, withQuizAnswers = false) => {
    const result = user.lessonResults.find((r) => r.lessonId === lesson.slug);
    return {
        id: lesson.slug,
        level: lesson.level,
        order: lesson.order,
        title: lesson.title,
        summary: lesson.summary,
        video: lesson.video,
        steps: lesson.steps,
        quiz: lesson.quiz.map((q) => (withQuizAnswers ? q : { q: q.q, options: q.options })),
        locked: isLocked(lesson, user),
        passed: Boolean(result?.passed),
        bestScore: result?.score ?? null
    };
};

export const getLessons = async (req, res) => {
    const user = await User.findById(req.user.id);
    const lessons = await Lesson.find().sort({ order: 1 });
    const sorted = lessons.sort((a, b) => levelIndex(a.level) - levelIndex(b.level) || a.order - b.order);

    res.json({
        level: user.level,
        minScore: MIN_SCORE,
        lessons: sorted.map((l) => {
            const v = lessonView(l, user, user.role === "admin");
            // en el listado no se envía el contenido completo
            return { ...v, steps: undefined, quiz: user.role === "admin" ? v.quiz : undefined };
        })
    });
};

export const getLesson = async (req, res) => {
    const user = await User.findById(req.user.id);
    const lesson = await Lesson.findOne({ slug: req.params.id });

    if (!lesson) return res.status(404).json({ message: "Lección no encontrada" });

    if (isLocked(lesson, user)) {
        return res.status(403).json({ message: "Debes completar el nivel anterior para acceder a esta lección" });
    }

    res.json(lessonView(lesson, user, user.role === "admin"));
};

// Califica la evaluación y aplica la regla de avance de nivel
export const submitQuiz = async (req, res) => {
    const user = await User.findById(req.user.id);
    const lesson = await Lesson.findOne({ slug: req.params.id });

    if (!lesson) return res.status(404).json({ message: "Lección no encontrada" });
    if (isLocked(lesson, user)) {
        return res.status(403).json({ message: "Lección bloqueada" });
    }

    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length !== lesson.quiz.length) {
        return res.status(400).json({ message: "Debes responder todas las preguntas" });
    }

    const correct = lesson.quiz.filter((q, i) => q.answer === answers[i]).length;
    const score = Math.round((correct / lesson.quiz.length) * 100);
    const passed = score >= MIN_SCORE;

    const previous = user.lessonResults.find((r) => r.lessonId === lesson.slug);
    if (!previous) {
        user.lessonResults.push({ lessonId: lesson.slug, score, passed });
    } else if (score > previous.score) {
        previous.score = score;
        previous.passed = previous.passed || passed;
        previous.date = new Date();
    }

    // Regla de negocio: sube de nivel solo si aprobó TODAS las lecciones del nivel actual
    let levelUp = false;
    const levelLessons = await Lesson.find({ level: user.level });
    const allPassed = levelLessons.every((l) =>
        user.lessonResults.some((r) => r.lessonId === l.slug && r.passed)
    );
    const next = LEVELS[levelIndex(user.level) + 1];

    if (allPassed && next) {
        user.level = next;
        levelUp = true;
    }

    await user.save();

    res.json({
        score,
        correct,
        total: lesson.quiz.length,
        passed,
        minScore: MIN_SCORE,
        level: user.level,
        levelUp,
        corrections: lesson.quiz.map((q, i) => ({ correct: q.answer === answers[i], answer: q.answer }))
    });
};

// ---- Administración de contenido (solo admin) ----

export const createLesson = async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body);
        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ message: "Datos de lección inválidos" });
    }
};

export const updateLesson = async (req, res) => {
    const lesson = await Lesson.findOneAndUpdate({ slug: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });
    if (!lesson) return res.status(404).json({ message: "Lección no encontrada" });
    res.json(lesson);
};

export const deleteLesson = async (req, res) => {
    const lesson = await Lesson.findOneAndDelete({ slug: req.params.id });
    if (!lesson) return res.status(404).json({ message: "Lección no encontrada" });
    res.json({ message: "Lección eliminada" });
};
