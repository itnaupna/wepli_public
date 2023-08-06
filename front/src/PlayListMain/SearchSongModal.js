import React, { useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./SearchSongModal.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    AddSongModalOpen,
    NextPageToken,
    SearchResults,
    SearchSongModalOpen,
    YoutubeSearchParam,
    VideoId
} from "../recoil/SearchSongAtom";
import SearchBarIcon from "../MainIMG/SearchBarIcon.png";
import backIcon from "../MainIMG/backarrow.svg";
import songAddButton from "../MainIMG/SearchSongModalResultAddButton.png";
import molu from "../MainIMG/Molu.gif";
import YouTube from 'react-youtube';
import axios from "axios";
import AddSongModal from "./AddSongModal";
import SearchSongResultA from './SearchSongResultA';
import TestComp from './TestComp';

function SearchSongModal(props) {
    const youtubeSearchUrl = "https://www.googleapis.com/youtube/v3/search";
    const forceSearchUrl = "/api/lv1/y/search";
    const [searchSongModalOpen, setSearchSongModalOpen] = useRecoilState(SearchSongModalOpen);
    const [youtubeSearchParam, setYoutubeSearchParam] = useRecoilState(YoutubeSearchParam);//마지막으로 검색한 단어를 저장
    const [searchResults, setSearchResults] = useRecoilState(SearchResults); //영상 목록 저장
    const [videoId, setVideoId] = useRecoilState(VideoId);
    const [nextPageTokenValue, setNextPageTokenValue] = useRecoilState(NextPageToken); //nextPageToken 저장
    const [loading, setLoading] = useState(false);//로딩중일때 처리
    const [selType, setSelType] = useState('api');

    const youtubeApiKey = `${process.env.REACT_APP_YOUTUBE_KEY}`;


    const handleSearch = () => {
        setSearchResults([]);
        const url = selType === 'api' ? youtubeSearchUrl : forceSearchUrl;
        const p = selType === 'api'
            ? {
                key: youtubeApiKey,
                part: 'snippet',
                q: youtubeSearchParam,
                maxResults: 10,
                type: 'video',
                videoDuration: 'any'
            } : {
                query: youtubeSearchParam
            };

        axios.get(url, {
            params: p,
        }).then((response) => {
            if (selType === 'api') {
                setSearchResults(response.data.items);
                setNextPageTokenValue(response.data.nextPageToken);
            } else {
                setSearchResults(response.data);
                setNextPageTokenValue(false);
            }
            setIsError(false);
        }).catch((error) => {
            if (selType === 'api') {
                setSelType('force');
                setIsError(true);
            } else {
                console.error('Error fetching data:', error);
                setIsError(false);
            }
        });
    };
    const [isError,setIsError] = useState(false);
    useEffect(()=>{
        if(isError && selType==='force'){
            handleSearch();
        }
    },[isError]);
    // useEffect(() => {
    //     console.log("업데이트된 nextPageTokenValue:", nextPageTokenValue);
    //     console.log("업데이트된 youtubeSearchParam:", youtubeSearchParam);
    // }, [nextPageTokenValue, youtubeSearchParam]);

    useEffect(() => {
        setNextPageTokenValue(false);
        setSearchResults([]);
    }, [selType]);

    const closeSearchModal = () => {
        setSearchSongModalOpen(false);
    }
    const youtubeSearchOnChange = (e) => {
        setYoutubeSearchParam(e.target.value);
    }

    const modalContentRef = useRef();

    /*  const handleScroll = () => {
          const modalContent = modalContentRef.current;
          if (!modalContent) return;
  
          const { scrollTop, scrollHeight, clientHeight } = modalContent;
          if (scrollTop + clientHeight >= scrollHeight - 1) {
              fetchMoreResults();
          }
      };*/

    const fetchMoreResults = async () => {
        if (loading || !nextPageTokenValue) return;

        try {
            setLoading(true);

            const response = await axios.get(youtubeSearchUrl, {
                params: {
                    key: youtubeApiKey,
                    part: 'snippet',
                    q: youtubeSearchParam,
                    maxResults: 5,
                    type: 'video',
                    videoDuration: 'any',
                    pageToken: nextPageTokenValue
                },
            });

            const uniqueResults = response.data.items.filter((item) => (
                !searchResults.some((existingItem) => existingItem.id.videoId === item.id.videoId)
            ));

            setSearchResults((prevResults) => [...prevResults, ...uniqueResults]);
            setNextPageTokenValue(response.data.nextPageToken);
        } catch (error) {
            console.error('Error fetching more data:', error);
        } finally {
            setLoading(false);
        }
    };


    /*    useEffect(() => {
            const modalContent = modalContentRef.current;
            if (modalContent) {
                modalContent.addEventListener('scroll', handleScroll);
            }
    
            return () => {
                if (modalContent) {
                    modalContent.removeEventListener('scroll', handleScroll);
                }
            };
        }, []);*/

    const [addSongModalOpen, setAddSongModalOpen] = useRecoilState(AddSongModalOpen);

    const showAddSongModalOpen = (videoID) => {
        setVideoId(videoID);
        setSearchSongModalOpen(false);
        setAddSongModalOpen(true);
    };

    function decodeHTMLEntities(text) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    }
    const SearchEnter = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };



    return (
        <div className="SearchSongModals">
            <div className="searchsongframe" onClick={closeSearchModal}></div>
            <div className='ssmg'>
                <div className='ssmheader'>
                    <span onClick={closeSearchModal}><ArrowBackIcon style={{ fontSize: '40px' }} /></span>
                    <div className='ssmtitle'>곡 검색</div>
                    <div>
                        <label><input type='radio' name='type' value='api' checked={selType === 'api'}
                            onChange={(e) => { setSelType(e.target.value); }} /> API </label><br />
                        <label><input type='radio' name='type' value='force' checked={selType === 'force'}
                            onChange={(e) => { setSelType(e.target.value); }} /> Force </label>
                    </div>
                </div>
                <div className='ssminputwrapper'>
                    <img className='ssmsicon' alt='' src={SearchBarIcon} onClick={handleSearch} />
                    <input className='ssmquery' value={youtubeSearchParam} onKeyPress={SearchEnter}
                        onChange={youtubeSearchOnChange} placeholder='검색어를 입력해주세요.' />
                </div>
                <div className='ssmresult'>
                    {searchResults.map((v, i) =>
                        <TestComp isApi={selType === 'api'} item={v} closeParent={setSearchSongModalOpen} key={i} />
                    )}
                </div>
                {nextPageTokenValue &&
                    <div>
                        <span onClick={fetchMoreResults}>more</span>
                    </div>
                }
            </div>


        </div>
    );
}

export default SearchSongModal;