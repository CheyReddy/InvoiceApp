package com.cwebworks.invoiceapp.service;

import com.cwebworks.invoiceapp.dto.ClientRequest;
import com.cwebworks.invoiceapp.dto.ClientResponse;
import com.cwebworks.invoiceapp.entity.Client;
import com.cwebworks.invoiceapp.entity.User;
import com.cwebworks.invoiceapp.repository.ClientRepository;
import com.cwebworks.invoiceapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    public ClientResponse createClient(ClientRequest request, String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Client client = new Client();
        client.setUser(user);
        client.setEmail(request.getEmail());
        client.setName(request.getName());
        client.setAddress(request.getAddress());
        client.setCountry(request.getCountry());

        Client savedClient = clientRepository.save(client);
        return convertToResponse(savedClient);
    }

    public List<ClientResponse> getAllClients(String userEmail){
        return clientRepository.findAllByUserEmail(userEmail)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ClientResponse getClientById(Long id,String userEmail){
        Client client = clientRepository.findByIdAndUserEmail(id,userEmail)
                .orElseThrow(() -> new NoSuchElementException("Client not found"));
        return convertToResponse(client);
    }

    public ClientResponse updateClient(Long id, ClientRequest request, String userEmail){
        Client client = clientRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new NoSuchElementException("Client not found"));
        client.setName(request.getName());
        client.setEmail(request.getEmail());
        client.setAddress(request.getAddress());
        client.setCountry(request.getCountry());
        Client updated = clientRepository.save(client);
        return convertToResponse(updated);
    }

    public void deleteClient(Long id, String userEmail){
        Client client = clientRepository.findByIdAndUserEmail(id,userEmail)
                .orElseThrow(() -> new NoSuchElementException("Client not found"));
        clientRepository.delete(client);
    }

    private ClientResponse convertToResponse(Client client) {
        ClientResponse response = new ClientResponse();
        response.setId(client.getId());
        response.setName(client.getName());
        response.setEmail(client.getEmail());
        response.setAddress(client.getAddress());
        response.setCountry(client.getCountry());
        return response;
    }

}
