import React, {useState} from 'react';
import arrow from "./svg/backarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import btnarrow from "./svg/btnarrow.svg";
import "./css/FindPassModal.css";
import axios from "axios";
import FindPwChangeModal from "./FindPwChangeModal";
import {useRecoilState} from "recoil";
import {
    FindPassModalOpen,
    FindPwChangeModalOpen,
    recoveredEmailState,
    recoveredPhoneState
} from "../recoil/FindIdModalAtom";

function FindPassModal() {

    const closeFindPassModal = () => {
        setFindPassModalOpen(false);
    }


    const [findPwChangeModalOpen,setFindPwChangeModalOpen] = useRecoilState(FindPwChangeModalOpen);
    const [findPassModalOpen, setFindPassModalOpen] = useRecoilState(FindPassModalOpen);
    const [verifyKey, setVerifyKey] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyType, setVerifyType] = useState(0);
    const [resultRV, setResultRV] = useState(false);
    const [resultVerify, setResultVerify] = useState(false);
    const [recoveredEmail, setRecoveredEmail] = useRecoilState(recoveredEmailState);
    const [recoveredPhone, setRecoveredPhone] = useRecoilState(recoveredPhoneState);


    const type = recoveredEmail ? 0 : recoveredPhone ? 1 : null;

    const showPwChangeModal =  async () => {
        setFindPwChangeModalOpen(true);
        setFindPassModalOpen(false);
    }
    const handleRequestCodeFind = async () => {
        const url = "/api/lv0/m/requestcode";

        try {
            const res = await axios.post(url, { type: verifyType, key: verifyKey, phone: verifyKey,email: verifyKey });
            console.log(res);
            if (res.data === true) {
                setResultRV(res.data);

                alert("인증 성공");
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

    const handleVerifyCodeFind = () => {
        const url = "/api/lv0/m/verifycodefind";

        axios.post(url, {
            type: verifyType,
            key: verifyKey,
            code: verifyCode,
            authType: "findPw",
        })
            .then(res => {
                console.log("sibal" + res.data);
                if (res.data) {
                    // 이메일인 경우
                    if (+verifyType === 0) {
                        setRecoveredEmail(res.data);
                        console.log("sibalemail" + res.data);
                        // 문자인 경우
                    } else if (+verifyType === 1) {
                        setRecoveredPhone(res.data);
                        console.log("sibalphone" + res.data);
                    }

                    setFindPassModalOpen(false);
                    setFindPwChangeModalOpen(true);
                    alert('인증이 완료되었습니다.');
                } else {
                    setRecoveredEmail(null);
                    setRecoveredPhone('');
                }
            })
            .catch(error => {
                alert(error);
            });
    };


    return (
        <div>
            <div className="findpassmodalframe" onClick={closeFindPassModal}></div>
            <div className="findpassmodalgroup">
                <div className="findpassmodalheader">
                    <div className="findpassmodaltitlegroup">
                        <div className="findpassmodaltitle">WEPLi</div>
                    </div>
                    <img
                        className="findpassmodalarrowgroup-icon"
                        alt=""
                        src={arrow}
                    />
                    <img
                        className="findpassmodalweplilogo-icon"
                        alt=""
                        src={logo}
                    />
                </div>
                <select defaultValue={verifyType} onChange={(e) => setVerifyType(e.target.selectedIndex.toString())}
                className={'findpassmodalselect'}>
                    <option>이메일</option>
                    <option>문자</option>
                </select>
                <br/>
                <div className="findpassinputemailgroup">
                    <input className="findpassinputemail" placeholder={'이메일을 입력해주세요'} value={verifyKey}
                    onChange={(e)=>setVerifyKey(e.target.value)}></input>
                </div>
                <div className="findpassemailbtngroup">
                    <div className="findpassemailbtn"/>
                    <button type={'button'} className="findpassemailbtnsendtext" onClick={handleRequestCodeFind}>전송</button>
                </div>
                <div className="findpassinputemailgroup">
                    <input className="findpassinputcode" placeholder={'인증번호를 입력해주세요'} value={verifyCode}
                    onChange={(e)=>setVerifyCode(e.target.value)}></input>
                </div>

                <div className="findpassgofindpasstextgroup">
                    <div className="findpassgofindpasstext">
                        아이디가 생각나지 않으십니까?
                    </div>
                </div>
                <div className="findpassmodalbottombtngroup">
                    <div className="findpassmodalbottombtn">
                        <div className="findpassmodalbottombtnrectangle"/>
                        <button type={'button'} className="findpassemailbtnsendtext" onClick={handleVerifyCodeFind}>인증번호 확인</button>
                    </div>
                    <img
                        className="findpassmodalbottomarrow-icon"
                        alt=""
                        src={btnarrow}
                    />
                </div>
            </div>
            {findPwChangeModalOpen &&
                type === 0 &&
                recoveredEmail && (
                    <FindPwChangeModal recoveredEmail={recoveredEmail} />
                )}
            {findPwChangeModalOpen &&
                type === 1 &&
                recoveredPhone && (
                    <FindPwChangeModal recoveredPhone={recoveredPhone} />
                )}
        </div>
    );
}

export default FindPassModal;