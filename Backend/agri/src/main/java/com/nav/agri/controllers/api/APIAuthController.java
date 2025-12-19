package com.nav.agri.controllers.api;

import com.nav.agri.dto.AuthRequest;
import com.nav.agri.dto.AuthResponse;
import com.nav.agri.dto.RegisterRequest;
import com.nav.agri.models.User;
import com.nav.agri.service.JwtTokenService;
import com.nav.agri.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/api/auth")
public class APIAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final UserService userService;

    public APIAuthController(AuthenticationManager authenticationManager,
                             JwtTokenService jwtTokenService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        String token = jwtTokenService.generateToken(authentication);
        Long expiresAt = jwtTokenService.extractExpirationTime(token);

        User user = userService.getUserByUsername(authentication.getName());

        // ADD THIS
        System.out.println("🔍 User object: " + user);
        System.out.println("🔍 User ID: " + user.getId());
        System.out.println("🔍 User username: " + user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getId(), expiresAt);
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        userService.registerUser(request.username(), request.password());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        String token = jwtTokenService.generateToken(authentication);
        Long expiresAt = jwtTokenService.extractExpirationTime(token);

        User user = userService.getUserByUsername(request.username());

        return new AuthResponse(token, user.getUsername(), user.getId(), expiresAt);
    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam String token) {
        try {
            jwtTokenService.extractUsername(token);
            return "Token is valid";
        } catch (Exception e) {
            return "Invalid or expired token";
        }
    }
}
