import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
    videoFile:{
        type: String,
        required: true
    },
    thumbnails: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    duration:{
        type: Number,
        default: 0
    },
    owner: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    isPublished:{
        type: Boolean,
        default: false
    },
}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)