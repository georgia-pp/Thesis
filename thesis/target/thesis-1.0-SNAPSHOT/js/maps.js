var map = L.map('map').setView([39.0742, 21.8243], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var cities = [
    {name: "Αθήνα", lat: 37.9838, lon: 23.7275},
    {name: "Θεσσαλονίκη", lat: 40.6401, lon: 22.9444},
    {name: "Πάτρα", lat: 38.2466, lon: 21.7343},
    {name: "Ηράκλειο", lat: 35.3387, lon: 25.1442},
    {name: "Λάρισα", lat: 39.6400, lon: 22.4154},
    {name: "Βόλος", lat: 39.3667, lon: 22.9500},
    {name: "Ιωάννινα", lat: 39.6676, lon: 20.8555},
    {name: "Καβάλα", lat: 40.9397, lon: 24.4181},
    {name: "Χανιά", lat: 35.5131, lon: 24.0184},
    {name: "Ρόδος", lat: 36.4349, lon: 28.2176},
    {name: "Ρέθυμνο", lat: 35.3660, lon: 24.4760},
    {name: "Άγιος Νικόλαος", lat: 35.1900, lon: 25.7220},
    {name: "Χίος", lat: 38.3670, lon: 26.1358},
    {name: "Σαντορίνη", lat: 36.3932, lon: 25.4615},
    {name: "Κέρκυρα", lat: 39.6247, lon: 19.9208},
    {name: "Τρίπολη", lat: 37.5083, lon: 22.4112},
    {name: "Καλαμάτα", lat: 37.0382, lon: 22.1140}
];

cities.forEach(function (city) {
    L.marker([city.lat, city.lon])
            .addTo(map)
            .bindPopup(`<b>${city.name}</b>`)
            .on('click', function () {
                document.getElementById('result-container').innerHTML = '';
                findAreas(city.name, "ElectricityConsumption");
                findAreas(city.name, "HydrologicalData");
                findAreas(city.name, "ParcelsofLand");
                findAreas(city.name, "QualityofSwimmingWaters");
            });
});

function findAreas(region, dataType) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            if (data) {
                var results = '<div class="col-3"><div class="card card-flush h-md-100 no-hover">';
                results += '<div class="card-header pt-5" id="category_title">';
                results += `<h2>${dataType}</h2>${filterButton(dataType)}</div>`;
                results += '<div class="card-body pt-6" style="max-height: 400px; overflow-y: auto;">';
                results += '<div  id="category">';
                results += `${createTable(data, dataType)}`;
                results += '</div></div></div></div>';

                document.getElementById('result-container').innerHTML += results;
            }

        } else {
            var response = xhr.responseText;
            console.log(response);
        }
    };
    var url = 'MapDataServlet?dataType=' + dataType + '&region=' + region;
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}

function createTable(data, dataType) {
    if (dataType === "ElectricityConsumption") {
        var table = '<table class="table"><thead><tr><th>Area</th><th>Date</th><th>Energy (MWh)</th></tr></thead><tbody>';
        data.forEach(function (item) {
            table += '<tr>';
            table += '<td>' + item.area + '</td>';
            table += '<td>' + item.date + '</td>';
            table += '<td>' + item.energy_mwh + '</td>';
            table += '</tr>';
        });

        table += '</tbody></table>';

    } else if (dataType === "HydrologicalData") {
        var table = '<table class="table"><thead><tr><th>Date</th><th>Conductivity</th><th>DamVolume</th><th>Frequency</th><th>Station</th><th>Temperature</th><th>WaterDepth</th><th>WaterDepth</th></tr></thead><tbody>';
        data.forEach(function (item) {
            table += '<tr>';
            table += '<td>' + item.timestamp + '</td>';
            table += '<td>' + item.conductivity + '</td>';
            table += '<td>' + item.damVolume + '</td>';
            table += '<td>' + item.frequency + '</td>';
            table += '<td>' + item.station + '</td>';
            table += '<td>' + item.temperature + '</td>';
            table += '<td>' + item.waterDepth + '</td>';
            table += '<td>' + item.waterLevel + '</td>';

            table += '</tr>';
        });

        table += '</tbody></table>';
    } else if (dataType === "ParcelsofLand") {
        var table = '<table class="table"><thead><tr><th>Date</th><th>Ota ID</th><th>Ota Name</th><th>Ota Name (en)</th><th>Plots</th></tr></thead><tbody>';
        data.forEach(function (item) {
            table += '<tr>';
            table += '<td>' + item.date + '</td>';
            table += '<td>' + item.otaId + '</td>';
            table += '<td>' + item.otaName + '</td>';
            table += '<td>' + item.otaNameEn + '</td>';
            table += '<td>' + item.plots + '</td>';
            table += '</tr>';
        });

        table += '</tbody></table>';
    } else if (dataType === "QualityofSwimmingWaters") {
        var table = '<table class="table"><thead><tr>' +
                '<th>Air Direction</th><th>Caoutchouc</th>' +
                '<th>Coast</th><th>Description</th>' +
                '<th>E. coli</th><th>Garbage</th><th>Glass</th>' +
                '<th>Intenterococci</th><th>Municipal</th><th>Per Unit</th>' +
                '<th>Plastic</th><th>Rainfall</th><th>Sample Timestamp</th>' +
                '<th>Station Code</th><th>Tar</th><th>Wave</th><th>Yesterday Rainfall</th>' +
                '</tr></thead><tbody>';

        data.forEach(function (item) {
            table += '<tr>';
            table += '<td>' + item.airdirection + '</td>';
            table += '<td>' + item.caoutchouc + '</td>';
            table += '<td>' + item.coast + '</td>';
            table += '<td>' + item.description + '</td>';
            table += '<td>' + item.ecoli + '</td>';
            table += '<td>' + item.garbage + '</td>';
            table += '<td>' + item.glass + '</td>';
            table += '<td>' + item.intenterococci + '</td>';
            table += '<td>' + item.municipal + '</td>';
            table += '<td>' + item.perunit + '</td>';
            table += '<td>' + item.plastic + '</td>';
            table += '<td>' + item.rainfall + '</td>';
            table += '<td>' + item.sampleTimestamp + '</td>';
            table += '<td>' + item.stationcode + '</td>';
            table += '<td>' + item.tar + '</td>';
            table += '<td>' + item.wave + '</td>';
            table += '<td>' + item.yestrainfall + '</td>';
            table += '</tr>';
        });

        table += '</tbody></table>';
    }

    return table;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-button").addEventListener("click", function () {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        login(username, password);
    });

    function login(username, password) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Σύνδεση επιτυχής!");
                window.location.href = "administrator.html";
            } else {
                console.log("Αποτυχία σύνδεσης:", xhr.responseText);
                alert("Λάθος username ή password.");
            }
        };

        xhr.open("POST", "LoginServlet");
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({username: username, password: password});
        console.log(data);
        xhr.send(data);
    }
});


function filterButton(dataType) {
    var button = '<div class="dropdown d-grid gap-2 d-md-flex justify-content-md-end">';
    button += '<button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">';
    button += '<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/></svg>';
    button += '</button><div class="dropdown-menu">';

    switch (dataType) {
        case "ElectricityConsumption":
            button += '<div class="dropdown-item">';
            button += '<label for="start-date">Αρχική Ημ/νία</label>';
            button += '<div class="date-wrapper">';
            button += '<svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">';
            button += '<path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>';
            button += '</svg>';
            button += '<input type="text" id="start-date" class="form-control date-input" placeholder="dd/mm/YYYY">';
            button += '</div></div>';
            button += '<div class="dropdown-item">';
            button += '<label for="end-date">Τελική Ημ/νία</label>';
            button += '<div class="date-wrapper">';
            button += '<svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">';
            button += '<path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>';
            button += '</svg>';
            button += '<input type="text" id="end-date" class="form-control date-input" placeholder="dd/mm/YYYY">';
            button += '</div></div>';
            button += '<div class="dropdown-item">';
            button += '<label for="area-filter">Περιοχή:</label>';
            button += '<select class="form-select" aria-label="AreaSelection" id="area-filter">';
            button += '<option selected value="all">Όλες</option>';
            button += '</select>';
            button += '</div>';
            button += '<div class="dropdown-item">';
            button += '<label for="min-energy">Ελάχιστη ενέργεια:</label>';
            button += '<input type="number" class="form-control" id="min-energy" placeholder="Min">';
            button += '</div>';
            button += '<div class="dropdown-item">';
            button += '<label for="max-energy">Μέγιστη ενέργεια:</label>';
            button += '<input type="number" class="form-control" id="max-energy" placeholder="Max">';
            button += '</div>';
            button += '<br>';
            button += '<div class="d-grid gap-2 col-6 mx-auto">';
            button += '<button id="search-button" class="btn btn-primary">Search</button>';
            button += '</div>';
            button += '<br>';
            break;
        case "EnergyBalance":
            button += `
        <div class="dropdown-item">
            <label for="start-date">Αρχική Ημ/νία</label>
            <div class="date-wrapper">
                <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                </svg>
                <input type="text" id="start-date" class="form-control date-input" placeholder="dd/mm/YYYY">
            </div>
        </div>
        <div class="dropdown-item">
            <label for="end-date">Τελική Ημ/νία</label>
            <div class="date-wrapper">
                <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                </svg>
                <input type="text" id="end-date" class="form-control date-input" placeholder="dd/mm/YYYY">
            </div>
        </div>
        <div class="dropdown-item">
            <label for="fuel-filter">Καύσιμο:</label>
            <select class="form-select" aria-label="FuelSelection" id="fuel-filter">
                <option selected value="all">Όλες</option>
            </select>
        </div>
        <div class="dropdown-item">
            <label for="min-energy">Ελάχιστη ενέργεια:</label>
            <input type="number" class="form-control" id="min-energy" placeholder="Min">
        </div>
        <div class="dropdown-item">
            <label for="max-energy">Μέγιστη ενέργεια:</label>
            <input type="number" class="form-control" id="max-energy" placeholder="Max"> 
        </div>
        <div class="dropdown-item">
            <label for="min-percentage">Ελάχιστο ποσοστό:</label>
            <input type="number" class="form-control" id="min-percentage" placeholder="Min">
        </div>
        <div class="dropdown-item">
            <label for="max-percentage">Μέγιστο ποσοστό:</label>
            <input type="number" class="form-control" id="max-percentage" placeholder="Max"> 
        </div>
        <br>
        <div class="d-grid gap-2 col-6 mx-auto">
            <button id="search-button" class="btn btn-primary">Search</button>
        </div>
        <br>
    `;
            break;
        case "EnergySystemLoad":
            button += `
            <div class="dropdown-item">
                                                <label for="start-date">Αρχική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>

                                                    <input type="text" id="start-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="end-date">Τελική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>
                                                    <input type="text" id="end-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="min-energy">Ελάχιστη ενέργεια:</label>
                                                <input type="number" class="form-control"id="min-energy" placeholder="Min">
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="max-energy">Μέγιστη ενέργεια:</label>
                                                <input type="number" class="form-control" id="max-energy" placeholder="Max"> 
                                            </div>
                                            <br>
                                            <div class="d-grid gap-2 col-6 mx-auto">
                                                <button id="search-button" class="btn btn-primary">Search</button>
                                            </div>
                                            <br>`;
            break;
        case "HydrologicalData":
            button += `
<div class="dropdown-item">
                                                <label for="start-date">Αρχική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>

                                                    <input type="text" id="start-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="end-date">Τελική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>
                                                    <input type="text" id="end-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="min-conductivity">Ελάχιστη conductivity:</label>
                                                        <input type="number" class="form-control"id="min-conductivity" placeholder="Min">
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="max-conductivity">Μέγιστη conductivity:</label>
                                                        <input type="number" class="form-control" id="max-conductivity" placeholder="Max"> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="min-damVolume">Ελάχιστη damVolume:</label>
                                                        <input type="number" class="form-control"id="min-damVolume" placeholder="Min">
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="max-damVolume">Μέγιστη damVolume:</label>
                                                        <input type="number" class="form-control" id="max-damVolume" placeholder="Max"> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="min-temperature">Ελάχιστη temperature:</label>
                                                        <input type="number" class="form-control"id="min-temperature" placeholder="Min">
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="max-temperature">Μέγιστη temperature:</label>
                                                        <input type="number" class="form-control" id="max-temperature" placeholder="Max"> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="min-waterDepth">Ελάχιστη waterDepth:</label>
                                                        <input type="number" class="form-control"id="min-waterDepth" placeholder="Min">
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="max-waterDepth">Μέγιστη waterDepth:</label>
                                                        <input type="number" class="form-control" id="max-waterDepth" placeholder="Max"> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="min-waterLevel">Ελάχιστη waterLevel:</label>
                                                        <input type="number" class="form-control"id="min-waterLevel" placeholder="Min">
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="max-waterLevel">Μέγιστη waterLevel:</label>
                                                        <input type="number" class="form-control" id="max-waterLevel" placeholder="Max"> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="frequency-filter">frequency:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="frequency-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="station-filter">station:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="station-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <br>
                                            <div class="d-grid gap-2 col-6 mx-auto">
                                                <button id="search-button" class="btn btn-primary">Search</button>
                                            </div>
                                            <br>`;
            break;
        case "ParcelsofLand":
            button += `
            <div class="dropdown-item">
                                                <label for="start-date">Αρχική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>

                                                    <input type="text" id="start-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="end-date">Τελική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>
                                                    <input type="text" id="end-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="min-plots">Ελάχιστη plot:</label>
                                                <input type="number" class="form-control"id="min-plots" placeholder="Min">
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="max-plots">Μέγιστη plot:</label>
                                                <input type="number" class="form-control" id="max-plots" placeholder="Max"> 
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="otaName-filter">otaName:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="otaName-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <br>
                                            <div class="d-grid gap-2 col-6 mx-auto">
                                                <button id="search-button" class="btn btn-primary">Search</button>
                                            </div>
                                            <br>`;
            break;
        case "ProtectedAreaPlots":
            button += `
            <div class="dropdown-item">
                                                <label for="start-date">Αρχική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>

                                                    <input type="text" id="start-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="end-date">Τελική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>
                                                    <input type="text" id="end-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="min-plots">Ελάχιστη plot:</label>
                                                <input type="number" class="form-control"id="min-plots" placeholder="Min">
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="max-plots">Μέγιστη plot:</label>
                                                <input type="number" class="form-control" id="max-plots" placeholder="Max"> 
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="area-filter">Area:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="area-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <br>
                                            <div class="d-grid gap-2 col-6 mx-auto">
                                                <button id="search-button" class="btn btn-primary">Search</button>
                                            </div>
                                            <br>`;
            break;
        case "QualityofSwimmingWaters":
            button += `
            <div class="dropdown-item">
                                                <label for="start-date">Αρχική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>

                                                    <input type="text" id="start-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="end-date">Τελική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>
                                                    <input type="text" id="end-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="min-ecoli">Ελάχιστη ecoli:</label>
                                                        <input type="number" class="form-control"id="min-ecoli" placeholder="Min">
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="max-ecoli">Μέγιστη ecoli:</label>
                                                        <input type="number" class="form-control" id="max-ecoli" placeholder="Max"> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="min-intenterococci">Ελάχιστη intenterococci:</label>
                                                        <input type="number" class="form-control"id="min-intenterococci" placeholder="Min">
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="dropdown-item">
                                                        <label for="max-intenterococci">Μέγιστη intenterococci:</label>
                                                        <input type="number" class="form-control" id="max-intenterococci" placeholder="Max"> 
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="dropdown-item">
                                                <label for="airdirection-filter">airdirection:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="airdirection-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="caoutchouc-filter">caoutchouc:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="caoutchouc-filter">
                                                    <option selected value="all">Όλες</option>
                                                    <option value="ΝΑΙ">ΝΑΙ</option>
                                                    <option value="ΟΧΙ">ΟΧΙ</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="coast-filter">coast:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="coast-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="garbage-filter">garbage:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="garbage-filter">
                                                    <option selected value="all">Όλες</option>
                                                    <option value="ΝΑΙ">ΝΑΙ</option>
                                                    <option value="ΟΧΙ">ΟΧΙ</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="glass-filter">glass:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="glass-filter">
                                                    <option selected value="all">Όλες</option>
                                                    <option value="ΝΑΙ">ΝΑΙ</option>
                                                    <option value="ΟΧΙ">ΟΧΙ</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="municipal-filter">municipal:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="municipal-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="perunit-filter">perunit:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="perunit-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="plastic-filter">plastic:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="plastic-filter">
                                                    <option selected value="all">Όλες</option>
                                                    <option value="ΝΑΙ">ΝΑΙ</option>
                                                    <option value="ΟΧΙ">ΟΧΙ</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="rainfall-filter">rainfall:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="rainfall-filter">
                                                    <option selected value="all">Όλες</option>
                                                    <option value="ΝΑΙ">ΝΑΙ</option>
                                                    <option value="ΟΧΙ">ΟΧΙ</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="stationcode-filter">stationcode:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="stationcode-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="tar-filter">tar:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="tar-filter">
                                                    <option selected value="all">Όλες</option>
                                                    <option value="ΝΑΙ">ΝΑΙ</option>
                                                    <option value="ΟΧΙ">ΟΧΙ</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="wave-filter">wave:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="wave-filter">
                                                    <option selected value="all">Όλες</option>
                                                </select>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="yestrainfall-filter">yestrainfall:</label>
                                                <select class="form-select" aria-label="AreaSelection" id="yestrainfall-filter">
                                                    <option selected value="all">Όλες</option>
                                                    <option value="ΝΑΙ">ΝΑΙ</option>
                                                    <option value="ΟΧΙ">ΟΧΙ</option>
                                                </select>
                                            </div>
                                            <br>
                                            <div class="d-grid gap-2 col-6 mx-auto">
                                                <button id="search-button" class="btn btn-primary">Search</button>
                                            </div>

                                            <br>`;
            break;
        case "RenewableEnergySources":
            button += `
            <div class="dropdown-item">
                                                <label for="start-date">Αρχική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>

                                                    <input type="text" id="start-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="end-date">Τελική Ημ/νία</label>
                                                <div class="date-wrapper">
                                                    <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777">
                                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                                    </svg>
                                                    <input type="text" id="end-date" class="form-control date-input" placeholder="dd/mm/YYYY">
                                                </div>
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="min-energy">Ελάχιστη ενέργεια:</label>
                                                <input type="number" class="form-control"id="min-energy" placeholder="Min">
                                            </div>
                                            <div class="dropdown-item">
                                                <label for="max-energy">Μέγιστη ενέργεια:</label>
                                                <input type="number" class="form-control" id="max-energy" placeholder="Max"> 
                                            </div>
                                            <br>
                                            <div class="d-grid gap-2 col-6 mx-auto">
                                                <button id="search-button" class="btn btn-primary">Search</button>
                                            </div>
                                            <br>`;
            break;
    }

    button += '</div></div>';
    return button;
}                    