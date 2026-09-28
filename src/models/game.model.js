import mongoose from "mongoose";

const frameSchema = new mongoose.Schema(
    {
        frame: Number,
        rolls: [Number],
        type: { type: String, enum: ["strike", "spare", "open"] },
        score: Number,
        cumulative: Number
    },
    { _id: false }
);

const gameSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        date: { type: Date, default: Date.now },
        place: { type: String, trim: true, default: "" },
        frames: { type: [frameSchema], required: true },
        total: { type: Number, required: true },
        strikes: { type: Number, default: 0 },
        spares: { type: Number, default: 0 },
        pins: { type: Number, default: 0 },
        strikePercentage: { type: Number, default: 0 },
        sparePercentage: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
