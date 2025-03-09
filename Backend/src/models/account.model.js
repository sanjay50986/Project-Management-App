import mongoose, { Schema } from 'mongoose'

const accountSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        provider: {
            type: String,
            required: true,
            unique: true
        },

        providerId: {
            type: String,
            required: true,
            unique: true
        },
        refreshToken: {
            type: String,
            default: null
        },

        tokenExpiry: {
            type: Date,
            default: null
        },
    },

    {
        timestamps:true,
        toJSON: {
            transform(doc, ret) {
                delete ret.refreshToken
            },
        },
    }

);


const AccountModel = mongoose.model("Account", accountSchema)

export default AccountModel;
