
let students = ["Rahul", "Aman", "Priya"];

let teachers = JSON.parse(localStorage.getItem("teachers")) || {
    teacher1: "1111",
    teacher2: "2222"
};

/* ================= LOGIN ELEMENTS ================= */
const loginBtn = document.getElementById("login-btn");
const loginBox = document.getElementById("login-box");
const mainLayout = document.querySelector(".main-layout");
const error = document.getElementById("error");

const roleSelect = document.getElementById("role");

/* ================= DASHBOARD ELEMENTS ================= */
const adminPanel = document.getElementById("admin-panel");
const teacherPanel = document.getElementById("teacher-panel");

/* ================= TEACHER ELEMENTS ================= */
const studentBody = document.getElementById("student-body");
const reportBody = document.getElementById("report-body");
const historyBody = document.getElementById("history-body");

const totalStudents = document.getElementById("total-students");
const presentCount = document.getElementById("present-count");
const absentCount = document.getElementById("absent-count");
const attendancePercent = document.getElementById("attendance-percent");

const studentName = document.getElementById("student-name");
const searchInput = document.getElementById("search-input");
const addBtn = document.getElementById("add-btn");
const saveBtn = document.getElementById("save-btn");

let buttons = [];

/* ================= LOGIN SYSTEM ================= */
loginBtn.addEventListener("click", ()=>{

    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    let role = roleSelect.value;

    if(teachers[user] && teachers[user] === pass || (user === "admin" && pass === "1234")){

        loginBox.style.display = "none";
        mainLayout.style.display = "flex";

        localStorage.setItem("user", user);
        localStorage.setItem("role", role);

        showDashboard(role);

    }else{
        error.innerText = "Invalid Login!";
    }

});

/* ================= SHOW DASHBOARD ================= */
function showDashboard(role){

    if(role === "admin"){

        adminPanel.style.display = "block";
        teacherPanel.style.display = "none";

        renderTeachers();

    }else{

        adminPanel.style.display = "none";
        teacherPanel.style.display = "block";

        renderStudents();
        setupButtons();
        updateCounts();
        updateReport();
        loadHistory();
    }
}

/* ================= AUTO LOGIN ================= */
window.onload = ()=>{

    let user = localStorage.getItem("user");
    let role = localStorage.getItem("role");

    if(user){

        loginBox.style.display = "none";
        mainLayout.style.display = "flex";

        showDashboard(role);
    }
};

/* ================= ADD TEACHER ================= */
document.getElementById("add-teacher-btn").addEventListener("click", ()=>{

    let name = document.getElementById("tname").value;
    let pass = document.getElementById("tpass").value;

    if(name && pass){

        teachers[name] = pass;

        localStorage.setItem("teachers", JSON.stringify(teachers));

        renderTeachers();
    }

});

/* ================= RENDER TEACHERS ================= */
function renderTeachers(){

    let list = document.getElementById("teacher-list");
    list.innerHTML = "";

    for(let t in teachers){

        list.innerHTML += `
        <li>
            ${t}
            <button onclick="deleteTeacher('${t}')">Delete</button>
        </li>
        `;
    }
}

/* ================= DELETE TEACHER ================= */
function deleteTeacher(name){

    delete teachers[name];

    localStorage.setItem("teachers", JSON.stringify(teachers));

    renderTeachers();
}

/* ================= STUDENTS ================= */
function renderStudents(){

    studentBody.innerHTML = "";

    students.forEach((student)=>{

        studentBody.innerHTML += `
        <tr>
            <td>${student}</td>
            <td><button class="present-btn">Present</button></td>
        </tr>
        `;
    });

    setupButtons();
}

/* ================= BUTTONS ================= */
function setupButtons(){

    buttons = document.querySelectorAll(".present-btn");

    buttons.forEach((btn)=>{

        btn.addEventListener("click", ()=>{

            if(btn.innerText === "Present"){
                btn.innerText = "Absent";
                btn.style.background = "red";
            }else{
                btn.innerText = "Present";
                btn.style.background = "green";
            }

            updateCounts();
            updateReport();
        });

    });
}

/* ================= COUNTS ================= */
function updateCounts(){

    let present = 0;
    let absent = 0;

    buttons.forEach((btn)=>{

        if(btn.innerText === "Present"){
            present++;
        }else{
            absent++;
        }
    });

    totalStudents.innerText = students.length;
    presentCount.innerText = present;
    absentCount.innerText = absent;

    let percent = (present / students.length) * 100;
    attendancePercent.innerText = percent.toFixed(0) + "%";
}

/* ================= REPORT ================= */
function updateReport(){

    reportBody.innerHTML = "";

    buttons.forEach((btn,index)=>{

        let marks = btn.innerText === "Present" ? 10 : 0;

        reportBody.innerHTML += `
        <tr>
            <td>${students[index]}</td>
            <td>${btn.innerText}</td>
            <td>${marks}</td>
        </tr>
        `;
    });
}

/* ================= ADD STUDENT ================= */
addBtn.addEventListener("click", ()=>{

    let name = studentName.value;

    if(name){

        students.push(name);

        renderStudents();
        updateCounts();
        updateReport();

        studentName.value = "";
    }
});

localStorage.setItem(
    "students",
    JSON.stringify(students)
);

/* ================= SEARCH ================= */
searchInput.addEventListener("input", ()=>{

    let value = searchInput.value.toLowerCase();

    document.querySelectorAll("tbody tr").forEach(row=>{

        let name = row.children[0].innerText.toLowerCase();

        if(name.includes(value)){
            row.style.display = "";
        }else{
            row.style.display = "none";
        }
    });

});

/* ================= SAVE HISTORY ================= */
saveBtn.addEventListener("click", ()=>{

    let present = 0;
    let absent = 0;

    buttons.forEach(btn=>{
        if(btn.innerText === "Present") present++;
        else absent++;
    });

    let today = new Date().toISOString().split("T")[0];

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        date: today,
        total: students.length,
        present: present,
        absent: absent
    });

    localStorage.setItem("history", JSON.stringify(history));

    alert("Attendance Saved!");

    loadHistory();
});

/* ================= LOAD HISTORY ================= */
function loadHistory(){

    let history = JSON.parse(localStorage.getItem("history")) || [];

    historyBody.innerHTML = "";

    history.forEach(h=>{

        historyBody.innerHTML += `
        <tr>
            <td>${h.date}</td>
            <td>${h.total}</td>
            <td>${h.present}</td>
            <td>${h.absent}</td>
        </tr>
        `;
    });
}

/* ================= LOGOUT ================= */
document.getElementById("logout").addEventListener("click", ()=>{

    localStorage.removeItem("user");
    localStorage.removeItem("role");

    location.reload();
});

let students =
JSON.parse(localStorage.getItem("students"))
||
["Rahul","Aman","Priya"];