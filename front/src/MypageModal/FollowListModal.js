import React, { useEffect, useState } from 'react';
import "./css/FollowListModal.css";
import backarrow from "./svg/backarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import axios from "axios";
import {useRecoilState, useRecoilValue} from "recoil";
import {BlackMemberAtom, FollowListAtom, FollowMemberAtom, TargetMemberAtom} from "../recoil/FollowAtom";
import weplilogo from "./photo/weplieonlylogoonlylogo.png";
import {UserStoragelstblack, UserStoragelstfollow} from "../recoil/LoginStatusAtom";
import {useNavigate} from "react-router-dom";

function FollowListModal({ setisFollowListModalOpen }) {

    const closeFollowListModal = async () => {
        await setisFollowListModalOpen(false);
    }


    const followMember = useRecoilValue(FollowMemberAtom);
    /*const [followMember, setFollowMember] = useRecoilState(FollowMemberAtom);*/
    const [followMember1, setFollowMember] = useRecoilState(FollowMemberAtom);

    const tValues = followMember.map((item) => item.t);
    console.log("t 값들", tValues);
    const data = sessionStorage.getItem("data") || localStorage.getItem("data");

    const storagedata = JSON.parse(data);
    const usernick = storagedata.nick;
    console.log("팔로우리스트",storagedata);
    const lstfollow = storagedata.lstfollow;
    const lstblack = storagedata.lstblack;
    console.log("팔로우 팔로우",lstfollow);


    const bucket = process.env.REACT_APP_BUCKET_URL;

    const blackMember = useRecoilValue(BlackMemberAtom);
    const [blackMember1, setBlackMember] = useRecoilState(BlackMemberAtom);
    const [userStoragelstblack, setUserStoragelstblack] = useRecoilState(UserStoragelstblack);

    const handleBlackToggle = async (fValues, idx) => {
        const url = "/api/lv2/b/blacktoggle";
        const mypageurl = "/api/lv0/m/mypage";
        axios({
            method : 'post',
            url: url,
            params: {target: fValues}
        }).then(res=>{
            axios({
                method:'get',
                url: mypageurl,
                data: {userNick: usernick},
            }).then(res=>{
                if(res.data){

                    console.log("cnt",res.data);
                    alert("블랙되었습니다");
                    const lstblackArray = JSON.parse(lstblack) || [];
                    const updatedLstBlack = lstblackArray.filter(name => name !== fValues);
                    const lstfollowArray = JSON.parse(lstfollow);
                    const updatedLstFollow = lstfollowArray.filter(name => name !== fValues);

                    if (lstfollowArray.length === updatedLstFollow.length) {
                        updatedLstFollow.push(fValues);
                    }

                    if (lstblackArray.length === updatedLstBlack.length) {
                        updatedLstBlack.push(fValues);
                    }

                    const storedData = {
                        ...JSON.parse(sessionStorage.getItem("data") || localStorage.getItem("data")),
                        lstblack: JSON.stringify(updatedLstBlack),
                        lstfollow: JSON.stringify(updatedLstFollow)
                    };

                    if (sessionStorage.getItem("data")) {
                        sessionStorage.setItem("data", JSON.stringify(storedData));
                        setUserStoragelstblack(JSON.stringify(updatedLstBlack));
                        setuserStoragelstfollow(JSON.stringify(updatedLstFollow));
                    } else if (localStorage.getItem("data")) {
                        localStorage.setItem("data", JSON.stringify(storedData));
                        setUserStoragelstblack(JSON.stringify(updatedLstBlack));
                        setuserStoragelstfollow(JSON.stringify(updatedLstFollow));
                    }

                    const updatedBlackMember = [...blackMember];
                    updatedBlackMember[idx] = { ...updatedBlackMember[idx], isblack: res.data };
                    setBlackMember(updatedBlackMember);

                    const updatedFollowMember = [...followMember];
                    updatedFollowMember[idx] = { ...updatedFollowMember[idx], isblack: res.data };
                    setFollowMember(updatedFollowMember);
                    console.log(res.data);
                }else{
                    alert("오류");
                }
            })
        }).catch(error => {
            alert(error);
        })
    }


    const targetMember= useRecoilValue(TargetMemberAtom);
    const [targetMember1, setTargetMember] = useRecoilState(TargetMemberAtom);
    const [userStoragelstfollow, setuserStoragelstfollow] = useRecoilState(UserStoragelstfollow);

    const handleDeFollow = async (fValues, idx) => {
        const url = "/api/lv2/f/followtoggle";

        axios({
            method: "post",
            url: url,
            params: { target: fValues },
        })
            .then((res) => {
                const mypageurl = "/api/lv0/m/mypage";
                axios({
                    method: "get",
                    url: mypageurl,
                    data: { userNick: usernick },
                }).then((response) => {
                    alert("언팔되었습니다");
                    if (response.data) {
                        let newFollowerCount = followMember[idx].cnt;
                        if (followMember[idx].isfollow === 0) {
                            newFollowerCount++;
                        } else {
                            newFollowerCount--;
                        }

                        const updatedFollowMember = [...followMember];
                        updatedFollowMember[idx] = {
                            ...updatedFollowMember[idx],
                            cnt: newFollowerCount,
                            isfollow: res.data,
                        };
                        setFollowMember(updatedFollowMember);

                        const lstfollowArray = JSON.parse(lstfollow);
                        const updatedLstFollow = lstfollowArray.filter((name) => name !== fValues);

                        if (lstfollowArray.length === updatedLstFollow.length) {
                            updatedLstFollow.push(fValues);
                        }

                        const storedData = {
                            ...JSON.parse(sessionStorage.getItem("data") || localStorage.getItem("data")),
                            lstfollow: JSON.stringify(updatedLstFollow),
                        };

                        if (sessionStorage.getItem("data")) {
                            sessionStorage.setItem("data", JSON.stringify(storedData));
                            setuserStoragelstfollow(JSON.stringify(updatedLstFollow));
                        } else if (localStorage.getItem("data")) {
                            localStorage.setItem("data", JSON.stringify(storedData));
                            setuserStoragelstfollow(JSON.stringify(updatedLstFollow));
                        }

                        const updatedUnFollow = [...targetMember];
                        updatedUnFollow[idx] = { ...updatedUnFollow[idx], isfollow: res.data };
                        setTargetMember(updatedUnFollow);
                    } else {
                        alert("오류");
                    }
                });
            })
            .catch((error) => {
                alert("에러");
            });
    };


    const [nickname, setNickname] = useState("");

    const clickImgHandler = (target) => {
        setisFollowListModalOpen(false);
        if(nickname === target) {
            navigate("/mypage");
        } else {
            navigate(`/mypage/${target}`);
        }
    }

    const navigate = useNavigate();


    useEffect(() => {
        setuserStoragelstfollow(userStoragelstfollow);
        setUserStoragelstblack(userStoragelstblack);
    }, [userStoragelstfollow, userStoragelstblack]);


    return (
        <div>
            <div className="followmodalframe" onClick={closeFollowListModal}></div>

                <div className="followmodalwapper">
                    <div className="followmodalgroup">
                        <div className="followmodallayout">
                            <div className="followmodalheader">
                                <img
                                    className="followmodalmodalarrow-icon"
                                    alt=""
                                    src={backarrow}
                                    onClick={closeFollowListModal}
                                />
                                <div className="followmodaltitle">
                                    <div className="followmodalwepli">WEPLi</div>
                                </div>
                                <img
                                    className="followmodalwplieonlylogo-5-icon"
                                    alt=""
                                    src={logo}
                                />

                            </div>
                            <div className="followmodalveticalframe">
                                {
                                    followMember.map((item,idx) => (
                                <div className="followmodallist" key={idx}>
                                    <img
                                        className="followmodalthumbnail-icon"
                                        alt=""
                                        src={item.img ? `${bucket}/profile/${item.img}` : weplilogo}
                                        onError={(e) => (e.target.src = weplilogo)}
                                        onClick={(e) => clickImgHandler(item.t)}
                                    />

                                    <div className="followmodalinfogroup">
                                        <div className="followmodalmembernicknametext">
                                            {item.t}
                                        </div>
                                        <div className="followmodalmembercounttext">
                                            팔로워 {item.cnt}
                                        </div>
                                    </div>
                                    <div className="followmodalbtngroup">
                                        <div className="followmodalbtnsection">
                                            <div className="followmodalblackbtnframe">
                                                <div className="followmodalblackbtnrectangle" />
                                                <button type={'button'} className="followmodalblackbtntext" value={idx}
                                                        onClick={(e) => handleBlackToggle(item.t,e.target.value)}>
                                                    {item.isblack === 0 ? "블랙취소" : "블랙"}
                                                </button>
                                            </div>
                                            <div className="followmodalfollowbtnframe">
                                                <div className="followmodalfollowbtnrectangle" />
                                                <button type={'button'} className="followmodalfollowbtntext" value={idx}
                                                onClick={(e)=> handleDeFollow(item.t,e.target.value)}>
                                                    {item.isfollow === 0 ? "팔로우" : "언팔"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default FollowListModal;
