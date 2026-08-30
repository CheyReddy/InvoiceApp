package com.cwebworks.invoiceapp.util;

import java.util.Map;

public class CurrencyUtil {

    private static final Map<String, String> COUNTRY_TO_CURRENCY = Map.ofEntries(
            Map.entry("United States", "USD"),
            Map.entry("India", "INR"),
            Map.entry("United Kingdom", "GBP"),
            Map.entry("Canada", "CAD"),
            Map.entry("Australia", "AUD"),
            Map.entry("Germany", "EUR"),
            Map.entry("France", "EUR"),
            Map.entry("Spain", "EUR"),
            Map.entry("Italy", "EUR"),
            Map.entry("Netherlands", "EUR"),
            Map.entry("Japan", "JPY"),
            Map.entry("Singapore", "SGD"),
            Map.entry("United Arab Emirates", "AED")
            // add more as needed
    );

    private static final Map<String, String> CURRENCY_SYMBOLS = Map.ofEntries(
            Map.entry("USD", "$"),
            Map.entry("INR", "₹"),
            Map.entry("GBP", "£"),
            Map.entry("CAD", "CA$"),
            Map.entry("AUD", "A$"),
            Map.entry("EUR", "€"),
            Map.entry("JPY", "¥"),
            Map.entry("SGD", "S$"),
            Map.entry("AED", "AED ")
    );

    public static String currencyCodeForCountry(String country) {
        return COUNTRY_TO_CURRENCY.getOrDefault(country, "USD");
    }

    public static String symbolForCurrency(String currencyCode) {
        return CURRENCY_SYMBOLS.getOrDefault(currencyCode, currencyCode + " ");
    }
}