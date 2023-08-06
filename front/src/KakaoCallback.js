import React, { useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { SignUpModalOpen, emailState, socialtypeState } from './recoil/FindIdModalAtom';
import { LoginStatusAtom } from './recoil/LoginStatusAtom';
import "./Kakao.css";
function KakaoCallback() {
    const navi = useNavigate();
    const [signUpModalOpen, setSignUpModalOpen] = useRecoilState(SignUpModalOpen);
    const [email, setEmail] = useRecoilState(emailState);
    const [socialtype, setSocialtype] = useRecoilState(socialtypeState);
    const [loginStatus,setLoginStatus] = useRecoilState(LoginStatusAtom);
    // 회원가입 모달 오픈
    const showSignUpModal = async () => {
        setSignUpModalOpen(true);
    };

    useEffect(() => {
        const params = new URL(document.location.toString()).searchParams;
        const code = params.get('code');
        const grantType = "authorization_code";
        const REST_API_KEY = "9d3f5e52469d4278fcbcbc2f8a944d2c";
        const REDIRECT_URI = "https://wepli.today/auth";


        axios.get(
            `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
            {},
            { headers: { "Content-type": "application/x-www-form-urlencoded;charset=utf-8" } }
        )
            .then((res) => {
                const { access_token } = res.data;
                axios.post(
                    `https://kapi.kakao.com/v2/user/me`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                        }
                    }
                )
                    .then((res) => {
                        const { kakao_account } = res.data;
                        if (kakao_account.profile.nickname) {
                            let email = kakao_account.email;

                            axios.post("/api/lv0/m/social", { email, socialtype: 'kakao' })
                                .then(res => {
                                    if (res.data.result === 'true') {
                                        console.log("res.data입니당", res.data);
                                        sessionStorage.setItem("data", JSON.stringify(res.data.data));
                                        setLoginStatus(true);
                                        navi("/", {
                                            state: {
                                                data: kakao_account.email,
                                                }
                                            });
                                    }
                                })
                                .catch((error) => {
                                    if (error.response && error.response.status === 417) {
                                        console.log('err : 417');
                                        alert('다른 경로로 가입된 이메일입니다.');
                                        navi('/');
                                    } else if (error.response && error.response.status === 404) {
                                        console.log('err : 404');
                                        alert('가입되지않은 이메일입니다. 회원가입으로 넘어갑니다.');
                                        setEmail(email);
                                        setSocialtype("kakao");
                                        showSignUpModal();
                                        navi('/');
                                    } else {
                                        console.log('err : ', error.response ? error.response.status : error);
                                        console.log({ email, socialtype: 'kakao' });
                                    }
                                });
                        }
                    })
                    .catch((error) => {
                        console.log('err:', error);
                    });
            })
            .catch((error) => {
                console.log('err:', error);
            });
    }, []);

    return (
        <div className={'callbak'}>
        <div className="kkloading-bar">
            로그인중
        </div>
        </div>
    );
}

export default KakaoCallback;
