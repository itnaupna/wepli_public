package com.bit.wepli;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;



@SpringBootApplication
@ComponentScan({ "com.bit.*", "naver.cloud" })
@MapperScan({ "com.bit.mapper" })
public class WepliApplication {

	public static void main(String[] args) {
		SpringApplication.run(WepliApplication.class, args);
		
	}
	
    

}
