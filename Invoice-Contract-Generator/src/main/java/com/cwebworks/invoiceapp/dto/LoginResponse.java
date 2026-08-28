package com.cwebworks.invoiceapp.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String email;
    private String token;
}
