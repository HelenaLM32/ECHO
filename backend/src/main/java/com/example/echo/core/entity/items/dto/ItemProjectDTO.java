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

    @Column(name = "block_border_radius")
    @JsonProperty("blockBorderRadius")
    private Integer blockBorderRadius;

    @Column(name = "published")
    @JsonProperty("published")
    private Boolean published = false;

    @Column(name = "slug", unique = true)
    @JsonProperty("slug")
    private String slug;

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
            Integer blockBorderRadius,
            Boolean published,
            String slug) {
        this.item = item;
        this.blocks = blocks;
        this.background = background;
        this.blockGap = blockGap;
        this.blockBorderRadius = blockBorderRadius;
        this.published = published;
        this.slug = slug;
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

    public Integer getBlockBorderRadius() { return blockBorderRadius; }

    public void setBlockBorderRadius(Integer blockBorderRadius) { this.blockBorderRadius = blockBorderRadius; }

    public Boolean getPublished() { return published; }

    public void setPublished(Boolean published) { this.published = published; }

    public String getSlug() { return slug; }

    public void setSlug(String slug) { this.slug = slug; }

    public OffsetDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
