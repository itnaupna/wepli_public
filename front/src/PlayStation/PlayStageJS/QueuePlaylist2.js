import React, { useEffect, useRef, useState } from 'react';
import QueuePlayItemButtonSet from './QueuePlayItemButtonSet';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ButtonTypeAtom, GetBucketImgString, SecondToHMS, getIsGrabbingAtom, getTimeDifference } from '../../recoil/StageDataAtom';
import { LoginStatusAtom } from '../../recoil/LoginStatusAtom';
import GrabToPlaylist from './GrabToPlaylist';



const QueuePlaylist2 = ({ data, rank, index, nick }) => {
    const ButtonType = useRecoilValue(ButtonTypeAtom);
    const IsLogin = useRecoilValue(LoginStatusAtom);
    const [showButton, setShowButton] = useState(false);
    const btnSetRef = useRef();
    const infoRef = useRef();
    const timeinfoRef = useRef();
    const [IsGrabbing, setIsGrabbing] = useRecoilState(getIsGrabbingAtom(index));
    useEffect(() => {
        if (showButton && !IsGrabbing && infoRef.current) {
            const width = +btnSetRef.current.offsetWidth;
            infoRef.current.style.maxWidth = `${parseInt(infoRef.current.style.maxWidth) - width}px`;
        } else {

            if (infoRef.current) {
                infoRef.current.style.maxWidth = `${420 - timeinfoRef.current.offsetWidth}px`;
            }
        }
    }, [showButton]);
    useEffect(() => {
        console.log(data);
    }, [data]);
    return (
        <div
            className='qplidiv'
            style={{ display: 'flex', alignItems: 'center', justifyContent: '', alignSelf: 'stretch', gap: '5px', padding: '0 5px' }}
            onMouseEnter={() => { setShowButton(true) }}
            onMouseLeave={() => { setShowButton(false) }}
        >
            {IsGrabbing
                ? <GrabToPlaylist data={data} index={index} />
                : <>
                    <div>{rank}</div>
                    <img src={data.img ? GetBucketImgString(data.img) : `https://i.ytimg.com/vi/${data.songaddress}/default.jpg`} alt='' style={{minWidth:'50px', width: '50px', height: '50px' }} />
                    <div className='qpliinfo' style={{ flex: '1', maxWidth: '370px' }} ref={infoRef}>
                        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {data.title}
                        </div>
                        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {data.singer}{nick && " by " + nick}{ButtonType==='history' && " by " + data.nick} {data.playdate && getTimeDifference(data.playdate)}
                        </div>
                    </div>

                    <div ref={timeinfoRef}>
                        {
                            ButtonType === 'history' &&
                            <div>
                                {data.likes}/{data.dislikes}
                            </div>
                        }
                        {
                            ButtonType !== 'search' && <div>
                                {SecondToHMS(+data.songlength)}
                            </div>
                        }
                    </div>
                    <div ref={btnSetRef}>
                        {IsLogin && showButton && <QueuePlayItemButtonSet keyString={ButtonType} data={data} index={index} />}
                    </div>
                </>
            }
        </div>
    );
};

export default QueuePlaylist2;