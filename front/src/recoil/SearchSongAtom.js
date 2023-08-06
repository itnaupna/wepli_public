import {atom, set} from 'recoil';

// 아이디 찾기 모달 오픈
export const SearchSongModalOpen = atom({
    key: 'SearchSongModalOpen',
    default: false,
});

export const NextPageToken = atom({
    key: 'NextPageToken',
    default: null
});

export const AddSongModalOpen = atom({
    key: 'AddSongModalOpen',
    default: false
});

export const YoutubeSearchParam = atom({
    key: 'YoutubeSearchParam',
    default: ""
});

export const SearchResults = atom({
    key: 'SearchResults',
    default: []
});

export const YoutubeAddResult = atom({
    key: 'YoutubeAddResult',
    default: []
});

export const VideoId = atom({
    key: 'VideoId',
    default: ""
});


export const AddSongResult = atom({
    key: 'AddSongResult',
    default: true
});
