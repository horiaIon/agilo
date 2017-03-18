package ro.ase.prj.domain.util.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private String firstName;
    private String lastName;
    private String userName;
    private String password;
    private String confirmPassword;
    private String captchaResponse;

}
