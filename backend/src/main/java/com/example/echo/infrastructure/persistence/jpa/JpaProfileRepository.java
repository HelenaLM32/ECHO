package com.example.echo.infrastructure.persistence.jpa;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.example.echo.core.entity.profile.dto.ProfileDTO;
import com.example.echo.core.entity.profile.persistence.ProfileRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class JpaProfileRepository implements ProfileRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public ProfileDTO save(ProfileDTO profile) {
        if (profile.getId() == null) {
            em.persist(profile);
            return profile;
        }
        return em.merge(profile);
    }

    @Override
    public Optional<ProfileDTO> findByUserId(Integer userId) {
        return em.createQuery(
                "SELECT p FROM ProfileDTO p WHERE p.userId = :userId", ProfileDTO.class)
                .setParameter("userId", userId)
                .getResultList()
                .stream()
                .findFirst();
    }

    @Override
    public Optional<ProfileDTO> findById(Integer id) {
        return Optional.ofNullable(em.find(ProfileDTO.class, id));
    }
}
