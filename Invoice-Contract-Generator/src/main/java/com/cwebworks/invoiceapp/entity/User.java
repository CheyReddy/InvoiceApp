package com.cwebworks.invoiceapp.entity;

import com.cwebworks.invoiceapp.constants.Plan;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Plan plan; // "FREE", "PRO" — nullable for now

    @Column
    private String businessName;

    @Column(columnDefinition = "COMMENT 'Appending to outgoing invoice emails sent to your clients.'")
    private String signature;

    @Column(columnDefinition = "COMMENT 'Email me when an invoice is viewed by a client'")
    private Boolean invoiceViewed = false;

    @Column(columnDefinition = "COMMENT 'Send me overdue invoice reminders.'")
    private Boolean overdueReminders = false;

    @Column(columnDefinition = "COMMENT 'Email me when an invoice is paid'")
    private Boolean paymentReceived = false;
}
