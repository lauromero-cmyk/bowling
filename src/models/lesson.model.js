import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        q: { type: String, required: true },
        options: { type: [String], required: true },
        answer: { type: Number, required: true }
    },
    { _id: false }
);

const lessonSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true },
        level: { type: String, enum: ["principiante", "intermedio", "avanzado"], required: true },
        order: { type: Number, default: 1 },
        title: { type: String, required: true },
        summary: { type: String, default: "" },
        video: { type: String, default: "" },
        steps: { type: [String], default: [] },
        quiz: { type: [questionSchema], default: [] }
    },
    { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
