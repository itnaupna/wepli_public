import React, { useCallback, useEffect, useRef, useState } from "react";
import "./PlayListDetail.css";
import MusicList from "../MainIMG/MusicList.png";
import Axios from "axios";
import HeartImg from "../MainIMG/Heart.png";
import SearchCommentIcon from "../MainIMG/SearchCommentIcon.png";
import CommentIcon from "../MainIMG/CommentImg.png";
import PlayListPlayIcon from "../MainIMG/PlayListDetailPlayIcon.png";
import PlayListDetailHeart from "../MainIMG/PlayListDetailHeartIcon.png";
import PlayListDetailHoverHeart from "../MainIMG/PlayListDetailHeartHoverIcon.png";
import PlayListDetaliAddMusic from "../MainIMG/PlayListDetailAddMusic.png";
import PlayListDetailOption from "../MainIMG/PlayListDetailOption.png";
import PlayListDetailDelete from "../MainIMG/PlayListDetailDelete.png";
import PlayListDetailCommentDelete from "../MainIMG/PlayListDetailCommentDelete.png";
import PlayListDetailClose from "../MainIMG/PlayListDetailClose.png";
import songUpdateSave from "../MainIMG/songUpdateSave.png";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AddSongModalOpen, SearchSongModalOpen, VideoId,AddSongResult } from "../recoil/SearchSongAtom";
import SearchSongModal from "./SearchSongModal";
import AddSongModal from "./AddSongModal";
import { SecondToHMS } from "../recoil/StageDataAtom";
import PlusIcon from "../MainIMG/plusIcon.png";
import { YTPListAtom, YoutubeAtom } from "../recoil/YoutubeAtom";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { SocketAtom, UnSubSocket } from "../recoil/SocketAtom";
import { StageUrlAtom } from "../recoil/ChatItemAtom";
import { LoginStatusAtom } from "../recoil/LoginStatusAtom";
import weplilogo from "../sidebar/photo/weplilogo.png";


const PlayListDetail = () => {
    const bucketURl = process.env.REACT_APP_BUCKET_URL;
    const idx = useParams().pliId;
    const loginStatus = useRecoilValue(LoginStatusAtom);
    const [heartHover, setHeartHover] = useState(false);
    const YTP = useRecoilValue(YoutubeAtom);
    const setYTPList = useSetRecoilState(YTPListAtom);
    const [stageUrl, setStageUrl] = useRecoilState(StageUrlAtom);
    const socket = useRecoilValue(SocketAtom);
    const [addSongResult, setAddSongResult] = useRecoilState(AddSongResult);

    const onIconsClick = useCallback(() => {
        // Please sync "PlayListMain03MyPlayListMain" to the project
    }, []);

    const onPlayListDetailCloseIconClick = useCallback(() => {
        // Please sync "PlayListMain03MyPlayListMain" to the project
    }, []);

    const closBacknavigate = useNavigate();

    const closBack = () => {
        closBacknavigate(-1);
    };
    const [plaListDetailResult, setPlaListDetailResult] = useState([]);
    const [plaListDetailComment, setPlaListDetailComment] = useState([]);
    const [plaListDetailInfo, setPlaListDetailInfo] = useState([]);
    const [plaListDetailSong, setPlaListDetailSong] = useState([]);
    const [plaListDetailplayUserImg, setPlaListDetailplayUserImg] = useState("");
    const [nickname, setNickname] = useState("");
    const [userImg, setUserImg] = useState("");

    const plaListDetail = () => {
        const plaListDetailUrl = "/api/lv0/p/playdetail";
        Axios.get(plaListDetailUrl, { params: { idx: idx} })
            .then(res => {
                setPlaListDetailResult(res.data);
                setPlaListDetailComment(res.data.comment);
                setPlaListDetailInfo(res.data.play);
                setPlaListDetailSong(res.data.song);
                setPlaListDetailplayUserImg(res.data.playUserImg);
            })
            .catch(res => console.log(res));
    }


    useEffect(() => {
        let nickname = window.localStorage.getItem("data");
        if (nickname == null) {
            nickname = window.sessionStorage.getItem("data");
        }

        if(nickname != null) {
            setNickname(JSON.parse(nickname).nick);
            setUserImg(JSON.parse(nickname).img);
        } else {
            setNickname(null);
            setUserImg(null);
        }
        plaListDetail();
    }, [loginStatus, addSongResult]);

    const [searchSongModalOpen, setSearchSongModalOpen] = useRecoilState(SearchSongModalOpen);
    const [addSongModalOpen, setAddSongModalOpen] = useRecoilState(AddSongModalOpen);
    const ShowSearchModalOpen = async () => {
        setSearchSongModalOpen(true);
        setAddSongModalOpen(false);
    }
    const [commentContent, setCommentContent] = useState("");
    const commentContentOnChange = (e) => {
        setCommentContent(e.target.value);
    }

    //댓글 작성 화면 이메일 or 휴대폰 인증받은사람만 가능하게 변경하기
    const writeComment = () => {
        const commnetdata = {
            content: commentContent,
            playlistID: idx
        }
        Axios({
            method: "post",
            url: "/api/lv2/p/comment",
            data: commnetdata
        }).then(res => {
            setCommentContent("");
            plaListDetail();
        }).catch(error => {
            if (error.response.status === 401) {
                alert("로그인 후 사용가능한 기능입니다");
            } else if (error.response.status === 403) {
                alert("메일 또는 문자인증 후 사용 가능합니다");
            } else {
                alert("알수없는 오류");
            }
        })
    }
    
    //내것만 삭제하게 변경 (조건 추가해야함) 삭제완료후 댓글리스트 다시 불러오기
    const deleteComment = (commentIndex) => {
        const commetdata = {
            idx: commentIndex,
            playlistID: idx
        }
        Axios({
            method: "delete",
            url: "/api/lv2/p/comment",
            data: commetdata
        }).then(res => {
            plaListDetail();
        }).catch(error => {
            if (error.response.status === 401) {
                alert("로그인 후 사용가능한 기능입니다");
            } else if (error.response.status === 403) {
                alert("메일 또는 문자인증 후 사용 가능합니다");
            } else {
                alert("알수없는 오류");
            }
        })
    }

    //내것만 삭제하게 변경 (조건 추가해야함) 삭제완료후 이전 페이지 보내주기로 변경하기
    const deletePli = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            Axios.delete(`/api/lv1/p/list?idx=${idx}`)
                .then(res => {
                    alert("삭제완료");
                    closBack();
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            alert("삭제를 취소했습니다.");
        }
    }

    const likeOnClick = () => {
        Axios({
            method: "post",
            url: "/api/lv2/p/like",
            params:{playlistID: idx,}
        }).then(res => {
            setAddSongResult(!addSongResult);
        }).catch(error => {
            console.log(error);
            if (error.response.status === 401) {
                alert("로그인 후 사용가능한 기능입니다");
            } else if (error.response.status === 403) {
                alert("메일 또는 문자인증 후 사용 가능합니다");
            } else {
                alert("알수없는 오류");
            }
        })
    }

    const songDelete = (idx) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            Axios.delete(`/api/lv1/p/song?idx=${idx}`)
                .then(res => {
                    setAddSongResult(!addSongResult);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            alert("삭제를 취소했습니다.");
        }
    }


    const [videoId, setVideoId] = useRecoilState(VideoId);

    const [txtsingerVal, setTxtsingerVal] = useState("");

    const [songTitle, setSongTitle] = useState("");
    const [songSinger, setSongSinger] = useState("");
    const handleChangeSinger = (index, value) => {
        setPlaListDetailSong(prevSongList => {
            const newSongList = [...prevSongList];
            newSongList[index] = { ...newSongList[index], singer: value };
            setSongSinger(value);
            return newSongList;
        });
    };

    const handleChangeTitle = (index, value) => {
        setPlaListDetailSong(prevSongList => {
            const newSongList = [...prevSongList];
            newSongList[index] = { ...newSongList[index], title: value };
            setSongTitle(value);
            return newSongList;
        });
    };

    const [readonlyInputVal, setReadonlyInputVal] = useState(true);
    const readonlyInput = () => {
        setReadonlyInputVal(!readonlyInputVal);
    }

    const [selectedInputIdx, setSelectedInputIdx] = useState(-1);

    const handleSelectInput = (index) => {
        setSelectedInputIdx(index);
        setSongImg("");
    };

    const [uploadSongImgName, setUploadSongImgName] = useState(null);
    const SongImgRef = useRef();
    const [songImg, setSongImg] = useState("");

    const saveSongImg = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const SongImgfile = e.target.files[0];
            const uploadSongImg = new FormData();
            uploadSongImg.append('directoryPath', "songimg");
            uploadSongImg.append('upload', SongImgfile);

            Axios({
                method: "post",
                url: "/api/lv1/os/imgupload",
                data: uploadSongImg,
                headers: { "Content-Type": "multipart/form-data" }
            }).then(res => {
                setUploadSongImgName(res.data);
            }).catch(error => {
                console.log(error);
            });

            const reader = new FileReader();
            reader.readAsDataURL(SongImgfile);
            reader.onloadend = () => {
                setSongImg(reader.result);
            };
        }
    };
    const updateSongSetting = (songSinger, songTitle) => {
        setSongTitle(songTitle);
        setSongSinger(songSinger);
    }

    const updateSong = (index) => {
        const updateSongURl = "/api/lv1/p/song";
        const updateSongData = {
            playlistID: idx,
            title: songTitle,
            img: uploadSongImgName,
            genre: "",
            tag: "",
            singer: songSinger,
            idx: index
        };
        Axios.patch(updateSongURl, updateSongData)
            .then(res =>
                plaListDetail()
            )
            .catch((error) => {
                alert("실패애러" + error)

            }
            )
    }

    return (
        <div className="playlistdetailframe">
            <div className="playlistdetail">
                <div className="playlistdetailtop">
                    <img
                        className="playlistdetailcover-icon"
                        alt=""
                        src={bucketURl + plaListDetailInfo.img}
                    />
                    <div className="playlistdetailinplaylistinfos">
                        <div className="playlistdetailinplaylisttitle">
                            {plaListDetailInfo.title}
                        </div>
                        <div className="tagcontainer">
                            <span className="genreitems">
                                {plaListDetailInfo.genre === "" ? null : "#장르 : " + plaListDetailInfo.genre}
                            </span>
                            <span className="tagitems">
                                {plaListDetailInfo.tag === "" ? null : "#태그 : " + plaListDetailInfo.tag}
                            </span>
                        </div>
                        <div className="playlistdetailinplaylistuserin">
                            <img
                                className="playlistdetailprofileimage-icon"
                                alt=""
                                src={plaListDetailplayUserImg ? `${bucketURl}/profile/${plaListDetailplayUserImg}` : weplilogo}
                            />
                            <div className="playlistdetailinplaylistnickna">
                                {plaListDetailInfo.nick}
                            </div>
                        </div>
                        <div className="playlistdetailinplaylistinfo">
                            {
                                plaListDetailInfo.desc === "" ? null : plaListDetailInfo.desc
                            }
                        </div>
                        <div className="playlistdetailinplaylistinfobu">
                            <div className="playlistdetailbuttonbody">
                                <div className={sessionStorage.getItem("data") === null ? "playlistdetailbuttons playlistdetailbuttonNologinPlay" : nickname === plaListDetailInfo.nick ? "playlistdetailbuttons" : "playlistdetailbuttons playlistdetailbuttonsHidden"} onClick={
                                    () => {
                                        if (stageUrl !== null && !window.confirm("스테이지에 입장한 상태입니다. 플리에서 직접 재생시 스테이지에서 퇴장됩니다. 계속 진행하시겠습니까?"))
                                            return;
                                        UnSubSocket();
                                        setStageUrl(null);
                                        let data = [];
                                        let data2 = plaListDetailSong.reduce((pv, cv) => {
                                            pv[cv.songaddress] = cv;
                                            return pv;
                                        }, {});
                                        plaListDetailSong.map((v, i) => data.push(v.songaddress));
                                        setYTPList(data2);
                                        YTP?.loadPlaylist(data);
                                    }
                                }>
                                    <img
                                        className="playlistdetailplaybutton-icon"
                                        alt=""
                                        src={PlayListPlayIcon}
                                    />
                                </div>
                                <div className={sessionStorage.getItem("data") === null ? "playlistdetailbuttons playlistdetailbuttonNologin" :  nickname === plaListDetailInfo.nick ? "playlistdetailbuttons" : "playlistdetailbuttons playlistdetailbuttonsHidden"} onClick={likeOnClick}
                                     onMouseOver={() => setHeartHover(true)}
                                     onMouseOut={() => setHeartHover(false)}>
                                    <img
                                        className="playlistdetaillikebutton-icon"
                                        alt=""
                                        src={heartHover? PlayListDetailHoverHeart : PlayListDetailHeart}
                                    />
                                </div>
                                {nickname === plaListDetailInfo.nick ?
                                    <div className="playlistdetailbuttons" onClick={ShowSearchModalOpen}>
                                        <img
                                            className="playlistdetailinsertmusicbutto-icon"
                                            alt=""
                                            src={PlayListDetaliAddMusic}
                                        />
                                    </div> : ""
                                }
                                {nickname === plaListDetailInfo.nick ?
                                    <Link to={"../pliupdate/" + idx} className="playlistdetailbuttons">
                                        <img
                                            className="playlistdetaillistupdatebutton-icon"
                                            alt=""
                                            src={PlayListDetailOption}
                                        />
                                    </Link> : ""
                                }
                                {nickname === plaListDetailInfo.nick ?
                                    <div className="playlistdetailbuttons">
                                        <img
                                            className="playlistdetailplaybutton-icon"
                                            alt=""
                                            src={PlayListDetailDelete}
                                            onClick={deletePli}
                                        />
                                    </div> : ""
                                }
                            </div>
                            <div className="playlistdetailviewicons">
                                <div className="playlistdetailviewicon">
                                    <div className="playlistdetailviewcomment">
                                        <div className="playlistmessegecount">{plaListDetailInfo.commentscount}</div>

                                        <img
                                            className="playlistmessegeicon"
                                            alt=""
                                            src={CommentIcon}
                                        />
                                    </div>
                                    <div className="playlistdetailviewmusic">
                                        <div className="playlistmessegecount">{plaListDetailSong.length}</div>
                                        <img
                                            className="playlistmain03musicicon"
                                            alt=""
                                            src={MusicList}
                                        />
                                    </div>
                                </div>
                                <div className="playlistdetailviewlike">
                                    <img
                                        className="playlistdetailviewlikeicon"
                                        alt=""
                                        src={HeartImg}
                                    />
                                    <div className="playlistdetailviewlikecount">{plaListDetailInfo.likescount}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="playlistdetaillist">
                    {
                        plaListDetailSong.map((songList, idx) =>
                            <div className="playlistdetailitems" key={idx}>
                                {nickname === plaListDetailInfo.nick ?
                                    <div className="grpbtnset">
                                        <img
                                            className={selectedInputIdx !== idx ? "playlistdetaillistupdatebutton-icon" : "playlistdetaillistupdatebutton-icon playlistdetaillistupdatebutton-hidden"}
                                            alt=""
                                            src={PlayListDetailOption}
                                            onClick={() => { updateSongSetting(songList.singer, songList.title); handleSelectInput(idx) }}
                                        />
                                        <img
                                            className={selectedInputIdx === idx ? "playlistdetaillistupdatebutton-icon" : "playlistdetaillistupdatebutton-icon playlistdetaillistupdatebutton-hidden"}
                                            alt=""
                                            src={songUpdateSave}
                                            onClick={() => { updateSong(songList.idx); handleSelectInput(-1) }}
                                        />
                                        <img
                                            className="playlistdetaillistdelete-icon"
                                            alt=""
                                            src={PlayListDetailClose}
                                            onClick={() => songDelete(songList.idx)}
                                        />
                                    </div> : ""
                                }
                                <div className="txtlength">{SecondToHMS(songList.songlength)}</div>
                                <input className="txtsinger" maxLength={10} value={songList.singer} readOnly={selectedInputIdx !== idx} onChange={(e) => handleChangeSinger(idx, e.target.value)} />
                                <input className="txttitle" maxLength={10} value={songList.title} readOnly={selectedInputIdx !== idx} onChange={(e) => handleChangeTitle(idx, e.target.value)} />
                                <label className="changeSongImgBody">
                                    {
                                        selectedInputIdx === idx ?
                                            <input type="file" className="songImgInput" readOnly={selectedInputIdx !== idx} onChange={saveSongImg} /> : null
                                    }
                                    {
                                        selectedInputIdx === idx ?
                                            <img
                                                className="imgthumbnail-plus"
                                                alt=""
                                                src={PlusIcon}
                                            /> : null
                                    }
                                    <img
                                        className="imgthumbnail-icon"
                                        alt=""
                                        src={
                                            selectedInputIdx === idx
                                                ? songImg !== "" ? songImg : songList.img !== null ? `${bucketURl}${songList.img}` : `https://i.ytimg.com/vi/${songList.songaddress}/sddefault.jpg`
                                                : songList.img !== null ? `${bucketURl}${songList.img}` : `https://i.ytimg.com/vi/${songList.songaddress}/sddefault.jpg`
                                        }
                                    />
                                </label>
                                <div className="txtrank" onClick={() => {
                                    if (stageUrl !== null && !window.confirm("스테이지에 입장한 상태입니다. 플리에서 직접 재생시 스테이지에서 퇴장됩니다. 계속 진행하시겠습니까?"))
                                        return;
                                    UnSubSocket();
                                    setStageUrl(null);
                                    setYTPList({
                                        [songList.songaddress]: songList
                                    });
                                    YTP.loadPlaylist([songList.songaddress]);

                                }}>
                                    <PlayArrowIcon />
                                </div>
                            </div>
                        )}
                </div>
                <div className="playlistdetailcommentframe">

                            <div className="playlistdetailcommentgroup1">
                                <div className="playlistdetailcommentheader">
                                    <div className="commettilte">댓글</div>
                                    <img
                                        className="commettilteiconbody"
                                        alt=""
                                        src={SearchCommentIcon}
                                    />
                                </div>
                            {nickname == null || nickname === "" ? "" :
                                <div className="playlistdetailcommentform">
                                    <textarea className="txtplaylistdetailform" placeholder="최대 길이는 200자 입니다" maxLength="200" value={commentContent} onChange={commentContentOnChange}>
                                    </textarea>
                                    <div className="playlistdetailformheader">
                                        <img
                                            className="playlistdetailcreaatecommentpr-icon"
                                            alt=""
                                            src={userImg != null && userImg != "" ? `${bucketURl}/profile/${userImg}` : weplilogo}
                                        />
                                        <div
                                            className="playlistdetailcreatecommentpro">{nickname}</div>
                                        <div className="playlistdetailcreatecommentcre">댓글작성</div>
                                        <div className="playlistdetailcreatecommentcre1" onClick={writeComment}>작성</div>
                                    </div>
                                </div>
                            }
                            </div>

                    {
                        plaListDetailComment.map((commentList, idx) =>
                            <div className="playlistdetailcommentswrapper" key={idx}>
                                <div className="playlistdetailcommentitems">
                                    <span className="playlistdetailcommenttext">
                                        {commentList.content}
                                    </span>
                                    <div className="playlistdetailcommentinfo">
                                        <div className="playlistdetailcommentprofilebo" />
                                        <div className="playlistdetailcommentinfobody">
                                            <div className="playlistdetailcommentcreateday">
                                                <div className="playlistdetailcommentcreateday1">
                                                    작성일 : {dayjs(commentList.writeda).format('YYYY-MM-DD')}
                                                </div>
                                            </div>
                                            {commentList.writer === nickname || plaListDetailInfo.nick === nickname ?
                                                <img
                                                    className="playlistdetailcommentdeletefra-icon"
                                                    alt=""
                                                    src={PlayListDetailCommentDelete}
                                                    onClick={() => deleteComment(commentList.idx)}
                                                /> : ""
                                            }
                                            <div className="playlistdetailcommentprofileim">
                                                <img
                                                    className="playlistdetailcommentprofileim-icon"
                                                    alt=""
                                                    src={commentList.img != "" && commentList.img != null ? `${bucketURl}/profile/${commentList.img}` : weplilogo}
                                                />
                                            </div>
                                            <div className="playlistdetailcommentnicknameb">
                                                {commentList.writer}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
                <img
                    className="playlistdetailclose-icon"
                    alt=""
                    src={PlayListDetailClose}
                    onClick={closBack}
                />
            </div>
            {searchSongModalOpen && <SearchSongModal setSearchSongModalOpen={setSearchSongModalOpen} />}
            {addSongModalOpen && <AddSongModal setAddSongModalOpen={setAddSongModalOpen} />}


        </div>
    );
};

export default PlayListDetail;