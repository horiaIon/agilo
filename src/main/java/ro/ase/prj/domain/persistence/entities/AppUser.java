package ro.ase.prj.domain.persistence.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "t_user")
@Getter
@Setter
@NoArgsConstructor
public class AppUser implements Serializable {

    private static final long serialVersionUID = -7435158503002007007L;

    @NotNull
    @Id
    @Column(name = "user_name", nullable = false, length = 100, unique = true)
    private String userName;

    @JsonIgnore
    @Column(name = "password", length = 100)
    private String password;

    @NotNull
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @NotNull
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(
            name = "t_user_authority",
            joinColumns = {@JoinColumn(name = "user_name", referencedColumnName = "user_name")},
            inverseJoinColumns = {@JoinColumn(name = "name", referencedColumnName = "name")})
    private Set<Authority> authorities;
}
