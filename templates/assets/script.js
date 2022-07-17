console.clear();
if (document.getElementById("btn-dropdown") != null) {
    document.getElementById("btn-dropdown").addEventListener('click', (e) => {
        e.target.classList.toggle("rotate");
        document.getElementById("topmenu").classList.toggle("block");
    });
}

// for executing event one time

let flag = false;

window.addEventListener("resize", (e) => {
    if (e.target.innerWidth > 770 && flag == true) {
        document.getElementById("topmenu").classList.remove("direction-c");
        document.getElementById("topmenu").classList.remove("block");
        document.getElementById("topmenu").classList.add("direction-r");
        flag = false;
    }
    else if (e.target.innerWidth < 770 && flag == false) {
        document.getElementById("topmenu").classList.remove("direction-r");
        document.getElementById("topmenu").classList.add("direction-c");
        flag = true;
    }

});

const btnBuy = Array.from(document.getElementsByClassName("buy"));

btnBuy.forEach((element) => {
    element.addEventListener("click", (e) => {

        document.getElementsByClassName("container")[0].style.display = "none";
        document.getElementsByTagName("footer")[0].style.display = "none";

        document.getElementById("loading").style.display = "block";
        let siblings = Array.from($(element).siblings());
        
        course = {
            courseName: siblings[1].innerText,
            coursePrice: siblings[2].innerText,
            accessDuration: "2 Months"
        }

        document.getElementsByName("courseName")[0].value = course.courseName;
        document.getElementsByName("coursePrice")[0].value = course.coursePrice;
        document.getElementsByName("courseDuration")[0].value = course.accessDuration;

        setTimeout(() => {
            document.getElementById("myForm").submit();
            setTimeout(() => {
                document.getElementsByClassName("container")[0].style.display = "grid";
                document.getElementsByTagName("footer")[0].style.display = "grid";
                document.getElementById("loading").style.display = "none";
            }, 2000);
        }, 1000);
    });
});


// checking if user logged in or not

let cookies = document.cookie;

if(cookies!="")
{
    cookies = cookies.split(";");
    let cookie = new Array();
    cookies.forEach((element)=>{
        cookie.push(element.split("="));
    });

    // console.log(cookie[0][1]);
    let user = document.getElementById("signUp");
    user.innerText = cookie[0][1];
    user.setAttribute("href", "/profile");

    document.getElementById("login").style.display = "none";
}


document.getElementById("logo").addEventListener("click", ()=>{
    window.location.href = "/";
});