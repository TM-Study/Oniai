package com.example.oniai.config;

import javax.sql.DataSource;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

/**
 * APIのセキュリティ設定
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

	/**
	 * JWT生成用の公開鍵を環境変数経由で設定
	 */
  @Value("${jwt.public.key}")
	RSAPublicKey key;

	/**
	 * JWT生成用の秘密鍵を環境変数経由で設定
	 */
	@Value("${jwt.private.key}")
	RSAPrivateKey priv;

	/**
	 * SecurityFilterの設定
	 * @param http
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("removal")
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.cors()
			.and()
			.csrf().disable() // JWT認証を導入しているためCSRF対策は無効化
			.authorizeHttpRequests((authorize) -> authorize
				.requestMatchers("/login", "/sign-up", "/ws/**", "/health-check").permitAll() // ログイン・新規登録・ソケット通信・AWSのヘルスチェックを許可
				.anyRequest().authenticated()
			)
			// JWT認証設定
			.oauth2ResourceServer((oauth2ResourceServer) -> oauth2ResourceServer
				.jwt((jwt) -> jwt
					.decoder(jwtDecoder())
				)
			);
		return http.build();
	}

	/**
	 * おまじない
	 * @param authenticationConfiguration
	 * @return
	 * @throws Exception
	 */
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	/**
	 * 認証用の機構を設定。AuthenticationManagerの実装クラスの一部。
	 * @param dataSource
	 * @return
	 */
	@Bean
	public UserDetailsService userDetailsService(DataSource dataSource) {
		JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager(dataSource);

		// 認証情報取得クエリ
		userDetailsManager.setUsersByUsernameQuery(
				"SELECT email, password, TRUE as enabled FROM users WHERE email = ?"
		);

		// 権限情報取得クエリ（今回は権限管理はしていないため`TRUE`で固定）
		userDetailsManager.setAuthoritiesByUsernameQuery(
				"SELECT email, 'ROLE_USER' FROM users WHERE email = ?"
		);

		return userDetailsManager;
	}
	
	/**
	 * PasswordEncoderを設定
	 * @return
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	/**
	 * JwtTokenのEncoderを設定
	 * @return
	 */
  @Bean
	JwtEncoder jwtEncoder() {
		JWK jwk = new RSAKey.Builder(this.key).privateKey(this.priv).build();
		JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
		return new NimbusJwtEncoder(jwks);
	}

	/**
	 * JwtTokenのDecoderを設定
	 * @return
	 */
	@Bean
	JwtDecoder jwtDecoder() {
		return NimbusJwtDecoder.withPublicKey(this.key).build();
	}

}