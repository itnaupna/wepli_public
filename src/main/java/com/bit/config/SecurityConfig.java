package com.bit.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.bit.jwt.JwtAuthenticationEntryPoint;
import com.bit.jwt.JwtRequestFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // 인증되지 않은 사용자 접근에 대한 handler
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    // JWT 요청 처리 필터
    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    // 정적 자원에 대한 Security 설정 적용 x
    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring()
                .antMatchers("/favicon.ico")
                .antMatchers("/static/**")
                .antMatchers("/resources/**");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // http
        // .authorizeHttpRequests((authorizeHttpRequests) -> {
        // authorizeHttpRequests
        // .requestMatchers(new AntPathRequestMatcher("/**")).permitAll();
        // })
        // .csrf((csrf) -> csrf
        // .ignoringRequestMatchers(new AntPathRequestMatcher("/api/**")));
        // return http.build();

        return http.cors().and().csrf().disable() // csrf 보안 비활성화
                .antMatcher("/**").authorizeRequests()

                .antMatchers("/api/lv0/**", "/", "/mypage/**", "/stage/**", "/ranking", "/pli", "/mypli", "/pli/**","/auth", "/nlogin").permitAll()
                .antMatchers("/ws","/ws/**").permitAll()
                .antMatchers("/api/lv2/**").hasRole("auth2") // auth2 문자 or 이메일 인증을 받은 사람만 허용가능 api

                // 위에 해당하지 않는 url은 security 인증 적용
                .anyRequest()
                .authenticated()

                // exception 처리
                .and()
                .exceptionHandling() // 인증되지 않은 사용자 접근시
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)

                // Spring Security에서 session을 생성하거나 사용하지 않도록 설정
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                // JWT filter 적용
                .and()
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class).build();
    }
}
