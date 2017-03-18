package ro.ase.prj.domain.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import ro.ase.prj.domain.persistence.entities.AppUser;
import ro.ase.prj.domain.persistence.entities.Authority;
import ro.ase.prj.domain.repository.AuthorityRepository;
import ro.ase.prj.domain.repository.UserRepository;
import ro.ase.prj.domain.security.AgiloSecurityUtils;
import ro.ase.prj.domain.util.ApplicationException;
import ro.ase.prj.domain.util.dto.UserDTO;

import java.util.HashSet;
import java.util.Set;

@Service
@Slf4j
public class UserService {

    @Value("${captcha.privatekey}")
    private String captchaPrivateKey;

    private final UserRepository      userRepository;
    private final AuthorityRepository authorityRepository;
    private final AgiloSecurityUtils  agiloSecurityUtils;

    @Autowired
    public UserService(final UserRepository userRepository,
                       final AuthorityRepository aAuthorityRepository,
                       final AgiloSecurityUtils aAgiloSecurityUtils) {
        this.userRepository = userRepository;
        this.authorityRepository = aAuthorityRepository;
        this.agiloSecurityUtils = aAgiloSecurityUtils;
    }

    @Transactional(readOnly = true)
    public AppUser getUserByUsername(String userName) {
        return userRepository.findByUserName(userName);
    }


    public AppUser registerUser(UserDTO userDTO) {
        if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
            throw new ApplicationException("<strong>The password and its confirmation do not match!</strong>");
        }

        String recaptcha_response = userDTO.getCaptchaResponse();
        if (StringUtils.isEmpty(recaptcha_response) ||
            !agiloSecurityUtils.isCaptchaValid(recaptcha_response, captchaPrivateKey)) {
            log.debug("Captcha is invalid!");
            throw new ApplicationException("<strong>Invalid Captcha!</strong> Please try again!");
        }

        if (StringUtils.isEmpty(userDTO.getFirstName()) || StringUtils.isEmpty(userDTO.getLastName())
            || StringUtils.isEmpty(userDTO.getUserName()) || StringUtils.isEmpty(userDTO.getPassword())) {
            throw new ApplicationException("<strong>You must complete all required fields!</strong>");
        }
        userDTO.setUserName(userDTO.getUserName().toLowerCase());
        AppUser user = userRepository.findByUserName(userDTO.getUserName());
        if (user != null) {
            throw new ApplicationException("<strong>Username already registered!</strong> Please choose another one!");
        }
        user = createUserInformation(userDTO);
        return user;
    }

    private AppUser createUserInformation(UserDTO userDTO) {
        AppUser        newUser     = new AppUser();
        Authority      authority   = authorityRepository.findOne("ROLE_USER");

        //TODO de scos (ar trebui sa fie, dar cu in memory nu raman salvate dc le bag in V1_1__init_vbb_db.sql)
        // this should not happen in an env with a physically db, with in memory the data is not inserted
        if(authority == null) {
            authority = new Authority();
            authority.setName("ROLE_USER");
            authority = authorityRepository.save(authority);
        }
        Set<Authority> authorities = new HashSet<>();
        authorities.add(authority);
        newUser.setUserName(userDTO.getUserName());
        newUser.setPassword(userDTO.getPassword());
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        newUser.setAuthorities(authorities);
        userRepository.save(newUser);
        return newUser;
    }
}
