import {OrderModel} from "../model/OrderModel.js";
import {item_db, order_db} from "../db/db.js";

var row_index = null;

const clear = () => {
    $("#order-id").val("");
    $("#order-name").val("");
    $("#cus-name").val("");
    $("#unit-price").val("");
    $("#qty").val("");
    $("#total").val("");
}

const loadOrderData = () => {
    $('#order-tbl-body').empty(); // make tbody empty
    order_db.map((item, index) => {
        let record = `<tr><td class="order_id">${item.order_id}</td><td class="order_name">${item.order_name}</td><td class="cus_name">${item.cus_name}</td><td class="unit_price">${item.unit_price}</td><td class="qty">${item.qty}</td><td class="total">${item.total}</td></tr>`;
        $("#order-tbl-body").append(record);
    });
};

// submit

$("#order-btns>button[type='button']").eq(0).on("click", () => {
    let order_id = $("#order-id").val();
    let order_name = $("#order-name").val();
    let cus_name = $("#cus-name").val();
    let unit_price = parseFloat($("#unit-price").val()) || 0;
    let qty = parseInt($("#qty").val()) || 0;
    let total = (unit_price * qty).toFixed(2);

    if (order_id && order_name && cus_name && unit_price && qty && total) {
        // Check if there is enough stock for the order
        let itemIndex = item_db.findIndex(item => item.item_name === order_name);

        if (itemIndex !== -1 && item_db[itemIndex].stock >= qty) {
            // Decrease the stock of the corresponding item
            item_db[itemIndex].stock -= qty;

            let student_obj = new OrderModel(order_id, order_name, cus_name, unit_price, qty, total);

            // Save the order in the db
            order_db.push(student_obj);

            // Clear the form
            $("#order-btns>button[type='reset']").click();

            // Load order data
            loadOrderData();

            // Update item data
            loadItemData();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Not enough stock for the order!'
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please fill in all required fields!'
        });
    }
});

// update
$("#order-btns>button[type='button']").eq(1).on("click", () => {

    let order_id = $("#order-id").val();
    let order_name = $("#order-name").val();
    let cus_name = $("#cus-name").val();
    let unit_price = $("#unit-price").val();
    let qty = $("#qty").val();
    let total = $("#total").val();

    let student_obj = new OrderModel(order_id,order_name,cus_name,unit_price,qty,total);

    // find item index
    let index = order_db.findIndex(item => item.order_id === order_id);

    // update item in the db
    order_db[index] = student_obj;

    // clear();
    $("#order-btns>button[type='reset']").click();

    // load student data
    loadOrderData();
})

// delete
$("#order-btns>button[type='button']").eq(2).on("click", () => {

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

            let order_id = $("#order-id").val();

            // find item index
            let index = order_db.findIndex(item => item.order_id === order_id);

            // remove the item from the db
            order_db.splice(index, 1);

            $("#order-btns>button[type='reset']").click();

            // load student data
            loadOrderData();

            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })

})

$("#order-tbl-body").on("click", "tr", function() {
    row_index = $(this).index();

    console.log(row_index);

    let order_id = $(this).find(".order_id").text();
    let order_name = $(this).find(".order_name").text();
    let cus_name = $(this).find(".cus_name").text();
    let unit_price = $(this).find(".unit_price").text();
    let qty = $(this).find(".qty").text();
    let total = $(this).find(".total").text();

    $("#order-id").val(order_id);
    $("#order-name").val(order_name);
    $("#cus-name").val(cus_name);
    $("#unit-price").val(unit_price);
    $("#qty").val(qty);
    $("#total").val(total);



});
$('#order-search').on('input',()=>{
    let search_term = $('#order-search').val();
    let results = order_db.filter((item) =>
        item.order_name.toLowerCase().startsWith(search_term.toLowerCase()) || item.cus_name.toLowerCase().startsWith(search_term.toLowerCase()) || item.order_id.toLowerCase().startsWith(search_term.toLowerCase()));
    console.log(results);

    $('#order-tbl-body').empty();
    results.map((item, index) => {
        let tbl_row = `<tr><td>${item.order_id}</td><td>${item.order_name}</td><td>${item.cus_name}</td><td>${item.unit_price}</td><td>${item.total}</td><td>${item.qty}</td></tr>`;
        $('#order-tbl-body').append(tbl_row);
    });
})
$("#unit-price, #qty").on("input", updateTotal);

function updateTotal() {
    const unitPrice = parseFloat($("#unit-price").val()) || 0;
    const quantity = parseInt($("#qty").val()) || 0;
    const total = (unitPrice * quantity).toFixed(2);
    $("#total").val(total);
}

//create amount

function updateRemainingAmount() {
    const total = parseFloat(document.querySelector("#total").value);
    const amountGiven = parseFloat(document.querySelector("#amount").value);

    const remainingAmount = amountGiven - total;

    document.querySelector("#remaining").value = remainingAmount;
}

document.querySelector("#total").addEventListener("input", updateRemainingAmount);
document.querySelector("#amount").addEventListener("input", updateRemainingAmount);

updateRemainingAmount();




// Call the function to update the date immediately
updateCurrentDate();

// Optionally, update the date at regular intervals (e.g., every second)
setInterval(updateCurrentDate, 1000); // Update every second



//create discount

function calculateRemainingAndDiscount() {
    const amountInput = document.getElementById("amount");
    const totalInput = document.getElementById("total");
    const discountInput = document.getElementById("discount");
    const remainingInput = document.getElementById("remaining");

// Add event listeners to the input fields
    amountInput.addEventListener("input", updateRemaining);
    totalInput.addEventListener("input", updateRemaining);
    discountInput.addEventListener("input", updateRemaining);

    function updateRemaining() {
        // Get the values from the input fields
        const amountGiven = parseFloat(amountInput.value) || 0;
        const total = parseFloat(totalInput.value) || 0;
        const discount = parseFloat(discountInput.value) || 0;


        // Calculate the remaining amount
        const discountAmount = (discount / 100) * total;
        const remaining = (amountGiven - total) + discountAmount;

        // Update the "Remaining Amount" field
        remainingInput.value = remaining.toFixed(2);
    }
}

// Function to update the date field
function updateCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    const currentDate = new Date();
    currentDateElement.textContent = currentDate.toDateString();
}

// Add an event listener to the "Discount" input field to trigger the calculation
document.getElementById('discount').addEventListener('input', calculateRemainingAndDiscount);

// Update the current date when the page loads
window.addEventListener('load', updateCurrentDate);

//auto genarate order id
document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.querySelector('form');
    const orderIdInput = document.getElementById('order-id');
    let orderIdCounter = 1; // Initialize the counter

    // Function to generate the next Order ID
    function generateNextOrderId() {
        const nextOrderId = `O00${orderIdCounter}`;
        orderIdCounter++;
        return nextOrderId;
    }

    // Function to handle the "Submit" button click
    function addOrder() {
        // Generate the next Order ID
        const newOrderId = generateNextOrderId();
        orderIdInput.value = newOrderId;

        // ... (rest of your code to handle other form elements and table)
    }

    // Set the initial order ID
    orderIdInput.value = generateNextOrderId();

    // Attach the function to the "Submit" button
    const submitButton = document.querySelector('#order-btns button.btn-success');
    submitButton.addEventListener('click', addOrder);
});
