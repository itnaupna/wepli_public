package com.bit.jwt;


import java.io.IOException;
import java.net.URLEncoder;
import java.util.*;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bit.dto.MypageDto;
import com.bit.mapper.MemberMapper;
import com.bit.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;


import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.extern.slf4j.Slf4j;


// 인증에서 제외할 url
@Component
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {


    // 실제 JWT 검증을 실행하는 Provider
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TokenService ts;

    @Autowired
    private MemberMapper membermMapper;

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();
    	// 인증에서 제외할 url
	private static final List<String> EXCLUDE_URL =
    Collections.unmodifiableList(
        Arrays.asList(
            "/static/**",
            "/favicon.ico",
            "/ws/**"
    ));

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//         jwt cookie 사용 시 해당 코드를 사용하여 쿠키에서 토큰을 받아오도록 함
        String token = "";
        if(request.getCookies() != null) {
            token = Arrays.stream(request.getCookies())
            .filter(c -> c.getName().equals("token"))
            .findFirst().map(Cookie::getValue)
            .orElse("");
        }

         log.info("token: {}", token);

        String nick = null;
        String accessToken = null;
        Map<String, Object> rules = new HashMap<>();
        String authValue = "";
        MypageDto userDto;
        String path = request.getServletPath();
        log.info(path);

        // 비회원일경우
        if((token == null || token.equals("")) && (path.startsWith("/api/lv0") && !path.equals("/api/lv0/m/logout"))) {
            // log.info("JwtRequestFilter -> no member");
        } else if(token.startsWith("Bearer") && jwtTokenProvider.expiredCheck(token.substring(6)).equals("expired")) {
            // access token이 만료되었을경우
            log.info("[doFilterInternal] expired");
            String refreshToken = ts.accessToRefresh(token);
            // log.info("doFilterInternal -> {}",refreshToken);
            if(refreshToken != null && !jwtTokenProvider.expiredCheck(refreshToken.substring(6)).equals("expired")) {
                refreshToken = refreshToken.substring(6);
                // log.info("doFilterInternal refToken after -> {}",refreshToken);
                // refreshToken이 존재하는 경우 검증
                boolean refreshTokenChk = jwtTokenProvider.validateToken(refreshToken);
                if(refreshTokenChk) {
                    nick = jwtTokenProvider.getUsernameFromToken(refreshToken);
                    // refreshToken 인증 성공인 경우 accessToken 재발급
                    // 권한 map 저장
                    userDto = membermMapper.selectMypageDto(nick);
                    rules.put("roles",
                            userDto.getEmailconfirm() + userDto.getPhoneconfirm() > 0 ? "ROLE_auth2" : "ROLE_auth");
                    // JWT 발급
                    String getToken = jwtTokenProvider.generateAccessToken(nick, rules);
                    // log.info(getToken);
                    accessToken = URLEncoder.encode(getToken, "utf-8");
                    ts.updateAccessToken("Bearer" + refreshToken, "Bearer" + accessToken);
                    //  log.info("[JWT regen] accessToken : {}", accessToken);

                    Cookie[] cookies = request.getCookies();
                    for (int i = 0; i < cookies.length; i++) {
                        if (cookies[i].getName().equals("token")) {
                            cookies[i].setValue("Bearer" + accessToken);
                            break;
                        }
                    }
                    // JWT 쿠키 저장(쿠키 명 : token)
                    Cookie cookie = new Cookie("token", "Bearer" + accessToken);
                    cookie.setPath("/");
                    cookie.setMaxAge(60 * 60 * 24 * 30); // 유효기간 1일
                    // httoOnly 옵션을 추가해 서버만 쿠키에 접근할 수 있게 설정
                    cookie.setHttpOnly(true);

                    response.addCookie(cookie);
                    log.info("[reGenerateAccessToken] accessToken Regen");

                // refreshToken 사용이 불가능한 경우
                } else {
                    // log.warn("accessToken Refresh Fail");
                }
            } else {
                // 기존 쿠키 삭제
                 log.info("expired cookie remove");
                Cookie cookie = new Cookie("token", null);
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        } else {
            // Bearer token인 경우 JWT 토큰 유효성 검사 진행
            if ((token != null || !token.equals("")) && token.startsWith("Bearer")) {
                accessToken = token.substring(6);
                // log.info("token: {}", accessToken);
                try {
                    nick = jwtTokenProvider.getUsernameFromToken(accessToken);
                    // db에서 메일, 문자 인증 받았는지 여부에 따라 권한 부여

                    userDto = membermMapper.selectMypageDto(nick);
                    rules.put("roles",
                            userDto.getEmailconfirm() + userDto.getPhoneconfirm() > 0 ? "ROLE_auth2" : "ROLE_auth");
                } catch (SignatureException e) {
                    log.error("Invalid JWT signature: {}", e.getMessage());
                } catch (MalformedJwtException e) {
                    log.error("Invalid JWT token: {}", e.getMessage());
                } catch (UnsupportedJwtException e) {
                    log.error("JWT token is unsupported: {}", e.getMessage());
                } catch (IllegalArgumentException e) {
                    log.error("JWT claims string is empty: {}", e.getMessage());
                }
            } else {
                logger.warn("JWT Token does not begin with Bearer String");
            }
        }
        if(nick != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            authValue = String.valueOf(rules.get("roles"));
            // List 타입인 이유는 권한이 여러개일수도 있어서
            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(authValue));

            if(jwtTokenProvider.validateToken(accessToken)) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(nick, null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        // log.info("[doFilterInternal]success");
        filterChain.doFilter(request,response);
    }

    // Filter에서 제외할 URL 설정
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    
        String servletPath = request.getServletPath();
		return EXCLUDE_URL.stream().anyMatch(pattern -> PATH_MATCHER.match(pattern, servletPath));
	}

}
