package com.cwebworks.invoiceapp.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecurityRequest {

    @NotNull(message = "Password cannot be null")
    @Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters")
    private String currentPassword;

    @NotNull(message = "Password cannot be null")
    @Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters")
    private String newPassword;
}
