package com.cwebworks.invoiceapp.controller;

import com.cwebworks.invoiceapp.dto.*;
import com.cwebworks.invoiceapp.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PatchMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @RequestBody ProfileRequest profileRequest,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(
                profileService.updateProfile(profileRequest, email)
        );
    }

    @GetMapping
    public ResponseEntity<ProfileSettingResponse> getUserProfile(Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getUserProfile(email));
    }

    @PatchMapping("/signature")
    public ResponseEntity<SignatureRequestResponse> updateSignature(Authentication authentication, @RequestBody SignatureRequestResponse request){
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.updateSignature(request, email));
    }

    @PatchMapping("/notifications")
    public ResponseEntity<NotificationRequestResponse> updateNotificationAccess(Authentication authentication, @RequestBody NotificationRequestResponse request){
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.updateNotificationAccess(email,request));
    }

    @PatchMapping("/password")
    public ResponseEntity<?> updateUserPassword(Authentication authentication, @Valid @RequestBody SecurityRequest request){
        String email = authentication.getName();
        profileService.updatePassword(email, request);
        return ResponseEntity.ok().build();
    }

}
