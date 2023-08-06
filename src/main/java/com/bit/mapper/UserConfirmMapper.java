package com.bit.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserConfirmMapper {
    public int selectIsAlreadyHasEmailCode(String email);
    public int selectIsAlreadyHasPhoneCode(String phone);
    public int insertEmailCode(Map<String,String> data);
    public int insertPhoneCode(Map<String,String> data);
    public int updateEmailCode(Map<String,String> data);
    public int updatePhoneCode(Map<String,String> data);
    public int selectVerifyEmail(Map<String,String> data);
    public int selectVerifyPhone(Map<String,String> data);
    public int deleteEmailCode(String email);
    public int deletePhoneCode(String phone);
    public int updateVerifyEmailConfirm(String email);
    public int updateVerifyPhoneConfirm(String phone);

}
