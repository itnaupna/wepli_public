import React, { useEffect } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { LoginStatusAtom } from './recoil/LoginStatusAtom';
import { SignUpModalOpen, emailState, socialtypeState } from './recoil/FindIdModalAtom';
import { useNavigate } from "react-router-dom";
import "./Naver.css";


function NaverCallback() {
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
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    axios.get(`http://localhost:3000/api/lv0/m/nlogin?code=${code}&state=${state}`)
    .then(response => {
      const token = response.data.access_token;
      if (token) {
       
        // 사용자 정보 요청
        axios.get(`http://localhost:3000/api/lv0/m/userinfo?token=${token}`)
        .then(response => {
            console.log(response.data.response); 
            const id = response.data.response.email;

            axios.post("/api/lv0/m/social", { email:id, socialtype: 'naver' })
                        .then(res => {
                                    if (res.data.result === 'true') {
                                        console.log("res.data입니당", res.data);

                                        sessionStorage.setItem("data", JSON.stringify(res.data.data));
                                        setSocialtype("naver");
                                        setLoginStatus(true);
                                        navi("/", {
                                            state: {
                                                data: response.data.response.email,
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
                                        setEmail(id);
                                        setSocialtype("naver");
                                        showSignUpModal();
                                        navi('/');
                                    } else {
                                        console.log('err : ', error.response ? error.response.status : error);
                                        console.log({ email:id, socialtype: 'naver' });
                                    }
                                });

        })
        .catch(err => console.log(err))
        
        } else {
        console.error("Access token not found");
      }
    })
    .catch(err => console.log(err))
}, []);


  return (
    <div className={'ncallback'}>
      <div className='nloading-bar'>
        Loading
      </div>
    </div>
  )
}

export default NaverCallback;