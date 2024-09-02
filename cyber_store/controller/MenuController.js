$('#menu-section').css('display', 'block');
$('#customer-section').css('display', 'none');
$('#item-section').css('display', 'none');
$('#order-section').css('display', 'none');

$('#home-nav').on('click', () => {
    $('#menu-section').css('display', 'block');
    $('#customer-section').css('display', 'none');
    $('#item-section').css('display', 'none');
    $('#order-section').css('display', 'none');
})

$('.customer-nav').on('click', () => {
    $('#menu-section').css('display', 'none');
    $('#customer-section').css('display', 'block');
    $('#item-section').css('display', 'none');
    $('#order-section').css('display', 'none');
})


$('.item-nav').on('click', () => {
    $('#menu-section').css('display', 'none');
    $('#customer-section').css('display', 'none');
    $('#item-section').css('display', 'block');
    $('#order-section').css('display', 'none');
})


$('.order-nav').on('click', () => {
    $('#menu-section').css('display', 'none');
    $('#customer-section').css('display', 'none');
    $('#item-section').css('display', 'none');
    $('#order-section').css('display', 'block');
})