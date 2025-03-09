package DataBase;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import static DataBase.DB_Connection.getInitialConnection;
import Tables.*;
import mainClasses.*;
import java.io.StringReader;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

public class DB_Initialization {

    public static void main(String[] args) throws SQLException, ClassNotFoundException {
        DB_Initialization init = new DB_Initialization();
        //init.dropDatabase();
        init.initDatabase();
        init.initTables();
    }

    public void initDatabase() throws SQLException, ClassNotFoundException {
        Connection conn = getInitialConnection();
        Statement stmt = conn.createStatement();
        stmt.execute("CREATE DATABASE thesis_2024");
        stmt.close();
        conn.close();
        System.out.println("Data Base Successfully created");
    }

    public void dropDatabase() throws SQLException, ClassNotFoundException {
        Connection conn = getInitialConnection();
        Statement stmt = conn.createStatement();
        String query = "DROP DATABASE thesis_2024";
        stmt.executeUpdate(query);

        stmt.close();
    }

    public void initTables() throws SQLException, ClassNotFoundException {

        EditElectricityConTable eect = new EditElectricityConTable();
        eect.CreateElectricityConsumptionTable();
        apiElectricityCon();

        EditEnergyBalanceTable eebt = new EditEnergyBalanceTable();
        eebt.CreateEnergyBalanceTable();
        apiEnergyBalance();

        EditEnergySystemLoadTable eeslt = new EditEnergySystemLoadTable();
        eeslt.CreateEnergySystemLoadTable();
        apiEnergySystemLoad();

        EditHydrologicalDataTable ehdt = new EditHydrologicalDataTable();
        ehdt.CreateHydrologicalDataTable();
        apiHydrologicalData();

        EditParcelsofLandTable eplt = new EditParcelsofLandTable();
        eplt.CreateParcelsofLandTable();
        apiParcelsofLand();

        EditProtectedAreaPlotsTable epapt = new EditProtectedAreaPlotsTable();
        epapt.CreateProtectedAreaPlotsTable();
        apiProtectedAreaPlots();

        EditQualityofSwimmingWatersTable eqswt = new EditQualityofSwimmingWatersTable();
        eqswt.CreateQualityofSwimmingWatersTable();
        apiQualityofSwimmingWaters();

        EditRenewableEnergySourcesTable erest = new EditRenewableEnergySourcesTable();
        erest.CreateRenewableEnergySourcesTable();
        apiRenewableEnergySources();

        EditProfilesTable ept = new EditProfilesTable();
        ept.CreateProfileTable();
        Profile admin = new Profile();
        admin.setEmail("admin@csd.uoc.gr");
        admin.setUsername("admin");
        admin.setPassword("1234!");
        ept.addNewProfile(admin);
    }

    public void apiElectricityCon() throws SQLException, ClassNotFoundException {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://data.gov.gr/api/v1/query/electricity_consumption"))
                    .header("Authorization", "Token 948995ed87853d5dcf9111f71ee3cc4f5f107138")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String data = response.body();
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(new InputSource(new StringReader(data)));

                NodeList listItems = doc.getElementsByTagName("list-item");
                for (int i = 0; i < listItems.getLength(); i++) {
                    String area = listItems.item(i).getFirstChild().getTextContent();
                    String dateString = listItems.item(i).getChildNodes().item(1).getTextContent();
                    String energyMwh = listItems.item(i).getChildNodes().item(2).getTextContent();
                    double doubleValue = Double.parseDouble(energyMwh);

                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Timestamp timestamp = null;
                    try {
                        java.util.Date parsedDate = dateFormat.parse(dateString);
                        timestamp = new Timestamp(parsedDate.getTime());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    ElectricityConsumption electricityConsumption = new ElectricityConsumption();
                    electricityConsumption.setArea(area);
                    electricityConsumption.setDate(timestamp);
                    electricityConsumption.setEnergy_mwh(doubleValue);

                    EditElectricityConTable electricityConsumptionTable = new EditElectricityConTable();
                    electricityConsumptionTable.addNewElectricityCon(electricityConsumption);
                }
                System.out.println("Added to the electricityConsumptionTable: " + listItems.getLength());
            } else {
                System.out.println("Error Status: " + response.statusCode());
                System.out.println("Error Data: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public void apiEnergyBalance() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://data.gov.gr/api/v1/query/admie_dailyenergybalanceanalysis"))
                    .header("Authorization", "Token 948995ed87853d5dcf9111f71ee3cc4f5f107138")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String data = response.body();
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(new InputSource(new StringReader(data)));

                NodeList listItems = doc.getElementsByTagName("list-item");
                for (int i = 0; i < listItems.getLength(); i++) {
                    String dateString = listItems.item(i).getChildNodes().item(0).getTextContent();
                    String energyMwh = listItems.item(i).getChildNodes().item(1).getTextContent();
                    String fuel = listItems.item(i).getChildNodes().item(2).getTextContent();
                    String percentage = listItems.item(i).getChildNodes().item(3).getTextContent();

                    int energyMwhValue = Integer.parseInt(energyMwh);
                    double percentageValue = Double.parseDouble(percentage);

                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Timestamp timestamp = null;
                    try {
                        java.util.Date parsedDate = dateFormat.parse(dateString);
                        timestamp = new Timestamp(parsedDate.getTime());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    EnergyBalance energyBalance = new EnergyBalance();

                    energyBalance.setDate(timestamp);
                    energyBalance.setEnergy_mwh(energyMwhValue);
                    energyBalance.setFuel(fuel);
                    energyBalance.setPercentage(percentageValue);

                    EditEnergyBalanceTable energyBalanceTable = new EditEnergyBalanceTable();
                    energyBalanceTable.addNewEnergyBalance(energyBalance);
                }
                System.out.println("Added to the energyBalanceTable: " + listItems.getLength());
            } else {
                System.out.println("Error Status: " + response.statusCode());
                System.out.println("Error Data: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public void apiEnergySystemLoad() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://data.gov.gr/api/v1/query/admie_realtimescadasystemload"))
                    .header("Authorization", "Token 948995ed87853d5dcf9111f71ee3cc4f5f107138")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String data = response.body();
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(new InputSource(new StringReader(data)));

                NodeList listItems = doc.getElementsByTagName("list-item");
                for (int i = 0; i < listItems.getLength(); i++) {
                    String dateString = listItems.item(i).getChildNodes().item(0).getTextContent();
                    String energyMwh = listItems.item(i).getChildNodes().item(1).getTextContent();
                    int energyMwhValue = Integer.parseInt(energyMwh);

                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Timestamp timestamp = null;
                    try {
                        java.util.Date parsedDate = dateFormat.parse(dateString);
                        timestamp = new Timestamp(parsedDate.getTime());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    EnergySystemLoad energySystemLoad = new EnergySystemLoad();
                    energySystemLoad.setDate(timestamp);
                    energySystemLoad.setEnergy_mwh(energyMwhValue);

                    EditEnergySystemLoadTable energySystemLoadTable = new EditEnergySystemLoadTable();
                    energySystemLoadTable.addNewEnergySystemLoad(energySystemLoad);
                }
                System.out.println("Added to the energySystemLoadTable: " + listItems.getLength());
            } else {
                System.out.println("Error Status: " + response.statusCode());
                System.out.println("Error Data: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public void apiHydrologicalData() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://data.gov.gr/api/v1/query/apdkriti-hydro"))
                    .header("Authorization", "Token 948995ed87853d5dcf9111f71ee3cc4f5f107138")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String data = response.body();
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(new InputSource(new StringReader(data)));

                NodeList listItems = doc.getElementsByTagName("list-item");
                for (int i = 0; i < listItems.getLength(); i++) {
                    String conductivity = listItems.item(i).getChildNodes().item(0).getTextContent();
                    String damVolume = listItems.item(i).getChildNodes().item(1).getTextContent();
                    String frequency = listItems.item(i).getChildNodes().item(2).getTextContent();
                    String station = listItems.item(i).getChildNodes().item(3).getTextContent();
                    String temperature = listItems.item(i).getChildNodes().item(4).getTextContent();
                    String dateString = listItems.item(i).getChildNodes().item(5).getTextContent();
                    String waterDepth = listItems.item(i).getChildNodes().item(6).getTextContent();
                    String waterLevel = listItems.item(i).getChildNodes().item(7).getTextContent();

                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Timestamp timestamp = null;
                    try {
                        java.util.Date parsedDate = dateFormat.parse(dateString);
                        timestamp = new Timestamp(parsedDate.getTime());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    HydrologicalData hydrologicalData = new HydrologicalData();

                    if (conductivity != null && !conductivity.isEmpty()) {
                        double conductivityValue = Double.parseDouble(conductivity);
                        hydrologicalData.setConductivity(conductivityValue);
                    }
                    if (damVolume != null && !damVolume.isEmpty()) {
                        double damVolumeValue = Double.parseDouble(damVolume);
                        hydrologicalData.setDamVolume(damVolumeValue);
                    }
                    if (temperature != null && !temperature.isEmpty()) {
                        double temperatureValue = Double.parseDouble(temperature);
                        hydrologicalData.setTemperature(temperatureValue);
                    }
                    if (waterDepth != null && !waterDepth.isEmpty()) {
                        double waterDepthValue = Double.parseDouble(waterDepth);
                        hydrologicalData.setWaterDepth(waterDepthValue);
                    }
                    if (waterLevel != null && !waterLevel.isEmpty()) {
                        double waterLevelValue = Double.parseDouble(waterLevel);
                        hydrologicalData.setWaterLevel(waterLevelValue);
                    }

                    hydrologicalData.setFrequency(frequency);
                    hydrologicalData.setStation(station);
                    hydrologicalData.setTimestamp(timestamp);

                    EditHydrologicalDataTable hydrologicalDataTable = new EditHydrologicalDataTable();
                    hydrologicalDataTable.addNewHydrologicalData(hydrologicalData);
                }
                System.out.println("Added to the hydrologicalDataTable: " + listItems.getLength());
            } else {
                System.out.println("Error Status: " + response.statusCode());
                System.out.println("Error Data: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public void apiParcelsofLand() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://data.gov.gr/api/v1/query/ktm_plots"))
                    .header("Authorization", "Token 948995ed87853d5dcf9111f71ee3cc4f5f107138")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String data = response.body();
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(new InputSource(new StringReader(data)));

                NodeList listItems = doc.getElementsByTagName("list-item");
                for (int i = 0; i < listItems.getLength(); i++) {
                    String dateString = listItems.item(i).getChildNodes().item(0).getTextContent();
                    String otaId = listItems.item(i).getChildNodes().item(1).getTextContent();
                    String otaName = listItems.item(i).getChildNodes().item(2).getTextContent();
                    String otaNameEn = listItems.item(i).getChildNodes().item(3).getTextContent();
                    String plots = listItems.item(i).getChildNodes().item(4).getTextContent();

                    int otaIdValue = Integer.parseInt(otaId);
                    int plotsValue = Integer.parseInt(plots);

                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    Date timestamp = null;

                    try {
                        java.util.Date parsedDate = dateFormat.parse(dateString);

                        timestamp = new Date(parsedDate.getTime());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    ParcelsofLand parcel = new ParcelsofLand();
                    parcel.setDate(timestamp);
                    parcel.setOtaId(otaIdValue);
                    parcel.setOtaName(otaName);
                    parcel.setOtaNameEn(otaNameEn);
                    parcel.setPlots(plotsValue);

                    EditParcelsofLandTable parcelsofLandTable = new EditParcelsofLandTable();
                    parcelsofLandTable.addNewParcelsofLand(parcel);
                }
                System.out.println("Added to the parcelsofLandTable: " + listItems.getLength());
            } else {
                System.out.println("Error Status: " + response.statusCode());
                System.out.println("Error Data: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public void apiProtectedAreaPlots() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://data.gov.gr/api/v1/query/cadastre_natura_plot"))
                    .header("Authorization", "Token 948995ed87853d5dcf9111f71ee3cc4f5f107138")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String data = response.body();
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(new InputSource(new StringReader(data)));

                NodeList listItems = doc.getElementsByTagName("list-item");
                for (int i = 0; i < listItems.getLength(); i++) {
                    String area = listItems.item(i).getChildNodes().item(0).getTextContent();
                    String dateString = listItems.item(i).getChildNodes().item(1).getTextContent();
                    String localAuthorityId = listItems.item(i).getChildNodes().item(2).getTextContent();
                    String plotNumber = listItems.item(i).getChildNodes().item(3).getTextContent();

                    double areaValue = Double.parseDouble(area);
                    int plotNumberValue = Integer.parseInt(plotNumber);

                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Timestamp timestamp = null;
                    try {
                        java.util.Date parsedDate = dateFormat.parse(dateString);
                        timestamp = new Timestamp(parsedDate.getTime());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    ProtectedAreaPlots protectedAreaPlot = new ProtectedAreaPlots();
                    protectedAreaPlot.setArea(areaValue);
                    protectedAreaPlot.setDate(timestamp);
                    protectedAreaPlot.setLocalAuthorityId(localAuthorityId);
                    protectedAreaPlot.setPlotNumber(plotNumberValue);

                    EditProtectedAreaPlotsTable protectedAreaPlotTable = new EditProtectedAreaPlotsTable();
                    protectedAreaPlotTable.addNewProtectedAreaPlots(protectedAreaPlot);
                }
                System.out.println("Added to the protectedAreaPlotTable: " + listItems.getLength());
            } else {
                System.out.println("Error Status: " + response.statusCode());
                System.out.println("Error Data: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public void apiQualityofSwimmingWaters() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://data.gov.gr/api/v1/query/apdkriti-swimwater"))
                    .header("Authorization", "Token 948995ed87853d5dcf9111f71ee3cc4f5f107138")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String data = response.body();
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(new InputSource(new StringReader(data)));

                NodeList listItems = doc.getElementsByTagName("list-item");
                for (int i = 0; i < listItems.getLength(); i++) {
                    String airdirection = listItems.item(i).getChildNodes().item(0).getTextContent();
                    String analysisDate = listItems.item(i).getChildNodes().item(1).getTextContent();
                    String caoutchouc = listItems.item(i).getChildNodes().item(2).getTextContent();
                    String coast = listItems.item(i).getChildNodes().item(3).getTextContent();
                    String deliveryDate = listItems.item(i).getChildNodes().item(4).getTextContent();
                    String description = listItems.item(i).getChildNodes().item(5).getTextContent();
                    String ecoli = listItems.item(i).getChildNodes().item(6).getTextContent();
                    String garbage = listItems.item(i).getChildNodes().item(7).getTextContent();
                    String glass = listItems.item(i).getChildNodes().item(8).getTextContent();
                    String intenterococci = listItems.item(i).getChildNodes().item(9).getTextContent();
                    String municipal = listItems.item(i).getChildNodes().item(10).getTextContent();
                    String perunit = listItems.item(i).getChildNodes().item(11).getTextContent();
                    String plastic = listItems.item(i).getChildNodes().item(12).getTextContent();
                    String rainfall = listItems.item(i).getChildNodes().item(13).getTextContent();
                    String dateString = listItems.item(i).getChildNodes().item(14).getTextContent();
                    String stationcode = listItems.item(i).getChildNodes().item(15).getTextContent();
                    String tar = listItems.item(i).getChildNodes().item(16).getTextContent();
                    String wave = listItems.item(i).getChildNodes().item(17).getTextContent();
                    String yestrainfall = listItems.item(i).getChildNodes().item(18).getTextContent();

                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Timestamp timestamp = null;
                    try {
                        java.util.Date parsedDate = dateFormat.parse(dateString);
                        timestamp = new Timestamp(parsedDate.getTime());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    QualityofSwimmingWaters waterQuality = new QualityofSwimmingWaters();
                    waterQuality.setAirdirection(airdirection);
                    waterQuality.setAnalysisDate(analysisDate);
                    waterQuality.setCaoutchouc(caoutchouc);
                    waterQuality.setCoast(coast);
                    waterQuality.setDeliveryDate(deliveryDate);
                    waterQuality.setDescription(description);
                    waterQuality.setEcoli(ecoli);
                    waterQuality.setGarbage(garbage);
                    waterQuality.setGlass(glass);
                    waterQuality.setIntenterococci(intenterococci);
                    waterQuality.setMunicipal(municipal);
                    waterQuality.setPerunit(perunit);
                    waterQuality.setPlastic(plastic);
                    waterQuality.setRainfall(rainfall);
                    waterQuality.setSampleTimestamp(timestamp);
                    waterQuality.setStationcode(stationcode);
                    waterQuality.setTar(tar);
                    waterQuality.setWave(wave);
                    waterQuality.setYestrainfall(yestrainfall);

                    EditQualityofSwimmingWatersTable waterQualityTable = new EditQualityofSwimmingWatersTable();
                    waterQualityTable.addNewQualityofSwimmingWaters(waterQuality);
                }
                System.out.println("Added to the waterQualityTable: " + listItems.getLength());
            } else {
                System.out.println("Error Status: " + response.statusCode());
                System.out.println("Error Data: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public void apiRenewableEnergySources() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://data.gov.gr/api/v1/query/admie_realtimescadares"))
                    .header("Authorization", "Token 948995ed87853d5dcf9111f71ee3cc4f5f107138")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String data = response.body();
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(new InputSource(new StringReader(data)));

                NodeList listItems = doc.getElementsByTagName("list-item");
                for (int i = 0; i < listItems.getLength(); i++) {
                    String dateString = listItems.item(i).getChildNodes().item(0).getTextContent();
                    String energyMwh = listItems.item(i).getChildNodes().item(1).getTextContent();

                    double energyMwhValu = Double.parseDouble(energyMwh);

                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Timestamp timestamp = null;
                    try {
                        java.util.Date parsedDate = dateFormat.parse(dateString);
                        timestamp = new Timestamp(parsedDate.getTime());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    RenewableEnergySources renewableEnergySource = new RenewableEnergySources();
                    renewableEnergySource.setDate(timestamp);
                    renewableEnergySource.setEnergy_mwh(energyMwhValu);

                    EditRenewableEnergySourcesTable renewableEnergySourceTable = new EditRenewableEnergySourcesTable();
                    renewableEnergySourceTable.addNewRenewableEnergySources(renewableEnergySource);
                }
                System.out.println("Added to the renewableEnergySourceTable: " + listItems.getLength());
            } else {
                System.out.println("Error Status: " + response.statusCode());
                System.out.println("Error Data: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

}
