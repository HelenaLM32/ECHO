package com.example.echo.core.entity.sharedkernel.appservices.serializers;

import java.util.List;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public class JacksonSerializer<T> implements Serializer<T> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String serialize(T object) throws ServiceException {
        try {
            return this.mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new ServiceException(e.getMessage());
        }
    }

    @Override
    public String serializeList(List<T> list) throws ServiceException {
        try {
            return this.mapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            throw new ServiceException(e.getMessage());
        }
    }

    @Override
    public T deserialize(String source, Class<T> clazz) throws ServiceException {
        try {
            return mapper.readValue(source, clazz);
        } catch (JsonProcessingException e) {
            throw new ServiceException(e.getMessage());
        }
    }
}
