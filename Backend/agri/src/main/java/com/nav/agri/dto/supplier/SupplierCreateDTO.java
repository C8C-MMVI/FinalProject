package com.nav.agri.dto.supplier;

import jakarta.validation.constraints.*;

public class SupplierCreateDTO {
    @NotBlank(message = "Supplier name is required")
    private String name;

    @NotBlank(message = "Contact info is required")
    @Size(max = 11, message = "Contact info must be at most 11 characters")
    private String contactInfo;

    @NotBlank(message = "Supplier address is required")
    private String address;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

}
