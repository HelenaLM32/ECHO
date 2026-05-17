package com.example.echo.core.entity.venuereviews.appservices;

import com.example.echo.core.entity.sharedkernel.appservices.serializers.JacksonSerializer;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.venuereviews.dto.VenueEventReviewDTO;
import com.example.echo.core.entity.venuereviews.model.VenueEventReview;
import com.example.echo.core.entity.venuereviews.persistence.VenueEventReviewRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class VenueEventReviewServiceImpl implements VenueEventReviewService {

    @Autowired
    private VenueEventReviewRepository repository;

    private final ObjectMapper mapper = new ObjectMapper();
    private final JacksonSerializer<VenueEventReviewDTO> serializer = new JacksonSerializer<>();

    @Override
    public String create(String json, Integer authorId) throws ServiceException {
        try {
            JsonNode node = mapper.readTree(json);
            Integer targetId = node.get("targetId").asInt();
            String targetType = node.get("targetType").asText().toUpperCase();
            Integer score = node.get("score").asInt();
            String comment = node.has("comment") ? node.get("comment").asText() : "";

            repository.findByAuthorIdAndTargetIdAndTargetType(authorId, targetId, targetType)
                    .ifPresent(r -> {
                        throw new RuntimeException("Ya has dejado una review aquí");
                    });

            VenueEventReview model = VenueEventReview.getInstance(
                    authorId, targetId, targetType, score, comment);

            VenueEventReviewDTO dto = new VenueEventReviewDTO();
            dto.setAuthorId(model.getAuthorId());
            dto.setTargetId(model.getTargetId());
            dto.setTargetType(model.getTargetType());
            dto.setScore(model.getScore());
            dto.setComment(model.getComment());

            VenueEventReviewDTO saved = repository.save(dto);

            return serializer.serialize(repository.findById(saved.getId()).get());
        } catch (RuntimeException e) {
            throw new ServiceException(e.getMessage());
        } catch (Exception e) {
            throw new ServiceException("Error al crear review: " + e.getMessage());
        }
    }

    @Override
    public String getByTarget(Integer targetId, String targetType) throws ServiceException {
        try {
            List<VenueEventReviewDTO> list = repository.findByTargetIdAndTargetType(targetId, targetType.toUpperCase());
            return serializer.serializeList(list);
        } catch (Exception e) {
            throw new ServiceException("Error al obtener reviews: " + e.getMessage());
        }
    }

    @Override
    public String getAverage(Integer targetId, String targetType) throws ServiceException {
        try {
            Double avg = repository.getAverageScore(targetId, targetType.toUpperCase());
            long count = repository.countByTargetIdAndTargetType(targetId, targetType.toUpperCase());
            Map<String, Object> result = new HashMap<>();
            result.put("targetId", targetId);
            result.put("targetType", targetType);
            result.put("average", avg != null ? Math.round(avg * 10.0) / 10.0 : null);
            result.put("count", count);
            return mapper.writeValueAsString(result);
        } catch (Exception e) {
            throw new ServiceException("Error al calcular media: " + e.getMessage());
        }
    }

    @Override
    public String deleteById(Integer reviewId, Integer requesterId) throws ServiceException {
        VenueEventReviewDTO r = repository.findById(reviewId)
                .orElseThrow(() -> new ServiceException("Review no encontrada"));
        if (!r.getAuthorId().equals(requesterId))
            throw new ServiceException("No puedes eliminar esta review");
        repository.deleteById(reviewId);
        return "{\"message\":\"Review eliminada\"}";
    }
}