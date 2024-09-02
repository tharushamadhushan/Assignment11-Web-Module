import {CustomerModel} from "../model/CustomerModel.js";
import {student_db} from "../db/db.js";

var row_index = null;

//email correct validation
var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const regEmail = new RegExp(emailPattern);

//mobile correct validation
var mobilePattern = /^[0-9]{10}$/; // Example pattern for a 10-digit mobile number
const regMobile = new RegExp(mobilePattern);


const clear = () => {
    $("#student-id").val("");
    $("#first-name").val("");
    $("#mobile").val("");
    $("#address").val("");
    $(input[name='flexRadioDefault'][value='Female']).prop("checked", true);
}

const loadStudentData = () => {
    $('#student-tbl-body').empty(); // make tbody empty
    student_db.map((item, index) => {
        let record = `<tr><td class="student_id">${item.student_id}</td><td class="first_name">${item.first_name}</td><td class="mobile">${item.mobile}</td><td class="address">${item.address}
        </td><td class="gender">${item.gender}</td></tr>`;
        $("#student-tbl-body").append(record);
    });
};

// submit
$("#student-btns>button[type='button']").eq(0).on("click", () => {
    // collect data from the array
    let student_id = $("#student-id").val();
    let first_name = $("#first-name").val();
    let mobile = $("#mobile").val();
    let address = $("#address").val();
    let gender = $("input[name='flexRadioDefault']:checked").val();

    if (student_id){
        if (first_name){
                    var mobileValid=regMobile.test(mobile);
                    if (mobile && mobileValid){
                        if (address){
                            let student_obj = new CustomerModel(student_id, first_name,mobile, address, gender);

                            // save in the db
                            student_db.push(student_obj);

                            // clear();
                            $("#student-btns>button[type='reset']").click();

                            // load student data
                            loadStudentData();
                        }else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Invalid Input',
                                text: 'Please enter address!'
                            })
                        }
                    }else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Invalid Input',
                            text: 'Please enter  valid mobile number!'
                        })
                    }
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please enter first name!'
            })
        }
    }else {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please enter student id!'
        })
    }



    // prepare the object
    // let student_obj = {
    //     student_id: student_id,
    //     first_name: first_name,
    //     last_name: last_name,
    //     address: address,
    //     program, program
    // };



});

// update
$("#student-btns>button[type='button']").eq(1).on("click", () => {

    let student_id = $("#student-id").val();
    let first_name = $("#first-name").val();
    let mobile = $("#mobile").val();
    let address = $("#address").val();
    let gender = $("input[name='flexRadioDefault']:checked").val();

    // prepare the object
    // let student_obj = {
    //     student_id: student_id,
    //     first_name: first_name,
    //     last_name: last_name,
    //     address: address,
    //     program: program
    // };

    let student_obj = new CustomerModel(student_id, first_name,mobile,address, gender);

    // find item index
    let index = student_db.findIndex(item => item.student_id === student_id);

    // update item in the db
    student_db[index] = student_obj;

    // clear();
    $("#student-btns>button[type='reset']").click();

    // load student data
    loadStudentData();
})

// delete
$("#student-btns>button[type='button']").eq(2).on("click", () => {

    //delete validation
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
       }).then((result) => {
        if (result.isConfirmed) {

            let student_id = $("#student-id").val();

            // find item index
            let index = student_db.findIndex(item => item.student_id === student_id);

            // remove the item from the db
            student_db.splice(index, 1);

            $("#student-btns>button[type='reset']").click();

            // load student data
            loadStudentData();
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })

})

$("#student-tbl-body").on("click", "tr", function() {
    row_index = $(this).index();

    console.log(row_index);

    let student_id = $(this).find(".student_id").text();
    let first_name = $(this).find(".first_name").text();
    let mobile = $(this).find(".mobile").text();
    let address = $(this).find(".address").text();
    let gender = $(this).find(".gender").text();

    $("#student-id").val(student_id);
    $("#first-name").val(first_name);
    $("#mobile").val(mobile);
    $("#address").val(address);
    $(`input[name='flexRadioDefault'][value='${gender}']`).prop("checked", true);
});

$('#customer-search').on('input',()=>{
    let search_term = $('#customer-search').val();
    let results = student_db.filter((item) =>
        item.first_name.toLowerCase().startsWith(search_term.toLowerCase()) || item.address.toLowerCase().startsWith(search_term.toLowerCase()) || item.mobile.startsWith(search_term) || item.student_id.toLowerCase().startsWith(search_term.toLowerCase()));
    console.log(results);

    $('#student-tbl-body').empty();
    results.map((item, index) => {
        let tbl_row = `<tr><td>${item.student_id}</td><td>${item.first_name}</td><td>${item.mobile}</td><td>${item.address}</td><td>${item.gender}</td></tr>`;
        $('#student-tbl-body').append(tbl_row);
    });
})

document.addEventListener('DOMContentLoaded', function () {
    const customerForm = document.querySelector('form');
    const custIdInput = document.getElementById('student-id');
    let custIdCounter = 1; // Initialize the counter

    // Function to generate the next Order ID
    function generateNextCustId() {
        const nextCustId = `C00${custIdCounter}`;
        custIdCounter++;
        return nextCustId;
    }

    // Function to handle the "Submit" button click
    function addCust() {
        // Generate the next Order ID
        const newCustId = generateNextCustId();
        custIdInput.value = newCustId;

        // ... (rest of your code to handle other form elements and table)
    }

    // Set the initial order ID
    custIdInput.value = generateNextCustId();

    // Attach the function to the "Submit" button
    const submitButton = document.querySelector('#student-btns button.btn-success');
    submitButton.addEventListener('click', addCust);
});