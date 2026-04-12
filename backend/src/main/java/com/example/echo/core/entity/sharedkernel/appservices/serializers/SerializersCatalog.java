package com.example.echo.core.entity.sharedkernel.appservices.serializers;

import java.util.HashMap;
import java.util.Map;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.ordermessages.dto.OrderMessageDTO;

public class SerializersCatalog {

    private static final Map<Serializers, Serializer<?>> catalog = new HashMap<>();
    private static boolean initialized = false;

    private static void initialize() {
        if (initialized) {
            return;
        }
        catalog.put(Serializers.JSON_USER, new JacksonSerializer<UserDTO>());
        catalog.put(Serializers.JSON_ROLE, new JacksonSerializer<RoleDTO>());
        catalog.put(Serializers.JSON_ITEM, new JacksonSerializer<ItemDTO>());
        catalog.put(Serializers.JSON_ORDER, new JacksonSerializer<OrderDTO>());
        catalog.put(Serializers.JSON_ORDER_MESSAGE, new JacksonSerializer<OrderMessageDTO>());
        initialized = true;
    }

    public static Serializer<?> getInstance(Serializers type) {
        initialize();
        return catalog.get(type);
    }
}
