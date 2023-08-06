import React, { useState } from 'react';
import '../PlayStageCss/LoadingScreen.css';
const LoadingScreen = ({ msg, isLoading,setShow}) => {
    // let [show, setShow] = useState(true);
    
        return (
            <div id="wrapper" onClick={()=>{
                if(!isLoading) {setShow(false);}
            }}>
                {isLoading && <>
                    <div className="profile-main-loader">
                        <div className="loader">
                            <svg className="circular-loader" viewBox="25 25 50 50" >
                                <circle className="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#70c542" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>
                    <div className="loadingmsg">{msg}</div>
                </>
                }
                {!isLoading && <>
                    <div className='loadingmsg'>
                        스테이지에 입장 준비가 완료되었습니다. <br />
                        <br />
                        클릭하면 입장합니다.
                    </div>
                </>}
            </div>
        );
};

export default LoadingScreen;