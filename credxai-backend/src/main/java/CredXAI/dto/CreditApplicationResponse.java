package CredXAI.dto;

import java.time.LocalDateTime;

public class CreditApplicationResponse {
    public Long id;
    public Long userId;
    public String modelType;
    public String status;
    public Double defaultProbability;
    public String riskBand;
    public LocalDateTime createdAt;

    public CreditApplicationResponse() {
    }

    public CreditApplicationResponse(Long id, Long userId, String modelType,
                                   String status, Double defaultProbability,
                                   String riskBand, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.modelType = modelType;
        this.status = status;
        this.defaultProbability = defaultProbability;
        this.riskBand = riskBand;
        this.createdAt = createdAt;
    }
}
