import React, { useEffect, useState } from 'react';
import "./css/MusicPlayerBar.css";
import shuffle from "./svg/shuffle.svg";
import previous from "./svg/previous.svg";
import play from "./svg/playbtn.svg";
import next from "./svg/next.svg";
import repeat from "./svg/repeate.svg";
import volume from "./svg/volumedown.svg";
import pause from "./svg/pause.svg";
// import axios from 'axios';
import { useRecoilState } from 'recoil';
import { YoutubeAtom } from '../recoil/YoutubeAtom';
function MusicPlayerBar(props) {
  const [YTP, setYTP] = useRecoilState(YoutubeAtom);
  const [songTitle, setSongTitle] = useState('노래제목');
  const [songAuthor, setSongAuthor] = useState('가수');
  const [songImg, setSongImg] = useState('/static/media/back.baaf88626dae5f09f4b790e430a5e53e.svg');
  const [forRender, setForRender] = useState(0);

  useEffect(() => {
    if (YTP) {
      const timer = setInterval(() => {
        setForRender(YTP?.getCurrentTime());
      }, 10);

      return () => {
        clearInterval(timer);
      };
    }
  }, [YTP]);

  return (
    <div className="musicplayerframe">
      <div className="musicplayerbody">
        <div className="musicplayerbg">
          <img
            className="musicplayerbgimg-icon"
            alt=""
            src={songImg}
          />
          <div className="musicplayerbgeffect" />
        </div>
        <div className="musicplayersonginfo">
          <img className="albumcover-icon" alt="" src={songImg} />
          <div className="songsname-parent">
            <div className="songsname">{songTitle}</div>
            <div className="singer">{songAuthor}</div>
          </div>
        </div>
        <div className="musicplayerplaybar">
          <img onClick={() => {
            if (YTP)
              YTP?.setShuffle(true);
          }}
            className="musicplayershuffleiconbody"
            alt=""
            src={shuffle}
          />
          <img
            onClick={() => {
              if (YTP)
                YTP?.previousVideo();
            }}
            className="musicplayerpreviousiconbody"
            alt=""
            src={previous}
          />
          <div className="musicplayerplaybuttonbody" onClick={() => {
            if (YTP)
              if (YTP?.getPlayerState() === 1) {
                YTP.pauseVideo();
              } else {
                YTP.playVideo();
              }
          }}>
            <img
              className="musicplayerplaybutton-icon"
              alt=""
              src={YTP?.getPlayerState() === 1 ? pause : play}
            />
          </div>
          <img
            onClick={() => {
              if (YTP)
                YTP?.nextVideo();
            }}
            className="musicplayerpreviousiconbody"
            alt=""
            src={next}
          />
          <img
            className="musicplayershuffleiconbody"
            alt=""
            src={repeat}
          />
        </div>
        <div className="musicplayervolume">
          <img className="soundonicon" alt="" src={volume} />
          <div className="musicplayervoulmebar">
            <div className="endvoulmebar" />
            <div className="startvoulmebar" />
          </div>
        </div>
      </div>
      <div className="musicplayerheader" style={{
        width: `${YTP?.getCurrentTime() / YTP?.getDuration() * 100}%`
      }} />
    </div>
  );
}

export default MusicPlayerBar;