package com.bit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bit.service.FollowService;

@RestController
@RequestMapping("/api")
public class FollowController {

    @Autowired
    FollowService followService;

    // 팔로우 리스트 얻기
    @GetMapping("/lv2/f/follow")
    public List<Map<String, Object>> getFollow(@CookieValue String token, @RequestParam(required = false) String userNick) {
        return followService.selectFollowList(token, userNick);
    }

    // 팔로워 리스트 얻기
    @GetMapping("/lv2/f/follower")
    public List<Map<String, Object>> getFollower(@CookieValue String token, @RequestParam(required = false) String userNick) {
        return followService.selectFollowerlist(token, userNick);
    }

    // 팔로우 추가,삭제
    @PostMapping("/lv2/f/followtoggle")
    public int followAndUnfollow(@CookieValue String token, @RequestParam String target) {
        return followService.toggleFollowing(token, target);
    }

    // 팔로우 추가
    @PostMapping("/lv2/f/addfollow")
    public boolean postFollow(@CookieValue String token, @RequestParam String target) {
        return followService.insertFollowlist(token, target);
    }

    // 팔로우 취소
    @DeleteMapping("/lv2/f/unfollow")
    public boolean unFollow(@CookieValue String token, @RequestParam String target) {
        return followService.unFollowlist(token, target);
    }
    
    // 특정 유저가 나를 팔로우 했을시 팔로우 끊기(대상이 날 팔로우 한것을 끊음)
    @DeleteMapping("/lv2/f/delfollow")
    public boolean deleteFollow(@CookieValue String token, @RequestParam String target) {
        return followService.deleteFollowlist(token, target);
    }

    //대상 팔로우 여부
    @GetMapping("/lv2/f/isfollow")
    public int isFollowChk(@CookieValue String token, @RequestParam String target) {
        return followService.isFollowchk(token, target);
    }

    //팔로우 top50
    @GetMapping("/lv0/f/followtop")
    public List<Map<String, Object>> followTop() {
        return followService.selectFollowTop();
    }
}
