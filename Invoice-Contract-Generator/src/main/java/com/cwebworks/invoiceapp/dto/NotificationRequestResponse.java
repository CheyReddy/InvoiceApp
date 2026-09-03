package com.cwebworks.invoiceapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequestResponse {
    private Boolean invoiceViewed;
    private Boolean overdueReminders;
    private Boolean paymentReceived;
}
