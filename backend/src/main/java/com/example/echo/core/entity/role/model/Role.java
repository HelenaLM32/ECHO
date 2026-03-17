package com.example.echo.core.entity.role.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class Role {

    private Integer id;
    private String name;

    protected Role() {
    }

    public static Role getInstance(String name) throws BuildException {
        Role role = new Role();
        String message = role.roleDataValidation(name);
        if (message.isEmpty()) {
            return role;
        }
        throw new BuildException(message);
    }

    protected String roleDataValidation(String name) {
        String message = "";
        if (setName(name) != 0) {
            message += "Nombre del rol inválido";
        }
        return message;
    }

    protected int setName(String name) {
        if (Check.minStringChars(name, 3) && Check.isOnlyLetters(name)) {
            this.name = name.trim();
            return 0;
        }
        return -1;
    }

    public Integer getId() { return id; }
    public String getName() { return name; }

    @Override
    public String toString() {
        return "Role{id=" + id + ", name='" + name + "'}";
    }
}
