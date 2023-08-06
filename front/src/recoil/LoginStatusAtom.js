import {atom, selector, useRecoilState} from 'recoil';

export const LoginStatusAtom = atom({
    key: 'LoginStatusAtom',
    default: (localStorage.data||sessionStorage.data) != null,
});

export const DataState = atom({
    key: 'DataState',
    default: JSON.parse(sessionStorage.getItem('data')) || JSON.parse(localStorage.getItem('data')) || {},
});

export const emailConfirmState = selector({
    key: 'emailConfirmState',
    get: ({ get }) => {
        const data = get(DataState);
        return JSON.stringify(data.emailconfirm);
    },
});

export const emailState = selector({
    key: 'emailState',
    get: ({ get }) => {
        const data = get(DataState);
        return JSON.stringify(data.email);
    },
});

export const phoneConfirmState = selector({
    key: 'phoneConfirmState',
    get: ({ get }) => {
        const data = get(DataState);
        return data.phoneconfirm;
    },
});

export const ProfileImageUrl = atom({
   key: 'ProfileImageUrl',
   default: null
});

export const UserStorageNick = atom({
    key: 'UserStorageNick',
    default: null
});

export const UserStoragelstfollow = atom({
    key : 'UserStoragelstfollow',
    default: null
})

export const UserStoragelstblack = atom({
    key : 'UserStoragelstblack',
    default: null
})

export const UserStorageemail = atom({
    key : 'UserStorageemail',
    default: null
})

export const UserStorageDesc = atom({
    key: 'UserStorageDesc',
    default: null
});

export const UserStorageEmailConfirm = atom({
    key: 'UserStorageEmailConfirm',
    default: null
});

export const isPasswordEnteredState = atom({
    key: 'isPasswordEntered',
    default: false,
});

export function useIsPasswordEntered() {
    const [isPasswordEntered, setIsPasswordEntered] = useRecoilState(isPasswordEnteredState);

    return { isPasswordEntered, setIsPasswordEntered };
}


export const passwordRegexAtom = atom({
    key: 'passwordRegex',
    default: /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()])[a-z\d!@#$%^&*()]{8,}$/,
  });
  
  export const emailRegexAtom = atom({
    key: 'emailRegex',
    default: /^[a-zA-Z0-9._+-,]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
});

