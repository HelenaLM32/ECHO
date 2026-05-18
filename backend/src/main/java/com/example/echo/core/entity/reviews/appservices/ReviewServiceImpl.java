package com.example.echo.core.entity.reviews.appservices;

import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.orders.persistence.OrderRepository;
import com.example.echo.core.entity.reviews.dto.CreateReviewDTO;
import com.example.echo.core.entity.reviews.dto.ReviewDTO;
import com.example.echo.core.entity.reviews.model.Review;
import com.example.echo.core.entity.reviews.persistence.ReviewRepository;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.JacksonSerializer;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderRepository orderRepository;

    private final JacksonSerializer<ReviewDTO> serializer = new JacksonSerializer<>();
    private final JacksonSerializer<CreateReviewDTO> createSerializer = new JacksonSerializer<>();

    @Override
    public String createFromJson(String json, Integer authorId) throws ServiceException {
        try {
            CreateReviewDTO input = createSerializer.deserialize(json, CreateReviewDTO.class);
            if (input == null || input.getOrderId() == null) {
                throw new ServiceException("Datos de review inválidos");
            }

            OrderDTO order = orderRepository.findById(input.getOrderId())
                    .orElseThrow(() -> new ServiceException("Encargo no encontrado"));

            if (!"COMPLETED".equals(order.getStatus())) {
                throw new ServiceException("Solo se puede dejar una review cuando el encargo está completado");
            }

            if (!order.getBuyerId().equals(authorId)) {
                throw new ServiceException("Solo el comprador puede dejar una review");
            }

            if (reviewRepository.findByOrderIdAndAuthorId(input.getOrderId(), authorId).isPresent()) {
                throw new ServiceException("Ya has dejado una review para este encargo");
            }

            Review review = Review.getInstance(input.getOrderId(), authorId, input.getScore(), input.getComment());

            ReviewDTO dto = new ReviewDTO();
            dto.setOrderId(review.getOrderId());
            dto.setAuthorId(review.getAuthorId());
            dto.setScore(review.getScore());
            dto.setComment(review.getComment());

            ReviewDTO saved = reviewRepository.save(dto);
            // Re-fetch to populate @Formula fields
            return serializer.serialize(reviewRepository.findById(saved.getId()).get());
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error al crear review: " + e.getMessage());
        }
    }

    @Override
    public String getByOrderId(Integer orderId) throws ServiceException {
        try {
            return reviewRepository.findByOrderIdAndAuthorId(orderId, null)
                    .map(r -> {
                        try { return serializer.serialize(r); } catch (ServiceException ex) { return "{}"; }
                    })
                    .orElse("null");
        } catch (Exception e) {
            throw new ServiceException("Error al obtener review: " + e.getMessage());
        }
    }

    @Override
    public String getByReviewedUserId(Integer userId) throws ServiceException {
        try {
            List<ReviewDTO> reviews = reviewRepository.findByReviewedUserId(userId);
            return serializer.serializeList(reviews);
        } catch (Exception e) {
            throw new ServiceException("Error al obtener reviews: " + e.getMessage());
        }
    }

    @Override
    public String getAverageByReviewedUserId(Integer userId) throws ServiceException {
        try {
            Double avg = reviewRepository.getAverageScoreByReviewedUserId(userId);
            Map<String, Object> result = new HashMap<>();
            result.put("userId", userId);
            result.put("average", avg != null ? Math.round(avg * 10.0) / 10.0 : null);
            result.put("count", reviewRepository.findByReviewedUserId(userId).size());
            return new JacksonSerializer<Map<String, Object>>().serialize(result);
        } catch (Exception e) {
            throw new ServiceException("Error al calcular media: " + e.getMessage());
        }
    }

    @Override
    public String getAllToJson() throws ServiceException {
        try {
            return serializer.serializeList(reviewRepository.findAll());
        } catch (Exception e) {
            throw new ServiceException("Error al obtener reviews: " + e.getMessage());
        }
    }

    @Override
    public String deleteById(Integer reviewId) throws ServiceException {
        reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ServiceException("Review no encontrada"));
        reviewRepository.deleteById(reviewId);
        return "{\"message\":\"Review eliminada correctamente\"}";
    }
}
