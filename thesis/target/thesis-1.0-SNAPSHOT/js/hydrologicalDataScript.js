window.onload = function () {
    chartAndTable();
};

let waterChart;
let temperatureChart;

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
function createWaterChart(data) {
    if (waterChart) {
        waterChart.destroy();
    }

    const groupedData = {};
    data.forEach(({ station, damVolume, waterLevel }) => {
        if (!groupedData[station]) {
            groupedData[station] = {damVolume: 0, waterLevel: 0};
        }
        groupedData[station].damVolume = damVolume;
        groupedData[station].waterLevel = waterLevel;
    });

    const stations = Object.keys(groupedData);

    const ctx = document.getElementById('Chart1').getContext('2d');
    waterChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: stations,
            datasets: [
                {
                    label: "Water Level (m)",
                    data: stations.map(station => groupedData[station].waterLevel),
                    backgroundColor: "blue"
                },
                {
                    label: "Dam Volume (m³)",
                    data: stations.map(station => groupedData[station].damVolume),
                    backgroundColor: "green"
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {legend: {position: "top"}},
            scales: {
                x: {title: {display: true, text: "Station"}},
                y: {title: {display: true, text: "Value"}}
            }
        }
    });
}

function createTemperatureChart(data) {
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    const groupedData = {};
    data.forEach(({ timestamp, temperature, conductivity, station }) => {
        const date = new Date(timestamp).toLocaleDateString();
        if (!groupedData[station]) {
            groupedData[station] = {dates: [], temperature: [], conductivity: []};
        }
        groupedData[station].dates.push(date);
        groupedData[station].temperature.push(temperature);
        groupedData[station].conductivity.push(conductivity);
    });

    const stations = Object.keys(groupedData);
    const dates = [...new Set(data.map(d => new Date(d.timestamp).toLocaleDateString()))].sort();

    const ctx = document.getElementById('Chart2').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: stations.flatMap((station, i) => [
                    {
                        label: `${station} - Temperature (°C)`,
                        data: groupedData[station].temperature,
                        borderColor: ["red", "blue", "green"][i % 3],
                        fill: false,
                        yAxisID: "y-temp"
                    },
                    {
                        label: `${station} - Conductivity (μS/cm)`,
                        data: groupedData[station].conductivity,
                        borderColor: ["orange", "purple", "cyan"][i % 3],
                        fill: false,
                        yAxisID: "y-cond"
                    }
                ])
        },
        options: {
            responsive: true,
            plugins: {legend: {position: "top"}},
            scales: {
                x: {title: {display: true, text: "Date"}},
                y: {
                    title: {display: true, text: "Temperature (°C)"},
                    position: "left",
                    id: "y-temp"
                },
                y1: {
                    title: {display: true, text: "Conductivity (μS/cm)"},
                    position: "right",
                    id: "y-cond",
                    grid: {drawOnChartArea: false}
                }
            }
        }
    });
}

function createTable(data) {
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
    document.getElementById('table-container').innerHTML = table;
}

function loadStations(data) {
    const stationSet = new Set(data.map(item => item.station));
    const sortedStations = [...stationSet].sort();

    const fuelSelect = document.getElementById("station-filter");
    sortedStations.forEach(station => {
        let option = document.createElement("option");
        option.value = station;
        option.textContent = station;
        fuelSelect.appendChild(option);
    });
}

function loadFrequency(data) {
    const FrequencySet = new Set(data.map(item => item.frequency));
    const sortedStations = [...FrequencySet].sort();

    const fuelSelect = document.getElementById("frequency-filter");
    sortedStations.forEach(Frequency => {
        let option = document.createElement("option");
        option.value = Frequency;
        option.textContent = Frequency;
        fuelSelect.appendChild(option);
    });
}

function chartAndTable() {
    var dataType = "HydrologicalData";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            createWaterChart(lastData);
            createTemperatureChart(data.slice(-100));
            createTable(lastData);
            loadStations(data);
            loadFrequency(data);
            data.sort(function (a, b) {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });

            const firstDate = new Date(data[0].timestamp);
            const lastDate = new Date(data[data.length - 1].timestamp);

            const minDate = formatDate(firstDate);
            const maxDate = formatDate(lastDate);

            flatpickr(".date-input", {
                dateFormat: "d/m/Y",
                minDate: minDate,
                maxDate: maxDate
            });
        } else {
            var response = xhr.responseText;
            console.log(response);
        }
    };
    var url = 'GetAllData?dataType=' + dataType;
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const filterButton = document.getElementById('search-button');
    if (filterButton) {
        filterButton.addEventListener('click', function () {
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const minConductivity = document.getElementById('min-conductivity').value;
            const maxConductivity = document.getElementById('max-conductivity').value;
            const minDamVol = document.getElementById('min-damVolume').value;
            const maxDamVol = document.getElementById('max-damVolume').value;
            const frequency = document.getElementById('frequency-filter').value;
            const station = document.getElementById('station-filter').value;
            const minTemperature = document.getElementById('min-temperature').value;
            const maxTemperature = document.getElementById('max-temperature').value;
            const minWaterDepth = document.getElementById('min-waterDepth').value;
            const maxWaterDepth = document.getElementById('max-waterDepth').value;
            const minWaterLevel = document.getElementById('min-waterLevel').value;
            const maxWaterLevel = document.getElementById('max-waterLevel').value;

            filterSearch(startDate, endDate, minConductivity, maxConductivity, minDamVol, maxDamVol, frequency, station, minTemperature, maxTemperature, minWaterDepth, maxWaterDepth, minWaterLevel, maxWaterLevel);
        });
    }
});

function filterSearch(startDate, endDate, minConductivity, maxConductivity, minDamVol, maxDamVol, frequency, station, minTemperature, maxTemperature, minWaterDepth, maxWaterDepth, minWaterLevel, maxWaterLevel) {
    var dataType = "HydrologicalData";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            createWaterChart(data);
            createTemperatureChart(data);
            createTable(data);
        } else {
            console.log(xhr.responseText);
        }
    };
    var url = 'FilterDataServlet?dataType=' + dataType + '&start-date=' + startDate + '&end-date=' + endDate;
    url += '&min-conductuvity=' + minConductivity + '&max-conductuvity=' + maxConductivity + '&min-damVol=' + minDamVol;
    url += '&max-damVol=' + maxDamVol + '&frequency-filter=' + frequency + '&station-filter=' + station + '&min-temperature=' + minTemperature;
    url += '&max-temperature=' + maxTemperature + '&min-waterDepth=' + minWaterDepth + '&max-waterDepth=' + maxWaterDepth;
    url += '&min-waterLevel=' + minWaterLevel + '&max-waterLevel=' + maxWaterLevel;
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}