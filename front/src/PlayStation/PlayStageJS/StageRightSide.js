import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ChatItemsAtom, StageUrlAtom, UserCountInStageAtom, UsersItemsAtom } from '../../recoil/ChatItemAtom';
import ChatItem from './ChatItem';
import { handleSendMsg } from '../../recoil/SocketAtom';
import StageButtonChatIcon from '../PlayStageImage/Icon/StageButtonChatIcon.svg';
import UserItem from './UserItem';
import SysMsgItem from './SysMsgItem';

const StageRightSide = () => {
    const [rightType, setRightType] = useState(true);

    const chatLog = useRecoilValue(ChatItemsAtom);
    const [chat, setChat] = useState('');
    const chatLogs = useRef();
    const userCount = useRecoilValue(UserCountInStageAtom);
    const users = useRecoilValue(UsersItemsAtom);

    const stageUrl = useRecoilValue(StageUrlAtom);

    useEffect(()=>{
        chatLogs.current.scrollTop = chatLogs.current.scrollHeight;
    },[chatLog]);

    return (
        <div className="stage-right">
            <div className="stage-right-header">
                <div className={(rightType ? 'rightactive ' : '') + "rightbutton stage-button-chat"}
                    onClick={() => setRightType(true)}>
                    <svg
                        className="stage-button-chat-icon"
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M21 28.5H33M21 22.5H39M21 12H39C43.9706 12 48 16.1973 48 21.375V30.625C48 35.8027 43.9706 40 39 40H30.7026C30.2574 40 29.8352 40.206 29.5502 40.5622L23.8262 47.7173C23.3771 48.2787 22.5 47.9479 22.5 47.2172V41.5625C22.5 40.6996 21.8284 40 21 40C16.0294 40 12 35.8027 12 30.625V21.375C12 16.1973 16.0294 12 21 12Z"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <div className={(rightType ? '' : 'rightactive ') + "rightbutton stage-button-people"}
                    onClick={() => setRightType(false)}>
                    <svg
                        className="stage-button-people-icon"
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M27.6394 31C27.6394 31.5523 28.0871 32 28.6394 32C29.1917 32 29.6394 31.5523 29.6394 31H27.6394ZM10.0217 31C10.0217 31.5523 10.4694 32 11.0217 32C11.574 32 12.0217 31.5523 12.0217 31H10.0217ZM31.4751 24.8783V23.8783C30.9268 23.8783 30.4808 24.3196 30.4751 24.8678C30.4694 25.416 30.9061 25.8666 31.4541 25.878L31.4751 24.8783ZM30.9734 14.6957C30.4211 14.6957 29.9734 15.1434 29.9734 15.6957C29.9734 16.2479 30.4211 16.6957 30.9734 16.6957V14.6957ZM35.9589 31C35.9589 31.5523 36.4066 32 36.9589 32C37.5112 32 37.9589 31.5523 37.9589 31H35.9589ZM8.52461 24.8783L8.54552 25.878C9.09361 25.8666 9.53029 25.416 9.52456 24.8678C9.51882 24.3196 9.07282 23.8783 8.52461 23.8783V24.8783ZM9.02659 16.6957C9.57888 16.6957 10.0266 16.2479 10.0266 15.6957C10.0266 15.1434 9.57888 14.6957 9.02659 14.6957V16.6957ZM2.04109 31C2.04109 31.5523 2.48881 32 3.04109 32C3.59338 32 4.04109 31.5523 4.04109 31H2.04109ZM25.4372 15.6C25.4372 18.6918 22.928 21.2 19.8306 21.2V23.2C24.0307 23.2 27.4372 19.7983 27.4372 15.6H25.4372ZM19.8306 21.2C16.7332 21.2 14.2239 18.6918 14.2239 15.6H12.2239C12.2239 19.7983 15.6305 23.2 19.8306 23.2V21.2ZM14.2239 15.6C14.2239 12.5082 16.7332 10 19.8306 10V8C15.6305 8 12.2239 11.4017 12.2239 15.6H14.2239ZM19.8306 10C22.928 10 25.4372 12.5082 25.4372 15.6H27.4372C27.4372 11.4017 24.0307 8 19.8306 8V10ZM12.0217 31C12.0217 29.769 12.0233 28.6802 12.1509 27.7043C12.2773 26.7373 12.519 25.9628 12.9454 25.3462C13.7576 24.1715 15.5204 23.2 19.8306 23.2V21.2C15.3319 21.2 12.6903 22.1984 11.3003 24.2087C10.6255 25.1846 10.3167 26.3063 10.1678 27.445C10.0201 28.5747 10.0217 29.8009 10.0217 31H12.0217ZM19.8089 23.1998C24.1301 23.2936 25.904 24.2615 26.7198 25.4237C27.1442 26.0283 27.3846 26.7838 27.5105 27.733C27.6377 28.6928 27.6394 29.7685 27.6394 31H29.6394C29.6394 29.8015 29.6411 28.586 29.4931 27.4701C29.3437 26.3436 29.0335 25.2387 28.3568 24.2747C26.9704 22.2997 24.3398 21.2977 19.8523 21.2002L19.8089 23.1998ZM34.3684 20.287C34.3684 21.4049 34.0893 22.3147 33.6195 22.9209C33.1756 23.4937 32.5012 23.8783 31.4751 23.8783V25.8783C33.0841 25.8783 34.3564 25.235 35.2003 24.1461C36.0184 23.0905 36.3684 21.7047 36.3684 20.287H34.3684ZM30.9734 16.6957C32.9853 16.6957 34.3684 18.2297 34.3684 20.287H36.3684C36.3684 17.2728 34.2319 14.6957 30.9734 14.6957V16.6957ZM31.4541 25.878C34.5954 25.9438 35.4226 26.6275 35.7183 27.1878C35.8967 27.5261 35.981 27.9852 35.997 28.6595C36.0048 28.9907 35.9963 29.346 35.9846 29.7424C35.9732 30.1313 35.9589 30.5592 35.9589 31H37.9589C37.9589 30.5955 37.972 30.2024 37.9838 29.801C37.9953 29.4072 38.0057 29.003 37.9964 28.6122C37.9782 27.8425 37.8844 27.0075 37.4872 26.2545C36.6314 24.6325 34.7167 23.9459 31.496 23.8785L31.4541 25.878ZM3.63158 20.287C3.63158 21.7047 3.98146 23.0905 4.79945 24.146C5.64334 25.235 6.91556 25.8783 8.52461 25.8783V23.8783C7.49846 23.8783 6.82417 23.4937 6.38034 22.921C5.91061 22.3148 5.63158 21.4049 5.63158 20.287H3.63158ZM9.02659 14.6957C5.76807 14.6957 3.63158 17.2728 3.63158 20.287H5.63158C5.63158 18.2297 7.01471 16.6957 9.02659 16.6957V14.6957ZM8.5037 23.8785C5.283 23.9459 3.36835 24.6325 2.51265 26.2546C2.11545 27.0075 2.0217 27.8425 2.00352 28.6122C1.99429 29.003 2.00465 29.4072 2.0162 29.801C2.02798 30.2024 2.04109 30.5956 2.04109 31H4.04109C4.04109 30.5592 4.02675 30.1313 4.01534 29.7424C4.00371 29.3459 3.99514 28.9907 4.00297 28.6595C4.01889 27.9852 4.10316 27.526 4.2816 27.1878C4.57717 26.6275 5.40428 25.9438 8.54552 25.878L8.5037 23.8785Z"
                            fill="black"
                        />
                    </svg>

                    <div className="stage-button-people-count">{users.length}</div>
                    {userCount - users.length > 0 ? <>
                        <div className="">+</div>

                        <div className="stage-button-guest-count">{userCount - users.length}</div>
                    </>
                        :
                        null
                    }
                </div>
            </div>

            <div className="stagechatwrapper" style={{ display: (rightType ? 'flex' : 'none') }}>
                <div className="stage-chat-body" ref={chatLogs}>
                    {chatLog.map((v, i) => {
                        return v.type === 'CHAT' ? <ChatItem key={i} data={v} /> : <SysMsgItem key={i} data={v} />
                    })}
                </div>

                <div className="stage-chat-tail">
                    <input className="stage-chat-input" value={chat}
                        onChange={(e) => setChat(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMsg("CHAT", chat, stageUrl); setChat('');
                            }
                        }}
                    />
                    <img alt='' src={StageButtonChatIcon} onClick={() => { handleSendMsg("CHAT", chat, stageUrl); setChat(''); }} />
                </div>
            </div>

            <div className="stagepeoplewrapper" style={{ display: (rightType ? 'none' : 'flex') }}>
                <div className="stage-people-body">
                    {
                        users.map((v, i) =>
                            <UserItem key={i} data={v} />
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default StageRightSide;