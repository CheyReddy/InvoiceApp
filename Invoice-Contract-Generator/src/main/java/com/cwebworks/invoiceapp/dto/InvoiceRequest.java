package com.cwebworks.invoiceapp.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class InvoiceRequest {

    private Long clientId;

    private LocalDate dueDate;

    private BigDecimal taxPercent;

    private List<InvoiceItemRequest> items;

}
