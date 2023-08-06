import React, { useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useRecoilState } from 'recoil';
import { AddSongModalOpen, VideoId } from '../recoil/SearchSongAtom';
import axios from 'axios';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
const TestComp = ({ item, closeParent, isApi }) => {
    const [videoId, setVideoId] = useRecoilState(VideoId);
    const [addSongModalOpen, setAddSongModalOpen] = useRecoilState(AddSongModalOpen);
    const itemRef = useRef();
    const [added, setAdded] = useState(false);
    const [isWorking, setIsWorking] = useState(false);

    function decodeHTMLEntities(text) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    }
    const showAddSongModalOpen = async (videoID) => {
        setVideoId(videoID);
        closeParent(false);
        setAddSongModalOpen(true);
    };
    function timeStringToSeconds(timeString) {
        const timeParts = timeString.split(':').map(part => parseInt(part, 10));

        let seconds = 0;
        if (timeParts.length === 2) {
            seconds += timeParts[0] * 60; // Minutes
            seconds += timeParts[1]; // Seconds
        } else if (timeParts.length === 3) {
            seconds += timeParts[0] * 60 * 60; // Hours
            seconds += timeParts[1] * 60; // Minutes
            seconds += timeParts[2]; // Seconds
        }

        return seconds;
    }
    const handleAddSong = async () => {
        setIsWorking(true);
        // console.log(k);
        let songlength = timeStringToSeconds(item.length);
        const songData = {
            playlistID: window.location.pathname.split("pli/")[1],
            title: item.title,
            img: null,
            songlength,
            genre: "",
            tag: "",
            singer: item.author,
            songaddress: item.id,
            songorigin: "yt"
        }
        axios({
            method: 'post',
            url: '/api/lv1/p/song',
            data: songData
        }).then(res => {
            itemRef.current.classList.add("isRemoving");
            setTimeout(() => {
                itemRef.current.classList.add("isRemoved");
                // console.log('key : ',k);
                // del(k);
                // setAdded(true);
            }, 400);
        }).catch(err => {

            alert("곡 추가를 실패했습니다. 다시 시도해주세요.");
            console.log(err);
        })
            .finally(() => {
                setIsWorking(false);
            });

    }

    return !added && (
        <div className="ssmresultitem" ref={itemRef}>
            <img className='searchsongmodalresultcover-icon' alt="" src={isApi ? item?.snippet && item?.snippet.thumbnails.default.url : item.img} />
            <div>
                {decodeHTMLEntities(isApi ? item?.snippet && item?.snippet.title : item.title)}
                <br />
                {decodeHTMLEntities(isApi ? item?.snippet && item?.snippet.channelTitle : item.author)}
            </div>
            <span onClick={() => {
                isApi
                    ? showAddSongModalOpen(item.id.videoId)
                    : !isWorking && handleAddSong();
            }}>
                {isWorking
                    ? <HourglassEmptyIcon />
                    : <AddIcon />
                }
            </span>
        </div>
    );
};

export default TestComp;