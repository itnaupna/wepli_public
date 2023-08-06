package com.bit.dto;

import lombok.Data;

@Data
public class SocketDto {
    
    public enum Types{
        ENTER,              //입장시
        EXIT,               //퇴장시
        SKIP,               //곡스킵
        VOTE,               //투표
        VOTE_UP,            //추천
        VOTE_DOWN,          //비추
        KICK,               //강퇴
        BAN,                //영구퇴장
        DELETE,             //삭제
        QUEUE_IN,           //큐 등록
        QUEUE_OUT,          //큐 탈퇴
        QUEUE_ORDER_CHANGE, //큐 순서 변경
        QUEUE_CHANGE_SONG,  //큐 등록된 노래 교체
        QUEUE_DATA,         //큐데이터
        CHAT,               //채팅
        PLAY,               //재생
        STOP,               //정지명령 ㄱ
        HISTORY,            //히스토리 정보
    }

    private Types type;
    private String sessionId;
    private String stageId;
    private String userNick;
    private String img;
    private Object msg;
}
