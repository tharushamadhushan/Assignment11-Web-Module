import {ItemModel} from "../model/ItemModel.js";
import {item_db, student_db} from "../db/db.js";

var row_index = null;

const clear = () => {
    $("#item-id").val("");
    $("#item-name").val("");
    $("#item-des").val("");
    $("#item-price").val("");
    $("#stock").val("");

}

const loadItemData = () => {
    $('#item-tbl-body').empty(); // make tbody empty
    item_db.map((item, index) => {
        let record = `<tr><td class="item_id">${item.item_id}</td><td class="item_name">${item.item_name}</td><td class="item_des">${item.item_des}</td><td class="item_price">${item.item_price}</td><td class="stock">${item.stock}</td></tr>`;
        $("#item-tbl-body").append(record);
    });
};

// submit
$("#item-btns>button[type='button']").eq(0).on("click", () => {
    let item_id = $("#item-id").val();
    let item_name = $("#item-name").val();
    let item_des = $("#item-des").val();
    let item_price = $("#item-price").val();
    let stock = $("#stock").val();

    if (item_id){
        if (item_name){
            if (item_des){
                if (item_price){
                    if (stock){

                            let item_obj = new ItemModel(item_id,item_name,item_des,item_price,stock);

                            // save in the db
                            item_db.push(item_obj);

                            // clear();
                        $("#item-btns>button[type='reset']").click();

                            // load student data
                            loadItemData();
                    }else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Invalid Input',
                            text: 'Please enter stock!'})
                    }
                }else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Input',
                        text: 'Please enter unit price!'})
                }
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Input',
                    text: 'Please enter cus name!'})
            }
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please enter item name!'
            })
        }
    }else {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please enter item Id!'})
    }

});

// update
$("#item-btns>button[type='button']").eq(1).on("click", () => {

    let item_id = $("#item-id").val();
    let item_name = $("#item-name").val();
    let item_des = $("#item-des").val();
    let item_price = $("#item-price").val();
    let stock = $("#stock").val();


    let item_obj = new ItemModel(item_id,item_name,item_des,item_price,stock);

    // find item index
    let index = item_db.findIndex(item => item.item_id === item_id);

    // update item in the db
    item_db[index] = item_obj;

    // clear();
    $("#item-btns>button[type='reset']").click();

    // load student data
   loadItemData();
})

// delete
$("#item-btns>button[type='button']").eq(2).on("click", () => {

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

            let item_id = $("#item-id").val();

            // find item index
            let index = item_db.findIndex(item => item.item_id === item_id);

            // remove the item from the db
            item_db.splice(index, 1);

            $("#item-btns>button[type='reset']").click();

            // load student data
            loadItemData();

            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })

})

$("#item-tbl-body").on("click", "tr", function() {
    row_index = $(this).index();

    console.log(row_index);

    let item_id = $(this).find(".item_id").text();
    let item_name = $(this).find(".item_name").text();
    let item_des = $(this).find(".item_des").text();
    let item_price = $(this).find(".item_price").text();
    let stock = $(this).find(".stock").text();


    $("#item-id").val(item_id);
    $("#item-name").val(item_name);
    $("#item-des").val(item_des);
    $("#item-price").val(item_price);
    $("#stock").val(stock);



});
$('#item-search').on('input',()=>{
    let search_term = $('#item-search').val();
    let results = item_db.filter((item) =>
        item.item_name.toLowerCase().startsWith(search_term.toLowerCase()) || item.item_des.toLowerCase().startsWith(search_term.toLowerCase()) || item.item_id.toLowerCase().startsWith(search_term.toLowerCase()));
    console.log(results);

    $('#item-tbl-body').empty();
    results.map((item, index) => {
        let tbl_row = `<tr><td>${item.item_id}</td><td>${item.item_name}</td><td>${item.item_des}</td><td>${item.item_price}</td><td>${item.stock}</td></tr>`;
        $('#item-tbl-body').append(tbl_row);
    });
})
//auto genarate order id
document.addEventListener('DOMContentLoaded', function () {
    const itenForm = document.querySelector('form');
    const itemIdInput = document.getElementById('item-id');
    let itemIdCounter = 1; // Initialize the counter

    // Function to generate the next Order ID
    function generateNextItemId() {
        const nextItemId = `I00${itemIdCounter}`;
        itemIdCounter++;
        return nextItemId;
    }

    // Function to handle the "Submit" button click
    function addItem() {
        // Generate the next Order ID
        const newItemId = generateNextItemId();
        itemIdInput.value = newItemId;

        // ... (rest of your code to handle other form elements and table)
    }

    // Set the initial order ID
    itemIdInput.value = generateNextItemId();

    // Attach the function to the "Submit" button
    const submitButton = document.querySelector('#item-btns button.btn-success');
    submitButton.addEventListener('click', addItem);
});