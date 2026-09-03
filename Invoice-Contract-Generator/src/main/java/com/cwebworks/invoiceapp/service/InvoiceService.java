package com.cwebworks.invoiceapp.service;

import com.cwebworks.invoiceapp.constants.InvoiceStatus;
import com.cwebworks.invoiceapp.dto.InvoiceItemResponse;
import com.cwebworks.invoiceapp.dto.InvoiceRequest;
import com.cwebworks.invoiceapp.dto.InvoiceResponse;
import com.cwebworks.invoiceapp.entity.Client;
import com.cwebworks.invoiceapp.entity.Invoice;
import com.cwebworks.invoiceapp.entity.InvoiceItem;
import com.cwebworks.invoiceapp.entity.User;
import com.cwebworks.invoiceapp.repository.ClientRepository;
import com.cwebworks.invoiceapp.repository.InvoiceRepository;
import com.cwebworks.invoiceapp.repository.UserRepository;
import com.cwebworks.invoiceapp.util.CurrencyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final InvoicePdfGenerator pdfGenerator;
    private final EmailService emailService;

    public InvoiceResponse createInvoice(InvoiceRequest request, String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        Client client = clientRepository.findByIdAndUserEmail(request.getClientId(), userEmail)
                .orElseThrow(() -> new NoSuchElementException("Client not found"));

        Invoice invoice = new Invoice();
        invoice.setUser(user);
        invoice.setClient(client);
        invoice.setInvoiceNumber(generateInvoiceNumber(userEmail));
        invoice.setStatus(InvoiceStatus.DRAFT);
        invoice.setDueDate(request.getDueDate());
        invoice.setTaxPercent(request.getTaxPercent());
        invoice.setCurrencyCode(CurrencyUtil.currencyCodeForCountry(client.getCountry()));

        List<InvoiceItem> items = request.getItems().stream()
                .map(itemReq -> {
                    InvoiceItem item = new InvoiceItem();
                    item.setInvoice(invoice);
                    item.setDescription(itemReq.getDescription());
                    item.setQuantity(itemReq.getQuantity());
                    item.setUnitPrice(itemReq.getUnitPrice());
                    return item;
                })
                .toList();
        invoice.setItems(items);
        invoice.setTotal(calculateTotal(items, request.getTaxPercent()));

        Invoice saved = invoiceRepository.save(invoice);
        return convertToResponse(saved);
    }

    private String generateInvoiceNumber(String userEmail) {
        Optional<String> maxInvoiceNumber = invoiceRepository.findMaxInvoiceNumberByUserEmail(userEmail);

        int nextNumber = maxInvoiceNumber
                .map(this::extractNumericPart)
                .map(n -> n + 1)
                .orElse(1);

        return String.format("INV-%04d", nextNumber);
    }

    private int extractNumericPart(String invoiceNumber) {
        // "INV-0002" -> 2
        return Integer.parseInt(invoiceNumber.replaceAll("[^0-9]", ""));
    }

    private BigDecimal calculateTotal(List<InvoiceItem> items, BigDecimal taxPercent) {
        BigDecimal subTotal = items.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal taxAmount = subTotal.multiply(taxPercent).divide(BigDecimal.valueOf(100));
        return subTotal.add(taxAmount).setScale(2, RoundingMode.HALF_UP);
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getAllInvoices(String userEmail){
        return invoiceRepository.findAllByUserEmail(userEmail)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public InvoiceResponse getInvoiceById(Long id, String userEmail){
        Invoice response = invoiceRepository.findByIdAndUserEmail(id,userEmail)
                .orElseThrow(() -> new NoSuchElementException("Invoice not found"));
        return convertToResponse(response);
    }

    public void deleteInvoice(Long id, String userEmail){
        Invoice invoice = invoiceRepository.findByIdAndUserEmail(id,userEmail)
                .orElseThrow(() -> new NoSuchElementException("Invoice not found"));
        invoiceRepository.delete(invoice);
    }

    private InvoiceResponse convertToResponse(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setStatus(invoice.getStatus());
        response.setTotal(invoice.getTotal());
        response.setDueDate(invoice.getDueDate());
        response.setTaxPercent(invoice.getTaxPercent());
        response.setClientName(invoice.getClient().getName());
        response.setCreatedAt(invoice.getCreatedAt());
        response.setCurrencyCode(invoice.getCurrencyCode());
        response.setCurrencySymbol(CurrencyUtil.symbolForCurrency(invoice.getCurrencyCode()));

        List<InvoiceItemResponse> itemResponses = invoice.getItems().stream()
                .map(item -> {
                    InvoiceItemResponse itemResponse = new InvoiceItemResponse();
                    itemResponse.setId(item.getId());
                    itemResponse.setDescription(item.getDescription());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setUnitPrice(item.getUnitPrice());
                    itemResponse.setLineTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                    return itemResponse;
                })
                .toList();
        response.setItems(itemResponses);
        return response;
    }

    @Transactional
    public byte[] generateInvoicePdf(Long id, String userEmail) {
        Invoice invoice = invoiceRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new NoSuchElementException("Invoice not found"));
        return pdfGenerator.generate(invoice);
    }

    @Transactional
    public void sendInvoiceEmail(Long id, String userEmail) {
        Invoice invoice = invoiceRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new NoSuchElementException("Invoice not found"));

        if (invoice.getClient().getEmail() == null) {
            throw new IllegalStateException("Client has no email address on file");
        }

        byte[] pdfBytes = pdfGenerator.generate(invoice);
        emailService.sendInvoiceEmail(invoice.getClient().getEmail(), invoice.getInvoiceNumber(), pdfBytes);

        invoice.setStatus(InvoiceStatus.SENT);
        invoiceRepository.save(invoice);
    }

}
