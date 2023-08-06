import React from 'react';
import {Link} from "react-router-dom";
import RangkingIcon from "../MainIMG/RankingIcon.png";
import SearchIcon from "../MainIMG/SearchIcon.png";
import MypliIcon from "../MainIMG/MyPliIcon.png";
import AddPliIcon from "../MainIMG/AddPliIcon.png";

function PlayListMenu(props) {
    const noLoginAddPli = () =>{
        if (sessionStorage.getItem("data") == null ){
            alert("로그인 후 이용가능 합니다.");
        }
    }
    return (
        <div className="playlistbuttonlist">
            <div className="playlistbuttonset1">
                <Link to="../ranking" className="playlistbutton">
                    <img
                        className="playlistbuttonicon"
                        alt=""
                        src={RangkingIcon}
                    />
                    <div className="playlistbuttontext">랭킹</div>
                </Link>
                <Link to="../pli" className="playlistbutton">
                    <img
                        className="playlistbuttonicon"
                        alt=""
                        src={SearchIcon}
                    />
                    <div className="playlistbuttontext">검색</div>
                </Link>
            </div>
            <div className="playlistbuttonset1">
                <Link to="../mypli" className="playlistbutton">
                    <img className="playlistbuttonicon" alt="" src={MypliIcon} />
                    <div className="playlistbuttontext">내 플리</div>
                </Link>
                <Link to={sessionStorage.getItem("data")!=null?"../addpli":""} className="playlistbutton" onClick={noLoginAddPli}>
                    <img
                        className="playlistbuttonicon"
                        alt=""
                        src={AddPliIcon}
                    />
                    <div className="playlistbuttontext">플리 만들기</div>
                </Link>
            </div>
        </div>
    );
}

export default PlayListMenu;