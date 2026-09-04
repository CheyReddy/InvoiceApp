package com.cwebworks.invoiceapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class InvoiceContractGeneratorApplication {
	public static void main(String[] args) {
		SpringApplication.run(InvoiceContractGeneratorApplication.class, args);
	}
}
