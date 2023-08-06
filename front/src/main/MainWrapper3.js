import React from 'react';
import "./css/MainWrapper3.css";
import albumcover from "./svg/albumcover.svg";
function MainWrapper3(props) {
    return (
        <div className="mainwrapper-3">
            <div className="center-outline-text">
                <div className="out-line-bottom-text">
                    <div className="make-a-stage">make a stage</div>
                </div>

                <div className="out-line-top-text">
                    <div className="share-music">Share music</div>
                </div>
            </div>

            <div className="bottom-right-text">
                <div className="_2023-we-make-playlist-share-music">
                    2023<br/>WE MAKE PLAYLIST<br/>SHARE MUSIC
                </div>
            </div>

            <div className="top-left-text">
                <div className="_2023-we-make-plalist-share-music">
                    2023<br/>WE MAKE PLALIST<br/>SHARE MUSIC
                </div>
            </div>

            <div className="circle-main-section">
                <div className="circle-section">
                    <div className="rectangle-3"></div>

                    <div className="rectangle-4" style={{backgroundColor:'dodgerblue'}}>
                    </div>

                    <div className="circle-img">
                        <img alt={''} className={"rectangle-2"} src={albumcover}/>
                    </div>

                    <div className="inline-top-text">
                        <div className="share-music2">Share music</div>
                    </div>

                    <div className="inline-bottom-text">
                        <div className="ma-ke-a-stage">MAKe a Stage</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainWrapper3;