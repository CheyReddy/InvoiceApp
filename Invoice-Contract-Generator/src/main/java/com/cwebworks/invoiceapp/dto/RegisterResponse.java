package com.cwebworks.invoiceapp.dto;

import com.cwebworks.invoiceapp.constants.Plan;
import lombok.Data;

@Data
public class RegisterResponse {
    private Long id;
    private String email;
    private Plan plan;
    private String country;
}
