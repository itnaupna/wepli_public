import React, { useEffect, useRef, useState } from 'react';
import './CSM.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import axios from 'axios';

const StageInfoModal = ({ types }) => {
    const [stageData, setStageData] = useState({});

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        let address = window.location.pathname.split("/stage/")[1]
        let result = await axios.get("/api/lv0/s/stageinfo", { params: { address } });
        setStageData(result.data);
        console.log(result.data);
        setIL(true);
    }

    const [isLoading, setIL] = useState(false);

    return (
        <div className='CSMWrapper'>
            <div className='CSMContent CSMlv1'>
                {/* <div className='btnCSM'><ArrowBackIcon /></div> */}
                <div className='btnCSMTitle'>
                    <h1 style={{ textAlign: 'center' }}>
                        스테이지 정보
                    </h1>
                </div>
                {/* <div className='btnCSM'>{!types && <LayersClearIcon />}</div> */}
            </div>
            {isLoading && <>
                <div className='CSMContent CSMlv2'>
                    <div
                        className='CSMImg'
                        style={{ backgroundImage: stageData.img ? `url(${stageData.img})` : '' }}
                    />
                    <div className='CSMInfo'>
                        <div className='CSMInput' style={{ display: 'flex', alignItems: 'center' }}>{stageData.title}</div>
                        <div className='CSMInput' style={{ display: 'flex', alignItems: 'center' }}>{stageData.tag}</div>
                        <div className='CSMInput' style={{ display: 'flex', alignItems: 'center' }}>{stageData.genre}</div>
                    </div>
                </div>
                <div className='CSMContent CSMlv3'>
                    <div className='CSMDetail' style={{ display: 'flex', alignItems: 'center' }}>
                        {stageData.desc}
                    </div>
                </div>
            </>
            }
        </div>
    );
};

export default StageInfoModal;