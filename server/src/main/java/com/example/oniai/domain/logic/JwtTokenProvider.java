package com.example.oniai.domain.logic;

import java.time.Instant;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

	@Autowired
	JwtEncoder encoder;

	/**
	 * JwtTokenを生成
	 * @param authentication
	 * @return
	 */
	public String generateToken(Authentication authentication) {

		// Tokenの設定情報
		Instant now = Instant.now();
		long expiry = 36000L;
		String scope = authentication.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.collect(Collectors.joining(" "));
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuer("self")
				.issuedAt(now)
				.expiresAt(now.plusSeconds(expiry))
				.subject(authentication.getName())
				.claim("scope", scope)
				.build();
					
		// Tokenの生成
		return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
	}
}
