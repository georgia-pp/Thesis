package Tables;

import DataBase.DB_Connection;
import com.google.gson.Gson;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import mainClasses.ElectricityConsumption;

public class EditElectricityConTable {

    public void addElectricityConFromJson(String Json) throws ClassNotFoundException, SQLException {
        ElectricityConsumption data = (ElectricityConsumption) JsonToElectricityCon(Json);
        addNewElectricityCon(data);
    }

    public ElectricityConsumption JsonToElectricityCon(String Json) {
        Gson gson = new Gson();

        ElectricityConsumption data = gson.fromJson(Json, ElectricityConsumption.class);
        return data;
    }

    public String ElectricityConToJson(ElectricityConsumption data) {
        Gson gson = new Gson();

        return gson.toJson(data, ElectricityConsumption.class);
    }

    public void CreateElectricityConsumptionTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE ElectricityConsumption "
                + "(area VARCHAR(50) NULL, "
                + "    date DATETIME NULL, "
                + "    energy_mwh DOUBLE NULL)";
        stmt.execute(query);
        stmt.close();
    }

    public void addNewElectricityCon(ElectricityConsumption data) throws ClassNotFoundException, SQLException {
        String insertQuery = "INSERT INTO ElectricityConsumption(area, date, energy_mwh) VALUES (?, ?, ?)";
        try (Connection con = DB_Connection.getConnection(); PreparedStatement pstmt = con.prepareStatement(insertQuery)) {

            pstmt.setString(1, data.getArea());
            pstmt.setTimestamp(2, data.getDate());
            pstmt.setDouble(3, data.getEnergy_mwh());
            int rowsAffected = pstmt.executeUpdate();
        } catch (SQLException ex) {
            System.err.println("Exception caught in addNewElectricityCon: " + ex.getMessage());
            throw ex;
        }
    }

    public ArrayList<ElectricityConsumption> GetAllElectricityConsumption() throws SQLException, ClassNotFoundException {
        ArrayList<ElectricityConsumption> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "SELECT * FROM ElectricityConsumption";
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            ElectricityConsumption ec = new ElectricityConsumption();
            ec.setArea(rs.getString("area"));
            ec.setDate(rs.getTimestamp("date"));
            ec.setEnergy_mwh(rs.getDouble("energy_mwh"));
            list.add(ec);
        }

        rs.close();
        stmt.close();
        con.close();
        return list;
    }

    public ArrayList<ElectricityConsumption> GetfilteredSearch(String query, List<Object> params) throws SQLException, ClassNotFoundException {
        ArrayList<ElectricityConsumption> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();

        try (PreparedStatement stmt = con.prepareStatement(query)) {
            for (int i = 0; i < params.size(); i++) {
                Object param = params.get(i);
                if (param instanceof String) {
                    stmt.setString(i + 1, (String) param);
                } else if (param instanceof Double) {
                    stmt.setDouble(i + 1, (Double) param);
                } else if (param instanceof Timestamp) {
                    stmt.setTimestamp(i + 1, (Timestamp) param);
                }
            }

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                ElectricityConsumption consumption = new ElectricityConsumption();
                consumption.setArea(rs.getString("area"));
                consumption.setDate(rs.getTimestamp("date"));
                consumption.setEnergy_mwh(rs.getDouble("energy_mwh"));

                list.add(consumption);
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            con.close();
        }

        return list;
    }

    public boolean DeletefilteredSearch(String query, List<Object> params) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        try (PreparedStatement stmt = con.prepareStatement(query)) {

            for (int i = 0; i < params.size(); i++) {
                Object param = params.get(i);
                if (param instanceof String) {
                    stmt.setString(i + 1, (String) param);
                } else if (param instanceof Double) {
                    stmt.setDouble(i + 1, (Double) param);
                } else if (param instanceof Timestamp) {
                    stmt.setTimestamp(i + 1, (Timestamp) param);
                }
            }

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            con.close();
        }

        return false;
    }

}
