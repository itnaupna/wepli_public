package naver.cloud;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import lombok.Data;

@Configuration
@PropertySource("classpath:/naver.properties")
@ConfigurationProperties(prefix = "ncp")
@Data
public class NaverConfig {
	//properties 파일 읽어오도록 구성.
	String smsKey;
	String smsSender;
	String accessKey;
	String secretKey;
	String regionName;
	String endPoint;

}