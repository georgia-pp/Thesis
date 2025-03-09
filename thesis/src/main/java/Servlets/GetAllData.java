package Servlets;

import Tables.EditElectricityConTable;
import Tables.EditEnergyBalanceTable;
import Tables.EditEnergySystemLoadTable;
import Tables.EditHydrologicalDataTable;
import Tables.EditParcelsofLandTable;
import Tables.EditProtectedAreaPlotsTable;
import Tables.EditQualityofSwimmingWatersTable;
import Tables.EditRenewableEnergySourcesTable;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author georgia
 */
public class GetAllData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String dataType = request.getParameter("dataType");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (dataType != null) {
            try {
                ArrayList<?> array = getDataArray(dataType);
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
            } catch (SQLException | ClassNotFoundException e) {
                e.printStackTrace();
                response.setStatus(500);
            }
        } else {
            response.setStatus(400);
        }
    }

    private ArrayList<?> getDataArray(String dataType) throws SQLException, ClassNotFoundException {
        ArrayList<?> array = null;

        switch (dataType) {
            case "ElectricityConsumption":
                array = new EditElectricityConTable().GetAllElectricityConsumption();
                break;
            case "EnergyBalance":
                array = new EditEnergyBalanceTable().GetAllEnergyBalance();
                break;
            case "EnergySystemLoad":
                array = new EditEnergySystemLoadTable().GetAllEnergySystemLoad();
                break;
            case "HydrologicalData":
                array = new EditHydrologicalDataTable().GetAllHydrologicalData();
                break;
            case "ParcelsofLand":
                array = new EditParcelsofLandTable().GetAllParcelsofLand();
                break;
            case "ProtectedAreaPlots":
                array = new EditProtectedAreaPlotsTable().GetAllProtectedAreaPlots();
                break;
            case "QualityofSwimmingWaters":
                array = new EditQualityofSwimmingWatersTable().GetAllQualityofSwimmingWaters();
                break;
            case "RenewableEnergySources":
                array = new EditRenewableEnergySourcesTable().GetAllRenewableEnergySources();
                break;
            default:
                return null;
        }
        return array;
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

}
