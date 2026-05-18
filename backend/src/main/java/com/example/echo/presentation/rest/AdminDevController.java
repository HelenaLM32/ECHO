package com.example.echo.presentation.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.echo.core.entity.events.appservices.EventService;
import com.example.echo.core.entity.items.appservices.ItemProjectService;
import com.example.echo.core.entity.items.appservices.ItemService;
import com.example.echo.core.entity.services.appservices.ItemServiceService;
import com.example.echo.core.entity.services.dto.ItemServiceRequest;
import com.example.echo.core.entity.ordermessages.appservices.OrderMessageService;
import com.example.echo.core.entity.orders.appservices.OrderService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.appservices.UserService;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.venues.appservices.VenueService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

@RestController
@RequestMapping("/admin/dev")
public class AdminDevController {

    private final OrderService orderService;
    private final OrderMessageService orderMessageService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ItemService itemService;
    private final ItemProjectService itemProjectService;
    private final ItemServiceService itemServiceService;
    private final VenueService venueService;
    private final EventService eventService;
    private final ObjectMapper objectMapper;

    private static final DateTimeFormatter FLEXIBLE_DT = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd'T'HH:mm")
            .optionalStart().appendPattern(":ss").optionalEnd()
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
            .toFormatter();

    public AdminDevController(
            OrderService orderService,
            OrderMessageService orderMessageService,
            UserService userService,
            UserRepository userRepository,
            ItemService itemService,
            ItemProjectService itemProjectService,
            ItemServiceService itemServiceService,
            VenueService venueService,
            EventService eventService,
            ObjectMapper objectMapper) {
        this.orderService = orderService;
        this.orderMessageService = orderMessageService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.itemService = itemService;
        this.itemProjectService = itemProjectService;
        this.itemServiceService = itemServiceService;
        this.venueService = venueService;
        this.eventService = eventService;
        this.objectMapper = objectMapper;
    }

    private UserDTO resolveOwnerUser(Integer ownerUserId) throws ServiceException {
        if (ownerUserId == null || ownerUserId <= 0) {
            throw new ServiceException("ownerUserId invalido");
        }
        return userRepository.findById(ownerUserId)
                .orElseThrow(() -> new ServiceException("Usuario propietario no encontrado"));
    }

    private LocalDateTime parseDate(String raw, String fieldName) throws ServiceException {
        if (raw == null || raw.isBlank()) {
            throw new ServiceException(fieldName + " es obligatorio");
        }
        try {
            return LocalDateTime.parse(raw.trim(), FLEXIBLE_DT);
        } catch (Exception e) {
            throw new ServiceException("Formato de " + fieldName + " invalido: " + raw);
        }
    }

    @GetMapping(value = "/orders", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAllOrders() {
        try {
            return ResponseEntity.ok(orderService.getAllToJson());
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/orders", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createOrder(@RequestBody String orderJson) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createForBuyerFromJson(orderJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PatchMapping(value = "/orders/{id}/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(orderService.updateStatusByAdmin(id, status));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(value = "/orders/{id}/messages", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getOrderMessages(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(orderMessageService.getMessagesByOrderIdAsAdmin(id));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/orders/{id}/messages", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> sendOrderMessage(@PathVariable Integer id, @RequestBody String payloadJson) {
        try {
            JsonNode payload = objectMapper.readTree(payloadJson);
            Integer senderId = payload.hasNonNull("senderId") ? payload.get("senderId").asInt() : null;
            String content = payload.hasNonNull("content") ? payload.get("content").asText() : null;
            String messageJson = objectMapper.createObjectNode().put("content", content).toString();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(orderMessageService.sendMessageAsUser(id, senderId, messageJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payload invalido");
        }
    }

    @PostMapping(value = "/users/assign-role", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> assignRoleToUser(@RequestBody String payloadJson) {
        try {
            return ResponseEntity.ok(userService.addRoleToUserFromJson(payloadJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/projects", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createProjectForOwner(@RequestBody String payloadJson) {
        try {
            JsonNode payload = objectMapper.readTree(payloadJson);
            Integer ownerUserId = payload.hasNonNull("ownerUserId") ? payload.get("ownerUserId").asInt() : null;
            resolveOwnerUser(ownerUserId);

            com.fasterxml.jackson.databind.node.ObjectNode itemNode = objectMapper.createObjectNode();
            itemNode.put("creatorId", ownerUserId);
            itemNode.put("title", payload.path("title").asText(""));
            if (payload.has("description") && !payload.get("description").isNull()) {
                itemNode.put("description", payload.get("description").asText());
            } else {
                itemNode.putNull("description");
            }
            if (payload.has("basePrice") && !payload.get("basePrice").isNull()) {
                itemNode.put("basePrice", payload.get("basePrice").asDouble());
            } else {
                itemNode.putNull("basePrice");
            }
            itemNode.put("itemType", "PROJECT");
            itemNode.put("categoryId", payload.path("categoryId").asInt());

            String createdItemJson = itemService.registerFromJson(itemNode.toString());
            JsonNode createdItem = objectMapper.readTree(createdItemJson);
            Integer itemId = createdItem.hasNonNull("id") ? createdItem.get("id").asInt() : null;
            if (itemId == null) {
                throw new ServiceException("No se pudo crear el item del proyecto");
            }

                com.fasterxml.jackson.databind.node.ObjectNode projectNode = objectMapper.createObjectNode();
                projectNode.put("id", itemId);
                projectNode.set("item", objectMapper.createObjectNode().put("id", itemId));
                projectNode.put("blocks", payload.path("blocks").asText("[]"));
                projectNode.put("background", payload.path("background").asText("{\"mode\":\"color\",\"value\":\"#ffffff\"}"));
                projectNode.put("blockGap", payload.path("blockGap").asInt(0));
                projectNode.put("published", payload.path("published").asBoolean(false));
                projectNode.put("slug", payload.path("slug").asText("project-" + itemId));

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(itemProjectService.registerFromJson(projectNode.toString()));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payload invalido");
        }
    }

    @PostMapping(value = "/services", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createServiceForOwner(@RequestBody String payloadJson) {
        try {
            JsonNode payload = objectMapper.readTree(payloadJson);
            Integer ownerUserId = payload.hasNonNull("ownerUserId") ? payload.get("ownerUserId").asInt() : null;
            UserDTO owner = resolveOwnerUser(ownerUserId);

            ItemServiceRequest request = objectMapper.treeToValue(payload, ItemServiceRequest.class);
            String responseJson = objectMapper.writeValueAsString(itemServiceService.create(request, owner));
            return ResponseEntity.status(HttpStatus.CREATED).body(responseJson);
        } catch (ServiceException | IllegalArgumentException | SecurityException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payload invalido");
        }
    }

    @PostMapping(value = "/venues", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createVenueForOwner(@RequestBody String payloadJson) {
        try {
            JsonNode payload = objectMapper.readTree(payloadJson);
            Integer ownerUserId = payload.hasNonNull("ownerUserId") ? payload.get("ownerUserId").asInt() : null;
            resolveOwnerUser(ownerUserId);

            return ResponseEntity.status(HttpStatus.CREATED).body(venueService.createVenue(
                    ownerUserId,
                    payload.path("name").asText(""),
                    payload.path("address").asText(""),
                    payload.path("capacity").isNull() ? null : payload.path("capacity").asInt(),
                    payload.path("telefono").isNull() ? null : payload.path("telefono").asText(null),
                    payload.path("email").isNull() ? null : payload.path("email").asText(null),
                    payload.path("sitioWeb").isNull() ? null : payload.path("sitioWeb").asText(null),
                    payload.path("horario").isNull() ? null : payload.path("horario").asText(null),
                    null));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payload invalido");
        }
    }

    @PostMapping(value = "/events", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createEventForOwner(@RequestBody String payloadJson) {
        try {
            JsonNode payload = objectMapper.readTree(payloadJson);
            Integer ownerUserId = payload.hasNonNull("ownerUserId") ? payload.get("ownerUserId").asInt() : null;
            resolveOwnerUser(ownerUserId);

            LocalDateTime start = parseDate(payload.path("startDate").asText(null), "startDate");
            LocalDateTime end = parseDate(payload.path("endDate").asText(null), "endDate");
            BigDecimal precio = payload.path("precio").isNull() ? null : payload.path("precio").decimalValue();

            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(
                    ownerUserId,
                    payload.path("venueId").asInt(),
                    start,
                    end,
                    payload.path("title").isNull() ? null : payload.path("title").asText(null),
                    payload.path("description").isNull() ? null : payload.path("description").asText(null),
                    precio,
                    payload.path("categoria").isNull() ? null : payload.path("categoria").asText(null),
                    payload.path("linkEntradas").isNull() ? null : payload.path("linkEntradas").asText(null),
                    null));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payload invalido");
        }
    }

    @DeleteMapping(value = "/content/{type}/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteContentByType(
            @PathVariable String type,
            @PathVariable Integer id) {
        try {
            String normalizedType = type == null ? "" : type.trim().toLowerCase();
            switch (normalizedType) {
                case "project":
                    itemProjectService.deleteById(id);
                    break;
                case "service": {
                    String serviceJson = objectMapper.writeValueAsString(itemServiceService.getById(id.longValue()));
                    JsonNode serviceNode = objectMapper.readTree(serviceJson);
                    Integer creatorId = serviceNode.hasNonNull("creatorId") ? serviceNode.get("creatorId").asInt() : null;
                    UserDTO creator = resolveOwnerUser(creatorId);
                    itemServiceService.delete(id.longValue(), creator);
                    break;
                }
                case "venue": {
                    JsonNode venueNode = objectMapper.readTree(venueService.getByIdToJson(id));
                    Integer managerId = venueNode.hasNonNull("managerId") ? venueNode.get("managerId").asInt() : null;
                    resolveOwnerUser(managerId);
                    venueService.deleteById(id, managerId);
                    break;
                }
                case "event": {
                    JsonNode eventNode = objectMapper.readTree(eventService.getByIdToJson(id));
                    Integer creatorId = eventNode.hasNonNull("creatorId") ? eventNode.get("creatorId").asInt() : null;
                    resolveOwnerUser(creatorId);
                    eventService.deleteById(id, creatorId);
                    break;
                }
                default:
                    throw new ServiceException("Tipo de contenido no soportado: " + type);
            }

            return ResponseEntity.ok("{\"deleted\":true}");
        } catch (ServiceException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se pudo eliminar el contenido");
        }
    }
}
