import React, { useEffect, useRef, useState } from 'react';
import QueuePlayItemButtonSet from './QueuePlayItemButtonSet';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ButtonTypeAtom, IsGrabbingAtom, getIsGrabbingAtom } from '../../recoil/StageDataAtom';
import { LoginStatusAtom } from '../../recoil/LoginStatusAtom';
import GrabToPlaylist from './GrabToPlaylist';



const QueuePlaylist = ({ data, rank, index }) => {
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
                infoRef.current.style.maxWidth = `420px`;
            }
        }
    }, [showButton]);

    return (
        <div
            className='qplidiv'
            style={{ display: 'flex', alignItems: 'center', justifyContent: '', alignSelf: 'stretch', gap: '5px', padding: '0 5px' }}
            onMouseEnter={() => { setShowButton(true) }}
            onMouseLeave={() => { setShowButton(false) }}
        >
            {IsGrabbing
                ? <GrabToPlaylist data={data} index={index}/>
                : <>
                    <div>{rank}</div>
                    <img src={data.snippet.thumbnails.default.url} alt='' style={{ width: '50px', height: '50px' }} />
                    <div className='qpliinfo' style={{ flex: '1', maxWidth: '370px' }} ref={infoRef}>
                        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {/* {data.snippet.title} */}
                            <span dangerouslySetInnerHTML={{ __html: data.snippet.title }} />
                        </div>
                        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {data.snippet.channelTitle}
                        </div>
                    </div>
                    <div ref={btnSetRef}>
                        {IsLogin && showButton && <QueuePlayItemButtonSet keyString={ButtonType} data={data} index={index} />}
                    </div>
                </>
            }
        </div>
    );
};

export default QueuePlaylist;