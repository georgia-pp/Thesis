package Tables;

import DataBase.DB_Connection;
import com.google.gson.Gson;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import mainClasses.ParcelsofLand;

public class EditParcelsofLandTable {

    public void addParcelsofLandFromJson(String Json) throws ClassNotFoundException, SQLException {
        ParcelsofLand data = (ParcelsofLand) JsonToParcelsofLand(Json);
        addNewParcelsofLand(data);
    }

    public ParcelsofLand JsonToParcelsofLand(String Json) {
        Gson gson = new Gson();

        ParcelsofLand data = gson.fromJson(Json, ParcelsofLand.class);
        return data;
    }

    public String ParcelsofLandToJson(ParcelsofLand data) {
        Gson gson = new Gson();

        return gson.toJson(data, ParcelsofLand.class);
    }

    public void CreateParcelsofLandTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE ParcelsofLand "
                + "(date DATE NULL, "
                + "otaId INT NULL, "
                + "otaName VARCHAR(50) NULL, "
                + "otaNameEn VARCHAR(50) NULL, "
                + "plots INT NULL)";
        stmt.execute(query);
        stmt.close();
    }

    public void addNewParcelsofLand(ParcelsofLand data) throws ClassNotFoundException, SQLException {
        String insertQuery = "INSERT INTO ParcelsofLand(date,otaId,otaName,otaNameEn,plots) VALUES (?, ?, ?, ?, ?)";
        try (Connection con = DB_Connection.getConnection(); PreparedStatement pstmt = con.prepareStatement(insertQuery)) {
            pstmt.setDate(1, data.getDate());
            pstmt.setInt(2, data.getOtaId());
            pstmt.setString(3, data.getOtaName());
            pstmt.setString(4, data.getOtaNameEn());
            pstmt.setInt(5, data.getPlots());

            int rowsAffected = pstmt.executeUpdate();

        } catch (SQLException ex) {
            System.err.println("Exception caught in addNewElectricityCon: " + ex.getMessage());
            throw ex;
        }
    }

    public ArrayList<ParcelsofLand> GetAllParcelsofLand() throws SQLException, ClassNotFoundException {
        ArrayList<ParcelsofLand> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "SELECT * FROM ParcelsofLand";
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            ParcelsofLand parcel = new ParcelsofLand();
            parcel.setDate(rs.getDate("date"));
            parcel.setOtaId(rs.getInt("otaId"));
            parcel.setOtaName(rs.getString("otaName"));
            parcel.setOtaNameEn(rs.getString("otaNameEn"));
            parcel.setPlots(rs.getInt("plots"));
            list.add(parcel);
        }

        rs.close();
        stmt.close();
        con.close();
        return list;
    }

    public ArrayList<ParcelsofLand> GetfilteredSearch(String query, List<Object> params) throws SQLException, ClassNotFoundException {
        ArrayList<ParcelsofLand> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();

        try (PreparedStatement stmt = con.prepareStatement(query)) {
            for (int i = 0; i < params.size(); i++) {
                Object param = params.get(i);
                if (param instanceof Integer) {
                    stmt.setInt(i + 1, (Integer) param);
                } else if (param instanceof String) {
                    stmt.setString(i + 1, (String) param);
                }
            }

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                ParcelsofLand parcel = new ParcelsofLand();
                parcel.setDate(rs.getDate("date"));
                parcel.setOtaId(rs.getInt("otaId"));
                parcel.setOtaName(rs.getString("otaName"));
                parcel.setOtaNameEn(rs.getString("otaNameEn"));
                parcel.setPlots(rs.getInt("plots"));
                list.add(parcel);
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
                if (param instanceof Integer) {
                    stmt.setInt(i + 1, (Integer) param);
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
