import { Roles } from "../enums/role.enum.js";
import MemberModel from "../models/member.model.js";
import RoleModel from "../models/roles-permission.model.js";
import UserModel from "../models/user.model.js";
import WorkspaceModel from "../models/workspace.model.js";
import { NotFoundException } from "../utils/appError.js";
import TaskModel from '../models/task.model.js'
import { TaskStatusEnum } from "../enums/task.enum.js";

export const createWorkspaceService = async (userId, body) => {
    const { name, description } = body;

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new NotFoundException("User not found");
    }

    const owenerRole = await RoleModel.findOne({
        name: Roles.OWNER
    });

    if (!owenerRole) {
        throw new NotFoundException("Owner role not found")
    }

    const workspace = new WorkspaceModel({
        name: name,
        description: description,
        owner: user._id
    });

    await workspace.save();

    const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: owenerRole._id,
        joinedAt: new Date()
    })

    await member.save();

    user.currentWorkspace = workspace._id;

    await user.save()

    return {
        workspace
    }


}

export const getAllWorkspaceUserIsMemberService = async (userId) => {
    const memberships = await MemberModel.find({ userId })
        .populate("workspaceId")
        .select("-password")
        .exec();

    const workspaces = memberships.map((membership) => membership.workspaceId)

    return { workspaces }
}

export const getWorkspaceByIdService = async (workspaceId) => {
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    const memebers = await MemberModel.find({
        workspaceId
    }).populate("role");

    const workspcaeWithMembers = {
        ...workspace.toObject(),
        memebers
    }

    return {
        workspace: workspcaeWithMembers
    };
};

export const getWorkspaceMembersService = async (workspaceId) => {
    const members = await MemberModel.find({
        workspaceId
    }).populate("userId", "name email profilePicture -password")
        .populate("role", "name")

    const roles = await RoleModel.find({}, { name: 1, _id: 1 })
        .select("permission").
        lean();

    return { members, roles }
}

export const getWorkspaceAnalyticsService = async (workspaceId) => {
    const currentDate = new Date();

    const totalTasks = await TaskModel.countDocuments({
        workspace: workspaceId,

    })

    const overdueTasks = await TaskModel.countDocuments({
        workspace: workspaceId,
        dueDate: { $lt: currentDate },
        status: { $ne: TaskStatusEnum.DONE }
    });

    const completedTasks = await TaskModel.countDocuments({
        workspace: workspaceId,
        status: TaskStatusEnum.DONE
    })

    const analytics = {
        totalTasks,
        overdueTasks,
        completedTasks
    }

    return { analytics }
}

export const changeMemberRoleService = async (workspaceId,
    memberId,
    roleId) => {
        const workspace = await WorkspaceModel.findById(workspaceId);

        if(!workspace) {
            throw new NotFoundException("workspace not found")
        }

        const role = await RoleModel.findById(roleId);

        if(!role) {
            throw new NotFoundException("Role not found");
        }

        const member = await MemberModel.findOne({
            userId: memberId,
            workspaceId: workspaceId
        })

        if(!member) {
            throw new Error ("Member not found in the workspace")
        }

        member.role = role;

        await member.save()
        return {
            member,
            
        }
}


export const updateWorkspaceByIdService = async(workspaceId, name, description) => {
    const workspace = await WorkspaceModel.findById(workspaceId)

    if(!workspace) {
        throw new NotFoundException("Workspace not found")
    }

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;

    await workspace.save();

    return {
        workspace,
    }
}