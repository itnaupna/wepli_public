import React, { useCallback, useEffect, useRef, useState } from 'react';
import './CSM.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import Upload from '../PlayStageImage/Icon/upload.svg';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../mypage/photo/wplieonlylogo.png';

function makeAddress(length) {

    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const CSM = ({ types, onClose}) => {
    const bucketURl = process.env.REACT_APP_BUCKET_URL;
    const initialAddress = makeAddress(5);//address길이를 5로 설정
    const [StageTitle, setStageTitle] = useState("");
    const [StageAddress, setStageAddress] = useState(initialAddress);
    const [StagePw, setStagePw] = useState(null);
    const [StageTags, setStageTags] = useState("");
    const [StageGenres, setStageGenres] = useState("");
    const [StageDesc, setStageDesc] = useState("");
    const StageImgRef = useRef();
    const [StageImg, setStageImg] = useState(bucketURl + "/stage/4a878683-bb43-4391-a228-b5eabaeb51c3");
    // const [StageImg,setStageImg] = useState(null);
    const [uploadStageImgName, setUploadStageImgName] = useState("/stage/4a878683-bb43-4391-a228-b5eabaeb51c3");
    const navigate = useNavigate();
    const [fetchedStageData,setFechedStageData] = useState(null);
    const [initialDataLoaded,setInitialDataLoaded] = useState(false);
    const [pw, setPw] = useState('');
    const [isPasswordEntered, setIsPasswordEntered] = useState(false);    
    const [isEditMode,setIsEditMode] = useState(types === false);
    const stageUrl = useParams().stageUrl;
    useEffect(()=>{
        if(types ===false && !initialDataLoaded){
 
                Axios({
                    method:"get",
                    url:"/api/lv0/s/stageinfo",
                    params:{address:stageUrl},
                })
                .then((response)=>{
                    const StageData = response.data;
                    setFechedStageData(StageData);
                    setInitialDataLoaded(true);
                    setStageTitle(StageData.title);
                    setStagePw(StageData.maxlength);
                    setStageTags(StageData.tag);
                    setStageGenres(StageData.genre);
                    setStageDesc(StageData.desc);
                    setStageImg(bucketURl + StageData.img);
                    setUploadStageImgName(StageData.img);
                    console.log(response.data);
                })
                .catch((error)=>{
                    console.error("스테이지 정보 가져오는데 에러발생",error);
                });
            
        }
    },[types,initialDataLoaded,StageAddress,isEditMode,fetchedStageData]);



    useEffect(()=>{
        setIsEditMode(types === false);
    },[types])
    
    const handleCreateOrUpdate = () =>{
        if(isEditMode){
            updateStage();
        }else{
            CreateStage();
        }
    }
    
  const updateStageData = {
    title: StageTitle,
    maxlength: StagePw,
    address:stageUrl,
    tag: StageTags,
    genre: StageGenres,
    desc: StageDesc,
    nick: JSON.parse(sessionStorage.getItem('data') || localStorage.getItem('data')).nick,
    img: uploadStageImgName,
  };

  const updateStage = () => {
    Axios.patch('/api/lv2/s/stage', updateStageData)
      .then((res) => {
        if (res.data) {
          if (localStorage.getItem('data')) {
            let d = JSON.parse(localStorage.getItem('data'));
            d.stagetitle = StageTitle;
            localStorage.setItem('data', JSON.stringify(d));
          } else if (sessionStorage.getItem('data')) {
            let d = JSON.parse(sessionStorage.getItem('data'));
            d.stagetitle = StageTitle;
            sessionStorage.setItem('data', JSON.stringify(d));
          }
          navigate(0);
        } else {
          alert('스테이지 수정 실패');
        }
      })
      .catch((error) => {
        alert('스테이지 수정 에러: ' + error);
      });
  };
    

    const StageTitleOnChange = useCallback(e => {
        setStageTitle(e.target.value);
    });
    const StageDescOnChange = useCallback(e => {
        setStageDesc(e.target.value);
    });
    const StagePwOnChange = useCallback(e => {
        setStagePw(e.target.value);
    });
    const StageTagsOnChange = useCallback(e => {
        setStageTags(e.target.value);
    });
    const StageGenresOnChange = useCallback(e => {
        setStageGenres(e.target.value);
    });
    const onClickImageUpload = () =>{
        StageImgRef.current.click();
    };

    // const saveStageImg = (e) => {
    //     const uploadStageImg = new FormData();
    //     uploadStageImg.append('directoryPath', "stage");
    //     uploadStageImg.append('upload', e.target.files[0]);
    //     Axios({
    //         method: "post",
    //         url: "/api/lv1/os/imgupload",
    //         data: uploadStageImg,
    //         headers: { "Content-Type": "multipart/form-data" }
    //     }).then(res => {
    //         setUploadStageImgName(res.data);
    //     }).catch(error => {
    //         console.log(error);
    //     })
    //     setUploadStageImgName(uploadStageImg);
    //     const StageImgfile = StageImgRef.current.files[0];
    //     const reader = new FileReader();
    //     reader.readAsDataURL(StageImgfile);
    //     reader.onload = () => {
    //         setStageImg(reader.result);
    //     };
    // };
    const saveStageImg = (e) => {
        if (e.target.files.length === 0) {
          // 사용자가 이미지를 업로드하지 않은 경우, 기본 로고 이미지를 사용합니다.
          setUploadStageImgName("/stage/logo-image.png"); // 파일명을 적절히 변경합니다.
          setStageImg(bucketURl + "/stage/logo-image.png"); // 파일명을 적절히 변경합니다.
          // Axios를 발동하여 Bucket에 기본 로고 이미지를 올립니다.
          const uploadStageImg = new FormData();
          uploadStageImg.append('directoryPath', "stage");
          uploadStageImg.append('upload', {Logo}); // 기본 로고 이미지 파일을 추가합니다.
          Axios({
            method: "post",
            url: "/api/lv1/os/imgupload",
            data: uploadStageImg,
            headers: { "Content-Type": "multipart/form-data" }
          }).then(res => {
            // Bucket에 기본 로고 이미지가 업로드된 후, 아무런 작업 없이 그대로 둡니다.
          }).catch(error => {
            console.log(error);
          });
          return;
        }
      
        // 사용자가 이미지를 업로드한 경우, 기존 로직과 동일하게 처리합니다.
        const uploadStageImg = new FormData();
        uploadStageImg.append('directoryPath', "stage");
        uploadStageImg.append('upload', e.target.files[0]);
        Axios({
          method: "post",
          url: "/api/lv1/os/imgupload",
          data: uploadStageImg,
          headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
          setUploadStageImgName(res.data);
      
          // 사용자가 이미지를 업로드한 경우에만 StageImg 상태를 업데이트합니다.
          const StageImgfile = StageImgRef.current.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(StageImgfile);
          reader.onload = () => {
            setStageImg(reader.result);
          };
        }).catch(error => {
          console.log(error);
        });
      };
      
      
      
    
    const AddStageData = {
        title: StageTitle,
        address: StageAddress,
        maxlength: StagePw,
        tag: StageTags,
        genre: StageGenres,
        desc: StageDesc,
        nick: JSON.parse(sessionStorage.getItem("data") || localStorage.getItem('data')).nick,
        img: uploadStageImgName
    }

    const CreateStage = () => {
        if (StageTitle === "") {
            alert("정보를 입력해주세요.");
            return;
        }
        const CreateStageUrl = "/api/lv2/s/stage";
        Axios.post(CreateStageUrl, AddStageData)
            .then(res => {
                if (res.data) {
                    if (localStorage.getItem('data')) {
                        let d = JSON.parse(localStorage.getItem('data'));
                        d.stagetitle = StageTitle;
                        d.stageaddress = StageAddress;
                        localStorage.setItem('data',JSON.stringify(d));
                    } else if (sessionStorage.getItem('data')) {
                        let d = JSON.parse(sessionStorage.getItem('data'));
                        d.stagetitle = StageTitle;
                        d.stageaddress = StageAddress;
                        sessionStorage.setItem('data',JSON.stringify(d));
                    }
                    navigate(`${StageAddress}`);
                }
                else {
                    alert('생성실패');
                }
            })
            .catch((error) => {
                alert("실패에러" + error)
            })
    };
    const DeleteStage = async () => {
        const enteredPw = prompt('비밀번호를 입력하세요.');
        if (enteredPw) {
          const url = `/api/lv1/m/checkpassword?pw=${enteredPw}`;
          try {
            const res = await axios.post(url, { pw: enteredPw });
            if (res.data === true) {
              const confirmation = prompt('스테이지를 삭제하시려면 "확인"을 입력하세요.');
              if (confirmation === '확인') {
                // 비밀번호가 맞고 확인이 "확인"인 경우에만 스테이지 삭제 로직을 진행합니다
                const deleteUrl = `/api/lv2/s/stage`;
                try {
                  const response = await axios.delete(deleteUrl, {
                    params: {
                      pw: enteredPw,
                      title: StageTitle,
                    },
                  });
                  
                  if (response.data) {
                    alert('스테이지가 삭제되었습니다.');
                    setIsPasswordEntered(true); // 비밀번호가 올바르게 입력되었음을 표시하는 상태를 설정합니다
                    if (localStorage.getItem('data')) {
                      let d = JSON.parse(localStorage.getItem('data'));
                      d.stagetitle = null;
                      d.stageaddress = null;
                      localStorage.setItem('data', JSON.stringify(d));
                    } else if (sessionStorage.getItem('data')) {
                      let d = JSON.parse(sessionStorage.getItem('data'));
                      d.stagetitle = null;
                      d.stageaddress = null;
                      sessionStorage.setItem('data', JSON.stringify(d));
                    }
                    // 원하는 페이지로 이동합니다 (예: '/mypage')
                    navigate('/stage');
                  } else {
                    alert('스테이지 삭제 실패');
                  }
                } catch (error) {
                  console.error('스테이지 삭제 에러:', error);
                  alert('스테이지 삭제 에러: ' + error);
                }
              } else {
                alert('스테이지 삭제를 원하시면 확인을 입력해주세요.');
              }
            } else {
              setIsPasswordEntered(false); // 올바르지 않은 경우 결과를 UI에 표시하기 위해 false로 설정
              alert('비밀번호를 정확히 입력해주세요.');
            }
          } catch (error) {
            console.error(error);
            setIsPasswordEntered(false); // 올바르지 않은 경우 결과를 UI에 표시하기 위해 false로 설정
            alert('오류가 발생했습니다. 리액트 펀치가즈아');
          }
        } else {
          alert('비밀번호를 입력하지 않아 스테이지 삭제가 취소되었습니다.');
        }
      };
      

    return (
        <div className='CSMWrapper'>
            <div className='CSMContent CSMlv1'>
                <div className='btnCSM'  onClick={onClose}>{<ArrowBackIcon/>}</div>
                <div className='btnCSMTitle'>
                    <h1 style={{ textAlign: 'center' }}>
                        스테이지  {types ? '생성' : '수정'}
                    </h1>
                </div>
                <div className='btnCSM' onClick={DeleteStage}>{!types && <LayersClearIcon />}</div>
            </div>
            <div className='CSMContent CSMlv2'>
                {/* File input element */}
                <input
                    className='CSMFileInput' // Add a class name to style the file input element if needed
                    type='file'
                    accept='image/*'
                    multiple
                    ref={StageImgRef} // Connect the ref to the file input element
                    onChange={saveStageImg} // Handle the file selection in the onChange event
                />
                {/* Display the selected image or a background image */}
                <div
                    className='CSMImg'
                    src={StageImg}
                    style={{ backgroundImage: StageImg ? `url(${StageImg})` : `url(${Logo})` }}
                    onClick={onClickImageUpload}
                // Trigger the file input click when the image is clicked
                />
                <div className='CSMInfo'>
                    <input className='CSMInput' name='title' placeholder='제목' value={StageTitle} onChange={StageTitleOnChange} />
                    <input className='CSMInput' name='maxlength' type='number' min={'0'} placeholder='최대길이(초), 0 무제한' value={StagePw} onChange={StagePwOnChange} />
                    <input className='CSMInput' name='tags' value={StageTags} onChange={StageTagsOnChange} placeholder='태그 ( , 로 구분) / 최대 4개' />
                    <input className='CSMInput' name='genres' value={StageGenres}  onChange={StageGenresOnChange} placeholder='장르 ( , 로 구분) / 최대 4개' />
                </div>
            </div>
            <div className='CSMContent CSMlv3'>
                <input className='CSMDetail' name='description' value={StageDesc} onChange={StageDescOnChange} placeholder='간단한 소개를 입력하세요. (최대 50자)' />
            </div>
            <div className='CSMContent CSMlv4'>
                <button className="button button--pipaluk button--inverted button--round-l button--text-thick button--text-upper"
                onClick={handleCreateOrUpdate}>
                    스테이지 {types ? '생성' : '수정'}
                </button>
            </div>
        </div>
    );
};

export default CSM;