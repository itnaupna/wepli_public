import React, { useEffect } from 'react';


const ChatItem = ({data}) => {
    const DEFAULTIMG = 'https://kr.object.ncloudstorage.com/wepli/playlist/88e584de-fb85-46ce-bc1a-8b2772babe42';
    useEffect(()=>{console.log(data);},[])
    return (
        <div className="stage-chat-item">
            <img
                className="stage-chat-item-user-img"
                src={data.img.split("/profile/")[1] !== 'null' ? data.img : DEFAULTIMG}
                alt='profileImg' />

            <div className="stage-chat-item-detail">
                <div className="stage-chat-item-header">
                    <div className="stage-chat-item-writer">{data.nick}</div>

                    <div className="stage-chat-item-timestamp">{data.date}</div>
                </div>

                <div className="stage-chat-item-msg">{data.msg}</div>
            </div>
        </div>
    );
};

export default ChatItem;