package com.bit.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BlacklistMapper {
    
    public List<String> selectBlackTarget(String nick);
    //블랙리스트 받아오기
    public List<Map<String, Object>> selectBlacklist(String nick);
    //블랙리스트 추가
    public int insertBlacklist(Map<String,String> data);
    //블랙리스트 삭제
    public int deleteBlacklist(Map<String,String> blackAndTarget);
    //회원가입시 블랙리스트 옵션 테이블 추가
    public void insertBlackOpt(String nick);
    //블랙리스트 옵션 받아오기
    public Map<String,Integer> selectBlackOpt(String nick);
    //블랙리스트 옵션 변경
    public int updateBlackOpt(Map<String,Object> data);
    //대상 블랙 여부
    public int isBlackchk(Map<String, String> blackAndTarget);
}
