import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        });

        res.json(tasks);

    } catch (error) {
        console.error(error);
        
        return res.status(500).json({
            message: "Error al obtener las tareas"
        });
    }
};


export const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Tarea no encontrada"
            });
        }

        res.json(task);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener la tarea"
        });
    }
};


export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const newTask = new Task({
            title,
            description,
            user: req.user.id
        });

        const savedTask = await newTask.save();

        res.json(savedTask);

    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la tarea"
        });
    }
};


export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            {
                new: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Tarea no encontrada"
            });
        }

        res.json(task);

    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar la tarea"
        });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Tarea no encontrada"
            });
        }

        res.json({
            message: "Tarea eliminada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar la tarea"
        });
    }
};