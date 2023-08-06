import React, {useEffect, useState} from 'react';
import "./css/InfoChangeModal.css";
import backarrow from "./svg/backarrow.svg";
import btnarrow from "./svg/btnarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import {UserStorageNick} from "../recoil/LoginStatusAtom";
import {useRecoilState, useRecoilValue} from "recoil";
import axios from "axios";
import {emailState} from "../recoil/LoginStatusAtom";
function InfoChageModal({setIsInfoChangeModalOpen}) {

    const [nick, setNickName] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [userStorageNick, setUserStorageNick] = useRecoilState(UserStorageNick);

    const closeInfoChangeModal = async () => {
        await setIsInfoChangeModalOpen(false);
    }

    const handleInputNick = (e) => {
        setNickName(e.target.value);
    }

    const handleInputEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleInputPw = (e) => {
        setPw(e.target.value);
    }

    const data = sessionStorage.getItem("data") || localStorage.getItem("data");

    const storagedata = JSON.parse(data);
    const usernick = storagedata.nick;
    const useremail = storagedata.email;
    const emailconfirm = storagedata.emailconfirm;
    const [prevEmail, setPrevEmail] = useState('');

    useEffect(() => {
        const data = sessionStorage.getItem('data') || localStorage.getItem('data');
        if (data) {
            const parsedData = JSON.parse(data);
            setPrevEmail(parsedData.email);
        }
    }, [prevEmail]);

    const handleinfoChnage = async () => {
        const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (nick.length > 10) {
            alert("닉네임은 최대 10글자까지 입력할 수 있습니다.");
            return;
        }

        if (!pw) {
            alert("회원정보를 입력해주세요");
            return;
        }

        const selectedEmail = emailconfirm === 1 ? useremail : email;

        // emailconfirm이 0일 경우, 입력된 이메일 값 검증 후, 올바른 형식의 이메일인지 확인
        if (emailconfirm !== 1) {
            if (!selectedEmail) {
                alert("이메일을 입력해주세요");
                return;
            } else if (!emailRegex.test(selectedEmail)) {
                alert("유효한 이메일 주소를 입력해주세요");
                return;
            }
        }

        const url = "/api/lv1/m/info";
        const requestData = {
            email: selectedEmail, // Use selectedEmail
            newNick: nick,
            pw: pw,
        };

        try {
            const res = await axios.patch(url, requestData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.data) {
                const mypageurl = "/api/lv0/m/mypage";
                const res2 = await axios.get(mypageurl, { data: { userNick: nick } });

                if (res2.data) {
                    const storedData = JSON.parse(sessionStorage.getItem("data") || localStorage.getItem("data")) || {};
                    storedData.nick = res2.data.nick;
                    storedData.email = res2.data.email;

                    const newData = JSON.stringify(storedData);
                    console.log("이미지" + newData);
                    sessionStorage.setItem("data", newData);
                    setUserStorageNick(res2.data.nick);
                    setIsInfoChangeModalOpen(false);
                    alert('정보가 성공적으로 수정되었습니다.');
                }
            } else {
                // 첫 번째 요청이 실패한 경우
                alert('이메일 인증이 필요합니다.');
            }
        } catch (error) {
            // 요청 실패 시 처리
            console.error('요청 실패:', error);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            alert('요청에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const InfoChangeEnter = (e) =>{
        if (e.key === 'Enter') {
            handleinfoChnage();
        }
    };

    useEffect(()=>{
        setUserStorageNick(userStorageNick);
    },[userStorageNick]);
    return (
        <div>
            <div className="mypageinfochangemodalframe" onClick={closeInfoChangeModal}></div>
            <div className="mypageinfochangemodalgroup">
                <div className="mypageoutmemebermodalheader">
                    <div className="mypageinfochangemodaltitlegrou">
                        <div className="mypageinfochangemodaltitle">WEPLi</div>
                    </div>
                    <img
                        className="mypageinfochangemodalarrowgrou-icon"
                        alt=""
                        src={backarrow}
                        onClick={closeInfoChangeModal}
                    />
                    <img
                        className="mypageinfochangemodalweplilogo-icon"
                        alt=""
                        src={logo}
                    />
                </div>
                <div className="mypageinfochangermodaltextgrou">
                    <div className="mypageinfochangemodalcentertex">회원정보수정</div>
                </div>

                {/*이메일 입력*/}
                <div className="mypageinfochangemodalpassnickn">
                    <input placeholder={
                        emailconfirm !== 1
                            ? '이메일을 입력해주세요'
                            : '이미 이메일이 인증이되어 변경할 수 없습니다.'
                    } className="mypageinfochangemodalnicknamei"
                           value={email} onChange={handleInputEmail} onKeyPress={InfoChangeEnter} readOnly={emailconfirm === 1}></input>
                </div>

                {/*닉네임 입력*/}
                <div className="mypageinfochangemodalpassnickn">
                    <input placeholder={'닉네임을 입력해주세요'} className="mypageinfochangemodalnicknamei"
                           value={nick} onChange={(e)=>setNickName(e.target.value)} onKeyPress={InfoChangeEnter}></input>
                </div>

                {/*비밀번호 입력*/}
                <div className="mypageinfochangemodalpassnickn">
                    <input placeholder={'비밀번호를 입력해주세요'} className="mypageinfochangemodalnicknamei"
                           value={pw} type={'password'} onChange={handleInputPw} onKeyPress={InfoChangeEnter}></input>
                </div>

                {/*정보수정 버튼*/}
                <div className="mypageinfochangemodalbtngroup">
                    <div className="mypageinfochangemodalmypagebtn">
                        <div className="mypageinfochangemodalbtnrectan"/>
                        <button type={'button'} className="mypageinfochangemodalbtntext"
                                onClick={handleinfoChnage}>회원정보수정</button>
                    </div>
                    <img
                        className="mypageinfochangemodalbtnarrow-icon"
                        alt=""
                        src={btnarrow}
                    />
                </div>
            </div>
        </div>
    );

}

export default InfoChageModal;