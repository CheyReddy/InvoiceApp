package com.cwebworks.invoiceapp.controller;

import com.cwebworks.invoiceapp.dto.ClientRequest;
import com.cwebworks.invoiceapp.dto.ClientResponse;
import com.cwebworks.invoiceapp.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Clients", description = "Client management endpoints")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    @Operation(summary = "Create a new client")
    @PostMapping
    public ResponseEntity<ClientResponse> create(@Valid @RequestBody ClientRequest request, Authentication authentication){
        String email = authentication.getName();
        ClientResponse response = clientService.createClient(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Fetch all clients")
    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAll(Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(clientService.getAllClients(email));
    }

    @Operation(summary = "Fetch client by id")
    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getById(@PathVariable Long id, Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(clientService.getClientById(id,email));
    }

    @Operation(summary = "Update Client")
    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> update(@PathVariable Long id,@Valid @RequestBody ClientRequest request, Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(clientService.updateClient(id,request,email));
    }

    @Operation(summary = "Delete client")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication){
        String email = authentication.getName();
        clientService.deleteClient(id,email);
        return ResponseEntity.noContent().build();
    }


}
