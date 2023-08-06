package com.bit.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bit.jwt.JwtTokenProvider;
import com.bit.mapper.BlacklistMapper;
import com.bit.mapper.FollowMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FollowService {
    @Autowired
    FollowMapper followMapper;

    @Autowired
    BlacklistMapper blacklistMapper;

    @Autowired
    JwtTokenProvider jwtTokenProvider;
    // 팔로우 목록 받아오기
    public List<Map<String, Object>> selectFollowList(String token, String userNick) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        Map<String, String> nickAndUserNick = new HashMap<>();
        nickAndUserNick.put("nick", nick);

        if(userNick != null && !userNick.equals("")) {
            nickAndUserNick.put("userNick", userNick);
        }
        log.info("selectFollowList -> {}", nick);
        log.info("selectFollowList -> {}", userNick);
        return followMapper.selectFollowlist(nickAndUserNick); 
    }
    
    // 팔로워 목록 받아오기
    public List<Map<String, Object>> selectFollowerlist(String token, String userNick) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        Map<String, String> nickAndUserNick = new HashMap<>();
        nickAndUserNick.put("nick", nick);
        
        if(userNick != null && !userNick.equals("")) {
            nickAndUserNick.put("userNick", userNick);
        }
        log.info("selectFollowerlist -> {}", nick);
        log.info("selectFollowerlist -> {}", userNick);
        return followMapper.selectFollowerlist(nickAndUserNick);
    }

    // 팔로우 추가, 삭제
    public int toggleFollowing(String token, String target) {
        log.info("token -> {}",token);
        log.info("target -> {}",target);

        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        log.info(nick);
        Map<String, String> data = new HashMap<>();
        data.put("nick", nick);
        data.put("target", target);

        if(followMapper.isFollowchk(data) == 0) {
            if(blacklistMapper.isBlackchk(data) > 0) {
                blacklistMapper.deleteBlacklist(data);
            }
            followMapper.insertFollowlist(data);
            log.info("insert");
            return 1;
        } else {
            followMapper.unFollowlist(data);
            log.info("delete");
            return 0;
        }
    }


    // 팔로우 추가
    public boolean insertFollowlist(String token, String target) {
        Map<String, String> data = new HashMap<>();
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        log.info("nick -> {}", nick);
        log.info("target -> {}", target);

        data.put("nick", nick);
        data.put("target", target);

        if(blacklistMapper.isBlackchk(data) > 0) {
            blacklistMapper.deleteBlacklist(data);
        }

        log.info("Map in nick -> {}", data.get("follow"));
        log.info("Map in target -> {}", data.get("target"));
        
        
        return followMapper.insertFollowlist(data) > 0;
    }

    // 팔로우 삭제
    public boolean unFollowlist(String token, String target) {
        Map<String, String> data = new HashMap<>();
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        data.put("nick", nick);
        data.put("target", target);
        return followMapper.unFollowlist(data) > 0;
    }
    
    // 특정 유저가 나를 팔로우 했을시 팔로우 끊기(대상이 날 팔로우 한것을 끊음)
    public boolean deleteFollowlist(String token, String target) {
        Map<String, String> data = new HashMap<>();
        String follow = jwtTokenProvider.getUsernameFromToken(token.substring(6));

        log.info("deleteFollowlist -> {}", target);

        data.put("nick", target);
        data.put("target", follow);
        return followMapper.unFollowlist(data) > 0;
    }

    //대상 팔로우 여부
    public int isFollowchk(String token, String target) {
        String nick = jwtTokenProvider.getUsernameFromToken(token.substring(6));
        Map<String, String> followAndTarget = new HashMap<>();
        followAndTarget.put("nick", nick);
        followAndTarget.put("target", target);
        
        return followMapper.isFollowchk(followAndTarget);
    }

    //팔로우 top50
    public List<Map<String, Object>> selectFollowTop() {
        return followMapper.selectFollowTop();
    }
}
