package ro.ase.prj;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.system.ApplicationPidFileWriter;
import org.springframework.context.annotation.Import;
import ro.ase.prj.config.AgiloApplicationPersistenceLayerConfig;
import ro.ase.prj.config.AgiloApplicationSecurityConfig;
import ro.ase.prj.config.AgiloApplicationWebConfig;

@SpringBootApplication
@Import({
                AgiloApplicationSecurityConfig.class,
                AgiloApplicationWebConfig.class,
                AgiloApplicationPersistenceLayerConfig.class
        })
public class AgiloApplication {

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(AgiloApplication.class);
        springApplication.addListeners(new ApplicationPidFileWriter());
        springApplication.run(args);
    }
}
