window.onload = function () {
    chartAndTable();
};

let energyChart;
let areaChart;

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

function createEnergyChart(data) {
    if (energyChart) {
        energyChart.destroy();
    }

    const timestamps = data.map(item => item.date);
    const damVolumes = data.map(item => parseFloat(item.energy_mwh));

    const ctx = document.getElementById('Chart1').getContext('2d');
    energyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                    label: 'Energy mwh',
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
                    title: {display: true, text: 'Energy mwh'}
                }
            }
        }
    });
}

function createTable(data) {
    var table = '<table class="table table-striped"><thead><tr>' +
            '<th>Date</th><th>Energy (MWh)</th>' +
            '</tr></thead><tbody>';

    data.forEach(function (item) {
        table += '<tr>';
        table += '<td>' + item.date + '</td>';
        table += '<td>' + item.energy_mwh + '</td>';
        table += '</tr>';
    });

    table += '</tbody></table>';

    document.getElementById('table-container').innerHTML = table;
}

function chartAndTable() {
    var dataType = "RenewableEnergySources";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            createEnergyChart(lastData);
            createTable(lastData);

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
            const min = document.getElementById('min-energy').value;
            const max = document.getElementById('max-energy').value;

            filterSearch(startDate, endDate, min, max);
        });
    }
});

function filterSearch(startDate, endDate, minen, maxen) {
    var dataType = "RenewableEnergySources";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            createEnergyChart(data);
            createTable(data);
        } else {
            console.log(xhr.responseText);
        }
    };
    var url = 'FilterDataServlet?dataType=' + dataType + '&start-date=' + startDate + '&end-date=' + endDate + '&min-energy=' + minen + '&max-energy=' + maxen;
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}