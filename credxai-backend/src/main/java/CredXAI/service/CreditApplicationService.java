package CredXAI.service;

import CredXAI.entity.CreditApplication;
import CredXAI.entity.User;
import CredXAI.repository.CreditApplicationRepository;
import CredXAI.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;

@Service
public class CreditApplicationService {

    private final CreditApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public CreditApplicationService(
            CreditApplicationRepository applicationRepository,
            UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void savePrediction(Long userId, JsonNode prediction) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found: " + userId));

        CreditApplication application = new CreditApplication();
        application.setUser(user);
        application.setModelType(
                prediction.path("model_type").asString());
        application.setDefaultProbability(
                prediction.path("default_probability").asDouble());
        application.setRiskBand(
                prediction.path("risk_band").asString());

        applicationRepository.save(application);
    }
}