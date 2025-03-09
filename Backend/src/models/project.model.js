import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
       name: {
        type: String,
        required: true,
        trim: true
       },

       emoji: {
        type: String,
        required: false,
        trim: true,
        default: true
       },

       description: {
        type: String,
        required: false
       },

       workspace: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
       },

       createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
       }
    },

    {
        timestamps:true
    }
)


const ProjectModel = mongoose.model("Project", projectSchema)

export default ProjectModel;