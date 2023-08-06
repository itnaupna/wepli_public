import React from 'react';
import songAddButton from "../MainIMG/SearchSongModalResultAddButton.png";
import { useRecoilState } from 'recoil';
import { AddSongModalOpen, VideoId } from '../recoil/SearchSongAtom';

const SearchSongResultA = ({item,closeParent}) => {
    const [videoId, setVideoId] = useRecoilState(VideoId);
    const [addSongModalOpen, setAddSongModalOpen] = useRecoilState(AddSongModalOpen);

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

    return (
        <div className="searchsongmodalresultitem">
            <img
                className="searchsongmodalresultcover-icon"
                alt=""
                src={item.snippet.thumbnails.default.url}
            />
            <div className="searchsongmodalresulttitle">
                {decodeHTMLEntities(item.snippet.title)}
            </div>
            <div className="searchsongmodalresultsinger" >{decodeHTMLEntities(item.snippet.channelTitle)}</div>
            <img
                className="searchsongmodalresultaddbutton-icon"
                alt=""
                src={songAddButton}
                onClick={() => showAddSongModalOpen(item.id.videoId)}
            />
        </div>
    );
};

export default SearchSongResultA;