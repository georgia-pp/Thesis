package Tables;

import DataBase.DB_Connection;
import com.google.gson.Gson;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import mainClasses.Profile;

public class EditProfilesTable {

    public void addProfilesFromJson(String Json) throws ClassNotFoundException, SQLException {
        Profile data = (Profile) JsonToProfile(Json);
        addNewProfile(data);
    }

    public Profile JsonToProfile(String Json) {
        Gson gson = new Gson();

        Profile data = gson.fromJson(Json, Profile.class);
        return data;
    }

    public String ProfileToJson(Profile data) {
        Gson gson = new Gson();

        return gson.toJson(data, Profile.class);
    }

    public void CreateProfileTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE Profile "
                + "(username VARCHAR(50) NULL, "
                + "    password VARCHAR(50) NULL, "
                + "    email VARCHAR(50) NULL)";
        stmt.execute(query);
        stmt.close();
    }

    public void addNewProfile(Profile data) throws ClassNotFoundException, SQLException {
        String insertQuery = "INSERT INTO Profile(username, password, email) VALUES (?, ?, ?)";
        try (Connection con = DB_Connection.getConnection(); PreparedStatement pstmt = con.prepareStatement(insertQuery)) {

            pstmt.setString(1, data.getUsername());
            pstmt.setString(2, data.getPassword());
            pstmt.setString(3, data.getEmail());
            int rowsAffected = pstmt.executeUpdate();
        } catch (SQLException ex) {
            System.err.println("Exception caught in addProfile: " + ex.getMessage());
            throw ex;
        }
    }

    public boolean FindProfile(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();

        String query = "SELECT * FROM Profile WHERE username = ? AND password = ?";
        try (PreparedStatement stmt = con.prepareStatement(query)) {
            stmt.setString(1, username);
            stmt.setString(2, password);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return true;
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            con.close();
        }
        return false;
    }
}
