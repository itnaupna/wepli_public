import React, {useEffect, useState} from 'react';
import Aris from "../MainIMG/Aris.gif";
import HeartImg from "../MainIMG/Heart.png";
import dayjs from 'dayjs';
import Axios from "axios";

function PlayLsitRankingLikeTop({item, ranking, pliDetail}) {
    const bucketURl = process.env.REACT_APP_BUCKET_URL;


    return (
            <div className="playlistrankinglistitem" onClick={() => pliDetail(item.idx)}>
                <div className="playlistrankinglistitemnumber">{ranking + 1}</div>
                <img
                    className="playlistrankinglistitemthumbna-icon"
                    alt=""
                    src={`${bucketURl}${item.img}`}
                />
                <div className="playlistrankinglistiteminfo1">
                    <div className="playlistrankinglistitemtitle">
                        {item.title}
                    </div>
                    <div className="playlistrankinglistitemowner">
                        {item.nick}
                    </div>
                </div>
                <div className="playlistrankinglistiteminfo2">
                    <div className="playlistrankinglistitemmakeday">
                        생성일 : {dayjs(item.makeday).format('YYYY-MM-DD')}
                    </div>
                    <div className="playlistrankinglistitemlikegro">
                        <div className="playlistrankinglistitemlikenum">{item.likescount}</div>
                        <img
                            className="playlistrankinglistitemlikeico-icon"
                            alt=""
                            src={HeartImg}
                        />
                    </div>
                    <div className="playlistrankinglistitemtags">
                        <div className="playlistrankinglistitemcategor">
                            {item.genre === "" ? null : "#" + item.genre?.split(",")[0]}
                        </div>
                        <div className="playlistrankinglistitemcategor">
                            {item.tag === "" ? null : "#" + item.tag?.split(",")[0]}
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default PlayLsitRankingLikeTop;