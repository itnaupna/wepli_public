import React, {useState} from 'react';
import "./css/PwChkModal.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import backarrow from "./svg/backarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png"
import arrow from "./svg/btnarrow.svg";
import {useIsPasswordEntered} from "../recoil/LoginStatusAtom";
function PwChkModal({setpwChkmodalOpen}) {
    
    const [pwChk, setPwChk] = useState("");
    const navigate = useNavigate();

    // 비밀번호 확인 모달 닫기
    const closePwChkModal = () => {
        setpwChkmodalOpen(false);
    }

    const { setIsPasswordEntered } = useIsPasswordEntered();
    // 비밀번호 일치하는지 확인
    // 맞을경우 -> 모달닫고 마이페이지로
    const pwChkHandler = async () => {
        const url = `/api/lv1/m/checkpassword?pw=${pwChk}`;
        try {
            const res = await axios.post(url, { pw: pwChk });
            if (res.data === true) {
                setIsPasswordEntered(true);
                closePwChkModal();
                navigate('/mypage');

            } else {
                alert("비밀번호를 정확히 입력해주세요.");
            }
        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다. 리액트 펀치가즈아");
        }
    };

    const EnterKeyPress = (e) =>{
        if (e.key === 'Enter') {
            pwChkHandler();
        }
    };

    return (
        <div >
            <div className="mypagepwchkmodalframe" onClick={closePwChkModal}></div>
            <div className="mypagepwchkmodalgroup">
                <div className="mypagepwchkmodalheader">
                    <div className="mypagepwchkmodaltitlegroup">
                        <div className="mypagepwchkmodaltitle">WEPLi</div>
                    </div>
                    <img
                        className="mypagepwchkmodalarrowgroup-icon"
                        alt=""
                        src={backarrow}
                        onClick={closePwChkModal}
                    />
                    <img
                        className="mypagepwchkmodalweplilogo-icon"
                        alt=""
                        src={logo}
                    />
                </div>
                <div className="mypagepwchkmodaltextgroup">
                    <div className="mypagepwchkmodalcentertext">비밀번호 확인</div>
                </div>
                <div className="mypagepwchkmodalpassinputgroup">
                    <input className="mypagepwchkmodalpassinput"
                           type="password" onChange={(e) => setPwChk(e.target.value)} onKeyPress={EnterKeyPress} autoFocus></input>
                </div>
                <div className="mypagepwchkmodalbtngroup">
                    <div className="mypagepwchkmodalmypagebtn">
                        <div className="mypagepwchkmodalbtnrectangle" />
                        <button type={'button'} onClick={pwChkHandler} className="mypagepwchkmodalbtntext1">비밀번호 확인</button>
                    </div>
                    <img
                        className="mypagepwchkmodalbtnarrow-icon"
                        alt=""
                        src={arrow}
                    />
                </div>
            </div>
        </div>
    );
}

export default PwChkModal;