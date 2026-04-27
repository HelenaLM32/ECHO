package com.example.echo.core.entity.venues.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class Venue {

    private Integer id;
    private Integer managerId;
    private String name;
    private String address;
    private Integer capacity;
    private String status;
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

        if (!Check.minStringChars(name, 2) || !Check.maxStringChars(name, 150))
            msg.append("name inválido; ");
        else
            v.name = name.trim();

        if (!Check.minStringChars(address, 5) || !Check.maxStringChars(address, 255))
            msg.append("address inválido; ");
        else
            v.address = address.trim();

        if (capacity != null && capacity > 0)
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

    public String getStatus() {
        return status;
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

    public void setStatus(String status) {
        this.status = status;
    }

    public void setImg1(String img1) {
        this.img1 = img1;
    }

    public void setImg2(String img2) {
        this.img2 = img2;
    }

    public void setImg3(String img3) {
        this.img3 = img3;
    }
}