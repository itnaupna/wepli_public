package com.bit.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bit.dto.PlaylistDto;
import com.bit.dto.PliCommentDto;
import com.bit.dto.SongDto;
import com.bit.service.PlaylistService;

@RestController
@RequestMapping("/api")
public class PlaylistController {

    @Autowired
    PlaylistService pService;

    // 검색, 필터, 출력
    @GetMapping("/lv0/p/list")
    public List<PlaylistDto> getList(@CookieValue(required = false) String token, @RequestParam(required = false) String queryString, 
    @RequestParam(required = false)String type, boolean orderByDay){
        return pService.selectPublicPlaylist(token, queryString, type, orderByDay);
    }
    // 플레이 리스트 메인 데이터 top and 좋아요 누른 플리
    @GetMapping("/lv0/p/plimaindata")
    public Map<String, Object> getPliMainData(@CookieValue(required = false) String token) {
        return pService.pliMainData(token);
    }
    // 좋아요 누른 플레이리스트 가져오기
    @GetMapping("/lv2/p/listlike")
    public List<PlaylistDto> getLikes(@CookieValue String token) {
        return pService.selectLikePli(token);
    }

    // 팔로우한 사람의 플레이리스트 가져오기
    @GetMapping("/lv2/p/listfollow")
    public List<PlaylistDto> getFollow(@CookieValue String token) {
        return pService.selectFollowPli(token);
    }

    // 내플레이리스트 or 타인의 공개된 플레이리스트 가져오기
    @GetMapping("/lv1/p/playlist")
    public List<PlaylistDto> getPlaylist(@CookieValue String token, @RequestParam(required = false) String userNick) {
        return pService.selectPli(token, userNick);
    }

    // 플레이리스트 디테일
    @GetMapping("/lv0/p/playdetail")
    public Map<String, Object> getDetailPlayList(@RequestParam int idx){
        return pService.getDetailPlayList(idx);
    }
    // 플레이리스트 추가
    // 데이터 -> title, desc, genre, tag, img, isPublic, nick
    @PostMapping("/lv1/p/list")
    public boolean postList(@CookieValue String token, @RequestBody PlaylistDto data, HttpServletResponse response){
        return pService.insertPlaylist(token, data, response);
    }

    // 좋아요 추가, 삭제
    @PostMapping("/lv2/p/like")
    public List<Object> postLike(@CookieValue String token, @RequestParam int playlistID){
        return pService.togglePlaylist(token, playlistID);
    }

    // 플레이리스트 수정
    // 데이터 -> idx, title, desc, genre, tag, img, isPublic
    @PatchMapping("/lv1/p/list")
    public boolean patchList(@CookieValue String token, @RequestBody PlaylistDto data, HttpServletResponse response){
        return pService.updatePlaylist(token, data, response);
    }

    // 플레이리스트 삭제
    @DeleteMapping("/lv1/p/list")
    public boolean deleteList(@CookieValue String token, @RequestParam int idx){
        return pService.deletePlaylist(token, idx);
    }

    // 곡 추가
    // 데이터 -> playlistID, title, img, songlength, genre, tag, singer, songaddress, songorigin
    @PostMapping("/lv1/p/song")
    public boolean postSong(@CookieValue String token, @RequestBody SongDto data, HttpServletResponse response){
        return pService.insertSong(token, data, response);
    }

    // 곡 1개 가져오기
    @GetMapping("/lv0/p/song")
    public SongDto getSong(@RequestParam int idx){
        return pService.selectSong(idx);
    }

    // 플레이리스트 내 곡 모두 가져오기
    @GetMapping("/lv0/p/songs")
    public List<SongDto> getSongs(@RequestParam int playlistID){
        return pService.selectSongsAll(playlistID);
    }

    // 곡 1개 수정
    // 데이터 -> playlistID, title, img, genre, tag, singer, idx
    @PatchMapping("/lv1/p/song")
    public boolean patchSong(@CookieValue String token, @RequestBody SongDto data, HttpServletResponse response){
        return pService.updateSong(token, data, response);
    }

    // 곡 1개 삭제
    // 데이터 -> 곡의 idx
    @DeleteMapping("/lv1/p/song")
    public boolean deleteSong(@CookieValue String token, @RequestParam int idx, HttpServletResponse response){
        return pService.deleteSong(token, idx, response);
    }

    // 플레이리스트 댓글 출력
    @GetMapping("/lv0/p/comments")
    public List<PliCommentDto> getComments(@RequestParam int playlistID, @RequestParam int curr, @RequestParam int cpp){
        return pService.selectPliComments(playlistID, curr, cpp);
    }

    // 플레이리스트 댓글작성
    // 데이터 -> content, playlistID
    @PostMapping("/lv2/p/comment")
    public boolean postComment(@CookieValue String token, @RequestBody PliCommentDto data, HttpServletResponse response){
        return pService.insertPliComment(token, data, response);
    }

    // 플레이리스트 댓글 수정
    // 데이터 -> idx, content
    @PatchMapping("/lv2/p/comment")
    public boolean patchComment(@CookieValue String token, @RequestBody PliCommentDto data, HttpServletResponse response){
        return pService.updatePliComment(token, data, response);
    }

    // 플레이리스트 댓글 삭제(플리 주인, 댓글작성자만 삭제 가능)
    // 데이터 -> idx, playlistID
    @DeleteMapping("/lv2/p/comment")
    public boolean deleteComment(@CookieValue String token, @RequestBody PliCommentDto data, HttpServletResponse response){
        return pService.deletePliComment(token, data, response);
    }

    // 플리 순서 변경
    // 데이터 -> playlistID, neworder, oldorder
    @GetMapping("/lv2/p/updateOrder")
    public boolean updateOrder(@RequestBody Map<String,Integer> data){
        return pService.updateSongOrder(data);
    }
    
}
