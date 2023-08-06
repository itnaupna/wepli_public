import React, { useEffect, useState } from 'react';
import './MusicBarV2.css';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Slider, ToggleButton } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RepeatIcon from '@mui/icons-material/Repeat';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IsPlayingAtom, YTPListAtom, YoutubeAtom } from '../recoil/YoutubeAtom';
import { StageUrlAtom } from '../recoil/ChatItemAtom';
import { GetBucketImgString } from '../recoil/StageDataAtom';




const MusicBarV2 = () => {
    const [buttonvalue, setButtonvalue] = useState(() => []);
    const [isp, setIsp] = useRecoilState(IsPlayingAtom);
    const [YTP, setYTP] = useRecoilState(YoutubeAtom);
    const [currentTime, setCurrentTime] = useState(0);
    const [loop, setLoop] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [mute, setMute] = useState(false);
    const [YTPList, setYTPList] = useRecoilState(YTPListAtom);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [playerNick, setPlayerNick] = useState('');
    const [img, setImg] = useState('');
    const su = useRecoilValue(StageUrlAtom);

    useEffect(() => {
        if (YTP) {
            const timer = setInterval(() => {
                setCurrentTime(YTP?.getCurrentTime());
            }, 10);

            return () => {
                clearInterval(timer);
            };
        }
    }, [YTP]);

    useEffect(() => {
        let videoId = YTP?.getVideoUrl()?.split("?v=")[1]?.substr(0, 11);
        // console.log(videoId);
        if (!videoId) return;
        let data = YTPList[videoId];
        setTitle(data?.title);
        setAuthor(data?.singer);
        setPlayerNick(data?.playerNick);
        setImg((data?.img && GetBucketImgString(data.img)) || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);

    }, [isp])




    useEffect(() => {
        if (YTP)
            YTP?.setShuffle(shuffle);
    }, [shuffle, YTPList]);

    useEffect(() => {
        if (YTP)
            YTP?.setLoop(loop);
    }, [loop]);

    useEffect(() => {
        mute ? YTP?.mute() : YTP?.unMute();
    }, [mute]);

    const handleBV = (e, v) => {
        setButtonvalue(v);
    }



    return (
        <div className='MPF'>
            <div className='MPFTop' style={{
                width: `${YTP?.getCurrentTime() / YTP?.getDuration() * 100}%`
            }} />
            <div className='MPFBody' style={{ backgroundImage: `url("${img}")` }}>
                <div className='MPFBlur' />
                <div className='MPFInfo'>
                    <div className='MPFImg' style={{ backgroundImage: `url("${img}")` }} />
                    <div className='MPFText'>
                        <h3 style={{ fontSize: '180%' }}>{title || "재생중인 곡이 없습니다."}</h3>
                        <font style={{ fontSize: '120%' }}>{author}{playerNick ? " by " + playerNick : null}</font>
                    </div>
                </div>
                <div className='MPFController'>
                    {su === null &&
                        <div className='MPFButton'>
                            <ToggleButtonGroup color='secondary'
                                value={buttonvalue}
                                onChange={handleBV}
                                style={{ flex: '1', justifyContent: 'space-around' }}
                            >
                                <ToggleButton value="s" onClick={() => {
                                    setShuffle(!shuffle);
                                }}>
                                    <ShuffleIcon />
                                </ToggleButton>
                                <ToggleButton onClick={() => {
                                    if (YTP)
                                        YTP?.previousVideo();
                                }}>
                                    <SkipPreviousIcon />
                                </ToggleButton>
                                <ToggleButton
                                    onClick={() => {
                                        isp === 1 ? YTP?.pauseVideo() : YTP?.playVideo()
                                    }}
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(0, 0, 255, 0.1), rgba(0, 0, 255, 0.5))'
                                    }} >
                                    {isp === 1 ? <PauseIcon style={{ fill: '#fff' }} /> : <PlayArrowIcon style={{ fill: '#FFF' }} />}
                                </ToggleButton>
                                <ToggleButton onClick={() => {
                                    if (YTP)
                                        YTP?.nextVideo();
                                }}>
                                    <SkipNextIcon />
                                </ToggleButton>
                                <ToggleButton value="l" onClick={() => {
                                    setLoop(!loop);
                                }}>
                                    <RepeatIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    }
                    <div className='MPFSound'>
                        <span onClick={() => {
                            setMute(!mute);
                        }}>
                            {YTP && mute ?
                                <VolumeOffIcon />
                                : YTP?.getVolume() > 50
                                    ? <VolumeUpIcon />
                                    : YTP?.getVolume() > 0
                                        ? <VolumeDownIcon />
                                        : <VolumeMuteIcon />
                            }
                        </span>
                        <Slider value={(YTP && YTP?.getVolume())} onChange={(e) => { YTP?.setVolume(e.target.value); setCurrentTime(e.target.value) }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicBarV2;