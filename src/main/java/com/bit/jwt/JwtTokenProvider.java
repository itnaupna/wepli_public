package com.bit.jwt;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.token.secret}")
    private String secret;

    // 30 분
    public static final long JWT_TOKEN_VALIDITY = 1000 * 60 * 30 * 2 * 24;
    // public static final long JWT_TOKEN_VALIDITY = 1000 * 60 * 30;
    // public static final long JWT_TOKEN_VALIDITY2 = 1000 * 60;
    public static final long JWT_TOKEN_VALIDITY3 = 1000 * 20;

    // token으로 사용자 id(nick) 조회
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getId);
    }

    // token으로 사용자 속성정보 조회
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
	    Claims claims = getAllClaimsFromToken(token);
		// log.info("Claim from token: {}", String.valueOf(result));
	    return claimsResolver.apply(claims);
	}

    // 모든 token에 대한 사용자 속성정보 조회
	private Claims getAllClaimsFromToken(String token) {
		return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
	}

    // nick을 입력받아 accessToken 생성
	public String generateAccessToken(String nick) {
		return generateAccessToken(nick, new HashMap<>());
	}

    // nick, 속성정보를 이용해 accessToken 생성
	public String generateAccessToken(String nick, Map<String, Object> claims) {
		return doGenerateAccessToken(nick, claims);
	}

    // JWT accessToken 생성
	private String doGenerateAccessToken(String nick, Map<String, Object> claims) {
		String accessToken = Jwts.builder()
				.setClaims(claims)
				.setId(nick)
				.setIssuedAt(new Date(System.currentTimeMillis()))
                //access 토큰 유효기한 30분
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
				.signWith(SignatureAlgorithm.HS512, secret)
				.compact();
		
		return accessToken;
	}

    // nick을 입력받아 accessToken, refreshToken 생성
	public Map<String, String> generateTokenSet(String nick, long reqTokenValidity) {
		return generateTokenSet(nick, new HashMap<>(), reqTokenValidity);
	}
	
	// nick, 속성정보를 이용해 accessToken, refreshToken 생성
	public Map<String, String> generateTokenSet(String nick, Map<String, Object> claims, long reqTokenValidity) {
		return doGenerateTokenSet(nick, claims, reqTokenValidity);
	}
	
	// JWT accessToken, refreshToken 생성
	private Map<String, String> doGenerateTokenSet(String nick, Map<String, Object> claims, long reqTokenValidity) {
		Map<String, String> tokens = new HashMap<String, String>();
		
		String accessToken = Jwts.builder()
				.setClaims(claims)
				.setId(nick)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY	))// 30분
				.signWith(SignatureAlgorithm.HS512, secret)
				.compact();
		
		String refreshToken = Jwts.builder()
				.setId(nick)
				.setExpiration(new Date(System.currentTimeMillis() + reqTokenValidity))
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.signWith(SignatureAlgorithm.HS512, secret)
				.compact();
		
		tokens.put("accessToken", accessToken);
		tokens.put("refreshToken", refreshToken);
		return tokens;
	}

    // 토근 검증
	public Boolean validateToken(String token) {
		try {
			Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
			return true;
		} catch (SignatureException e) {
			log.error("Invalid JWT signature: {}", e.getMessage());
			return false;
		} catch (MalformedJwtException e) {
			log.error("Invalid JWT token: {}", e.getMessage());
			return false;
		} catch (ExpiredJwtException e) {
			log.error("JWT token is expired: {}", e.getMessage());
			return false;
		} catch (UnsupportedJwtException e) {
			log.error("JWT token is unsupported: {}", e.getMessage());
			return false;
		} catch (IllegalArgumentException e) {
			log.error("JWT claims string is empty: {}", e.getMessage());
			return false;
		}
	}

	// 만료 체크
	public String expiredCheck(String token) {
		try {
			Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
			return "success";
		} catch (SignatureException e) {
			log.error("Invalid JWT signature: {}", e.getMessage());
			return "Invalid JWT signature";
		} catch (MalformedJwtException e) {
			log.error("Invalid JWT token: {}", e.getMessage());
			return "Invalid JWT token";
		} catch (ExpiredJwtException e) {
			log.error("JWT token is expired: {}", e.getMessage());
			return "expired";
		} catch (UnsupportedJwtException e) {
			log.error("JWT token is unsupported: {}", e.getMessage());
			return "JWT token is unsupported";
		} catch (IllegalArgumentException e) {
			log.error("JWT claims string is empty: {}", e.getMessage());
			return "JWT claims string is empty";
		}
	}
}
