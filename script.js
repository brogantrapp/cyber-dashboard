const startup = document.getElementById("startup");
const app = document.getElementById("app");

let started = false;
let mapLoaded = false;



// START DASHBOARD

document.addEventListener("keydown",(event)=>{


    if(event.code==="Space" && !started){


        started=true;


        startup.style.opacity="0";


        setTimeout(()=>{


            startup.style.display="none";


            app.style.opacity="1";


            setTimeout(()=>{

                initializeMap();

            },800);



        },1000);



    }


});





// SIDEBAR

const menu=document.getElementById("menu");

const sidebar=document.getElementById("sidebar");


menu.onclick=()=>{

    sidebar.classList.toggle("collapsed");

};







// MAP INITIALIZATION

function initializeMap(){


if(mapLoaded) return;


mapLoaded=true;



const map = new maplibregl.Map({


    container:"map",


    style:
    "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",


    center:[0,25],


    zoom:1.6,


    pitch:25,


    bearing:0,


    projection:"globe",


    antialias:true



});






// CONTROLS

map.addControl(

new maplibregl.NavigationControl({

    visualizePitch:true

})

);





// GLOBE SETTINGS

map.on("style.load",()=>{


    map.setProjection({

        type:"globe"

    });


});





// ATMOSPHERE

map.on("load",()=>{


    map.setFog({


        color:"rgb(5,5,10)",


        "high-color":"rgb(20,40,80)",


        "space-color":"rgb(0,0,0)",


        "horizon-blend":0.05



    });



    map.easeTo({

        pitch:35,

        duration:1500

    });



});






const coordinates=document.getElementById("coordinates");





// LIVE COORDINATES

map.on("mousemove",(e)=>{


coordinates.innerHTML=


"LAT: "

+e.lngLat.lat.toFixed(5)

+

"<br>LON: "

+e.lngLat.lng.toFixed(5);



});







// CLICK MARKER

map.on("click",(e)=>{


new maplibregl.Marker({

    color:"#00ffff"

})


.setLngLat(e.lngLat)


.addTo(map);





coordinates.innerHTML=


"SELECTED"

+

"<br><br>LAT: "

+e.lngLat.lat.toFixed(6)

+

"<br>LON: "

+e.lngLat.lng.toFixed(6);



});






// BETTER GLOBE ROTATION FEEL

map.on("dragend",()=>{


map.easeTo({

    duration:500

});


});



}
