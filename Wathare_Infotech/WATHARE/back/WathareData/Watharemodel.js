import mongoose from "mongoose";
const DataSchema=mongoose.Schema(
{
    ts:{
        type:Date,
        required:true,
    },
    machine_status:{
        type:Number,
        required:true,
    },
    vibration:{
        type:Number,
        required:true,
    },
}
);

export const Data = mongoose.model('Data', DataSchema, 'Wathare_Data');
