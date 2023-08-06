import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import SockJS from 'sockjs-client';
import * as StompJS from '@stomp/stompjs';
import { ChatItemsAtom } from './ChatItemAtom';

// const [ws, setWs] = useRecoilState();
const sc = new SockJS("https://wepli.today/ws");
const ws = StompJS.Stomp.over(sc);

let subs = null;
let sessionId = null;

export const conSocket = () => {
  // let sock = new SockJS("https://localhost/ws");
  // ws = StompJS.Stomp.over(sock);
  ws.disconnect();
  ws.debug = () => {};
  ws.connect({}, () => {
    sessionId = sc._transport.url.split("/ws/")[1].split("/")[1];
    sessionStorage.setItem('s',sessionId);
    // console.log("웨오옹" + sessionId);
  });
}

export const SubSocket = (endpoint, callback) => {
  subs?.unsubscribe();
  subs = ws.subscribe(endpoint, callback);
  // console.log(subs);
}

export const UnSubSocket = () =>{
  subs?.unsubscribe();
  subs=null;
}

export const SendMsg = (e) => {
  ws.send("/pub/msg", {}, JSON.stringify(e));
}

export const handleSendMsg = (type, msg, stageId) => {
  let userNick = (JSON.parse(sessionStorage.getItem('data') || localStorage.getItem('data')))?.nick;

  if ((type === 'CHAT' && (msg.trim().length === 0 || userNick === undefined)))
    return;

  SendMsg({
    type,
    stageId,
    userNick,
    sessionId,
    msg
  });

};

export const SocketSubsAtom = atom({
  key: 'SocketSubsAtom',
  default:subs,
  dangerouslyAllowMutability:true
});



export const SocketAtom = atom({
  key: 'SocketAtom',
  default: ws,
  dangerouslyAllowMutability: true
});

export const SocketIdAtom = atom({
  key: 'SocketIdAtom',
  default: sessionId,
  dangerouslyAllowMutability: true,
});