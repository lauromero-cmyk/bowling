import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true
    },

    successful: {
      type: Boolean,
      required: true
    },

    note: {
      type: String,
      trim: true,
      default: ""
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const trainingSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: [
        "precision",
        "velocidad",
        "spare",
        "strike"
      ],
      required: true
    },

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress"
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    completedAt: {
      type: Date,
      default: null
    },

    duration: {
      type: Number,
      default: 0
    },

    attempts: {
      type: [attemptSchema],
      default: []
    },

    totalAttempts: {
      type: Number,
      default: 0
    },

    successfulAttempts: {
      type: Number,
      default: 0
    },

    accuracy: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "TrainingSession",
  trainingSessionSchema
);