import React, {useState} from 'react';
import "./css/OutMemberModal.css";
import backarrow from "./svg/backarrow.svg";
import btnarrow from "./svg/btnarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import axios from "axios";
import {useNavigate} from "react-router-dom";
function OutMemberModal({setIsOutMemberModalOpen}) {

    const [pw, setPw] = useState('');

    const closeOutMemberModal = async () => {
        await setIsOutMemberModalOpen(false);
    };

    const handleInputPw = (e) => {
        setPw(e.target.value);
    }

    const navi = useNavigate();
    const onDeleteMemberSubmit = async () => {
        if(!pw){
            alert("비밀번호를 입력해주세요");
            return;
        }

        const url = "/api/lv1/m/member";

        axios({
            method:"delete",
            url:url,
            params: {pw}
        }).then(res=>{
            if(res.data===true){
                sessionStorage.removeItem('data') || localStorage.removeItem('data');
                            navi("/");
                            window.location.reload();
            }else{
                alert("비밀번호가 맞지않습니다");
            }
        })
    };

    const OutMemberEnter = (e) =>{
        if (e.key === 'Enter') {
            onDeleteMemberSubmit();
        }
    };


    return (
        <div>
            <div className="mypageoutmemebermodalframe" onClick={closeOutMemberModal}></div>
                <div className="mypageoutmemebermodalgroup">
                    <div className="mypageoutmemebermodalheader">
                        <div className="mypageoutmemebermodaltitlegrou">
                            <div className="mypageoutmemebermodaltitle">WEPLi</div>
                        </div>
                        <img
                            className="mypageoutmemebermodalarrowgrou-icon"
                            alt=""
                            src={backarrow}
                            onClick={closeOutMemberModal}
                        />
                        <img
                            className="mypageoutmemebermodalweplilogo-icon"
                            alt=""
                            src={logo}
                        />
                    </div>
                    <div className="mypageoutmemebermodaltextgroup">
                        <div className="mypageoutmemebermodalcentertex">회원탈퇴</div>
                    </div>
                    <div className="mypageoutmemebermodalpassinput">
                        <input type={'password'} value={pw} onChange={handleInputPw} className="mypageoutmemebermodalpassinput1"
                        onKeyPress={OutMemberEnter} autoFocus placeholder="비밀번호를 입력해 주세요"></input>
                    </div>

                    <div className="mypageoutmemebermodalbtngroup">
                        <div className="mypageoutmemebermodalmypagebtn">
                            <div className="mypageoutmemebermodalbtnrectan" />
                            <button type={'button'} className="mypageoutmemebermodalbtntext"
                            onClick={onDeleteMemberSubmit}>회원탈퇴</button>
                        </div>
                        <img
                            className="mypageoutmemebermodalbtnarrow-icon"
                            alt=""
                            src={btnarrow}
                        />
                    </div>
                </div>
        </div>
    );
}

export default OutMemberModal;