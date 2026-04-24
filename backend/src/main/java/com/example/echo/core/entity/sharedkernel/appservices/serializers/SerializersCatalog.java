package com.example.echo.core.entity.sharedkernel.appservices.serializers;

import java.util.HashMap;
import java.util.Map;

import com.example.echo.core.entity.dispute.dto.CloseDisputeDTO;
import com.example.echo.core.entity.dispute.dto.CreateDisputeDTO;
import com.example.echo.core.entity.dispute.dto.DisputeDTO;
import com.example.echo.core.entity.dispute.dto.DisputeMessageDTO;
import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.ordermessages.dto.OrderMessageDTO;
import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.user.dto.LoginResponseDTO;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.dto.UserLoginDTO;
import com.example.echo.core.entity.user.dto.UserRoleAssignmentDTO;

public class SerializersCatalog {

    private static final Map<Serializers, Serializer<?>> catalog = new HashMap<>();
    private static boolean initialized = false;

    private static void initialize() {
        if (initialized) {
            return;
        }
        catalog.put(Serializers.JSON_USER, new JacksonSerializer<UserDTO>());
        catalog.put(Serializers.JSON_USER_LOGIN, new JacksonSerializer<UserLoginDTO>());
        catalog.put(Serializers.JSON_LOGIN_RESPONSE, new JacksonSerializer<LoginResponseDTO>());
        catalog.put(Serializers.JSON_USER_ROLE_ASSIGNMENT, new JacksonSerializer<UserRoleAssignmentDTO>());
        catalog.put(Serializers.JSON_ROLE, new JacksonSerializer<RoleDTO>());
        catalog.put(Serializers.JSON_ITEM, new JacksonSerializer<ItemDTO>());
        catalog.put(Serializers.JSON_ORDER, new JacksonSerializer<OrderDTO>());
        catalog.put(Serializers.JSON_ORDER_MESSAGE, new JacksonSerializer<OrderMessageDTO>());
        catalog.put(Serializers.JSON_DISPUTE, new JacksonSerializer<DisputeDTO>());
        catalog.put(Serializers.JSON_DISPUTE_MESSAGE, new JacksonSerializer<DisputeMessageDTO>());
        catalog.put(Serializers.JSON_CREATE_DISPUTE, new JacksonSerializer<CreateDisputeDTO>());
        catalog.put(Serializers.JSON_CLOSE_DISPUTE, new JacksonSerializer<CloseDisputeDTO>());
        initialized = true;
    }

    public static Serializer<?> getInstance(Serializers type) {
        initialize();
        return catalog.get(type);
    }
}
