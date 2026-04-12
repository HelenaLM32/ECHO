package com.example.echo.core.entity.sharedkernel.appservices.serializers;

import java.util.TreeMap;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.ordermessages.dto.OrderMessageDTO;

public class SerializersCatalog {

    private static final TreeMap<Serializers, Serializer<?>> catalog = new TreeMap<>();

    private static void loadCatalog() {
        catalog.put(Serializers.JSON_USER,          new JacksonSerializer<UserDTO>());
        catalog.put(Serializers.JSON_ROLE,          new JacksonSerializer<RoleDTO>());
        catalog.put(Serializers.JSON_ITEM,          new JacksonSerializer<ItemDTO>());
        catalog.put(Serializers.JSON_ORDER,         new JacksonSerializer<OrderDTO>());
        catalog.put(Serializers.JSON_ORDER_MESSAGE, new JacksonSerializer<OrderMessageDTO>());
    }

    public static Serializer<?> getInstance(Serializers type) {
        if (catalog.isEmpty()) {
            loadCatalog();
        }
        return catalog.get(type);
    }
}
