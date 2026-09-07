package com.example.sample_project_java;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

    @GetMapping("/api/user")
    public Map<String, Object> getUser() {
        Map<String, Object> response = new HashMap<>();
        response.put("userId", 101);
        response.put("name", "Mithul");
        response.put("email", "mithul@example.com");
        return response;
    }

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        return response;
    }
}
