package ro.ase.prj.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ro.ase.prj.domain.persistence.entities.AppUser;
import ro.ase.prj.domain.services.UserService;
import ro.ase.prj.domain.util.ApplicationException;
import ro.ase.prj.domain.util.ControllerResponse;
import ro.ase.prj.domain.util.dto.UserDTO;

import java.security.Principal;

@RestController
@RequestMapping(value = "/user", produces = "application/json")
public class AuthUserController {

    private final UserService userService;

    @Autowired
    public AuthUserController(final UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public Principal getCurrentLoggedInUser(Principal user) {
        return user;
    }

    @RequestMapping(value = "/account", method = RequestMethod.GET)
    public ResponseEntity<AppUser> getAccount(Principal authUser) {
        if (authUser == null) {
            return new ResponseEntity<>(new AppUser(), HttpStatus.OK);
        }
        AppUser user = userService.getUserByUsername(authUser.getName());
        if (user == null) {
            return new ResponseEntity<>(new AppUser(), HttpStatus.OK);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<ControllerResponse> registerAccount(
            @RequestBody UserDTO userDTO) {
        ControllerResponse controllerResponse = new ControllerResponse();
        try {
            userService.registerUser(userDTO);
            controllerResponse.addSuccess("<strong>Registration saved!</strong>");
        } catch (ApplicationException e) {
            controllerResponse.addError(e);
        }
        return new ResponseEntity<>(controllerResponse, HttpStatus.OK);
    }

    @RequestMapping(value = "/new-xsrf-token", method = RequestMethod.POST)
    public ResponseEntity newXsrfToken() {
        return new ResponseEntity(HttpStatus.OK);
    }

}
