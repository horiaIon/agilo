package ro.ase.prj.domain.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.ase.prj.domain.persistence.entities.AppUser;
import ro.ase.prj.domain.persistence.entities.Authority;
import ro.ase.prj.domain.repository.UserRepository;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class AgiloUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public AgiloUserDetailsService(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = userRepository.findByUserName(username.toLowerCase());
        if (appUser == null) {
            throw new UsernameNotFoundException("User " + username + " was not found in the database!");
        }
        Collection<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        for (Authority authority : appUser.getAuthorities()) {
            GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(authority.getName());
            grantedAuthorities.add(grantedAuthority);
        }

        return new AgiloAppUserDetails(appUser.getUserName(), appUser.getPassword(), true, appUser.getFirstName(),
                                       appUser.getLastName(), grantedAuthorities);
    }

}