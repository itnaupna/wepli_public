import React, {useEffect, useState} from 'react';
import Molu from "../MainIMG/Molu.gif";
import Follow from "../MainIMG/Follow.png";
import MusicList from "../MainIMG/MusicList.png";
import dayjs from 'dayjs';
import Axios from "axios";
import weplilogo from "../sidebar/photo/weplilogo.png";

function PlayListRankingFollowTop({item, ranking, mypage}) {
    const bucketURl = process.env.REACT_APP_BUCKET_URL;

    return (
        <div className="playlistrankinglistitem" onClick={() => mypage(item.mNick)}>
            <div className="playlistrankinglistitemnumber">{ranking + 1}</div>
            <img
                className="playlistmain01followprofillimg-icon"
                alt=""
                src={item.img ? `${bucketURl}/profile/${item.img}` : weplilogo}
            />
            <div className="playlistrankinglistiteminfo12">
                <div className="playlistrankinglistitemtitle">
                    {item.mNick}
                </div>
            </div>
            <div className="playlistrankinglistiteminfo22">
                <div className="playlistmain01followitems">
                    <div className="playlistmain01follow">
                        <div className="follow">
                            <div className="follownum">{item.cnt}</div>
                        </div>
                        <img
                            className="followrankinglsitfollowicons"
                            alt=""
                            src={Follow}
                        />
                    </div>
                    <div className="playlistmain01followcount">
                        <div className="playlistmain01playlistcount">
                            <div className="follownum">{item.pliCnt}</div>
                        </div>
                        <img
                            className="followrankinglsitmusicicon"
                            alt=""
                            src={MusicList}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayListRankingFollowTop;