import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface ProjectMembersDoc {
  email: string;
  role: "owner" | "admin" | "member";
  addedOn: Date;
}

export interface TenantsDoc {
  tenantId: mongoose.Types.ObjectId;
  type: "custom" | "global";
}

export interface ApiKeyDoc {
  key: string;
  createdAt: Date;
  identifier: string;
}

export interface ProjectDoc extends mongoose.Document {
  projectName: string;
  projectKey: string;
  projectMembers: ProjectMembersDoc[];
  createdAt: Date;
  tenants: TenantsDoc[];
  apiKeys: ApiKeyDoc[];
}

const ProjectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectKey: {
    type: String,
    required: true,
    unique: true,
  },
  projectMembers: [
    {
      email: {
        type: String,
        required: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,20})+$/,
      },
      role: {
        type: String,
        required: true,
        enum: ["owner", "admin", "member"],
        default: "member",
      },
      addedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  tenants: [
    {
      tenantId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      type: {
        type: String,
        required: true,
        enum: ["custom", "global"],
        default: "custom",
      },
    },
  ],
  apiKeys: [
    {
      key: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      identifier: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ProjectDoc>("Project", ProjectSchema);
