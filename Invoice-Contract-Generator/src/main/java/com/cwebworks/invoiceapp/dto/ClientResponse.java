package com.cwebworks.invoiceapp.dto;

import lombok.Data;

@Data
public class ClientResponse {
    private long id;
    private String name;
    private String email;
    private String address;
}
