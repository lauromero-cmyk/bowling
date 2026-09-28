import mongoose from "mongoose";
import bcrypt from "bcrypt";

const lessonResultSchema = new mongoose.Schema(
    {
        lessonId: { type: String, required: true },
        score: { type: Number, required: true },
        passed: { type: Boolean, required: true },
        date: { type: Date, default: Date.now }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    // jugador | entrenador | admin
    role: {
        type: String,
        enum: ["jugador", "entrenador", "admin"],
        default: "jugador"
    },

    // Nivel actual del jugador. Solo avanza al aprobar todas las lecciones del nivel.
    level: {
        type: String,
        enum: ["principiante", "intermedio", "avanzado"],
        default: "principiante"
    },

    // Grupo o liga. El entrenador solo ve jugadores de su mismo grupo.
    group: {
        type: String,
        trim: true,
        default: "general"
    },

    style: {
        type: String,
        default: "Derecho"
    },

    lessonResults: {
        type: [lessonResultSchema],
        default: []
    }
}, { timestamps: true });

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Datos públicos (sin contraseña)
userSchema.methods.toPublic = function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        level: this.level,
        group: this.group,
        style: this.style
    };
};

export default mongoose.model("User", userSchema);
