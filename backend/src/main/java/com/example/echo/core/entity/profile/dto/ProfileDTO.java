package com.example.echo.core.entity.profile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class ProfileDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    @JacksonXmlProperty(localName = "id")
    private Integer id;

    @Column(name = "user_id", nullable = false, unique = true)
    @JsonProperty("userId")
    @JacksonXmlProperty(localName = "user_id")
    private Integer userId;

    @Column(name = "public_name")
    @JsonProperty("publicName")
    @JacksonXmlProperty(localName = "public_name")
    private String publicName;

    @Column(name = "bio", columnDefinition = "TEXT")
    @JsonProperty("bio")
    @JacksonXmlProperty(localName = "bio")
    private String bio;

    @Column(name = "location")
    @JsonProperty("location")
    @JacksonXmlProperty(localName = "location")
    private String location;

    @Column(name = "avatar_url", columnDefinition = "LONGTEXT")
    @JsonProperty("avatarUrl")
    @JacksonXmlProperty(localName = "avatar_url")
    private String avatarUrl;

    @Column(name = "banner_url", columnDefinition = "LONGTEXT")
    @JsonProperty("bannerUrl")
    @JacksonXmlProperty(localName = "banner_url")
    private String bannerUrl;

    @Column(name = "linkedin")
    @JsonProperty("linkedin")
    @JacksonXmlProperty(localName = "linkedin")
    private String linkedin;

    @Column(name = "instagram")
    @JsonProperty("instagram")
    @JacksonXmlProperty(localName = "instagram")
    private String instagram;

    @Column(name = "twitter")
    @JsonProperty("twitter")
    @JacksonXmlProperty(localName = "twitter")
    private String twitter;

    @Column(name = "experience")
    @JsonProperty("experience")
    @JacksonXmlProperty(localName = "experience")
    private String experience;

    public ProfileDTO() {
    }

    public ProfileDTO(Integer id, Integer userId, String publicName, String bio, String location,
            String avatarUrl, String bannerUrl, String linkedin, String instagram,
            String twitter, String experience) {
        this.id = id;
        this.userId = userId;
        this.publicName = publicName;
        this.bio = bio;
        this.location = location;
        this.avatarUrl = avatarUrl;
        this.bannerUrl = bannerUrl;
        this.linkedin = linkedin;
        this.instagram = instagram;
        this.twitter = twitter;
        this.experience = experience;
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

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    @Override
    public String toString() {
        return "ProfileDTO{id=" + id + ", userId=" + userId + ", publicName='" + publicName + "'}";
    }
}