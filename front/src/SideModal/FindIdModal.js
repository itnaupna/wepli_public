import React, {useState} from 'react';
import "./css/FindIdModal.css";
import arrow from "./svg/backarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import btnarrow from "./svg/btnarrow.svg";
import axios from "axios";
import FindIdSuccessModal from "./FindIdSuccessModal";
import {useRecoilState} from "recoil";
import {findIdModalOpenState, findIdSuccessModalOpenState, recoveredEmailState} from "../recoil/FindIdModalAtom";
import { useNavigate } from 'react-router-dom';

function FindIdModal() {
    const closeFindIdModal =  async() => {
        await setFindPassModalOpen(false);
    }

    const [recoveredEmail, setRecoveredEmail] = useRecoilState(recoveredEmailState);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyKey, setVerifyKey] = useState('');
    const [resultRV, setResultRV] = useState(false);
    const [findIdSuccessModalOpen,setfindIdSuccessModalOpen] =useRecoilState(findIdSuccessModalOpenState);
    const [findIdMOdalOpen, setFindPassModalOpen]= useRecoilState(findIdModalOpenState);


    const handleRequestCodeFind = async () => {
        const url = "/api/lv0/m/requestcode";

        if(!verifyKey){
            alert("번호를 입력해주세요");
            return;
        }

        try {
            const res = await axios.post(url, { type: 1, key: verifyKey });
            console.log("아이디 찾기",res);
            if (res.data === true) {
                setResultRV(res.data);
                alert("인증번호를 전송했습니다.");
            } else {
                console.log(res.data);
                console.log(res);
                alert("실패");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 405) {
                    console.log(error.response);
                    alert("405");
                } else {
                    alert(error.response.data);
                }
            } else {
                alert(error.message);
            }
        }
    };

    const navi = useNavigate()

    const handleVerifyCodeFind = async ()=>{
        if(!verifyCode){
            alert("정보를 입력해주세요");
            return;
        }
        const url = "/api/lv0/m/verifycodefind";
        try {
            const res = await axios.post(url,{type:1, key:verifyKey,code:verifyCode, authType:"findId"});
            console.log("인증번호",res);
            if (res.data) {
                setRecoveredEmail(res.data);
                await setFindPassModalOpen(false);
                setfindIdSuccessModalOpen(true);
                alert('인증이 완료되었습니다.');
            } else {
                console.log(res.data);
                setRecoveredEmail(null);
                alert('해당 전화번호로 가입된 아이디가 없습니다.');
            }
        } catch(error) {
            alert(error);
        }
    }

    const FindidEnter = (e) =>{
        if (e.key === 'Enter') {
            handleVerifyCodeFind();
        }
    };

    return (
        <div>
            <div className="findidmodalframe" onClick={closeFindIdModal}></div>
            <div className="findidmodalgroup">
                <div className="findidmodalheader">
                    <div className="findmodaltitlegroup">
                        <div className="findmodaltitle">WEPLi</div>
                    </div>
                    <img
                        className="findidmodalarrowgroup-icon"
                        alt=""
                        src={arrow}
                        onClick={closeFindIdModal}
                    />
                    <img
                        className="findidmodalweplilogo-icon"
                        alt=""
                        src={logo}
                    />
                </div>

                <div className="findidinputemailgroup">
                    <input className="findidinputemail" type={'text'} value={verifyKey} onChange={(e)=>setVerifyKey(e.target.value)}
                           placeholder={'전화번호를 입력해주세요'} onKeyPress={FindidEnter}></input>
                </div>
                <div className="findidemailbtngroup">
                    <div className="findidemailbtn"></div>
                    <button type={'button'} onClick={handleRequestCodeFind}  className="findidemailbtnsendtext" >전송</button>
                </div>
                <div className="findidinputemailgroup">
                    <input className="findidinputverfiy" type={'text'} value={verifyCode} onChange={(e)=>setVerifyCode(e.target.value)}
                           placeholder={'인증번호를 입력해주세요'} onKeyPress={FindidEnter}></input>
                </div>
                    {/*ㅇㅇ*/}
                <div className="findidmodalbottombtngroup">
                    <div className="findidmodalbottombtn">
                        <div className="findidmodalbottombtnrectangle"/>
                        <button type={'button'} onClick={handleVerifyCodeFind} className="findidmodalbottombtntext">인증확인</button>
                    </div>
                    <img
                        className="findidmodalbottomarrow-icon"
                        alt=""
                        src={btnarrow}
                    />
                </div>
                {recoveredEmail && <FindIdSuccessModal setfindIdSuccessModalOpen={setfindIdSuccessModalOpen} />}
            </div>
        </div>
    );
}


export default FindIdModal;