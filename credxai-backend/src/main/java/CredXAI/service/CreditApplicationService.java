package CredXAI.service;

import CredXAI.dto.CreditApplicationResponse;
import CredXAI.entity.CreditApplication;
import CredXAI.entity.User;
import CredXAI.exception.ResourceNotFoundException;
import CredXAI.repository.CreditApplicationRepository;
import CredXAI.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;

import java.util.List;

@Service
public class CreditApplicationService {

    private static final Logger log = LoggerFactory.getLogger(CreditApplicationService.class);

    private final CreditApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public CreditApplicationService(CreditApplicationRepository applicationRepository,
                                    UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void savePrediction(Long userId, JsonNode prediction) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CreditApplication application = new CreditApplication();
        application.setUser(user);
        application.setModelType(prediction.path("model_type").asString());
        application.setDefaultProbability(prediction.path("default_probability").asDouble());
        application.setRiskBand(prediction.path("risk_band").asString());

        applicationRepository.save(application);
        log.info("Saved credit prediction application for user id {}", userId);
    }

    @Transactional(readOnly = true)
    public List<CreditApplicationResponse> getUserApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return applicationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(app -> new CreditApplicationResponse(
                        app.getId(), app.getUser().getId(), app.getModelType(), app.getStatus(),
                        app.getDefaultProbability(), app.getRiskBand(), app.getCreatedAt()))
                .toList();
    }
}
