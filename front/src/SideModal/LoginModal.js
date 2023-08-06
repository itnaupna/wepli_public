import React, { useEffect, useState } from 'react';
import "./css/loginmodal.css";
import kakao from "./photo/kakaobtn.png";
import naver_ from "./svg/naverlogin.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import arrow from "./svg/backarrow.svg";
import axios from "axios";
import { Await, useLocation, useNavigate } from "react-router-dom";
import { LoginStatusAtom } from '../recoil/LoginStatusAtom';
import { useRecoilState, useSetRecoilState } from "recoil";
import { findIdModalOpenState, FindPassModalOpen, LoginModalOpen, SignUpModalOpen } from "../recoil/FindIdModalAtom";
import FindPassModal from "./FindPassModal";
import FindIdModal from "./FindIdModal";
import { StageUrlAtom } from '../recoil/ChatItemAtom';



function LoginModal() {

    const navi = useNavigate();
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [userData, setUserData] = useState(null);

    const [loginStatus, setLoginStatus] = useRecoilState(LoginStatusAtom);
    const [loginmodalopen, setloginmodalopen] = useRecoilState(LoginModalOpen);
    const [findIdModalOpen, setFindIdModalOpen] = useRecoilState(findIdModalOpenState);
    const [findPassModalOpen, setFindPassModalOpen] = useRecoilState(FindPassModalOpen);
    const [signUpModalOpen, setSignUpModalOpen] = useRecoilState(SignUpModalOpen);
    //로그인 모달 오픈
    const showFindIdModal = async () => {
        await setloginmodalopen(false);
        setFindIdModalOpen(true);
    };

    // 비밀번호찾기 모달 오픈
    const showFindPassModal = async () => {
        await setloginmodalopen(false);
        setFindPassModalOpen(true);
    };

    // 회원가입 모달 오픈
    const showSignUpModal = async () => {
        await setloginmodalopen(false);
        setSignUpModalOpen(true);
    };

    //로그인 모달 닫는 이벤트n
    const closeModal = () => {
        setloginmodalopen(false);
    }
    const setsu = useSetRecoilState(StageUrlAtom);
    const handleLogin = (e) => {
        const url = "/api/lv0/m/login";
        axios.post(
            url,
            { email, pw, autoLogin: isChecked },
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then(res => {
            if (res.data.result === "true") {
                setLoginStatus(true);
                console.log("로그인 시 ", setLoginStatus);
                let data = JSON.stringify(res.data.data)
                isChecked ? localStorage.setItem('data', data) : sessionStorage.setItem('data', data);
                setUserData(JSON.parse(data));
                setsu(null);
                navi(window.location.pathname);
                setloginmodalopen(false);
            } else if (res.data.result === "error") {
                alert('로그인에 실패하였습니다.');
            }
        }).catch(res => {
            console.log("catch 구문", res);
            alert('아이디나 비밀번호를 확인해주세요.');
        })

    }

    // 라디오 체크 onchange
    const handleRadioChange = (e) => {
        setIsChecked(e.target.checked);
    };


    const handleInputEmail = (e) => {
        setEmail(e.target.value);
    }
    //메모
    const handleInputPw = (e) => {
        setPw(e.target.value);
    }


    const REDIRECT_URI = "https://wepli.today/auth";
    const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const handlekakao = () => {
        window.location.href = KAKAO_AUTH_URL;
    }


    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const NREDIRECT_URI = "http://localhost:3000/nlogin";
    const STATE = "1234";
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_url=${NREDIRECT_URI}`;

    const NaverLogin = () => {
        window.location.href = NAVER_AUTH_URL;

    }

    const LoginEnter = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };


    return (
        <div>
            <div className={'loginmodalmainframe'} onClick={closeModal}></div>
            <div className="loginmodalgroup">
                <div className="loginmodalheader">
                    <img className="loginbackarrowicongroup" alt="" src={arrow} onClick={closeModal} />
                    <div className="loginmodaltitlegorup">
                        <div className="loginmodalfindemailtext">WEPLi</div>
                    </div>
                    <img className="loginmodalweplilogo-icon" alt="" src={logo} />
                </div>
                <input type={'email'} className="loginmodalpassrectangle-child"
                    placeholder={'아이디를 입력해주세요'}
                    value={email} onChange={handleInputEmail} onKeyPress={LoginEnter} />
                <input type={'password'} className="loginmodalpassrectangle-child"
                    placeholder={'비밀번호를 입력해주세요'}
                    value={pw} onChange={handleInputPw} onKeyPress={LoginEnter} />
                <div className="loginmodalfindtextgroup">
                    {/*이메일 & 비밀번호 찾기*/}
                    <div className="loginmodalfindemailtext" onClick={showFindIdModal}>이메일찾기</div>
                    &nbsp;&nbsp;
                    <div className="loginmodalfindpasstext" onClick={showFindPassModal}>비밀번호 재설정</div>
                </div>
                <button type={'button'} className="loginmodalbtntext"
                    onClick={handleLogin}>로그인
                </button>
                <hr style={{ width: '80%' }} />
                <div className="loginmodalsnslogingroup">
                    <img className="kakaolgoinimg-icon" alt="" src={kakao} onClick={handlekakao} />
                    <img className="naverloginimg-icon" alt="" src={naver_} onClick={NaverLogin} />
                </div>
                <button type={'button'} className="btnShowSignup"
                    onClick={showSignUpModal}>회원가입
                </button>


            </div>

        </div>
    );
}

export default LoginModal;