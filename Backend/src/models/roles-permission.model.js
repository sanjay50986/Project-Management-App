import mongoose, {Schema} from 'mongoose'
import { Roles, Permissions } from '../enums/role.enum.js'
import { RolePermissions } from '../utils/role-permission.js'

const roleSchema = new Schema(
    {
        name: {
            type: String,
            enum: Object.values(Roles),
            required: true,
            unique: true
        },

        permission: {
            type: [String],
            enum: Object.values(Permissions),
            required: true,
            default: function() {
                return RolePermissions;
            },
        },
    },

    {
        timestamps: true
    }
);

const RoleModel = mongoose.model("Role", roleSchema);

export default RoleModel;