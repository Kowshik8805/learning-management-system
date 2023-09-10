const express = require("express");
const dotenv = require("dotenv").config();
const oracledb = require("oracledb");
const app = express();
const port = process.env.PORT || 3000;

// Output from the database will be in Object form
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
app.use(express.static("public"));
app.use(express.urlencoded());
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
    await connection.commit();
    await connection.close();
    return data;
};

// Page Navigation
app.get("/api",async(req,res)=>{
    res.sendFile("./homepage/homepage.html",{root: __dirname});
});
app.get("/api/login/student",async(req,res)=>{
    res.sendFile("./login/student_login.html",{root: __dirname});
});
app.get("/api/login/teacher",async(req,res)=>{
    res.sendFile("./login/teacher_login.html",{root: __dirname});
});
app.get("/api/signup",async(req,res)=>{
    res.sendFile("./signup/signup_home.html",{root: __dirname});
});
app.get("/api/signup/student",async(req,res)=>{
    res.sendFile("./signup/student_signup.html",{root: __dirname});
});
app.get("/api/signup/teacher",async(req,res)=>{
    res.sendFile("./signup/teacher_signup.html",{root: __dirname});
});
app.get("/api/student/dashboard", async(req,res)=>{
    res.sendFile("./student/student_dashboard.html",{root: __dirname});
});
app.get("/api/student/profile", async(req,res)=>{
    res.sendFile("./student/student_profile.html",{root: __dirname});
});
app.get("/api/teacher/dashboard", async(req,res)=>{
    res.sendFile("./teacher/teacher_dashboard.html",{root: __dirname});
});
app.get("/api/teacher/profile", async(req,res)=>{
    res.sendFile("./teacher/teacher_profile.html",{root: __dirname});
});


// Functional Work
// For student verification in login page
app.post("/api/login/student", async(req,res)=>{
    const studentID = req.body.studentID;
    const password = req.body.password;
    if(!studentID  || !password ){
        res.json({success: false, message:"Student ID or Password missing"});
    }
    else{
        const data = await run(
            `SELECT *
            FROM STUDENTS
            WHERE ID =${studentID} AND PASSWORD = '${password}'`
        );
        if(data.rows.length === 0){
            res.json({success: false, message:"Incorrect Student ID or Password"})
        }
        else{
            res.status(200).json({success: true, message:"Successfully Logged in!\nWelcome"});
        }    
    }   
});

// For teacher verification in login page
app.post("/api/login/teacher", async(req,res)=>{
    const teacherID = req.body.teacherID;
    const password = req.body.password;
    if( !teacherID|| !password){
        res.json({success: false, message:"Teacher ID or Password missing"});
    }
    else{
        const data = await run(
            `SELECT *
            FROM TEACHERS
            WHERE ID =${teacherID} AND PASSWORD = '${password}'`
        );
        if(data.rows.length === 0){
            res.json({success: false, message:"Incorrect Teacher ID or Password"})
        }
        else{
            res.status(200).json({success: true, message:"Successfully Logged in!\nWelcome"});
        }    
    }   
});


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
    const data = await run(
    `SELECT * 
    FROM STUDENTS 
    WHERE ID = ${studentID}`);
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

// UPDATING

// Gets the specific student with the student id
app.get("/api/student/:studentID", async(req,res)=>{
    const studentID = req.params.studentID;
    if(studentID === undefined){
        res.status(400);
        throw new Error("Student id missing");
    }
    const data = await run(
    `SELECT * 
    FROM STUDENTS
    WHERE ID = ${studentID}`
    );
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});

// Gets all the courses of a apecific student
app.get("/api/student/:studentID/courses", async(req,res)=>{
    const studentID = req.params.studentID;
    if(studentID === undefined){
        res.status(400);
        throw new Error("Student id missing");
    }
    const data = await run(
    `SELECT C.ID, C.TITLE, T.FULL_NAME
    FROM ENROLLMENTS E JOIN COURSES C
    ON E.COURSE_ID = C.ID
    JOIN TEACHERS T
    ON C.TEACHER_ID = T.ID
    WHERE E.STUDENT_ID = ${studentID}`
    );

    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);

});

// Gets a specific course of a specific student
app.get("/api/student/:studentID/courses/:courseID",async(req,res)=>{
    const studentID = req.params.studentID;
    const courseID = req.params.courseID;
    if(studentID === undefined || courseID === undefined){
        res.status(400);
        throw new Error("Student id or course id missing");
    }
    const data = await run(
        `SELECT C.ID, C.TITLE, T.FULL_NAME, E.ENROLLMENT_DATE
        FROM ENROLLMENTS E JOIN COURSES C
        ON E.COURSE_ID = C.ID
        JOIN TEACHERS T
        ON C.TEACHER_ID = T.ID
        WHERE E.STUDENT_ID = ${studentID} AND COURSE_ID = '${courseID}'`
        );
    
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});

// Gets all the assignments of a specific course of a specific student
app.get("/api/student/:studentID/courses/:courseID/assignments", async(req,res)=>{
    const studentID = req.params.studentID;
    const courseID = req.params.courseID;
    if(!studentID || !courseID){
        res.status(400);
        throw new Error("Student id or course id missing");
    }
    const data = await run(
        `SELECT A.ID, A.TITLE, A.DESCRIPTION,A.DEADLINE
        FROM ASSIGNMENTS A JOIN ENROLLMENTS E
        ON A.COURSE_ID = E.COURSE_ID
        WHERE E.STUDENT_ID =${studentID} AND A.COURSE_ID= '${courseID}'`
        );
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});

// Gets a specific assignment of a specific course of a specific student
app.get("/api/student/:studentID/courses/:courseID/assignments/:assignmentID", async(req,res)=>{
    const studentID = req.params.studentID;
    const courseID = req.params.courseID;
    const assignmentID = req.params.assignmentID
    if(!studentID || !courseID || !assignmentID){
        res.status(400);
        throw new Error("Student id or course id or assignment id missing");
    }
    const data = await run(
        `SELECT A.ID, A.TITLE, A.DESCRIPTION,A.DEADLINE
        FROM ASSIGNMENTS A JOIN ENROLLMENTS E
        ON A.COURSE_ID = E.COURSE_ID
        WHERE E.STUDENT_ID =${studentID} AND A.COURSE_ID= '${courseID}' AND A.ID = '${assignmentID}'`
        );
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});

// Adds submission(a path) to a specific assignment 
app.post("/api/student/:studentID/courses/:courseID/assignments/:assignmentID/submission/:path", async(req,res)=>{
    const studentID = req.params.studentID;
    const courseID = req.params.courseID;
    const assignmentID = req.params.assignmentID;
    const path = req.params.path;
    if(!studentID || !courseID || !assignmentID || !path){
        res.status(400);
        throw new Error("Student id or course id or assignment id or path missing!!!");
    }
    await run(`INSERT INTO SUBMISSIONS (STUDENT_ID,COURSE_ID,TIME,PATH)
    VALUES(${studentID}, '${courseID}',SYSDATE, '${path}')`);
    res.status(201);
});

// Registers a new student
app.post("/api/signup/student", async(req,res)=>{
    const studentID = req.body.studentID;
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;

    if(!studentID || !password || !name || !email){
        res.json({success: false, message:"All fields are necessary"});
    }
    else{
        const data = await run(
            `SELECT * 
            FROM STUDENTS
            WHERE ID = ${studentID}`
        );
        if(data.rows.length === 0){
            await run(`INSERT INTO STUDENTS (ID,PASSWORD,FULL_NAME,EMAIL) 
            VALUES(${studentID},'${password}','${name}','${email}')`);
            res.json({success: true, message:"Signup successful \nYou can login now"});
        }
        else{
            res.json({success:false, message:"Student with the given student id already exists"});
        }
    }
});

// Gets a specific teacher with a teacher id 
app.get("/api/teacher/:teacherID", async(req,res)=>{
    const teacherID = req.params.teacherID;
    if(!teacherID){
        res.status(400);
        throw new Error("Teacher id missing!!!");
    }
    const data = await run(
        `SELECT * 
        FROM TEACHERS
        WHERE ID = ${teacherID}`
    );
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});

// Gets all the courses of a specific teacher
app.get("/api/teacher/:teacherID/courses", async(req,res)=>{
    const teacherID = req.params.teacherID;
    if(!teacherID){
        res.status(400);
        throw new Error("Teacher id missing!!!");
    }
    const data = await run(
        `SELECT ID,TITLE,SELECTION_DATE 
        FROM COURSES
        WHERE TEACHER_ID = ${teacherID}`
    );
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});

// Gets a specific course of a specific teacher
app.get("/api/teacher/:teacherID/courses/:courseID", async(req,res)=>{
    const teacherID = req.params.teacherID;
    const courseID = req.params.courseID;
    if(!teacherID || !courseID){
        res.status(400);
        throw new Error("Teacher id or Course id missing!!!");
    }
    const data = await run(
        `SELECT ID,TITLE,SELECTION_DATE 
        FROM COURSES
        WHERE TEACHER_ID = ${teacherID} AND ID ='${courseID}'`
    );
    if(data === undefined){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});

// app.get("/api/teacher/:teacherID/getDept", async(req,res)=>{
//     const teacherID = req.params.teacherID;
//     const data = await run(
//         `SELECT * 
//         FROM TEACHERS
//         WHERE ID = ${teacherID}`
//     );
//     const deptID = data.rows[0].DEPT_ID;
//     res.json(deptID);
// })

// Adds a course
app.post("/api/teacher/:teacherID/addCourse/:courseID/:courseTitle", async(req,res)=>{
    const teacherID = req.params.teacherID;
    const courseID = req.params.courseID;
    const courseTitle = req.params.courseTitle;
    if(!teacherID || !courseID){
        res.status(400);
        throw new Error("Teacher id or course id missing");
    }
    const data = await run(
        `SELECT *
        FROM TEACHERS
        WHERE ID = ${teacherID}`
    )
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    const deptID = data.rows[0].DEPT_ID;
    await run(`INSERT INTO COURSES (ID,TITLE,DEPT_ID,TEACHER_ID,SELECTION_DATE)
    VALUES('${courseID}','${courseTitle}',${deptID},${teacherID},SYSDATE)`);
    res.status(201);
});

// Gets a specific course of a specific teacher 
app.get("/api/teacher/:teacherID/courses/:courseID", async(req,res)=>{
    const teacherID = req.params.teacherID;
    const courseID = req.params.courseID;
    if(!teacherID || !courseID){
        res.status(400);
        throw new Error("Teacher id or course id missing!!!");
    }
    const data = await run(
        `SELECT ID,TITLE,SELECTION_DATE 
        FROM COURSES
        WHERE TEACHER_ID = ${teacherID} AND ID = '${courseID}'`
    );
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});

// Gets all the assignments of a specific course of a specific teacher 
app.get("/api/teacher/:teacherID/courses/:courseID/assignments", async(req,res)=>{
    const teacherID = req.params.teacherID;
    const courseID = req.params.courseID;
    if(!teacherID || !courseID){
        res.status(400);
        throw new Error("Student id or course id missing!!!");
    }
    const data = await run(
        `SELECT *
        FROM ASSIGNMENTS
        WHERE COURSE_ID = '${courseID}'`
    );
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});

// Gets a specific assignment of a specific course of a specific teacher 
app.get("/api/teacher/:teacherID/courses/:courseID/assignments/:assignmentID", async(req,res)=>{
    const teacherID = req.params.teacherID;
    const courseID = req.params.courseID;
    const assignmentID = req.params.assignmentID;
    if(!teacherID || !courseID || !assignmentID){
        res.status(400);
        throw new Error("Student id or course id or assignment id missing!!!");
    }
    const data = await run(
        `SELECT *
        FROM ASSIGNMENTS
        WHERE COURSE_ID = '${courseID}' AND ID = '${assignmentID}'`
    );
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database"); 
    }
    res.status(200).json(data.rows);
});

// Adds an assignment
app.post("/api/:courseID/:assignmentID/:assignmentTitle/:deadline/:description", async(req,res)=>{
    const courseID = req.params.courseID;
    const assignmentID = req.params.assignmentID;
    const assignmentTitle = req.params.assignmentTitle;
    const deadline = req.params.deadline;
    const description = req.params.description;
    if( !courseID || !assignmentID || !assignmentTitle || !deadline){
        res.status(400);
        throw new Error("Course id or assignment id or title or deadline missing!!!");
    }
    if(description){
        await run(`INSERT INTO ASSIGNMENTS(ID,TITLE,DESCRIPTION,DEADLINE,COURSE_ID)
         VALUES('${assignmentID}','${assignmentTitle}'),'${description}','${deadline}','${courseID}' `);
    }
    else{
        await run(`INSERT INTO ASSIGNMENTS(ID,TITLE,DEADLINE,COURSE_ID)
         VALUES('${assignmentID}','${assignmentTitle}'),'${deadline}','${courseID}' `);
    }
    res.status(201);
});

// Deletes an assignment -- To be added 

// Gets all the submissions of a specific assignment
app.get("/api/teacher/:teacherID/courses/:courseID/assignments/:assignmentID/submissions", async(req,res)=>{
    const teacherID = req.params.teacherID;
    const courseID = req.params.courseID;
    const assignmentID = req.params.assignmentID;
    if(!teacherID || !courseID || !assignmentID){
        res.status(400);
        throw new Error("Student id or course id or assignment id missing!!!");
    }
    const data = await run(
        `SELECT STUDENT_ID,TIME,PATH 
        FROM SUBMISSIONS 
        WHERE ASSIGNMENT_ID = '${assignmentID}'`
    );
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");   
    }
    res.status(200).json(data.rows);
});

// Registers a new teacher
app.post("/api/signup/teacher", async(req,res)=>{
    const teacherID = req.body.teacherID;
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    const designation = req.body.designation;
    const deptID = req.body.deptID;

    if(!teacherID || !password || !name || !email || !designation || !deptID){
        res.json({success: false, message:"All fields are necessary"});
    }
    else{
        const data = await run(
            `SELECT * 
            FROM TEACHERS
            WHERE ID = ${teacherID}`
        );
        if(data.rows.length === 0){
            await run(`INSERT INTO TEACHERS (ID,PASSWORD,FULL_NAME,EMAIL,DESIGNATION,DEPT_ID) 
            VALUES(${teacherID},'${password}','${name}','${email}','${designation}','${deptID}')`);
            res.json({success: true, message:"Signup successful \nYou can login now"});
        }
        else{
            res.json({success:false, message:"Teacher with the given teacher id already exists"});
        }
    }
});