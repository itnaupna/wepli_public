import React, {useState} from 'react';
import arrow from "./svg/backarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import btnarrow from "./svg/btnarrow.svg";
import "./css/FindPwChangeModal.css";
import axios from "axios";
import {useRecoilState, useRecoilValue} from "recoil";
import {
    FindPassModalOpen,
    FindPwChangeModalOpen,
    recoveredEmailState,
    recoveredPhoneState
} from "../recoil/FindIdModalAtom";
import { useNavigate } from 'react-router-dom';
function FindPwChangeModal() {

    const [findPassModalOpen, setFindPassModalOpen] = useRecoilState(FindPassModalOpen);
    const [findPwChangeModalOpen, setFindPwChangeModalOpen] = useRecoilState(FindPwChangeModalOpen);
    const recoveredEmail = useRecoilValue(recoveredEmailState);
    const recoveredPhone = useRecoilValue(recoveredPhoneState);

    const type = recoveredEmail ? 0 : recoveredPhone ? 1 : null;

    const closeFindIdModal =  async() => {
        await setFindPassModalOpen(false);
        setFindPwChangeModalOpen(false);
    }

    const [newPw, setNewPw] = useState('');
    console.log("변경하는곳",recoveredPhone , recoveredEmail);

    const navi = useNavigate()

    const handleChangeNewPw = async () => {
        const url = "/api/lv0/m/findPw";   

        try {
            const res = await axios.post(url,
                { type,
                    phone: recoveredPhone,
                    email: recoveredEmail,
                    newPw: newPw
                });
            alert("성공");
            setFindPwChangeModalOpen(false);
            navi("/");
            
        } catch (error) {
            alert('비밀번호를 맞게 입력해주세요');
        }
    };
    return (
        <div>
            <div className="findpwchangemodalframe" onClick={closeFindIdModal}></div>
                <div className="findpwchangemodalgroup">
                    <div className="findpwchangemodalheader">
                        <div className="findpwchangemodaltitlegroup">
                            <div className="findpwchangemodaltitle">WEPLi</div>

                        </div>
                        <img
                            className="findpwchangemodalarrowgroup-icon"
                            alt=""
                            src={arrow}
                        />
                        <img
                            className="findpwchangemodalweplilogo-icon"
                            alt=""
                            src={logo}
                        />
                    </div>
                    <div className="findpwchangemodaltextgroup">
                        {recoveredEmail ? `아이디 : ${recoveredEmail}` : recoveredPhone ? `전화번호 : ${recoveredPhone}` : ''}
                    </div>
                    {/*<div className="findpwchangemodalphoneinputgro">*/}
                    {/*    <input type={"password"} className="findpwchangemodalphoneinput" placeholder={'이전 비밀번호를 입력해주세요'}*/}
                    {/*    value={oldPw} onChange={(e)=>setOldPw(e.target.value)}></input>*/}
                    {/*</div>*/}
                    <div className="findpwchangemodalphoneinputgro">
                        <input type={"password"} value={newPw} className="findpwchangemodalphoneinput" placeholder={"변경할 비밀번호를 입력해주세요"}
                        onChange={(e)=>setNewPw(e.target.value)}></input>
                    </div>

                    <div className="findpwchangemodalbtngroup">

                        <div className="findpwchangemypagebtn">
                            <div className="findpwchangemodalbtnrectangle" />
                            <button type={'button'} onClick={handleChangeNewPw} className="findpwchangemodalbtntext">비밀번호 변경</button>
                        </div>
                        <img
                            className="findpwchangemodalbtnarrow-icon"
                            alt=""
                            src={btnarrow}
                        />

                    </div>

                </div>
        </div>
    );
}

export default FindPwChangeModal;