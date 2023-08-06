package com.bit.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SmsResponseDto {
    String requestId;
    LocalDateTime requestTime;
    String statusCode;
    String statusName;
}