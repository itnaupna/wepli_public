import React, { useEffect, useRef, useState } from 'react';
import QueueComponent from './QueueComponent';
import { useRecoilState, useRecoilValue } from 'recoil';
import SettingModal from './SettingModal.js';
import { DownIcon, GrabIcon, UpIcon } from '../Icons';
import SettingsIcon from '@mui/icons-material/Settings';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { StageUrlAtom } from '../../recoil/ChatItemAtom';
import { handleSendMsg } from '../../recoil/SocketAtom';

import { VoteDownAtom, VoteDownCountAtom, VoteUpAtom, VoteUpCountAtom } from '../../recoil/StageDataAtom';
import CSM from "./CSM";
import { Modal } from "@mui/material";
import StageInfoModal from './StageInfoModal';


const StageLeftSide = () => {

    const [mo, setMo] = useState(false);
    const handleMo = () => setMo(true);
    const handleMc = () => setMo(false);

    const [leftType, setLeftType] = useState(true);
    // console.log(YTPO);
    //Setting Modal
    const [modalOpen, setModalOpen] = useState(false);
    //모달창 노출
    const showModal = () => {
        setModalOpen(true);
    };
    //스테이지 삭제 버튼
    const RemoveStage = () => {
        if (window.confirm("스테이지를 삭제하시겠습니까?(스테이지 삭제 시 스테이지에 저장된 정보는 모두 삭제됩니다.)")) {
            alert("삭제되었습니다.");
        } else {
            return;
        }
    }

    useEffect(() => {
        const handleResize = () => {
            let a = document.getElementById('YTPFrame').parentElement;
            let b = document.getElementById('YTPPosi');
            a.style.left = b.getBoundingClientRect().x + 'px';
            a.style.top = b.getBoundingClientRect().y + 'px';
        }
        handleResize();
        // document.getElementById('YTPFrame').parentElement.style.display = 'block';
        window.addEventListener('resize', handleResize);

        let udata = JSON.parse(sessionStorage.getItem('data') || localStorage.getItem('data'));
        let userNick = udata?.nick;
        let s = window.location.pathname.split('/stage/')[1];
        console.log(s===udata?.stageaddress);
        
        setIO(s === udata?.stageaddress);


        return () => {
            window.removeEventListener('resize', handleResize);
            // document.getElementById('YTPFrame').parentElement.style.display = 'none';
        }
    }, [])

    const su = useRecoilValue(StageUrlAtom);

    const [vu, setVu] = useRecoilState(VoteUpAtom);
    const [vd, setVd] = useRecoilState(VoteDownAtom);

    const vuc = useRecoilValue(VoteUpCountAtom);
    const vdc = useRecoilValue(VoteDownCountAtom);

    const handleUp = () => {
        setVu(!vu);
        setVd(false);
    }

    useEffect(() => {
        if (su !== null) {
            if (vu) {
                handleSendMsg("VOTE", "UP", su);
            }

            if (vd) {
                handleSendMsg("VOTE", "DOWN", su);
            }

            if (!vu && !vd) {
                handleSendMsg("VOTE", "CLEAR", su);
            }
        }
    }, [vu, vd]);

    const handleDown = () => {
        setVd(!vd);
        setVu(false);
    }
    const handleSkip = () => {
        handleSendMsg("SKIP", null, su);
    }
    const [isOwner, setIO] = useState(false);



    // const AAA = <YouTube onReady={(e)=>{setYTA([ e.target);}}/>;
    return (

        <div className="stage-left">
            <div className="stage-left-header">
                <div className="stage-left-button-group-a">
                    <div className={"stagebutton stage-button-stage" + (leftType ? ' stageactive' : '')}
                        onClick={() => {
                            document.getElementById('YTPFrame').parentElement.style.opacity = '1';
                            setLeftType(true);
                        }}>
                        <div className="stage-button-stage-text">스테이지</div>
                    </div>

                    <div className={"stagebutton stage-button-queue" + (leftType ? '' : ' stageactive')}
                        onClick={() => {
                            document.getElementById('YTPFrame').parentElement.style.opacity = '0.2';
                            setLeftType(false);
                        }}>
                        <div className="stage-button-queue-text">대기열</div>
                    </div>
                </div>

                <div className="stage-left-button-group-b">

                    <div className="stage-button-up stagebutton" onClick={handleUp} style={{ display: 'none' }}>
                        <UpIcon isFill={vu} />
                        {vuc > 0 && <span style={{ position: 'absolute', right: '5px', bottom: '5px' }}>{vuc}</span>}
                    </div>

                    <div className="stage-button-down stagebutton" onClick={handleDown} style={{ display: 'none' }}>
                        <DownIcon isFill={vd} />
                        {vdc > 0 && <span style={{ position: 'absolute', right: '5px', bottom: '5px' }}>{vdc}</span>}
                    </div>

                    <div className="stage-button-skip stagebutton" onClick={handleSkip} style={{ display: 'none' }}>
                        <SkipNextIcon style={{ width: '50px', height: '50px' }} />
                        {/* <div className="stage-button-skip-text">SKIP</div> */}
                    </div>

                    <div className="stage-button-grab stagebutton" onClick={() => {

                        handleMo();
                    }}>
                        {/* <GrabIcon/> */}
                        <SettingsIcon style={{ width: '50px', height: '50px' }} />
                    </div>
                </div>
            </div>

            <div className="stage-left-body" >

                <div className='youtubebox'>
                    <div style={{
                        width: '640px', height: '360px', backgroundColor: 'red',
                        margin: 'auto',
                        left: '0',
                        right: '0',
                        top: '10px',
                        position: 'absolute',
                        visibility: 'hidden'
                    }} id='YTPPosi' />
                </div>
                {/* <div className='stage-left-button-group-c'>
                    <div className="stage-button-setting">
                        <button onClick={showModal} className='setting-button'>
                            <svg
                                width="50"
                                height="50"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="settings">
                                    <path id="Vector" d="M19.1411 12.9359C19.1771 12.6359 19.2011 12.3239 19.2011 11.9999C19.2011 11.6759 19.1771 11.3639 19.1291 11.0639L21.1571 9.4799C21.3371 9.3359 21.3851 9.0719 21.2771 8.8679L19.3571 5.5439C19.2371 5.3279 18.9851 5.2559 18.7691 5.3279L16.3811 6.2879C15.8771 5.9039 15.3491 5.5919 14.7611 5.3519L14.4011 2.8079C14.3651 2.5679 14.1611 2.3999 13.9211 2.3999H10.0811C9.84108 2.3999 9.64908 2.5679 9.61308 2.8079L9.25308 5.3519C8.66508 5.5919 8.12508 5.9159 7.63308 6.2879L5.24508 5.3279C5.02908 5.2439 4.77708 5.3279 4.65708 5.5439L2.73708 8.8679C2.61708 9.0839 2.66508 9.3359 2.85708 9.4799L4.88508 11.0639C4.83708 11.3639 4.80108 11.6879 4.80108 11.9999C4.80108 12.3119 4.82508 12.6359 4.87308 12.9359L2.84508 14.5199C2.66508 14.6639 2.61708 14.9279 2.72508 15.1319L4.64508 18.4559C4.76508 18.6719 5.01708 18.7439 5.23308 18.6719L7.62108 17.7119C8.12508 18.0959 8.65308 18.4079 9.24108 18.6479L9.60108 21.1919C9.64908 21.4319 9.84108 21.5999 10.0811 21.5999H13.9211C14.1611 21.5999 14.3651 21.4319 14.3891 21.1919L14.7491 18.6479C15.3371 18.4079 15.8771 18.0839 16.3691 17.7119L18.7571 18.6719C18.9731 18.7559 19.2251 18.6719 19.3451 18.4559L21.2651 15.1319C21.3851 14.9159 21.3371 14.6639 21.1451 14.5199L19.1411 12.9359ZM12.0011 15.5999C10.0211 15.5999 8.40108 13.9799 8.40108 11.9999C8.40108 10.0199 10.0211 8.3999 12.0011 8.3999C13.9811 8.3999 15.6011 10.0199 15.6011 11.9999C15.6011 13.9799 13.9811 15.5999 12.0011 15.5999Z" fill="#191D21" />
                                </g>
                            </svg>
                        </button>
                        {modalOpen && <SettingModal setModalOpen={setModalOpen} />}
                    </div>
                    <div className='stage-button-Exit' onClick={RemoveStage}>
                        <svg onCl
                            width="50"
                            height="50"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g id="Icon / Line / Cross Alt Square">
                                <path id="Vector" d="M24.0002 15.9999L20.0002 19.9999M20.0002 19.9999L16.0002 23.9999M20.0002 19.9999L16.0002 15.9999M20.0002 19.9999L24.0002 23.9999M20 32C16.2725 32 14.4087 32 12.9385 31.391C10.9783 30.5791 9.42092 29.0217 8.60896 27.0615C8 25.5913 8 23.7275 8 20C8 16.2725 8 14.4087 8.60896 12.9385C9.42092 10.9783 10.9783 9.42092 12.9385 8.60896C14.4087 8 16.2725 8 20 8C23.7275 8 25.5913 8 27.0615 8.60896C29.0217 9.42092 30.5791 10.9783 31.391 12.9385C32 14.4087 32 16.2725 32 20C32 23.7275 32 25.5913 31.391 27.0615C30.5791 29.0217 29.0217 30.5791 27.0615 31.391C25.5913 32 23.7275 32 20 32Z" stroke="black" stroke-width="2" stroke-linecap="round" />
                            </g>
                        </svg>
                    </div>
                </div> */}
                <div style={{ display: !leftType ? 'block' : 'none', width: '100%' }}>
                    <QueueComponent />
                </div>
                <Modal open={mo} onClose={handleMc}>
                    {isOwner
                        ? <CSM types={false} onClose={handleMc} />
                        : <StageInfoModal />
                    }
                </Modal>

            </div>

        </div>
    );
};

export default StageLeftSide;