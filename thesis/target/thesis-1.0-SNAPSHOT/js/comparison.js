let energyChart;
let plotChart;
let waterChart;
let pollutionChart;

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

document.addEventListener("DOMContentLoaded", function () {
    const categories = document.querySelectorAll(".category");
    let selectedGroup = null;
    let selectedCards = [];

    const categoryEndpoints = {
        "Κατανάλωση ρεύματος στην Ελλάδα": "ElectricityConsumption",
        "Ενεργειακό Ισοζύγιο": "EnergyBalance",
        "Φορτίο συστήματος ενέργειας": "EnergySystemLoad",
        "Υδρολογικά Δεδομένα Υδρολογικών Σταθμών Κρήτης": "HydrologicalData",
        "Πλήθος γεωτεμαχίων ανά ΟΤΑ": "ParcelsofLand",
        "Αγροτεμάχια προστατευόμενων περιοχών ανά Ο.Τ.Α.": "ProtectedAreaPlots",
        "Ποιότητα των Υδάτων Κολύμβησης Κρήτης": "QualityofSwimmingWaters",
        "Ανανεώσιμες πηγές ενέργειας": "RenewableEnergySources"
    };

    const categoryDescriptions = {
        "Κατανάλωση ρεύματος στην Ελλάδα": "Δείχνει την κατανάλωση ηλεκτρικής ενέργειας σε διάφορες περιοχές της Ελλάδας.",
        "Ενεργειακό Ισοζύγιο": "Απεικονίζει τη διαφορά μεταξύ παραγωγής και κατανάλωσης ενέργειας.",
        "Φορτίο συστήματος ενέργειας": "Παρουσιάζει το φορτίο του ηλεκτρικού συστήματος σε διάφορες χρονικές στιγμές.",
        "Υδρολογικά Δεδομένα Υδρολογικών Σταθμών Κρήτης": "Περιλαμβάνει πληροφορίες σχετικά με τη ροή και τη στάθμη των υδάτων στην Κρήτη.",
        "Πλήθος γεωτεμαχίων ανά ΟΤΑ": "Εμφανίζει τον αριθμό των γεωτεμαχίων σε κάθε Οργανισμό Τοπικής Αυτοδιοίκησης.",
        "Αγροτεμάχια προστατευόμενων περιοχών ανά Ο.Τ.Α.": "Δείχνει τη διασπορά των αγροτεμαχίων που βρίσκονται εντός προστατευόμενων περιοχών.",
        "Ποιότητα των Υδάτων Κολύμβησης Κρήτης": "Αξιολόγηση της ποιότητας των θαλάσσιων υδάτων για κολύμβηση.",
        "Ανανεώσιμες πηγές ενέργειας": "Παρουσιάζει την παραγωγή ενέργειας από ανανεώσιμες πηγές όπως αιολικά και φωτοβολταϊκά."
    };

    categories.forEach(card => {
        card.addEventListener("click", function () {
            const group = card.getAttribute("data-group");
            const isSingleSelect = card.classList.contains("single-select");
            const title = card.querySelector(".card-title").innerText;

            if (card.classList.contains("selected")) {
                card.classList.remove("selected");
                selectedCards = selectedCards.filter(c => c !== card);

                if (selectedCards.length === 0) {
                    selectedGroup = null;
                    categories.forEach(c => c.classList.remove("disabled"));
                    document.getElementById("single-comparison").style.display = "none";
                    document.getElementById("comparison-section").style.display = "none";
                    if (energyChart) {
                        energyChart.destroy();
                        energyChart = null;
                    }
                    if (plotChart) {
                        plotChart.destroy();
                        plotChart = null;
                    }
                    if (waterChart) {
                        waterChart.destroy();
                        waterChart = null;
                    }
                    if (pollutionChart) {
                        pollutionChart.destroy();
                        pollutionChart = null;
                    }
                }

                if (selectedCards.length === 1) {
                    document.getElementById("single-comparison").style.display = "none";
                    document.getElementById("comparison-section").style.display = "none";
                    if (energyChart) {
                        energyChart.destroy();
                        energyChart = null;
                    }
                    if (plotChart) {
                        plotChart.destroy();
                        plotChart = null;
                    }
                }
                return;
            }

            if (isSingleSelect || (selectedGroup && selectedGroup !== group)) {
                selectedCards.forEach(c => c.classList.remove("selected"));
                selectedCards = [];
            }

            if (!isSingleSelect && selectedCards.length >= 2)
                return;

            card.classList.add("selected");
            selectedCards.push(card);
            selectedGroup = group;

            categories.forEach(c => {
                if (selectedGroup && c.getAttribute("data-group") !== selectedGroup) {
                    c.classList.add("disabled");
                } else {
                    c.classList.remove("disabled");
                }
            });

            if (isSingleSelect) {
                document.getElementById("single-comparison").style.display = "block";
                document.getElementById("single1").style.display = "block";
                document.getElementById("single2").style.display = "block";
                fetchSingleData(selectedCards);
            }

            if (selectedCards.length === 2) {
                document.getElementById("comparison-section").style.display = "block";
                fetchComparisonData(selectedCards, selectedGroup);
            }
        });
    });

    function fetchSingleData(selectedCard) {
        const titles = selectedCard.map(card => card.querySelector(".card-title").innerText);
        const endpoints = titles.map(title => categoryEndpoints[title]);

        getData(endpoints[0], null, null);
    }

    function fetchComparisonData(selectedCards, selectedGroup) {
        const titles = selectedCards.map(card => card.querySelector(".card-title").innerText);
        const endpoints = titles.map(title => categoryEndpoints[title]);

        getData(endpoints[0], 1, selectedGroup);
        getData(endpoints[1], 2, selectedGroup);
    }

    function getData(dataType, category, selectedGroup) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);

                if (selectedGroup) {
                    displayResults(data, category, dataType, selectedGroup);
                } else {
                    displaySingleResults(data, dataType);
                    if (dataType === "QualityofSwimmingWaters") {
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
                    }

                }

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

    function displayResults(data, category, dataType, selectedGroup) {
        const title = document.getElementById("category" + category + "_title");
        const resultContainer = document.getElementById("category" + category);
        const chartTitle = document.getElementById("chart-title");
        const chartContainer = document.getElementById("Chart2");
        if (!resultContainer)
            return;

        dataTypeG = Object.keys(categoryEndpoints).find(key => categoryEndpoints[key] === dataType) || dataType;
        const description = categoryDescriptions[dataTypeG];

        title.innerHTML = `<h2>${dataTypeG}</h2>
                           <p style="color: gray; font-size: 14px;">${description}</p>
                            ${filterButton(dataType)}`;

        const lastData = data.slice(-100);
        if (selectedGroup === "energy") {
            resultContainer.innerHTML = `${createEnergyTable(data)}`;
            chartTitle.innerHTML = `Γράφημα Ενέργειας`;
            createEnergyChart(lastData, dataTypeG);
        } else if (selectedGroup === "land") {
            resultContainer.innerHTML = `${createPlotsTable(data)}`;
            chartTitle.innerHTML = `Γράφημα Plots`;
            createPlotChart(lastData, dataTypeG);
        }
    }

    function displaySingleResults(data, dataType) {
        const title = document.getElementById("category_title");
        const resultContainer = document.getElementById("category");
        const chartTitle = document.getElementById("chart-title");
        const chartContainer = document.getElementById("Chart1");

        if (!resultContainer)
            return;

        dataTypeG = Object.keys(categoryEndpoints).find(key => categoryEndpoints[key] === dataType) || dataType;
        const description = categoryDescriptions[dataTypeG];

        title.innerHTML = `<h2>${dataTypeG}</h2>
                           <p style="color: gray; font-size: 14px;">${description}</p>
                            ${filterButton(dataType)}`;

        const lastData = data.slice(-100);

        if (dataType === "HydrologicalData") {
            resultContainer.innerHTML = `${createHydroTable(data)}`;
            chartTitle.innerHTML = `Υδρολογικά Δεδομένα Υδρολογικών Σταθμών Κρήτης`;
            createWaterChart(data);
        } else {
            resultContainer.innerHTML = `${createQualityTable(data)}`;
            chartTitle.innerHTML = `Ποιότητα των Υδάτων Κολύμβησης Κρήτης`;
            createPollutionOverTimeChart(data);
        }
    }

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


    function createEnergyTable(data) {
        var table = '<table class="table"><thead><tr><th>Date</th><th>Energy (MWh)</th></tr></thead><tbody>';
        data.forEach(function (item) {
            table += '<tr>';
            table += '<td>' + item.date + '</td>';
            table += '<td>' + item.energy_mwh + '</td>';
            table += '</tr>';
        });

        table += '</tbody></table>';
        return table;
    }

    function createPlotsTable(data) {
        var table = '<table class="table"><thead><tr><th>Date</th><th>Plots</th></tr></thead><tbody>';
        data.forEach(function (item) {
            table += '<tr>';
            table += '<td>' + item.date + '</td>';
            table += '<td>' + (item?.plots ?? item?.plotNumber) + '</td>';
            table += '</tr>';
        });

        table += '</tbody></table>';
        return table;
    }

    function createQualityTable(data) {
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

        return table;
    }

    function createHydroTable(data) {
        var table = '<table class="table"><thead><tr><th>Date</th><th>Conductivity</th><th>DamVolume</th><th>Frequency</th><th>Station</th><th>Temperature</th><th>WaterDepth</th><th>WaterLevel</th></tr></thead><tbody>';
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
        return table;
    }

    function createEnergyChart(newData, category) {
        const ctx = document.getElementById('Chart2').getContext('2d');
        const newColor = getRandomColor();

        if (!energyChart) {
            energyChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: newData.map(item => item.date),
                    datasets: [{
                            label: `Energy ${category}`,
                            data: newData.map(item => parseFloat(item.energy_mwh)),
                            borderColor: newColor,
                            backgroundColor: newColor.replace('1)', '0.2)'),
                            borderWidth: 1,
                            fill: true
                        }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {display: true, text: 'Timestamp'}
                        },
                        y: {
                            title: {display: true, text: 'Energy mwh'}
                        }
                    }
                }
            });
        } else {
            energyChart.data.labels.push(...newData.map(item => item.date));
            energyChart.data.datasets.push({
                label: `Energy ${category}`,
                data: newData.map(item => parseFloat(item.energy_mwh)),
                borderColor: newColor,
                backgroundColor: newColor.replace('1)', '0.2)'),
                borderWidth: 1,
                fill: true
            });

            energyChart.update();
        }
    }

    function createPlotChart(newData, category) {
        const ctx = document.getElementById('Chart2').getContext('2d');

        const newColor = getRandomColor();

        if (!plotChart) {
            plotChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: newData.map(item => item.date),
                    datasets: [{
                            label: `Plots ${category}`,
                            data: newData.map(item => parseFloat(item.plotNumber)),
                            borderColor: newColor,
                            backgroundColor: newColor.replace('1)', '0.2)'),
                            borderWidth: 1,
                            fill: true
                        }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {display: true, text: 'Timestamp'}
                        },
                        y: {
                            title: {display: true, text: 'Energy mwh'}
                        }
                    }
                }
            });
        } else {
            plotChart.data.labels.push(...newData.map(item => item.date));
            plotChart.data.datasets.push({
                label: `Plots ${category}`,
                data: newData.map(item => parseFloat(item.plotNumber)),
                borderColor: newColor,
                backgroundColor: newColor.replace('1)', '0.2)'),
                borderWidth: 1,
                fill: true
            });

            plotChart.update();
        }
    }

    function getRandomColor() {
        return `hsl(${Math.random() * 360}, 70%, 50%)`;
    }

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

    document.getElementById("search-button").addEventListener("click", function () {
        const startDate1 = document.getElementById('start-date1').value;
        const endDate1 = document.getElementById('end-date1').value;
        const startDate2 = document.getElementById('start-date2').value;
        const endDate2 = document.getElementById('end-date2').value;

        const chartTitle = document.getElementById("chart-title").innerText;
        const category = categoryEndpoints[chartTitle];

        if (startDate1 && endDate1 && startDate2 && endDate2) {
            document.getElementById("single1").style.display = "none";
            document.getElementById("single2").style.display = "none";
            document.getElementById("comparison-section").style.display = "block";

            if (waterChart) {
                waterChart.destroy();
                waterChart = null;
            }
            if (pollutionChart) {
                pollutionChart.destroy();
                pollutionChart = null;
            }

            filterSearch(startDate1, endDate1, category, 1);
            filterSearch(startDate2, endDate2, category, 2);
        } else if (startDate1 && endDate1) {
            console.log(startDate1);
            console.log(category);
            filterSearch(startDate1, endDate1, category);
        } else if (startDate2 && endDate2) {
            filterSearch(startDate2, endDate2, category);
        }
    });

    function filterSearch(startDate, endDate, dataType, num) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);

                if (num) {
                    console.log("in");
                    doublePrint(data, num, dataType);
                } else {
                    console.log(data);
                    displaySingleResults(data, dataType);
                }

            } else {
                console.log(xhr.responseText);
            }
        };
        var url = 'FilterDataServlet?dataType=' + dataType + '&start-date=' + startDate + '&end-date=' + endDate;
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send();
    }

    function doublePrint(data, num, dataType) {
        const title = document.getElementById("category" + num + "_title");
        const resultContainer = document.getElementById("category" + num);
        const chartTitle = document.getElementById("chart-title");
        const chartContainer = document.getElementById("Chart1");

        if (!resultContainer)
            return;

        dataTypeG = Object.keys(categoryEndpoints).find(key => categoryEndpoints[key] === dataType) || dataType;
        const description = categoryDescriptions[dataTypeG];

        title.innerHTML = `<h2>${dataTypeG}</h2>
                           <p style="color: gray; font-size: 14px;">${description}</p>`;

        if (dataType === "HydrologicalData") {
            resultContainer.innerHTML = `${createHydroTable(data)}`;
            chartTitle.innerHTML = `Υδρολογικά Δεδομένα Υδρολογικών Σταθμών Κρήτης`;
            createWaterChart2(data);
        } else {
            resultContainer.innerHTML = `${createQualityTable(data)}`;
            chartTitle.innerHTML = `Ποιότητα των Υδάτων Κολύμβησης Κρήτης`;
            createPollutionOverTimeChart2(data);
        }
    }

    function createWaterChart2(data) {
        const groupedData = {};
        data.forEach(({ station, damVolume, waterLevel }) => {
            if (!groupedData[station]) {
                groupedData[station] = {damVolume: 0, waterLevel: 0};
            }
            groupedData[station].damVolume = damVolume;
            groupedData[station].waterLevel = waterLevel;
        });

        const stations = Object.keys(groupedData);

        const colors = ["blue", "green", "red", "orange", "purple", "pink", "yellow"];

        if (!waterChart) {
            const ctx = document.getElementById('Chart2').getContext('2d');
            waterChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: stations,
                    datasets: [
                        {
                            label: "Water Level (m)",
                            data: stations.map(station => groupedData[station].waterLevel),
                            backgroundColor: colors[0]
                        },
                        {
                            label: "Dam Volume (m³)",
                            data: stations.map(station => groupedData[station].damVolume),
                            backgroundColor: colors[1]
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
        } else {
            waterChart.data.labels = stations;
            waterChart.data.datasets[0].data = stations.map(station => groupedData[station].waterLevel);
            waterChart.data.datasets[1].data = stations.map(station => groupedData[station].damVolume);

            waterChart.data.datasets[0].backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            waterChart.data.datasets[1].backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            waterChart.update();
        }
    }

    function createPollutionOverTimeChart2(data) {
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
        const colors = ["red", "blue", "green", "purple"];

        const datasets = pollutionTypes.map((type, index) => ({
                label: type.charAt(0).toUpperCase() + type.slice(1),
                data: labels.map(date => groupedData[date][type]),
                borderColor: colors[Math.floor(Math.random() * colors.length)],
                fill: false
            }));

        if (pollutionChart) {
            pollutionChart.data.labels = labels;
            pollutionChart.data.datasets = datasets;
            pollutionChart.update();
        } else {
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
    }
});
