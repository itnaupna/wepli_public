package com.bit.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.bit.dto.MemberDto;
import com.bit.dto.UserConfirmDto;
import com.bit.service.ImgUploadService;
import com.bit.service.MemberService;
import com.bit.service.UserConfirmService;

@RestController
@RequestMapping("/api")
@Slf4j
public class MemberController {
    @Autowired
    MemberService mService;
    @Autowired
    UserConfirmService uService;
    @Autowired
    ImgUploadService imgUploadService;

    HashMap<String, String> auth = new HashMap<String, String>();

    // 회원가입 api
    @PostMapping("/lv0/m/member")
    public boolean postMember(@RequestBody MemberDto mDto) {
        log.info(String.valueOf(mDto));
        return mService.joinMember(mDto);
    }

    // 이메일 중복체크. 중복이면 true
    @GetMapping("/lv0/m/email")
    public boolean getEmail(@RequestParam String email) {
        return mService.checkEmailExists(email);
    }

    // 닉네임 중복체크. 중복이면 true
    @GetMapping("/lv0/m/nick")
    public boolean getNick(@RequestParam String nick) {
        return mService.checkNickExists(nick);
    }

    // 전번 중복체크
    @GetMapping("/lv0/m/phone")
    public boolean getPhone(@RequestParam String phone) {
        return mService.checkPhoneExists(phone);
    }

    // 비밀번호만 확인
    @PostMapping("/lv1/m/checkpassword")
    public boolean postCheckPassword(@CookieValue String token, @RequestParam String pw) {
        return mService.checkPassword(token, pw);
    }

    // 인증코드 생성
    // 0-이메일, 1-전화
    @PostMapping("/lv1/m/requestcode")
    public boolean postRequestCode(@RequestBody UserConfirmDto data, @CookieValue String token){
        return uService.RequestCode(data.getType(), data.getKey(), token);
    }

    // 인증코드 검증 (로그인 상태/본인인증X)d
    // 0-이메일, 1-전화
    @PostMapping("/lv1/m/verifycode")
    public boolean postVerifyCode(@RequestBody UserConfirmDto data){
        return uService.VerifyCode(data.getType(), data.getKey(), data.getCode());
    }

    // 인증코드 생성 (비로그인 본인인증O 아이디/비번 찾기)
    // 0-이메일, 1-전화
    @PostMapping("/lv0/m/requestcode")
    public boolean postRequestCodeFind(@RequestBody UserConfirmDto data){
        return uService.RequestCodeFind(data.getType(), data.getKey());
    }

    // 아이디 찾기 인증코드 검증(비로그인, 본인인증O)
    @PostMapping("/lv0/m/verifycodefind")
    public String postVerifyCodefind(@RequestBody UserConfirmDto data){
        return uService.VerifyCodeFind(data.getType(),data.getKey(),data.getCode(),data.getAuthType());
    }
    
    // 비밀번호 찾기 (인증 완료 시 비밀번호 변경)
    @PostMapping("/lv0/m/findPw")
    public void findPw(@RequestBody UserConfirmDto data){
        uService.findPwCode(data.getType(),data.getPhone(),data.getEmail(),data.getNewPw());
    }

    // 닉넴 변경
    @PatchMapping("/lv1/m/nick")
    public boolean patchNick(@CookieValue String token, @RequestBody String nick, HttpServletRequest request ,HttpServletResponse response) throws Exception {
        return mService.changeNick(token, nick, request, response);
    }

    // 비번 변경
    @PatchMapping("/lv1/m/pw")
    public boolean patchPw(@CookieValue String token, @RequestBody String oldPw, @RequestBody String newPw, HttpServletResponse response) {
        return mService.changePassword(token, oldPw, newPw, response);
    }

    // 회원정보 변경
    @PatchMapping("/lv1/m/info")
    public Map<String, Object> patchInfo(@CookieValue String token, @RequestBody Map<String, Object> data,
                                         HttpServletRequest request, HttpServletResponse response) throws Exception {
        return mService.updateInfo(token, data, request, response);
    }

    // 탈퇴
    @DeleteMapping("/lv1/m/member")
    public boolean deleteMember(@CookieValue String token,@RequestParam String pw, HttpServletResponse response) {
        return mService.deleteMember(token, pw, response);
    }

    // 자기소개 변경
    @PatchMapping("/lv1/m/desc")
    public boolean patchDesc(@CookieValue String token, @RequestBody JsonNode desc) {
        System.out.println(desc);
        return mService.updateDesc(token, desc.get("desc").asText());
    }

    // 마이페이지 데이터 일괄
    @GetMapping("/lv0/m/mypage")
    public Map<String, Object> getMypageDto(@CookieValue(required = false) String token, @RequestParam(required = false) String userNick, HttpServletResponse response) {
        log.info("userNick -> {}", userNick);
        return mService.selectMypageDto(token, userNick, response);
    }

    //로그인
    @PostMapping("/lv0/m/login")
    public Map<String, Object> access(String email, String pw,@RequestParam(required = false) boolean autoLogin,
                                      HttpServletRequest request, HttpServletResponse response){
        return mService.Login(email, pw, autoLogin, request, response);
    }
    // 소셜 로그인 파라미터 -> email,socialtype
    @PostMapping("/lv0/m/social")
    public Map<String, Object> socialLogin(@RequestBody Map<String, String> data, HttpServletRequest request, HttpServletResponse response) {

        return mService.socialLogin(data, request, response);
    }

    //로그아웃
    @PostMapping("/lv0/m/logout")
    public void logout(@CookieValue String token, HttpServletRequest request, HttpServletResponse response) throws Exception {
        mService.logout(token, request, response);
    }

    // 프로필 사진 변경
    @PostMapping("lv1/m/profile")
    public String postProfileImg(@CookieValue String token, MultipartFile upload) {
        return imgUploadService.uploadMemberImg(token, "profile", upload);
    }


    // 플레이리스트, 음악, 스테이지 img 업로드(클라우드에 이미지 업로드)
    @PostMapping("/lv1/os/imgupload")
    public String storageUpload(@CookieValue String token, String directoryPath, MultipartFile upload) {
        return imgUploadService.storageImgUpload(token, directoryPath, upload);
    }

    // 플레이리스트, 음악, 스테이지 insert, update 도중 취소 시(클라우드에 저장된 이미지 지움)
    @DeleteMapping("/lv1/os/imgdelete")
    public void storageDelete(@CookieValue String token, String directoryPath) {
        imgUploadService.storageImgDelete(token, directoryPath);
    }

    @GetMapping("/lv0/m/nlogin")
    public ResponseEntity<String> getAccessToken(@RequestParam String code, @RequestParam String state) {
        RestTemplate restTemplate = new RestTemplate();

        String authUrl = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code" +
                "&client_id=" + "k0TZT6ixfVF9EUAC3ggO" +
                "&client_secret=" + "ou4_VpnUXt" +
                "&redirect_uri=" + "http://localhost:3000/nlogin" +
                "&code=" + code +
                "&state=" + state;

        ResponseEntity<String> response = restTemplate.exchange(authUrl, HttpMethod.GET, null, String.class);

        return response;
    }

    @GetMapping("/lv0/m/userinfo")
    public ResponseEntity<String> getUserInfo(@RequestParam String token) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);

        ResponseEntity<String> response = restTemplate.exchange("https://openapi.naver.com/v1/nid/me", HttpMethod.GET, entity, String.class);
        return response;
    }

}