package com.nav.agri.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthResponse(
        String token,
        String username,
        @JsonProperty("userId")  // ← Force this field to be included
        Integer userId,
        @JsonProperty("expiresAt")  // ← Also add this for consistency
        Long expiresAt
) {}