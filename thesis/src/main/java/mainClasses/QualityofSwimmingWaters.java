package mainClasses;

import com.google.gson.Gson;
import java.sql.Timestamp;

public class QualityofSwimmingWaters {
    private String airdirection;
    private String analysisDate;
    private String caoutchouc;
    private String coast;
    private String deliveryDate;
    private String description;
    private String ecoli;
    private String garbage;
    private String glass;
    private String intenterococci;
    private String municipal;
    private String perunit;
    private String plastic;
    private String rainfall;
    private Timestamp sampleTimestamp;
    private String stationcode;
    private String tar;
    private String wave;
    private String yestrainfall;

    public String getAirdirection() {
        return airdirection;
    }

    public void setAirdirection(String airdirection) {
        this.airdirection = airdirection;
    }

    public String getAnalysisDate() {
        return analysisDate;
    }

    public void setAnalysisDate(String analysisDate) {
        this.analysisDate = analysisDate;
    }

    public String getCaoutchouc() {
        return caoutchouc;
    }

    public void setCaoutchouc(String caoutchouc) {
        this.caoutchouc = caoutchouc;
    }

    public String getCoast() {
        return coast;
    }

    public void setCoast(String coast) {
        this.coast = coast;
    }

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEcoli() {
        return ecoli;
    }

    public void setEcoli(String ecoli) {
        this.ecoli = ecoli;
    }

    public String getGarbage() {
        return garbage;
    }

    public void setGarbage(String garbage) {
        this.garbage = garbage;
    }

    public String getGlass() {
        return glass;
    }

    public void setGlass(String glass) {
        this.glass = glass;
    }

    public String getIntenterococci() {
        return intenterococci;
    }

    public void setIntenterococci(String intenterococci) {
        this.intenterococci = intenterococci;
    }

    public String getMunicipal() {
        return municipal;
    }

    public void setMunicipal(String municipal) {
        this.municipal = municipal;
    }

    public String getPerunit() {
        return perunit;
    }

    public void setPerunit(String perunit) {
        this.perunit = perunit;
    }

    public String getPlastic() {
        return plastic;
    }

    public void setPlastic(String plastic) {
        this.plastic = plastic;
    }

    public String getRainfall() {
        return rainfall;
    }

    public void setRainfall(String rainfall) {
        this.rainfall = rainfall;
    }

    public Timestamp getSampleTimestamp() {
        return sampleTimestamp;
    }

    public void setSampleTimestamp(Timestamp sampleTimestamp) {
        this.sampleTimestamp = sampleTimestamp;
    }

    public String getStationcode() {
        return stationcode;
    }

    public void setStationcode(String stationcode) {
        this.stationcode = stationcode;
    }

    public String getTar() {
        return tar;
    }

    public void setTar(String tar) {
        this.tar = tar;
    }

    public String getWave() {
        return wave;
    }

    public void setWave(String wave) {
        this.wave = wave;
    }

    public String getYestrainfall() {
        return yestrainfall;
    }

    public void setYestrainfall(String yestrainfall) {
        this.yestrainfall = yestrainfall;
    }

    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this, QualityofSwimmingWaters.class);
    }
}