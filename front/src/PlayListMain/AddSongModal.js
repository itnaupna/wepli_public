import React, { useEffect } from 'react';
import "./AddSongModal.css";
import { useRecoilState } from "recoil";
import { AddSongModalOpen, SearchSongModalOpen, VideoId, YoutubeAddResult, AddSongResult } from "../recoil/SearchSongAtom";
import backIcon from "../MainIMG/backarrow.svg";
import MusicList from "../MainIMG/MusicList.png";
import PlayListDetaliAddMusic from "../MainIMG/PlayListDetailAddMusic.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import { parseDurationToSeconds } from "../recoil/StageDataAtom";


function AddSongModal({ data }) {
    const [addSongModalOpen, setAddSongModalOpen] = useRecoilState(AddSongModalOpen);
    const [searchSongModalOpen, setSearchSongModalOpen] = useRecoilState(SearchSongModalOpen);
    const [youtubeAddResult, setYoutubeAddResult] = useRecoilState(YoutubeAddResult);
    const [addSongResult, setAddSongResult] = useRecoilState(AddSongResult);
    const [videoId, setVideoId] = useRecoilState(VideoId);
    const youtubeAddUrl = "https://www.googleapis.com/youtube/v3/videos";
    const idx = useParams().pliId;


    const youtubeApiKey = `${process.env.REACT_APP_YOUTUBE_KEY}`;
    const closeAddSongModal = async () => {
        setAddSongModalOpen(false);
    }
    const backButtonClick = () => {
        setAddSongModalOpen(false);
        setSearchSongModalOpen(true);
    }
    useEffect(() => {
        addSongItem();
    }, []);

    const addSongItem = () => {
        axios.get(youtubeAddUrl, {
            params: {
                key: youtubeApiKey,
                part: 'snippet,contentDetails',
                id: videoId,
            },
        })
            .then((res) => {
                setYoutubeAddResult(res.data.items);
                console.log(res.data.items[0]);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const saveSong = () => {
        const songData = {
            playlistID: idx,
            title: youtubeAddResult[0]?.snippet?.title,
            img: null,
            songlength: (parseDurationToSeconds(youtubeAddResult[0]?.contentDetails?.duration)),
            genre: "",
            tag: "",
            singer: youtubeAddResult[0]?.snippet?.channelTitle,
            songaddress: youtubeAddResult[0]?.id,
            songorigin: "yt"
        }
        axios({
            method: "post",
            url: "/api/lv1/p/song",
            data: songData
        }).then(res => {
            setAddSongResult(!addSongResult);
            closeAddSongModal(); //나중에 재 랜더링 넣기
        }).catch(error => {
            console.log(error);
        })
    }

    function formatDuration(duration) {
        const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/; // 정규식을 사용하여 PT로 시작하는 형식에 맞는 문자열을 추출
        const matches = duration.match(durationRegex);

        const hours = parseInt(matches[1]) || 0;
        const minutes = parseInt(matches[2]) || 0;
        const seconds = parseInt(matches[3]) || 0;

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedHours !== '00' ? formattedHours + ':' : ''}${formattedMinutes}:${formattedSeconds}`;
    }

    function extractNumbersFromString(input) {
        return parseInt(input.replace(/\D/g, ''), 10);
    }
    return (
        <div className="addsongmodals">
            <div className="addsongframe" onClick={closeAddSongModal}></div>
            <div className="addsongmodal">
                <div className="addsongmodalsubject">
                    {youtubeAddResult && youtubeAddResult.length > 0 ? (
                        <div className="addsongmodalsubjecttxt">곡 추가</div>
                    ) : (
                        <div className='addsongmodalsubjecttxt'>정보가 없습니다.</div>
                    )}
                    <img
                        className="addsongmodalback-icon"
                        alt=""
                        src={backIcon}
                        onClick={backButtonClick}
                    />
                </div>
                {youtubeAddResult && youtubeAddResult.length > 0 ? (
                    <div className="addsongmodalgroup">
                        <div className="addsongmodalitem">
                            <img
                                className="addsongmodalcover-icon"
                                alt=""
                                src={`https://i.ytimg.com/vi/${youtubeAddResult[0]?.id}/sddefault.jpg`}
                            />
                            <div className="addsongmodalinfos">
                                <div className="addsongmodaltitle">
                                    {youtubeAddResult[0]?.snippet?.title}
                                </div>
                                <div className="addsongmodalinfo">
                                    <div className="addsongmodalnick">{youtubeAddResult[0]?.snippet?.channelTitle}</div>
                                </div>
                                <div className="addsongmodalbuttons">
                                    <div className="addsongmodalsonglenght">
                                        <div className="addsongmodalsonglenghtitmes">
                                            <div className="addsongmodalsonglenghtitmes">
                                                <div className="addsongmodalsonglenghttxt">{formatDuration(youtubeAddResult[0]?.contentDetails?.duration)}</div>
                                                <img
                                                    className="addsongmodalsonglenghticon"
                                                    alt=""
                                                    src={MusicList}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="addsongmodaladdbutton" onClick={saveSong}>
                                        <img
                                            className="addsongmodaladdbuttonicon"
                                            alt=""
                                            src={PlayListDetaliAddMusic}
                                        />
                                        <div className="addsongmodaladdbuttontxt">추가</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    null
                )}

            </div>
        </div>
    );
}

export default AddSongModal;