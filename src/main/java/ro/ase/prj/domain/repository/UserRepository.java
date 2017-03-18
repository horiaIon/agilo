package ro.ase.prj.domain.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import ro.ase.prj.domain.persistence.entities.AppUser;

public interface UserRepository extends PagingAndSortingRepository<AppUser, String> {

    AppUser findByUserName(String userName);

}
