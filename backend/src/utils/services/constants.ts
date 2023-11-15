import mongoose from "mongoose";
import TenantModel from "../../models/Tenant/Tenant.model";

export const getGlobalTenant = async (projectId: mongoose.Types.ObjectId) => {
  try {
    const globalTenant = await TenantModel.findOne({
      projectId,
      type: "global",
    });

    if (!globalTenant) {
      throw new Error("Global tenant not found!");
    }

    return globalTenant;

  } catch (err : any) {
    throw new Error(err);
  }
};
