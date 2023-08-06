package com.bit.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.bit.dto.StageDto;
import com.bit.dto.StageHistoryDto;
import com.bit.dto.StageUserListDto;

@Mapper
public interface StageMapper {
    //스테이지 접속자 목록 가져오기
    public List<StageUserListDto> selectStageUserList(List<String> nicks);

    // 스테이지 생성
    public int insertStage(StageDto sDto);

    public List<StageDto> selectStageAll(Map<String, Object> data);
    // public Map<String,StageDto> selectStageAll(Map<String, Object> data);

    // 팔로우한 사람의 스테이지
    public List<StageDto> selectFollowStage(String nick);

    public StageDto selectStageOneByAddress(String address);

    // 내 스테이지
    public StageDto selectStageOneByMasterNick(String nick);

    public int updateStage(StageDto sDto);

    // public int deleteStage(Map<String, String> data);
    public int deleteStage(String nick);

    public int selectCheckStagePw(Map<String, String> data);

    // 스테이지 방제목 확인
    public int selectCheckStageTitle(Map<String, String> data);

    // 스테이지 히스토리 추가
    public int insertStageHistory(StageHistoryDto shDto);

    // 스테이지 히스토리 불러오기
    public List<Map<String, Object>> selectStageHistory(String stageaddress);

    //스테이지 주소 중복검사
    public int selectCheckAddress(String stageaddress);


    // TODO 스테이지 검색 (아래 검색기능 통합! 확인 후 삭제 예정)

    public List<StageDto> selectSearchStage(Map<String, List<String>> genreAndBlack, Map<String, Object> data, @Param("type")String type);
    
    //public List<StageDto> selectSearchByNick(Map<String, List<String>> nickAndBlack);

    //public List<StageDto> selectSearchByTitle(Map<String, List<String>> titleAndBlack);

    //public List<StageDto> selectSearchByGenre(Map<String, List<String>> genreAndBlack);

    //public List<StageDto> selectSearchByTag(Map<String, List<String>> tagAndBlack);

    // TODO : (확인) 검색시 블랙리스트 제외 

}
