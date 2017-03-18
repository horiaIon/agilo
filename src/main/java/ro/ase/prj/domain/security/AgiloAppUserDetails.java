package ro.ase.prj.domain.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class AgiloAppUserDetails extends User {
    private static final long serialVersionUID = 1L;

    private String firstName;
    private String lastName;

    public AgiloAppUserDetails(String username,
                               String password,
                               boolean enabled,
                               String firstName,
                               String lastName,
                               Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, true, true, true, authorities);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

}
