import React, {useEffect, useState} from 'react';
import "./css/SignUpModal.css";
import arrow from "./svg/backarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import btnarrow from "./svg/btnarrow.svg";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import { emailState, socialtypeState } from '../recoil/FindIdModalAtom';
import { emailRegexAtom, passwordRegexAtom } from '../recoil/LoginStatusAtom';

function SignUpModal({setSignUpModalOpen}) {
    const navigate = useNavigate();


    const [socialEmail, setSocialEmail] = useRecoilState(emailState);
    const [socialtype, setSocialtype] = useRecoilState(socialtypeState);
    const [isSocial, setIsSocial] = useState(false);

    const [nick, setNick] = useState("");
    const [pw, setPw] = useState("");
    const [email, setEmail] = useState("");
    const [isNickValid, setIsNickValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [pwConfirm, setPwConfirm] = useState("");
    const [isNickChecked, setIsNickChecked] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const emailRegEx = useRecoilValue(emailRegexAtom);
    const passwordRegEx = useRecoilValue(passwordRegexAtom);

    const closeFindIdModal = () => {
        setSocialEmail(null);
        setSocialtype(null);
        setSignUpModalOpen(false);
    };

    const handleInputemail = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        setIsEmailValid(emailRegEx.test(inputEmail));
        setIsEmailChecked(false);
    };

    const handleInputnick = (e) => {
        setNick(e.target.value);
        setIsNickChecked(false);
    };

    const handleInputPw = (e) => {
        const inputPw = e.target.value;
        setPw(inputPw);
        console.log(passwordRegEx.test(pw));
    };

    const handleInputPwConfirm = (e) => {
        setPwConfirm(e.target.value);
    };

    // 회원가입
    const signUpSubmit = async () => {
        const url = "/api/lv0/m/member";

        // 닉네임 중복확인 여부 체크
        if (!isNickChecked) {
            alert("닉네임 중복확인을 해주세요.");
            return;
        }

        // 이메일 중복확인 여부 체크
        if (!isEmailChecked) {
            alert("이메일 중복확인을 해주세요.");
            return;
        }

        // 닉네임 유효성 검사
        if (!isNickValid) {
            alert("닉네임을 확인해주세요.");
            return;
        }
        if(!isSocial) {
            // 이메일 유효성 검사
            if (!isEmailValid) {
                alert("이메일을 확인해주세요.");
                return;
            }

            // 이메일 및 비밀번호 입력 여부 검사
            if (!email || !pw || !nick) {
                alert("이메일과 비밀번호를 입력해주세요.");
                return;
            }

            // 비밀번호 정규식
            if (!passwordRegEx.test(pw)) {
                alert("비밀번호는 영문 숫자로 구성된 8~20자여야 합니다.");
                setPw("");
                setPwConfirm("");
                return;
            }

            // 비밀번호 일치하지 않을 때
            if (pw !== pwConfirm) {
                alert("비밀번호가 틀렸습니다. 다시 입력해주세요");
                setPw("");
                setPwConfirm("");
                return;
            }
        }
        try {
            const res = await axios.post(url, {email, pw: pw, nick, socialtype: socialtype});
            // console.log("호출해용2222");
            if (res.data) {
                // alert("회원가입됨");
                await setSignUpModalOpen(false);
                // window.location.reload();
                navigate("/");
            } else {
                alert("다시 입력해주십쇼 -_-");
            }
        } catch (error) {
            // console.log(error);
            // alert(error);
        }
    };

    // 닉네임 중복체크
    const checkNick = async () => {
        const url = "/api/lv0/m/nick";

        if (nick.length > 10) {
            alert("닉네임은 최대 10글자까지 입력할 수 있습니다.");
            setNick("");
            setIsNickValid(false);
            setIsNickChecked(false);
            return;
        }
        try {
            const res = await axios.get(url, { params: { nick } });
            console.log(res.data);
            if (res.data === true) {
                alert("이미 사용중인 닉네임입니다.");
                setIsNickValid(false);
                setIsNickChecked(false);
            } else {
                console.log(res.data);
                alert("사용가능한 닉네임입니다.");
                setIsNickValid(true);
                setIsNickChecked(true);
            }
        } catch (err) {
            console.log(`err: ${err}`);
            alert(`err: ${err}`);
        }
    };


    // 이메일 중복체크
    const checkEmail = async () => {
        const url = "/api/lv0/m/email";

        // 이메일 유효성 검사
        if (!emailRegEx.test(email)) {
            alert("이메일형식에 맞춰 작성해주세요.");
            setEmail("");
            setIsEmailValid(false);
            setIsEmailChecked(false);
            return;
        }

        try {
            const res = await axios.get(url, {params: {email}});
            if (res.data === true) {
                alert("이미 사용중인 이메일입니다.");
                setIsEmailValid(false);
                setIsEmailChecked(false);
            } else {
                alert("사용가능한 이메일입니다.");
                setIsEmailValid(true);
                setIsEmailChecked(true);
            }
        } catch (error) {
            alert("이메일 중복체크 에러", error);
        }
    };

    useEffect(() => {
        if(socialEmail != null && socialtype != null) {
            setEmail(socialEmail);
            setIsSocial(true);
            setIsEmailValid(true);
            setIsEmailChecked(true);
            console.log("signup",socialEmail);
            console.log("signup",socialtype);
        }
    }, [socialEmail, socialtype])

    const SignEnter = (e) =>{
        if (e.key === 'Enter') {
            signUpSubmit();
        }
    };



    return (
        <div>
            <div className="signupmodalframe" onClick={closeFindIdModal}></div>
            <div className="signupmodalgroup">
                <div className="signupmodalheader">
                    <div className="signupmodaltitlegroup">
                        <div className="signupmodaltitle">WEPLi</div>
                    </div>
                    <img
                        className="signupmodalarrowgroup-icon"
                        alt=""
                        src={arrow}
                        onClick={closeFindIdModal}
                    />
                    <img
                        className="signupmodalweplilogo-icon"
                        alt=""
                        src={logo}
                    />
                </div>
                <div className="signupcentertextgroup">
                    <div className="signupcentertext">회원가입</div>
                </div>

                {/* 이메일 입력 */}
                <div className="signupinputemailgroup">
                    <input
                        className="signupduplicationinputemail"
                        placeholder={'이메일을 입력해주세요'}
                        onChange={handleInputemail}
                        value={email}
                        name="email"
                        type="email"
                        readOnly = {isSocial ? true : false}
                        onKeyPress={SignEnter}
                    />
                    { isSocial ? "" :
                        <div className="signupemailbtngroup">
                            <button onClick={checkEmail} className="signupduplicationemailnbtn">
                                중복확인
                            </button>
                        </div>
                    }
                </div>

                {/* 닉네임 입력 */}
                <div className="signupinputemailgroup">
                    <input
                        className="signupduplicationinputemail"
                        placeholder={'닉네임을 입력해주세요'}
                        onChange={handleInputnick}
                        value={nick}
                        name="nick"
                        type="text"
                        onKeyPress={SignEnter}
                    />
                    <div className="signupemailbtngroup">
                        <button onClick={checkNick} className="signuemailduplicationbtn">
                            중복확인
                        </button>
                    </div>
                </div>

                {/* 비밀번호 입력 */}
                {
                    isSocial ? "" :
                        <div className="signupinputemailgroup">
                            <input
                                className="signupduplicationinputemail"
                                placeholder={'비밀번호를 입력해주세요'}
                                onChange={handleInputPw}
                                value={pw}
                                name="pw"
                                type="password"
                                onKeyPress={SignEnter}
                            />
                        </div>
                }
                {
                    isSocial ? "" :
                        <div className="signupinputemailgroup">
                            <input
                                className="signupduplicationinputemail"
                                placeholder={'비밀번호를 한번 더 입력해주세요'}
                                type="password"
                                value={pwConfirm}
                                name="pwConfirm"
                                onChange={handleInputPwConfirm}
                                onKeyPress={SignEnter}
                            />
                        </div>
                }


                {/* 회원가입 버튼 */}
                <div className="signupmodalbottombtngroup">
                    <div className="signupmodalbottombtn">
                        <div className="signupmodalbottombtnrectangle"/>signUpSubmit
                        <button
                            type="button"
                            className="signupmodalbottombtntext"
                            onClick={signUpSubmit}
                        >
                            회원가입
                        </button>
                    </div>

                    <img
                        className="signupmodalbottomarrow-icon"
                        alt=""
                        src={btnarrow}
                    />
                </div>
            </div>
        </div>
    );
}

export default SignUpModal;