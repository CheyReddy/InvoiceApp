package com.cwebworks.invoiceapp.scheduler;

import com.cwebworks.invoiceapp.constants.InvoiceStatus;
import com.cwebworks.invoiceapp.entity.Invoice;
import com.cwebworks.invoiceapp.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoiceScheduler {

    private final InvoiceRepository invoiceRepository;

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void markOverdueInvoices(){

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));

        List<Invoice> invoices = invoiceRepository.findByStatusAndDueDateBefore(InvoiceStatus.SENT,today);

        if(invoices.isEmpty()){
            log.info("No overdue invoices found.");
        }

        for (Invoice invoice : invoices){
            invoice.setStatus(InvoiceStatus.OVERDUE);
        }

        invoiceRepository.saveAll(invoices);

        log.info("{} invoice(s) marked as OVERDUE.", invoices.size());
    }

}
