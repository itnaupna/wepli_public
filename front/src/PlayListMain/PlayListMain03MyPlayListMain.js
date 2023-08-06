import React from 'react';
import "./PlayListMain03MyPlayListMain.css";
import PlayListMenu from "./PlayListMenu";
import PlayListMyPlilogoTitle from "../MainIMG/PlayListMyPlilogoTitle.png";
import PlaylistSlider from "./MyPliSlider";


const PlayListMain03MyPlayListMain = () => {

    return (
        <div className="playlistmain03">
            <div className="playlistmypliheader">
                <img
                    className="playlistmyplilogotitle-icon"
                    alt=""
                    src={PlayListMyPlilogoTitle}
                />
                <PlayListMenu />
            </div>
            <div className="playlistmyplibody">
                <PlaylistSlider/>
            </div>
        </div>
    );
};

export default PlayListMain03MyPlayListMain;