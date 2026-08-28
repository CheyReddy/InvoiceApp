package com.cwebworks.invoiceapp.service;

import com.cwebworks.invoiceapp.entity.Invoice;
import com.cwebworks.invoiceapp.entity.InvoiceItem;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.stream.Stream;

@Component
public class InvoicePdfGenerator {

    public byte[] generate(Invoice invoice) {
        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font labelFont = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 10);

            // Header
            Paragraph title = new Paragraph("INVOICE " + invoice.getInvoiceNumber(), titleFont);
            title.setSpacingAfter(20);
            document.add(title);

            // Client + meta info
            document.add(new Paragraph("Bill To: " + invoice.getClient().getName(), labelFont));
            if (invoice.getClient().getEmail() != null) {
                document.add(new Paragraph(invoice.getClient().getEmail(), normalFont));
            }
            if (invoice.getClient().getAddress() != null) {
                document.add(new Paragraph(invoice.getClient().getAddress(), normalFont));
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Due Date: " + invoice.getDueDate(), normalFont));
            document.add(new Paragraph("Status: " + invoice.getStatus(), normalFont));
            document.add(new Paragraph(" "));

            // Line items table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{4, 1, 2, 2});

            addTableHeader(table, labelFont);
            for (InvoiceItem item : invoice.getItems()) {
                table.addCell(new Phrase(item.getDescription(), normalFont));
                table.addCell(new Phrase(String.valueOf(item.getQuantity()), normalFont));
                table.addCell(new Phrase(formatCurrency(item.getUnitPrice()), normalFont));
                BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                table.addCell(new Phrase(formatCurrency(lineTotal), normalFont));
            }
            document.add(table);

            document.add(new Paragraph(" "));

            // Totals
            Paragraph tax = new Paragraph("Tax: " + invoice.getTaxPercent() + "%", normalFont);
            tax.setAlignment(Element.ALIGN_RIGHT);
            document.add(tax);

            Paragraph total = new Paragraph("Total: " + formatCurrency(invoice.getTotal()),
                    new Font(Font.HELVETICA, 12, Font.BOLD));
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }

        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table, Font labelFont) {
        Stream.of("Description", "Qty", "Unit Price", "Line Total")
                .forEach(col -> {
                    PdfPCell cell = new PdfPCell(new Phrase(col, labelFont));
                    cell.setBackgroundColor(new Color(230, 230, 230));
                    table.addCell(cell);
                });
    }

    private String formatCurrency(BigDecimal amount) {
        return "$" + amount.setScale(2, RoundingMode.HALF_UP);
    }
}