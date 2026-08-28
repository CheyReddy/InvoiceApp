package com.cwebworks.invoiceapp.repository;

import com.cwebworks.invoiceapp.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findAllByUserEmail(String email);
    Optional<Client> findByIdAndUserEmail(Long id, String email);
}
