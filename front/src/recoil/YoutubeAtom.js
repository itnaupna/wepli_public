import { atom, selector } from 'recoil';

const opt={
    playerVars:{
        autoplay:1,
        controls:0,
        disablekb:1,
        iv_load_policy:3,
        mute:1,
    }
}

export const YTPListAtom = atom({
  key: 'YTPListAtom',
  default: [],
});

export const YTPOptionAtom = atom({
    key:'YTPOptionAtom',
    default:opt,
})


export const IsPlayingAtom = atom({
  key: 'IsPlayingAtom',
  default: false,
});

export const loadVideoById = (videoId, startSeconds) => selector({
    key:'loadVideoByIdAtom',
    get:({get}) => {
        const yt = get(YoutubeAtom);
        console.log(yt);
        yt.loadVideoById(videoId,startSeconds);
        console.log(videoId, startSeconds);
    }
});

export const YoutubeAtom = atom({
    key: 'YoutubeAtom',
    default: null,
    dangerouslyAllowMutability: true
});

export const YoutubeInStageAtom = atom({
    key: 'YoutubeInStageAtom',
    default: null,
    dangerouslyAllowMutability: true
})