package com.cwebworks.invoiceapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private String email;
    private String businessName;
    private String country;
}
