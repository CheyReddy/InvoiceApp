package com.cwebworks.invoiceapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SignatureRequestResponse {
    private String signature;
}
