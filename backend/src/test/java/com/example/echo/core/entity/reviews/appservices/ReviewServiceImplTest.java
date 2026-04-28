package com.example.echo.core.entity.reviews.appservices;

import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.orders.persistence.OrderRepository;
import com.example.echo.core.entity.reviews.dto.ReviewDTO;
import com.example.echo.core.entity.reviews.persistence.ReviewRepository;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceImplTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private ReviewServiceImpl service;

    private OrderDTO completedOrder;

    @BeforeEach
    void setUp() {
        completedOrder = new OrderDTO(10, 7, 3, 20.0, "COMPLETED");
    }

    private void setReviewId(ReviewDTO dto, int id) throws Exception {
        Field field = ReviewDTO.class.getDeclaredField("id");
        field.setAccessible(true);
        field.set(dto, id);
    }

    @Test
    void createFromJsonCreatesReviewForCompletedOrderByBuyer() throws Exception {
        String json = "{\"orderId\":10,\"score\":5,\"comment\":\"Excelente\"}";
        ReviewDTO saved = new ReviewDTO();
        saved.setOrderId(10);
        saved.setAuthorId(7);
        saved.setScore(5);
        saved.setComment("Excelente");
        setReviewId(saved, 1);

        when(orderRepository.findById(10)).thenReturn(Optional.of(completedOrder));
        when(reviewRepository.findByOrderIdAndAuthorId(10, 7)).thenReturn(Optional.empty());
        when(reviewRepository.save(any(ReviewDTO.class))).thenReturn(saved);
        when(reviewRepository.findById(1)).thenReturn(Optional.of(saved));

        String result = service.createFromJson(json, 7);

        assertTrue(result.contains("\"score\":5"));
        verify(reviewRepository).save(any(ReviewDTO.class));
    }

    @Test
    void createFromJsonFailsWhenOrderNotCompleted() {
        String json = "{\"orderId\":10,\"score\":4,\"comment\":\"ok\"}";
        OrderDTO pendingOrder = new OrderDTO(10, 7, 3, 20.0, "PENDING");
        when(orderRepository.findById(10)).thenReturn(Optional.of(pendingOrder));

        ServiceException ex = assertThrows(ServiceException.class, () -> service.createFromJson(json, 7));
        assertTrue(ex.getMessage().contains("encargo está completado"));
    }

    @Test
    void getByOrderIdReturnsNullWhenNotFound() throws Exception {
        when(reviewRepository.findByOrderIdAndAuthorId(10, null)).thenReturn(Optional.empty());
        String result = service.getByOrderId(10);
        assertEquals("null", result);
    }

    @Test
    void getAverageByReviewedUserIdRoundsAndCounts() throws Exception {
        ReviewDTO r1 = new ReviewDTO();
        r1.setScore(5);
        ReviewDTO r2 = new ReviewDTO();
        r2.setScore(4);

        when(reviewRepository.getAverageScoreByReviewedUserId(2)).thenReturn(4.666);
        when(reviewRepository.findByReviewedUserId(2)).thenReturn(List.of(r1, r2));

        String result = service.getAverageByReviewedUserId(2);
        assertTrue(result.contains("\"average\":4.7"));
        assertTrue(result.contains("\"count\":2"));
    }

    @Test
    void deleteByIdDeletesWhenExists() throws Exception {
        ReviewDTO review = new ReviewDTO();
        setReviewId(review, 3);
        when(reviewRepository.findById(3)).thenReturn(Optional.of(review));
        String result = service.deleteById(3);

        assertTrue(result.contains("eliminada"));
        verify(reviewRepository).deleteById(3);
    }

    @Test
    void deleteByIdThrowsWhenMissing() {
        when(reviewRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(ServiceException.class, () -> service.deleteById(99));
    }
}
