package mainClasses;

import com.google.gson.Gson;
import java.sql.Date;

public class ParcelsofLand {
    Date date;
    int otaId;
    String otaName;
    String otaNameEn;
    int plots;
    
    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getOtaId() {
        return otaId;
    }

    public void setOtaId(int otaId) {
        this.otaId = otaId;
    }

    public String getOtaName() {
        return otaName;
    }

    public void setOtaName(String otaName) {
        this.otaName = otaName;
    }

    public String getOtaNameEn() {
        return otaNameEn;
    }

    public void setOtaNameEn(String otaNameEn) {
        this.otaNameEn = otaNameEn;
    }

    public int getPlots() {
        return plots;
    }

    public void setPlots(int plots) {
        this.plots = plots;
    }
    
    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this, ParcelsofLand.class);
    }
}