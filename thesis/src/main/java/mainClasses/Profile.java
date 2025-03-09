package mainClasses;

import com.google.gson.Gson;

public class Profile { 
    String username;
    String email;
    String password;

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
    

    public void setUsername(String username) {
        this.username = username;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this, Profile.class);
    }
}