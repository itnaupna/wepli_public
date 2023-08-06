package com.bit.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ScheduledFuture;

import lombok.Data;

@Data
public class BuiltStageDto {
    private SongDto songInfo;
    private LocalDateTime startTime = null;
    private Set<String> voteup= new HashSet<>();
    private Set<String> votedown = new HashSet<>();
    private Map<String, String> Users = new HashMap<>();
    private List<String> QueueOrder = new ArrayList<>();
    private Map<String, SongDto> UserQueue = new HashMap<>();
    private ScheduledFuture<?> ses;

    public void cancelSES() {
        if (ses != null){
            System.out.println("캔슬됨");
            ses.cancel(true);
        }
    }

    public String gFirstOrderUser() {
        return QueueOrder.get(0);
    }

    private SongDto gUserSong(String nick) {
        return UserQueue.get(nick);
    }

    public int gSongLength(){
        return songInfo.getSonglength();
    }

    public SongDto sNextSong() {
        String firstOrderUser = gFirstOrderUser();
        if (firstOrderUser == null) {
            startTime = null;
            songInfo = null;
            return null;
        }

        SongDto userSong = gUserSong(firstOrderUser);

        if (userSong != null) {
            startTime = LocalDateTime.now();
            songInfo = userSong;
            songInfo.setPlayerNick(firstOrderUser);
            UserQueue.put(firstOrderUser, null);
            QueueOrder.remove(0);
            QueueOrder.add(firstOrderUser);
            return userSong;
        }
        return null;
    }
}