package com.example.echo.core.entity.venuereviews.model;

import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class VenueEventReview {

    private Integer id;
    private Integer authorId;
    private Integer targetId;
    private String targetType;
    private Integer score;
    private String comment;

    protected VenueEventReview() {
    }

    public static VenueEventReview getInstance(
            Integer authorId, Integer targetId, String targetType,
            Integer score, String comment) throws BuildException {

        VenueEventReview r = new VenueEventReview();
        StringBuilder msg = new StringBuilder();

        if (authorId == null || authorId <= 0)
            msg.append("authorId inválido; ");
        if (targetId == null || targetId <= 0)
            msg.append("targetId inválido; ");
        if (!"VENUE".equals(targetType) && !"EVENT".equals(targetType))
            msg.append("targetType debe ser VENUE o EVENT; ");
        if (score == null || score < 1 || score > 5)
            msg.append("score debe estar entre 1 y 5; ");
        if (!msg.isEmpty())
            throw new BuildException(msg.toString().trim());

        r.authorId = authorId;
        r.targetId = targetId;
        r.targetType = targetType;
        r.score = score;
        r.comment = (comment != null) ? comment.trim() : "";
        return r;
    }

    public Integer getId() {
        return id;
    }

    public Integer getAuthorId() {
        return authorId;
    }

    public Integer getTargetId() {
        return targetId;
    }

    public String getTargetType() {
        return targetType;
    }

    public Integer getScore() {
        return score;
    }

    public String getComment() {
        return comment;
    }
}