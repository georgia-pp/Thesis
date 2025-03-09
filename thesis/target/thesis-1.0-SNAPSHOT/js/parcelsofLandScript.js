window.onload = function () {
    chartAndTable();
};

let plotChart;
let otaChart;

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

function createPlotChart(data) {
    if (plotChart) {
        plotChart.destroy();
    }

    const timestamps = data.map(item => item.date);
    const damVolumes = data.map(item => parseFloat(item.plots));

    const ctx = document.getElementById('Chart1').getContext('2d');
    plotChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                    label: 'Plots',
                    data: damVolumes,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    fill: true
                }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {display: false},
                    title: {display: true, text: 'Timestamp'}
                },
                y: {
                    ticks: {display: false},
                    title: {display: true, text: 'Plots'}
                }
            }
        }
    });
}

function createOtaPlotsChart(data) {
    if (otaChart) {
        otaChart.destroy();
    }

    const groupedData = {};
    data.forEach(({ otaName, plots }) => {
        if (!groupedData[otaName])
            groupedData[otaName] = 0;
        groupedData[otaName] += plots;
    });

    const labels = Object.keys(groupedData);
    const plotsData = labels.map(ota => groupedData[ota]);

    const ctx = document.getElementById("Chart2").getContext("2d");
    otaChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                    label: "Number of Plots",
                    data: plotsData,
                    backgroundColor: "blue"
                }]
        },
        options: {
            responsive: true,
            plugins: {legend: {position: "top"}},
            scales: {
                x: {title: {display: true, text: "OTA"}},
                y: {title: {display: true, text: "Number of Plots"}}
            }
        }
    });
}

function createTable(data) {
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
    document.getElementById('table-container').innerHTML = table;
}

function loadOta(data) {
    const otaSet = new Set(data.map(item => item.otaName));
    const otaStations = [...otaSet].sort();

    const otaSelect = document.getElementById("otaName-filter");
    otaStations.forEach(ota => {
        let option = document.createElement("option");
        option.value = ota;
        option.textContent = ota;
        otaSelect.appendChild(option);
    });
}

function chartAndTable() {
    var dataType = "ParcelsofLand";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            createPlotChart(lastData);
            createOtaPlotsChart(lastData);
            createTable(lastData);
            loadOta(data);

            data.sort(function (a, b) {
                return new Date(a.date) - new Date(b.date);
            });

            const firstDate = new Date(data[0].date);
            const lastDate = new Date(data[data.length - 1].date);

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
            const otaName = document.getElementById('otaName-filter').value;
            const minPlots = document.getElementById('min-plots').value;
            const maxPlots = document.getElementById('max-plots').value;

            filterSearch(startDate, endDate, otaName, minPlots, maxPlots);
        });
    }
});

function filterSearch(startDate, endDate, otaName, minPlots, maxPlots) {
    var dataType = "ParcelsofLand";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            createPlotChart(data);
            createOtaPlotsChart(data);
            createTable(data);
        } else {
            console.log(xhr.responseText);
        }
    };
    var url = 'FilterDataServlet?dataType=' + dataType + '&start-date=' + startDate + '&end-date=' + endDate + '&otaName-filter=' + otaName + '&min-plots=' + minPlots + '&max-plots=' + maxPlots;
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}