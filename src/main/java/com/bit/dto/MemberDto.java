package com.bit.dto;

import lombok.Data;

@Data
public class MemberDto {
    private String email;
    private String pw;
    private String nick;
    private String phone;
    private int emailconfirm;
    private int phoneconfirm;
    private String img;
    private String desc;
    private String socialtype;
    private int email_code;
}
