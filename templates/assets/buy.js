function purchase()
{
    $.ajax('/purchase', {
        type: 'POST',  // http method
        data: { 
            courseName : $("#courseName").text(),
            courseDuration : $("#courseDuration").text(),
            coursePrice : $("#coursePrice").text(),
            userEmail : $("#userEmail").text()
        },  // data to submit
        success: function (data, status, xhr) {
            $('#msg').css("display", "block");
            $('#msg').text(data);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $('#msg').css("display", "block");
            $('#msg').text('Error' + errorMessage);
        }
    });
}

$("#btnPurchase").click(()=>{
    purchase();
});


// Setting the course Image in /buy.pug
let imgName = document.getElementById("title").innerText;
document.getElementById("courseImg").src=`${imgName}.png`;