import { Router } from 'express';
import {
    createWorkspaceController,
    getAllWorkspaceUserIsMemberController,
    getWorkspaceByIdController,
    getWorkspaceMembersController,
    getWorkspaceAnalyticsController,
    changeWorkspaceMemberRoleContoller,
    updateWorkspaceByIdController
}
    from '../controllers/workspace.controller.js';

const workspaceRouter = Router();

workspaceRouter.post("/create/new", createWorkspaceController)
workspaceRouter.put("/update/:id", updateWorkspaceByIdController)
workspaceRouter.put("/change/member/role/:id", changeWorkspaceMemberRoleContoller)

workspaceRouter.get("/all", getAllWorkspaceUserIsMemberController);
workspaceRouter.get("/:id", getWorkspaceByIdController)
workspaceRouter.get("members/:id", getWorkspaceMembersController)
workspaceRouter.get("analytics/:id", getWorkspaceAnalyticsController)


export default workspaceRouter;