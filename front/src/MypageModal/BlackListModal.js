import React, {useEffect, useState} from 'react';
import backarrow from "./svg/backarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import "./css/BlackList.css";
import {useRecoilState, useRecoilValue} from "recoil";
import {BlackMemberAtom} from "../recoil/FollowAtom";
import {BlackListModalOpen} from "../recoil/MypageModalAtom";
import axios from "axios";
import {DataState, UserStoragelstblack} from "../recoil/LoginStatusAtom";
import {useNavigate} from "react-router-dom";

function BlackListModal({target}) {

    const bucket = process.env.REACT_APP_BUCKET_URL;

    const blackMember = useRecoilValue(BlackMemberAtom);
    const [blackMember1, setBlackMember1] = useRecoilState(BlackMemberAtom);
    console.log(blackMember);
    // console.log(blackMember[0].isblack);
    const [isblackListModalOpen, setIsBlackListModalOpen] = useRecoilState(BlackListModalOpen);
    const dataState = useRecoilValue(DataState);
    const userNick = dataState.nick;


    const data = sessionStorage.getItem("data") || localStorage.getItem("data");

    const storagedata = JSON.parse(data);
    const lstblack = storagedata.lstblack;

    const closeBlackListModal = () => {
        setIsBlackListModalOpen(false);
    }

    const fValues = blackMember.map((item) => item.t);

    const [userStoragelstblack, setUserStoragelstblack] = useRecoilState(UserStoragelstblack);

    const handleBlackToggle = async (fValues, idx) => {
        const url = "/api/lv2/b/blacktoggle";

        axios({
            method : 'post',
            url: url,
            params: {target: fValues}
        }).then(res=>{
            const mypageurl = "/api/lv0/m/mypage";
            axios({
                method: 'get',
                url: mypageurl,
                data: { userNick: userNick },
            }).then(res=>{
                if(res.data){
                    alert("완료되었습니다");
                    const lstblackArray = JSON.parse(lstblack) || [];
                    const updatedLstBlack = lstblackArray.filter(name => name !== fValues);

                    if (lstblackArray.length === updatedLstBlack.length) {
                        updatedLstBlack.push(fValues);
                    }

                    const storedData = {
                        ...JSON.parse(sessionStorage.getItem("data") || localStorage.getItem("data")),
                        lstblack: JSON.stringify(updatedLstBlack)
                    };

                    if (sessionStorage.getItem("data")) {
                        sessionStorage.setItem("data", JSON.stringify(storedData));
                        setUserStoragelstblack(JSON.stringify(updatedLstBlack));
                    } else if (localStorage.getItem("data")) {
                        localStorage.setItem("data", JSON.stringify(storedData));
                        setUserStoragelstblack(JSON.stringify(updatedLstBlack));
                    }

                    const updatedBlackMember = [...blackMember];
                    updatedBlackMember[idx] = { ...updatedBlackMember[idx], isblack: res.data };
                    setBlackMember1(updatedBlackMember);
                }else {

                }
            })

        }).catch(error => {
            alert(error);
        })
    }

    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    const clickImgHandler = (target) => {
        setIsBlackListModalOpen(false);
        if(nickname === target) {
            navigate("/mypage");
        } else {
            navigate(`/mypage/${target}`);
        }
    }

    useEffect(() => {
        setUserStoragelstblack(userStoragelstblack);
    }, [userNick,userStoragelstblack]);

    return (
        <div>
            <div className="blacklistmodalframe" onClick={closeBlackListModal}></div>
                <div className="blacklistmodalwapper">
                    <div className="blacklistmodalgroup">
                        <div className="blacklistmodallayout">
                            <div className="blacklistmodalheader">
                                <img
                                    className="blacklistmodalmodalarrow-icon"
                                    alt=""
                                    src={backarrow}
                                    onClick={closeBlackListModal}
                                />
                                <div className="blacklistmodaltitle">
                                    <div className="blacklistmodalwepli">WEPLi</div>
                                </div>
                                <img
                                    className="blacklistmodalwplieonlylogo-5-icon"
                                    alt=""
                                    src={logo}
                                />
                            </div>
                            <div className="blacklistmodalveticalframe">
                                {
                                    blackMember.map((item,idx)=> (
                                <div className="blacklistmodallist" key={idx}>
                                    <img
                                        className="blacklistmodalthumbnail-icon"
                                        alt=""
                                        src={item.img ? `${bucket}/profile/${item.img}` : logo}
                                        onError={(e) => (e.target.src = logo)}
                                        onClick={(e) => clickImgHandler(item.t)}
                                    />

                                    <div className="blacklistmodalinfogroup">
                                        <div className="blacklistmodalmembernicknamete">
                                            {item.t}
                                        </div>
                                        <div className="blacklistmodalmembercounttext">
                                            팔로워 {item.cnt}
                                        </div>
                                    </div>
                                    <div className="blacklistmodalbtngroup">
                                        <div className="blacklistmodalbtnsection">
                                            <div className="blacklistmodalblackbtnframe">
                                                <div className="blacklistmodalblackbtnrectangl"/>
                                                <button type={'button'} className="blacklistmodalblackbtntext"
                                                    value={idx}    onClick={(e)=> handleBlackToggle(item.t, e.target.value)}>
                                                    {item.isblack === 0 ? "추가" : "삭제"}</button>
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

export default BlackListModal;