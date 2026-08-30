package com.cwebworks.invoiceapp.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DashboardStatsResponse {
    private BigDecimal outstanding;
    private BigDecimal paid;
    private String currencyCode;
    private String currencySymbol;
}
