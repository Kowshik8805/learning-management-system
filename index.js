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
    console.log(`url= http://localhost:${port}/api`);
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
app.get("/api/student/course",async(req,res)=>{
    res.sendFile("./course/coursepage_student.html",{root: __dirname});
});
app.get("/api/student/submission",async(req,res)=>{
    res.sendFile("/submission/submission_student.html",{root: __dirname});
});

app.get("/api/teacher/course",async(req,res)=>{
    res.sendFile("./course/coursepage_teacher.html", {root: __dirname});
});

app.get("/api/submissions",async(req,res)=>{
    res.sendFile("./submission/submission_teacher.html",{root: __dirname});
});
app.get("/api/createCourse",async(req,res)=>{
    res.sendFile("./course/createCourse.html",{root: __dirname});
});
app.get("/api/takeCourse",async(req,res)=>{
    res.sendFile("./course/takeCourse.html",{root: __dirname});
});
app.get("/api/courseEnrollment",async(req,res)=>{
    res.sendFile("./course/courseEnrollment.html",{root: __dirname});
});
app.get("/api/addAssignment", async(req,res)=>{
    res.sendFile("./course/addAssignment.html",{root: __dirname});
});
app.get("/api/editAssignment",async(req,res)=>{
    res.sendFile("./course/editAssignment.html",{root: __dirname});
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

// // Gets submission of an assignment
// app.get("/api/submissions/:assignmentID", async(req,res)=>{
//     const assignmentID = req.params.assignmentID;
//     if(assignmentID === undefined){
//         res.status(400);
//         throw new Error("Assignment id missing!!!");
//     }
//     const data = await run(
//         `SELECT * 
//         FROM SUBMISSIONS 
//         WHERE ASSIGNMENT_ID = '${assignmentID}'`);
//     if(data === undefined){
//         res.status(404);
//         throw new Error("Error fetching data from database!");
//     }
//     res.status(200).json(data.rows);
// });

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
    `SELECT C.ID, C.TITLE,T.ID, T.FULL_NAME
    FROM ENROLLMENTS E JOIN COURSES C
    ON E.COURSE_ID = C.ID
    JOIN TEACHERS T
    ON C.TEACHER_ID = T.ID
    WHERE E.STUDENT_ID = ${studentID} AND E.DROP_DATE IS NULL 
    ORDER BY C.ID ASC`
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
        `SELECT C.ID, C.TITLE,T.ID, T.FULL_NAME, TO_CHAR(E.ENROLLMENT_DATE, 'HH12:MI:SS am, DD Month, YYYY')
        FROM ENROLLMENTS E JOIN COURSES C
        ON E.COURSE_ID = C.ID
        JOIN TEACHERS T
        ON C.TEACHER_ID = T.ID
        WHERE E.STUDENT_ID = ${studentID} AND COURSE_ID = '${courseID}' AND E.DROP_DATE IS NULL`
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
        `SELECT A.ID, A.TITLE, A.DESCRIPTION,TO_CHAR(A.DEADLINE,'HH12:MI:SS am, DD Month, YYYY')
        FROM ASSIGNMENTS A JOIN ENROLLMENTS E
        ON A.COURSE_ID = E.COURSE_ID
        WHERE E.STUDENT_ID =${studentID} AND A.COURSE_ID= '${courseID}'
        ORDER BY A.ID ASC`
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
        `SELECT A.ID, A.TITLE, A.DESCRIPTION,TO_CHAR(A.DEADLINE,'HH12:MI:SS am, DD Month, YYYY')
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

app.get("/api/checkSubmission/:studentID/:assignmentID", async(req,res)=>{
    const studentID = req.params.studentID;
    const assignmentID = req.params.assignmentID;
    if(!studentID || !assignmentID){
        res.status(400);
        throw new Error("Student id or Assignment id missing");
    }
    const data = await run(
        `SELECT *
        FROM SUBMISSIONS
        WHERE STUDENT_ID = ${studentID} AND ASSIGNMENT_ID = '${assignmentID}'`);
    if(data.rows.length === 0){
        res.json({found: false});
    }
    else{
        res.json({found: true});
    }
});

// Adds submission(a path) of a specific assignment and specific student 
app.post("/api/student/submission", async(req,res)=>{
    const studentID = req.body.studentID;
    const courseID = req.body.courseID;
    const assignmentID = req.body.assignmentID;
    const path = req.body.path;
    console.log(req.body);
    if(!studentID || !courseID || !assignmentID){
        res.status(400);
        throw new Error("Student id or course id or assignment id missing!!!");
    }

    try{
        await run(
    `DECLARE 
        RESULT NUMBER;
    BEGIN 
        RESULT := ALREADY_SUBMITTED(${studentID},'${assignmentID}');
    -- Not submitted already
        IF RESULT = 0 THEN
            INSERT INTO SUBMISSIONS (STUDENT_ID,ASSIGNMENT_ID,TIME,PATH)
            VALUES (${studentID},'${assignmentID}',SYSDATE,'${path}');
    -- Submitted already        
        ELSIF RESULT = 1 THEN 
            UPDATE SUBMISSIONS
            SET PATH = '${path}' , TIME = SYSDATE
            WHERE STUDENT_ID = ${studentID} AND ASSIGNMENT_ID = '${assignmentID}' ;
            
        END IF;
    END;
    `)
        res.json({success: true, message: "Submitted For grading"});  
            
    }catch(error){
        if(error.message.includes('No path given')){
            res.json({success: false, message: "No path given"});
        }
        else if (error.message.includes('Deadline crossed')){
            res.json({success: false, message: "Deadline crossed"});
        }
        
    }


    // if(!path){
    //     res.json({success: false, message:"No path given"});
    //     return;
    // }
    // const data = await run(
    //     `SELECT *
    //     FROM ASSIGNMENTS
    //     WHERE ID= '${assignmentID}' AND SYSDATE > DEADLINE`
    // );

    // const data2 = await run(
    //     `SELECT *
    //     FROM SUBMISSIONS
    //     WHERE STUDENT_ID = ${studentID} AND ASSIGNMENT_ID = '${assignmentID}'`
    // );
    
    // // This indicates that the deadline hasn't been reached yet
    // // And no submission of the assignment was done earlier
    // if(data.rows.length === 0  && data2.rows.length === 0){
    //     await run(`INSERT INTO SUBMISSIONS (STUDENT_ID,ASSIGNMENT_ID,TIME,PATH)
    //     VALUES(${studentID}, '${assignmentID}',SYSDATE, '${path}')`);
    //     res.json({success:true,message:"Assignment submitted for grading"})
    // }
    // // Deadline hasn't been reached yet but assignment was submitted earlier
    // else if(data.rows.length === 0){
    //     await run(`UPDATE SUBMISSIONS
    //     SET PATH = '${path}', TIME = SYSDATE
    //     WHERE STUDENT_ID = ${studentID} AND ASSIGNMENT_ID = '${assignmentID}' `);
    //     res.json({success: true, message:"Submission Updated\nAssignment submitted for grading"});
    // }
    // // Deadline crossed
    // else{
    //     res.json({success: false, message:"Deadline crossed!!"});
    // }
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

// Gets the dropped courses of a department
app.get("/api/droppedCourses/:deptID",async(req,res)=>{
    const deptID = req.params.deptID;
    const data = await run(
        `SELECT * 
        FROM COURSES 
        WHERE DROP_DATE IS NOT NULL AND DEPT_ID = ${deptID}`);
    if(!data){
        res.status(404);
        throw new Error("Error fetching data from database");
    }
    res.status(200).json(data.rows);
});
// Gets specific dropped course of a department
app.get("/api/droppedCourses/:deptID/:courseID",async(req,res)=>{
    const deptID = req.params.deptID;
    const courseID = req.params.courseID;
    const data = await run(
        `SELECT * 
        FROM COURSES 
        WHERE DROP_DATE IS NOT NULL AND DEPT_ID = ${deptID} AND ID = '${courseID}'
        ORDER BY ID ASC`);
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
        `SELECT ID,TITLE,TO_CHAR(SELECTION_DATE,'HH12:MI:SS am, DD Month, YYYY')
        FROM COURSES
        WHERE TEACHER_ID = ${teacherID} AND DROP_DATE IS NULL
        ORDER BY ID ASC`
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
        `SELECT ID,TITLE,TO_CHAR(SELECTION_DATE,'HH12:MI:SS am, DD Month, YYYY')
        FROM COURSES
        WHERE TEACHER_ID = ${teacherID} AND ID ='${courseID}' AND DROP_DATE IS NULL`
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



// Gets all the assignments of a specific course of a specific teacher 
app.get("/api/teacher/:teacherID/courses/:courseID/assignments", async(req,res)=>{
    const teacherID = req.params.teacherID;
    const courseID = req.params.courseID;
    if(!teacherID || !courseID){
        res.status(400);
        throw new Error("Student id or course id missing!!!");
    }
    const data = await run(
        `SELECT ID,TITLE,DESCRIPTION,TO_CHAR(DEADLINE,'HH12:MI:SS am, DD Month,YYYY')
        FROM ASSIGNMENTS
        WHERE COURSE_ID = '${courseID}'
        ORDER BY ID ASC`
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
        `SELECT ID,TITLE,DESCRIPTION,TO_CHAR(DEADLINE,'HH12:MI:SS am, DD Month,YYYY')
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
app.get("/api/submissions/:assignmentID", async(req,res)=>{
    const assignmentID = req.params.assignmentID;
    if(!assignmentID){
        res.status(400);
        throw new Error("Assignment id missing!!!");
    }
    // console.log("Ashchi");
    const data = await run(
        `SELECT STUDENT_ID,TO_CHAR(TIME,'HH12:MI:SS AM, DD Month, YYYY') AS TIME,PATH 
        FROM SUBMISSIONS 
        WHERE ASSIGNMENT_ID = '${assignmentID}'`
    );
    // console.log(data.rows[0]);
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

app.post("/api/createCourse",async(req,res)=>{
    const courseID = req.body.courseID;
    const title = req.body.title;
    const deptID = req.body.deptID;
    const teacherID = req.body.teacherID;
    console.log(req.body);

    if(!courseID || !title || !deptID || !teacherID){
        res.json({success: false, message:"All fields are neccessary"});
        return;
    }

    try{
        await run(
        `INSERT INTO COURSES(ID,TITLE,DEPT_ID,TEACHER_ID,SELECTION_DATE,DROP_DATE) 
        VALUES('${courseID}','${title}',${deptID},${teacherID},SYSDATE,NULL)`);

        res.json({success: true, message:"Course Created Successfully!"});
    }
    catch(error){
        if(error.message.includes("Course Already Exists")){
            res.json({success: false, message:"Course Already Exists!"});
        }
        
    }

});

app.post("/api/teacher/dropCourse/:courseID",async(req,res)=>{
    const courseID = req.params.courseID;
    await run(
        `UPDATE COURSES
        SET DROP_DATE = SYSDATE
        WHERE ID = '${courseID}'`);
    res.json({success: true, message: "Dropped Course Successfully"});
});

app.post("/api/teacher/:teacherID/takeCourse/:courseID", async(req,res)=>{
    const teacherID = req.params.teacherID;
    const courseID = req.params.courseID;
    await run(
        `UPDATE COURSES
        SET TEACHER_ID = ${teacherID}, SELECTION_DATE = SYSDATE, DROP_DATE = NULL
        WHERE ID = '${courseID}'`);

    res.json({success: true, message:"Course Taken Successfully"});
});

app.post("/api/student/:studentID/dropCourse/:courseID",async(req,res)=>{
    const studentID = req.params.studentID;
    const courseID = req.params.courseID;
    await run(
        `UPDATE ENROLLMENTS
        SET DROP_DATE = SYSDATE
        WHERE STUDENT_ID = ${studentID} AND COURSE_ID = '${courseID}'`);
    
    res.json({success: true, message: "Dropped Course Successfully"});
});

app.get("/api/availableCourses/:studentID",async(req,res)=>{
    const studentID = req.params.studentID;
    const data = await run (
        `SELECT C.ID, C.TITLE,T.ID, T.FULL_NAME
        FROM COURSES C JOIN TEACHERS T 
        ON C.TEACHER_ID = T.ID 
        WHERE 0 =  (SELECT COUNT(*) 
                    FROM ENROLLMENTS
                    WHERE STUDENT_ID = ${studentID} AND COURSE_ID = C.ID AND DROP_DATE IS NULL)`);

    res.json(data.rows);
});
app.get("/api/availableCourses/:studentID/:courseID",async(req,res)=>{
    const studentID = req.params.studentID;
    const courseID = req.params.courseID;
    const data = await run (
        `SELECT C.ID, C.TITLE,T.ID, T.FULL_NAME
        FROM COURSES C JOIN TEACHERS T 
        ON C.TEACHER_ID = T.ID 
        WHERE 0 =  (SELECT COUNT(*) 
                    FROM ENROLLMENTS
                    WHERE STUDENT_ID = ${studentID} AND COURSE_ID = C.ID AND DROP_DATE IS NULL)
        AND C.ID = '${courseID}'
        ORDER BY C.ID ASC`);

    res.json(data.rows);
});

app.post("/api/student/:studentID/enrollCourse/:courseID", async(req,res)=>{
    const studentID = req.params.studentID;
    const courseID = req.params.courseID;
    try{
        await run(
            `DECLARE 
                STATUS NUMBER;
            BEGIN 
                STATUS := VALID_ENROLLMENT(${studentID},'${courseID}');
                IF STATUS = 0 THEN 
                    INSERT INTO ENROLLMENTS(ENROLLMENT_DATE,DROP_DATE,STUDENT_ID,COURSE_ID)
                    VALUES(SYSDATE,NULL,${studentID},'${courseID}');
                ELSIF STATUS = 1 THEN
                    UPDATE ENROLLMENTS
                    SET ENROLLMENT_DATE = SYSDATE, DROP_DATE = NULL
                    WHERE STUDENT_ID = ${studentID} AND COURSE_ID = '${courseID}';
                ELSE 
                    RAISE_APPLICATION_ERROR(-20001,'Course Already Exists!');
                END IF;
                
            END;`);

            res.json({success:false, message: "Enrolled in Course Successfully!"});
    }
    catch(error){
        if(error.message.includes("Course Already Exists")){
            res.json({success:false, message: "Course Already Exists!"});
        }
    }
});

app.post("/api/createAssignment",async(req,res)=>{
    const assignmentID = req.body.assignmentID;
    const title = req.body.title;
    const description = req.body.description;
    const deadline = req.body.deadline;
    const courseID = req.body.courseID;

    if(!assignmentID || !title || !deadline || !courseID){
        res.status(400);
        res.json({success: false, message: "Please Fillup the necessary fields"});
    }
    try{
        await run(
            `DECLARE
                DECISION NUMBER;
                AID VARCHAR2(255);
            BEGIN 
                AID := '${assignmentID}';
                DECISION := ASSIGNMENT_EXISTS(AID);
                
                IF DECISION = 0 THEN 
                    INSERT INTO ASSIGNMENTS(ID,TITLE,DESCRIPTION,DEADLINE,COURSE_ID)
                    VALUES('${assignmentID}','${title}','${description}',
                    TO_DATE('${deadline}','HH12:MI:SS AM, DD-MM-YYYY'),'${courseID}');
                ELSIF DECISION = 1 THEN
                    UPDATE ASSIGNMENTS
                    SET TITLE = '${title}', DESCRIPTION='${description}' , DEADLINE= TO_DATE('${deadline}','HH12:MI:SS AM, DD-MM-YYYY')
                    WHERE ID = '${assignmentID}';
                END IF;
            END;`);
            
            res.json({success: true, message: "Assignment Created Successfully"});
    }
    catch(error){
        if(error.message.includes("Deadline Crossed")){
            res.json({success: false, message: "Deadline Crossed"});
        }
    }
});

app.post("/api/editAssignment",async(req,res)=>{
    const old_assignmentID = req.body.old_assignmentID;
    const assignmentID = req.body.assignmentID;
    const title = req.body.title;
    const description = req.body.description;
    const deadline = req.body.deadline;
    const courseID = req.body.courseID;

    if(!assignmentID || !title || !deadline || !courseID){
        res.status(400);
        res.json({success: false, message: "Please Fillup the necessary fields"});
    }

    try{
        await run(
            `UPDATE ASSIGNMENTS
            SET ID = '${assignmentID}', TITLE = '${title}', DESCRIPTION = '${description}', DEADLINE = TO_DATE('${deadline}','HH12:MI:SS AM, DD-MM-YYYY')
            WHERE ID = '${old_assignmentID}' `);

        res.json({success: true, message:"Assignment Successfully Updated"});
    }
    catch(error){
        if(error.message.includes("Another assignment with the same ID exists!")){
            res.json({success: false, message:"Another assignment with the same ID exists!"});
        }
    }
});