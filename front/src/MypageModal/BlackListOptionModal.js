import React, {useState} from 'react';
import backarrow from "./svg/backarrow.svg";
import btnarrow from "./svg/btnarrow.svg";
import logo from "./photo/weplieonlylogoonlylogo.png";
import "./css/BlackListOption.css";
import {useRecoilState} from "recoil";
import {BlackListOptionModalOpen} from "../recoil/MypageModalAtom";
import axios from "axios";

function BlackListOptionModal() {

    const [isBlackListModalOpen, setisBlackListModalOpen] = useRecoilState(BlackListOptionModalOpen);

    const closeBlackListOptionModal = async () => {
        await setisBlackListModalOpen(false);
    }

    const [hideChat, setHideChat] = useState(false);
    const [mute, setMute] = useState(false);

    const handleBlackOption = async () => {

        const hidechatValue = hideChat ? 1 : 0;
        const muteValue = mute ? 1 : 0;

        const url = "/api/lv2/b/blackoptchange";
        axios({
            method: 'put',
            url: url,
            params: { hidechat: hidechatValue, mute: muteValue },
        })
            .then(res => {
                console.log("Server", res);
                console.log("Data", res.data);
                if (res.data === true) {
                    alert("옵션설정이 완료되었습니다.");
                    setisBlackListModalOpen(false);
                } else {
                    alert("ㄷㄷ");
                }
            }).catch(error => {
                console.error("Error", error);
                alert("오류");
            });

    }
    return (
        <div>
            <div className="blacklistoptionmodalframe" onClick={closeBlackListOptionModal}></div>
            <div className="blacklistoptionmodalgroup">
                <div className="blacklistoptionmodalheader">
                    <div className="blacklistoptionmodaltitlegroup">
                        <div className="blacklistoptionmodaltitle">WEPLi</div>
                    </div>
                    <img
                        className="blacklistoptionmodalarrowgroup-icon"
                        alt=""
                        src={backarrow}
                        onClick={closeBlackListOptionModal}
                    />
                    <img
                        className="blacklistoptionmodalweplilogo-icon"
                        alt=""
                        src={logo}
                    />
                </div>
                <div className="blacklistoptioncentertextgroup">
                    <div className="blacklistoptioncentertext">블랙리스트 옵션</div>
                </div>

                <div className={'optioncheckboxgroup'}>
                    <div className={'optionchatsection'}>
                        <label className={'showchatcheckboxtext'}>채팅 표시 여부</label>
                        <input
                            type={'checkbox'}
                            className={'optionchatchecktype'}
                            checked={hideChat}
                            onChange={(e) => setHideChat(e.target.checked)}
                        />
                    </div>
                    <div className={'optionsoundsection'}>
                        <label className={'showsoundcheckboxtext'}>채팅 표시 여부</label>
                        <input
                            type={'checkbox'}
                            className={'optionsoundchecktype'}
                            checked={mute}
                            onChange={(e) => setMute(e.target.checked)}
                        />
                    </div>
                    <div className={'blacklistoptionsubtext'}>
                        <span>플리 블라인드, 스테이지 차단, 스테이지 블라인드</span>
                    </div>
                </div>

                <div className="blacklistoptionmodalbtngroup">
                    <div className="blacklistoptionmodalmodalbtn">
                        <div className="blacklistoptionmodalmodalbtnre"/>
                        <button type={'button'} className="blacklistoptionmodalmodalbtnte"
                                onClick={handleBlackOption}>옵션설정</button>
                    </div>
                    <img
                        className="blacklistoptionmodalmodalarrow-icon"
                        alt=""
                        src={btnarrow}
                    />
                </div>
            </div>
        </div>
    );
}

export default BlackListOptionModal;