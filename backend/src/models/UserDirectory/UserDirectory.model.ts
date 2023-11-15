import mongoose from "mongoose";
import { roleAndResourceRegex } from "../../utils/constants";
const Schema = mongoose.Schema;

export interface UserDirectoryDoc extends mongoose.Document {
  projectId: mongoose.Types.ObjectId;
  userName: string;
  userKey: string;
  email: string;
  tenantId: mongoose.Types.ObjectId;
  roleAssigned?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const UserDirectorySchema = new Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userKey: {
    type: String,
    required: true,
    // resource can only be text, numbers, underscores and dashes
    match: roleAndResourceRegex,
  },
  email: {
    type: String,
    required: true,
  },
  roleAssigned: {
    type: mongoose.Types.ObjectId,
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

export default mongoose.model<UserDirectoryDoc>(
  "UserDirectory",
  UserDirectorySchema
);
