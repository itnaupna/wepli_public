import React from 'react';

const UserItem = ({ data }) => {
    const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
    const DEFAULTIMG = 'https://kr.object.ncloudstorage.com/wepli/playlist/88e584de-fb85-46ce-bc1a-8b2772babe42';
    return (
        <div className="stage-people-item">
            <img className="stage-people-img" src={data.img ? `${BUCKET_URL}/profile/${data.img}` : DEFAULTIMG} alt='profileImg' />
            <div className="stage-people-nickname">{data.nick} {data.addr === window.location.pathname.split('/')[2] ? "👑" : null}</div>
        </div>
    );
};

export default UserItem;