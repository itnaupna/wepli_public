import React, { useEffect, useRef, useState } from 'react';
import '../PlayStageCss/PlayStage.css';
import { useParams } from 'react-router';
import LoadingScreen from './LoadingScreen';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { SocketAtom, SocketSubsAtom, handleSendMsg, SubSocket, SocketIdAtom } from '../../recoil/SocketAtom';
import StageLeftSide from './StageLeftSide';
import StageRightSide from './StageRightSide';
import { ChatItemsAtom, StageUrlAtom, UserCountInStageAtom, UsersItemsAtom } from '../../recoil/ChatItemAtom';
import { LoginStatusAtom } from '../../recoil/LoginStatusAtom';
import { HistoryCountAtom, IsInQueueAtom, MyQListAtom, RoomQListAtom, VoteDownAtom, VoteDownCountAtom, VoteUpAtom, VoteUpCountAtom } from '../../recoil/StageDataAtom';
import { IsPlayingAtom, YTPListAtom, YoutubeAtom, YoutubeInStageAtom } from '../../recoil/YoutubeAtom';


function PlayStage() {
    const { stageUrl } = useParams();
    const [su, setSu] = useRecoilState(StageUrlAtom);
    const sockClient = useRecoilValue(SocketAtom);
    const setChatLog = useSetRecoilState(ChatItemsAtom);
    const setUserList = useSetRecoilState(UsersItemsAtom);
    const setUserCount = useSetRecoilState(UserCountInStageAtom);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(true);

    const [conmsg, setConmsg] = useState('접속중');
    const IsLogin = useRecoilValue(LoginStatusAtom);
    const [isInQueue, setIsInQueue] = useRecoilState(IsInQueueAtom);
    const [myQueue, setMyQueue] = useRecoilState(MyQListAtom);
    const [roomQueue, setRoomQueue] = useRecoilState(RoomQListAtom);
    const [YTP, setYTP] = useRecoilState(YoutubeAtom); //전역 유튜브 플레이어
    const [YTPS, setYTPS] = useRecoilState(YoutubeInStageAtom); //인스테이지 유튜브 플레이어
    const [vu, setVu] = useRecoilState(VoteUpAtom);
    const [vd, setVd] = useRecoilState(VoteDownAtom);


    const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
    useEffect(() => {

        return () => {
            document.getElementById('YTPFrame').parentElement.style.opacity = '1';
            document.getElementById('YTPFrame').parentElement.style.display = 'none';
        }
    }, []);

    useEffect(() => {
        if (YTP !== null) {
            // if (YTP !== null && YTPS !== null) {
            setIsLoading(false);
            if (su !== null)
                setShowLoading(false);
        }
    }, [YTP, YTPS, su]);

    useEffect(() => {
        if (!showLoading) {
            if (su === null || su !== stageUrl)
                connect();
            document.getElementById('YTPFrame').parentElement.style.display = 'block';
        }

    }, [showLoading, su]);

    useEffect(() => {
        if (isLoading) return;
        setIsInQueue(myQueue.length > 0);
        if (myQueue.length > 0) {
            handleSendMsg("QUEUE_CHANGE_SONG", myQueue[0], su);
        } else {
            handleSendMsg("QUEUE_OUT", null, su);
        }
    }, [myQueue[0]]);

    const connect = async () => {

        if (!sockClient.connected) {
            try {
                await waitConnect();
                subChannel();
            }
            catch (ex) {
                setConmsg(ex.toString());
            }
        } else {
            subChannel();

        }
    }

    const subChannel = () => {

        YTP?.loadVideoById('tATNYnFTetg', 0);
        YTP?.seekTo(0);
        YTP?.stopVideo();
        setYTPList([]);
        SubSocket("/sub/stage/" + stageUrl, data => {
            handleSocketData(JSON.parse(data.body));
        });
        setChatLog([]);
        setIsLoading(false);
        setSu(stageUrl);
        handleSendMsg('ENTER', null, stageUrl);
    }

    const waitConnect = () => {
        return new Promise((resolve, reject) => {
            const limit = 20;
            const intervalTime = 500;
            let currentAttempt = 0;
            const interval = setInterval(() => {
                if (currentAttempt > limit - 1) {
                    clearInterval(interval);
                    reject(new Error("연결에 실패했습니다. 다시 접속해주세요."));
                } else if (sockClient.connected) {
                    clearInterval(interval);
                    resolve();
                }
                currentAttempt++;
            }, intervalTime);
        });
    }

    const addChatLog = (e) => {
        setChatLog(chatLog => [
            ...chatLog,
            e
        ]);
    }

    const [YTPList, setYTPList] = useRecoilState(YTPListAtom);
    // const [isp, setIsp] = useRecoilState(IsPlayingAtom);
    const [vuc, setVuc] = useRecoilState(VoteUpCountAtom);
    const [vdc, setVdc] = useRecoilState(VoteDownCountAtom);
    const setHistoryCount = useSetRecoilState(HistoryCountAtom);
    const handleSocketData = (data) => {
        // console.log(data);
        // console.log("패킷수신 " + data.msg);
        switch (data.type) {
            case 'ENTER':
                setUserList(data.msg.memberlist);
                setUserCount(+data.msg.count);
                addChatLog({
                    type: data.type,
                    nick: data.userNick,
                    msg: '님이 입장하였습니다.'
                });
                break;
            case 'EXIT':
                setUserList(data.msg.memberlist);
                setUserCount(+data.msg.count);
                addChatLog({
                    type: data.type,
                    nick: data.userNick,
                    msg: '님이 퇴장하였습니다.'
                });
                break;
            case 'SKIP':
                addChatLog({
                    type: data.type,
                    nick: data.userNick,
                    msg: '님이 현재 곡을 스킵하였습니다.'
                });
                break;
            case 'VOTE':
                setVuc(data.msg.UP);
                setVdc(data.msg.DOWN);
                break;
            case 'VOTE_UP':
                break;
            case 'VOTE_DOWN':
                break;
            case 'KICK':
                break;
            case 'BAN':
                break;
            case 'DELETE':
                break;
            case 'QUEUE_IN':
                setRoomQueue(
                    data.msg
                );
                // addChatLog({
                //     type: data.type,
                //     nick: data.userNick,
                //     msg: '님이 스테이지 플리에 참여하였습니다.'
                // });
                break;
            case 'QUEUE_OUT':
                setRoomQueue(data.msg);
                // addChatLog({
                //     type: data.type,
                //     nick: data.userNick,
                //     msg: '님이 스테이지 플리에서 나갔습니다.'
                // });
                break;
            case 'QUEUE_ORDER_CHANGE':
                break;
            case 'QUEUE_ORDER_SONG':
                break;
            case 'CHAT':

                addChatLog({
                    type: data.type,
                    img: `${BUCKET_URL}/profile/${data.img}`,
                    date: new Date().toLocaleString(),
                    msg: data.msg,
                    nick: data.userNick
                });
                break;
            case 'PLAY':
                console.log(data.msg.songaddress);

                // console.log(sessionId);
                let udata = JSON.parse(sessionStorage.getItem('data') || localStorage.getItem('data'));
                let userNick = udata?.nick;
                let target = data.msg.target;
                let mys = sessionStorage.getItem('s');

                if (target !== null && target !== mys) return;
                //만약 내 곡이라면 내 대기열의 0번째 인덱스값을 지운다.
                //그리고 스킵버튼을 띄우고 추천/비추 숨기고
                //아니라면 그 반대로
                if (data.msg.playerNick === userNick) {
                    setMyQueue(v => {
                        const a = [...v];
                        a.splice(0, 1);
                        return a;
                    });
                    if (userNick !== null) {
                        document.getElementsByClassName('stage-button-up')[0].style.display = 'none';
                        document.getElementsByClassName('stage-button-down')[0].style.display = 'none';
                    }
                    document.getElementsByClassName('stage-button-skip')[0].style.display = 'flex';
                } else {
                    if (userNick !== null) {
                        document.getElementsByClassName('stage-button-up')[0].style.display = 'flex';
                        document.getElementsByClassName('stage-button-down')[0].style.display = 'flex';
                    }
                    document.getElementsByClassName('stage-button-skip')[0].style.display = 'none';
                }
                //테스트용
                // document.getElementsByClassName('stage-button-up')[0].style.display = 'flex';
                // document.getElementsByClassName('stage-button-down')[0].style.display = 'flex';
                //테스트용끝
                //방장이면 스킵버튼은 항상 띄운다.
                let s = window.location.pathname.split('/stage/')[1];
                if (s === udata?.stageaddress)
                    document.getElementsByClassName('stage-button-skip')[0].style.display = 'flex';

                //곡을 재생한다.
                YTP.loadPlaylist([data.msg.songaddress], 0, data.msg.startPosition);
                setYTPList({
                    [data.msg.songaddress]: data.msg
                });
                // setYTPList([data.msg]);
                // setIsp(true);

                //재생곡에 대한 로그를 띄운다.
                addChatLog({
                    type: data.type,
                    msg: `님이 ${data.msg.title} @${data.msg.singer}을(를) 재생합니다.`,
                    nick: data.msg.playerNick
                })

                //추천내역을 초기화한다.
                setVu(false);
                setVd(false);
                break;
            case 'QUEUE_DATA':
                setRoomQueue(
                    data.msg
                );
                break;
            case 'STOP':
                //재생할 곡이 없다면 정지.
                document.getElementsByClassName('stage-button-up')[0].style.display = 'none';
                document.getElementsByClassName('stage-button-down')[0].style.display = 'none';
                document.getElementsByClassName('stage-button-skip')[0].style.display = 'none';
                YTP?.loadVideoById('tATNYnFTetg', 0);
                YTP?.seekTo(0);
                YTP?.stopVideo();
                setYTPList([]);

                break;
            case 'HISTORY':
                    setHistoryCount(+data.msg);
                break;
            default:
                break;
        }
    }

    return (
        <>
            {showLoading && <LoadingScreen msg={conmsg} isLoading={isLoading} setShow={setShowLoading} />}
            <div className="stage" >
                <StageLeftSide />
                <StageRightSide />
            </div>

        </>
    );
}

export default PlayStage;