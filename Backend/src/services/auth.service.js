import mongoose from 'mongoose';
import UserModel from '../models/user.model.js'
import AccountModel from '../models/account.model.js'
import WorkspaceModel from '../models/workspace.model.js'
import RoleModel from '../models/roles-permission.model.js'
import { BadRequestException, NotFoundException, UnauthorizedException } from '../utils/appError.js';
import MemberModel from '../models/member.model.js';
import { ProviderEnum } from '../enums/account.provider.enum.js'



export const loginOrCreateAccountService = async (data) => {
    const { providerId, provider, displayName, email, picture } = data;

    const session = await mongoose.startSession();
    try {

        session.startTransaction();
        let user = await UserModel.findOne({ email })

        console.log("Started Session.....");

        if (!user) {
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture || null,
            });

            await user.save({ session });

            const account = new AccountModel({
                userId: user._id,
                provider: provider,
                providerId: providerId,
            });

            await account.save({ session });

            const workSpace = new WorkspaceModel({
                name: "My Workspace",
                description: ` Workspace created at ${user.name}`
            });

            await workSpace.save({ session });

            const ownerRole = await RoleModel.findOne({
                name: Roles.OWNER,
            }).session(session);

            if (!ownerRole) {
                throw new NotFoundException("Owner role not found")
            }

            const member = MemberModel({
                userId: user._id,
                workspaceId: workSpace._id,
                role: ownerRole._id,
                joinedAt: new Date()
            })

            await member.save({ session });

            user.currentWorkspace = workSpace._id
        }

        await session.commitTransaction();
        session.endSession()
        console.log("End Session.....");

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;

    } finally {
        session.endSession();
    }
}


export const registerUserService = async (body) => {
    const { email, name, password } = body;
    const session = await mongoose.startSession();
    session.startTransaction()

    try {
        const existingUser = await UserModel.findOne({ email }).session(session);

        if (existingUser) {
            throw new BadRequestException("Email already exists")
        }
        const user = new UserModel({
            email,
            name,
            password,
        });

        await user.save({ session });


        const account = new AccountModel({
            userId: user._id,
            provider: ProviderEnum.EMAIL,
            providerId: email
        });

        await account.save({ session })

        const workSpace = new WorkspaceModel({
            name: "My Workspace",
            description: ` Workspace created at ${user.name}`
        });

        await workSpace.save({ session });

        const ownerRole = await RoleModel.findOne({
            name: Roles.OWNER,
        }).session(session);

        if (!ownerRole) {
            throw new NotFoundException("Owner role not found")
        }

        const member = MemberModel({
            userId: user._id,
            workspaceId: workSpace._id,
            role: ownerRole._id,
            joinedAt: new Date()
        })

        await member.save({ session });
        user.currentWorkspace = workSpace._id;

        await session.commitTransaction();
        session.endSession()
        console.log("End Session.....");

        return {
            userId: user._id,
            workspaceId: workSpace._id,

        }

    } catch (error) {

        await session.abortTransaction();
        session.endSession()
        throw error;
    }
}

export const verifyUserService = async ({ email, password, provider = ProviderEnum.EMAIL }) => {
    const account = await AccountModel.findOne({ provider, providerId: email })

    if (!account) {
        throw new NotFoundException("Invalid email or password");
    }

    const user = await UserModel.findById(account.userId);

    if (!user) {
        throw new NotFoundException("User not fount for the given account")
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch) {
        throw new UnauthorizedException("Invalid email or password");
    }


    return user.omitPassword();
}