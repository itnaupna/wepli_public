import axios from 'axios';
import { atom } from 'recoil';


export const SearchStageAtom = atom({
    key: 'SearchStageAtom',
    default: [],
});

export const QueryStringAtom = atom({
    key: 'QueryStringAtom',
    default: null,
});

