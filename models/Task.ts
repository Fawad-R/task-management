import mongoose from "mongoose"

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: false,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: false,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Task || mongoose.model("Task", TaskSchema)
