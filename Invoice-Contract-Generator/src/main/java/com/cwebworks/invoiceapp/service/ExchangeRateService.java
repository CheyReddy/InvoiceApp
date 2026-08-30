package com.cwebworks.invoiceapp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ExchangeRateService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, CachedRates> cache = new ConcurrentHashMap<>();

    private record CachedRates(Map<String, BigDecimal> rates, Instant fetchedAt) {}

    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }

        Map<String, BigDecimal> rates = getRates(fromCurrency);
        BigDecimal rate = rates.get(toCurrency);

        if (rate == null) {
            return amount; // fallback: no conversion available, return as-is
        }

        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    private Map<String, BigDecimal> getRates(String baseCurrency) {
        CachedRates cached = cache.get(baseCurrency);

        if (cached != null && Duration.between(cached.fetchedAt(), Instant.now()).toHours() < 24) {
            return cached.rates();
        }

        Map<String, BigDecimal> rates = fetchRatesFromApi(baseCurrency);
        cache.put(baseCurrency, new CachedRates(rates, Instant.now()));
        return rates;
    }

    private Map<String, BigDecimal> fetchRatesFromApi(String baseCurrency) {
        String url = "https://api.frankfurter.app/latest?from=" + baseCurrency;

        try {
            FrankfurterResponse response = restTemplate.getForObject(url, FrankfurterResponse.class);
            if (response != null && response.rates() != null) {
                return response.rates();
            }
        } catch (Exception e) {
            // log and fall through to empty map
        }

        return Collections.emptyMap();
    }

    private record FrankfurterResponse(String base, Map<String, BigDecimal> rates) {}
}