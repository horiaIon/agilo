package ro.ase.prj.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import ro.ase.prj.domain.security.AjaxAuthenticationFailureHandler;
import ro.ase.prj.domain.security.AgiloUserDetailsService;

@Configuration
public class AgiloApplicationSecurityConfig extends WebSecurityConfigurerAdapter {

    private final AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler;
    private final AuthenticationManager            authenticationManager;
    private final AgiloUserDetailsService          agiloUserDetailsService;

    @Autowired
    public AgiloApplicationSecurityConfig(final AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler,
                                          final AuthenticationManager authenticationManager,
                                          final AgiloUserDetailsService aAgiloUserDetailsService) {
        this.ajaxAuthenticationFailureHandler = ajaxAuthenticationFailureHandler;
        this.authenticationManager = authenticationManager;
        this.agiloUserDetailsService = aAgiloUserDetailsService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        //logout
        http
                .logout()
                .logoutUrl("/application/logout")
                .deleteCookies("JSESSIONID", "XSRF-TOKEN")
                .invalidateHttpSession(true).clearAuthentication(true)
                .logoutSuccessHandler((request, response, exception) -> response.setStatus(HttpStatus.OK.value()))
                .permitAll();

        //login
        http
                .formLogin()
                .usernameParameter("j_username")
                .passwordParameter("j_password")
                .loginProcessingUrl("/application/authentication")
                .failureHandler(ajaxAuthenticationFailureHandler)
                .successHandler((request, response, exception) -> response.setStatus(HttpStatus.OK.value()))
                .permitAll();

        //authorize requests
        http
                .antMatcher("/**")
                .authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/webjars/**").permitAll()
                .antMatchers("/public/**").permitAll()
                .antMatchers("/static/**").permitAll()
                .antMatchers("/uib/**").permitAll()
                .antMatchers("/login**").permitAll()
                .antMatchers("/user").permitAll()
                .antMatchers("/info").permitAll()
                .antMatchers("/user/account").permitAll()
                .antMatchers("/user/register").permitAll()
                .antMatchers("/user/new-xsrf-token").permitAll()
                .antMatchers("/user/activate").permitAll()
                .antMatchers("/user/passwordRecovery").permitAll()
                .antMatchers("/signin/**").permitAll()
                .antMatchers("/signup/**").permitAll()
                .antMatchers("/index.html", "/home.html").permitAll()
                .anyRequest().authenticated();

        //csrf
        http
                .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());


        //exceptions
        http
                .exceptionHandling()
                .authenticationEntryPoint((request, response, exception) -> response.setStatus(HttpStatus.UNAUTHORIZED.value()));

    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
           .antMatchers("/static/**");
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.parentAuthenticationManager(authenticationManager)
            .userDetailsService(this.agiloUserDetailsService);
    }

}
