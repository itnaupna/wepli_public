import React, {useEffect, useState} from 'react';
import logo from "./photo/wplieonlylogo.png";
import message from "./svg/message.svg";
import {json, useParams} from 'react-router-dom';
import FollowingAndFollowerModal from "../MypageModal/FollowingAndFollowerModal";
import Axios from "axios";
import weplilogo from "./photo/wplieonlylogo.png";

function UserMypage(props) {
    const bucket = process.env.REACT_APP_BUCKET_URL;
    const { userNick } = useParams();
    const [followingAndFollowerModalOpen, setFollowingAndFollowerModalOpen] = useState(false);
    const [data, setData] = useState({nick: "", img: "", desc: "", followCnt: 0, followerCnt: 0, followChk: 0, blackChk: 0});
    const [value, setvalue] = useState("");

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

            let d = JSON.parse((sessionStorage.getItem('data')||localStorage.getItem('data')));
            let lst = JSON.parse(d.lstfollow) || [];
            let lst2 = JSON.parse(d.lstblack) || [];
            if(+res.data === 0)
                lst = lst.filter((v,i)=>v!==target);
            else {
                lst = [...lst, target];
                lst2 = lst2.filter((v,i)=>v!==target);
            }
            d.lstfollow = JSON.stringify(lst);
            d.lstblack = JSON.stringify(lst2);
            if(sessionStorage.getItem('data') !== null)
                sessionStorage.setItem('data',JSON.stringify(d));
            else
                localStorage.setItem('data',JSON.stringify(d));


            // console.log("eong" + target);
        }).catch(error => {
            if(error.response.status === 401) {
                alert("로그인 후 사용가능한 기능입니다");
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

            let d = JSON.parse((sessionStorage.getItem('data')||localStorage.getItem('data')));
            let lst2 = JSON.parse(d.lstfollow) || [];
            let lst = JSON.parse(d.lstblack) || [];
            if(+res.data === 0)
                lst = lst.filter((v,i)=>v!==target);
            else {
                lst = [...lst, target];
                lst2 = lst2.filter((v,i)=>v!==target);
            }
            d.lstfollow = JSON.stringify(lst2);
            d.lstblack = JSON.stringify(lst);

            if(sessionStorage.getItem('data') !== null)
                sessionStorage.setItem('data',JSON.stringify(d));
            else
                localStorage.setItem('data',JSON.stringify(d));

            // console.log(data);
        }).catch(error => {
            if(error.response?.status === 401) {
                alert("로그인 후 사용가능한 기능입니다");
            } else if(error.response?.status === 403) {
                alert("메일 또는 문자인증 후 사용 가능합니다");
            } else {
                alert("알수없는 오류" + error.toString());
            }
        })
    }

    const usernickStyle = {
        fontWeight: 'bold',
        color: '#FFA500'
    }


    useEffect(() => {
        hadlememberPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.followChk,userNick]);
    return (
        <div className="mypagemainframe">
            <div className="mypageheader">
                <div className="mypageleftheader">
                    <img src={data.img ? `${bucket}/profile/${data.img}` : weplilogo}
                         alt="Profile" className="mypageuserprofile"/>
                </div>
                <div className='mypagerightheader'>
                    <div className={'mypageusernickgroup'}>
                        <div className={'mypageusernick'}>
                            <span style={usernickStyle}>{data.nick}</span>님의 마이페이지
                        </div>
                        <div className={'mypagewepliloggroup'}>
                            <img src={logo} alt={'logo'} className={'mypageweplilogo'}/>
                        </div>
                    </div>
                    <div className="userpagefollowframe">
                        <div className="userpagefollowingbox" onClick={() => showFollowingAndFollowListModal("following")}>
                            <div className="userpagefollowingtext">팔로잉</div>
                            <div className="userfollowingnumber">{data.followCnt}명</div>
                        </div>
                        <div className="userpagefollowbox" onClick={() => showFollowingAndFollowListModal("follower")}>
                            <div className="userpagefollowtext">팔로워</div>
                            <div className="userpagefollownumber">{data.followerCnt}명</div>
                        </div>
                    </div>
                    {/*팔로잉리스트*/}
                    <div className={'mypagefollowinggroup'}>
                        <div className={'userpagefollowing'} onClick={() => followToggleHandler(data.nick)}>{data.followChk === 0 ? "팔로우 추가" : "팔로우 취소"}
                            <div className={'mypagefollowtext1'}></div>
                        </div>
                    </div>
                    {/*팔로워리스트*/}
                    <div className={'mypagefollowegroup'}>
                        <div className={'userpagefollowering'} onClick={() => blackToggleHandler(data.nick)}>{data.blackChk === 0 ? "블랙 추가" : "블랙 취소"}
                            <div className={'mypagefollowertext1'}></div>
                        </div>
                    </div>

                    <div className={'mypagedescgroup'}>
                        <div className={'mypagedesctext'}>
                            <img src={message} className={'mypagemessage'}/>
                            <div className={'mypagedesctextsection'}>
                                {data.desc}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {followingAndFollowerModalOpen && <FollowingAndFollowerModal nick={data.nick} value={value} setFollowingAndFollowerModalOpen={setFollowingAndFollowerModalOpen}/>}
        </div>
    );
}

export default UserMypage;