package com.cwebworks.invoiceapp.repository;

import com.cwebworks.invoiceapp.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findAllByUserEmail(String email);
    Optional<Invoice> findByIdAndUserEmail(Long id, String email);
    long countByUserEmail(String email);
    @Query("SELECT MAX(i.invoiceNumber) FROM Invoice i WHERE i.user.email = :email")
    Optional<String> findMaxInvoiceNumberByUserEmail(@Param("email") String email);
}
