package com.example.echo.core.entity.reviews.model;

import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class Review {

    private Integer id;
    private Integer orderId;
    private Integer authorId;
    private Integer score;
    private String comment;

    protected Review() {}

    public static Review getInstance(Integer orderId, Integer authorId, Integer score, String comment)
            throws BuildException {
        Review r = new Review();
        StringBuilder msg = new StringBuilder();
        if (orderId == null || orderId <= 0)   msg.append("orderId inválido; ");
        if (authorId == null || authorId <= 0) msg.append("authorId inválido; ");
        if (score == null || score < 1 || score > 5) msg.append("score debe estar entre 1 y 5; ");
        if (!msg.isEmpty()) throw new BuildException(msg.toString().trim());
        r.orderId  = orderId;
        r.authorId = authorId;
        r.score    = score;
        r.comment  = (comment != null) ? comment.trim() : "";
        return r;
    }

    public Integer getId()       { return id; }
    public Integer getOrderId()  { return orderId; }
    public Integer getAuthorId() { return authorId; }
    public Integer getScore()    { return score; }
    public String  getComment()  { return comment; }
}
