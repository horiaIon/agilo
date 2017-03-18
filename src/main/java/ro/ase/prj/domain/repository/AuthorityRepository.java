package ro.ase.prj.domain.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import ro.ase.prj.domain.persistence.entities.Authority;

public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
