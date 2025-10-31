import { Inngest } from "inngest";
import prisma from '../configs/prisma.js';

export const inngest = new Inngest({ id: "project-management" });

const syncUserCreation = inngest.createFunction(
    {id: 'project-management-clerk-user-created'},
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const {data} = event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + ' ' + data?.last_name,
                image: data?.image_url,
            }
        })
    }
)

const syncUserDeletion = inngest.createFunction(
    {id: 'project-management-clerk-user-deleted'},
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const {data} = event
        await prisma.user.delete({
            where: {
                id: data.id,
            }
        })
    }
)


const syncUserUpdation = inngest.createFunction(
    {id: 'project-management-clerk-user-updated'},
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const {data} = event
        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + ' ' + data?.last_name,
                image: data?.image_url,
            }
        })
    }
)

// Ingest function to save workspace data to a database
const syncWorkspaceCreation = inngest.createFunction(
    {id: 'project-management-clerk-workspace-created'},
    { event: 'clerk/organization.created' },
    async ({ event }) => {
        const {data} = event
        await prisma.workspace.create({
            data: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                ownerId: data.created_by,
                image_url: data.image_url,
            }
        })

        // Add Creator as Admin Member
        await prisma.workspaceMember.create({
            data: {
                userId: data.created_by,
                workspaceId: data.id,
                role: 'ADMIN',
            }
        })
    }   
)

// Inngest Function to update workspace data in the database
const syncWorkspaceUpdation = inngest.createFunction(
    {id: 'project-management-clerk-workspace-updated'},
    { event: 'clerk/organization.updated' },
    async ({ event }) => {
        const {data} = event
        await prisma.workspace.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,    
                slug: data.slug,
                image_url: data.image_url,
            }
        })
    }
)

// Inngest Function to delete workspace data from the database
const syncWorkspaceDeletion = inngest.createFunction(
    {id: 'project-management-clerk-workspace-deleted'},
    { event: 'clerk/organization.deleted' },
    async ({ event }) => {
        const {data} = event        
        await prisma.workspace.delete({
            where: {
                id: data.id,
            },
        })
    }
)

// Inngest function to save workspace member data to a database
const syncWorkspaceMemberCreation = inngest.createFunction(
    {id: 'project-management-clerk-organization-member-created'},
    { event: 'clerk/organizationInvitation.accepted' },
    async ({ event }) => {
        const {data} = event
        await prisma.workspaceMember.create({
            data: {
                userId: data.user_id,
                workspaceId: data.organization_id,
                role: String(data.role_name).toUpperCase(),
            }
        })      
    }
)


export const functions = [
    syncUserCreation, 
    syncUserDeletion, 
    syncUserUpdation,
    syncWorkspaceCreation,
    syncWorkspaceUpdation,
    syncWorkspaceDeletion,
    syncWorkspaceMemberCreation
];