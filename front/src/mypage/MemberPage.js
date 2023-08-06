import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import message from "./svg/message.svg";
import logo from "./photo/wplieonlylogo.png";
import Axios from 'axios';
import FollowingAndFollowerModal from './../MypageModal/FollowingAndFollowerModal';
import { useRecoilState } from 'recoil';
import { LoginModalOpen } from '../recoil/FindIdModalAtom';
 
function MemberPage(props) {
    const bucket = process.env.REACT_APP_BUCKET_URL;
    const { userNick } = useParams();
    const [followingAndFollowerModalOpen, setFollowingAndFollowerModalOpen] = useState(false);
    const [data, setData] = useState({nick: "", img: "", desc: "", followCnt: 0, followerCnt: 0, followChk: 0, blackChk: 0});
    const [value, setvalue] = useState("");
    const [loginmodalopen, setloginmodalopen] = useRecoilState(LoginModalOpen);


    const showFollowingAndFollowListModal = (target) => {
        setFollowingAndFollowerModalOpen(true);
        setvalue(target);
    }
    const hadlememberPage = () => {
        Axios({
            method: "get",
            url: "/api/lv0/m/mypage",
            params: {userNick : userNick}
        }).then(res => {
            setData(res.data);
        }).catch(error => {
            alert(error);
        })
    }

    const followToggleHandler = (target) => {
        console.log(target);
        Axios({
            method: "post",
            url: "/api/lv2/f/followtoggle",
            params: {target : target}
        }).then(res => {
            setData({...data, followChk: res.data, blackChk: 0});

            console.log(res.data);
        }).catch(error => {
            if(error.response.status === 401) {
                alert("로그인 후 사용가능한 기능입니다");
                setloginmodalopen(true);
            } else if(error.response.status === 403) {
                alert("메일 또는 문자인증 후 사용 가능합니다");
            } else {
                alert("알수없는 오류");
            }
            
        })
    }

    const blackToggleHandler = (target) => {
        console.log(target);
        Axios({
            method: "post",
            url: "/api/lv2/b/blacktoggle",
            params: {target : target}
        }).then(res => {
            setData({...data, blackChk: res.data, followChk: 0});
            console.log(data);
        }).catch(error => {
            if(error.response.status === 401) {
                alert("로그인 후 사용가능한 기능입니다");
                setloginmodalopen(true);
            } else if(error.response.status === 403) {
                alert("메일 또는 문자인증 후 사용 가능합니다");
            } else {
                alert("알수없는 오류");
            }
        })
    }



    useEffect(() => {
        hadlememberPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.followChk,userNick]);
    return (
        <div>
            <div className="mypageframe">
                <div className="mypagelogoheader">
                    <div className="mypagemembernicknameframe">
                        <div className="memebersmypage">{data.nick}님 마이페이지</div>
                    </div>
                    <div className="mypageweplilogobox">
                        <img
                            className="mypageweplilogo-icon"
                            alt="logo"
                            src={logo}
                        />
                    </div>
                </div>
                <div className="mypagemiddleboxgruop">
                    <div className="mypagemenubarframe">    
                        <div className="mypagechangeinfobox">
                            <div className="mypagechangeinfobutton">
                                <div className="mypagechangeinfosurface"/>
                                <div className="mypagechangeinfolabel"  onClick={() => followToggleHandler(data.nick)}>{data.followChk === 0 ? "팔로우 추가" : "팔로우 취소"}</div>
                            </div>
                        </div>
                        <div className="mypagechangeinfobox">
                            <div className="mypagechangeinfobutton">
                                <div className="mypagechangeinfosurface"/>
                                <div className="mypagechangeinfolabel" onClick={() => blackToggleHandler(data.nick)}>{data.blackChk === 0 ? "블랙 추가" : "블랙 취소"}</div>
                            </div>
                        </div> 
                    </div>
                    <div className="mypagemyinfoboxframe">
                        <div className="mypageonelineinfotext">
                            <div className="mypageonelinetext">
                                {data.desc}
                            </div>
                        </div>
                        <div  className="mypageonelinerbox">
                            <div className="mypageonelinertext">한줄소개</div>
                            <img
                                className="mypagecommunicationicon"
                                alt=""
                                src={message}
                            />
           
                        </div>
                    </div>
                    <div className="mypagefollowframe">
                        <div className="mypagefollowingbox" onClick={() => showFollowingAndFollowListModal("following")}>
                            <div className="mypagefollowingnumber">{data.followCnt}명</div>
                            <div className="mypagefollowingtext">팔로잉</div>
                        </div>
                        <div className="mypagefollowbox" onClick={() => showFollowingAndFollowListModal("follower")}>
                            <div className="mypagefollowtext">팔로워</div>
                            <div className="mypagefollownumber">{data.followerCnt}명</div>
                        </div>
                    </div>
                </div>
                <div className="mypagememberprofileframe">

                        <img
                            className="mypagememberprofileimg-icon"
                            alt=""
                            src={`${bucket}/profile/${data.img}`}
                        />
                </div>
                {followingAndFollowerModalOpen && <FollowingAndFollowerModal nick={data.nick} value={value} setFollowingAndFollowerModalOpen={setFollowingAndFollowerModalOpen}/>}
            </div>
        </div>
    );
}

export default MemberPage;