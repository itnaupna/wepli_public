import React, {useCallback, useEffect, useState} from 'react';
import Aris from "../MainIMG/Aris.gif";
import SearchCommentIcon from "../MainIMG/SearchCommentIcon.png";
import MusicList from "../MainIMG/MusicList.png";
import HeartImg from "../MainIMG/Heart.png";
import dayjs from 'dayjs';
import Axios from "axios";
import {Link} from "react-router-dom";

function PlayListSearchDetail({searchResult}) {
    const bucketURl = process.env.REACT_APP_BUCKET_URL;
    return (
        <div className="playlistsearchbody">
            <div className="playlistitemwrapperframe">
                {
                    searchResult.length === 0? <h1 className="NoResearch">검색 결과가 없습니다</h1>:
                    searchResult?.map((item, idx)=>
                        <Link to={"../pli/" + item.idx} className="playlistsearchitem" key={idx} style={{backgroundImage:`linear-gradient(rgba(255,255,255,0.8),rgba(255,255,255,0.8)),url(${bucketURl}${item.img})`}}>

                            <img
                                className="playlistsearchthumbnail-icon"
                                alt=""
                                src={`${bucketURl}${item.img}`}
                            />
                            <div className="playlistsearchinfowrapper">
                                <div className="playlistsearchtagswrapper">
                                    <div className="playlistsearchcategory">
                                        {item.genre===""?null:"#" + item.genre?.split(",")[0]}
                                    </div>
                                    <div className="playlistsearchtag">{item.tag === ""?null:"#" + item.tag?.split(",")[0]}</div>
                                </div>
                                <div className="playlistsearchcommentwrapper">
                                    <div className="playlistsearchcommentcount">{item.commentscount}</div>
                                    <img
                                        className="playlistsearchcommenticonwrapp"
                                        alt=""
                                        src={SearchCommentIcon}
                                    />
                                </div>
                                <div className="playlistsearchsongwrapper">
                                    <div className="playlistsearchcommentcount">{item.songscount}</div>
                                    <img
                                        className="playlistsearchcommenticonwrapp"
                                        alt=""
                                        src={MusicList}
                                    />
                                </div>
                                <div className="playlistsearchmakeday">생성일 : {dayjs(item.makeday).format('YYYY-MM-DD')}</div>
                                <div className="playlistsearchowner">{item.nick}</div>
                                <div className="playlistsearchtitle">{item.title}</div>
                                <div className="playlistsearchlikewrapper">
                                    <img
                                        className="playlistsearchlikeicon"
                                        alt=""
                                        src={HeartImg}
                                    />
                                    <div className="playlistsearchlikecount">{item.likescount}</div>
                                </div>
                            </div>
                        </Link>
                    )
                }

            </div>
        </div>
    );
}

export default PlayListSearchDetail;