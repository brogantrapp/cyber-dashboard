const startup = document.getElementById("startup");
const app = document.getElementById("app");

const startupGif = document.getElementById("startupGif");
const idleGif = document.getElementById("idleGif");
const startText = document.getElementById("startText");


let started = false;




// PLAY INTRO THEN IDLE SCREEN


setTimeout(()=>{


startupGif.style.display="none";


idleGif.style.display="block";


startText.style.display="block";


},700);







// START DASHBOARD


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
