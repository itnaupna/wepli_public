package com.bit.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import com.bit.dto.SocketDto;
import com.bit.dto.SongDto;
import com.bit.dto.StageHistoryDto;
import com.bit.dto.SocketDto.Types;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SocketService {

    @Autowired
    StageService stageService;
    @Autowired
    MemberService memberService;

    private final String prefix = "/sub/stage/";
    private final SimpMessageSendingOperations sendingOperations;
    private final ScheduledExecutorService ses = Executors.newScheduledThreadPool(1);
    private final Map<String, String> userPosition;

    private void logging(StompHeaderAccessor headers) {
        System.out.println(headers);
        System.out.println("getCommand : " + headers.getCommand());
        System.out.println("getDestination : " + headers.getDestination());
        System.out.println("getSessionId : " + headers.getSessionId());
        System.out.println("getTimestamp : " + headers.getTimestamp());
        System.out.println("=".repeat(100));
    }

    @EventListener
    public void onTryConnect(SessionConnectEvent e) {
        System.out.println("연결이 들어와요");
    }

    @EventListener
    public void onConnect(SessionConnectedEvent e) {
        // StompHeaderAccessor headers = StompHeaderAccessor.wrap(e.getMessage());
        System.out.println("연결이 이루어졌어요");
        // logging(headers);
    }

    private void eong(StompHeaderAccessor headers) {
        try {
            // logging(headers);
            System.out.println("위치: " + userPosition);
            String stageId = userPosition.get(headers.getSessionId());
            userPosition.remove(headers.getSessionId());
            String userNick = stageService.getUserNickInStage(stageId, headers.getSessionId());
            stageService.subUserToStage(stageId, headers.getSessionId());
            SocketDto msg = new SocketDto();
            msg.setType(Types.EXIT);
            msg.setSessionId(headers.getSessionId());
            msg.setUserNick(userNick);
            msg.setStageId(stageId);
            SongDto s = stageService.getPlayingSong(stageId);
            if (s != null) {
                System.out.println(s.toString());
                if (userNick.equals(s.getPlayerNick())) {
                    System.out.println("현재곡 제거");
                    stageService.removeUserToQueue(stageId, userNick);
                    stageService.cancelSes(stageId);
                    RequestPlay(stageId);
                }
            }
            // System.out.println(msg);
            SendMsg(msg);
        } catch (Exception ex) {
        }

    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent e) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(e.getMessage());
        eong(headers);
        System.out.println("연결이 끊겨버렸어요");
        // logging(headers);
    }

    @EventListener
    public void onSubscribe(SessionSubscribeEvent e) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(e.getMessage());
        String stageId = headers.getDestination().split(prefix)[1];
        userPosition.put(headers.getSessionId(), stageId);
        stageService.addUserToStage(stageId, headers.getSessionId());
        System.out.println("구독해요");
        // logging(headers);
    }

    @EventListener
    public void onUnSubscribe(SessionUnsubscribeEvent e) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(e.getMessage());
        eong(headers);
        System.out.println("구취해요");
        // logging(headers);
    }

    private SongDto msgToSongDto(Object msg) {
        LinkedHashMap msgObj = (LinkedHashMap) msg;
        SongDto songDto = new SongDto();
        songDto.setIdx((Integer) msgObj.get("idx"));
        songDto.setPlaylistID((Integer) msgObj.get("playlistID"));
        songDto.setTitle((String) msgObj.get("title"));
        songDto.setImg((String) msgObj.get("img"));
        songDto.setSonglength((Integer) msgObj.get("songlength"));
        songDto.setGenre((String) msgObj.get("genre"));
        songDto.setTag((String) msgObj.get("tag"));
        songDto.setSinger((String) msgObj.get("singer"));
        songDto.setSongaddress((String) msgObj.get("songaddress"));
        songDto.setSongorigin((String) msgObj.get("songorigin"));
        return songDto;
    }

    private void RequestPlay(String stageId) {

        CompletableFuture.runAsync(() -> {
            // 재생했던 곡을 저장한다.
            if (stageService.saveHistory(stageId)) {
                // 재생했던 곡이 있어서 저장했으면 최신 히스토리 정보를 보내준다.
                SocketDto m = new SocketDto();
                m.setType(Types.HISTORY);
                m.setMsg(stageService.getHistory(stageId).size());
                m.setStageId(stageId);
                SendMsg(m);
            }

            // System.out.println("다음곡 재생 시작");
            SongDto song = stageService.setNextSong(stageId);
            // System.out.println("다음곡 정보 : " + song.toString());
            if (song == null) {
                // System.out.println("다음 대기곡이 없습니다.");
                SocketDto msg = new SocketDto();
                msg.setType(Types.STOP);
                msg.setStageId(stageId);
                SendMsg(msg);
                return;
            }
            SocketDto msg = new SocketDto();
            msg.setType(Types.PLAY);
            msg.setStageId(stageId);
            msg.setUserNick(song.getPlayerNick());
            msg.setMsg(song);
            SendMsg(msg);
            int maxLength = stageService.getMaxSongLength(stageId);
            int length = 0;
            if(maxLength == 0)
                length = song.getSonglength();
            else{
                if(song.getSonglength() > maxLength){
                    length = maxLength;
                }else{
                    length = song.getSonglength();
                }
            }
            // System.out.println(song.getSonglength() + "초후 다음곡 재생");
            stageService.setSes(stageId, ses.schedule(() -> {
                RequestPlay(stageId);
            }, length, TimeUnit.SECONDS));
        });

    }

    public void SendMsg(SocketDto msg) {
        System.out.println(msg);
        Map<String, Object> data = new HashMap<>();
        switch (msg.getType()) {
            case ENTER:
                if (msg.getUserNick() != null) {
                    stageService.setUserNickInStage(msg.getStageId(), msg.getSessionId(), msg.getUserNick());
                }

                List<Map<String, Object>> hd = stageService.getHistory(msg.getStageId());
                if (hd.size() > 0) {
                    SocketDto ms = new SocketDto();
                    ms.setType(Types.HISTORY);
                    ms.setMsg(hd.size());
                    ms.setStageId(msg.getStageId());
                    SendMsg(ms);
                }
                data.put("count", stageService.getUserCount(msg.getStageId()));
                data.put("memberlist", stageService.getMembersListInStage(msg.getStageId()));
                msg.setMsg(data);
                if (stageService.isPlaying(msg.getStageId())) {
                    // 방에 입장했을때 재생중인 곡이 있다면 정보를 보내준다.
                    SocketDto m = new SocketDto();
                    SongDto songdata = stageService.getPlayingSong(msg.getStageId());
                    long pos = stageService.getSongPos(msg.getStageId());
                    songdata.setStartPosition(pos);
                    songdata.setTarget(msg.getSessionId());
                    m.setType(Types.PLAY);
                    m.setUserNick(msg.getSessionId());
                    m.setMsg(songdata);
                    m.setStageId(msg.getStageId());
                    SendMsg(m);
                }
                break;
            case EXIT:

                data.put("count", stageService.getUserCount(msg.getStageId()));
                data.put("memberlist", stageService.getMembersListInStage(msg.getStageId()));
                msg.setMsg(data);
                break;
            case SKIP:
                stageService.cancelSes(msg.getStageId());
                RequestPlay(msg.getStageId());
                break;
            case VOTE:
                switch (msg.getMsg().toString()) {
                    case "UP":
                        stageService.addVoteUp(msg.getStageId(), msg.getUserNick());
                        break;
                    case "DOWN":
                        stageService.addVoteDown(msg.getStageId(), msg.getUserNick());
                        break;
                    case "CLEAR":
                        stageService.clearVote(msg.getStageId(), msg.getUserNick());
                        break;
                }
                msg.setUserNick(null);
                msg.setMsg(stageService.getVoteCount(msg.getStageId()));
                break;
            case VOTE_UP:
                return;
            case VOTE_DOWN:
                return;
            case KICK:

                break;
            case BAN:
                break;
            case DELETE:
                break;
            case QUEUE_IN:
                break;
            case QUEUE_OUT:
                String nick = msg.getMsg() == null ? msg.getUserNick() : msg.getMsg().toString();
                stageService.removeUserToQueue(msg.getStageId(), nick);

                msg.setType(Types.QUEUE_OUT);
                msg.setUserNick(nick);
                msg.setMsg(stageService.getRoomQueueList(msg.getStageId()));
                break;
            case QUEUE_ORDER_CHANGE:
                // 유저들의 재생 순사가 변경되었을때
                // System.out.println(msg);
                // // stageService.changeUserOrderInStage(msg.getStageId(), msg.getUserNick());
                // // msg.setType(Types.QUEUE_DATA);
                // // msg.setMsg(stageService.getRoomQueueList(msg.getStageId()));
                break;
            case QUEUE_CHANGE_SONG:
                // 특정 유저의 곡 순서가 변경되었을때
                boolean check = stageService.isInQueueAlready(msg.getStageId(), msg.getUserNick());
                if (check) {
                    stageService.changeUserSongInQueue(msg.getStageId(), msg.getUserNick(), msgToSongDto(msg.getMsg()));
                    msg.setType(Types.QUEUE_DATA);
                } else {
                    stageService.addUserToQueue(msg.getStageId(), msg.getUserNick(), msgToSongDto(msg.getMsg()));
                    msg.setType(Types.QUEUE_IN);
                }
                msg.setMsg(stageService.getRoomQueueList(msg.getStageId()));
                if (!stageService.isPlaying(msg.getStageId())) {
                    // 큐 변경이 있을때 재생중인 곡이 없으면 곡을 재생하도록 한다.
                    RequestPlay(msg.getStageId());
                }
                break;
            case CHAT:
                msg.setImg(memberService.getUserImg(msg.getUserNick()));
                break;
            case PLAY:
                // stageService.setVideoInStage(msg.getStageId());
                // System.out.println("재생정보 보냄");
                break;
            case QUEUE_DATA:
                break;
            default:
                break;
        }

        sendingOperations.convertAndSend("/sub/stage/" + msg.getStageId(), msg);
    }
}
