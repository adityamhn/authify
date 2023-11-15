import mongoose from "mongoose";
import { roleAndResourceRegex } from "../../utils/constants";
const Schema = mongoose.Schema;

export interface ResourceDoc extends mongoose.Document {
  projectId: mongoose.Types.ObjectId;
  resourceName: string;
  resourceKey: string;
  description: string;
  actions: string[];
  tenantId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ResourceSchema = new Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  resourceName: {
    type: String,
    required: true,
  },
  resourceKey: {
    type: String,
    required: true,
    match: roleAndResourceRegex,
  },
  description: {
    type: String,
  },
  actions: {
    type: [String],
    default: [],
  },
  tenantId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ResourceDoc>("Resource", ResourceSchema);
