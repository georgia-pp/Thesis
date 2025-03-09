package Servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import Tables.*;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author georgia
 */
public class MapDataServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String region = request.getParameter("region");
        String dataType = request.getParameter("dataType");

        List<String> regions = new ArrayList<>();

        switch (region) {
            case "Αθήνα":
                regions = Arrays.asList("ΑΓΙΟΥ ΔΗΜΗΤΡΙΟΥ", "ΑΓΙΟΥ ΙΩΑΝΝΟΥ ΡΕΝΤΗ", "ΑΓΙΟΥ ΚΩΝΣΤΑΝΤΙΝΟΥ", "ΑΙΑΝΤΕΙΟΥ", "ΑΙΓΑΛΕΩ", "ΑΛΙΜΟΥ", "ΑΜΑΡΟΥΣΙΟΥ", "ΑΜΠΕΛΑΚΙΩΝ", "ΑΜΠΕΛΟΚΗΠΩΝ", "ΑΜΠΕΛΩΝΟΣ", "ΑΜΦΙΣΣΗΣ", "ΑΝΑΛΗΨΕΩΣ", "ΑΝΑΤΟΛΗΣ", "ΑΝΘΟΥΣΗΣ", "ΗΡΑΚΛΕΙΟΥ ΑΤΤΙΚΗΣ", "ΖΩΓΡΑΦΟΥ", "ΕΛΛΗΝΙΚΩΝ", "ΑΧΑΡΝΩΝ", "ΒΟΥΛΙΑΓΜΕΝΗΣ", "ΓΛΥΦΑΔΑΣ", "ΕΥΑΓΓΕΛΙΣΜΟΥ");
                break;
            case "Θεσσαλονίκη":
                regions = Arrays.asList("ΑΓΙΑΣΜΑΤΟΣ", "ΑΓΙΟΥ ΠΕΤΡΟΥ", "ΑΓΙΟΥ ΧΡΙΣΤΟΦΟΡΟΥ", "ΑΓΙΩΝ ΑΝΑΡΓΥΡΩΝ", "ΑΜΥΝΤΑΙΟΥ", "ΒΕΡΟΙΑΣ", "ΘΕΣΣΑΛΟΝΙΚΗΣ");
                break;
            case "Πάτρα":
                regions = Arrays.asList("ΑΓΙΟΥ ΑΝΔΡΕΟΥ", "ΑΓΙΟΥ ΗΛΙΑ", "ΑΙΤΩΛΙΚΟΥ", "ΑΚΡΩΤΗΡΙΟΥ", "ΑΝΘΕΙΑΣ");
                break;
            case "Ηράκλειο":
                regions = Arrays.asList("Βιάννος", "Γ Ζώνη ΤΟΕΒ Μοιρών", "Κέρη", "Τυμπάκι Α3", "Τυμπάκι Αεροδρόμιο", "Φανερωμένης", "ΑΓΙΑΣ ΒΑΡΒΑΡΑΣ", "ΑΓΙΑΣ ΜΑΡΙΝΗΣ", "ΑΓΙΑΣ ΠΑΡΑΣΚΕΥΗΣ", "ΑΓΙΑΣ ΤΡΙΑΔΟΣ", "ΑΓΙΟΥ ΑΘΑΝΑΣΙΟΥ", "ΑΓΙΟΥ ΓΕΩΡΓΙΟΥ", "ΑΓΙΟΥ ΠΑΥΛΟΥ", "ΑΛΕΞΑΝΔΡΟΥ", "ΗΡΑΚΛΕΙΟ", "ΗΡΑΚΛΕΙΟY", "Κρήτη");
                break;
            case "Λάρισα":
                regions = Arrays.asList("ΑΓΙΟΥ ΑΧΙΛΛΕΙΟΥ", "ΑΓΙΟΥ ΣΤΕΦΑΝΟΥ", "ΑΓΝΑΝΤΕΡΟΥ");
                break;
            case "Βόλος":
                regions = Arrays.asList("Αλμυρός", "ΑΛΟΝΝΗΣΟΥ");
                break;
            case "Ιωάννινα":
                regions = Arrays.asList("ΑΓΓΕΛΟΚΑΣΤΡΟΥ", "ΙΩΑΝΝΙΝΩΝ");
                break;
            case "Καβάλα":
                regions = Arrays.asList("ΑΒΑΤΟΥ", "ΑΒΡΑΜΥΛΙΑΣ", "ΑΙΓΕΙΡΟΥ", "ΑΛΕΞΑΝΔΡΟΥΠΟΛΕΩΣ");
                break;
            case "Χανιά":
                regions = Arrays.asList("Κολένη", "Λίμνη Κουρνά", "Μυλωνιανά", "Νιο Χωριό", "ΑΓΙΑΣ ΚΥΡΙΑΚΗΣ", "ΗΡΑΚΛΕΙΟΥ ΧΑΝΙΩΝ", "ΧΑΝΙΩΝ", "Κρήτη");
                break;
            case "Ρόδος":
                regions = Arrays.asList("ΑΡΚΙΟΙ", "ΚΑΡΠΑΘΟΣ", "ΚΩΣ - ΚΑΛΥΜΝΟΣ", "ΜΕΓΙΣΤΗ", "ΡΟΔΟΣ", "ΣΥΜΗ");
                break;
            case "Ρέθυμνο":
                regions = Arrays.asList("ΙΓΜΕ", "ΑΔΕΛΕ", "ΗΡΑΚΛΕΙΟΥ ΡΕΘΥΜΝΟΥ", "ΡΕΘΥΜΝΟΥ", "Κρήτη");
                break;
            case "Άγιος Νικόλαος":
                regions = Arrays.asList("Μπραμιανών", "ΑΓΙΟΥ ΝΙΚΟΛΑΟΥ", "ΛΑΣΙΘΙΟΥ", "Κρήτη");
                break;
            case "Χίος":
                regions = Arrays.asList("ΑΓ. ΕΥΣΤΡΑΤΙΟΣ", "ΑΓΑΘΟΝΗΣΙ", "ΙΚΑΡΙΑ", "ΛΕΣΒΟΣ", "ΛΗΜΝΟΣ", "ΠΑΤΜΟΣ", "ΣΑΜΟΣ", "ΣΚΥΡΟΣ", "ΧΙΟΣ", "ΑΛΥΦΑΝΤΩΝ", "ΙΚΑΡΙΑΣ");
                break;
            case "Σαντορίνη":
                regions = Arrays.asList("ΑΜΟΡΓΟΣ", "ΑΝΑΦΗ", "ΑΝΤΙΚΥΘΗΡΑ", "ΑΣΤΥΠΑΛΑΙΑ", "ΓΑΥΔΟΣ", "ΔΟΝΟΥΣΑ", "ΘΗΡΑ", "ΚΥΘΝΟΣ", "ΜΗΛΟΣ", "ΣΕΡΙΦΟΣ", "ΣΙΦΝΟΣ");
                break;
            case "Κέρκυρα":
                regions = Arrays.asList("ΕΡΕΙΚΟΥΣΑ", "ΟΘΩΝΟΙ", "ΑΛΕΠΟΥΣ");
                break;
            case "Τρίπολη":
                regions = Arrays.asList("ΑΓΙΟΥ ΑΔΡΙΑΝΟΥ");
                break;
            case "Καλαμάτα":
                regions = Arrays.asList("ΑΓΙΟΥ ΙΩΑΝΝΟΥ (ΛΑΚΕΔΑΙΜΟΝΟΣ)");
                break;
        }

        StringBuilder queryBuilder;
        List<Object> params;
        List<Object> allResults = new ArrayList<>();
        List<?> result = null;

        for (String area : regions) {
            try {
                queryBuilder = new StringBuilder();
                params = new ArrayList<>();

                switch (dataType) {
                    case "ElectricityConsumption":
                        queryBuilder.append("SELECT * FROM ElectricityConsumption WHERE area = ?");
                        params.add(area);
                        result = new EditElectricityConTable().GetfilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "HydrologicalData":
                        queryBuilder.append("SELECT * FROM HydrologicalData WHERE station = ?");
                        params.add(area);
                        result = new EditHydrologicalDataTable().GetfilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "ParcelsofLand":
                        queryBuilder.append("SELECT * FROM ParcelsofLand WHERE otaName = ?");
                        params.add(area);
                        result = new EditParcelsofLandTable().GetfilteredSearch(queryBuilder.toString(), params);
                        break;
                    case "QualityofSwimmingWaters":
                        queryBuilder.append("SELECT * FROM QualityofSwimmingWaters WHERE perunit = ?");
                        params.add(area);
                        result = new EditQualityofSwimmingWatersTable().GetfilteredSearch(queryBuilder.toString(), params);
                        break;
                    default:
                        response.setStatus(400);
                        response.getWriter().write("Invalid dataType: " + dataType);
                        return;
                }

                System.out.println(queryBuilder.toString());
                System.out.println(params);

                if (result != null && !result.isEmpty()) {
                    allResults.addAll(result);
                }
            } catch (SQLException ex) {
                Logger.getLogger(MapDataServlet.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(MapDataServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        if (!allResults.isEmpty()) {
            Gson gson = new GsonBuilder()
                    .setDateFormat(dataType.equals("ParcelsofLand") ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm:ss")
                    .create();

            String jsonWithDatas = gson.toJson(allResults);
            response.getWriter().write(jsonWithDatas);
            response.setStatus(200);
        } else {
            response.setStatus(404);
            response.getWriter().write("No data found for the given regions.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }
}
