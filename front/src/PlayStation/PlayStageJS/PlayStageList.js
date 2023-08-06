import React, { useCallback, useEffect, useRef, useState } from "react";
import '../PlayStageCss/s-l-p.css';
import SLPFollowBackIcon from '../PlayStageImage/Icon/SLPFollowBackIcon.svg';
import SLPFollowNextIcon from '../PlayStageImage/Icon/SLPFollowNextIcon.svg';
import StageItemBig from "./StageItemBig";
import ResultItem from "./ResultItem";
import CreateStageModal from "./CreateStageModal.js";
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from "./PlayStageSearchBar.js";
import StageSlide from './StageSlide.js';
import { useRecoilState, useRecoilValue } from "recoil";
import { QueryStringAtom, SearchStageAtom } from "../../recoil/StageSearchAtom";
import { LoginStatusAtom } from "../../recoil/LoginStatusAtom";


function PlayStageList(props) {
  const [modalOpen, setModalOpen] = useState(false);
  // 모달창 노출
  const showModal = () => {
    setModalOpen(true);
  };
  const [resItems, setResItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(9);
  const [searchStageAtom, setSearchStageAtom] = useRecoilState(SearchStageAtom);
  const queryString = useRecoilValue(QueryStringAtom);
  // useEffect(() => {
  //   axios.get("/api/lv0/s/stage", { params: { curr: 1, cpp: 3} })
  //     .then(res => { setResItems(res.data); console.log(res.data); })
  //     .catch(res => console.log(res));
  // }, []);
  const listHandler = (type, orderByDay) => { 

    axios.get("/api/lv0/s/search", { params: {type: type == null ? 0 : type, orderByDay: orderByDay == null ? true : orderByDay, queryString: queryString, curr: 1, cpp: currentPage } })
    .then(res => {
        setSearchStageAtom([...res.data]);
    })
    .catch(res => console.log(res));
  }

  useEffect(() => {
    listHandler();
  }, [currentPage]);

  //최신순(기본값) 인기순 토글 셀렉트
  const [type1, setType1] = useState(0);
  const [type2, setType2] = useState(0);
  const [toggleOption1, setToggleOption1] = useState(["최신순", "인기순"]);
  const [toggleOption2, setToggleOption2] = useState(["제목", "닉네임", "장르", "태그"]);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [checkStage, SetCheckStage] = useState(false);
  const [confirmAccount, SetConfirmAccount] = useState(0);
  const loginStatus = useRecoilValue(LoginStatusAtom);

  const toggle1Dropdown = () => {
    setIsOpen1(!isOpen1);
  };
  const toggle2Dropdown = () => {
    setIsOpen2(!isOpen2);
  };
  const SelectOption1 = (e) => {
    setType1(e.target.getAttribute("option"));
  }
  const SelectOption2 = (e) => {
    setType2(e.target.getAttribute("value"));
  }
  useEffect(() => {
    if (sessionStorage.getItem("data") != null) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);
  //이메일,핸드폰 인증
  const data = JSON.parse(sessionStorage.getItem("data"));

  const isAuthenticated = (data) => {
    return data.emailconfirm === 1 || data.phoneconfirm === 1;
  };
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    //로그인된 사용자 정보 가져오기(sessionStorage)
    const data = JSON.parse(sessionStorage.getItem("data") || localStorage.getItem('data'));
    if (data) {
      setShowTop(isAuthenticated(data));
    } else {
      setShowTop(false)
    }
  }, [loginStatus]);



  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
    if (isAtBottom) {
      setCurrentPage(prevPage => prevPage + 9);
    }
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    return () => {
      // 스크롤 이벤트 리스너 해제
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="slp">
      {showTop && (
        <div className="slptop" style={{ display: 'flex' }}>
          <div className="slpmystagewrapper">
            <StageItemBig/>
          </div>
          <div className="slpfollowwrapper">
            <StageSlide/>
          </div>
        </div>
      )}
      <div className="slpbottom">
        <div className="slpsearchwrapper">
          <SearchBar listHandler={listHandler}/>
        </div>
        <div className="slpresult">
          {  searchStageAtom.length === 0 ? <h2>검색결과가 없습니다</h2> :
            searchStageAtom.map((v, i) =>
              <Link to={"/stage/" + v.address} key={i}>
                <ResultItem data={v} />
              </Link>
            )
          }
        </div>
      </div>
    </div>
  );
}
export default PlayStageList;