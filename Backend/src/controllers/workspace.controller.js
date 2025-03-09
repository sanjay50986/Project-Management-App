import { HTTPSTATUS } from "../config/http.config.js";
import { Permissions } from "../enums/role.enum.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { getMemberRoleInWorkspace } from "../services/memeber.service.js";
import {
    createWorkspaceService,
    getAllWorkspaceUserIsMemberService,
    getWorkspaceAnalyticsService,
    getWorkspaceByIdService,
    changeMemberRoleService
} from "../services/workspace.service.js";
import { roleGuard } from "../utils/roleGuard.js";
import { changeRoleSchema, updateWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation.js";



export const createWorkspaceController = asyncHandler(
    async (req, res) => {
        const body = createWorkspaceService(userId, body);

        const userId = req.user?._id;
        const { workspace } = await createWorkspaceService(userId, body);
        return res.status(HTTPSTATUS.CREATED).json({
            message: "Workspace created successfully",
            workspace
        });
    }
);

export const getAllWorkspaceUserIsMemberController = asyncHandler(
    async (req, res) => {
        const userId = req.user?._id;
        const { workspaces } = await getAllWorkspaceUserIsMemberService(userId)

        return res.status(HTTPSTATUS.OK).json({
            message: "User workspaces fetched successfully",
            workspaces
        })

    }
)

export const getWorkspaceByIdController = asyncHandler(
    async (req, res) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        await getMemberRoleInWorkspace(userId, workspaceId);

        const { workspace } = await getWorkspaceByIdService(workspaceId)

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace fetched successfully",
            workspace
        })
    }
)

export const getWorkspaceMembersController = asyncHandler(
    async (req, res) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { members, roles } = await getWorkspaceMembersService(workspaceId)

        return res.status(HTTPSTATUS.OK).json({
            members: 'Workspace members retrieved successfully',
            members,
            roles
        })
    }
)


export const getWorkspaceAnalyticsController = asyncHandler(
    async (req, res) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { analytics } = await getWorkspaceAnalyticsService(workspaceId)

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace analytics retrived successfully",
            analytics
        });
    }
);

export const changeWorkspaceMemberRoleContoller = asyncHandler => {
    async (req, res) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const { memberId, roleId } = changeRoleSchema.parse(req.body);

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

        const { memeber } = await changeMemberRoleService(
            workspaceId,
            memberId,
            roleId
        )

        return res.status(HTTPSTATUS.OK).json({
            message: "Member role changed successfully",
            memeber
        })
    }
}

export const updateWorkspaceByIdController = asyncHandler(
    async (req, res) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const { name, description } = updateWorkspaceSchema.parse(req.body);

        const userId = req.user?._id;

        const { role } = getMemberRoleInWorkspace(userId, workspaceId)
        roleGuard(role, [Permissions.EDIT_WORKSPACE])

        const { workspace } = await updateWorkspaceByIdService(
            workspaceId,
            name,
            description
        )

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace updated successfully",
            workspace
        });

    }
)