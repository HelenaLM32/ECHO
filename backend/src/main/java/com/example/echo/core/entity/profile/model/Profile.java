package com.example.echo.core.entity.profile.model;

public class Profile {
    private Integer id;
    private Integer userId;
    private String publicName;
    private String bio;
    private String location;
    private String avatarUrl;
    private String bannerUrl;
    private String linkedin;
    private String instagram;
    private String twitter;

    protected Profile() {
    }

    public static Profile getInstance(Integer userId) {
        Profile p = new Profile();
        p.userId = userId;
        return p;
    }

    public Integer getId() {
        return id;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getPublicName() {
        return publicName;
    }

    public String getBio() {
        return bio;
    }

    public String getLocation() {
        return location;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public String getInstagram() {
        return instagram;
    }

    public String getTwitter() {
        return twitter;
    }

    public void setPublicName(String publicName) {
        this.publicName = publicName;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }
}