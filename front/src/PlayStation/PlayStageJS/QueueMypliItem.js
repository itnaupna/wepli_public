import React from 'react';
import { useRecoilState } from 'recoil';
import { ButtonTypeAtom, ResultItemsInStageAtom } from '../../recoil/StageDataAtom';
import axios from 'axios';

const QueueMypliItem = ({ data }) => {
    const [searchResult, setSearchResult] = useRecoilState(ResultItemsInStageAtom);
    const [ButtonType, setButtonType] = useRecoilState(ButtonTypeAtom);

    const GetSongsInList = async (type) => {
        let result;
        switch (type) {
            case 0: //내가 등록한 대기열 (내 플리)

                break;
            case 1: //스테이지 플리
                break;
            case 2: //재생 기록
                break;
            case 3: //플리목록 클릭
                console.log("eongeee");
                setButtonType('normal');
                result = await axios.get(`/api/lv0/p/songs`, { params: { playlistID: data.idx } });
                
                setSearchResult(result.data);
                console.log(result.data);
                break;
            default:
                break;
        }
    }

    return (
        <div className="btnmyqueue" onClick={() => { GetSongsInList(3); }}>
            <div className="queueplaylistitemtitle3">
                {data.title}
            </div>
            <div className="queueplaylistitemcount">{data.songscount}</div>
        </div>
    );
};

export default QueueMypliItem;