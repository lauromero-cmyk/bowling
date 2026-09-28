import mongoose from "mongoose";

// Mensaje entre jugador y entrenador, o observación de sesión del entrenador.
const feedbackSchema = new mongoose.Schema(
    {
        player: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, default: "" },
        authorRole: { type: String, default: "jugador" },
        kind: { type: String, enum: ["mensaje", "observacion"], default: "mensaje" },
        text: { type: String, required: true, trim: true },
        read: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
