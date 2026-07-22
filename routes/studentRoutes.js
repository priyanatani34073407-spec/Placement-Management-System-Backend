import express from "express";
import {
    getStudents,
    getStudentsById,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents
} from "../controllers/studentControllers.js";


// router object
const router = express.Router();

//searching route
router.get("/search" ,searchStudents);

//get all the students
router.get("/",getStudents);

//getStudents by id
router.get("/:id",getStudentsById)

//post adding a student
router.post("/",addStudent);

//put updating a student
router.put("/:id",updateStudent);

//delete a student
router.delete("/:id",deleteStudent);


export default router;
