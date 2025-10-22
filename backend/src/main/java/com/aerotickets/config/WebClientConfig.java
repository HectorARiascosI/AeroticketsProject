package com.aerotickets.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeFilterFunctions;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(15))
                .compress(true)
                .followRedirect(true);

        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(5 * 1024 * 1024))
                .build();

        return builder
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                // ✅ Versión correcta: statusError recibe Predicate<HttpStatusCode> y Function<ClientResponse, Throwable>
                .filter(ExchangeFilterFunctions.statusError(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> {
                            String msg = String.format("HTTP %s en %s", response.statusCode(), response.request().getURI());
                            return new RuntimeException(msg);
                        }
                ))
                .build();
    }
}