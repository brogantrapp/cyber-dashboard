const startup = document.getElementById("startup");
const app = document.getElementById("app");

let started = false;



// BOOT TEXT ANIMATION

const bootLines = document.querySelectorAll(".boot-text p");


bootLines.forEach((line,index)=>{


    line.style.opacity="0";


    setTimeout(()=>{


        line.style.opacity="1";


    },700 * index);


});






// SPACE TO START


document.addEventListener("keydown",(event)=>{


    if(event.code==="Space" && !started){


        started=true;


        startup.style.opacity="0";



        setTimeout(()=>{


            startup.style.display="none";


            app.style.opacity="1";


        },1000);


    }


});






// SIDEBAR


const menu=document.getElementById("menu");

const sidebar=document.getElementById("sidebar");



menu.onclick=()=>{


    sidebar.classList.toggle("collapsed");


};
