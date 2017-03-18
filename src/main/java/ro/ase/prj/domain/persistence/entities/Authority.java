package ro.ase.prj.domain.persistence.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * An authority (a security role) used by Spring Security.
 */
@Entity
@Table(name = "t_authority")
@Getter
@Setter
@NoArgsConstructor
public class Authority implements Serializable {

    private static final long serialVersionUID = 7956204233533859697L;

    @NotNull
    @Id
    @Column(name = "name", nullable = false, length = 50, unique = true)
    private String name;

}
