import { atom } from "recoil";

export const FollowModalOpen = atom({
    key: "FollowModalOpen",
    default: false
});

export const OutMemberModalOpen = atom({
    key: 'OutMemberModalOpen',
    default: false
});

export const InfoChangeModalOpen = atom({
    key: 'InfoChangeModalOpen',
    default: false
});

export const EmailConfirmModalOpen = atom({
    key: 'EmailConfirmModalOpen',
    default: false
});

export const PhoneConfirmModalOpen = atom({
    key: 'PhoneConfirmModalOpen',
    default: false
});

export const BlackListOptionModalOpen = atom({
    key: 'BlackListOptionModalOpen',
    default: false,
});

export const TargetListModalOpen = atom({
    key: 'TargetListModalOpen',
    default: false
});

export const BlackListModalOpen = atom({
    key: 'BlackListModalOpen',
    default: false
})