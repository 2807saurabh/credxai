package CredXAI.controller;

import CredXAI.dto.AlternativePredictionRequest;
import CredXAI.dto.TraditionalPredictionRequest;
import CredXAI.service.CreditApplicationService;
import CredXAI.service.MlPredictionService;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final MlPredictionService mlPredictionService;
    private final CreditApplicationService applicationService;

    public PredictionController(
            MlPredictionService mlPredictionService,
            CreditApplicationService applicationService) {
        this.mlPredictionService = mlPredictionService;
        this.applicationService = applicationService;
    }

    @PostMapping("/alternative")
    public JsonNode predictAlternative(
            @RequestParam Long userId,
            @RequestBody AlternativePredictionRequest request) {

        JsonNode prediction =
                mlPredictionService.predictAlternative(request);

        applicationService.savePrediction(userId, prediction);

        return prediction;
    }

    @PostMapping("/traditional")
    public JsonNode predictTraditional(
            @RequestParam Long userId,
            @RequestBody TraditionalPredictionRequest request) {

        JsonNode prediction =
                mlPredictionService.predictTraditional(request);

        applicationService.savePrediction(userId, prediction);

        return prediction;
    }

    @GetMapping("/history")
    public java.util.List<CredXAI.dto.CreditApplicationResponse> getHistory(
            org.springframework.security.core.Authentication authentication) {
        String userEmail = authentication.getName();
        return applicationService.getUserApplications(userEmail);
    }
}