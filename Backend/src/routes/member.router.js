import {Router} from 'express'
import { joinWorkspaceController } from '../controllers/member.controller.js'

const memberRouter = Router()

memberRouter.post("/workspace/:inviteCode/join", joinWorkspaceController)


export default memberRouter;