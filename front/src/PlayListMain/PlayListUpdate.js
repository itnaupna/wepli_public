import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Axios from "axios";
import logo from "../mypage/photo/wplieonlylogo.png";
import PlusIcon from "../MainIMG/plusIcon.png";
import PlayListSave from "../MainIMG/playListSave.png";
import PlayListDetailClose from "../MainIMG/PlayListDetailClose.png";
import weplilogo from "../sidebar/photo/weplilogo.png";
import "./PlayListUpdate.css";


function PlayListUpdate(props) {
    const idx = useParams().pliId;
    const bucketURl = process.env.REACT_APP_BUCKET_URL;
    const pliProfileImg = JSON.parse(sessionStorage.getItem("data")).img;
    const [pliTitle, setPliTitle] = useState("");
    const [pliDesc, setPliDesc] = useState("");
    const [nick, setNick] = useState("");
    const [userImg, setUserImg] = useState("");
    const [pliImg, setPliImg] = useState(bucketURl + "/playlist/88e584de-fb85-46ce-bc1a-8b2772babe42");
    const PliImgRef = useRef();
    const [uploadPliImgName , setUploadPliImgName] = useState("/playlist/88e584de-fb85-46ce-bc1a-8b2772babe42");
    const [genre, setGenre] = useState([]);
    const [genres , setGenres] = useState("");
    const [tag, setTag] = useState([]);
    const [tags , setTags] = useState("");
    const [updateNick, setUpdateNick] = useState("");
    const [updatePlayUserImg, setUpdatePlayUserImg] = useState("");
    const navigate = useNavigate();
    const [isPublicCheckBox, setIsPublicCheckBox] = useState(false);

    const closBacknavigate = useNavigate();
    const pliTitleOnChange = useCallback(e => {
        setPliTitle(e.target.value);
    });
    const pliDescOnChange = useCallback(e => {
        setPliDesc(e.target.value);
    });

    const genreOnChange = (e, idx) => {
        const updatedGenre = [...genre];
        updatedGenre[idx] = e.target.value;
        const filteredGenre = updatedGenre.filter((element) => element.trim() !== "");
        setGenre(filteredGenre);
        setGenres(filteredGenre.join(","));
    }
    const tagOnChange = (e, idx) => {
        const updatedTag = [...tag];
        updatedTag[idx] = e.target.value;
        const filteredTag = updatedTag.filter((element) => element.trim() !== "");
        setTag(filteredTag);
        setTags(filteredTag.join(","));
    }

    const closBack = ()  => {
        closBacknavigate(-1);
    };

    const savePliImg = (e) => {
        const uploadPliImg = new FormData();
        uploadPliImg.append('directoryPath', "playlist");
        uploadPliImg.append('upload', e.target.files[0]);
        Axios({
            method:"post",
            url: "/api/lv1/os/imgupload",
            data: uploadPliImg,
            headers: {"Content-Type" : "multipart/form-data"}
        }).then(res => {
            setUploadPliImgName(res.data);
        }).catch(error => {
            console.log(error);
        })
        setUploadPliImgName(uploadPliImg);
        const PliImgfile = PliImgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(PliImgfile);
        reader.onloadend = () => {
            setPliImg(reader.result);
        };
    };

    const updatePliData = {
        idx: idx,
        title: pliTitle,
        desc: pliDesc,
        genre: genres,
        tag: tags,
        img: uploadPliImgName,
        isPublic: isPublicCheckBox? 0 : 1
    }


    const updatePli = () => {
        if(pliTitle === "" ) {
            alert("제목을 입력해주세요.");
            return;
        }
        const updatePliUrl = "/api/lv1/p/list";
        Axios.patch(updatePliUrl, updatePliData)
            .then(res =>
                navigate("/pli/" + idx)
            )
            .catch((error) => {
                    if (error.response.status === 401) {
                        alert("로그인 후 사용가능한 기능입니다");
                    } else if (error.response.status === 403) {
                        alert("메일 또는 문자인증 후 사용 가능합니다");
                    } else {
                        alert("잘못된 접근입니다");
                    }

                })
    };

    const [plaListDetailResult, setPlaListDetailResult] = useState([]);
    const [plaListDetailInfo, setPlaListDetailInfo] = useState([]);

    useEffect(() => {
        const plaListDetailUrl = "/api/lv0/p/playdetail";
        Axios.get(plaListDetailUrl, {params: {idx: idx}})
            .then(res => {
                setUSN(res.data.play.nick);
                setPlaListDetailResult(res.data);
                // console.log(res.data);
                setPlaListDetailInfo(res.data.play);
                setPliTitle(res.data.play.title);
                setPliDesc(res.data.play.desc);
                setUserImg(res.data.playUserImg);
                setNick(res.data.play.nick);
                if(res.data.play.genre != null) {
                    setGenre((res.data.play.genre).split(","));
                    setGenres(res.data.play.genre);
                }
                if(res.data.play.tag != null) {
                    setTag((res.data.play.tag).split(","));
                    setTags(res.data.play.tag);
                }
                setPliImg(bucketURl + res.data.play.img);
                setUploadPliImgName(res.data.play.img);
                setIsPublicCheckBox(res.data.play.isPublic === 0);
                setUpdateNick(res.data.play.nick);
                setUpdatePlayUserImg(res.data.playUserImg);

                let nickname = window.localStorage.getItem("data");
                if(nickname == null) {
                    nickname = window.sessionStorage.getItem("data");
                }
                if(nickname && nickname.includes("nick")) {
                    nickname = JSON.parse(nickname).nick;
                }
                if(nickname != res.data.play.nick) {
                    alert("어허 안돼~");
                    closBacknavigate(-1);
                }

            })
            .catch(res => console.log(res));
    }, []);

    const isPublicCheckBoxChange = (e) => {
        setIsPublicCheckBox(e.target.checked);
    }
    const [updateSessionNick,setUSN] = useState('');
    //  JSON.parse(sessionStorage.getItem("data") || localStorage.getItem("data")).nick;
    return (
        <div className="playlistaddframe">
        {
            updateSessionNick === updateNick ?
            <div className="playlistadd">
                <div className="playlistaddtop">
                    <label className="playlistaddchangimginputbody">
                        <input type="file" className="playlistaddchangimginput" onChange={savePliImg} ref={PliImgRef}/>
                        <img className="playlistaddcover-plus" src={PlusIcon} alt=''/>
                        <img
                            className="playlistaddcover-icon"
                            alt=""
                            src={bucketURl + uploadPliImgName}
                        />
                    </label>
                    <div className="playlistaddinplaylistinfos">
                        <input className="playlistaddinplaylisttitle" value={pliTitle} onChange={pliTitleOnChange}
                               placeholder="제목을 입력해 주세요" maxLength={10}/>

                        <div className="playlistaddinplaylistuserin">
                            <img
                                className="playlistaddprofileimage-icon"
                                alt=""
                                src={pliProfileImg ? bucketURl + "/profile/" + pliProfileImg : weplilogo}
                            />
                            <div className="playlistaddinplaylistnickna">
                                {nick}
                            </div>
                        </div>
                        <textarea className="playlistaddinplaylistinfo" placeholder="소개글을 적어주세요 (이미지는 클릭시 변경하실 수 있습니다.)"
                                  onChange={pliDescOnChange} maxLength="50" value={pliDesc}>
                        </textarea>
                        <div className="playlistaddinplaylistinfobu">
                            <div className="playlistaddbuttonbody" onClick={updatePli}>
                                <img
                                    className="playlistaddplaybutton-icon"
                                    alt=""
                                    src={PlayListSave}
                                />
                                저장
                            </div>
                        </div>
                    </div>
                </div>
                <div className="isPublictoggleBody">
                    <span className="isPublictoggleText">공개</span>
                    <div className="isPublictoggle isPublictoggle-r" id="isPublictoggle-3">
                        <input type="checkbox" className="isPublicCheckbox" checked={isPublicCheckBox} onChange={isPublicCheckBoxChange}/>
                        <div className="knobs"></div>
                        <div className="layer"></div>
                    </div>
                </div>
                <div className="playlistaddtagframe">
                    <div className="playlistaddtaggroup1">
                        <div className="playlistaddtagheader">
                            <div className="tagtitle">장르 (10글자 까지 입력 가능합니다)</div>
                            <div className="commettilteiconbody">#</div>
                        </div>
                        {Array(4).fill().map((_, idx) =>
                            <div className="playlistaddtagform">
                                <input className="txtplaylistaddform" value={genre[idx] == null ? "" : genre[idx]} maxLength="10"
                                    onChange={(e) => genreOnChange(e, idx)} placeholder="장르를 적어주세요"/>
                            </div>
                        )}
                    </div>
                    <div className="playlistaddtaggroup1">
                        <div className="playlistaddtagheader">
                            <div className="tagtitle">태그 (10글자 까지 입력 가능합니다)</div>
                            <div className="commettilteiconbody">#</div>
                        </div>
                        {Array(4).fill().map((_, idx) =>
                            <div className="playlistaddtagform">
                                <input className="txtplaylistaddform" value={tag[idx] == null ? "" : tag[idx]} maxLength="10"
                                onChange={(e) => tagOnChange(e, idx)} placeholder="태그를 적어주세요"/>
                            </div>
                        )}


                    </div>
                </div>
                <img
                    className="playlistaddclose-icon"
                    alt=""
                    src={PlayListDetailClose}
                    onClick={closBack}
                />
            </div>
                :<h1 style={{ width: "100%", textAlign: "center", marginTop: "25%", position: "absolute" }}>잘못된 접근입니다.</h1>
        }
        </div>
    );
};

export default PlayListUpdate;