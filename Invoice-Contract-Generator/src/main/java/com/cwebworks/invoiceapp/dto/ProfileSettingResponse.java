package com.cwebworks.invoiceapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileSettingResponse {
    private String businessName;
    private String email;
    private String country;
    private String signature;
    private Boolean invoiceViewed;
    private Boolean overdueReminders;
    private Boolean paymentReceived;
}
