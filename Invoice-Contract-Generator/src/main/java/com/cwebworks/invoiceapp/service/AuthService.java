package com.cwebworks.invoiceapp.service;

import com.cwebworks.invoiceapp.constants.Plan;
import com.cwebworks.invoiceapp.customexception.EmailAlreadyExistsException;
import com.cwebworks.invoiceapp.dto.LoginRequest;
import com.cwebworks.invoiceapp.dto.LoginResponse;
import com.cwebworks.invoiceapp.dto.RegisterRequest;
import com.cwebworks.invoiceapp.dto.RegisterResponse;
import com.cwebworks.invoiceapp.entity.User;
import com.cwebworks.invoiceapp.repository.UserRepository;
import com.cwebworks.invoiceapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;


    public RegisterResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("Email already registered: "+request.getEmail());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPlan(Plan.FREE);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        RegisterResponse response = new RegisterResponse();
        response.setId(savedUser.getId());
        response.setEmail(savedUser.getEmail());
        response.setPlan(savedUser.getPlan());

        return response;
    }

    public LoginResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = jwtUtil.generateToken(request.getEmail());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setEmail(request.getEmail());

        return response;
    }
}
