const startup = document.getElementById("startup");
const app = document.getElementById("app");

let started = false;
let mapLoaded = false;
let map;
let selectedMarker = null;





/* START DASHBOARD */


document.addEventListener("keydown", (event) => {


    if (event.code === "Space" && !started) {


        started = true;


        startup.style.opacity = "0";


        setTimeout(() => {


            startup.style.display = "none";


            app.style.opacity = "1";


            setTimeout(() => {

                initializeMap();

            }, 500);


        }, 1000);


    }


});





/* SIDEBAR */


const menu = document.getElementById("menu");
const sidebar = document.getElementById("sidebar");


menu.onclick = () => {

    sidebar.classList.toggle("collapsed");

};





/* MAP */


function initializeMap() {


    if (mapLoaded) return;


    mapLoaded = true;


    map = new maplibregl.Map({


        container: "map",


        style:
            "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",


        center: [0, 20],


        zoom: 1.5,


        pitch: 0,


        bearing: 0,


        antialias: true


    });


    map.addControl(

        new maplibregl.NavigationControl({

            visualizePitch: false

        })

    );


    const coordinates =
        document.getElementById("coordinates");





    /* LIVE COORDINATES */


    map.on("mousemove", (event) => {


        coordinates.innerHTML =

            "LAT: " +

            event.lngLat.lat.toFixed(5) +

            "<br>LON: " +

            event.lngLat.lng.toFixed(5);


    });





    /* CLICK MAP */


    map.on("click", (event) => {


        if (selectedMarker) {

            selectedMarker.remove();

        }


        selectedMarker = new maplibregl.Marker({

            color: "#00ffff"

        })

        .setLngLat(event.lngLat)

        .addTo(map);


        coordinates.innerHTML =

            "SELECTED" +

            "<br><br>LAT: " +

            event.lngLat.lat.toFixed(6) +

            "<br>LON: " +

            event.lngLat.lng.toFixed(6);


    });


}





/* SIDEBAR TOOL BUTTONS */


const toolButtons =
    document.querySelectorAll("nav button");


toolButtons.forEach((button) => {


    button.addEventListener("click", () => {


        const tool = button.dataset.tool;


        if (tool === "iplookup") {

            showIPLookup();

        }


        else if (tool === "map") {

            showMapTool();

        }


        else if (tool === "coordinates") {

            showCoordinatesTool();

        }


        else {

            showPlaceholder(tool);

        }


    });


});





/* IP LOOKUP TOOL */


function showIPLookup() {


    const title =
        document.getElementById("toolTitle");


    const content =
        document.getElementById("toolContent");


    title.textContent = "IP LOOKUP";


    content.innerHTML = `

        <div class="toolBox">


            <div class="toolLabel">

                ENTER IP ADDRESS

            </div>


            <input

                id="ipInput"

                class="toolInput"

                placeholder="Example: 8.8.8.8"

            >


            <button

                id="lookupButton"

                class="toolButton"

            >

                LOOKUP

            </button>


            <button

                id="myIPButton"

                class="toolButton"

            >

                MY IP

            </button>


            <div

                id="ipResults"

                class="results"

            >

                <div class="toolMessage">

                    ENTER AN IP ADDRESS AND PRESS LOOKUP,

                    OR SELECT MY IP.

                </div>

            </div>


        </div>

    `;


    const input =
        document.getElementById("ipInput");


    const button =
        document.getElementById("lookupButton");


    const myIPButton =
        document.getElementById("myIPButton");


    input.addEventListener("keydown", (event) => {


        if (event.key === "Enter") {

            lookupIP();

        }


    });


    button.addEventListener("click", lookupIP);


    myIPButton.addEventListener("click", getMyIP);


}





/* NORMAL IP LOOKUP */


async function lookupIP() {


    const input =
        document.getElementById("ipInput");


    const button =
        document.getElementById("lookupButton");


    const results =
        document.getElementById("ipResults");


    const query =
        input.value.trim();


    if (!query) {


        results.innerHTML = `

            <div class="toolMessage">

                PLEASE ENTER AN IP ADDRESS.

            </div>

        `;


        return;

    }


    button.disabled = true;

    button.textContent = "LOOKING UP...";


    results.innerHTML = `

        <div class="toolMessage">

            CONTACTING GEOLOCATION SERVICE...

        </div>

    `;


    try {


        const response = await fetch(

            `https://ipapi.co/${encodeURIComponent(query)}/json/`

        );


        if (!response.ok) {

            throw new Error("Lookup failed");

        }


        const data = await response.json();


        if (data.error) {

            throw new Error(

                data.reason || "Invalid IP address"

            );

        }


        displayIPResults(data);


    }


    catch (error) {


        results.innerHTML = `

            <div class="toolMessage">

                LOOKUP FAILED.

                <br><br>

                ${error.message}

            </div>

        `;


    }


    finally {


        button.disabled = false;

        button.textContent = "LOOKUP";


    }


}





/* GET MY PUBLIC IP */


async function getMyIP() {


    const input =
        document.getElementById("ipInput");


    const myIPButton =
        document.getElementById("myIPButton");


    const results =
        document.getElementById("ipResults");


    myIPButton.disabled = true;

    myIPButton.textContent = "DETECTING...";


    results.innerHTML = `

        <div class="toolMessage">

            DETECTING PUBLIC IP ADDRESS...

        </div>

    `;


    try {


        const response = await fetch(

            "https://ipapi.co/json/"

        );


        if (!response.ok) {

            throw new Error("Could not detect public IP");

        }


        const data = await response.json();


        if (data.error || !data.ip) {

            throw new Error(

                data.reason || "Could not detect public IP"

            );

        }


        input.value = data.ip;


        displayIPResults(data);


    }


    catch (error) {


        results.innerHTML = `

            <div class="toolMessage">

                MY IP LOOKUP FAILED.

                <br><br>

                ${error.message}

            </div>

        `;


    }


    finally {


        myIPButton.disabled = false;

        myIPButton.textContent = "MY IP";


    }


}





/* DISPLAY IP RESULTS */


function displayIPResults(data) {


    const results =
        document.getElementById("ipResults");


    const latitude =
        data.latitude ?? "N/A";


    const longitude =
        data.longitude ?? "N/A";


    results.innerHTML = `

        <div class="results">


            <div class="resultRow">

                <span class="resultLabel">

                    IP ADDRESS

                </span>


                <span class="resultValue">

                    ${data.ip || "N/A"}

                </span>

            </div>


            <div class="resultRow">

                <span class="resultLabel">

                    VERSION

                </span>


                <span class="resultValue">

                    ${data.version || "N/A"}

                </span>

            </div>


            <div class="resultRow">

                <span class="resultLabel">

                    COUNTRY

                </span>


                <span class="resultValue">

                    ${data.country_name || "N/A"}

                </span>

            </div>


            <div class="resultRow">

                <span class="resultLabel">

                    REGION

                </span>


                <span class="resultValue">

                    ${data.region || "N/A"}

                </span>

            </div>


            <div class="resultRow">

                <span class="resultLabel">

                    CITY

                </span>


                <span class="resultValue">

                    ${data.city || "N/A"}

                </span>

            </div>


            <div class="resultRow">

                <span class="resultLabel">

                    ISP

                </span>


                <span class="resultValue">

                    ${data.org || "N/A"}

                </span>

            </div>


            <div class="resultRow">

                <span class="resultLabel">

                    ASN

                </span>


                <span class="resultValue">

                    ${data.asn || "N/A"}

                </span>

            </div>


            <div class="resultRow">

                <span class="resultLabel">

                    TIMEZONE

                </span>


                <span class="resultValue">

                    ${data.timezone || "N/A"}

                </span>

            </div>


            <div class="resultRow">

                <span class="resultLabel">

                    LATITUDE

                </span>


                <span class="resultValue">

                    ${latitude}

                </span>

            </div>


            <div class="resultRow">

                <span class="resultLabel">

                    LONGITUDE

                </span>


                <span class="resultValue">

                    ${longitude}

                </span>

            </div>


            <button

                id="showOnMapButton"

                class="toolButton"

            >

                SHOW ON MAP

            </button>


            <button

                id="copyResultsButton"

                class="toolButton"

            >

                COPY RESULTS

            </button>


        </div>

    `;


    document

        .getElementById("showOnMapButton")

        .addEventListener("click", () => {


            if (

                typeof data.latitude === "number" &&

                typeof data.longitude === "number"

            ) {


                showIPOnMap(

                    data.latitude,

                    data.longitude,

                    data.ip

                );

            }


        });


    document

        .getElementById("copyResultsButton")

        .addEventListener("click", () => {


            const text = `

IP ADDRESS: ${data.ip || "N/A"}

VERSION: ${data.version || "N/A"}

COUNTRY: ${data.country_name || "N/A"}

REGION: ${data.region || "N/A"}

CITY: ${data.city || "N/A"}

ISP: ${data.org || "N/A"}

ASN: ${data.asn || "N/A"}

TIMEZONE: ${data.timezone || "N/A"}

LATITUDE: ${latitude}

LONGITUDE: ${longitude}

            `.trim();


            navigator.clipboard.writeText(text);


        });


}





/* SHOW IP LOCATION ON MAP */


function showIPOnMap(latitude, longitude, ip) {


    if (!map) return;


    map.flyTo({

        center: [longitude, latitude],

        zoom: 8,

        pitch: 0,

        duration: 1500

    });


    if (selectedMarker) {

        selectedMarker.remove();

    }


    selectedMarker = new maplibregl.Marker({

        color: "#00ff88"

    })


    .setLngLat([longitude, latitude])

    .addTo(map);


    document.getElementById("coordinates").innerHTML =

        "IP LOCATION" +

        "<br><br>IP: " +

        ip +

        "<br>LAT: " +

        latitude.toFixed(6) +

        "<br>LON: " +

        longitude.toFixed(6);


}





/* MAP TOOL */


function showMapTool() {


    document.getElementById("toolTitle")

        .textContent = "MAP";


    document.getElementById("toolContent")

        .innerHTML = `

            <div class="toolMessage">

                CLICK ANYWHERE ON THE MAP TO

                SELECT A LOCATION.

                <br><br>

                LIVE COORDINATES ARE DISPLAYED

                IN THE MAP PANEL.

            </div>

        `;


}





/* COORDINATES TOOL */


function showCoordinatesTool() {


    document.getElementById("toolTitle")

        .textContent = "COORDINATES";


    document.getElementById("toolContent")

        .innerHTML = `

            <div class="toolMessage">

                CLICK A LOCATION ON THE MAP

                TO VIEW ITS LATITUDE AND LONGITUDE.

                <br><br>

                COORDINATE CONVERSION TOOLS

                WILL BE ADDED HERE.

            </div>

        `;


}





/* PLACEHOLDER TOOLS */


function showPlaceholder(tool) {


    document.getElementById("toolTitle")

        .textContent = tool.toUpperCase();


    document.getElementById("toolContent")

        .innerHTML = `

            <div class="placeholder">

                MODULE NOT YET INITIALIZED

            </div>

        `;


}
