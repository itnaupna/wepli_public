package com.bit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bit.service.BlacklistService;

@RestController
@RequestMapping("/api")
public class BlackController {
    @Autowired
    BlacklistService blacklistService;

    // 블랙리스트 받아오기
    @GetMapping("/lv2/b/blacklist")
    public List<Map<String, Object>> getBlackList(@CookieValue String token) {
    return blacklistService.getBlackList(token);
    }

    // 블랙리스트 추가, 삭제
    @PostMapping("/lv2/b/blacktoggle")
    public int blacklistToggle(@CookieValue String token, @RequestParam String target) {
        return blacklistService.toggleBlacklist(token, target);
    }

    // 블랙리스트 추가
    @PostMapping("/lv2/b/addblacklist")
    public boolean postBlacklist(@CookieValue String token, @RequestParam String target) {
        return blacklistService.insertBlacklist(token, target);
    }

    // 블랙리스트 삭제
    @DeleteMapping("/lv2/b/blacklist")
    public boolean deleteBlacklist(@CookieValue String token, @RequestParam String target) {
        return blacklistService.deleteBlacklist(token, target);
    }

    // 블랙리스트 옵션 받아오기
    @GetMapping("/lv2/b/blackopt")
    public Map<String, Integer> getBlackOpt(@CookieValue String token) {
        return blacklistService.selectBlackOpt(token);
    }

    // 블랙리스트 옵션 수정
    @PutMapping("/lv2/b/blackoptchange")
    public boolean putBlackopt(@CookieValue String token, @RequestParam int hidechat, @RequestParam int mute) {
        return blacklistService.updateBlackOpt(token, hidechat, mute);
    }

    //대상 블랙 여부
    @GetMapping("/lv2/b/isblack")
    public int isBlackChk(@CookieValue String token, @RequestParam String target) {
        return blacklistService.isBlackchk(token, target);
    }
}
