import React, { useEffect } from 'react';
import { Qdelete, Qgrab, Qorder, Qplay, Qremuser } from '../PlayStageImage/Icon';
import { useRecoilState, useRecoilValue } from 'recoil';
import { GetSongInfoByYoutubeApi, IsInQueueAtom, MyQListAtom, ResultItemsInStageAtom, getIsGrabbingAtom } from '../../recoil/StageDataAtom';
import { handleSendMsg } from '../../recoil/SocketAtom';
import { StageUrlAtom } from '../../recoil/ChatItemAtom';

const QPlayButton = ({ data, index, ks }) => {
    const [isInQueue, setIsInQueue] = useRecoilState(IsInQueueAtom);
    const [myQueue, setMyQueue] = useRecoilState(MyQListAtom);


    const handleClick = async () => {

        if (ks === 'search')
            data = await GetSongInfoByYoutubeApi(0, data.id.videoId);
        const item = {
            idx: data.idx || 0,
            playlistID: data.playlistID || 0,
            singer: data.singer,
            title: data.title,
            songaddress: data.songaddress,
            songlength: data.songlength || 0,
            songorigin: data.songorigin || 'yt',
            genre: data.genre,
            tag: data.tag,
            img: data.img
        }
        setMyQueue(v => [...v, item]); //대기열에 아이템 추가하고.

        // if (!isInQueue) {
        //     setIsInQueue(true);//큐에 드가고
        // }
    }
    return (
        <div className="queueallbutton" onClick={handleClick}>
            <img className="play-icon" alt="" src={Qplay} />
        </div>
    );
};

const QOrderButton = ({ data, index, ks }) => {
    const [myQueue, setMyQueue] = useRecoilState(MyQListAtom);
    const su = useRecoilValue(StageUrlAtom);
    const handleClick = () => {
        switch (ks) {
            case 'myqueue':
                if (myQueue.length < 2) return;
                let item = myQueue[index];
                setMyQueue(v => [item, ...v.filter((v, i) => i !== index)]);
                // console.log(myQueue);
                // handleSendMsg("QUEUE_CHANGE_SONG", item, su);
                break;
            case 'stagequeue':
                //서버에 특정 유저의 순서 변경 요청
                break;
            default:
                break;
        }
    }

    return (
        <div className="queueallbutton" onClick={handleClick}>
            <img className="order-icon" alt="" src={Qorder} />
        </div>
    );
};

const QGrabButton = ({ data, index }) => {
    const [IsGrabbing, setIsGrabbing] = useRecoilState(getIsGrabbingAtom(index));
    const handleClick = () => {
        setIsGrabbing(true);
    }
    return (
        <div className="queueallbutton" onClick={handleClick}>
            <img className="stagebuttongrabicon" alt="" src={Qgrab} />
        </div>
    );
};

const QDeleteButton = ({ data,index,ks }) => {
    const [myQueue,setMyQueue] = useRecoilState(MyQListAtom);
    const handleClick = () => {
        switch (ks) {
            case 'myqueue':
                setMyQueue(v=>v.filter((v,i)=>i!==index));
                break;
            default:
                break;
        }

    }
    return (
        <div className="queueallbutton" onClick={handleClick}>
            <img className="delete-icon" alt="" src={Qdelete} />
        </div>
    );
};

const QRemuserButton = ({ data }) => {
    const handleClick = () => {

    }
    return (
        <div className="queueallbutton">
            <img className="stagebuttongrabicon" alt="" src={Qremuser} />
        </div>
    )

}


const QueuePlayItemButtonSet = ({ keyString, data, index }) => {
    const set = {
        normal: {
            e: [QPlayButton, QGrabButton]
        },
        stagequeue: {
            e: [QOrderButton, QGrabButton, QRemuserButton],
        },
        history: {
            e: [QPlayButton, QGrabButton]
        },
        search: {
            e: [QPlayButton, QGrabButton]
        },
        myqueue: {
            e: [QGrabButton, QOrderButton, QDeleteButton]
        }
    };
    const ComponentList = set[keyString].e;

    return (
        <div className="qitembuttons" style={{ display: 'none' }}>
            {ComponentList.map((Component, i) => <Component key={i} data={data} index={index} ks={keyString} />)}
        </div>
    );
};

export default QueuePlayItemButtonSet;
