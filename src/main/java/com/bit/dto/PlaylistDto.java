package com.bit.dto;

import lombok.Data;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class PlaylistDto {
    private int idx;
    private String title;
    private String desc;
    private String genre;
    private String tag;
    private String img;
    private int isPublic;
    private String nick;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp makeday;
    private int likescount;
    private int commentscount;
    private int songscount;
}