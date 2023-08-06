import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ToggleButton } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RepeatIcon from '@mui/icons-material/Repeat';
// import './TestPage.css';

function TestPage() {

  const TESTURL = {
    test: "/api/test",
    join: "/api/lv0/m/member",
    email: "/api/lv0/m/email",
    nick: "/api/lv0/m/nick",
    stage: "/api/lv0/s/stage",
    mypage: "/api/lv1/m/mypage",
    fstage: "/api/lv2/s/fstage",
    stagesearch: "/api/lv0/s/search",
    requestcode: "/api/lv1/m/requestcode",
    requestcodefind: "/api/lv0/m/requestcode",
    verifycode: "/api/lv1/m/verifycode",
    verifycodefind: "/api/lv0/m/verifycodefind",
    updatepw: "/api/lv0/m/findPw",
    login: "/api/lv0/m/login",
    logout: "/api/lv1/m/logout",
    memberProfile: "/api/lv1/m/profile",
    stageProfile: "/api/lv1/s/profile",
    pliProfile: "api/lv1/p/profile",
    songProfile: "api/lv1/song/profile",
    pwCheck: "api/lv1/m/checkpassword",
    pwChnage: "api/lv1/m/pw"
  }

  const bucketUrl = process.env.REACT_APP_BUCKET_URL;

  const [msg, setMsg] = useState('fail');
  const [emailPw, setEmailPw] = useState({ email: "", pw: "" });
  // const [token, setToken] = useState("");
  //미사용이라 주석처리해둠. 사용시 해제할것
  useEffect(() => {
    axios.get(TESTURL.test)
      .then(res => setMsg(res.data));
  }, [TESTURL.test]);

  const [nick, setNick] = useState("");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");

  const handleClickSubmit = async () => {
    try {
      const res = await axios.post(TESTURL.join, { email, pw, nick });
      if (res.data) {
        alert("success");
      } else {
        alert("fail");
      }
    } catch (err) {
      alert(`err : ${err}`);
    }
  }

  const handleCheckEmailExists = (e) => {
    axios.get(TESTURL.email, { params: { email } })
      .then(
        res => console.log(res.data)
      )
  }

  const handleCheckNickExists = (e) => {
    axios.get(TESTURL.nick, { params: { nick } })
      .then(
        res => console.log(res.data)
      )
  }

  const checkEmailExists = async (e) => {
    try {
      const response = await axios.get(TESTURL.email, { params: { email } });
      if (response.data) {
        alert('이메일이 이미 사용 중입니다.');
      } else {
        alert('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      console.error('오류가 발생했습니다.', error);
    }
  };
  const checkNick = async (e) => {
    try {
      const response = await axios.get(TESTURL.nick, { params: { nick } });
      if (response.data) {
        alert('이미 사용 중인 닉네임!.');
      } else {
        alert('가능한 닉네임!');
      }
    } catch (error) {
      console.error('오류가 발생했습니다.', error);
    }
  };
  const [curr, setCurr] = useState(1);
  const [cpp, setCpp] = useState(5);

  const [stages, setStages] = useState([]);

  const handleShowStages = async () => {
    try {
      const res = await axios.get(TESTURL.stage, { params: { nick, curr, cpp } });
      setStages(res.data);
    } catch (err) {
      alert(err);
    }
  }

  const [myinfo, setMyinfo] = useState(
    {
      email: "",
      nick: "",
      phone: "",
      emailconfirm: "",
      phoneconfirm: "",
      img: "",
      desc: "",
      socialtype: "",
      lstblack: [],
      hidechat: 0,
      mute: 0,
      lstfollow: [],
      lstpli: [
        {
          idx: 0,
          title: "",
          makeday: "",
          ispublic: 0
        }
      ],
      stagetitle: "",
      stageaddress: ""
    }
  );
  const [myinfores, setMyinfores] = useState(myinfo);
  const [infonick, setInfonick] = useState('');
  const [lstFStages, setLstFStages] = useState([]);
  const handleGetInfo = async () => {
    try {
      const res = await axios.get(TESTURL.mypage, { params: { nick: infonick } });
      setMyinfo(res.data);
      const ress = await axios.get(TESTURL.stage, { params: { nick: infonick, curr, cpp } });
      setStages(ress.data);
      const fsr = await axios.get(TESTURL.fstage, { params: { nick: infonick } });
      setLstFStages(fsr.data);
    } catch (error) {
      alert(error);
    }
  }
  useEffect(() => {
    try {
      myinfo.lstblack = JSON.parse(myinfo.lstblack);
      myinfo.lstfollow = JSON.parse(myinfo.lstfollow);
      myinfo.lstpli = JSON.parse(myinfo.lstpli);
      setMyinfores(myinfo);
      console.log(myinfo);
    } catch (err) {
      //console.log(err);
    }
  }, [myinfo])

  const [st, setSt] = useState(0);
  const [ss, setSs] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const handleStageSearch = async () => {
    try {
      const res = await axios.get(TESTURL.stagesearch, { params: { type: st, queryString: ss } });
      setSearchResult(res.data);
    } catch (error) {
      alert(error);
    }
  }

  const [verifyKey, setVerifyKey] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyType, setVerifyType] = useState(0);
  const [resultRV, setResultRV] = useState(false);
  const [resultVerify, setResultVerify] = useState(false);

  const handleRequestCode = async () => {
    try {
      const res = await axios.post(TESTURL.requestcode, { type: verifyType, key: verifyKey });
      setResultRV(res.data);
    } catch (error) {
      alert(error);
    }
  }
  const handleVerifyCode = async () => {
    try {
      const res = await axios.post(TESTURL.verifycode, { type: verifyType, key: verifyKey, code: verifyCode });
      setResultVerify(res.data);
    } catch (error) {
      alert(error);
    }
  }



  const handleAccess = () => {
    axios.post(TESTURL.login, emailPw)
      .then(res => {
        console.log(res.data);
      }).catch(error => {
        alert(error);
      });

  }

  const handleLogout = () => {
    axios.post(TESTURL.logout)
      .then(res => {
        console.log("33");
      })
  }
  const [memberImg, setMemberImg] = useState();
  const [stageImg, setStageImg] = useState();
  const [pliImg, setPliImg] = useState();
  const [musicImg, setMusicImg] = useState();
  const memberProfileChange = (e) => {
    const uploadFile = new FormData();
    uploadFile.append("upload", e.target.files[0]);
    console.log(e.target.files[0]);
    axios({
      method: "post",
      url: TESTURL.memberProfile,
      data: uploadFile,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      setMemberImg(res.data);
    })
  }

  const stageProfileChange = (e) => {
    const uploadFile = new FormData();
    uploadFile.append("upload", e.target.files[0]);
    axios({
      method: "post",
      url: TESTURL.stageProfile,
      data: uploadFile,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      setStageImg(res.data);
    })
  }
  const pliProfileChange = (e) => {
    const uploadFile = new FormData();
    uploadFile.append("upload", e.target.files[0]);
    uploadFile.append("idx", 1);
    for (var entries of uploadFile.keys()) console.log(entries + " -> " + uploadFile.get(entries));
    axios({
      method: "post",
      url: TESTURL.pliProfile,
      data: uploadFile,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      setPliImg(res.data);
    })
  }
  const musicProfileChange = (e) => {
    const uploadFile = new FormData();
    uploadFile.append("upload", e.target.files[0]);
    uploadFile.append("idx", 1);
    console.log(e.target.files[0]);
    for (var entries of uploadFile.keys()) console.log(entries + " -> " + uploadFile.get(entries));
    axios({
      method: "post",
      url: TESTURL.songProfile,
      data: uploadFile,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      setMusicImg(res.data);
    })
  }

  const [pwChk, setPwChk] = useState("");

  const pwCheckClick = () => {
    axios.post(TESTURL.pwCheck, pwChk)
      .then(res => {
        console.log(res);
        alert("success");
      })
  }


  const [pwOlder, setPwOlder] = useState("");
  const [pwChange, setPwChange] = useState("");
  const pwChangeClick = () => {
    axios.patch(TESTURL.pwChnage, { params: { "oldPw": pwOlder, "newPw": pwChange } })
      .then(res => {
        alert("success");
      })
  }

  const [recoveredEmail, setRecoveredEmail] = useState(null);
  const [newPw, setNewPw] = useState('');

  const handleRequestCodeFind = async () => {
    try {
      const res = await axios.post(TESTURL.requestcodefind, { type: verifyType, key: verifyKey, email: verifyKey, phone: verifyKey });
      setResultRV(res.data);
    } catch (error) {
      alert(error);
    }
  }

  const handleVerifyCodeFind = async () => {
    try {
      const res = await axios.post(TESTURL.verifycodefind, { type: verifyType, key: verifyKey, code: verifyCode, authType: "findId" });
      if (res.data) {
        setRecoveredEmail(res.data);
        alert('인증 성공!');
      } else {
        setRecoveredEmail(null);
        alert('인증 실패.');
      }
    } catch (error) {
      alert(error);
    }
  }

  const handleVerifyCodeFindPw = async () => {
    try {
      const res = await axios.post(TESTURL.verifycodefind, { type: verifyType, key: verifyKey, code: verifyCode, authType: "findPw" });
      if (res.data) {
        setRecoveredEmail(res.data);
        setResultVerify(true);
        alert('인증 성공!');

      } else {
        setRecoveredEmail(null);
        setResultVerify(false);
        alert('인증 실패.');
      }
    } catch (error) {
      alert(error);
    }
  }

  const handleChangePassword = async () => {
    if (!resultVerify) {  // 이메일이 없는 경우도 확인합니다.
      alert('먼저 인증을 완료해야 합니다.');
      return;
    }
    try {
      await axios.post(TESTURL.updatepw, { type: verifyType, key: verifyKey, email: recoveredEmail, newPw: newPw, phone: recoveredEmail }); // 저장된 이메일을 사용합니다.
      alert('비밀번호 변경 성공!');
    } catch (error) {
      alert('비밀번호 변경 실패');
    }
  };

  const [buttonvalue, setButtonvalue] = useState(() => []);
  const [isp, setIsp] = useState(false);
  const handleBV = (e, v) => {
    setButtonvalue(v);
  }

 
  return (
    <div className="App" style={{ margin: '200px' }}>
      <ToggleButtonGroup color='secondary'
        value={buttonvalue}
        onChange={handleBV}

      >
        <ToggleButton >
          <ShuffleIcon />
        </ToggleButton>
        <ToggleButton >
          <SkipPreviousIcon />
        </ToggleButton>
        <ToggleButton value='p' onClick={() => { setIsp(!isp) }}
        style={{
          background: 'linear-gradient(145deg,  rgba(255,255,255,0.2),  rgba(255,255,255,0.6))',
          boxShadow: '-0px -3px 10px -7px #000000 inset'
        }} >
          {isp ? <PlayArrowIcon style={{fill:'blue'}}/> : <PauseIcon />}
        </ToggleButton>
        <ToggleButton >
          <SkipNextIcon />
        </ToggleButton>
        <ToggleButton >
          <RepeatIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      {msg}<br />
      <div style={{ border: '3px solid blue', margin: '15px' }}>
        회원가입<br />
        <input placeholder='이메일' value={email} onChange={(e) => { setEmail(e.target.value) }} onBlur={handleCheckEmailExists} />
        <button onClick={checkEmailExists}>중복체크</button>
        <br />
        <input placeholder='비번' value={pw} onChange={(e) => { setPw(e.target.value) }} /><br />
        <input placeholder='닉넴' value={nick} onChange={(e) => { setNick(e.target.value) }} onBlur={handleCheckNickExists} />
        <button onClick={checkNick}>중복체크</button>
        <br />
        <button onClick={handleClickSubmit}>전송</button>
      </div>
      <div style={{ border: '3px solid green', margin: '15px', display: 'none' }}>
        비회원 기준 스테이지 페이징<br />
        <button onClick={handleShowStages}>출력</button>
        {stages.map((item, idx) =>
          <div>
            <b>{item.title}</b> by {item.nick}
          </div>
        )}
      </div>
      <div style={{ border: '3px solid red', margin: '15px' }}>
        특정 유저 시점 스테이지 출력(블랙, 팔로우)<br />
        페이지 : <input placeholder='페이지' value={curr} onChange={(e) => { setCurr(+e.target.value) }} /> &nbsp;
        페이지당 : <input placeholder='페이지당 갯수' value={cpp} onChange={(e) => { setCpp(+e.target.value) }} /><br />
        <input placeholder='닉네임(빈칸시 비회원)' value={infonick} onChange={(e) => { setInfonick(e.target.value); }} /> <button onClick={handleGetInfo}>출력</button>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ border: '1px solid black', margin: '10px', padding: '5px' }}>
            <b>팔로우</b><hr />
            {myinfores.lstfollow?.length > 0 ?
              myinfores.lstfollow.map((item, idx) => <p>{item}</p>) :
              null
            }
          </div>
          <div style={{ border: '1px solid black', margin: '10px', padding: '5px' }}>
            <b>블랙</b><hr />
            {myinfores.lstblack?.length > 0 ?
              myinfores.lstblack.map((item, idx) => <p>{item}</p>) :
              null
            }
          </div>
        </div>
        <hr /><div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ border: '1px solid black', margin: '10px', padding: '5px' }}>
            <b>팔로우 스테이지</b><hr />
            {lstFStages?.length > 0 ?
              lstFStages.map((item, idx) =>
                <div>
                  <b>{item.title}</b> by {item.nick}
                </div>
              ) :
              null}
          </div>
          <div style={{ border: '1px solid black', margin: '10px', padding: '5px' }}>
            <b>최신순 스테이지(블랙제외 / 팔로우 포함? 제외?)</b><hr />
            {stages.map((item, idx) =>
              <div>
                <b>{item.title}</b> by {item.nick}
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ border: '3px solid green', margin: '15px' }}>
        스테이지 목록 검색<br />
        <select defaultValue={st} onChange={(e) => setSt(+e.target.selectedIndex)}>
          <option>제목</option>
          <option>닉넴</option>
          <option>장르</option>
          <option>태그</option>
        </select>
        <input value={ss} onChange={(e) => setSs(e.target.value)} placeholder='검색어 입력 / 장르, 태그는 (, 쉼표)로 구분' style={{ width: '400px' }} />
        <button onClick={handleStageSearch}>검색</button>
        {searchResult?.length > 0 ?
          searchResult.map((item, idx) =>
            <div key={idx}>
              {item.title} / {item.nick} / {item.genre} / {item.tag}
            </div>) :
          <div>검색결과가 없습니다.</div>}
      </div>
      <div style={{ border: '3px solid cyan', margin: '15px' }}>
        인증코드 발송
        <select defaultValue={verifyType} onChange={(e) => setVerifyType(e.target.selectedIndex.toString())}>
          <option>이메일(미작동)</option>
          <option>문자</option>
        </select>
        <input placeholder='수신자' value={verifyKey} onChange={(e) => setVerifyKey(e.target.value)} />
        <button onClick={handleRequestCode}>발송</button>
        {
          resultRV ?
            "발송성공" :
            "발송실패 또는 내역없음"
        }
        <hr />
        인증코드 검증
        <input placeholder='코드' value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} />
        <button onClick={handleVerifyCode}>검증</button>
        {
          resultVerify ?
            "인증성공" :
            "인증실패"
        }
      </div>
      {msg}<br />

      <input value={email} onChange={(e) => { setEmail(e.target.value) }} onBlur={handleCheckEmailExists} /><br />
      <input value={pw} onChange={(e) => { setPw(e.target.value) }} /><br />
      <input value={nick} onChange={(e) => { setNick(e.target.value) }} onBlur={handleCheckNickExists} /><br />
      <button onClick={handleClickSubmit}>전송</button>
      <div id="naver_id_login">dd</div>
      <input type="text" onChange={(e) => {
        setEmailPw({
          ...emailPw,
          email: e.target.value
        })
      }}></input><br />
      <input type="password" onChange={(e) => {
        setEmailPw({
          ...emailPw,
          pw: e.target.value
        })
      }}></input><br />
      {emailPw.email}<br />
      {emailPw.pw}<br />
      <button type="button" onClick={handleAccess}>로그인</button>
      <button type="button" onClick={handleLogout}>로그아웃</button>
      <div style={{ border: "1px solid purple", margin: "15px" }}>
        회원 프사<input type="file" onChange={memberProfileChange} /><br />
        스테이지 썸네일<input type="file" onChange={stageProfileChange} /><br />
        플리 썸네일<input type="file" onChange={pliProfileChange} /><br />
        음악별 썸네일<input type="file" onChange={musicProfileChange} /><br />
      </div>
      <div style={{ border: "1px solid blue", margin: "15px" }}>
        <span>member</span>
        <img alt="" src={`${bucketUrl}${memberImg}`} /><br />
        <span>stage</span>
        <img alt="" src={`${bucketUrl}${stageImg}`} /><br />
        <span>playlist</span>
        <img alt="" src={`${bucketUrl}${pliImg}`} /><br />
        <span>music</span>
        <img alt="" src={`${bucketUrl}${musicImg}`} /><br />
      </div>

      <div style={{ border: "1px solid blue", margin: "15px" }}>
        마이페이지 들어갈때 비밀번호 확인, 비밀번호 변경
        <input type="password" onChange={(e) => setPwChk(e.target.value)} />
        {pwChk}
        <button type="button" onClick={pwCheckClick}>비밀번호 확인</button><br /><br /><br />

        <input type="password" onChange={(e) => { setPwOlder(e.target.value) }} />{pwOlder}기존 비밀번호
        <input type="password" onChange={(e) => { setPwChange(e.target.value) }} />{pwChange}변경될 비밀번호
        <button type="button" onClick={pwChangeClick}>비번변경</button>


      </div>

      <div style={{ border: "3px solid pink", margin: "15px" }}>
        아이디 찾기
        <select defaultValue={verifyType} onChange={(e) => setVerifyType(e.target.selectedIndex.toString())}>
          <option>이메일</option>
          <option>문자</option>
        </select>
        <input placeholder='핸드폰번호' value={verifyKey} onChange={(e) => setVerifyKey(e.target.value)} />
        <button onClick={handleRequestCodeFind}>발송</button>
        {
          resultRV ?
            "발송성공" :
            "발송실패 또는 미인증 회원"
        }
        <br />
        인증코드 검증
        <input placeholder='코드' value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} />
        <button onClick={handleVerifyCodeFind}>검증</button>
        {
          resultVerify ?
            "인증성공" :
            "인증실패"
        }
        <br /> 아이디 :  {recoveredEmail ? recoveredEmail : '인증이 필요합니다.'}
        <hr />
        비밀번호 찾기
        <select defaultValue={verifyType} onChange={(e) => setVerifyType(e.target.selectedIndex.toString())}>
          <option>이메일</option>
          <option>문자</option>
        </select>
        <input placeholder='수신자' value={verifyKey} onChange={(e) => setVerifyKey(e.target.value)} />
        <button onClick={handleRequestCodeFind}>발송</button>
        {
          resultRV ?
            "발송성공" :
            "발송실패 또는 미인증 회원"
        }
        <br /><br />
        인증코드 검증
        <input placeholder='코드' value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} />
        <button onClick={handleVerifyCodeFindPw}>검증</button>
        {
          resultVerify ?
            "인증성공" :
            "인증실패"
        }
        <br /><br />

        <input placeholder='비밀번호' type='password' value={newPw} onChange={(e) => setNewPw(e.target.value)} />
        <button onClick={handleChangePassword}>변경</button>
      </div>
    </div>
  );
}

export default TestPage;
