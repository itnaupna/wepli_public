package com.bit.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.bit.dto.PlaylistDto;
import com.bit.dto.PliCommentDto;
import com.bit.dto.SongDto;

@Mapper
public interface PlaylistMapper {

    // IDX를 통한 플레이리스트 1개 정보 가져오기
    public PlaylistDto selectPlaylist(int idx);

    // 공개된 플레이리스트 목록 가져오기
    public List<PlaylistDto> selectPublicPlaylist(Map<String, List<String>> genreAndBlack, Map<String, Object> data, @Param("type")String type);

    // 좋아요 top50 플레이리스트
    public List<PlaylistDto> selectLikeTopPli();

    // 좋아요 누른 플레이리스트 가져오기
    public List<PlaylistDto> selectLikePli(String nick);

    // 팔로우한 사람의 플레이리스트 가져오기
    public List<PlaylistDto> selectFollowPli(String nick);

    // idx로 플레이리스트 가져오기
    public PlaylistDto selectMyPliToIdx(int idx);

    // 내 플레이리스트 가져오기
    public List<PlaylistDto> selectMyPli(String nick);

    // 내 플리 이미지 일괄(회원 탈퇴시 버킷 비우는 용도)
    public List<String> selectMyPliImg(String nick);

    // 타인 플레이리스트중 공개된 플레이리스트 가져오기
    public List<PlaylistDto> selectUserFromPublicPli(String nick);

    // 플레이리스트 생성
    public int insertPlaylist(PlaylistDto data);

    // 좋아요 여부 검사, 좋아요 추가, 좋아요 취소
    public int selectLike(Map<String, Object> data);

    public int insertLike(Map<String, Object> data);

    public int deleteLike(Map<String, Object> data);

    // 플리 수정
    public int updatePlaylist(PlaylistDto data);

    // 플리 삭제
    public int deletePlaylist(int idx);

    // 내 음악 이미지 일괄(회원 탈퇴시 버킷 비우는 용도)
    public List<String> selectMySongAllImg(String nick);

    // 개별곡 CRUD
    public int insertSong(SongDto data);

    public SongDto selectSong(int idx);

    public List<SongDto> selectSongsAll(int playlistID);

    public int updateSong(SongDto data);

    public int deleteSong(int idx);

    // 덧글 CRUD
    public PliCommentDto selectPliCommentToIdx(int idx);

    public List<PliCommentDto> selectPliComments(Map<String, Object> data);

    public int insertPliComment(PliCommentDto data);

    public int updatePliComment(PliCommentDto data);

    public int deletePliComment(int idx);

    public List<PlaylistDto> detailPlayList(int idx);

    // 플리 순서 변경
    public void updateSongOrder(Map<String,Integer> data);

}
