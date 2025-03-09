import { Router } from "express";
import { createProjectController, 
    getAllProjectsInWorkspaceController, 
    getProjectByIdAndWorkspaceIdController, 
    getProjectAnalyticsController, 
    updateProjectController,
deleteProjectController } from "../controllers/project.controller.js";
const projectRouter = Router()



projectRouter.post("/workspace/:workspaceId/create", createProjectController )
projectRouter.put("/:id/workspsace/:workspaceId/update", updateProjectController)
projectRouter.delete("/:id/workspsace/:workspaceId/delete", deleteProjectController)
projectRouter.get("/workspace/:workspaceId/all", getAllProjectsInWorkspaceController)
projectRouter.get("/:id/workspace/:worspaceId/analytics", getProjectAnalyticsController )
projectRouter.get("/:id/workspace/:worspaceId", getProjectByIdAndWorkspaceIdController)


export default projectRouter