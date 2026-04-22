package com.example.echo.infrastructure.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

@Component
public class PasswordValidator {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void validatePassword(String password) throws ServiceException {
        if (!Check.isValidPasswordLength(password)) {
            throw new ServiceException("La contraseña debe tener al menos 8 caracteres");
        }
        if (!Check.isValidPasswordComplexity(password)) {
            throw new ServiceException(
                    "La contraseña debe contener al menos una mayúscula, una minúscula y un número");
        }
    }

    public String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean matchesPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    public String validateAndHashPassword(String rawPassword) throws ServiceException {
        validatePassword(rawPassword);
        return hashPassword(rawPassword);
    }

}
