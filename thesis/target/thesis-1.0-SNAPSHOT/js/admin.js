document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logout-btn").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    let categoryEndpoints = {
        "Κατανάλωση ρεύματος στην Ελλάδα": "ElectricityConsumption",
        "Ενεργειακό Ισοζύγιο": "EnergyBalance",
        "Φορτίο συστήματος ενέργειας": "EnergySystemLoad",
        "Υδρολογικά Δεδομένα Υδρολογικών Σταθμών Κρήτης": "HydrologicalData",
        "Πλήθος γεωτεμαχίων ανά ΟΤΑ": "ParcelsofLand",
        "Αγροτεμάχια προστατευόμενων περιοχών ανά Ο.Τ.Α.": "ProtectedAreaPlots",
        "Ποιότητα των Υδάτων Κολύμβησης Κρήτης": "QualityofSwimmingWaters",
        "Ανανεώσιμες πηγές ενέργειας": "RenewableEnergySources"
    };

    document.querySelectorAll(".category").forEach(card => {
        card.addEventListener("click", function () {
            document.querySelectorAll(".category").forEach(c => c.classList.remove("selected-category"));
            this.classList.add("selected-category");

            let categoryName = this.querySelector(".card-title").textContent.trim();
            const category = categoryEndpoints[categoryName];
            document.getElementById("category_title").innerHTML = `${categoryName}`;
            document.getElementById("button").innerHTML = `${filterButton(category)}`;
            document.getElementById("datas").style.display = "block";


            getData(category);
        });
    });

    function getData(categoryEndpoint) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                displayData(data, categoryEndpoint);
            } else {
                console.error('Error fetching data:', xhr.responseText);
            }
        };

        var url = 'GetAllData?dataType=' + categoryEndpoint;
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send();
    }

    function displayData(data, dataType) {
        let dataTable = document.getElementById("data-table");
        dataTable.innerHTML = '';
        let table = document.createElement("table");
        table.classList.add("table", "table-striped");

        let headerRow = document.createElement("tr");
        Object.keys(data[0]).forEach(key => {
            let th = document.createElement("th");
            th.textContent = key;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        data.forEach(item => {

            let row = document.createElement("tr");
            Object.values(item).forEach(value => {
                let td = document.createElement("td");
                td.textContent = value;
                row.appendChild(td);
            });
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Διαγραφή";
            deleteButton.classList.add("btn", "btn-danger");
            deleteButton.addEventListener("click", function () {
                deleteData(item, dataType);
            });

            let tdDelete = document.createElement("td");
            tdDelete.appendChild(deleteButton);
            row.appendChild(tdDelete);

            table.appendChild(row);
        });

        dataTable.appendChild(table);
    }

    function deleteData(item, dataType) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                alert("Το στοιχείο διαγράφηκε με επιτυχία!");
                getData(dataType);
            } else {
                console.error('Error deleting data:', xhr.responseText);
            }
        };

        var data = createJSON(item, dataType);
        xhr.open('POST', 'DeleteDataServlet');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(data);
    }

    function createJSON(item, dataType) {
        const params = {dataType: dataType};

        switch (dataType) {
            case "ElectricityConsumption":
                Object.assign(params, {
                    area: String(item.area),
                    energy: String(item.energy_mwh),
                    date: String(item.date)
                });
                break;
            case "EnergyBalance":
                Object.assign(params, {
                    fuel: String(item.fuel),
                    date: String(item.date),
                    energy: String(item.energy_mwh),
                    percentage: String(item.percentage)
                });
                break;
            case "EnergySystemLoad":
                Object.assign(params, {
                    date: String(item.date),
                    energy: String(item.energy_mwh)
                });
                break;
            case "HydrologicalData":
                Object.assign(params, {
                    conductivity: String(item.conductivity),
                    damVolume: String(item.damVolume),
                    frequency: String(item.frequency),
                    station: String(item.station),
                    temperature: String(item.temperature),
                    timestamp: String(item.timestamp),
                    waterDepth: String(item.waterDepth),
                    waterLevel: String(item.waterLevel)
                });
                break;
            case "ParcelsofLand":
                Object.assign(params, {
                    date: String(item.date),
                    otaId: String(item.otaId),
                    otaName: String(item.Name),
                    otaNameEn: String(item.NameEn),
                    plots: String(item.plots)
                });
                break;
            case "ProtectedAreaPlots":
                Object.assign(params, {
                    area: String(item.area),
                    date: String(item.date),
                    localAuthorityId: String(item.localAuthorityId),
                    plots: String(item.plotNumber)
                });
                break;
            case "QualityofSwimmingWaters":
                Object.assign(params, {
                    airdirection: String(item.airdirection),
                    caoutchouc: String(item.caoutchouc),
                    coast: String(item.coast),
                    description: String(item.description),
                    ecoli: String(item.ecoli),
                    garbage: String(item.garbage),
                    glass: String(item.glass),
                    intenterococci: String(item.intenterococci),
                    municipal: String(item.municipal),
                    perunit: String(item.perunit),
                    plastic: String(item.plastic),
                    rainfall: String(item.rainfall),
                    date: String(item.sampleTimestamp),
                    stationcode: String(item.stationcode),
                    tar: String(item.tar),
                    wave: String(item.wave),
                    yestrainfall: String(item.yestrainfall)
                });
                break;
            case "RenewableEnergySources":
                Object.assign(params, {
                    date: String(item.date),
                    energy: String(item.energy_mwh)
                });
                break;
        }
        console.log(params);
        return JSON.stringify(params);
    }

    const fileInput = document.getElementById("csvFile");
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file && file.type === "text/csv") {
            alert("CSV file has been selected: " + file.name);
            handleCsvFile(file);
        } else {
            alert("Please select a CSV file.");
        }
    });

    function handleCsvFile(file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const csvContent = event.target.result;
            parseCsv(csvContent);
        };

        reader.readAsText(file);
    }

    function parseCsv(csvContent) {
        Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const dataType = document.getElementById("category_title").innerHTML;
                dataTypeE = categoryEndpoints[dataType];
                console.log(dataType);
                results.data.forEach(function (row) {
                    addData(dataTypeE, row);
                });
            }
        });
    }

    function addData(dataType, data) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                alert("Το στοιχείο προστεθηκε με επιτυχία!");
                getData(dataType);
            } else {
                console.error('Error deleting data:', xhr.responseText);
            }
        };

        xhr.open('POST', 'AddDataServlet');
        xhr.setRequestHeader('Content-type', 'application/json');
        var requestData = {
            dataType: dataType,
            data: data
        };
        console.log(requestData);
        xhr.send(JSON.stringify(requestData));
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
});

