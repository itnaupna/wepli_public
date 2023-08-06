package com.bit.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.bit.dto.MemberDto;
import com.bit.dto.MypageDto;


@Mapper
public interface MemberMapper {
    //회원가입
    public int insertJoinMember(MemberDto mDto);
    //이메일 중복검사
    public int selectCheckEmailExists(String email);
    //닉네임 중복검사
    public int selectCheckNickExists(String nick);
    //전화 중복검사
    public int selectCheckPhoneExists(String phone);
    //유저정보 받아오기
    public MemberDto selectMemberDto(String email);
    public String selectMemberImgByNick(String nick);
    //비밀번호 확인
    public int selectCheckPasswordByEmail(MemberDto mDto);
    public int selectCheckPasswordByNick(MemberDto mDto);
    //이메일 인증여부 확인
    public int selectCheckEmailConfirm(Map<String,String> data);
    //전화번호 인증여부 확인
    public int selectCheckPhoneConfirm(Map<String,String> data);
    //이메일 인증
    public int updateEmailConfirm(String email);
    //전화번호 인증
    public int updatePhoneConfirm(String phone);
    //닉넴 변경
    public int updateNick(Map<String,String> data);
    //비밀번호 변경
    public int updatePw(Map<String,String> data);
    // 회원정보 변경
    public void updateInfo(Map<String, Object> data);
    //회원 탈퇴
    public int deleteMember(MemberDto mDto);
    //자기소개 변경
    public int updateDesc(MemberDto mDto);
    //프사 변경
    public int updateImg(MemberDto mDto);

    //마이페이지 필요데이터 읽기(뷰)
    public MypageDto selectMypageDto(String nick);
    public MypageDto selectMypageDtoByEmail(String email);
    // 위 데이터에서 팔로우 포함
    public Map<String,Object> selectMypageDtoAndFollowCnt(String nick);
    //로그인
    public int selectLogin(Map<String, String> Map);
    // 소셜로그인
    public int CheckMemberExists(Map<String, String> data);

    // 아이디 찾기
    public String FindCheckPhoneCode(String phone);
    //비밀번호찾기(핸드폰)
    public void FindCheckPhonePw(Map<String, String> data);
    //비밀번호찾기(이메일)
    public void FindCheckEmailPw(Map<String, String> data);
    public int updatePhone(Map<String,String> data);
    public int selectFindPhoneConfirm(String phone);
    public int selectFindEmailConfirm(String email);

}
