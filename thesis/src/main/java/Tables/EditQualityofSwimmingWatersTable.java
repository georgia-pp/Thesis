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
import mainClasses.QualityofSwimmingWaters;

public class EditQualityofSwimmingWatersTable {

    public void addQualityofSwimmingWatersFromJson(String Json) throws ClassNotFoundException, SQLException {
        QualityofSwimmingWaters data = (QualityofSwimmingWaters) JsonToQualityofSwimmingWaters(Json);
        addNewQualityofSwimmingWaters(data);
    }

    public QualityofSwimmingWaters JsonToQualityofSwimmingWaters(String Json) {
        Gson gson = new Gson();

        QualityofSwimmingWaters data = gson.fromJson(Json, QualityofSwimmingWaters.class);
        return data;
    }

    public String QualityofSwimmingWatersToJson(QualityofSwimmingWaters data) {
        Gson gson = new Gson();

        return gson.toJson(data, QualityofSwimmingWaters.class);
    }

    public void CreateQualityofSwimmingWatersTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE QualityofSwimmingWaters "
                + "(airdirection VARCHAR(50) NULL, "
                + "analysisDate VARCHAR(50) NULL, "
                + "caoutchouc VARCHAR(50) NULL, "
                + "coast VARCHAR(50) NULL, "
                + "deliveryDate VARCHAR(50) NULL, "
                + "description VARCHAR(10000) NULL, "
                + "ecoli VARCHAR(50) NULL, "
                + "garbage VARCHAR(50) NULL, "
                + "glass VARCHAR(50) NULL, "
                + "intenterococci VARCHAR(50) NULL, "
                + "municipal VARCHAR(50) NULL, "
                + "perunit VARCHAR(50) NULL, "
                + "plastic VARCHAR(50) NULL, "
                + "rainfall VARCHAR(50) NULL, "
                + "sampleTimestamp DATETIME NULL, "
                + "stationcode VARCHAR(50) NULL, "
                + "tar VARCHAR(50) NULL, "
                + "wave VARCHAR(50) NULL, "
                + "yestrainfall VARCHAR(50) NULL)";
        stmt.execute(query);
        stmt.close();
    }

    public void addNewQualityofSwimmingWaters(QualityofSwimmingWaters data) throws ClassNotFoundException, SQLException {
        String insertQuery = "INSERT INTO QualityofSwimmingWaters(airdirection,analysisDate,caoutchouc,coast,deliveryDate,description,ecoli,garbage,glass,intenterococci,municipal,perunit,plastic,rainfall,sampleTimestamp,stationcode,tar,wave,yestrainfall)"
                + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = DB_Connection.getConnection(); PreparedStatement pstmt = con.prepareStatement(insertQuery)) {
            pstmt.setString(1, data.getAirdirection());
            pstmt.setString(2, data.getAnalysisDate());
            pstmt.setString(3, data.getCaoutchouc());
            pstmt.setString(4, data.getCoast());
            pstmt.setString(5, data.getDeliveryDate());
            pstmt.setString(6, data.getDescription());
            pstmt.setString(7, data.getEcoli());
            pstmt.setString(8, data.getGarbage());
            pstmt.setString(9, data.getGlass());
            pstmt.setString(10, data.getIntenterococci());
            pstmt.setString(11, data.getMunicipal());
            pstmt.setString(12, data.getPerunit());
            pstmt.setString(13, data.getPlastic());
            pstmt.setString(14, data.getRainfall());
            pstmt.setTimestamp(15, data.getSampleTimestamp());
            pstmt.setString(16, data.getStationcode());
            pstmt.setString(17, data.getTar());
            pstmt.setString(18, data.getWave());
            pstmt.setString(19, data.getYestrainfall());

            int rowsAffected = pstmt.executeUpdate();

        } catch (SQLException ex) {
            System.err.println("Exception caught in addNewElectricityCon: " + ex.getMessage());
            throw ex;
        }
    }

    public ArrayList<QualityofSwimmingWaters> GetAllQualityofSwimmingWaters() throws SQLException, ClassNotFoundException {
        ArrayList<QualityofSwimmingWaters> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "SELECT * FROM QualityofSwimmingWaters";
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            QualityofSwimmingWaters water = new QualityofSwimmingWaters();
            water.setAirdirection(rs.getString("airdirection"));
            water.setAnalysisDate(rs.getString("analysisDate"));
            water.setCaoutchouc(rs.getString("caoutchouc"));
            water.setCoast(rs.getString("coast"));
            water.setDeliveryDate(rs.getString("deliveryDate"));
            water.setDescription(rs.getString("description"));
            water.setEcoli(rs.getString("ecoli"));
            water.setGarbage(rs.getString("garbage"));
            water.setGlass(rs.getString("glass"));
            water.setIntenterococci(rs.getString("intenterococci"));
            water.setMunicipal(rs.getString("municipal"));
            water.setPerunit(rs.getString("perunit"));
            water.setPlastic(rs.getString("plastic"));
            water.setRainfall(rs.getString("rainfall"));
            water.setSampleTimestamp(rs.getTimestamp("sampleTimestamp"));
            water.setStationcode(rs.getString("stationcode"));
            water.setTar(rs.getString("tar"));
            water.setWave(rs.getString("wave"));
            water.setYestrainfall(rs.getString("yestrainfall"));
            list.add(water);
        }

        rs.close();
        stmt.close();
        con.close();
        return list;
    }

    public ArrayList<QualityofSwimmingWaters> GetfilteredSearch(String query, List<Object> params) throws SQLException, ClassNotFoundException {
        ArrayList<QualityofSwimmingWaters> list = new ArrayList<>();
        Connection con = DB_Connection.getConnection();

        try (PreparedStatement stmt = con.prepareStatement(query)) {
            for (int i = 0; i < params.size(); i++) {
                Object param = params.get(i);
                if (param instanceof String) {
                    stmt.setString(i + 1, (String) param);
                } else if (param instanceof Timestamp) {
                    stmt.setTimestamp(i + 1, (Timestamp) param);
                }
            }

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                QualityofSwimmingWaters water = new QualityofSwimmingWaters();
                water.setAirdirection(rs.getString("airdirection"));
                water.setAnalysisDate(rs.getString("analysisDate"));
                water.setCaoutchouc(rs.getString("caoutchouc"));
                water.setCoast(rs.getString("coast"));
                water.setDeliveryDate(rs.getString("deliveryDate"));
                water.setDescription(rs.getString("description"));
                water.setEcoli(rs.getString("ecoli"));
                water.setGarbage(rs.getString("garbage"));
                water.setGlass(rs.getString("glass"));
                water.setIntenterococci(rs.getString("intenterococci"));
                water.setMunicipal(rs.getString("municipal"));
                water.setPerunit(rs.getString("perunit"));
                water.setPlastic(rs.getString("plastic"));
                water.setRainfall(rs.getString("rainfall"));
                water.setSampleTimestamp(rs.getTimestamp("sampleTimestamp"));
                water.setStationcode(rs.getString("stationcode"));
                water.setTar(rs.getString("tar"));
                water.setWave(rs.getString("wave"));
                water.setYestrainfall(rs.getString("yestrainfall"));
                list.add(water);
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
