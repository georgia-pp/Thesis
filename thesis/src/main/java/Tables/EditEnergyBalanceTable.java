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
import mainClasses.EnergyBalance;

public class EditEnergyBalanceTable {

    public void addEnergyBalanceFromJson(String Json) throws ClassNotFoundException, SQLException {
        EnergyBalance data = (EnergyBalance) JsonToEnergyBalance(Json);
        addNewEnergyBalance(data);
    }

    public EnergyBalance JsonToEnergyBalance(String Json) {
        Gson gson = new Gson();

        EnergyBalance data = gson.fromJson(Json, EnergyBalance.class);
        return data;
    }

    public String EnergyBalanceToJson(EnergyBalance data) {
        Gson gson = new Gson();

        return gson.toJson(data, EnergyBalance.class);
    }

    public void CreateEnergyBalanceTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE EnergyBalance "
                + "(date DATETIME NULL, "
                + "energy_mwh INT NULL, "
                + "fuel VARCHAR(50) NULL, "
                + "percentage DOUBLE NULL)";
        stmt.execute(query);
        stmt.close();
    }

    public void addNewEnergyBalance(EnergyBalance data) throws ClassNotFoundException, SQLException {
        String insertQuery = "INSERT INTO EnergyBalance(date,energy_mwh,fuel,percentage) VALUES (?, ?, ?, ?)";
        try (Connection con = DB_Connection.getConnection(); PreparedStatement pstmt = con.prepareStatement(insertQuery)) {
            pstmt.setTimestamp(1, data.getDate());
            pstmt.setInt(2, data.getEnergy_mwh());
            pstmt.setString(3, data.getFuel());
            pstmt.setDouble(4, data.getPercentage());

            int rowsAffected = pstmt.executeUpdate();
        } catch (SQLException ex) {
            System.err.println("Exception caught in addNewElectricityCon: " + ex.getMessage());
            throw ex;
        }
    }

    public ArrayList<EnergyBalance> GetAllEnergyBalance() throws SQLException, ClassNotFoundException {
        ArrayList<EnergyBalance> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "SELECT * FROM EnergyBalance";
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            EnergyBalance eb = new EnergyBalance();
            eb.setDate(rs.getTimestamp("date"));
            eb.setEnergy_mwh(rs.getInt("energy_mwh"));
            eb.setFuel(rs.getString("fuel"));
            eb.setPercentage(rs.getDouble("percentage"));
            list.add(eb);
        }

        rs.close();
        stmt.close();
        con.close();
        return list;
    }

    public ArrayList<EnergyBalance> GetfilteredSearch(String query, List<Object> params) throws SQLException, ClassNotFoundException {
        ArrayList<EnergyBalance> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();

        try (PreparedStatement stmt = con.prepareStatement(query)) {
            for (int i = 0; i < params.size(); i++) {
                Object param = params.get(i);
                if (param instanceof String) {
                    stmt.setString(i + 1, (String) param);
                } else if (param instanceof Integer) {
                    stmt.setInt(i + 1, (Integer) param);
                } else if (param instanceof Double) {
                    stmt.setDouble(i + 1, (Double) param);
                } else if (param instanceof Timestamp) {
                    stmt.setTimestamp(i + 1, (Timestamp) param);
                }
            }

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                EnergyBalance eb = new EnergyBalance();
                eb.setDate(rs.getTimestamp("date"));
                eb.setEnergy_mwh(rs.getInt("energy_mwh"));
                eb.setFuel(rs.getString("fuel"));
                eb.setPercentage(rs.getDouble("percentage"));
                list.add(eb);
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
                } else if (param instanceof Integer) {
                    stmt.setInt(i + 1, (Integer) param);
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
