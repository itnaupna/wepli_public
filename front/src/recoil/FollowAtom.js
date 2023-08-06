import { atom } from "recoil";

export const FollowMemberAtom = atom({
    key: "followMember",
    default: [],
});

export const FollowListAtom = atom({
    key: 'FollowListAtom',
    default: []
});

export const TargetMemberAtom = atom({
    key: 'TargetMemberAtom',
    default: []
});

export const BlackMemberAtom = atom({
    key: 'BlackMemberAtom',
    default: []
})
