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
import mainClasses.HydrologicalData;

public class EditHydrologicalDataTable {

    public void addHydrologicalDataFromJson(String Json) throws ClassNotFoundException, SQLException {
        HydrologicalData data = (HydrologicalData) JsonToHydrologicalData(Json);
        addNewHydrologicalData(data);
    }

    public HydrologicalData JsonToHydrologicalData(String Json) {
        Gson gson = new Gson();

        HydrologicalData data = gson.fromJson(Json, HydrologicalData.class);
        return data;
    }

    public String HydrologicalDataToJson(HydrologicalData data) {
        Gson gson = new Gson();

        return gson.toJson(data, HydrologicalData.class);
    }

    public void CreateHydrologicalDataTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE HydrologicalData "
                + "(conductivity DOUBLE NULL, "
                + "damVolume DOUBLE NULL, "
                + "frequency VARCHAR(50) NULL, "
                + "station VARCHAR(50) NULL, "
                + "temperature DOUBLE NULL, "
                + "timestamp DATETIME NULL, "
                + "waterDepth DOUBLE NULL, "
                + "waterLevel DOUBLE NULL)";
        stmt.execute(query);
        stmt.close();
    }

    public void addNewHydrologicalData(HydrologicalData data) throws ClassNotFoundException, SQLException {
        String insertQuery = "INSERT INTO HydrologicalData(conductivity,damVolume,frequency,station,temperature,timestamp,waterDepth,waterLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = DB_Connection.getConnection(); PreparedStatement pstmt = con.prepareStatement(insertQuery)) {
            pstmt.setDouble(1, data.getConductivity());
            pstmt.setDouble(2, data.getDamVolume());
            pstmt.setString(3, data.getFrequency());
            pstmt.setString(4, data.getStation());
            pstmt.setDouble(5, data.getTemperature());
            pstmt.setTimestamp(6, data.getTimestamp());
            pstmt.setDouble(7, data.getWaterDepth());
            pstmt.setDouble(8, data.getWaterLevel());

            int rowsAffected = pstmt.executeUpdate();

        } catch (SQLException ex) {
            System.err.println("Exception caught in addNewElectricityCon: " + ex.getMessage());
            throw ex;
        }
    }

    public ArrayList<HydrologicalData> GetAllHydrologicalData() throws SQLException, ClassNotFoundException {
        ArrayList<HydrologicalData> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "SELECT * FROM HydrologicalData";
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            HydrologicalData hd = new HydrologicalData();
            hd.setConductivity(rs.getDouble("conductivity"));
            hd.setDamVolume(rs.getDouble("damVolume"));
            hd.setFrequency(rs.getString("frequency"));
            hd.setStation(rs.getString("station"));
            hd.setTemperature(rs.getDouble("temperature"));
            hd.setTimestamp(rs.getTimestamp("timestamp"));
            hd.setWaterDepth(rs.getDouble("waterDepth"));
            hd.setWaterLevel(rs.getDouble("waterLevel"));
            list.add(hd);
        }

        rs.close();
        stmt.close();
        con.close();
        return list;
    }

    public ArrayList<HydrologicalData> GetfilteredSearch(String query, List<Object> params) throws SQLException, ClassNotFoundException {
        ArrayList<HydrologicalData> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();

        try (PreparedStatement stmt = con.prepareStatement(query)) {
            for (int i = 0; i < params.size(); i++) {
                Object param = params.get(i);
                if (param instanceof Double) {
                    stmt.setDouble(i + 1, (Double) param);
                } else if (param instanceof Timestamp) {
                    stmt.setTimestamp(i + 1, (Timestamp) param);
                } else if (param instanceof String) {
                    stmt.setString(i + 1, (String) param);
                }
            }

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                HydrologicalData hd = new HydrologicalData();
                hd.setConductivity(rs.getDouble("conductivity"));
                hd.setDamVolume(rs.getDouble("damVolume"));
                hd.setFrequency(rs.getString("frequency"));
                hd.setStation(rs.getString("station"));
                hd.setTemperature(rs.getDouble("temperature"));
                hd.setTimestamp(rs.getTimestamp("timestamp"));
                hd.setWaterDepth(rs.getDouble("waterDepth"));
                hd.setWaterLevel(rs.getDouble("waterLevel"));
                list.add(hd);
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
                if (param instanceof Double) {
                    stmt.setDouble(i + 1, (Double) param);
                } else if (param instanceof Timestamp) {
                    stmt.setTimestamp(i + 1, (Timestamp) param);
                } else if (param instanceof String) {
                    stmt.setString(i + 1, (String) param);
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
