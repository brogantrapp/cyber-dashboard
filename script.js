const startup = document.getElementById("startup");
const app = document.getElementById("app");

let started = false;



document.addEventListener("keydown",(event)=>{


if(event.code==="Space" && !started){


started=true;


startup.style.opacity="0";


setTimeout(()=>{


startup.style.display="none";


app.style.opacity="1";


setTimeout(()=>{

initializeMap();

},500);



},1000);



}


});






// SIDEBAR


const menu=document.getElementById("menu");

const sidebar=document.getElementById("sidebar");


menu.onclick=()=>{


sidebar.classList.toggle("collapsed");


};







// MAP


function initializeMap(){


const map = new maplibregl.Map({

container:"map",

style:"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",

center:[0,20],

zoom:1.5,

projection:{
    type:"globe"
}

});



map.on("style.load",()=>{

    map.setProjection({
        type:"globe"
    });

});


const coordinates=document.getElementById("coordinates");



map.on("mousemove",(e)=>{


coordinates.innerHTML=

"LAT: "+
e.lngLat.lat.toFixed(5)+

"<br>LON: "+

e.lngLat.lng.toFixed(5);


});




map.on("click",(e)=>{


new maplibregl.Marker({

color:"#00ff88"

})

.setLngLat(e.lngLat)

.addTo(map);



coordinates.innerHTML=

"SELECTED<br><br>LAT: "+

e.lngLat.lat.toFixed(6)+

"<br>LON: "+

e.lngLat.lng.toFixed(6);



});


}
