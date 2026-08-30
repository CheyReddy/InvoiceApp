package com.cwebworks.invoiceapp.service;

import com.cwebworks.invoiceapp.constants.InvoiceStatus;
import com.cwebworks.invoiceapp.dto.DashboardStatsResponse;
import com.cwebworks.invoiceapp.entity.Invoice;
import com.cwebworks.invoiceapp.entity.User;
import com.cwebworks.invoiceapp.repository.InvoiceRepository;
import com.cwebworks.invoiceapp.repository.UserRepository;
import com.cwebworks.invoiceapp.util.CurrencyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final ExchangeRateService exchangeRateService;

    public DashboardStatsResponse getStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        String userCurrency = CurrencyUtil.currencyCodeForCountry(user.getCountry());

        List<Invoice> invoices = invoiceRepository.findAllByUserEmail(userEmail);

        BigDecimal outstanding = BigDecimal.ZERO;
        BigDecimal paid = BigDecimal.ZERO;

        for (Invoice inv : invoices) {
            BigDecimal converted = exchangeRateService.convert(
                    inv.getTotal(), inv.getCurrencyCode(), userCurrency
            );

            if (inv.getStatus() == InvoiceStatus.SENT || inv.getStatus() == InvoiceStatus.OVERDUE) {
                outstanding = outstanding.add(converted);
            } else if (inv.getStatus() == InvoiceStatus.PAID) {
                paid = paid.add(converted);
            }
        }

        DashboardStatsResponse response = new DashboardStatsResponse();
        response.setOutstanding(outstanding);
        response.setPaid(paid);
        response.setCurrencyCode(userCurrency);
        response.setCurrencySymbol(CurrencyUtil.symbolForCurrency(userCurrency));
        return response;
    }
}
