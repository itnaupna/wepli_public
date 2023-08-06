import axios from 'axios';
import { atom } from 'recoil';

export const RoomQListAtom = atom({
    key:'RoomQListAtom',
    default:[],
})

export const MyQListAtom = atom({
    key: 'MyQListAtom',
    default: [],
});

export const IsInQueueAtom = atom({
    key: 'IsInQueueAtom',
    default: false,
});

export const VoteUpAtom = atom({
    key:'VoteUpAtom',
    default: false,
});

export const VoteDownAtom = atom({
    key:'VoteDownAtom',
    default: false,
});

export const ButtonTypeAtom = atom({
    key: 'ButtonTypeAtom',
    default: 'normal',
});

export const ResultItemsInStageAtom = atom({
    key: 'ResultItemsInStageAtom',
    default: []
});

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
export const GetBucketImgString = (filename) => {
    return `${BUCKET_URL}${filename}`;
}

export const SecondToHMS = (second) => {
    let hour = parseInt(second / 3600);
    if (hour > 0) {
        let hourlength = +hour.toString().length;
        if(hourlength===1) hourlength=2;
        hour = ('0'.repeat(hourlength) + hour).slice(hourlength) + ":";
    } else {
        hour = "";
    }

    let min = ('00' + (parseInt(second / 60) % 60)).slice(-2);
    let sec = ('00' + (second % 60)).slice(-2);
    return `${hour}${min}:${sec}`;
}

export const IsGrabbingAtom = {}; // 빈 객체로 선언

export const getIsGrabbingAtom = (index) => {
    if (!IsGrabbingAtom[index]) {
        IsGrabbingAtom[index] = atom({
            key: `IsGrabbingAtom_${index}`,
            default: false,
        });
    }
    return IsGrabbingAtom[index];
};


export const parseDurationToSeconds = (duration) => {
    const timeRegex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const matches = duration.match(timeRegex);
  
    if (!matches) {
      return 0;
    }
  
    const hours = matches[1] ? parseInt(matches[1].slice(0, -1), 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2].slice(0, -1), 10) : 0;
    const seconds = matches[3] ? parseInt(matches[3].slice(0, -1), 10) : 0;
  
    return hours * 3600 + minutes * 60 + seconds;
  };

export const GetSongInfoByYoutubeApi = async (playlistID,address) => {
    
    let axiosdata;
    let url1 = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatus%2Csnippet';
    let url2 = '&key=' + process.env.REACT_APP_YOUTUBE_KEY;
    let url3 = '&id=' + address;
    axiosdata = await axios.get(`${url1}${url2}${url3}`);
    axiosdata = axiosdata.data.items[0];
    
    let title = axiosdata.snippet.title;
    let songlength = parseDurationToSeconds(axiosdata.contentDetails.duration); //"PT7H43M34S"
    let singer = axiosdata.snippet.channelTitle;
    let songaddress = address;
    let songorigin = 'yt';

    let data = {
        idx:0,
        playlistID,
        title,
        songlength,
        singer,
        songaddress,
        songorigin
    }
    return data;
}

export const doGrab = async (playlistID, address) => {
    let data = await GetSongInfoByYoutubeApi(playlistID,address);
    let result = await axios.post("/api/lv1/p/song",data);

    return result.data;
}

export const doGrabHistory = async (playlistID, d) => {
    let data = {...d};

    data.songorigin = 'yt';
    data.playlistID = playlistID;
    let result = await axios.post("/api/lv1/p/song",data);

    return result.data;
}

export const VoteUpCountAtom = atom({
  key: 'VoteUpCountAtom',
  default: 0,
});

export const VoteDownCountAtom = atom({
  key: 'VoteDownCountAtom',
  default: 0,
});

export const HistoryCountAtom = atom({
    key: 'HistoryCountAtom',
    default:0,
});


export const getTimeDifference = (targetDateTime) => {
    const targetTime = new Date(targetDateTime).getTime();
    const currentTime = new Date().getTime();
    const timeDifferenceInMilliseconds = currentTime - targetTime;
  
    // 분 단위로 시간 차이 계산
    const minutesDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
    if (minutesDifference < 60) {
      return `${minutesDifference}분 전`;
    }
  
    // 시간 단위로 시간 차이 계산
    const hoursDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60));
    if (hoursDifference < 24) {
      return `${hoursDifference}시간 전`;
    }
  
    // 일 단위로 시간 차이 계산
    const daysDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));
    return `${daysDifference}일 전`;
  }