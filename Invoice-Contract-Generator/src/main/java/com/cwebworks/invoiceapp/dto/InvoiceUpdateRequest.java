package com.cwebworks.invoiceapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class InvoiceUpdateRequest {

    @NotNull
    private LocalDate dueDate;

    @NotNull
    @DecimalMin("0")
    @DecimalMax("100")
    private BigDecimal taxPercent;

    @NotEmpty
    private List<@Valid InvoiceItemRequest> items;
}