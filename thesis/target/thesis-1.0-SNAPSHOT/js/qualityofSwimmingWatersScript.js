window.onload = function () {
    chartAndTable();
};

let pollutionChart;
let stationChart;

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

function createPollutionOverTimeChart(data) {
    if (pollutionChart) {
        pollutionChart.destroy();
    }

    const pollutionTypes = ["plastic", "glass", "garbage", "tar"];
    const groupedData = {};

    data.forEach(({ sampleTimestamp, ...entry }) => {
        const date = new Date(sampleTimestamp).toLocaleDateString();
        if (!groupedData[date])
            groupedData[date] = {plastic: 0, glass: 0, garbage: 0, tar: 0};
        pollutionTypes.forEach(type => {
            if (entry[type] === "ΝΑΙ") {
                groupedData[date][type] += 1;
            }
        });
    });

    const labels = Object.keys(groupedData).sort();
    const datasets = pollutionTypes.map((type, index) => ({
            label: type.charAt(0).toUpperCase() + type.slice(1),
            data: labels.map(date => groupedData[date][type]),
            borderColor: ["red", "blue", "green", "purple"][index],
            fill: false
        }));

    const ctx = document.getElementById("Chart1").getContext("2d");
    pollutionChart = new Chart(ctx, {
        type: "line",
        data: {labels: labels, datasets: datasets},
        options: {
            responsive: true,
            plugins: {legend: {position: "top"}},
            scales: {
                x: {title: {display: true, text: "Date"}},
                y: {title: {display: true, text: "Number of 'ΝΑΙ' Responses"}}
            }
        }
    });
}

function createPollutionByStationChart(data) {
    if (stationChart) {
        stationChart.destroy();
    }

    const pollutionTypes = ["plastic", "glass", "garbage", "tar"];
    const groupedData = {};

    data.forEach(entry => {
        if (!groupedData[entry.stationcode]) {
            groupedData[entry.stationcode] = {plastic: 0, glass: 0, garbage: 0, tar: 0};
        }
        pollutionTypes.forEach(type => {
            if (entry[type] === "ΝΑΙ") {
                groupedData[entry.stationcode][type] += 1;
            }
        });
    });

    const labels = Object.keys(groupedData);
    const datasets = pollutionTypes.map((type, index) => ({
            label: type.charAt(0).toUpperCase() + type.slice(1),
            data: labels.map(station => groupedData[station][type]),
            backgroundColor: ["red", "blue", "green", "purple"][index]
        }));

    const ctx = document.getElementById("Chart2").getContext("2d");
    stationChart = new Chart(ctx, {
        type: "bar",
        data: {labels: labels, datasets: datasets},
        options: {
            responsive: true,
            plugins: {legend: {position: "top"}},
            scales: {
                x: {title: {display: true, text: "Station Code"}},
                y: {title: {display: true, text: "Number of 'ΝΑΙ' Responses"}}
            }
        }
    });
}

function createTable(data) {
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

    document.getElementById('table-container').innerHTML = table;
}

function loadAirdirection(data) {
    const airdirectionSet = new Set(data.map(item => item.airdirection));
    const airdirectionStations = [...airdirectionSet].sort();

    const airdirectionSelect = document.getElementById("airdirection-filter");
    airdirectionStations.forEach(airdirection => {
        let option = document.createElement("option");
        option.value = airdirection;
        option.textContent = airdirection;
        airdirectionSelect.appendChild(option);
    });
}

function loadCoast(data) {
    const coastSet = new Set(data.map(item => item.coast));
    const coastStations = [...coastSet].sort();

    const coastSelect = document.getElementById("coast-filter");
    coastStations.forEach(coast => {
        let option = document.createElement("option");
        option.value = coast;
        option.textContent = coast;
        coastSelect.appendChild(option);
    });
}

function loadMunicipal(data) {
    const municipalSet = new Set(data.map(item => item.municipal));
    const municipalStations = [...municipalSet].sort();

    const municipalSelect = document.getElementById("municipal-filter");
    municipalStations.forEach(municipal => {
        let option = document.createElement("option");
        option.value = municipal;
        option.textContent = municipal;
        municipalSelect.appendChild(option);
    });
}

function loadPerunit(data) {
    const perunitSet = new Set(data.map(item => item.perunit));
    const perunitStations = [...perunitSet].sort();

    const perunitSelect = document.getElementById("perunit-filter");
    perunitStations.forEach(perunit => {
        let option = document.createElement("option");
        option.value = perunit;
        option.textContent = perunit;
        perunitSelect.appendChild(option);
    });
}

function loadStationcode(data) {
    const stationcodeSet = new Set(data.map(item => item.stationcode));
    const stationcodeStations = [...stationcodeSet].sort();

    const stationcodeSelect = document.getElementById("stationcode-filter");
    stationcodeStations.forEach(stationcode => {
        let option = document.createElement("option");
        option.value = stationcode;
        option.textContent = stationcode;
        stationcodeSelect.appendChild(option);
    });
}

function loadWave(data) {
    const waveSet = new Set(data.map(item => item.wave));
    const waveStations = [...waveSet].sort();

    const waveSelect = document.getElementById("wave-filter");
    waveStations.forEach(wave => {
        let option = document.createElement("option");
        option.value = wave;
        option.textContent = wave;
        waveSelect.appendChild(option);
    });
}


function chartAndTable() {
    var dataType = "QualityofSwimmingWaters";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-500);

            createPollutionOverTimeChart(lastData);
            createPollutionByStationChart(lastData);
            createTable(lastData);
            loadAirdirection(data);
            loadCoast(data);
            loadMunicipal(data);
            loadPerunit(data);
            loadStationcode(data);
            loadWave(data);

            data.sort(function (a, b) {
                return new Date(a.sampleTimestamp) - new Date(b.sampleTimestamp);
            });

            const firstDate = new Date(data[0].sampleTimestamp);
            const lastDate = new Date(data[data.length - 1].sampleTimestamp);

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
            const minEcoli = document.getElementById('min-ecoli').value;
            const maxEcoli = document.getElementById('max-ecoli').value;
            const minΙntenterococci = document.getElementById('min-intenterococci').value;
            const maxΙntenterococci = document.getElementById('max-intenterococci').value;
            const airdirection = document.getElementById('airdirection-filter').value;
            const caoutchouc = document.getElementById('caoutchouc-filter').value;
            const coast = document.getElementById('coast-filter').value;
            const garbage = document.getElementById('garbage-filter').value;
            const glass = document.getElementById('glass-filter').value;
            const municipal = document.getElementById('municipal-filter').value;
            const perunit = document.getElementById('perunit-filter').value;
            const plastic = document.getElementById('plastic-filter').value;
            const rainfall = document.getElementById('rainfall-filter').value;
            const stationcode = document.getElementById('stationcode-filter').value;
            const tar = document.getElementById('tar-filter').value;
            const wave = document.getElementById('wave-filter').value;
            const yestrainfall = document.getElementById('yestrainfall-filter').value;

            filterSearch(startDate, endDate, minEcoli, maxEcoli, minΙntenterococci, maxΙntenterococci, airdirection, caoutchouc, coast, garbage, glass, municipal, perunit, plastic, rainfall, stationcode, tar, wave, yestrainfall);
        });
    }
});

function filterSearch(startDate, endDate, minEcoli, maxEcoli, minΙntenterococci, maxΙntenterococci, airdirection, caoutchouc, coast, garbage, glass, municipal, perunit, plastic, rainfall, stationcode, tar, wave, yestrainfall) {
    var dataType = "QualityofSwimmingWaters";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            createPollutionOverTimeChart(data);
            createPollutionByStationChart(data);
            createTable(data);
        } else {
            console.log(xhr.responseText);
        }
    };
    var url = 'FilterDataServlet?dataType=' + dataType + '&start-date=' + startDate + '&end-date=' + endDate;
    url += '&min-ecoli=' + minEcoli + '&max-ecoli=' + maxEcoli + '&min-intenterococci=' + minΙntenterococci;
    url += '&max-intenterococci=' + maxΙntenterococci + '&airdirection-filter=' + airdirection + '&caoutchouc-filter=' + caoutchouc;
    url += '&coast-filter=' + coast + '&garbage-filter=' + garbage + '&glass-filter=' + glass + '&municipal-filter=' + municipal;
    url += '&perunit-filter=' + perunit + '&plastic-filter=' + plastic + '&rainfall-filter=' + rainfall + '&stationcode-filter=' + stationcode;
    url += '&tar-filter=' + tar + '&wave-filter=' + wave + '&yestrainfall-filter=' + yestrainfall;
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}
