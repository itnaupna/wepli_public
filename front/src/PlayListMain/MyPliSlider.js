import React, {Component, useEffect, useState} from "react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MyPliSlider.css";
import CommentIcon from "../MainIMG/CommentImg.png";
import MusicList from "../MainIMG/MusicList.png";
import HeartImg from "../MainIMG/Heart.png";
import MoluCover from "../MainIMG/MoluCover.png";
import Axios from "axios";
import dayjs from 'dayjs';
import {Link} from "react-router-dom";

function MyPliSlider() {

        const settings = {
            className: "center",
            centerMode: true,
            infinite: true,
            centerPadding: "50px",
            variableWidth:true,
            speed: 400,
            slidesToScroll: 1,
        };
        const bucketURl = process.env.REACT_APP_BUCKET_URL;
        const [myPliL, setMyPli] = useState([]);

        useEffect(()=>{
            if(sessionStorage.getItem("data")!=null) {
                const myPliLUrl = "/api/lv1/p/playlist";
                Axios.get(myPliLUrl)
                    .then(res =>
                        setMyPli(res.data));

            }
        },[sessionStorage.getItem("data")]);

        return (
            <div className="MyPliSliderBody">
                <Slider {...settings}>
                    {
                        sessionStorage.getItem("data") == null? <h1 className="NoLogin">로그인 후 이용 가능합니다</h1>:
                        myPliL === undefined ?<h1 className="NoLogin">Loading...</h1>:
                        myPliL.length === 0? <h1 className="NoLogin">내 플레이 리스트가 없습니다</h1>:
                        myPliL.map((item,idx) =>
                        <Link to={"../pli/" + item.idx} className="myplaylistitem" key={idx}>
                            <img
                                className="myplaylistitemBgImg"
                                alt=""
                                src={`${bucketURl}${item.img}`}
                            />
                            <div className="myplaylistitembottom">
                                <div className="myplaylistiteminfo">
                                    <div className="myplaylistitemnumbers">
                                        <div className="myplaylistitemcommentwrapper">
                                            <div className="myplaylistitemcommentcount">{item.commentscount}</div>
                                            <img
                                                className="myplaylistitemcommenticon"
                                                alt=""
                                                src={CommentIcon}
                                            />
                                        </div>
                                        <div className="myplaylistitemsongwrapper">
                                            <div className="myplaylistitemcommentcount">{item.songscount}</div>
                                            <img
                                                className="myplaylistitemsongicon"
                                                alt=""
                                                src={MusicList}
                                            />
                                        </div>
                                    </div>
                                    <div className="myplaylistitemtags">
                                        <div className="myplaylistitemtag">{item.tag == null ? "" : "#" + item.tag.split(",")[0]}</div>
                                        <div className="myplaylistitemcategory">{item.genre == null ? "" : "#" + item.genre?.split(",")[0]}</div>
                                    </div>
                                    <div className="myplaylistitemlikewrapper">
                                        <div className="myplaylistitemlikecount">{item.likescount}</div>
                                        <img
                                            className="myplaylistitemlikeicon"
                                            alt=""
                                            src={HeartImg}
                                        />
                                    </div>
                                </div>
                                <div className="myplaylistitemdescription">
                                    {item.nick}
                                </div>
                                <div className="myplaylistitemtitle">
                                    {item.title}
                                </div>
                            </div>
                            <div className="myplaylistitemtop">
                                <div className="myplaylistitemmakeday">생성일 : {dayjs(item.makeday).format('YYYY-MM-DD')}</div>
                                <img
                                    className="myplaylistitemthumbnail-icon"
                                    alt=""
                                    src={`${bucketURl}${item.img}`}
                                />
                            </div>
                        </Link>
                    )}
                </Slider>
            </div>
        );

}
export default MyPliSlider;