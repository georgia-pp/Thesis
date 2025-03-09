package Servlets;

import Tables.EditElectricityConTable;
import Tables.EditEnergyBalanceTable;
import Tables.EditEnergySystemLoadTable;
import Tables.EditHydrologicalDataTable;
import Tables.EditParcelsofLandTable;
import Tables.EditProtectedAreaPlotsTable;
import Tables.EditQualityofSwimmingWatersTable;
import Tables.EditRenewableEnergySourcesTable;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;

/**
 *
 * @author georgia
 */
public class AddDataServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        StringBuilder json = new StringBuilder();
        String line;
        BufferedReader reader = request.getReader();
        while ((line = reader.readLine()) != null) {
            json.append(line);
        }

        JSONObject jsonObject = new JSONObject(json.toString());
        String dataType = jsonObject.getString("dataType");
        JSONObject data = jsonObject.getJSONObject("data");

        String area = null, energy = null, date = null, fuel = null, percentage = null, conductivity = null;
        String damVolume = null, frequency = null, station = null, temperature = null, waterDepth = null;
        String waterLevel = null, otaId = null, otaName = null, otaNameEn = null, plots = null, localAuthorityId = null;
        String airdirection = null, caoutchouc = null, coast = null, description = null, ecoli = null, garbage = null, glass = null;
        String intenterococci = null, municipal = null, perunit = null;
        String plastic = null, rainfall = null, stationcode = null, tar = null, wave = null, yestrainfall = null;

        switch (dataType) {
            case "ElectricityConsumption":
                area = data.getString("area");
                energy = data.getString("energy_mwh");
                date = data.getString("date");
                break;
            case "EnergyBalance":
                energy = data.getString("energy_mwh");
                date = data.getString("date");
                fuel = data.getString("fuel");
                percentage = data.getString("percentage");
                break;
            case "EnergySystemLoad":
                energy = data.getString("energy_mwh");
                date = data.getString("date");
                break;
            case "HydrologicalData":
                conductivity = data.getString("conductivity");
                damVolume = data.getString("damVolume");
                frequency = data.getString("frequency");
                station = data.getString("station");
                temperature = data.getString("temperature");
                waterDepth = data.getString("waterDepth");
                waterLevel = data.getString("waterLevel");
                date = data.getString("timestamp");
                break;
            case "ParcelsofLand":
                date = data.getString("date");
                otaId = data.getString("otaId");
                otaName = data.getString("otaName");
                otaNameEn = data.getString("otaNameEn");
                plots = data.getString("plots");
                break;
            case "ProtectedAreaPlots":
                date = data.getString("date");
                area = data.getString("area");
                localAuthorityId = data.getString("localAuthorityId");
                plots = data.getString("plotNumber");
                break;
            case "QualityofSwimmingWaters":
                airdirection = data.getString("airdirection");
                caoutchouc = data.getString("caoutchouc");
                coast = data.getString("coast");
                description = data.getString("description");
                ecoli = data.getString("ecoli");
                garbage = data.getString("garbage");
                glass = data.getString("glass");
                intenterococci = data.getString("intenterococci");
                municipal = data.getString("municipal");
                perunit = data.getString("perunit");
                plastic = data.getString("plastic");
                rainfall = data.getString("rainfall");
                stationcode = data.getString("stationcode");
                tar = data.getString("tar");
                wave = data.getString("wave");
                yestrainfall = data.getString("yestrainfall");
                date = data.getString("sampleTimestamp");
                break;
            case "RenewableEnergySources":
                date = data.getString("date");
                energy = data.getString("energy_mwh");
                break;
        }

        if (dataType != null) {
            try {
                boolean success = false;
                List<Object> params = new ArrayList<>();
                StringBuilder queryBuilder = new StringBuilder();

                switch (dataType) {
                    case "ElectricityConsumption":
                        queryBuilder.append("INSERT INTO ElectricityConsumption(area, date, energy_mwh) VALUES (?, ?, ?)");
                        double energy_mwh = Double.parseDouble(energy);
                        params.add(area);
                        params.add(date);
                        params.add(energy_mwh);

                        System.out.println(queryBuilder.toString());
                        success = new EditElectricityConTable().DeletefilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "EnergyBalance":
                        queryBuilder.append("INSERT INTO EnergyBalance(date, energy_mwh, fuel, percentage) VALUES (?, ?, ?, ?)");
                        int energy_mwh2 = Integer.parseInt(energy);
                        double per = Double.parseDouble(percentage);
                        params.add(date);
                        params.add(energy_mwh2);
                        params.add(fuel);
                        params.add(per);
                        success = new EditEnergyBalanceTable().DeletefilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "EnergySystemLoad":
                        queryBuilder.append("INSERT INTO EnergySystemLoad(date, energy_mwh) VALUES (?, ?)");
                        double energy_mwh3 = Double.parseDouble(energy);
                        params.add(date);
                        params.add(energy_mwh3);
                        success = new EditEnergySystemLoadTable().DeletefilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "HydrologicalData":
                        queryBuilder.append("INSERT INTO HydrologicalData(conductivity, damVolume, frequency, station, temperature, timestamp, waterDepth, waterLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                        double conductivityValue = Double.parseDouble(conductivity);
                        double damVolumeValue = Double.parseDouble(damVolume);
                        double temperatureValue = Double.parseDouble(temperature);
                        double waterDepthValue = Double.parseDouble(waterDepth);
                        double waterLevelValue = Double.parseDouble(waterLevel);
                        params.add(conductivityValue);
                        params.add(damVolumeValue);
                        params.add(frequency);
                        params.add(station);
                        params.add(temperatureValue);
                        params.add(date);
                        params.add(waterDepthValue);
                        params.add(waterLevelValue);
                        success = new EditHydrologicalDataTable().DeletefilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "ParcelsofLand":
                        queryBuilder.append("INSERT INTO ParcelsofLand(date, otaId, otaName, otaNameEn, plots) VALUES (?, ?, ?, ?, ?)");
                        int plotsValue = Integer.parseInt(plots);
                        params.add(date);
                        params.add(otaId);
                        params.add(otaName);
                        params.add(otaNameEn);
                        params.add(plotsValue);
                        success = new EditParcelsofLandTable().DeletefilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "ProtectedAreaPlots":
                        queryBuilder.append("INSERT INTO ProtectedAreaPlots(area, date, localAuthorityId, plotNumber) VALUES (?, ?, ?, ?)");
                        double areaValue = Double.parseDouble(area);
                        int plotsValue2 = Integer.parseInt(plots);
                        params.add(areaValue);
                        params.add(date);
                        params.add(localAuthorityId);
                        params.add(plotsValue2);
                        success = new EditProtectedAreaPlotsTable().DeletefilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "QualityofSwimmingWaters":
                        queryBuilder.append("INSERT INTO QualityofSwimmingWaters(airdirection, analysisDate, caoutchouc, coast, deliveryDate, description, ecoli, garbage, glass, intenterococci, municipal, perunit, plastic, rainfall, sampleTimestamp, stationcode, tar, wave, yestrainfall) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                        params.add(airdirection);
                        params.add(null);
                        params.add(caoutchouc);
                        params.add(coast);
                        params.add(null);
                        params.add(description);
                        params.add(ecoli);
                        params.add(garbage);
                        params.add(glass);
                        params.add(intenterococci);
                        params.add(municipal);
                        params.add(perunit);
                        params.add(plastic);
                        params.add(rainfall);
                        params.add(date);
                        params.add(stationcode);
                        params.add(tar);
                        params.add(wave);
                        params.add(yestrainfall);
                        success = new EditQualityofSwimmingWatersTable().DeletefilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "RenewableEnergySources":
                        queryBuilder.append("INSERT INTO RenewableEnergySources(date, energy_mwh) VALUES (?, ?)");
                        double energy_mwh4 = Double.parseDouble(energy);
                        params.add(date);
                        params.add(energy_mwh4);
                        success = new EditRenewableEnergySourcesTable().DeletefilteredSearch(queryBuilder.toString(), params);
                        break;
                }
                System.out.println(queryBuilder.toString());
                System.out.println(params);
                if (success) {
                    System.out.println("Added Successful");
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_OK);
                    response.getWriter().write("{\"message\": \"success\"}");
                } else {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\": \"Invalid username or password\"}");
                }
            } catch (SQLException | ClassNotFoundException e) {
                e.printStackTrace();
                response.setStatus(500);
            }
        } else {
            response.setStatus(400);
        }
    }
}
