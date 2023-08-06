import {atom, selector} from 'recoil';

// 아이디 찾기 모달 오픈
export const findIdModalOpenState = atom({
    key: 'findIdModalOpenState',
    default: false,
});

export const findIdSuccessModalOpenState = atom({
    key: 'findIdSuccessModalOpenState',
    default: false,
});

export const findIdSuccessModalOpenSelector = selector({
    key: 'findIdSuccessModalOpenSelector',
    get: ({ get }) => get(findIdSuccessModalOpenState),
    set: ({ set }) => set(findIdSuccessModalOpenState, true),
});

// 비밀번호 확인 후 마이페이지 입장
export const pwChkModalOpen = atom({
    key: "pwChkModalOpen",
    default: false,
})

export const LoginModalOpen = atom({
    key: "LoginModalOpen",
    default: false,
})

export const FindPassModalOpen = atom({
    key: "FindPassModalOpen",
    default: false,
})

export const SignUpModalOpen = atom({
    key: "SignUpModalOpen",
    default: false,
})

export const emailState = atom({
    key: "emailState",
    default: null,
});

export const socialtypeState = atom({
    key: "socialtypeState",
    default: null,
})

export const recoveredEmailState = atom({
    key: 'recoveredEmailState',
    default: null,
});

export const recoveredPhoneState = atom({
    key: 'recoveredPhoneState',
    default: null,
})

export const FindPwChangeModalOpen = atom({
    key: 'FindPwChangeModalOpen',
    default: false,
})