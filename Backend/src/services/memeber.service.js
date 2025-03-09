import { ErrorCodeEnum } from "../enums/error-code.enum.js";
import MemberModel from "../models/member.model.js";
import WorkspaceModel from "../models/workspace.model.js"
import RoleModel from '../models/roles-permission.model.js'
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/appError.js"
import { Roles } from "../enums/role.enum.js";

export const getMemberRoleInWorkspace = async (userId, workspaceId) => {
    const workspace = await WorkspaceModel.findById(workspaceId)

    if(!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    const memeber = await MemberModel.findOne({
        userId,
        workspaceId
    }).populate("role")

    if(!memeber) {
        throw new UnauthorizedException("You are not a member of this workspace ", ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }

    const roleName = memeber.role?.name;

    return {role: roleName}
}

export const joinWorkspaceByInviteService = async(workspaceId, inviteCode) => {
    const workspace = await WorkspaceModel.findOne({inviteCode})

    if(!workspace) {
        throw new NotFoundException("Invalid invite code or workspace")
    }

    const existingMember = await MemberModel.findOne({
        userId,
        workspaceId: workspace._id
    }).exec();

    if(existingMember) {
        throw new BadRequestException("you are already a member of this workspace")
    }

    const role = await RoleModel.findOne({
        name: Roles.MEMBER
    });

    if(!role) {
        throw new NotFoundException("Role not found")
    }

    const newMember = new MemberModel({
        userId,
        workspaceId: workspace._id,
        role: role._id
    })

    await newMember.save()

    return {workspaceId: workspace._id, role: role.name}
}

