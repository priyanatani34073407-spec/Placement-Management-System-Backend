import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    studentName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    phone:{
        type:String,
        required:true,
        minlength:10,
        maxlength:10
    },
    branch:{
        type:String,
        required:true,
        enum:["CSE","CSM","CSE-AI","CIVIL","DS"]
    },
    cgpa:{
        type:Number,
        required:true,
        min:0,
        max:10
    }
},{
    timestamps:true
});
//Model:represents a Mongodb collection
//and used to perform CRUD operations

const Student = mongoose.model(
    "Student",
    studentSchema
);
export default Student;
