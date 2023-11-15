import mongoose from "mongoose";
import { roleAndResourceRegex } from "../../utils/constants";
const Schema = mongoose.Schema;

export interface TenantDoc extends mongoose.Document {
  projectId: mongoose.Types.ObjectId;
  tenantName: string;
  tenantKey: string;
  description: string;
  type: "custom" | "global";
  createdAt: Date;
}

const TenantSchema = new Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  tenantName: {
    type: String,
    required: true,
  },
  tenantKey: {
    type: String,
    required: true,
    // Tenant can only be text, numbers, underscores and dashes
    match: roleAndResourceRegex,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: ["custom", "global"],
    default: "custom",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<TenantDoc>("Tenant", TenantSchema);
