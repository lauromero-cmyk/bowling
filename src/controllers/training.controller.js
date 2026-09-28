import TrainingSession from "../models/trainingSession.model.js";

export const startTraining = async (req, res) => {
  try {
    const { type } = req.body;

    const validTypes = [
      "precision",
      "velocidad",
      "spare",
      "strike"
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "Tipo de entrenamiento inválido"
      });
    }

    const activeSession = await TrainingSession.findOne({
      user: req.user.id,
      status: "in_progress"
    });

    if (activeSession && activeSession.type === type) {
      return res.json(activeSession);
    }

    // Si quedó abierta una sesión de otro tipo, se cierra antes de iniciar la nueva
    if (activeSession) {
      activeSession.status = "completed";
      activeSession.completedAt = new Date();
      await activeSession.save();
    }

    const session = await TrainingSession.create({
      user: req.user.id,
      type,
      status: "in_progress",
      startedAt: new Date()
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al iniciar el entrenamiento"
    });
  }
};

export const addAttempt = async (req, res) => {
  try {
    const { successful, note } = req.body;

    if (typeof successful !== "boolean") {
      return res.status(400).json({
        message: "El resultado del lanzamiento es obligatorio"
      });
    }

    const session = await TrainingSession.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: "in_progress"
    });

    if (!session) {
      return res.status(404).json({
        message: "Sesión de entrenamiento no encontrada"
      });
    }

    const number = session.attempts.length + 1;

    session.attempts.push({
      number,
      successful,
      note: note || ""
    });

    session.totalAttempts = session.attempts.length;

    session.successfulAttempts =
      session.attempts.filter(
        attempt => attempt.successful
      ).length;

    session.accuracy =
      session.totalAttempts > 0
        ? Number(
            (
              (session.successfulAttempts /
                session.totalAttempts) *
              100
            ).toFixed(2)
          )
        : 0;

    await session.save();

    res.json(session);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al registrar el lanzamiento"
    });
  }
};

export const finishTraining = async (req, res) => {
  try {
    const session = await TrainingSession.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: "in_progress"
    });

    if (!session) {
      return res.status(404).json({
        message: "Sesión de entrenamiento no encontrada"
      });
    }

    const completedAt = new Date();

    const duration = Math.max(
      0,
      Math.floor(
        (completedAt.getTime() -
          new Date(session.startedAt).getTime()) /
          1000
      )
    );

    session.status = "completed";
    session.completedAt = completedAt;
    session.duration = duration;

    session.totalAttempts = session.attempts.length;

    session.successfulAttempts =
      session.attempts.filter(
        attempt => attempt.successful
      ).length;

    session.accuracy =
      session.totalAttempts > 0
        ? Number(
            (
              (session.successfulAttempts /
                session.totalAttempts) *
              100
            ).toFixed(2)
          )
        : 0;

    await session.save();

    res.json(session);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al finalizar el entrenamiento"
    });
  }
};

export const getTrainingHistory = async (req, res) => {
  try {
    const sessions = await TrainingSession.find({
      user: req.user.id,
      status: "completed"
    })
      .sort({ completedAt: -1 })
      .limit(50);

    res.json(sessions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener el historial"
    });
  }
};

export const getTrainingStats = async (req, res) => {
  try {
    const sessions = await TrainingSession.find({
      user: req.user.id,
      status: "completed"
    }).sort({ completedAt: 1 });

    const totalTrainings = sessions.length;

    const totalAttempts = sessions.reduce(
      (total, session) =>
        total + session.totalAttempts,
      0
    );

    const totalSuccessful = sessions.reduce(
      (total, session) =>
        total + session.successfulAttempts,
      0
    );

    const averageAccuracy =
      totalAttempts > 0
        ? Number(
            (
              (totalSuccessful /
                totalAttempts) *
              100
            ).toFixed(2)
          )
        : 0;

    const byType = {
      precision: 0,
      velocidad: 0,
      spare: 0,
      strike: 0
    };

    sessions.forEach(session => {
      if (byType[session.type] !== undefined) {
        byType[session.type]++;
      }
    });

    const evolution = sessions.map(
      (session, index) => ({
        session: index + 1,
        type: session.type,
        accuracy: session.accuracy,
        attempts: session.totalAttempts,
        date: session.completedAt
      })
    );

    res.json({
      totalTrainings,
      totalAttempts,
      totalSuccessful,
      averageAccuracy,
      byType,
      evolution,
      recentSessions: sessions
        .slice(-5)
        .reverse()
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las estadísticas"
    });
  }
};