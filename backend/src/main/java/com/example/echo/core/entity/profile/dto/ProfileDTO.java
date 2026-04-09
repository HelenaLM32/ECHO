package com.example.echo.core.entity.profile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "profiles")
public class ProfileDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    @JacksonXmlProperty(localName = "id")
    private Integer id;

    @Column(name = "user_id", unique = true, nullable = false)
    @JsonProperty("userId")
    @JacksonXmlProperty(localName = "user_id")
    private Integer userId;

    @Column(name = "public_name")
    @JsonProperty("publicName")
    @JacksonXmlProperty(localName = "public_name")
    private String publicName;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("bio")
    @JacksonXmlProperty(localName = "bio")
    private String bio;

    @JsonProperty("location")
    @JacksonXmlProperty(localName = "location")
    private String location;

    @Column(name = "avatar_url")
    @JsonProperty("avatarUrl")
    @JacksonXmlProperty(localName = "avatar_url")
    private String avatarUrl;

    @Column(name = "banner_url")
    @JsonProperty("bannerUrl")
    @JacksonXmlProperty(localName = "banner_url")
    private String bannerUrl;

    @JsonProperty("linkedin")
    @JacksonXmlProperty(localName = "linkedin")
    private String linkedin;

    @JsonProperty("instagram")
    @JacksonXmlProperty(localName = "instagram")
    private String instagram;

    @JsonProperty("twitter")
    @JacksonXmlProperty(localName = "twitter")
    private String twitter;

    public ProfileDTO() {
    }

    public static ProfileDTO getInstance(Integer userId) {
        ProfileDTO dto = new ProfileDTO();
        dto.setUserId(userId);
        return dto;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getPublicName() {
        return publicName;
    }

    public void setPublicName(String publicName) {
        this.publicName = publicName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public String getTwitter() {
        return twitter;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }
}
