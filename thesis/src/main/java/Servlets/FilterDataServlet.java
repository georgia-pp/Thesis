package Servlets;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.util.ArrayList;

import Tables.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 *
 * @author georgia
 */
public class FilterDataServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        String dataType = request.getParameter("dataType");
        String startDate = request.getParameter("start-date");
        String endDate = request.getParameter("end-date");
        String area = request.getParameter("area-filter");
        String minEnergy = request.getParameter("min-energy");
        String maxEnergy = request.getParameter("max-energy");
        String fuel = request.getParameter("fuel-filter");
        String minPercentage = request.getParameter("min-percentage");
        String maxPercentage = request.getParameter("max-percentage");
        String minConductivity = request.getParameter("min-conductivity");
        String maxConductivity = request.getParameter("max-conductivity");
        String minDamVol = request.getParameter("min-damVol");
        String maxDamVol = request.getParameter("max-damVol");
        String frequency = request.getParameter("frequency-filter");
        String station = request.getParameter("station-filter");
        String minTemperature = request.getParameter("min-temperature");
        String maxTemperature = request.getParameter("max-temperature");
        String minWaterDepth = request.getParameter("min-waterDepth");
        String maxWaterDepth = request.getParameter("max-waterDepth");
        String minWaterLevel = request.getParameter("min-waterLevel");
        String maxWaterLevel = request.getParameter("max-waterLevel");
        String otaId = request.getParameter("otaId-filter");
        String otaName = request.getParameter("otaName-filter");
        String otaNameEn = request.getParameter("otaNameEn-filter");
        String minPlots = request.getParameter("min-plots");
        String maxPlots = request.getParameter("max-plots");
        String localAuthorityId = request.getParameter("localAuthorityId-filter");
        String airdirection = request.getParameter("airdirection-filter");
        String caoutchouc = request.getParameter("caoutchouc-filter");
        String coast = request.getParameter("coast-filter");
        String description = request.getParameter("description-filter");
        String minEcoli = request.getParameter("min-ecoli");
        String maxEcoli = request.getParameter("max-ecoli");
        String garbage = request.getParameter("garbage-filter");
        String glass = request.getParameter("glass-filter");
        String minIntenterococci = request.getParameter("min-intenterococci");
        String maxIntenterococci = request.getParameter("max-intenterococci");
        String municipal = request.getParameter("municipal-filter");
        String perunit = request.getParameter("perunit-filter");
        String plastic = request.getParameter("plastic-filter");
        String rainfall = request.getParameter("rainfall-filter");
        String stationcode = request.getParameter("stationcode-filter");
        String tar = request.getParameter("tar-filter");
        String wave = request.getParameter("wave-filter");
        String yestrainfall = request.getParameter("yestrainfall-filter");

        SimpleDateFormat inputFormat = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");

        if (dataType != null) {
            try {
                ArrayList<?> array = null;
                List<Object> params = new ArrayList<>();
                StringBuilder queryBuilder = new StringBuilder();
                boolean hasCondition = false;

                switch (dataType) {
                    case "ElectricityConsumption":
                        queryBuilder.append("SELECT * FROM ElectricityConsumption");

                        if (startDate != null && !startDate.isEmpty()) {
                            try {
                                startDate = outputFormat.format(inputFormat.parse(startDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(date) >= ?");
                            params.add(startDate);
                            hasCondition = true;
                        }
                        if (endDate != null && !endDate.isEmpty()) {
                            try {
                                endDate = outputFormat.format(inputFormat.parse(endDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(date) <= ?");
                            params.add(endDate);
                            hasCondition = true;
                        }
                        if (area != null && !area.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" area = ?");
                            params.add(area);
                            hasCondition = true;
                        }
                        if (minEnergy != null && !minEnergy.isEmpty()) {
                            double min = Double.parseDouble(minEnergy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh >= ?");
                            params.add(min);
                            hasCondition = true;
                        }
                        if (maxEnergy != null && !maxEnergy.isEmpty()) {
                            double max = Double.parseDouble(maxEnergy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh <= ?");
                            params.add(max);
                        }

                        array = new EditElectricityConTable().GetfilteredSearch(queryBuilder.toString(), params);
                        if (array != null) {
                            Gson gson = new GsonBuilder()
                                    .setDateFormat("yyyy-MM-dd HH:mm:ss")
                                    .create();
                            String jsonWithDatas = gson.toJson(array);
                            response.getWriter().write(jsonWithDatas);
                            response.setStatus(200);
                        } else {
                            response.setStatus(404);
                        }
                        break;
                    case "EnergyBalance":
                        queryBuilder.append("SELECT * FROM EnergyBalance");

                        if (startDate != null && !startDate.isEmpty()) {
                            try {
                                startDate = outputFormat.format(inputFormat.parse(startDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(date) >= ?");
                            params.add(startDate);
                            hasCondition = true;
                        }

                        if (endDate != null && !endDate.isEmpty()) {
                            try {
                                endDate = outputFormat.format(inputFormat.parse(endDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(date) <= ?");
                            params.add(endDate);
                            hasCondition = true;
                        }

                        if (fuel != null && !fuel.equals("all")) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" fuel = ?");
                            params.add(fuel);
                            hasCondition = true;
                        }

                        if (minEnergy != null && !minEnergy.isEmpty()) {
                            int min = Integer.parseInt(minEnergy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh >= ?");
                            params.add(min);
                            hasCondition = true;
                        }

                        if (maxEnergy != null && !maxEnergy.isEmpty()) {
                            int max = Integer.parseInt(maxEnergy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh <= ?");
                            params.add(max);
                            hasCondition = true;
                        }
                        if (minPercentage != null && !minPercentage.isEmpty()) {
                            double min = Double.parseDouble(minPercentage);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh >= ?");
                            params.add(min);
                            hasCondition = true;
                        }
                        if (maxPercentage != null && !maxPercentage.isEmpty()) {
                            double max = Double.parseDouble(maxPercentage);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh <= ?");
                            params.add(max);
                        }

                        array = new EditEnergyBalanceTable().GetfilteredSearch(queryBuilder.toString(), params);
                        if (array != null) {
                            Gson gson = new GsonBuilder()
                                    .setDateFormat("yyyy-MM-dd HH:mm:ss")
                                    .create();
                            String jsonWithDatas = gson.toJson(array);
                            response.getWriter().write(jsonWithDatas);
                            response.setStatus(200);
                        } else {
                            response.setStatus(404);
                        }
                        break;
                    case "EnergySystemLoad":
                        queryBuilder.append("SELECT * FROM EnergySystemLoad");

                        if (startDate != null && !startDate.isEmpty()) {
                            try {
                                startDate = outputFormat.format(inputFormat.parse(startDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(date) >= ?");
                            params.add(startDate);
                            hasCondition = true;
                        }

                        if (endDate != null && !endDate.isEmpty()) {
                            try {
                                endDate = outputFormat.format(inputFormat.parse(endDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(date) <= ?");
                            params.add(endDate);
                            hasCondition = true;
                        }
                        if (minEnergy != null && !minEnergy.isEmpty()) {
                            double min = Double.parseDouble(minEnergy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh >= ?");
                            params.add(min);
                            hasCondition = true;
                        }

                        if (maxEnergy != null && !maxEnergy.isEmpty()) {
                            double max = Double.parseDouble(maxEnergy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh <= ?");
                            params.add(max);
                        }
                        array = new EditEnergySystemLoadTable().GetfilteredSearch(queryBuilder.toString(), params);
                        if (array != null) {
                            Gson gson = new GsonBuilder()
                                    .setDateFormat("yyyy-MM-dd HH:mm:ss")
                                    .create();
                            String jsonWithDatas = gson.toJson(array);
                            response.getWriter().write(jsonWithDatas);
                            response.setStatus(200);
                        } else {
                            response.setStatus(404);
                        }
                        break;
                    case "HydrologicalData":
                        queryBuilder.append("SELECT * FROM HydrologicalData");

                        if (startDate != null && !startDate.isEmpty()) {
                            try {
                                startDate = outputFormat.format(inputFormat.parse(startDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(timestamp) >= ?");
                            params.add(startDate);
                            hasCondition = true;
                        }

                        if (endDate != null && !endDate.isEmpty()) {
                            try {
                                endDate = outputFormat.format(inputFormat.parse(endDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(timestamp) <= ?");
                            params.add(endDate);
                            hasCondition = true;
                        }
                        if (minConductivity != null && !minConductivity.isEmpty()) {
                            double minConductivityValue = Double.parseDouble(minConductivity);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" conductivity >= ?");
                            params.add(minConductivityValue);
                            hasCondition = true;
                        }

                        if (maxConductivity != null && !maxConductivity.isEmpty()) {
                            double maxConductivityValue = Double.parseDouble(maxConductivity);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" conductivity <= ?");
                            params.add(maxConductivityValue);
                            hasCondition = true;
                        }

                        if (minDamVol != null && !minDamVol.isEmpty()) {
                            double minDamVolValue = Double.parseDouble(minDamVol);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" damVolume >= ?");
                            params.add(minDamVolValue);
                            hasCondition = true;
                        }

                        if (maxDamVol != null && !maxDamVol.isEmpty()) {
                            double maxDamVolValue = Double.parseDouble(maxDamVol);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" damVolume <= ?");
                            params.add(maxDamVolValue);
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

                        if (minTemperature != null && !minTemperature.isEmpty()) {
                            double minTemperatureValue = Double.parseDouble(minTemperature);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" temperature >= ?");
                            params.add(minTemperatureValue);
                            hasCondition = true;
                        }

                        if (maxTemperature != null && !maxTemperature.isEmpty()) {
                            double maxTemperatureValue = Double.parseDouble(maxTemperature);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" temperature <= ?");
                            params.add(maxTemperatureValue);
                            hasCondition = true;
                        }

                        if (minWaterDepth != null && !minWaterDepth.isEmpty()) {
                            double minWaterDepthValue = Double.parseDouble(minWaterDepth);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" waterDepth >= ?");
                            params.add(minWaterDepthValue);
                            hasCondition = true;
                        }

                        if (maxWaterDepth != null && !maxWaterDepth.isEmpty()) {
                            double maxWaterDepthValue = Double.parseDouble(maxWaterDepth);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" waterDepth <= ?");
                            params.add(maxWaterDepthValue);
                            hasCondition = true;
                        }

                        if (minWaterLevel != null && !minWaterLevel.isEmpty()) {
                            double minWaterLevelValue = Double.parseDouble(minWaterLevel);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" waterLevel >= ?");
                            params.add(minWaterLevelValue);
                            hasCondition = true;
                        }

                        if (maxWaterLevel != null && !maxWaterLevel.isEmpty()) {
                            double maxWaterLevelValue = Double.parseDouble(maxWaterLevel);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" waterLevel <= ?");
                            params.add(maxWaterLevelValue);
                        }

                        array = new EditHydrologicalDataTable().GetfilteredSearch(queryBuilder.toString(), params);
                        if (array != null) {
                            Gson gson = new GsonBuilder()
                                    .setDateFormat("yyyy-MM-dd HH:mm:ss")
                                    .create();
                            String jsonWithDatas = gson.toJson(array);
                            response.getWriter().write(jsonWithDatas);
                            response.setStatus(200);
                        } else {
                            response.setStatus(404);
                        }
                        break;
                    case "ParcelsofLand":
                        queryBuilder.append("SELECT * FROM ParcelsofLand");

                        if (startDate != null && !startDate.isEmpty()) {
                            try {
                                startDate = outputFormat.format(inputFormat.parse(startDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date >= ?");
                            params.add(startDate);
                            hasCondition = true;
                        }
                        if (endDate != null && !endDate.isEmpty()) {
                            try {
                                endDate = outputFormat.format(inputFormat.parse(endDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date <= ?");
                            params.add(endDate);
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
                        if (minPlots != null && !minPlots.isEmpty()) {
                            int minPlotsValue = Integer.parseInt(minPlots);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" plots >= ?");
                            params.add(minPlotsValue);
                            hasCondition = true;
                        }
                        if (maxPlots != null && !maxPlots.isEmpty()) {
                            int maxPlotsValue = Integer.parseInt(maxPlots);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" plots <= ?");
                            params.add(maxPlotsValue);
                        }

                        array = new EditParcelsofLandTable().GetfilteredSearch(queryBuilder.toString(), params);
                        if (array != null) {
                            Gson gson = new GsonBuilder()
                                    .setDateFormat("yyyy-MM-dd")
                                    .create();
                            String jsonWithDatas = gson.toJson(array);
                            response.getWriter().write(jsonWithDatas);
                            response.setStatus(200);
                        } else {
                            response.setStatus(404);
                        }
                        break;
                    case "ProtectedAreaPlots":
                        queryBuilder.append("SELECT * FROM ProtectedAreaPlots");

                        if (area != null && !area.equals("all")) {
                            double areaValue = Double.parseDouble(area);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" area = ?");
                            params.add(areaValue);
                            hasCondition = true;
                        }
                        if (startDate != null && !startDate.isEmpty()) {
                            try {
                                startDate = outputFormat.format(inputFormat.parse(startDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date >= ?");
                            params.add(startDate);
                            hasCondition = true;
                        }

                        if (endDate != null && !endDate.isEmpty()) {
                            try {
                                endDate = outputFormat.format(inputFormat.parse(endDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" date <= ?");
                            params.add(endDate);
                            hasCondition = true;
                        }
                        if (localAuthorityId != null && !localAuthorityId.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" localAuthorityId = ?");
                            params.add(localAuthorityId);
                            hasCondition = true;
                        }
                        if (minPlots != null && !minPlots.isEmpty()) {
                            int minPlotsValue = Integer.parseInt(minPlots);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" plotNumber >= ?");
                            params.add(minPlotsValue);
                            hasCondition = true;
                        }

                        if (maxPlots != null && !maxPlots.isEmpty()) {
                            int maxPlotsValue = Integer.parseInt(maxPlots);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" plotNumber <= ?");
                            params.add(maxPlotsValue);
                        }

                        array = new EditProtectedAreaPlotsTable().GetfilteredSearch(queryBuilder.toString(), params);
                        if (array != null) {
                            Gson gson = new GsonBuilder()
                                    .setDateFormat("yyyy-MM-dd HH:mm:ss")
                                    .create();
                            String jsonWithDatas = gson.toJson(array);
                            response.getWriter().write(jsonWithDatas);
                            response.setStatus(200);
                        } else {
                            response.setStatus(404);
                        }
                        break;
                    case "QualityofSwimmingWaters":
                        queryBuilder.append("SELECT * FROM QualityofSwimmingWaters");

                        if (startDate != null && !startDate.isEmpty()) {
                            try {
                                startDate = outputFormat.format(inputFormat.parse(startDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(sampleTimestamp) >= ?");
                            params.add(startDate);
                            hasCondition = true;
                        }

                        if (endDate != null && !endDate.isEmpty()) {
                            try {
                                endDate = outputFormat.format(inputFormat.parse(endDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(sampleTimestamp) <= ?");
                            params.add(endDate);
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

                        if (minEcoli != null && !minEcoli.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" ecoli >= ?");
                            params.add(minEcoli);
                            hasCondition = true;
                        }

                        if (maxEcoli != null && !maxEcoli.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" ecoli <= ?");
                            params.add(maxEcoli);
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

                        if (minIntenterococci != null && !minIntenterococci.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" intenterococci >= ?");
                            params.add(minIntenterococci);
                            hasCondition = true;
                        }

                        if (maxIntenterococci != null && !maxIntenterococci.isEmpty()) {
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" intenterococci <= ?");
                            params.add(maxIntenterococci);
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

                        array = new EditQualityofSwimmingWatersTable().GetfilteredSearch(queryBuilder.toString(), params);
                        if (array != null) {
                            Gson gson = new GsonBuilder()
                                    .setDateFormat("yyyy-MM-dd HH:mm:ss")
                                    .create();
                            String jsonWithDatas = gson.toJson(array);
                            response.getWriter().write(jsonWithDatas);
                            response.setStatus(200);
                        } else {
                            response.setStatus(404);
                        }
                        break;
                    case "RenewableEnergySources":
                        queryBuilder.append("SELECT * FROM RenewableEnergySources");

                        if (startDate != null && !startDate.isEmpty()) {
                            try {
                                startDate = outputFormat.format(inputFormat.parse(startDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(date) >= ?");
                            params.add(startDate);
                            hasCondition = true;
                        }

                        if (endDate != null && !endDate.isEmpty()) {
                            try {
                                endDate = outputFormat.format(inputFormat.parse(endDate));
                            } catch (ParseException e) {
                                response.setStatus(400);
                                return;
                            }

                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" DATE(date) <= ?");
                            params.add(endDate);
                            hasCondition = true;
                        }
                        if (minEnergy != null && !minEnergy.isEmpty()) {
                            double min = Double.parseDouble(minEnergy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh >= ?");
                            params.add(min);
                            hasCondition = true;
                        }

                        if (maxEnergy != null && !maxEnergy.isEmpty()) {
                            double max = Double.parseDouble(maxEnergy);
                            queryBuilder.append(hasCondition ? " AND" : " WHERE").append(" energy_mwh <= ?");
                            params.add(max);
                        }

                        array = new EditRenewableEnergySourcesTable().GetfilteredSearch(queryBuilder.toString(), params);
                        if (array != null) {
                            Gson gson = new GsonBuilder()
                                    .setDateFormat("yyyy-MM-dd HH:mm:ss")
                                    .create();
                            String jsonWithDatas = gson.toJson(array);
                            response.getWriter().write(jsonWithDatas);
                            response.setStatus(200);
                        } else {
                            response.setStatus(404);
                        }
                        break;
                }
            } catch (SQLException | ClassNotFoundException e) {
                e.printStackTrace();
                response.setStatus(500);
            }
        } else {
            response.setStatus(400);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }
}
