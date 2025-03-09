package mainClasses;

import com.google.gson.Gson;
import java.sql.Timestamp;

public class ProtectedAreaPlots {
    double area;
    Timestamp date;
    String localAuthorityId;
    int plotNumber;

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public String getLocalAuthorityId() {
        return localAuthorityId;
    }

    public void setLocalAuthorityId(String localAuthorityId) {
        this.localAuthorityId = localAuthorityId;
    }

    public int getPlotNumber() {
        return plotNumber;
    }

    public void setPlotNumber(int plotNumber) {
        this.plotNumber = plotNumber;
    }

    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this, ProtectedAreaPlots.class);
    }
}