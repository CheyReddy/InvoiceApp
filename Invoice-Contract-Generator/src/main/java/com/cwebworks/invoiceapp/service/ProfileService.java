package com.cwebworks.invoiceapp.service;

import com.cwebworks.invoiceapp.dto.*;
import com.cwebworks.invoiceapp.entity.User;
import com.cwebworks.invoiceapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {
    private static final Logger logger = LoggerFactory.getLogger(ProfileService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileSettingResponse getUserProfile(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        return ProfileSettingResponse.builder()
                .businessName(user.getBusinessName())
                .email(user.getEmail())
                .country(user.getCountry())
                .signature(user.getSignature())
                .invoiceViewed(user.getInvoiceViewed())
                .overdueReminders(user.getOverdueReminders())
                .paymentReceived(user.getPaymentReceived())
                .build();
    }

    public ProfileResponse updateProfile(ProfileRequest profileRequest, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        user.setBusinessName(profileRequest.getBusinessName());
        user.setCountry(profileRequest.getCountry());
        User saved = userRepository.save(user);
        return convertToResponse(saved);
    }

    private ProfileResponse convertToResponse(User saved) {
        return ProfileResponse.builder()
                .email(saved.getEmail())
                .country(saved.getCountry())
                .businessName(saved.getBusinessName())
                .build();
    }

    public SignatureRequestResponse updateSignature(SignatureRequestResponse request, String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        user.setSignature(request.getSignature());
        User saved = userRepository.save(user);
        return SignatureRequestResponse.builder()
                .signature(saved.getSignature())
                .build();
    }

    public NotificationRequestResponse updateNotificationAccess(String email, NotificationRequestResponse request){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        user.setInvoiceViewed(request.getInvoiceViewed());
        user.setOverdueReminders(request.getOverdueReminders());
        user.setPaymentReceived(request.getPaymentReceived());

        User saved = userRepository.save(user);
        return NotificationRequestResponse.builder()
                .invoiceViewed(saved.getInvoiceViewed())
                .overdueReminders(saved.getOverdueReminders())
                .paymentReceived(saved.getPaymentReceived())
                .build();
    }

    public void updatePassword(String email, SecurityRequest request){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())){
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }




}
