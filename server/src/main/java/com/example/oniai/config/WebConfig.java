package com.example.oniai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORSの設定
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    /**
     * 許可されたオリジンを環境変数経由で設定
     */
    @Value("${cors.allowedOrigin}")
    private String allowedOrigin;

    /**
     * グローバルCORS設定
     */
    @Override
    public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
        registry
            .addMapping("/**") // 対象のAPIエンドポイント
            .allowedOrigins(allowedOrigin); // 許可するオリジン
    }
}
