package mainClasses;

import com.google.gson.Gson;
import java.sql.Timestamp;

public class HydrologicalData {
    double conductivity;
    double damVolume;
    String frequency;
    String station;
    double temperature;
    Timestamp timestamp;
    double waterDepth;
    double waterLevel;

    public double getConductivity() {
        return conductivity;
    }
    
    public double getDamVolume() {
        return damVolume;
    }

    public String getFrequency() {
        return frequency;
    }

    public String getStation() {
        return station;
    }

    public double getTemperature() {
        return temperature;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public double getWaterDepth() {
        return waterDepth;
    }

    public double getWaterLevel() {
        return waterLevel;
    }

    public void setConductivity(double conductivity) {
        this.conductivity = conductivity;
    }
    
    public void setDamVolume(double damVolume) {
        this.damVolume = damVolume;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public void setStation(String station) {
        this.station = station;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public void setWaterDepth(double waterDepth) {
        this.waterDepth = waterDepth;
    }

    public void setWaterLevel(double waterLevel) {
        this.waterLevel = waterLevel;
    }

    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this, HydrologicalData.class);
    }
}