package com.cwebworks.invoiceapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceItemRequest {

    @Size(min = 3)
    private String description;

    @Min(value = 1)
    private Integer quantity;

    private BigDecimal unitPrice;
}
