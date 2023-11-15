import mongoose from "mongoose";
import { roleAndResourceRegex } from "../../utils/constants";
const Schema = mongoose.Schema;

export interface resourcesAttachedDoc {
  resourceId: mongoose.Types.ObjectId;
  actions: string[];
}

export interface RoleDoc extends mongoose.Document {
  projectId: mongoose.Types.ObjectId;
  roleName: string;
  roleKey: string;
  description: string;
  tenantId: mongoose.Types.ObjectId;
  resourcesAttached: resourcesAttachedDoc[];
  createdAt: Date;
}

const RoleSchema = new Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  roleName: {
    type: String,
    required: true,
  },
  roleKey: {
    type: String,
    required: true,
    // resource can only be text, numbers, underscores and dashes
    match: roleAndResourceRegex,
  },
  description: {
    type: String,
  },
  resourcesAttached: {
    type: [
      {
        resourceId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        actions: {
          type: [String],
          required: true,
        },
      },
    ],
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

export default mongoose.model<RoleDoc>("Role", RoleSchema);
