import React, { useEffect, useRef, useState } from 'react';
import '../PlayStageCss/CreateStageModal.css';
import { Navigate, useNavigate } from "react-router-dom";
import Cancel from '../PlayStageImage/Icon/Cancel.svg';
import Create from '../PlayStageImage/Icon/Create.svg';
import Logo from '../PlayStageImage/img/Logo.png';
import Upload from '../PlayStageImage/Icon/upload.svg';
import axios from 'axios';

function CreateStageModal({ setModalOpen }) {
  // const [address,setAdress] =('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [genre, setGenre] = useState('');
  const [tag, setTag] = useState('');
  const [pw, setPw] = useState('');
  const navi = useNavigate();
  const [img, setImg] = useState('');
  const [disable, setDisable] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [isPhoto, setIsPhoto] = useState(true);
  const fileInputRef = useRef(null);
  //파일 업로드/미리보기 이벤트
  const onUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve) => {
      reader.onload = () => {
        setImg(reader.result || null);//파일의 컨텐츠
        setIsPhoto(false);
        resolve();
      };
    });
  };
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // ref가 null이 아닐 때만 click() 메소드 호출
    } // ref를 사용하여 파일 업로드 input 요소 클릭 이벤트 호출

  };
  //Private일 경우 비밀번호 나오게 div 나오게 만들기

  const OpenPw = (e) => {
    if (!isPublic) {
      setDisable(true);
      setIsPublic(true);
      setPw('');
    } else {
      setDisable(false);
      setIsPublic(false);
    }
  };
  //모달 끄기
  const closeModal = () => {
    setModalOpen(false);
  };
  // const MakeStage = useNavigate("/PlayStage.js/${address}")
  //모달 외부 클릭 시 끄기 처리
  //Modal 창을 useRef로 취득
  const modalRef = useRef(null);
  useEffect(() => {
    //이벤트 핸들러 함수
    const handler = (e) => {
      //mousedown 이벤트가 발생한 영역이 모달창이 아닐 때 , 모달창 제거 처리.
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
      }
    };
    //이벤트  핸들러 등록
    document.addEventListener('mousedown', handler);
    //모바일 버전
    document.addEventListener('touchstart', handler);
    return () => {
      //이벤트 핸들러 해제
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);//모바일
    };

  });
  //정보 기입 확인
  const handleSubmit = (e) => {
    e.preventDefault();
    //입력 필드값 검증
    if (title === '' || desc === '' || genre === '' || tag === '' || img === '') {
      alert('모든 정보를 기입해주세요');//입력필드가 하나라도 비어있을 시
      console.log('success!');
      return;
    } else {

      setModalOpen(false);
      console.log('Create success!')
    }
  }
  //스테이지 생성
  const MakeStage = async () => {
    const url = "/api/lv2/s/stage";

      try {
        const res = await axios.post(url,{title,pw,tag,genre});
        if(res.data){
          console.log("Create success!");
          window.location.reload();
        }
  
      }catch(error){
        console.log(error);
        alert("스테이지 생성에 실패했습니다.");
      }
    };
    return (
      <div className='modal__background'>
        <div ref={modalRef} className="Mcreatestagemodal-parent">
        <div className="Mcreatestagemodal">
          <div className="Mcreatestagemodal-inner">
            <div className="MFrame-child" />
          </div>
          <div className="MWrapper">
            <div className="Mdiv">
              <div className="Mchild" />
              <form onSubmit={handleSubmit}>
                <button type='submit' className='MCreateStage'>Stage 생성</button>                
              </form>
            </div>
          </div>
      </div>
          {/* <a href='./PlayStage.js'>
    try {
      const res = await axios.post(url, { title, pw: pw, tag, genre });
      if (res.data) {
        window.onload.reload();
        Navigate("/stage/url");
      }

    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return (
    <div ref={modalRef} className="Mcreatestagemodal-parent">
      <div className="Mcreatestagemodal">
        <div className="Mcreatestagemodal-inner">
          <div className="MFrame-child" />
        </div>
        <div className="MWrapper">
          <div className="Mdiv">
            <div className="Mchild" />
            <form onSubmit={handleSubmit}>
              <button type='submit' className='MCreateStage'>Stage 생성</button>
            </form>
          </div>
        </div>
        {/* <a href='./PlayStage.js'>
            <img className="createstagemodal-child" alt=""/>
          </a> */}
        <div className="MFindmodaltitle">
          <div className="MWepli">WEPLi</div>
        </div>
        <div className="MMakestage">Stage 생성</div>
        <div className="Mmypageemailmodal">
          <div className="MCrectangle-parent">
            <div className="Mgroup-child" />
            {isPhoto ? (
              <div className='MPhotoUploadSpace'>
                <label className="MPhotoUpload-file-button" for="ImageUpload">
                  <img src={Upload} alt='' />
                </label>
                <input
                  ref={fileInputRef} // 파일 업로드 input 요소에 ref 연결
                  accept='image/*' multiple type='file' id='ImageUpload' style={{ display: 'none' }}
                  onChange={e => onUpload(e)}>
                </input>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef} // 파일 업로드 input 요소에 ref 연결
                  accept='image/*' multiple type='file' id='ImageUpload' style={{ display: 'none' }}
                  onChange={e => onUpload(e)}>
                </input>
                <img




                  width={'60%'} src={img} alt='' className='MgroupChildImage' for='ImageUpload' onClick={handleImageClick} />
              </div>
            )}




          </div>

          <img
            className="Mmypageemailmodal-child"
            alt=""
            src={Cancel}
            onClick={closeModal}
          />

          <div className="Mrectangle-group">
            <div className="Mgroup-item" />
            <div className="Mcontainer">
              <div className="MStageTitle">
                <input type='text' className='MStageTitleSpace' placeholder='스테이지 제목' value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="Mrectangle-container">
            <div className="Mgroup-inner" />
            <div className="Mcheckbox-wrapper">
              <input type='text' className='McheckboxPW' disabled={disable} placeholder='패스워드 입력'
                value={pw} onChange={(e) => setPw(e.target.value)} />
              <input type='checkbox' onClick={OpenPw} />Private
              {/* <div className="checkbox-">{`공개 비공개(checkBox)->비공개 암호설정`}</div> */}
            </div>
          </div>
          <div className="Mgroup-div">
            <div className="Mgroup-inner" />
            <div className="Mframe">
              <input type='text' className='MTagSpace' placeholder='태그입력' value={tag} onChange={(e) => setTag(e.target.value)} />
            </div>
          </div>
          <div className="MCrectangle-parent1">
            <div className="Mgroup-inner" />
            <div className="Mframe">
              <input type='text' className='MCframeGenre' placeholder='장르입력' value={genre} onChange={(e) => setGenre(e.target.value)} />
            </div>
          </div>
        </div>
        <img
          className="Mwplieonlylogo-4-icon"
          alt=""
          src={Logo}
        />
      </div>
    </div>
  );
}

export default CreateStageModal;