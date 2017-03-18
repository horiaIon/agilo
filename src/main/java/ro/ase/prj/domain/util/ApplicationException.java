package ro.ase.prj.domain.util;

import java.util.Map;

public class ApplicationException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private String exception;
    private Map    arguments;

    public ApplicationException(String exception) {
        this.exception = exception;
    }

    public ApplicationException(String exception, Map arguments) {
        this.exception = exception;
        this.arguments = arguments;
    }

    public Map getArguments() {
        return arguments;
    }

    public String getException() {
        return exception;
    }
}
