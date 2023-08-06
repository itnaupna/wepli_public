package com.bit.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface FollowMapper {
    
    //팔로우 목록 받아오기
    public List<Map<String, Object>> selectFollowlist(Map<String, String> nickAndUserNick);
    //팔로워 목록 받아오기
    public List<Map<String, Object>> selectFollowerlist(Map<String, String> nickAndUserNick);
    //팔로우 추가
    public int insertFollowlist(Map<String,String> followAndTarget);
    //팔로우 취소
    public int unFollowlist(Map<String,String> followAndTarget);
    //대상 팔로우 여부
    public int isFollowchk(Map<String, String> followAndTarget);
    //팔로우 top50
    public List<Map<String, Object>> selectFollowTop();
}
