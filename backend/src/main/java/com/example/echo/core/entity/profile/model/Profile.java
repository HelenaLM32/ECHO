// src/main/java/com/example/echo/core/entity/profile/model/Profile.java
package com.example.echo.core.entity.profile.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

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
    private String experience;
    private String calendarUrl;

    protected Profile() {
    }

    public static Profile getInstance(Integer userId, String publicName) throws BuildException {
        Profile p = new Profile();
        StringBuilder msg = new StringBuilder();

        if (userId == null || !Check.isPositive(userId))
            msg.append("userId inválido; ");
        else
            p.userId = userId;

        if (publicName != null && !Check.maxLength(publicName, 100))
            msg.append("publicName demasiado largo (máx. 100); ");
        else
            p.publicName = publicName;

        if (!msg.isEmpty())
            throw new BuildException(msg.toString().trim());
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

    public String getExperience() {
        return experience;
    }

    public String getCalendarUrl() {
        return calendarUrl;
    }

    public int setPublicName(String publicName) {
        if (publicName == null || Check.maxLength(publicName, 100)) {
            this.publicName = publicName;
            return 0;
        }
        return -1;
    }

    public int setBio(String bio) {
        if (bio == null || Check.isEmpty(bio) || Check.maxLength(bio, 1000)) {
            this.bio = bio;
            return 0;
        }
        return -1;
    }

    public int setLocation(String location) {
        if (location == null || Check.isEmpty(location) || Check.maxLength(location, 100)) {
            this.location = location;
            return 0;
        }
        return -1;
    }

    public int setLinkedin(String url) {
        if (url == null || Check.isEmpty(url) || Check.maxLength(url, 255)) {
            this.linkedin = url;
            return 0;
        }
        return -1;
    }

    public int setInstagram(String url) {
        if (url == null || Check.isEmpty(url) || Check.maxLength(url, 255)) {
            this.instagram = url;
            return 0;
        }
        return -1;
    }

    public int setTwitter(String url) {
        if (url == null || Check.isEmpty(url) || Check.maxLength(url, 255)) {
            this.twitter = url;
            return 0;
        }
        return -1;
    }

    public int setExperience(String experience) {
        if (experience == null || Check.isEmpty(experience) || Check.maxLength(experience, 255)) {
            this.experience = experience;
            return 0;
        }
        return -1;
    }

    public int setCalendarUrl(String url) {
        if (url == null || Check.isEmpty(url) || Check.maxLength(url, 500)) {
            this.calendarUrl = url;
            return 0;
        }
        return -1;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }
}