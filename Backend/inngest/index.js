import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "project-management" });

const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
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
    {id: 'sync-user-from-clerk'},
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
    {id: 'sync-user-from-clerk'},
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


export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];