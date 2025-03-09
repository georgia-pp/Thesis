package mainClasses;

import com.google.gson.Gson;
import java.sql.Timestamp;

public class ElectricityConsumption {
    String area;
    Timestamp date;
    double energy_mwh;

    public String getArea() {
        return area;
    }

    public Timestamp getDate() {
        return date;
    }

    public double getEnergy_mwh() {
        return energy_mwh;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public void setEnergy_mwh(double energy_mwh) {
        this.energy_mwh = energy_mwh;
    }

    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this, ElectricityConsumption.class);
    }
}