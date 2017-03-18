package ro.ase.prj.domain.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ro.ase.prj.domain.repository.UserRepository;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Utility class for Security.
 */
@Slf4j
@Component
public class AgiloSecurityUtils {

    private final UserRepository userRepository;

    @Autowired
    public AgiloSecurityUtils(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get the login of the current user.
     */
    public static String getCurrentLogin() {
        if (SecurityContextHolder.getContext() == null ||
            SecurityContextHolder.getContext().getAuthentication() == null) {
            return null;
        }
        return SecurityContextHolder.getContext().getAuthentication().getName();
//        SecurityContext securityContext = SecurityContextHolder.getContext();
//        Authentication  authentication  = securityContext.getAuthentication();
//        String          userName        = null;
//        if (authentication.getPrincipal() instanceof UserDetails) {
//            UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
//            userName = springSecurityUser.getUsername();
//        } else if (authentication.getPrincipal() instanceof String) {
//            userName = (String) authentication.getPrincipal();
//        }
//        return userName;
    }


    public boolean isCaptchaValid(String captchaResponse, String privateKey) {
        String
                url =
                "https://www.google.com/recaptcha/api/siteverify?secret=" + privateKey + "&response=" + captchaResponse;

        // Create a trust manager that does not validate certificate chains (because of https://google)
        TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }

                    public void checkClientTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {
                    }

                    public void checkServerTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {
                    }
                }
        };

        // Install the all-trusting trust manager
        try {
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
        } catch (Exception e) {
            log.error(">>>>Install the all-trusting trust manager exception: ", e);
        }

        URL obj;
        try {
            obj = new URL(url);
            HttpURLConnection con      = (HttpURLConnection) obj.openConnection();
            BufferedReader    in       = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String            inputLine;
            StringBuffer      response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            //parse JSON response and return 'success' value
            JsonReader jsonReader = Json.createReader(new StringReader(response.toString()));
            JsonObject jsonObject = jsonReader.readObject();
            jsonReader.close();

            return jsonObject.getBoolean("success");

        } catch (IOException e) {
            log.error(">>>>captcha exception: ", e);
            return false;
        }
    }

}
