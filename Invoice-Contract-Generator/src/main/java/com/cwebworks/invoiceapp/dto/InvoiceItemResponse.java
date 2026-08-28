package com.cwebworks.invoiceapp.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceItemResponse {
    private Long id;

    private String description;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal lineTotal; // quantity * unitPrice
}
