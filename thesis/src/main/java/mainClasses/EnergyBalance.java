package mainClasses;

import com.google.gson.Gson;
import java.sql.Timestamp;

public class EnergyBalance { 
    Timestamp date;
    int energy_mwh;
    String fuel;
    double percentage;

    public Timestamp getDate() {
        return date;
    }

    public int getEnergy_mwh() {
        return energy_mwh;
    }

    public String getFuel() {
        return fuel;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }
    
    public void setEnergy_mwh(int energy_mwh) {
        this.energy_mwh = energy_mwh;
    }

    public void setFuel(String fuel) {
        this.fuel = fuel;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this, EnergyBalance.class);
    }
}