package CredXAI.dto;

public class AuthResponse {
    public Long id;
    public String fullName;
    public String email;
    public String role;
    public String token;

    public AuthResponse(Long id, String fullName, String email,
                        String role, String token) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.token = token;
    }
}