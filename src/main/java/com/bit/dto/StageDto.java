package com.bit.dto;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class StageDto {
    private String address;
    private String title;
    private String desc;
    private String genre;
    private String tag;
    private String nick;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp makeday;
    private String img;
    private String pw;
    private int maxlength;
    private int skipratio;
    private BuiltStageDto info;
}
