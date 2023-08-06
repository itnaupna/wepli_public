import React, {useState} from 'react';
import "./css/PhoneConfirm.css";
import backarrow from "./svg/backarrow.svg";
import btnarrow from "./svg/btnarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import axios from "axios";
function PhoneConfirmModal({setisPhoneConfirmModalOpen}) {

    const closePhoneConfirmModal = async () => {
        await setisPhoneConfirmModalOpen(false);
    }

    const [verifyKey, setVerifyKey] = useState('');
    const [resultRV, setResultRV] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [resultVerify, setResultVerify] = useState(false);


    // 인증번호 전송 타입
    const handleRequestCode = async () => {
        if(!verifyKey){
            alert("정보를 입력해주세요");
            return;
        }
        const url = "/api/lv1/m/requestcode";
        try {

            const res = await axios.post(url, {type: 1, key: verifyKey, email:verifyKey, phone:verifyKey});
            console.log(res);
            if (res.data === true) {
                const data= JSON.parse(sessionStorage.getItem('data') || localStorage.getItem("data"));
                data.phoneconfirm = 1;

                if (sessionStorage.getItem('data')) {
                    sessionStorage.setItem('data', JSON.stringify(data)); // sessionStorage에 저장
                } else {
                    localStorage.setItem('data', JSON.stringify(data)); // localStorage에 저장
                }
                console.log(res);
                alert("인증번호 전송 완료");
                setResultRV(res.data);
            } else {
                alert("인증실패");
            }
        } catch (error) {
            console.log(error);
        }
    }


    // 인증번호 검수임
    const handleVerifyCode = async ()=>{
        if(!verifyCode){
            alert("정보를 입력해주세요");
            return;
        }
        const url = "/api/lv1/m/verifycode";
        try{
            const res = await axios.post(url,{type:1,key:verifyKey,code:verifyCode});
            if(res.data === true){
                console.log(res.data);

                setResultVerify(res.data);
                setisPhoneConfirmModalOpen(false);
                alert("인증완료");
            }else{
                alert("이미 인증완료된 번호입니다.");
                console.log(res.data);
                console.log(res);
            }
        }catch(error){
            alert(error);
        }
    }

    const PhoneConfirmEnter = (e) =>{
        if (e.key === 'Enter') {
            handleVerifyCode();
        }
    };

    return (
        <div>
            <div className="phoneconfirmmodalframe" onClick={closePhoneConfirmModal}></div>
                <div className="phoneconfirmmodalgroup">
                    <div className="phoneconfirmmodalheader">
                        <div className="phoneconfirmmodaltitlegroup">
                            <div className="phoneconfirmmodaltitle">WEPLi</div>
                        </div>
                        <img
                            className="phoneconfirmmodalarrowgroup-icon"
                            alt=""
                            src={backarrow}
                            onClick={closePhoneConfirmModal}
                        />
                        <img
                            className="phoneconfirmmodalweplilogo-icon"
                            alt=""
                            src={logo}
                        />
                    </div>
                    <div className="phoneconfirmmodaltextgroup">
                        <div className="phoneconfirmmodalcentertext">전화번호 본인인증</div>
                    </div>
                    <div className="phoneconfirmmodalphoneinputgro">
                        <input type={'text'} value={verifyKey}
                               onChange={(e)=> setVerifyKey(e.target.value)}
                               onKeyPress={PhoneConfirmEnter} className="phoneconfirmmodalphoneinput"></input>
                    </div>
                    <div className="phoneconfirmphonebtngroup">
                        <div className="phoneconfirmsendbtn" />
                        <button type={"button"} onClick={handleRequestCode} className="phoneconfirmphonebtntext">전송</button>
                    </div>
                    <div className="phoneconfirmmodalphoneinputgro">
                        <input type={'text'} value={verifyCode}
                               onChange={(e)=>setVerifyCode(e.target.value)}
                               onKeyPress={PhoneConfirmEnter} className="phoneconfirmmodalphoneinput"></input>
                    </div>
                    <div className="phoneconfirmphonebtngroup">
                        <div className="phoneconfirmsendbtn" />
                        <button type={"button"} className="phoneconfirmphonebtntext" onClick={handleVerifyCode}>확인</button>
                    </div>
                    <div className="phoneconfirmmodalbtngroup">
                        <div className="phoneconfirmmypagebtn">
                            <div className="phoneconfirmmodalbtnrectangle" />
                            <button type={'button'} className="phoneconfirmmodalbtntext">본인인증</button>
                        </div>
                        <img
                            className="phoneconfirmmodalbtnarrow-icon"
                            alt=""
                            src={btnarrow}
                        />
                    </div>
                </div>
        </div>
    );
}

export default PhoneConfirmModal;