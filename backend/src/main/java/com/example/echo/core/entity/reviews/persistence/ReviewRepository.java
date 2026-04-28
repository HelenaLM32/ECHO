package com.example.echo.core.entity.reviews.persistence;

import com.example.echo.core.entity.reviews.dto.ReviewDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewDTO, Integer> {

    Optional<ReviewDTO> findByOrderIdAndAuthorId(Integer orderId, Integer authorId);

    @Query("SELECT r FROM ReviewDTO r WHERE r.reviewedUserId = :userId")
    List<ReviewDTO> findByReviewedUserId(@Param("userId") Integer userId);

    @Query("SELECT AVG(r.score) FROM ReviewDTO r WHERE r.reviewedUserId = :userId")
    Double getAverageScoreByReviewedUserId(@Param("userId") Integer userId);
}
