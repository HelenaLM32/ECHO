package com.example.echo.core.entity.items.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "item_projects")
public class ItemProjectDTO {

    @Id
    private Integer id; // maps 1:1 to items.id (inheritance via shared PK)

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private ItemDTO item;

    @Column(columnDefinition = "LONGTEXT")
    @JsonProperty("blocks")
    private String blocks; // JSON string representing blocks array

    @Column(name = "background", columnDefinition = "LONGTEXT")
    @JsonProperty("background")
    private String background;

    @Column(name = "block_gap")
    @JsonProperty("blockGap")
    private Integer blockGap;

    @Column(name = "published")
    @JsonProperty("published")
    private Boolean published = false;

    @Column(name = "slug", unique = true)
    @JsonProperty("slug")
    private String slug;

    @Column(name = "likes", nullable = false)
    @JsonProperty("likes")
    private Integer likes = 0;

    @Column(name = "views", nullable = false)
    @JsonProperty("views")
    private Integer views = 0;

    @Column(name = "comments", nullable = false)
    @JsonProperty("comments")
    private Integer comments = 0;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public ItemProjectDTO() {
    }

    public ItemProjectDTO(ItemDTO item,
            String blocks,
            String background,
            Integer blockGap,
            Boolean published,
            String slug) {
        this.item = item;
        this.blocks = blocks;
        this.background = background;
        this.blockGap = blockGap;
        this.published = published;
        this.slug = slug;
        this.likes = 0;
        this.views = 0;
        this.comments = 0;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public Integer getId() { return id; }

    public ItemDTO getItem() { return item; }

    public void setItem(ItemDTO item) { this.item = item; }

    public String getBlocks() { return blocks; }

    public void setBlocks(String blocks) { this.blocks = blocks; }

    public String getBackground() { return background; }

    public void setBackground(String background) { this.background = background; }

    public Integer getBlockGap() { return blockGap; }

    public void setBlockGap(Integer blockGap) { this.blockGap = blockGap; }

    public Boolean getPublished() { return published; }

    public void setPublished(Boolean published) { this.published = published; }

    public String getSlug() { return slug; }

    public void setSlug(String slug) { this.slug = slug; }

    public Integer getLikes() { return likes; }

    public void setLikes(Integer likes) { this.likes = likes; }

    public Integer getViews() { return views; }

    public void setViews(Integer views) { this.views = views; }

    public Integer getComments() { return comments; }

    public void setComments(Integer comments) { this.comments = comments; }

    public OffsetDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
