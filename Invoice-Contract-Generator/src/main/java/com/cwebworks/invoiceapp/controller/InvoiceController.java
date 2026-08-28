package com.cwebworks.invoiceapp.controller;

import com.cwebworks.invoiceapp.dto.InvoiceRequest;
import com.cwebworks.invoiceapp.dto.InvoiceResponse;
import com.cwebworks.invoiceapp.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Invoices", description = "Invoice management endpoints")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final InvoiceService invoiceService;

    @Operation(summary = "Create a new Invoice")
    @PostMapping
    public ResponseEntity<InvoiceResponse> create(
            @Valid @RequestBody InvoiceRequest request,
            Authentication authentication
            ){
        String email = authentication.getName();
        InvoiceResponse response = invoiceService.createInvoice(request,email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Fetch all Invoices")
    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> fetchAllInvoices(Authentication authentication){
        return ResponseEntity.ok(invoiceService.getAllInvoices(authentication.getName()));
    }

    @Operation(summary = "Fetch Invoice by Id")
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> fetchInvoiceById(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(invoiceService.getInvoiceById(id, authentication.getName()));
    }

    @Operation(summary = "Delete Invoice")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id, Authentication authentication){
        invoiceService.deleteInvoice(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(
            @PathVariable Long id,
            Authentication authentication
    ) {
        byte[] pdfBytes = invoiceService.generateInvoicePdf(id, authentication.getName());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<Void> sendInvoice(
            @PathVariable Long id,
            Authentication authentication
    ) {
        invoiceService.sendInvoiceEmail(id, authentication.getName());
        return ResponseEntity.ok().build();
    }


}
