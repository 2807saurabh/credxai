package CredXAI.service;

import CredXAI.dto.AlternativePredictionRequest;
import CredXAI.dto.TraditionalPredictionRequest;
import CredXAI.exception.MlServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.databind.JsonNode;

@Service
public class MlPredictionService {

    private static final Logger log = LoggerFactory.getLogger(MlPredictionService.class);

    private final RestClient restClient;
    private final String alternativeUrl;
    private final String traditionalUrl;

    public MlPredictionService(
            RestClient.Builder builder,
            @Value("${credxai.ml.alternative-url}") String alternativeUrl,
            @Value("${credxai.ml.traditional-url}") String traditionalUrl) {
        this.restClient = builder.build();
        this.alternativeUrl = alternativeUrl;
        this.traditionalUrl = traditionalUrl;
    }

    public JsonNode predictAlternative(AlternativePredictionRequest request) {
        return callPredictionService("alternative", alternativeUrl, request);
    }

    public JsonNode predictTraditional(TraditionalPredictionRequest request) {
        return callPredictionService("traditional", traditionalUrl, request);
    }

    private JsonNode callPredictionService(String model, String baseUrl, Object request) {
        log.info("Starting {} credit prediction", model);
        try {
            JsonNode result = restClient.post()
                    .uri(baseUrl + "/predict")
                    .body(request)
                    .retrieve()
                    .body(JsonNode.class);

            if (result == null || result.isNull() || !result.isObject()) {
                log.error("{} ML service returned an empty or unexpected response", model);
                throw new MlServiceUnavailableException("Invalid response from ML service", null);
            }

            log.info("Completed {} credit prediction", model);
            return result;
        } catch (MlServiceUnavailableException ex) {
            throw ex;
        } catch (RestClientException ex) {
            // Avoid logging request payloads; they may contain financial information.
            log.error("{} ML service call failed ({})", model, ex.getClass().getSimpleName());
            throw new MlServiceUnavailableException("ML prediction service call failed", ex);
        }
    }
}
