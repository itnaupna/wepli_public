import React, { useEffect, useState } from 'react';
import SLPMystageLikeIcon from '../PlayStageImage/Icon/SLPMystageLikeIcon.svg';
import SLPMystagePeopleIcon from '../PlayStageImage/Icon/SLPMystagePeopleIcon.svg';
import SLPMystageQIcon from '../PlayStageImage/Icon/SLPMystageQIcon.svg';
import SLPMystagePlayingTitleIcon from '../PlayStageImage/Icon/SLPMystagePlayingTitleIcon.svg';
import CreateStageModal from "./CreateStageModal.js";
import CSM from "./CSM";
import { Modal } from "@mui/material";
import axios from 'axios';
import { Link } from 'react-router-dom';


const StageItemBig = () => {
  const BUCKETURL = process.env.REACT_APP_BUCKET_URL;
  const DEFAULTIMG = 'https://kr.object.ncloudstorage.com/wepli/playlist/88e584de-fb85-46ce-bc1a-8b2772babe42';
  // 모달창 노출
  const [modalOpen, setModalOpen] = useState(false);
  const showModal = () => {
    setMo(true)
  };
  const [mo, setMo] = useState(false);
  const handleMo = () => setMo(true);
  const handleMc = () => setMo(false);
  const [data, setData] = useState();
  const [checkStage, SetCheckStage] = useState(true);

  useEffect(() => {
    setData(JSON.parse(sessionStorage.getItem("data") || localStorage.getItem('data')));
  }, []);

  useEffect(() => {
    if (data?.stageaddress === null) {
      SetCheckStage(true);
    } else {
      loadData();
      SetCheckStage(false);
      console.log("성공")
    }
    console.log(checkStage);
  }, [data]);



  const [stageData, setStageData] = useState(false);

  const loadData = async () => {
    let address = JSON.parse(sessionStorage.getItem("data") || localStorage.getItem('data')).stageaddress;
    if(address != null && address !== "") {
      let result = await axios.get("/api/lv0/s/stageinfo", { params: { address } });
      setStageData(result.data);
      console.log(result.data);
    }
  }

  if (!data) {
    return null;
  }


  return (
    <>
      {checkStage ? (
        // address가 null일 때 버튼을 렌더링합니다.
        <div className="StageModalContainer">
          <button onClick={handleMo}
            className="button button--nina button--round-l button--text-thick button--inverted makestageButton"
            data-text="스테이지생성">
  
            <span>스</span>
            <span>테</span>
            <span>이</span>
            <span>지</span>
            <span>생</span>
            <span>성</span>
          </button>
          <Modal open={mo}  onClose={handleMc}>
            <CSM types={true} onClose={handleMc}/>
          </Modal>
        </div>
      ) : (stageData &&
        // address가 null이 아닐 때 스테이지 정보를 렌더링합니다.
        <Link to={"/stage/" + stageData.address}>
          <div className="slpitembig" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('${stageData.img
              ? BUCKETURL + stageData.img
              : (stageData?.info?.songInfo?.img && BUCKETURL + stageData.info.songInfo.img) ||
              DEFAULTIMG}')`
          }}>
            <div className="slpitembigheader">
              <div className="slpitembigimgwrapper" >
                <img
                  className="slpitembigimg-icon"
                  alt="스테이지썸네일"
                  src={stageData.img
                    ? BUCKETURL + stageData.img
                    : (stageData?.info?.songInfo?.img && BUCKETURL + stageData.info.songInfo.img) ||
                    DEFAULTIMG}
                />
                <div className="slpitembigday">생성일 : {stageData.makeday}</div>
              </div>
              <div className="slpitembiginfo">
                <div className="slpitembiglikewrapper">
                  <img
                    className="slpmystagepeopleicon"
                    alt=""
                    src={SLPMystagePeopleIcon}
                  />
                  <div className="slpmystagelikecount">{Object.keys(stageData.info.users).length}</div>
                </div>
                <div className="slpitembiglikewrapper">
                  <img
                    className="slpmystagepeopleicon"
                    alt=""
                    src={SLPMystageQIcon}
                  />
                  <div className="slpmystagelikecount">{Object.keys(stageData.info.userQueue).length}</div>
                </div>
                <div className="slpmystageowner">@{stageData.nick}</div>
                <div className="slpmystagecategory">
                  #{stageData.tag?.split(',')[0]}
                </div>
                <div className="slpmystagecategory">
                  #{stageData.genre?.split(',')[0]}
                </div>
              </div>
            </div>
            <div className="slpitembigbody">
              <div className="slpmystagetitle">{stageData.title}</div>
              <div className="slpmystagedescription">
                {stageData.desc}
              </div>
              <div className="slpmystageplayingtitlewrapper">
                <img
                  className="slpmystagepeopleicon"
                  alt=""
                  src={SLPMystagePlayingTitleIcon}
                />
                <div className="slpmystageplayingtitle">
                  {stageData.info?.songInfo?.title || "재생중인 곡이 없습니다."}
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default StageItemBig;
