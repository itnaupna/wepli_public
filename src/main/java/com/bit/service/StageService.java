package com.bit.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bit.dto.BuiltStageDto;
import com.bit.dto.MemberDto;
import com.bit.dto.SocketDto;
import com.bit.dto.SocketDto.Types;
import com.bit.dto.SongDto;
import com.bit.dto.StageDto;
import com.bit.dto.StageHistoryDto;
import com.bit.dto.StageUserListDto;
import com.bit.jwt.JwtTokenProvider;
import com.bit.mapper.BlacklistMapper;
import com.bit.mapper.MemberMapper;
import com.bit.mapper.StageMapper;

import lombok.extern.slf4j.Slf4j;
import naver.cloud.NcpObjectStorageService;

@Service
@Slf4j
public class StageService {
    @Autowired
    StageMapper sMapper;
    @Autowired
    MemberMapper mMapper;
    @Autowired
    BlacklistMapper blacklistMapper;
    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    ImgUploadService imgUploadService;
    @Autowired
    NcpObjectStorageService ncpObjectStorageService;

    public final String BUCKET_NAME = "wepli";

    private final ConcurrentHashMap<String, BuiltStageDto> builtStages = new ConcurrentHashMap<>();

    public void addUserToQueue(String stageId, String nick, SongDto songDto) {
        builtStages.get(stageId).getQueueOrder().add(nick);
        builtStages.get(stageId).getUserQueue().put(nick, songDto);
    }

    public void removeUserToQueue(String stageId, String nick) {
        builtStages.get(stageId).getQueueOrder().remove(nick);
        builtStages.get(stageId).getUserQueue().remove(nick);
    }

    public void addVoteUp(String stageId, String nick) {
        if (builtStages.get(stageId).getVoteup().contains(nick)) {
            builtStages.get(stageId).getVoteup().remove(nick);
        } else {
            builtStages.get(stageId).getVoteup().add(nick);
        }
        builtStages.get(stageId).getVotedown().remove(nick);
    }

    public void clearVote(String stageId, String nick) {
        builtStages.get(stageId).getVotedown().remove(nick);
        builtStages.get(stageId).getVoteup().remove(nick);
    }

    public void addVoteDown(String stageId, String nick) {
        if (builtStages.get(stageId).getVotedown().contains(nick)) {
            builtStages.get(stageId).getVotedown().remove(nick);
        } else {
            builtStages.get(stageId).getVotedown().add(nick);
        }
        builtStages.get(stageId).getVoteup().remove(nick);
    }

    public Map<String, Integer> getVoteCount(String stageId) {
        Map<String, Integer> result = new HashMap<>();

        result.put("UP", builtStages.get(stageId).getVoteup().size());
        result.put("DOWN", builtStages.get(stageId).getVotedown().size());

        return result;
    }

    public long getSongPos(String stageId) {
        return Duration.between(builtStages.get(stageId).getStartTime(), LocalDateTime.now()).getSeconds();
    }

    public SongDto getPlayingSong(String stageId) {
        return builtStages.get(stageId).getSongInfo();
    }

    public List<Map<String,Object>> getHistory(String stageId){
        return sMapper.selectStageHistory(stageId);
    }

    public boolean saveHistory(String stageId) {
        try{
        // SocketDto m = new SocketDto();
        // m.setType(Types.HISTORY);
        // m.setStageId(stageId);
        SongDto song = builtStages.get(stageId).getSongInfo();
        if(song == null) return false;
        Map<String, Integer> votecount = getVoteCount(stageId);
        StageHistoryDto h = new StageHistoryDto();
        h.setNick(song.getPlayerNick());
        h.setStageaddress(stageId);
        h.setLikes(votecount.get("UP"));
        h.setDislikes(votecount.get("DOWN"));
        h.setSongaddress(song.getSongaddress());
        h.setTitle(song.getTitle());
        h.setSinger(song.getSinger());
        h.setSonglength(song.getSonglength());
        h.setImg(song.getImg());
        
        return sMapper.insertStageHistory(h) > 0;
        }
        catch(Exception ex){
            ex.printStackTrace();
            return false;
        }
    }

    public int getMaxSongLength(String stageId){
        return sMapper.selectStageOneByAddress(stageId).getMaxlength();
    }

    public SongDto setNextSong(String stageId) {
        try {
            synchronized (builtStages.get(stageId)) {

                // System.out.println("a1");
                SongDto result = null;

                builtStages.get(stageId).setVoteup(new HashSet<>());
                builtStages.get(stageId).setVotedown(new HashSet<>());

                if (builtStages.get(stageId).getQueueOrder().isEmpty()) {
                    // System.out.println("다음 대기열 없음 ㅅㄱ");
                    builtStages.get(stageId).setSongInfo(null);
                    builtStages.get(stageId).setStartTime(null);
                    return null;
                }

                String firstOrderUser = builtStages.get(stageId).getQueueOrder().get(0);
                // System.out.println("a2");

                if (firstOrderUser == null) {
                    // System.out.println("a3");
                    builtStages.get(stageId).setSongInfo(null);
                    builtStages.get(stageId).setStartTime(null);
                    return null;
                }
                result = builtStages.get(stageId).getUserQueue().get(firstOrderUser);
                // System.out.println("a4");
                if (result == null) {
                    // System.out.println("a5");
                    builtStages.get(stageId).setSongInfo(null);
                    builtStages.get(stageId).setStartTime(null);
                    return null;
                }

                // System.out.println("a6");
                result.setPlayerNick(firstOrderUser);

                builtStages.get(stageId).getUserQueue().put(firstOrderUser, null);
                builtStages.get(stageId).getQueueOrder().remove(0);
                builtStages.get(stageId).getQueueOrder().add(firstOrderUser);
                builtStages.get(stageId).setStartTime(LocalDateTime.now());
                builtStages.get(stageId).setSongInfo(result);

                // System.out.println("a7");
                return result;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public List<Map<String, SongDto>> getRoomQueueList(String stageId) {
        List<Map<String, SongDto>> result = new ArrayList<>();

        for (String nick : builtStages.get(stageId).getQueueOrder()) {
            Map<String, SongDto> data = new HashMap<>();
            data.put(nick, builtStages.get(stageId).getUserQueue().get(nick));
            result.add(data);
        }

        return result;
    }

    public boolean isPlaying(String stageId) {
        // System.out.println(builtStages.get(stageId));
        return builtStages.get(stageId).getStartTime() != null;
    }

    private final ScheduledExecutorService ses = Executors.newScheduledThreadPool(1);

    public void setVideoInStage(String stageId) {
        CompletableFuture.runAsync(() -> {
            builtStages.get(stageId).sNextSong();
            int delay = builtStages.get(stageId).gSongLength();

            builtStages.get(stageId).setSes(ses.schedule(() -> {
                setVideoInStage(stageId);
            }, delay, TimeUnit.SECONDS));
        });
    }

    public SongDto requestNextSong(String stageId) {
        return builtStages.get(stageId).sNextSong();
    }

    public void setSes(String stageId, ScheduledFuture<?> ses) {
        builtStages.get(stageId).setSes(ses);
    }

    public void cancelSes(String stageId) {
        builtStages.get(stageId).cancelSES();
    }

    public void changeUserSongInQueue(String stageId, String nick, SongDto songDto) {
        builtStages.get(stageId).getUserQueue().put(nick, songDto);
    }

    public void changeUserOrderInStage(String stageId, String nick) {
        builtStages.get(stageId).getQueueOrder().remove(nick);
        builtStages.get(stageId).getQueueOrder().add(0, nick);
    }

    public boolean isInQueueAlready(String stageId, String nick) {
        try {
            return builtStages.get(stageId).getQueueOrder().contains(nick);

        } catch (Exception e) {
            return false;
        }
    }

    public int getUserCount(String stageUrl) {
        return builtStages.getOrDefault(stageUrl, new BuiltStageDto()).getUsers().size();
    }

    public void addUserToStage(String stageUrl, String sessionId) {
        builtStages.compute(stageUrl, (k, v) -> {
            if (v == null) {
                v = new BuiltStageDto();
            }
            v.getUsers().put(sessionId, "");
            return v;
        });
        System.out.println("addusertostage");
    }

    public void subUserToStage(String stageUrl, String sessionId) {

        builtStages.compute(stageUrl, (k, v) -> {
            String nick = v.getUsers().get(sessionId);
            v.getUserQueue().remove(nick);
            v.getQueueOrder().remove(nick);
            v.getUsers().remove(sessionId);
            return v;
        });
    }

    public void setUserNickInStage(String stageUrl, String sessionId, String nick) {
        builtStages.get(stageUrl).getUsers().replace(sessionId, nick);
    }

    public String getUserNickInStage(String stageUrl, String sessionId) {
        return builtStages.getOrDefault(stageUrl, new BuiltStageDto()).getUsers().get(sessionId);
    }

    private List<String> _getMembersListInStage(String stageUrl) {
        return List.copyOf(builtStages.get(stageUrl).getUsers().values());
    }

    public List<StageUserListDto> getMembersListInStage(String stageUrl) {
        // System.out.println(_getMembersListInStage(stageUrl));
        return sMapper.selectStageUserList(_getMembersListInStage(stageUrl));
    }

    public boolean insertStage(StageDto sDto, String token) {

        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        sDto.setNick(nick);

        // Stage 영문+숫자
        boolean checkAddress = Pattern.matches("^[0-9a-zA-Z]*$", sDto.getAddress());
        if (!checkAddress)
            return false;

        if (sDto.getDesc().length() > 50)
            return false;

        if (sDto.getImg() != null && !sDto.getImg().equals("")) {
            imgUploadService.storageImgDelete(token, sDto.getImg(), "stage");
        }
        return sMapper.insertStage(sDto) > 0;
    }

    public List<StageDto> selectStageAll(String token, int curr, int cpp) {
        String nick = "";
        if (token != null)
            nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        Map<String, Object> data = new HashMap<>();
        // System.out.println(nick);
        data.put("nick", nick);
        data.put("curr", (curr - 1) * cpp);
        data.put("cpp", cpp);

        List<StageDto> result = sMapper.selectStageAll(data);

        for (StageDto stage : result) {
            stage.setInfo(builtStages.getOrDefault(stage.getAddress(), new BuiltStageDto()));
        }

        return result;
    }

    public List<StageDto> selectStageFollow(String token) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        return sMapper.selectFollowStage(nick);
    }

    public StageDto selectStageOneByAddress(String address) {
        StageDto result = sMapper.selectStageOneByAddress(address);
        result.setInfo(builtStages.getOrDefault(result.getAddress(), new BuiltStageDto()));
        return result;
    }

    public StageDto selectStageOneByMasterNick(String token) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        return sMapper.selectStageOneByMasterNick(nick);
    }

    public boolean updateStage(StageDto sDto, String token) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        sDto.setNick(nick);
        if (sDto.getImg() != null && !sDto.getImg().equals("")) {
            imgUploadService.storageImgDelete(token, sDto.getImg(), "stage");
            String img = sMapper.selectStageOneByMasterNick(nick).getImg();
            if (img != null && !img.equals("")) {
                ncpObjectStorageService.deleteFile(BUCKET_NAME, "stage", img);
            }
        }
        return sMapper.updateStage(sDto) > 0;
    }

    public boolean deleteStage(String token, String pw, String title) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));

        MemberDto mDto = new MemberDto();
        mDto.setNick(nick);
        mDto.setPw(pw);

        Map<String, String> data = new HashMap<>();
        data.put("nick", nick);
        data.put("title", title);

        if (mMapper.selectCheckPasswordByNick(mDto) < 1 || sMapper.selectCheckStageTitle(data) < 1)
            return false;

        String img = sMapper.selectStageOneByMasterNick(nick).getImg();

        if (img != null && !img.equals("")) {
            ncpObjectStorageService.deleteFile(BUCKET_NAME, "stage", img);
        }

        return sMapper.deleteStage(nick) > 0;
    }

    public boolean selectCheckStagePw(String token, String pw) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        Map<String, String> data = new HashMap<>();
        data.put("nick", nick);
        data.put("pw", pw);
        return sMapper.selectCheckStagePw(data) > 0;
    }

    // 스테이지 검색(통합)
    public List<StageDto> selectSearchStage(String token, String queryString, String type, boolean orderByDay, int curr,
            int cpp) {
        String typeString[] = { "title", "nick", "genre", "tag", null };

        Map<String, Object> data = new HashMap<>();
        data.put("orderByDay", orderByDay);
        data.put("curr", (curr - 1) * cpp);
        data.put("cpp", cpp);
        Map<String, List<String>> searchAndBlack = new HashMap<>();

        if (token != null && !token.equals("")) {
            String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
            List<String> blackTarget = blacklistMapper.selectBlackTarget(nick);
            if (blackTarget != null && blackTarget.size() > 0) {
                searchAndBlack.put("black", blackTarget);
            }
        }
        if (queryString != null && !queryString.equals("")) {
            List<String> queryStrings = Arrays.stream(queryString.split(","))
                    .map(String::trim)
                    .filter(str -> !str.isEmpty())
                    .collect(Collectors.toList());
            searchAndBlack.put("list", queryStrings);
        }
        List<StageDto> result = sMapper.selectSearchStage(searchAndBlack, data, typeString[(type == null ? 4 : Integer.parseInt(type))]);

        for (StageDto stage : result) {
            stage.setInfo(builtStages.getOrDefault(stage.getAddress(), new BuiltStageDto()));
        }

        return result;

    }

    public boolean insertStageHistory(StageHistoryDto shDto) {
        return sMapper.insertStageHistory(shDto) > 0;
    }

    public List<Map<String, Object>> selectStageHistory(String stageaddress) {
        return sMapper.selectStageHistory(stageaddress);
    }

    public boolean selectCheckAddress(String address) {
        return sMapper.selectCheckAddress(address) > 0;
    }

    // public List<StageDto> SearchStages(int type, String queryString, String
    // token) {
    // switch (type) {
    // case 0:
    // return selectSearchByTitle(queryString, token);
    // case 1:
    // return selectSearchByNick(queryString, token);
    // case 2:
    // return selectSearchByGenre(queryString, token);
    // case 3:
    // return selectSearchByTag(queryString, token);
    // default:
    // return null;
    // }
    // }

    // public List<StageDto> selectSearchByTitle(String queryString, String token) {
    // Map<String, List<String>> searchAndBlack = new HashMap<>();

    // if (token != null && !token.equals("")) {
    // String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
    // List<String> blackTarget = blacklistMapper.selectBlackTarget(nick);
    // searchAndBlack.put("black", blackTarget);
    // }
    // List<String> queryStrings = Arrays.stream(queryString.split(","))
    // .map(String::trim)
    // .filter(str -> !str.isEmpty())
    // .collect(Collectors.toList());
    // searchAndBlack.put("list", queryStrings);
    // return sMapper.selectSearchByTitle(searchAndBlack);
    // }

    // public List<StageDto> selectSearchByNick(String queryString, String token) {
    // Map<String, List<String>> searchAndBlack = new HashMap<>();

    // if (token != null && !token.equals("")) {
    // String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
    // List<String> blackTarget = blacklistMapper.selectBlackTarget(nick);
    // searchAndBlack.put("black", blackTarget);
    // }
    // List<String> queryStrings = Arrays.stream(queryString.split(","))
    // .map(String::trim)
    // .filter(str -> !str.isEmpty())
    // .collect(Collectors.toList());
    // searchAndBlack.put("list", queryStrings);
    // return sMapper.selectSearchByNick(searchAndBlack);
    // }

    // public List<StageDto> selectSearchByGenre(String queryString, String token) {
    // Map<String, List<String>> searchAndBlack = new HashMap<>();

    // if (token != null && !token.equals("")) {
    // String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
    // List<String> blackTarget = blacklistMapper.selectBlackTarget(nick);
    // searchAndBlack.put("black", blackTarget);
    // }
    // List<String> queryStrings = Arrays.stream(queryString.split(","))
    // .map(String::trim)
    // .filter(str -> !str.isEmpty())
    // .collect(Collectors.toList());
    // searchAndBlack.put("list", queryStrings);
    // return sMapper.selectSearchByGenre(searchAndBlack);
    // }

    // public List<StageDto> selectSearchByTag(String queryString, String token) {
    // Map<String, List<String>> searchAndBlack = new HashMap<>();

    // if (token != null && !token.equals("")) {
    // String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
    // List<String> blackTarget = blacklistMapper.selectBlackTarget(nick);
    // searchAndBlack.put("black", blackTarget);
    // }
    // List<String> queryStrings = Arrays.stream(queryString.split(","))
    // .map(String::trim)
    // .filter(str -> !str.isEmpty())
    // .collect(Collectors.toList());
    // searchAndBlack.put("list", queryStrings);
    // return sMapper.selectSearchByTag(searchAndBlack);
    // }
}
