window.onload = function () {
    chart1();
    chart2();
    chart3();
    chart4();
    chart5();
    chart6();
    chart7();
    chart8();
};

$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#category *").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function chart1() {
    var dataType = "ElectricityConsumption";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            const timestamps = lastData.map(item => item.date);
            const damVolumes = lastData.map(item => parseFloat(item.energy_mwh));


            const ctx = document.getElementById('Chart1').getContext('2d');
            new Chart(ctx, {
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

function chart2() {
    var dataType = "EnergyBalance";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);
            const timestamps = lastData.map(item => item.date);
            const damVolumes = lastData.map(item => parseFloat(item.energy_mwh));

            const ctx = document.getElementById('Chart2').getContext('2d');
            new Chart(ctx, {
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

function chart3() {
    var dataType = "EnergySystemLoad";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            const timestamps = lastData.map(item => item.date);
            const damVolumes = lastData.map(item => parseFloat(item.energy_mwh));

            const ctx = document.getElementById('Chart3').getContext('2d');
            new Chart(ctx, {
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

function chart4() {
    var dataType = "HydrologicalData";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            const timestamps = lastData.map(item => item.timestamp);
            const waterLevel = lastData.map(d => d.waterLevel);
            const waterDepth = lastData.map(d => d.waterDepth);
            const temperature = lastData.map(d => d.temperature);

            const ctx = document.getElementById('Chart4').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Επίπεδο Νερού (m)',
                            data: waterLevel,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1,
                            fill: false,
                            pointBackgroundColor: 'rgb(75, 192, 192)'
                        },
                        {
                            label: 'Βάθος Νερού (m)',
                            data: waterDepth,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1,
                            fill: false,
                            pointBackgroundColor: 'rgb(255, 99, 132)'
                        },
                        {
                            label: 'Θερμοκρασία (°C)',
                            data: temperature,
                            borderColor: 'rgb(54, 162, 235)',
                            tension: 0.1,
                            fill: false,
                            pointBackgroundColor: 'rgb(54, 162, 235)'
                        }
                    ]
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
                            title: {display: false}
                        }
                    }
                }
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

function chart5() {
    var dataType = "ParcelsofLand";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            const timestamps = lastData.map(item => item.date);
            const damVolumes = lastData.map(item => parseFloat(item.plots));

            const ctx = document.getElementById('Chart5').getContext('2d');
            new Chart(ctx, {
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

function chart6() {
    var dataType = "ProtectedAreaPlots";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            const timestamps = lastData.map(item => item.date);
            const damVolumes = lastData.map(item => parseFloat(item.plotNumber));

            const ctx = document.getElementById('Chart6').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [{
                            label: 'Plot number',
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
                            title: {display: true, text: 'Plot number'}
                        }
                    }
                }
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

function chart7() {
    var dataType = "QualityofSwimmingWaters";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            const timestamps = lastData.map(item => item.sampleTimestamp);
            const ecoli = lastData.map(item => item.ecoli);
            const rainfall = lastData.map(item => item.rainfall === "ΌΧΙ" ? 0 : 1);

            const ctx = document.getElementById('Chart7').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Εcoli',
                            data: ecoli,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1,
                            fill: false,
                            pointBackgroundColor: 'rgb(75, 192, 192)',
                        },
                        {
                            label: 'Ρίψη Βροχής',
                            data: rainfall,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1,
                            fill: false,
                            pointBackgroundColor: 'rgb(255, 99, 132)',
                        }
                    ]
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
                            title: {display: false}
                        }
                    }
                }
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

function chart8() {
    var dataType = "RenewableEnergySources";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const lastData = data.slice(-20);

            const timestamps = lastData.map(item => item.date);
            const damVolumes = lastData.map(item => parseFloat(item.energy_mwh));

            const ctx = document.getElementById('Chart8').getContext('2d');
            new Chart(ctx, {
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


    