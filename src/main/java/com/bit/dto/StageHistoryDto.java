package com.bit.dto;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class StageHistoryDto {
    private int idx;
    private String nick;
    private String stageaddress;
    private int likes;
    private int dislikes;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private Timestamp playdate;
    private String songaddress;
    private String title;
    private String singer;
    private int songlength;
    private String img;
}
