package com.bit.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bit.dto.MypageDto;
import com.bit.dto.PlaylistDto;
import com.bit.dto.PliCommentDto;
import com.bit.dto.SongDto;
import com.bit.jwt.JwtTokenProvider;
import com.bit.mapper.BlacklistMapper;
import com.bit.mapper.FollowMapper;
import com.bit.mapper.MemberMapper;
import com.bit.mapper.PlaylistMapper;

import lombok.extern.slf4j.Slf4j;
import naver.cloud.NcpObjectStorageService;

@Service
@Slf4j
public class PlaylistService {
    @Autowired
    PlaylistMapper pMapper;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    BlacklistMapper blacklistMapper;

    @Autowired
    MemberMapper memberMapper;

    @Autowired
    FollowMapper followMapper;

    @Autowired
    ImgUploadService imgUploadService;

    @Autowired
    NcpObjectStorageService ncpObjectStorageService;

    public final String BUCKET_NAME = "wepli";

    public PlaylistDto selectPlaylist(int idx) {
        return pMapper.selectPlaylist(idx);
    }

    // 플리 검색
    public List<PlaylistDto> selectPublicPlaylist(String token, String queryString, String type, boolean orderByDay){
        String typeString[] = {"title","nick","genre","tag",null};

        Map<String,Object> data = new HashMap<>();
        data.put("orderByDay",orderByDay);

        Map<String, List<String>> searchAndBlack = new HashMap<>();

        if(token != null && !token.equals("")) {
            String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
            List<String> blackTarget = blacklistMapper.selectBlackTarget(nick);
            if(blackTarget != null && blackTarget.size() > 0) {
                searchAndBlack.put("black", blackTarget);
            }
        }   
        if(queryString != null && !queryString.equals("") && !queryString.replaceAll(",", "").equals("")) {
            List<String> queryStrings = Arrays.stream(queryString.split(","))
                    .map(String::trim)
                    .filter(str -> !str.isEmpty())
                    .collect(Collectors.toList());
            searchAndBlack.put("list", queryStrings);
        }

        return pMapper.selectPublicPlaylist(searchAndBlack, data, typeString[(type==null ? 4 :Integer.parseInt(type))]);

    }

    // 플레이 리스트 메인 데이터 top and 좋아요 누른 플리
    public Map<String, Object> pliMainData(String token) {
        Map<String, Object> data = new HashMap<>();
        String nick = null;
        List<PlaylistDto> likeTopPli = pMapper.selectLikeTopPli();
        List<Map<String, Object>> followTop = followMapper.selectFollowTop();
        if(token != null && !token.equals("")) {
            nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
            List<PlaylistDto> pliLike = pMapper.selectLikePli(nick);
            data.put("likePli", pliLike);
        }

        data.put("likeTopPli", likeTopPli);
        data.put("followTop", followTop);

        
        return data;
    }


    // 좋아요 누른 플레이리스트 가져오기
    public List<PlaylistDto> selectLikePli(String token){
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        return pMapper.selectLikePli(nick);
    }

    // idx로 플레이리스트 가져오기
    public PlaylistDto selectMyPliToIdx(int idx) {
        return pMapper.selectMyPliToIdx(idx);
    }

    // 팔로우한 사람의 플레이리스트 가져오기
    public List<PlaylistDto> selectFollowPli(String token) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        return pMapper.selectFollowPli(nick);
    }

    // 내플레이리스트 or 타인의 공개된 플레이리스트 가져오기
    public List<PlaylistDto> selectPli(String token, String userNick) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        // log.info("userNick -> {}", userNick);
        if(userNick == null) {
            return pMapper.selectMyPli(nick);
        } else {
            nick = userNick;
            return pMapper.selectUserFromPublicPli(nick);
        }
    }

    // 플레이리스트 디테일
    public Map<String, Object> getDetailPlayList(int idx){

        List<SongDto> song = pMapper.selectSongsAll(idx);

        Map<String,Object> cdata = new HashMap<>();
        cdata.put("playlistID",idx);

        List<PliCommentDto> comment = pMapper.selectPliComments(cdata);
        PlaylistDto play = pMapper.selectMyPliToIdx(idx);

        // 플리 작성자 닉네임
        String nick = play.getNick();
        MypageDto mypageDto = memberMapper.selectMypageDto(nick);
    
        Map<String,Object> data = new HashMap<>();
        data.put("song", song);
        data.put("comment", comment);
        data.put("play", play);
        data.put("playUserImg", mypageDto.getImg());
    
        return data;
    }


    // 미인증회원 검증절차
    public boolean uncertifiMemberChk(String nick) {
        MypageDto mDto = memberMapper.selectMypageDto(nick);
        // log.info("uncertifiMemberChk member -> {}", mDto);
        boolean authChk = mDto.getEmailconfirm() + mDto.getPhoneconfirm() > 0 ?
            true : false;
        // log.info("uncertifiMemberChk -> {}", authChk);
        return authChk;
        
    }

    public boolean insertPlaylist(String token, PlaylistDto data, HttpServletResponse response){
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        data.setNick(nick);

        String genres[] = data.getGenre().split(",");
        String tags[] = data.getTag().split(",");
        
        if (genres.length > 4 || tags.length > 4) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return false;
        }

        for (String tag : tags) {
            if (tag.length() > 10) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return false;
            }
        }
        for (String genre : genres) {
            if (genre.length() > 10) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return false;
            }
        }

        if(data.getDesc().length()>50){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return false;
        }
        if(uncertifiMemberChk(data.getNick())) {

            if(data.getImg() != null && !data.getImg().equals("")) {
                imgUploadService.storageImgDelete(token, data.getImg(), "playlist");
            }
            return pMapper.insertPlaylist(data)>0;
        } else {
            if(data.getIsPublic() == 0) {
                if(data.getImg() != null && !data.getImg().equals("")) {
                    imgUploadService.storageImgDelete(token, data.getImg(), "playlist");
                }
                return pMapper.insertPlaylist(data)>0;
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return false;
            }
        }
    }

    public boolean updatePlaylist(String token, PlaylistDto data, HttpServletResponse response){
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        data.setNick(nick);
        String genres[] = data.getGenre().split(",");
        String tags[] = data.getTag().split(",");
        
        if(pMapper.selectMyPliToIdx(data.getIdx()).getNick().equals(nick)) {

            if (genres.length > 4 || tags.length > 4) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return false;
            }

            for (String tag : tags) {
                if (tag.length() > 10) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    return false;
                }
            }
            for (String genre : genres) {
                if (genre.length() > 10) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    return false;
                }
            }

            if(data.getDesc().length()>50){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return false;
            }
            if(uncertifiMemberChk(data.getNick())) {
                if(data.getImg() != null && !data.getImg().equals("")) {
                    imgUploadService.storageImgDelete(token, data.getImg(), "playlist");
                    String img = pMapper.selectMyPliToIdx(data.getIdx()).getImg();
                    if(img != null && !img.equals("")) {
                        ncpObjectStorageService.deleteFile(BUCKET_NAME, "playlist", img);
                    }
                }
                return pMapper.updatePlaylist(data)>0;
            } else {
                if(data.getIsPublic() == 0) {
                    if(data.getImg() != null && !data.getImg().equals("")) {
                        imgUploadService.storageImgDelete(token, data.getImg(), "playlist");
                        String img = pMapper.selectMyPliToIdx(data.getIdx()).getImg();
                        if(img != null && !img.equals("")) {
                            ncpObjectStorageService.deleteFile(BUCKET_NAME, "playlist", img);
                        }
                    }
                    return pMapper.updatePlaylist(data)>0;
                } else {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    return false;
                }
            }
        } else {
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            return false;
        }

    }

    public List<Object> togglePlaylist(String token, int playlistID){
        List<Object> result = new ArrayList<>();
        // log.info("togglePlaylist -> {}",playlistID);
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        try {
            Map<String,Object> data = new HashMap<>();
            data.put("nick", nick);
            data.put("playlistID", playlistID);
            boolean isLike = pMapper.selectLike(data) > 0;

            boolean processResult;

            // log.info("togglePlaylist -> {}", isLike);
            if(isLike){
                // log.info("togglePlaylist -> {}", isLike);
                pMapper.deleteLike(data);
                processResult = false;
            }else{
                // log.info("togglePlaylist -> {}", isLike);
                pMapper.insertLike(data);
                processResult = true;
            }
            result.add(processResult);
            result.add(pMapper.selectPlaylist(playlistID).getLikescount());

            return result;
        } catch (Exception e) {
            // log.info(e.getMessage());
            result.add(false);
            return result;
        }
    }

    public boolean deletePlaylist(String token, int idx){
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        PlaylistDto pDto = pMapper.selectPlaylist(idx);
        
        if(nick.equals(pDto.getNick())) {
            if(pDto.getImg() != null && !pDto.getImg().equals("")) {
                ncpObjectStorageService.deleteFile(BUCKET_NAME, "playlist", pDto.getImg());
            }
            return pMapper.deletePlaylist(idx)>0;
        } else {
            throw new RuntimeException("소유주가 아님");
        }        
    }

    public boolean insertSong(String token, SongDto data, HttpServletResponse response){
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        
        String gStr = (data.getGenre()!=null)? data.getGenre() : "";
        String tStr = (data.getTag()!=null)? data.getTag() : "";

        String genres[] = gStr.split(",");
        String tags[] = tStr.split(",");

        if(pMapper.selectMyPliToIdx(data.getPlaylistID()).getNick().equals(nick)) {
            if(data.getImg() != null && !data.getImg().equals("")) {
                imgUploadService.storageImgDelete(token, data.getImg(), "songimg");
            }

            if (genres.length > 4 || tags.length > 4 ) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

                for (String tag : tags) {
                    if (tag.length() > 10) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        return false;
                    }
                }

                for (String genre : genres) {
                    if (genre.length() > 10) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        return false;
                    }
                }

                return false;
            }
            return pMapper.insertSong(data)>0;
        } else {
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            return false;
        }   
    }

    public SongDto selectSong(int idx){
        return pMapper.selectSong(idx);
    }

    public List<SongDto> selectSongsAll(int playlistID){
        return pMapper.selectSongsAll(playlistID);
    }

    public boolean updateSong(String token, SongDto data, HttpServletResponse response){
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        SongDto sDto = pMapper.selectSong(data.getIdx());
        if(pMapper.selectMyPliToIdx(sDto.getPlaylistID()).getNick().equals(nick)) {
            if(data.getImg() != null && !data.getImg().equals("")) {
                imgUploadService.storageImgDelete(token, data.getImg(), "songimg");
                if(sDto.getImg() != null && !sDto.getImg().equals("")) {
                    ncpObjectStorageService.deleteFile(BUCKET_NAME, "songimg", sDto.getImg());
                }
            }
            return pMapper.updateSong(data) > 0;
        } else {
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            return false;
        }
    }

    public boolean deleteSong(String token, int idx, HttpServletResponse response){
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        SongDto sDto = pMapper.selectSong(idx);
        if(pMapper.selectMyPliToIdx(sDto.getPlaylistID()).getNick().equals(nick)) {
            if(sDto.getImg() != null && sDto.getImg().equals("")) {
                ncpObjectStorageService.deleteFile(BUCKET_NAME, "songimg", sDto.getImg());
            }
            return pMapper.deleteSong(idx) > 0;
        } else {
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            return false;
        }
    }

    public List<PliCommentDto> selectPliComments(int playlistID, int curr, int cpp){
        Map<String,Object> data = new HashMap<>();
        data.put("playlistID",playlistID);
        data.put("curr",(curr-1)*cpp);
        data.put("cpp",cpp);
        return pMapper.selectPliComments(data);
    }

    public boolean insertPliComment(String token, PliCommentDto data, HttpServletResponse response){
        String writer = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        boolean checkCommnetLength = Pattern.matches("^.{1,100}$", data.getContent());

        if(!checkCommnetLength) {
            // log.info("실패");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return false;
        }
        data.setWriter(writer);
        return pMapper.insertPliComment(data)>0;
    }
    public boolean updatePliComment(String token, PliCommentDto data, HttpServletResponse response){
        String writer = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        
        boolean checkCommnetLength = Pattern.matches("^.{1,100}$", data.getContent());
        if(pMapper.selectPliCommentToIdx(data.getIdx()).getWriter().equals(writer)) {
            if(!checkCommnetLength) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return false;
            } else {
                return pMapper.updatePliComment(data)>0;
            }
        
        } else {
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            return false;
        }
    }
    public boolean deletePliComment(String token, PliCommentDto data, HttpServletResponse response){
        String writer = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        String pliOwnerNick = pMapper.selectMyPliToIdx(data.getPlaylistID()).getNick();
        // log.info(writer);
        // log.info(pliOwnerNick);

        if(pMapper.selectPliCommentToIdx(data.getIdx()).getWriter().equals(writer) || writer.equals(pliOwnerNick)) {
            return pMapper.deletePliComment(data.getIdx()) > 0;
        } else {
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            return false;
        }
    }

    public boolean updateSongOrder(Map<String, Integer> data){
        int tempIdx = -1;
    
        int oldOrder = data.get("oldOrder");
        int newOrder = data.get("newOrder");
        int playlistID = data.get("playlistID");
    
        // oldIdx-> tempIdx
        Map<String,Integer> tempUpdate = new HashMap<>();
        tempUpdate.put("oldOrder", oldOrder);
        tempUpdate.put("newOrder", tempIdx);
        tempUpdate.put("playlistID", playlistID); 
        pMapper.updateSongOrder(tempUpdate);
    
        // newIdx -> oldIdx
        Map<String,Integer> newUpdate = new HashMap<>();
        newUpdate.put("oldOrder", newOrder);
        newUpdate.put("newOrder", oldOrder);
        newUpdate.put("playlistID", playlistID); 
        pMapper.updateSongOrder(newUpdate);
    
        // tempIdx -> newIdx로 변경합니다.
        Map<String,Integer> finalUpdate = new HashMap<>();
        finalUpdate.put("oldOrder", tempIdx);
        finalUpdate.put("newOrder", newOrder);
        finalUpdate.put("playlistID", playlistID);
        pMapper.updateSongOrder(finalUpdate);
    
        return true;
    }

}
