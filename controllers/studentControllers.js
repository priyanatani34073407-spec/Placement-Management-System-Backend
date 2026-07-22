import Student from "../models/Student.js";

// ======================
// Get All Students
// ======================
export async function getStudents(req, res) {
  try {
    const sortField =req.query.sort ||"studentName";
    const order = req.query.order || "asc";
    const sortOrder = order === "asc"?1: -1;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const totalStudents = await Student.countDocuments();

    const students = await Student.find()
      .skip(skip)
      .limit(limit)
      .sort({
          [sortField]:sortOrder
      });

    res.status(200).json({
      success: true,
      students,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalStudents / limit),
        totalStudents,
        limit,
        hasNextPage: page < Math.ceil(totalStudents / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Get Student By ID
// ======================
export async function getStudentsById(req, res) {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            student,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// ======================
// Add Student
// ======================
export async function addStudent(req, res) {
    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            success: true,
            message: "Student Registered Successfully",
            student,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// ======================
// Update Student
// ======================
export async function updateStudent(req, res) {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student Updated Successfully",
            student,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// ======================
// Delete Student
// ======================
export async function deleteStudent(req, res) {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const searchStudents = async (req, res) => {
  try {
    const search = req.query.q || "";

    const students = await Student.find({
      $or: [
        { studentName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { branch: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
