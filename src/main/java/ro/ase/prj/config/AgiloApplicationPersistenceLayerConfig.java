package ro.ase.prj.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import ro.ase.prj.domain.persistence.entities.AppUser;
import ro.ase.prj.domain.repository.UserRepository;

@Configuration
@EntityScan(basePackageClasses = {
        AppUser.class
})
@EnableJpaRepositories(basePackageClasses = {
        UserRepository.class
})
@EnableTransactionManagement(mode = AdviceMode.PROXY, proxyTargetClass = true)
public class AgiloApplicationPersistenceLayerConfig {
}
