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
import mainClasses.ProtectedAreaPlots;

public class EditProtectedAreaPlotsTable {

    public void addProtectedAreaPlotsFromJson(String Json) throws ClassNotFoundException, SQLException {
        ProtectedAreaPlots data = (ProtectedAreaPlots) JsonToProtectedAreaPlots(Json);
        addNewProtectedAreaPlots(data);
    }

    public ProtectedAreaPlots JsonToProtectedAreaPlots(String Json) {
        Gson gson = new Gson();

        ProtectedAreaPlots data = gson.fromJson(Json, ProtectedAreaPlots.class);
        return data;
    }

    public String ProtectedAreaPlotsToJson(ProtectedAreaPlots data) {
        Gson gson = new Gson();

        return gson.toJson(data, ProtectedAreaPlots.class);
    }

    public void CreateProtectedAreaPlotsTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE ProtectedAreaPlots "
                + "(area DOUBLE NULL, "
                + "date DATETIME NULL, "
                + "localAuthorityId VARCHAR(50) NULL, "
                + "plotNumber INT NULL)";
        stmt.execute(query);
        stmt.close();
    }

    public void addNewProtectedAreaPlots(ProtectedAreaPlots data) throws ClassNotFoundException, SQLException {
        String insertQuery = "INSERT INTO ProtectedAreaPlots(area,date,localAuthorityId,plotNumber) VALUES (?, ?, ?, ?)";
        try (Connection con = DB_Connection.getConnection(); PreparedStatement pstmt = con.prepareStatement(insertQuery)) {
            pstmt.setDouble(1, data.getArea());
            pstmt.setTimestamp(2, data.getDate());
            pstmt.setString(3, data.getLocalAuthorityId());
            pstmt.setInt(4, data.getPlotNumber());

            int rowsAffected = pstmt.executeUpdate();
        } catch (SQLException ex) {
            System.err.println("Exception caught in addNewElectricityCon: " + ex.getMessage());
            throw ex;
        }
    }

    public ArrayList<ProtectedAreaPlots> GetAllProtectedAreaPlots() throws SQLException, ClassNotFoundException {
        ArrayList<ProtectedAreaPlots> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "SELECT * FROM ProtectedAreaPlots";
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            ProtectedAreaPlots plot = new ProtectedAreaPlots();
            plot.setArea(rs.getDouble("area"));
            plot.setDate(rs.getTimestamp("date"));
            plot.setLocalAuthorityId(rs.getString("localAuthorityId"));
            plot.setPlotNumber(rs.getInt("plotNumber"));
            list.add(plot);
        }

        rs.close();
        stmt.close();
        con.close();
        return list;
    }

    public ArrayList<ProtectedAreaPlots> GetfilteredSearch(String query, List<Object> params) throws SQLException, ClassNotFoundException {
        ArrayList<ProtectedAreaPlots> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();

        try (PreparedStatement stmt = con.prepareStatement(query)) {
            for (int i = 0; i < params.size(); i++) {
                Object param = params.get(i);
                System.out.println(param);
                if (param instanceof String) {
                    stmt.setString(i + 1, (String) param);
                } else if (param instanceof Double) {
                    stmt.setDouble(i + 1, (Double) param);
                } else if (param instanceof Timestamp) {
                    stmt.setTimestamp(i + 1, (Timestamp) param);
                } else if (param instanceof Integer) {
                    stmt.setInt(i + 1, (Integer) param);
                }
            }

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                ProtectedAreaPlots plot = new ProtectedAreaPlots();
                plot.setArea(rs.getDouble("area"));
                plot.setDate(rs.getTimestamp("date"));
                plot.setLocalAuthorityId(rs.getString("localAuthorityId"));
                plot.setPlotNumber(rs.getInt("plotNumber"));
                list.add(plot);
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
                System.out.println(param);
                if (param instanceof String) {
                    stmt.setString(i + 1, (String) param);
                } else if (param instanceof Double) {
                    stmt.setDouble(i + 1, (Double) param);
                } else if (param instanceof Timestamp) {
                    stmt.setTimestamp(i + 1, (Timestamp) param);
                } else if (param instanceof Integer) {
                    stmt.setInt(i + 1, (Integer) param);
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
