package com.cwebworks.invoiceapp.dto;

import com.cwebworks.invoiceapp.constants.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceResponse {
    private Long id;

    private String invoiceNumber;

    private InvoiceStatus status;

    private LocalDate dueDate;

    private BigDecimal taxPercent;

    private BigDecimal total;

    private String currencyCode;

    private String currencySymbol;

    private String clientName;

    private List<InvoiceItemResponse> items;

    private LocalDateTime createdAt;
}
