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
public class DeleteDataServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject json = new JSONObject(sb.toString());

        String dataType = json.getString("dataType");
        String area = null, energy = null, date = null, fuel = null, percentage = null, conductivity = null;
        String damVolume = null, frequency = null, station = null, temperature = null, waterDepth = null;
        String waterLevel = null, otaId = null, otaName = null, otaNameEn = null, plots = null, localAuthorityId = null;
        String airdirection = null, caoutchouc = null, coast = null, description = null, ecoli = null, garbage = null, glass = null;
        String intenterococci = null, municipal = null, perunit = null;
        String plastic = null, rainfall = null, stationcode = null, tar = null, wave = null, yestrainfall = null;

        switch (dataType) {
            case "ElectricityConsumption":
                area = json.getString("area");
                energy = json.getString("energy");
                date = json.getString("date");
                break;
            case "EnergyBalance":
                energy = json.getString("energy");
                date = json.getString("date");
                fuel = json.getString("fuel");
                percentage = json.getString("percentage");
                break;
            case "EnergySystemLoad":
                energy = json.getString("energy");
                date = json.getString("date");
                break;
            case "HydrologicalData":
                conductivity = json.getString("conductivity");
                damVolume = json.getString("damVolume");
                frequency = json.getString("frequency");
                station = json.getString("station");
                temperature = json.getString("temperature");
                waterDepth = json.getString("waterDepth");
                waterLevel = json.getString("waterLevel");
                date = json.getString("timestamp");
                break;
            case "ParcelsofLand":
                date = json.getString("date");
                otaId = json.getString("otaId");
                otaName = json.getString("otaName");
                otaNameEn = json.getString("otaNameEn");
                plots = json.getString("plots");
                break;
            case "ProtectedAreaPlots":
                date = json.getString("date");
                area = json.getString("area");
                localAuthorityId = json.getString("localAuthorityId");
                plots = json.getString("plots");
                break;
            case "QualityofSwimmingWaters":
                airdirection = json.getString("airdirection");
                caoutchouc = json.getString("caoutchouc");
                coast = json.getString("coast");
                description = json.getString("description");
                ecoli = json.getString("ecoli");
                garbage = json.getString("garbage");
                glass = json.getString("glass");
                intenterococci = json.getString("intenterococci");
                municipal = json.getString("municipal");
                perunit = json.getString("perunit");
                plastic = json.getString("plastic");
                rainfall = json.getString("rainfall");
                stationcode = json.getString("stationcode");
                tar = json.getString("tar");
                wave = json.getString("wave");
                yestrainfall = json.getString("yestrainfall");
                date = json.getString("date");
                break;
            case "RenewableEnergySources":
                date = json.getString("date");
                energy = json.getString("energy");
                break;
        }

        if (dataType != null) {
            try {
                boolean array = false;
                List<Object> params = new ArrayList<>();
                StringBuilder queryBuilder = new StringBuilder();
                boolean hasCondition = false;

                switch (dataType) {
                    case "ElectricityConsumption":
                        queryBuilder.append("DELETE FROM ElectricityConsumption");

                        if (date != null && !date.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date = ?");
                            params.add(date);
                            hasCondition = true;
                        }
                        if (area != null && !area.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" area = ?");
                            params.add(area);
                            hasCondition = true;
                        }
                        if (energy != null && !energy.isEmpty()) {
                            double min = Double.parseDouble(energy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh = ?");
                            params.add(min);
                        }

                        array = new EditElectricityConTable().DeletefilteredSearch(queryBuilder.toString(), params);

                        break;
                    case "EnergyBalance":
                        queryBuilder.append("DELETE FROM EnergyBalance");

                        if (date != null && !date.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date = ?");
                            params.add(date);
                            hasCondition = true;
                        }

                        if (fuel != null && !fuel.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" fuel = ?");
                            params.add(fuel);
                            hasCondition = true;
                        }

                        if (energy != null && !energy.isEmpty()) {
                            int min = Integer.parseInt(energy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh = ?");
                            params.add(min);
                            hasCondition = true;
                        }
                        if (percentage != null && !percentage.isEmpty()) {
                            double max = Double.parseDouble(percentage);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" percentage = ?");
                            params.add(max);
                        }

                        array = new EditEnergyBalanceTable().DeletefilteredSearch(queryBuilder.toString(), params);

                        break;
                    case "EnergySystemLoad":
                        queryBuilder.append("DELETE FROM EnergySystemLoad");

                        if (date != null && !date.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date = ?");
                            params.add(date);
                            hasCondition = true;
                        }
                        if (energy != null && !energy.isEmpty()) {
                            double min = Double.parseDouble(energy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh = ?");
                            params.add(min);
                        }
                        array = new EditEnergySystemLoadTable().DeletefilteredSearch(queryBuilder.toString(), params);

                        break;
                    case "HydrologicalData":
                        queryBuilder.append("DELETE FROM HydrologicalData");

                        if (date != null && !date.isEmpty()) {

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" timestamp = ?");
                            params.add(date);
                            hasCondition = true;
                        }
                        if (conductivity != null && !conductivity.isEmpty()) {
                            double conductivityValue = Double.parseDouble(conductivity);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" conductivity = ?");
                            params.add(conductivityValue);
                            hasCondition = true;
                        }
                        if (damVolume != null && !damVolume.isEmpty()) {
                            double minDamVolValue = Double.parseDouble(damVolume);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" damVolume = ?");
                            params.add(minDamVolValue);
                            hasCondition = true;
                        }
                        if (frequency != null && !frequency.isEmpty() && !frequency.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" frequency = ?");
                            params.add(frequency);
                            hasCondition = true;
                        }
                        if (station != null && !station.isEmpty() && !station.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" station = ?");
                            params.add(station);
                            hasCondition = true;
                        }
                        if (temperature != null && !temperature.isEmpty()) {
                            double minTemperatureValue = Double.parseDouble(temperature);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" temperature = ?");
                            params.add(minTemperatureValue);
                            hasCondition = true;
                        }
                        if (waterDepth != null && !waterDepth.isEmpty()) {
                            double minWaterDepthValue = Double.parseDouble(waterDepth);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" waterDepth = ?");
                            params.add(minWaterDepthValue);
                            hasCondition = true;
                        }

                        if (waterLevel != null && !waterLevel.isEmpty()) {
                            double minWaterLevelValue = Double.parseDouble(waterLevel);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" waterLevel = ?");
                            params.add(minWaterLevelValue);
                        }

                        array = new EditHydrologicalDataTable().DeletefilteredSearch(queryBuilder.toString(), params);

                        break;
                    case "ParcelsofLand":
                        queryBuilder.append("DELETE FROM ParcelsofLand");

                        if (date != null && !date.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date = ?");
                            params.add(date);
                            hasCondition = true;
                        }
                        if (otaId != null && !otaId.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" otaId = ?");
                            params.add(otaId);
                            hasCondition = true;
                        }
                        if (otaName != null && !otaName.isEmpty() && !otaName.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" otaName = ?");
                            params.add(otaName);
                            hasCondition = true;
                        }
                        if (otaNameEn != null && !otaNameEn.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" otaNameEn = ?");
                            params.add(otaNameEn);
                            hasCondition = true;
                        }
                        if (plots != null && !plots.isEmpty()) {
                            int plotsValue = Integer.parseInt(plots);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" plots = ?");
                            params.add(plotsValue);
                        }

                        array = new EditParcelsofLandTable().DeletefilteredSearch(queryBuilder.toString(), params);

                        break;
                    case "ProtectedAreaPlots":
                        queryBuilder.append("DELETE FROM ProtectedAreaPlots");

                        if (area != null && !area.equals("all")) {
                            double areaValue = Double.parseDouble(area);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" area = ?");
                            params.add(areaValue);
                            hasCondition = true;
                        }
                        if (date != null && !date.isEmpty()) {

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date = ?");
                            params.add(date);
                            hasCondition = true;
                        }
                        if (localAuthorityId != null && !localAuthorityId.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" localAuthorityId = ?");
                            params.add(localAuthorityId);
                            hasCondition = true;
                        }
                        if (plots != null && !plots.isEmpty()) {
                            int plotsValue = Integer.parseInt(plots);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" plotNumber = ?");
                            params.add(plotsValue);
                        }

                        array = new EditProtectedAreaPlotsTable().DeletefilteredSearch(queryBuilder.toString(), params);

                        break;
                    case "QualityofSwimmingWaters":
                        queryBuilder.append("DELETE FROM QualityofSwimmingWaters");

                        if (date != null && !date.isEmpty()) {

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" sampleTimestamp = ?");
                            params.add(date);
                            hasCondition = true;
                        }
                        if (airdirection != null && !airdirection.isEmpty() && !airdirection.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" airdirection = ?");
                            params.add(airdirection);
                            hasCondition = true;
                        }

                        if (caoutchouc != null && !caoutchouc.isEmpty() && !caoutchouc.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" caoutchouc = ?");
                            params.add(caoutchouc);
                            hasCondition = true;
                        }

                        if (coast != null && !coast.isEmpty() && !coast.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" coast = ?");
                            params.add(coast);
                            hasCondition = true;
                        }

                        if (description != null && !description.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" description LIKE ?");
                            params.add("%" + description + "%");
                            hasCondition = true;
                        }

                        if (ecoli != null && !ecoli.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" ecoli = ?");
                            params.add(ecoli);
                            hasCondition = true;
                        }

                        if (garbage != null && !garbage.isEmpty() && !garbage.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" garbage = ?");
                            params.add(garbage);
                            hasCondition = true;
                        }

                        if (glass != null && !glass.isEmpty() && !glass.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" glass = ?");
                            params.add(glass);
                            hasCondition = true;
                        }

                        if (intenterococci != null && !intenterococci.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" intenterococci = ?");
                            params.add(intenterococci);
                            hasCondition = true;
                        }
                        if (municipal != null && !municipal.isEmpty() && !municipal.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" municipal = ?");
                            params.add(municipal);
                            hasCondition = true;
                        }

                        if (perunit != null && !perunit.isEmpty() && !perunit.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" perunit = ?");
                            params.add(perunit);
                            hasCondition = true;
                        }

                        if (plastic != null && !plastic.isEmpty() && !plastic.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" plastic = ?");
                            params.add(plastic);
                            hasCondition = true;
                        }

                        if (rainfall != null && !rainfall.isEmpty() && !rainfall.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" rainfall = ?");
                            params.add(rainfall);
                            hasCondition = true;
                        }

                        if (stationcode != null && !stationcode.isEmpty() && !stationcode.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" stationcode = ?");
                            params.add(stationcode);
                            hasCondition = true;
                        }

                        if (tar != null && !tar.isEmpty() && !tar.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" tar = ?");
                            params.add(tar);
                            hasCondition = true;
                        }

                        if (wave != null && !wave.isEmpty() && !wave.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" wave = ?");
                            params.add(wave);
                            hasCondition = true;
                        }

                        if (yestrainfall != null && !yestrainfall.isEmpty() && !yestrainfall.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" yestrainfall = ?");
                            params.add(yestrainfall);
                        }
                        System.out.println(queryBuilder.toString());
                        System.out.println(params);

                        array = new EditQualityofSwimmingWatersTable().DeletefilteredSearch(queryBuilder.toString(), params);

                        break;
                    case "RenewableEnergySources":
                        queryBuilder.append("DELETE FROM RenewableEnergySources");

                        if (date != null && !date.isEmpty()) {

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date = ?");
                            params.add(date);
                            hasCondition = true;
                        }
                        if (energy != null && !energy.isEmpty()) {
                            double min = Double.parseDouble(energy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh = ?");
                            params.add(min);
                        }

                        array = new EditRenewableEnergySourcesTable().DeletefilteredSearch(queryBuilder.toString(), params);

                        break;
                }
                System.out.println(queryBuilder.toString());
                System.out.println(array);
                if (array) {
                    System.out.println("Delete Successful");
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().write("{\"message\": \"success\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
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
