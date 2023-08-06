import React, { useEffect } from 'react';
import SLPMystagePeopleIcon from '../PlayStageImage/Icon/SLPMystagePeopleIcon.svg';
import SLPMystagePlayingTitleIcon from '../PlayStageImage/Icon/SLPMystagePlayingTitleIcon.svg';
import { GetBucketImgString } from '../../recoil/StageDataAtom';
// import TestImg from '../PlayStageImage/img/SLPMystageImg.png';

const DEFAULTIMG = 'https://kr.object.ncloudstorage.com/wepli/playlist/88e584de-fb85-46ce-bc1a-8b2772babe42';

const ResultItem = ({ data }) => {
  // useEffect(()=>{
  //   // console.log(data);
  // },[data])
  //background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("");
  return (
    <div className="slpresultitem" style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("${data.img
        ? GetBucketImgString(data.img)
        : (data?.info?.songInfo?.img && GetBucketImgString(data.info.songInfo.img)) ||
        DEFAULTIMG}")`
    }}>
      <div className="slpitembigheader">
        <div className="slpresultitemimgwrapper">
          <img
            className="slpresultitemimg-icon"
            alt="스테이지썸네일"
            src={data.img
              ? GetBucketImgString(data.img)
              : (data?.info?.songInfo?.img && GetBucketImgString(data.info.songInfo.img)) ||
              DEFAULTIMG}
          />
        </div>
        <div className="slpresultiteminfo">
          <div className="slpresultitempeoplewrapper">
            <img
              className="slpmystagepeopleicon"
              alt=""
              src={SLPMystagePeopleIcon}
            />
            <div className="slpmystagelikecount">{Object.keys(data.info.users).length}</div>
          </div>
          <div className="slpresultitemowner">@{data.nick}</div>
          <div className="slpresultitemcategory">
            {data.genre?.split(',')[0] === undefined ? null : '#' + data.genre?.split(',')[0]}
          </div>
          <div className="slpresultitemcategory">
            {data.tag?.split(',')[0] === undefined ? null : '#' + data.tag?.split(',')[0]}
          </div>
        </div>
      </div>
      <div className="slpresultitembottom">
        <div className="slpresultitemtitle">
          {/* {data.pw ? "🔒" : null} */}
          {data.title}
        </div>
        <div className="slpresultitemdescription">
          {data.desc}
        </div>
        <div className="slpresultitemplayinginfo">
          <img
            className="slpmystagepeopleicon"
            alt=""
            src={SLPMystagePlayingTitleIcon}
          />
          <div className="slpmystageplayingtitle">
          {data.info?.songInfo?.title || "재생중인 곡이 없습니다."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultItem;