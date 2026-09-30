import  mongoose,{ Schema } from "mongoose";

const subscriptionschema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one who is subscribing he must be a user
        ref:"User"
    },
    channel: {
        type: Schema.Types.ObjectId, // to whom we are subscribing he must be a user as well 
        ref:"User"
    }
},{timestamps: true});

export const subscription = mongoose.model("Subscription",subscriptionschema);