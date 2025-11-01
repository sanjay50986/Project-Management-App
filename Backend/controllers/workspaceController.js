import prisma from "../configs/prisma.js";

// Get All Workspaces for a User
export const getWorkspaces = async (req, res) => { 
    try {
        const {userId} = await req.auth();
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: { some: {userId: userId}}
            },
            include: {
                members: {include: {user: true}},
                projects: {
                    include: {
                        tasks: {include: {assignee: true, comments: {include: {user: true}}}},
                        members: {include: {user: true}},
                    }
                },

                owner: true,
            }
        });

        res.json({workspaces})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}


// Add member to workspace

export const addMember = async (req, res) => {
    try {
       const {userId} = await req.auth();
        const {email, role, workspaceId, message} = req.body;

        const user = await prisma.user.findUnique({
            where: {email: email}
        });

        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        if(!workspaceId || !role) {
            return res.status(400).json({message: 'Missing required fields'});
        }

        if(!["ADMIN", "MEMBER"].includes(role)) {
            return res.status(400).json({message: 'Invalid role'});
        }

        const workspace = await prisma.workspace.findUnique({
            where: {id: workspaceId},
            include: {members: true}
        });

        if(!workspace) {
            return res.status(404).json({message: 'Workspace not found'});
        }

        if(!workspace.members.find((member) => member.userId === userId && member.role === 'ADMIN')) {
            return res.status(403).json({message: 'You do not have admin privileges'});
        }

        const existingMember = workspace.members.find((member) => member.userId === userId)
        if(existingMember) {
            return res.status(400).json({message: 'User is already a member of the workspace'});
        }

        const member = await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId,
                role,
                message
            }
        });

        res.status(201).json({member, message: 'Member added successfully'});

    } catch (error) {

        console.log(error)
        res.status(500).json({message: error.message})
    }
 }

