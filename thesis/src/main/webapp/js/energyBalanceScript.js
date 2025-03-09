window.onload = function () {
    chartAndTable();
};

let energyChart;
let fuelChart;

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

function createEnergyChart(date, energy) {
    if (energyChart) {
        energyChart.destroy();
    }
    const ctx = document.getElementById('Chart1').getContext('2d');
    energyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [{
                    label: 'Energy mwh',
                    data: energy,
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
                    title: {display: true, text: 'Energy mwh'}
                }
            }
        }
    });
}

function createFuelChart(data) {
    if (fuelChart) {
        fuelChart.destroy();
    }

    const groupedData = {};
    data.forEach(({ date, energy_mwh, fuel }) => {
        if (!groupedData[fuel]) {
            groupedData[fuel] = {};
        }
        if (!groupedData[fuel][date]) {
            groupedData[fuel][date] = 0;
        }
        groupedData[fuel][date] += energy_mwh;
    });

    const dates = [...new Set(data.map(d => d.date))].sort();


    const colors = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"];
    const datasets = Object.keys(groupedData).map((fuel, index) => ({
            label: fuel,
            data: dates.map(date => groupedData[fuel][date] || 0),
            backgroundColor: colors[index % colors.length],
            stack: "Stack 0"
        }));

    const ctx = document.getElementById('Chart2').getContext('2d');
    fuelChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: dates,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {position: "top"},
                tooltip: {mode: "index", intersect: false}
            },
            scales: {
                x: {title: {display: true, text: "Date"}},
                y: {
                    title: {display: true, text: "Energy (MWh)"},
                    stacked: true
                }
            }
        }
    });
}

function createTable(data) {
    var table = '<table class="table"><thead><tr><th>Date</th><th>Fuel</th><th>Energy (MWh)</th><th>Percentage</th></tr></thead><tbody>';
    data.forEach(function (item) {
        table += '<tr>';
        table += '<td>' + item.date + '</td>';
        table += '<td>' + item.fuel + '</td>';
        table += '<td>' + item.energy_mwh + '</td>';
        table += '<td>' + item.percentage + '</td>';
        table += '</tr>';
    });

    table += '</tbody></table>';
    document.getElementById('table-container').innerHTML = table;
}

function loadFuels(data) {
    const fuelSet = new Set(data.map(item => item.fuel));
    const sortedFuels = [...fuelSet].sort();

    const fuelSelect = document.getElementById("fuel-filter");
    sortedFuels.forEach(fuel => {
        let option = document.createElement("option");
        option.value = fuel;
        option.textContent = fuel;
        fuelSelect.appendChild(option);
    });
}

function chartAndTable() {
    var dataType = "EnergyBalance";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            const timestamps = lastData.map(item => item.date);
            const damVolumes = lastData.map(item => parseFloat(item.energy_mwh));

            createEnergyChart(timestamps, damVolumes);
            createFuelChart(lastData);
            createTable(data);
            loadFuels(data);

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

            const minen = document.getElementById('min-energy').value;
            const maxen = document.getElementById('max-energy').value;
            const fuel = document.getElementById("fuel-filter").value;
            const minper = document.getElementById("min-percentage").value;
            const maxper = document.getElementById("max-percentage").value;

            filterSearch(startDate, endDate, fuel, minen, maxen, minper, maxper);
        });
    }
});

function filterSearch(startDate, endDate, fuel, minen, maxen, minper, maxper) {
    var dataType = "EnergyBalance";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            const timestamps = data.map(item => item.date);
            const damVolumes = data.map(item => parseFloat(item.energy_mwh));

            createEnergyChart(timestamps, damVolumes);
            createTable(data);
            createFuelChart(data);
        } else {
            console.log(xhr.responseText);
        }
    };
    var url = 'FilterDataServlet?dataType=' + dataType + '&start-date=' + startDate + '&end-date=' + endDate + '&min-energy=' + minen + '&max-energy=' + maxen + '&fuel-filter=' + fuel + '&min-percentage=' + minper + '&max-percentage=' + maxper;
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}