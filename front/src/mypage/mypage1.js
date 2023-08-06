import React, {useEffect, useState} from 'react';
import mic from "../mic.jpg";
import "./css/mypage1.css";
import logo from './photo/wplieonlylogo.png';
import message from "./svg/message.svg";
import axios from "axios";
import {useRecoilState, useRecoilValue} from "recoil";
import {
    BlackListModalOpen, BlackListOptionModalOpen, EmailConfirmModalOpen,
    FollowModalOpen,
    InfoChangeModalOpen,
    OutMemberModalOpen, PhoneConfirmModalOpen,
    TargetListModalOpen
} from "../recoil/MypageModalAtom";
import {BlackMemberAtom, FollowMemberAtom, TargetMemberAtom} from "../recoil/FollowAtom";
import {emailConfirmState, LoginStatusAtom, ProfileImageUrl, UserStorageDesc} from "../recoil/LoginStatusAtom";
import FollowListModal from "../MypageModal/FollowListModal";
import BlackListModal from "../MypageModal/BlackListModal";
import FollowerListModal from "../MypageModal/FollowerListModal";
import InfoChageModal from "../MypageModal/InfoChageModal";
import OutMemberModal from "../MypageModal/OutMemberModal";
import EmailConfirmModal from "../MypageModal/EmailConfirmModal";
import PhoneConfirmModal from "../MypageModal/PhoneConfirmModal";
import BlackListOptionModal from "../MypageModal/BlackListOptionModal";
import Axios from "axios";

function Mypage1(props) {

    const [loginStatus, setLoginStatus] = useRecoilState(LoginStatusAtom);

    const [isFollowListModalOpen, setisFollowListModalOpen] = useRecoilState(FollowModalOpen);
    const [isTargetListModalOpen, setisTargetListModalOpen] = useRecoilState(TargetListModalOpen);
    const [isBlackListModalOpen, setisBlackListModalOpen] = useRecoilState(BlackListModalOpen);
    const [isInfoChangeModalOpen, setIsInfoChangeModalOpen] = useRecoilState(InfoChangeModalOpen);
    const [isOutMemberModalOpen, setIsOutMemberModalOpen] = useRecoilState(OutMemberModalOpen);
    const [isEmailConfirmModalOpen, setisEmailConfirmModalOpen] = useRecoilState(EmailConfirmModalOpen);
    const [isPhoneConfirmModalOpen, setisPhoneConfirmModalOpen] = useRecoilState(PhoneConfirmModalOpen);
    const [isBlackListOptionModalOpen, setisBlackListOptionModalOpen] = useRecoilState(BlackListOptionModalOpen);
    const [followMember, setFollowMember] = useRecoilState(FollowMemberAtom);
    const [targetMember, setTargetMember] = useRecoilState(TargetMemberAtom);
    const [blackMember, setBlackMember] = useRecoilState(BlackMemberAtom);

    const [value, setvalue] = useState("");

    const [profileImageUrl, setProfileImageUrl] = useRecoilState(ProfileImageUrl);
    const [desc, setUserDescInput] = useState('');

    const data = sessionStorage.getItem('data') || localStorage.getItem('data');
    let userNick = '';
    let profile = '';

    if (data) {
        const parsedData = JSON.parse(data);
        userNick = parsedData.nick;
        profile = parsedData.img;
        console.log(userNick);
    }

    const parse = JSON.parse(data);
    const usernick = parse.nick;
    const userdesc = parse.desc;

    const parsedData = JSON.parse(data);
    const emailconfirm = parsedData.emailconfirm;
    const phoneconfirm = parsedData.phoneconfirm;


    const bucket = process.env.REACT_APP_BUCKET_URL;

    const showOutMemberModal = () => {
        setIsOutMemberModalOpen(true);
    };

    const showInfoChangeModal = () => {
        setIsInfoChangeModalOpen(true);
    }

    const showEmailConfirmModal = () => {
        setisEmailConfirmModalOpen(true);
    }

    const showPhoneConfirmModal = () => {
        setisPhoneConfirmModalOpen(true);
    }

    const showBlackListOptionModal = () => {
        setisBlackListOptionModalOpen(true);
    }

    const showFollowListModal = (target) => {
        setisFollowListModalOpen(true);
        const url = "/api/lv2/f/follow";

        axios
            .get(url).then(res => {
            setFollowMember(res.data);
            console.log("follow 멤버", res.data);
        });

        setvalue(target);
    }


    const showTargetListModal = (target) => {
        setisTargetListModalOpen(true);

        const url = "/api/lv2/f/follower";

        axios
            .get(url)
            .then(res => {
                setTargetMember(res.data);
                console.log("여기가 팔로워 출력" + setTargetMember);
                console.log("팔로워 출력", res);
            });
        setvalue(target);
    }

    const showBlackListModal = (target) => {
        setisBlackListModalOpen(true);
        setvalue(target);
        const url = "/api/lv2/b/blacklist";

        axios
            .get(url)
            .then(res => {
                setBlackMember(res.data);
            })

        setvalue(target);
    }


    const memberProfileChange = (e) => {
        const uploadFile = new FormData();
        const url = "/api/lv1/m/profile";
        uploadFile.append("upload", e.target.files[0]);

        axios({
            method: "post",
            url: url,
            data: uploadFile,
            headers: {"Content-Type": "multipart/form-data"}
        }).then(res => {
            const mypageurl = "/api/lv0/m/mypage";
            axios({
                method: "get",
                url: mypageurl,
                data: {userNick: userNick},
            }).then(res => {
                if (res.data) {
                    const storedData = JSON.parse(sessionStorage.getItem("data") || localStorage.getItem("data")) || {};
                    storedData.img = res.data.img;

                    const newData = JSON.stringify(storedData);
                    sessionStorage.setItem("data", newData);

                    setProfileImageUrl(res.data.img);
                } else {
                    alert("꽝");
                }
            });
        });
    };

    const [userStorageDesc, setUserStorageDesc] = useRecoilState(UserStorageDesc);

    const handleDescChange = async () => {

        if(desc.length > 50){
            alert("자기소개는 최대 50글자까지 입력 가능합니다");
            return;
        }

        const url = "/api/lv1/m/desc";
        axios({
            method: "patch",
            url: url,
            data: JSON.stringify({"desc": desc}),
            headers: {'Content-Type': 'application/json'},
        }).then(res => {
            const mypageurl = "/api/lv0/m/mypage";
            const data = {userNick: userNick}
            axios
                .get(mypageurl, data)
                .then(res => {
                    if (res.data) {
                        const storedData = JSON.parse(sessionStorage.getItem("data") || localStorage.getItem("data")) || {};
                        console.log("storedData desc true" + storedData);
                        storedData.desc = res.data.desc;

                        const newData = JSON.stringify(storedData);
                        sessionStorage.setItem("data", newData);
                        setUserStorageDesc(res.data.desc);
                        alert("변경됨");
                        setUserDescInput('');
                    } else {
                        alert("변경안됨");
                    }
                })
        })
    }

    const usernickStyle = {
        fontWeight: 'bold',
        color: '#5ea6ff'
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };

    const [userdata, setData] = useState({});
    const userEmailConfirm = useRecoilValue(emailConfirmState);

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

    useEffect(() => {
        setProfileImageUrl(profile);
        hadlememberPage();

        const itemElements = document.querySelectorAll('.mypageul li');

        if (isMenuOpen) {
            let count = 0;
            const interval = setInterval(() => {
                if (count < itemElements.length) {
                    itemElements[count].classList.add('active');
                    count++;
                } else {
                    clearInterval(interval);
                }
            }, 100);

            return () => clearInterval(interval);
        } else {
            itemElements.forEach((item) => item.classList.remove('active'));
        }

    }, [profile,isMenuOpen]);
    return (
        <div className="mypagemainframe">
            <div className="mypageheader">
                <div className="mypageleftheader">
                    <label>
                    <img src={loginStatus && profileImageUrl ? `${bucket}/profile/${profileImageUrl}` : logo}
                         alt="Profile" className="mypageuserprofile"/>
                    <input
                        type="file"
                        id="profileUpload"
                        className="file-input"
                        onChange={memberProfileChange}
                    />
                    </label>
                </div>
                <div className='mypagerightheader'>
                    <div className={'mypageusernickgroup'}>
                        <div className={'mypageusernick'}>
                            <span style={usernickStyle}>{userNick}</span>님의 마이페이지
                        </div>
                        <div className={'mypagewepliloggroup'}>
                            <img src={logo} alt={'logo'} className={'mypageweplilogo'}/>
                        </div>
                    </div>
                    {/* 팔로잉리스트 */}
                    {emailconfirm !== 0 || phoneconfirm !== 0 ? (
                        <div className="mypagefollowinggroup">
                            <div className="mypagefollowing" onClick={() => showFollowListModal("follower")}>
                                <div className="mypagefollowtext1">팔로잉 {userdata.followCnt}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="mypagefollowinggroup" onClick={() => alert("이메일 또는 휴대폰 인증을 먼저 완료해주세요.")}>
                            <div className="mypagefollowing">
                                <div className="mypagefollowtext1">팔로잉 {userdata.followCnt}</div>
                            </div>
                        </div>
                    )}

                    {/* 팔로워리스트 */}
                    {emailconfirm !== 0 || phoneconfirm !== 0 ? (
                        <div className="mypagefollowegroup" onClick={showTargetListModal}>
                            <div className="mypagefollowering">
                                <div className="mypagefollowertext1">팔로워 {userdata.followerCnt}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="mypagefollowegroup" onClick={() => alert("이메일 또는 휴대폰 인증을 먼저 완료해주세요.")}>
                            <div className="mypagefollowering">
                                <div className="mypagefollowertext1">팔로워 {userdata.followerCnt}</div>
                            </div>
                        </div>
                    )}

                    {/* 블랙리스트 */}
                    {emailconfirm !== 0 || phoneconfirm !== 0 ? (
                        <div className="mypageblackgroup" onClick={showBlackListModal}>
                            <div className="mypageblacking">
                                <div className="mypageblacktext1">블랙리스트</div>
                            </div>
                        </div>
                    ) : (
                        <div className="mypageblackgroup" onClick={() => alert("이메일 또는 휴대폰 인증을 먼저 완료해주세요.")}>
                            <div className="mypageblacking">
                                <div className="mypageblacktext1">블랙리스트</div>
                            </div>
                        </div>
                    )}
                    <div className={'mypagedescgroup'}>
                        <div className={'mypagedesctext'}>
                            <img src={message} className={'mypagemessage'}/>
                            <div className={'mypagedesctextsection'}>
                            {userdesc}
                            </div>
                        </div>
                    </div>
                    <div className={'mypagedescsection'}>
                        <div className={"input-container"}>
                        <input className={'mypagedescinput'} type="text"
                            value={desc}
                            onChange={(e) => setUserDescInput(e.target.value)}
                               placeholder={"자기소개 변경이 가능합니다"}
                        />
                            <div className="highlight"></div>
                        </div>

                        <div className="mypagedescbtngroup">
                            <button type="button" onClick={handleDescChange} className="mypagedescchangebtn">
                                <span className="button-content">변경 </span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className={'mypagelinergroup'}></div>
            <div className={'mypagelistmenu'}>
                <button className="hamburger-button" onClick={handleMenuToggle}>메뉴</button>
                <ul className={`mypageul ${isMenuOpen ? 'open' : ''}`}>
                    <li onClick={showInfoChangeModal}>
                        회원 정보 수정
                    </li>
                    {emailconfirm=== 1 ?
                        <li onClick={emailconfirm === 1 ? null : showEmailConfirmModal}>
                            이메일 인증 완료
                        </li> :
                        <li onClick={showEmailConfirmModal}>
                            이메일 인증
                        </li>
                    }
                    {phoneconfirm === 1 ?
                        <li onClick={phoneconfirm === 1 ? null : showPhoneConfirmModal}>
                            전화번호 인증 완료
                        </li> :
                        <li onClick={showPhoneConfirmModal}>
                            전화번호 인증
                        </li>
                    }

                    <li onClick={showBlackListOptionModal}>
                        블랙리스트 옵션
                    </li>

                    <li onClick={showOutMemberModal}>
                        회원탈퇴
                    </li>
                </ul>
            </div>
            {isEmailConfirmModalOpen &&
                <EmailConfirmModal setisEmailConfirmModalOpen={setisEmailConfirmModalOpen}/>}
            {isPhoneConfirmModalOpen &&
                <PhoneConfirmModal setisPhoneConfirmModalOpen={setisPhoneConfirmModalOpen}/>}
            {isBlackListOptionModalOpen &&
                <BlackListOptionModal setisBlackListOptionModalOpen={setisBlackListOptionModalOpen}/>}
            {isOutMemberModalOpen && <OutMemberModal setIsOutMemberModalOpen={setIsOutMemberModalOpen}/>}
            {isInfoChangeModalOpen && <InfoChageModal setIsInfoChangeModalOpen={setIsInfoChangeModalOpen}/>}
            {isBlackListModalOpen && <BlackListModal setisBlackListModalOpen={setisBlackListModalOpen} nick={data.nick}/>}
            {isTargetListModalOpen && <FollowerListModal setisTargetListModalOpen={setisTargetListModalOpen} nick={data.nick}/> }
            {isFollowListModalOpen && (
                <FollowListModal
                    setisFollowListModalOpen={setisFollowListModalOpen}
                    followMember={followMember} nick={data.nick} value={value}
                />
            )}
        </div>
    );

}

export default Mypage1;
