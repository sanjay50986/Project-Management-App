import {asyncHandler} from '../middlewares/asyncHandler.middleware.js'
import {HTTPSTATUS} from '../config/http.config.js'
import { joinWorkspaceByInviteService } from '../services/memeber.service.js';


export const joinWorkspaceController = asyncHandler(
    async(req, res) => {
        const inviteCode = z.string().parse(req.params.inviteCode);
        const userId = req.req.user?._id;

        const {workspaceId, role} = await joinWorkspaceByInviteService(
            userId,
            inviteCode
        );
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Successfully joined the workspace",
            workspaceId,
            role
        })
    }
)