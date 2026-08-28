package com.cwebworks.invoiceapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClientRequest {

    @NotBlank(message = "Name cannot be null")
    private String name;

    @Email(message = "Email cannot be null")
    private String email;

    private String address;
}
