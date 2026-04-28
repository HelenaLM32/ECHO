// src/main/java/com/example/echo/core/entity/venues/model/Venue.java
package com.example.echo.core.entity.venues.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class Venue {

    private Integer id;
    private Integer managerId;
    private String name;
    private String address;
    private Integer capacity;
    private String img1;
    private String img2;
    private String img3;

    protected Venue() {
    }

    public static Venue getInstance(Integer managerId, String name, String address,
            Integer capacity) throws BuildException {
        Venue v = new Venue();
        StringBuilder msg = new StringBuilder();

        if (managerId == null || !Check.isPositive(managerId))
            msg.append("managerId inválido; ");
        else
            v.managerId = managerId;

        if (!Check.lengthBetween(name, 2, 150))
            msg.append("name inválido (2-150 chars); ");
        else
            v.name = name.trim();

        if (!Check.lengthBetween(address, 5, 255))
            msg.append("address inválido (5-255 chars); ");
        else
            v.address = address.trim();

        if (capacity != null && !Check.isPositive(capacity))
            msg.append("capacity debe ser positivo; ");
        else
            v.capacity = capacity;

        if (!msg.isEmpty())
            throw new BuildException(msg.toString().trim());
        return v;
    }

    public Integer getId() {
        return id;
    }

    public Integer getManagerId() {
        return managerId;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getImg1() {
        return img1;
    }

    public String getImg2() {
        return img2;
    }

    public String getImg3() {
        return img3;
    }

    public int setName(String name) {
        if (Check.lengthBetween(name, 2, 150)) {
            this.name = name.trim();
            return 0;
        }
        return -1;
    }

    public int setAddress(String address) {
        if (Check.lengthBetween(address, 5, 255)) {
            this.address = address.trim();
            return 0;
        }
        return -1;
    }

    public int setCapacity(Integer capacity) {
        if (capacity == null || Check.isPositive(capacity)) {
            this.capacity = capacity;
            return 0;
        }
        return -1;
    }

    public int setImg1(String img1) {
        if (img1 == null || Check.maxLength(img1, 500)) {
            this.img1 = img1;
            return 0;
        }
        return -1;
    }

    public int setImg2(String img2) {
        if (img2 == null || Check.maxLength(img2, 500)) {
            this.img2 = img2;
            return 0;
        }
        return -1;
    }

    public int setImg3(String img3) {
        if (img3 == null || Check.maxLength(img3, 500)) {
            this.img3 = img3;
            return 0;
        }
        return -1;
    }
}