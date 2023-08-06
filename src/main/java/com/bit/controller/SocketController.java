package com.bit.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

import com.bit.dto.SocketDto;
import com.bit.service.SocketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SocketController {

    @Autowired
    SocketService socketService;

    @MessageMapping("/msg")
    public void msg( SocketDto msg) {
        socketService.SendMsg( msg);
    }
}
