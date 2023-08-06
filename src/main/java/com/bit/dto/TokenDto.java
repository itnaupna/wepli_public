package com.bit.dto;

import lombok.Data;

@Data
public class TokenDto {
    private String nick;
    private String refreshToken;
    private String accessToken;
}
