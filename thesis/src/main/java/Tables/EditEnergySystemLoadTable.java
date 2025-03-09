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
import mainClasses.EnergySystemLoad;

public class EditEnergySystemLoadTable {

    public void addEnergySystemLoadFromJson(String Json) throws ClassNotFoundException, SQLException {
        EnergySystemLoad data = (EnergySystemLoad) JsonToEnergySystemLoad(Json);
        addNewEnergySystemLoad(data);
    }

    public EnergySystemLoad JsonToEnergySystemLoad(String Json) {
        Gson gson = new Gson();

        EnergySystemLoad data = gson.fromJson(Json, EnergySystemLoad.class);
        return data;
    }

    public String EnergySystemLoadToJson(EnergySystemLoad data) {
        Gson gson = new Gson();

        return gson.toJson(data, EnergySystemLoad.class);
    }

    public void CreateEnergySystemLoadTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE EnergySystemLoad "
                + "(date DATETIME NULL, "
                + "energy_mwh DOUBLE NULL)";
        stmt.execute(query);
        stmt.close();
    }

    public void addNewEnergySystemLoad(EnergySystemLoad data) throws ClassNotFoundException, SQLException {
        String insertQuery = "INSERT INTO EnergySystemLoad(date,energy_mwh) VALUES (?, ?)";
        try (Connection con = DB_Connection.getConnection(); PreparedStatement pstmt = con.prepareStatement(insertQuery)) {
            pstmt.setTimestamp(1, data.getDate());
            pstmt.setDouble(2, data.getEnergy_mwh());

            int rowsAffected = pstmt.executeUpdate();

        } catch (SQLException ex) {
            System.err.println("Exception caught in addNewElectricityCon: " + ex.getMessage());
            throw ex;
        }
    }

    public ArrayList<EnergySystemLoad> GetAllEnergySystemLoad() throws SQLException, ClassNotFoundException {
        ArrayList<EnergySystemLoad> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "SELECT * FROM EnergySystemLoad";
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            EnergySystemLoad esl = new EnergySystemLoad();
            esl.setDate(rs.getTimestamp("date"));
            esl.setEnergy_mwh(rs.getDouble("energy_mwh"));
            list.add(esl);
        }

        rs.close();
        stmt.close();
        con.close();
        return list;
    }

    public ArrayList<EnergySystemLoad> GetfilteredSearch(String query, List<Object> params) throws SQLException, ClassNotFoundException {
        ArrayList<EnergySystemLoad> list = new ArrayList<>();
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
                EnergySystemLoad esl = new EnergySystemLoad();
                esl.setDate(rs.getTimestamp("date"));
                esl.setEnergy_mwh(rs.getDouble("energy_mwh"));
                list.add(esl);
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
