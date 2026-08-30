package com.cwebworks.invoiceapp.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotNull(message = "Email cannot be null")
    @Email(message = "Email should be like someone@gmail.com")
    private String email;

    @NotNull(message = "Password cannot be null")
    @Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters")
    private String password;

    @NotBlank(message = "Country is required")
    private String country;
}
