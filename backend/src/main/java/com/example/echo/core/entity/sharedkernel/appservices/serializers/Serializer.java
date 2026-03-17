package com.example.echo.core.entity.sharedkernel.appservices.serializers;

import java.util.List;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface Serializer<T> {

    String serialize(T object) throws ServiceException;

    String serializeList(List<T> list) throws ServiceException;

    T deserialize(String source, Class<T> clazz) throws ServiceException;
}
