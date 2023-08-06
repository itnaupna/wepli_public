import React, {useState} from 'react';
import "./css/EmailConfirm.css";
import backarrow from "./svg/backarrow.svg";
import btnarrow from "./svg/btnarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import axios from "axios";
import {useRecoilState, useRecoilValue} from "recoil";
import {emailConfirmState, UserStorageEmailConfirm, UserStorageEmailconfrim} from "../recoil/LoginStatusAtom";

function EmailConfirmModal({setisEmailConfirmModalOpen}) {

    const [verifyKey, setVerifyKey] = useState('');
    const [resultRV, setResultRV] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [resultVerify, setResultVerify] = useState(false);

    // const data = sessionStorage.getItem("data") || localStorage.getItem("data");
    // console.log("데이터",data);
    // const parsedata = JSON.parse(data);
    // console.log(parsedata);
    // const emailconfirm = parsedata.emailconfirm;
    // console.log(emailconfirm);

    // 인증번호 전송
    const handleRequestCode = async () => {
        if(!verifyKey){
            alert('정보를 입력해주세요');
            return;
        }
        const url = "/api/lv1/m/requestcode";
        try{
            const res = await axios
                .post(url,{key: verifyKey });
            if(res.data === true){
                console.log(res);
                alert("인증번호 전송 완료");
                setResultRV(res.data);
            }else {
                alert("이미 인증된 이메일입니다.");
            }
        }catch (error){
            console.log(error);
        }
    }


    // 인증번호 검수
    const handleVerifyCode = async ()=>{
        if(!verifyCode){
            alert('정보를 입력해주세요');
            return;
        }
        const url = "/api/lv1/m/verifycode";
        try{
            const res = await axios.post(url,{key:verifyKey,code:verifyCode});
            if(res.data === true){
                const data= JSON.parse(sessionStorage.getItem('data') || localStorage.getItem("data"));
                data.emailconfirm = 1;

                if (sessionStorage.getItem('data')) {
                    sessionStorage.setItem('data', JSON.stringify(data)); // sessionStorage에 저장
                } else {
                    localStorage.setItem('data', JSON.stringify(data)); // localStorage에 저장
                }

            setResultVerify(res.data);
            alert("인증완료");
            closeEmailConfirmModal();
            }else{
                alert("인증실패");

            }
        }catch(error){
            alert(error);
        }
    }

    const closeEmailConfirmModal = async () => {
        await setisEmailConfirmModalOpen(false);
    }

    const EmailConfirmEnter = (e) =>{
        if (e.key === 'Enter') {
            handleVerifyCode();
        }
    };


    return (
        <div>
            <div className="emailconfirmmodalframe" onClick={closeEmailConfirmModal}></div>
                <div className="emailconfirmmodalgroup">
                    <div className="emailconfirmmodalheader">
                        <div className="emailconfirmmodaltitlegroup">
                            <div className="emailconfirmmodaltitle">WEPLi</div>
                        </div>
                        <img
                            className="emailconfirmmodalarrowgroup-icon"
                            alt=""
                            src={backarrow}
                            onClick={closeEmailConfirmModal}
                        />
                        <img
                            className="emailconfirmmodalweplilogo-icon"
                            alt=""
                            src={logo}
                        />
                    </div>
                    <div className="emailconfirmmodaltextgroup">
                        <div className="emailconfirmmodalcentertext">이메일 본인인증</div>
                    </div>
                    <div className="emailconfirmmodalemailinputgro">
                        <input type={'email'} className="emailconfirmmodalemailinput"
                               value={verifyKey} onChange={(e) => setVerifyKey(e.target.value)}
                               onKeyPress={EmailConfirmEnter}></input>
                    </div>
                    <div className="emailconfirmemailbtngroup">
                        <div className="emailconfirmsendbtn" />
                        <button type={'button'} className="emailconfirmemailbtntext"
                         onClick={handleRequestCode}>전송</button>
                    </div>
                    <div className="emailconfirmmodalemailinputgro">
                        <input type={'text'} value={verifyCode} onChange={(e)=>setVerifyCode(e.target.value)} className="emailconfirmmodalemailinput"
                        onKeyPress={EmailConfirmEnter}></input>
                    </div>
                    <div className="emailconfirmemailbtngroup">
                        <div className="emailconfirmsendbtn" />
                        <button type={'button'} className="emailconfirmemailbtntext"
                        onClick={handleVerifyCode}>확인</button>
                    </div>
                    <div className="emailconfirmmodalbtngroup">
                        <div className="emailconfirmmypagebtn">
                            <div className="emailconfirmmodalbtnrectangle" />
                            <button type={'button'} className="emailconfirmmodalbtntext">본인인증</button>
                        </div>
                        <img
                            className="emailconfirmmodalbtnarrow-icon"
                            alt=""
                            src={btnarrow}
                        />
                    </div>
                </div>
        </div>
    );

}

export default EmailConfirmModal;