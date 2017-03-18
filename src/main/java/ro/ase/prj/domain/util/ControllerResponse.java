package ro.ase.prj.domain.util;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ControllerResponse {
    private Boolean success = true;
    private String  status  = "success";
    private Object responseObject;
    private List<ApplicationException> exceptions          = new ArrayList<>();
    private List<String>               applicationMessages = new ArrayList<>();

    public List<String> getErrorMessages() {
        return exceptions.stream()
                         .map(ApplicationException::getException)
                         .collect(Collectors.toList());
    }

    public List<String> getSuccessMessages() {
        return applicationMessages;
    }

    public ControllerResponse addSuccess(String message) {
        applicationMessages.add(message);
        return this;
    }

    public ControllerResponse addError(ApplicationException ex) {
        success = false;
        status = "danger";
        exceptions.add(ex);
        return this;
    }

    public Object getResponseObject() {
        return responseObject;
    }

    public void setResponseObject(Object responseObject) {
        this.responseObject = responseObject;
    }

    public String getStatus() {
        return status;
    }

    public Boolean getSuccess() {
        return success;
    }

    public List<ApplicationException> getExceptions() {
        return exceptions;
    }
}
