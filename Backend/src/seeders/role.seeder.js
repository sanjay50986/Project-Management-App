import mongoose from "mongoose";
import 'dotenv/config'
import connectDatabase from '../config/database.config.js'
import RoleModel from '../models/roles-permission.model.js'
import { RolePermissions } from "../utils/role-permission.js";

const seedRoles = async () => {
    console.log("Seeding roles started...");

    try {

        await connectDatabase()
        const session = await mongoose.startSession();
        session.startTransaction();
        console.log("Clearing existing roles....");
        await RoleModel.deleteMany({}, { session })

        for (const roleName in RolePermissions) {
            const role = roleName;
            const permission = RolePermissions[role];

            const existingRole = await RoleModel.findOne({ name: role }).session(
                session
            );

            if (!existingRole) {
                const newRole = new RoleModel({
                    name: role,
                    permission: permission,
                });

                await newRole.save({ session });
                console.log(`Role ${role} added with permission.`);
                
            } else {
                console.log(`Role ${role} already exists.`);
            }
        }

        await session.commitTransaction();
        console.log("Transaction committed.");

        session.endSession();
        console.log("Session ended.");

        console.log("Seeding completed Successfully");
    
    } catch (error) {
        console.log("Error during seeding", error);
        
    }
}


seedRoles().catch((error) => {
    console.log("Error running seed script", error);
    
})