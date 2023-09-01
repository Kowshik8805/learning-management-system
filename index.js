const express = require("express");
const dotenv = require("dotenv").config();
const oracledb = require("oracledb");
const app = express();
const port = process.env.PORT || 3000;

// Output from the database will be in Object form
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
app.use(express.static("public"));
app.use(express.json());
app.listen(port,()=>{
    console.log(`Server running on port : ${port}`);
});

// Function used to run the queries
async function run(query){
    const connection = await oracledb.getConnection({
        user: "PROJECT",
        password: "test",
        connectionString: "localhost/orclpdb"
    });
    console.log(`Database connected!!!`);
    const data = await connection.execute(query);
    await connection.close();
    return data;
};

app.get("/api/students", async(req,res)=>{
    const data = await run(`SELECT * FROM STUDENTS`);
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database!");
    }
    res.status(200).json(data.rows);    
});
app.get("/api/students/:studentID", async(req,res)=>{
    const studentID = req.params.studentID;
    if(studentID === undefined){
        res.status(400);
        throw new Error("Student id missing!!!");
    }
    const data = await run(`SELECT * FROM STUDENTS WHERE ID = ${studentID}`);
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database!");
    }
    res.status(200).json(data.rows);
});

app.get("/api/teachers",async(req,res)=>{
    const data = await run(`SELECT * FROM TEACHERS`);
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database!");
    }
    res.status(200).json(data.rows);
});
app.get("/api/teachers/:teacherID", async(req,res)=>{
    const teacherID = req.params.teacherID;
    if(teacherID === undefined){
        res.status(400);
        throw new Error("Teacher id missing!!!");
    }
    const data = await run(`SELECT * FROM TEACHERS WHERE ID = ${teacherID}`);
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database!");
    }
    res.status(200).json(data.rows);
});

app.get("/api/courses", async(req,res)=>{
    const data = await run(`SELECT * FROM COURSES`);
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database!");
    }
    res.status(200).send(data.rows);
});
app.get("/api/courses/:courseID", async(req,res)=>{
    const courseID = req.params.courseID;
    if(courseID === undefined){
        res.status(400);
        throw new Error("Course id missing!!!");
    }
    const data = await run(`SELECT * FROM COURSES WHERE ID = '${courseID}'`);
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database!");
    }
    res.status(200).json(data.rows);
});

app.get("/api/results", async(req,res)=>{
    const studentID = req.query.student_id;
    const courseID = req.query.course_id;
    if(studentID === undefined || courseID === undefined){
        res.status(400);
        throw new Error("Student id or course id missing!!!");
    }
    const data = await run(`SELECT * FROM RESULTS WHERE STUDENT_ID = ${studentID} AND COURSE_ID = '${courseID}'`);
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database!");
    }
    res.status(200).json(data.rows);
});

app.get("/api/assignments/:courseID", async(req,res)=>{
    const courseID = req.params.courseID;
    if(courseID === undefined){
        res.status(400);
        throw new Error("Course id missing!!!");
    }
    const data = await run(`SELECT * FROM ASSIGNMENTS WHERE COURSE_ID = '${courseID}'`);
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database!");
    }
    res.status(200).json(data.rows);
});

app.get("/api/submissions/:assignmentID", async(req,res)=>{
    const assignmentID = req.params.assignmentID;
    if(assignmentID === undefined){
        res.status(400);
        throw new Error("Assignment id missing!!!");
    }
    const data = await run(`SELECT * FROM SUBMISSIONS WHERE ASSIGNMENT_ID = '${assignmentID}'`);
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database!");
    }
    res.status(200).json(data.rows);
});

