const cl = console.log;

const formStd = document.getElementById("formStd");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");
const contact = document.getElementById("contact");
const addStd = document.getElementById("addStd");
const updateStd = document.getElementById("updateStd");
const tableStd = document.getElementById("tableStd");

let BASE_URL = "https://fetchstudent-default-rtdb.firebaseio.com";

let STUDENT_URL = `${BASE_URL}/student.json`;

function snackbar(msg, icon){
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 2000
    }) 
}

const state = {
    studentArr : [],
    editid: null,
}

function showSpinner(){
    spinner.classList.remove("d-none")
}

function hideSpinner(){
    spinner.classList.add("d-none")
}

//read 
function showOnUI(arr){
    let result = ``;

    arr.forEach((std, i)=>{
        result += `<tr id="${std.id}">
                            <td>${i+1}</td>
                            <td>${std.fname}</td>
                            <td>${std.lname}</td>
                            <td>${std.email}</td>
                            <td>${std.contact}</td>
                            <td><i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i></td>
                            <td><i onclick="onDelete(this)" class="fa-solid fa-trash fa-2x text-danger"></i> </td>
                        </tr>`
    })

    tableStd.innerHTML = result;
}

function fetchStudent(){
    showSpinner()

    fetch(STUDENT_URL,{
        method: "GET",
        body: null,
        headers: {
            "Content-Type" : "application/json",
        }
    })

    .then(res=>{
        if(!res.ok){
            throw new Error("Failed to fetch student")
        }
        return res.json()
    })

    .then(data=>{
        for(const key in  data){
            data[key].id = key

            state.studentArr.unshift(data[key])
        }

        showOnUI(state.studentArr)
    })

    .catch(err=>{
        snackbar("Failed to fetch student!!!", "error");
    })

    .finally(()=>{
        hideSpinner()
    })
}

//create
function onAddStd(eve){
    eve.preventDefault()

    let stdObj = {
        fname : fname.value,
        lname : lname.value,
        email : email.value,
        contact: contact.value,
    }

    showSpinner()

    fetch(STUDENT_URL,{
        method: "POST",
        body: JSON.stringify(stdObj),
        headers: {
            "Content-Type" :  "application/json",
        }
    })

    .then(res=>{
        if(!res.ok){
            throw new Error("Failed to add student")
        }
        return res.json()
    })

    .then(data=>{
        stdObj.id = data.name

        state.studentArr.unshift(stdObj)

        formStd.reset()

        let tr = document.createElement("tr")

        tr.id = stdObj.id;

        tr.innerHTML = `<td>${state.studentArr.length}</td>
                            <td>${stdObj.fname}</td>
                            <td>${stdObj.lname}</td>
                            <td>${stdObj.email}</td>
                            <td>${stdObj.contact}</td>
                            <td><i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i></td>
                            <td><i onclick="onDelete(this)" class="fa-solid fa-trash fa-2x text-danger"></i> </td>`

        tableStd.prepend(tr)

        snackbar("Student added successfully!!!", "success");
    })

    .catch(err=>{
        snackbar("Failed to add student!!!", "error")
    })

    .finally(()=>{
        hideSpinner()
    })
}

//edit
function onEdit(ele){
    let EDIT_ID = ele.closest("tr").id;

    state.editid = EDIT_ID;

    let EDIT_URL = `${BASE_URL}/student/${EDIT_ID}.json`;

    showSpinner();

    fetch(EDIT_URL,{
        method: "GET",
        body: null,
        headers: {
            "Content-Type" : "application/json",
        }
    })

    .then(res=>{
        if(!res.ok){
            throw new Error("Failed to fetch student for edit")
        }
        return res.json()
    })

    .then(data=>{
        fname.value = data.fname;
        lname.value = data.lname;
        email.value = data.email;
        contact.value = data.contact;

        addStd.classList.add("d-none")
        updateStd.classList.remove("d-none")
    })

    .catch(err=>{
        snackbar("Failed to fetch student for edit!!!", "error")
    })

    .finally(()=>{
        hideSpinner()
    })
}


//update
function onUpdateStd(){
    let UPDATE_ID = state.editid;

    let UPDATE_URL = `${BASE_URL}/student/${UPDATE_ID}.json`

    let updateObj = {
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        contact: contact.value,
        id: UPDATE_ID
    }

    showSpinner()

    fetch(UPDATE_URL,{
        method: "PATCH",
        body: JSON.stringify(updateObj),
        headers: {
            "Content-Type" : "application/json",
        }
    })

    .then(res=>{
        if(!res.ok){
        throw new Error("Failed to update student")
        }
        return res.json()
    })

    .then(data=>{
        let getInd = state.studentArr.findIndex(f=>f.id === UPDATE_ID);

        state.studentArr[getInd] = updateObj;

        let tr = document.getElementById(UPDATE_ID)

        tr.innerHTML = `<td>${state.studentArr.length}</td>
                            <td>${updateObj.fname}</td>
                            <td>${updateObj.lname}</td>
                            <td>${updateObj.email}</td>
                            <td>${updateObj.contact}</td>
                            <td><i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i></td>
                            <td><i onclick="onDelete(this)" class="fa-solid fa-trash fa-2x text-danger"></i> </td>`

        formStd.reset()
        
        snackbar(`The student with ${UPDATE_ID} is updates successfully!!!`, "success")

        addStd.classList.remove("d-none")
        updateStd.classList.add("d-none")
    })

    .catch(err=>{
        snackbar("Failed to update student!!!", "error")
    })

    .finally(()=>{
        hideSpinner()
    })
}

//delete
function onDelete(ele){
    let REMOVE_ID = ele.closest("tr").id;

    let REMOVE_URL = `${BASE_URL}/student/${REMOVE_ID}.json`;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes,delete it!",
    }) 

    .then((result)=>{
        if(result.isConfirmed){
            showSpinner()

            fetch(REMOVE_URL,{
                method: "DELETE",
                body: null,
                headers:{
                    "Content-Type" : "application/json",
                }
            })

    .then(res=>{
        if(!res.ok){
            throw new Error("Failed to delete student")
        }
        return res.json();
    })

    .then(data=>{
        let getInd = state.studentArr.findIndex(f=>f.id === REMOVE_ID)

        state.studentArr.splice(getInd, 1)

        let li = document.getElementById(REMOVE_ID)

        ele.closest("tr").remove()

        snackbar("Student deleted successfully!!!", "success");
    })

    .catch(err=>{
        snackbar("Failed to delete student!!!", "error")
    })

    .finally(()=>{
        hideSpinner()
    })
    }
    })
}

fetchStudent()

formStd.addEventListener("submit", onAddStd)
updateStd.addEventListener("click", onUpdateStd)