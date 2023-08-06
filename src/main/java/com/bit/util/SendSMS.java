package com.bit.util;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.bit.dto.SmsResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Builder;
import lombok.Data;
import naver.cloud.NaverConfig;

@Service
public class SendSMS {

    String accessKey;
    String secretKey;
    String smsSender;
    String smsKey;

    public SendSMS(NaverConfig n){
        accessKey = n.getAccessKey();
        secretKey = n.getSecretKey();
        smsSender = n.getSmsSender();
        smsKey = n.getSmsKey();
    }

    @Data
    private class MsgDto {
        String to;
    }

    @Data
    @Builder
    private static class SmsRequestDto {
        String type;
        String from;
        String content;
        List<MsgDto> messages;
    }


    // https://api.ncloud-docs.com/docs/common-ncpapi
    private String makeSignature(Long time)
            throws NoSuchAlgorithmException, UnsupportedEncodingException, InvalidKeyException {
        String space = " ";
        String newLine = "\n";
        String method = "POST";
        String url = "/sms/v2/services/" + smsKey + "/messages";
        String timestamp = time.toString();

        String message = new StringBuilder()
                .append(method)
                .append(space)
                .append(url)
                .append(newLine)
                .append(timestamp)
                .append(newLine)
                .append(accessKey)
                .toString();

        SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);

        byte[] rawHmac = mac.doFinal(message.getBytes("UTF-8"));
        String encodeBase64String = Base64.getEncoder().encodeToString(rawHmac);

        return encodeBase64String;
    }

    public SmsResponseDto Send(String phone, String code) throws JsonProcessingException, RestClientException,
            URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {
        Long time = System.currentTimeMillis();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-ncp-apigw-timestamp", time.toString());
        headers.set("x-ncp-iam-access-key",accessKey);
        headers.set("x-ncp-apigw-signature-v2", makeSignature(time));

        MsgDto msg = new MsgDto();
        msg.setTo(phone);

        List<MsgDto> messages = new ArrayList<>();
        messages.add(msg);

        SmsRequestDto request = SmsRequestDto.builder()
                .type("SMS")
                .from(smsSender)
                .content("위플리 인증번호는 [" + code + "]입니다.")
                .messages(messages)
                .build();

        ObjectMapper objectMapper = new ObjectMapper();
        String body = objectMapper.writeValueAsString(request);
        HttpEntity<String> httpBody = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        SmsResponseDto response = restTemplate.postForObject(
                new URI("https://sens.apigw.ntruss.com/sms/v2/services/" + smsKey + "/messages"), httpBody,
                SmsResponseDto.class);

        return response;
    }
}
