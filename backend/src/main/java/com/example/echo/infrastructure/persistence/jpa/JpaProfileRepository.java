package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.profile.model.Profile;
import com.example.echo.core.entity.profile.persistence.ProfileRepository;
import jakarta.persistence.*;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class JpaProfileRepository implements ProfileRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Profile save(Profile profile) {
        if (profile.getId() == null) {
            em.persist(profile);
            return profile;
        }
        return em.merge(profile);
    }

    @Override
    public Optional<Profile> findByUserId(Integer userId) {
        return em.createQuery(
                "SELECT p FROM Profile p WHERE p.userId = :userId", Profile.class)
                .setParameter("userId", userId)
                .getResultList()
                .stream()
                .findFirst();
    }

    @Override
    public Optional<Profile> findById(Integer id) {
        return Optional.ofNullable(em.find(Profile.class, id));
    }
}