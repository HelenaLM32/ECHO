package com.example.echo.core.entity.venuereviews.persistence;

import com.example.echo.core.entity.venuereviews.dto.VenueEventReviewDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VenueEventReviewRepository extends JpaRepository<VenueEventReviewDTO, Integer> {

    List<VenueEventReviewDTO> findByTargetIdAndTargetType(Integer targetId, String targetType);

    Optional<VenueEventReviewDTO> findByAuthorIdAndTargetIdAndTargetType(
            Integer authorId, Integer targetId, String targetType);

    @Query("SELECT AVG(r.score) FROM VenueEventReviewDTO r " +
            "WHERE r.targetId = :targetId AND r.targetType = :targetType")
    Double getAverageScore(@Param("targetId") Integer targetId,
            @Param("targetType") String targetType);

    long countByTargetIdAndTargetType(Integer targetId, String targetType);
}