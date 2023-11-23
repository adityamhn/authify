import mongoose from "mongoose";
const Schema = mongoose.Schema;


export interface LogDoc extends mongoose.Document {
  projectId: mongoose.Types.ObjectId;
  tenantKey: string;
  userKey: string;
  timestamp: number;
  resourceKey: string;
  action: string;
  decision: "denied" | "allowed";
  metadata: any;
  reason: string;
}

const LogSchema = new Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  tenantKey: {
    type: String,
    required: true,
  },
  userKey: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  resourceKey: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  decision: {
    type: String,
    required: true,
    enum: ["denied", "allowed"],
  },
  metadata: {
    type: Object,
    default: {},
  },
  reason: {
    type: String,
    default: "",
  },
});

export default mongoose.model<LogDoc>("Log", LogSchema);
