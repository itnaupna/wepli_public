import {atom} from 'recoil';

export const ChatItemsAtom = atom({
    key:'ChatItemsAtom',
    default:[]
});

export const StageUrlAtom = atom({
    key:'StageUrlAtom',
    default:null
});

export const UserCountInStageAtom = atom({
  key: 'UserCountInStageAtom',
  default: 0,
});

export const UsersItemsAtom = atom({
  key: 'UsersItemsAtom',
  default: [
    {
      nick:'',
      img:'',
      addr:''
    }
  ],
});