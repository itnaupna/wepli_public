import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from 'react-alice-carousel';
import ResultItem from "./ResultItem";
import '../PlayStageCss/StageSlide.css';
import PreButtonIcon from '../PlayStageImage/Icon/slpfollowPreButton.png';
import NextButtonIcon from '../PlayStageImage/Icon/slpfollowNextButton.png';
function StageSlider() {
  const [resItems, setResItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const stagePaddingConfig = {
    paddingLeft: 0,
    paddingRight: 0,
  };
  const responsive = {
    0: { items: 1 },
    568: { items: 1 },
    1024: { items: 1 },
  };


  useEffect(() => {
    axios.get("/api/lv0/s/stage", { params: { curr: 1, cpp: 6 } })
      .then(res => {
        setResItems(res.data);
        setLoading(false);
      })
      .catch(error => console.log(error));
  }, []);

  const bucketURl = process.env.REACT_APP_BUCKET_URL;
  const [FollowStage, setFollowStage] = useState([]);
  const [noLogin, setNoLogin] = useState("팔로우한 스테이지가 없습니다.");

  useEffect(() => {
    if (sessionStorage.getItem("data") !== null && localStorage.getItem("data") != null) {
      const FollowStageUrl = "/api/lv2/s/fstage";
      axios.get(FollowStageUrl)
        .then(res => setFollowStage(res.data))
        .catch(error => console.log(error));
    } else {
      setNoLogin("로그인 후 이용해주세요");
    }
  }, []);

  return (
    <div className="FollowStageSliderBody">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <AliceCarousel
          mouseTracking
          infinite // 무한 슬라이드를 구현하기 위해 infinite 속성을 설정
          animationDuration={200}
          stagePadding={[stagePaddingConfig]}
          disableDotsControls
        //   disableButtonsControls={false} 
          responsive={responsive}
          renderPrevButton={()=>{
            return <p className="p-4 absolute left-0 top-0"><img src={PreButtonIcon} alt=''/></p>
          }}
          renderNextButton={()=>{
            return <p className="p-4 absolute right-0 top-0"><img src={NextButtonIcon} alt=''/></p>
          }}
        >
          {resItems.map((v, i) => (
            <Link to={"/stage/" + v.address} key={i}>
              <ResultItem data={v} />
            </Link>
          ))}
        </AliceCarousel>
      )}
    </div>
  );
}

export default StageSlider;
