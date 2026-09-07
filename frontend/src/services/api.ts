import { AnalysisResponse } from '../types/analysis';

const baseFrontendFields = [
  { name: "user_id", file: "frontend/src/api/users.ts", line: 15 },
  { name: "createdAt", file: "frontend/src/api/users.ts", line: 16 },
  { name: "profile_image_url", file: "frontend/src/components/Profile.tsx", line: 55 },
  { name: "themePreference", file: "frontend/src/components/Profile.tsx", line: 56 }
];

export const mockSampleResponsePython: AnalysisResponse = {
  status: "warning",
  summary: { total: 24, matches: 20, possible_mismatches: 2, missing_in_backend: 1, missing_in_frontend: 1, has_issues: true },
  endpoints: [
      {
          endpoint: "/api/users",
          results: [
              { backend_field: { name: "userId", file: "backend/api/users.py", line: 42 }, frontend_field: baseFrontendFields[0], status: "possible_mismatch", confidence: "confirmed", message: "Naming convention mismatch detected (camelCase vs snake_case)." },
              { backend_field: { name: "createdAt", file: "backend/api/users.py", line: 43 }, frontend_field: baseFrontendFields[1], status: "match", confidence: "confirmed", message: "Exact match." },
              { backend_field: { name: "lastLoginIp", file: "backend/api/users.py", line: 45 }, status: "missing_in_frontend", confidence: "high", message: "Field returned by backend but not expected/typed in frontend." }
          ]
      },
      {
          endpoint: "/api/settings/profile",
          results: [
              { backend_field: { name: "avatarUrl", file: "backend/api/settings.py", line: 112 }, frontend_field: baseFrontendFields[2], status: "possible_mismatch", confidence: "high", message: "Possible semantic match but different naming." },
              { frontend_field: baseFrontendFields[3], status: "missing_in_backend", confidence: "confirmed", message: "Frontend expects this field, but backend serializer does not include it." }
          ]
      }
  ]
};

export const mockSampleResponseJava: AnalysisResponse = {
  status: "warning",
  summary: { total: 24, matches: 20, possible_mismatches: 2, missing_in_backend: 1, missing_in_frontend: 1, has_issues: true },
  endpoints: [
      {
          endpoint: "/api/users",
          results: [
              { backend_field: { name: "userId", file: "src/main/java/com/example/api/UserController.java", line: 85 }, frontend_field: baseFrontendFields[0], status: "possible_mismatch", confidence: "confirmed", message: "Naming convention mismatch detected (camelCase vs snake_case)." },
              { backend_field: { name: "createdAt", file: "src/main/java/com/example/api/UserController.java", line: 86 }, frontend_field: baseFrontendFields[1], status: "match", confidence: "confirmed", message: "Exact match." },
              { backend_field: { name: "lastLoginIp", file: "src/main/java/com/example/api/UserController.java", line: 88 }, status: "missing_in_frontend", confidence: "high", message: "Field returned by backend but not expected/typed in frontend." }
          ]
      },
      {
          endpoint: "/api/settings/profile",
          results: [
              { backend_field: { name: "avatarUrl", file: "src/main/java/com/example/api/SettingsController.java", line: 112 }, frontend_field: baseFrontendFields[2], status: "possible_mismatch", confidence: "high", message: "Possible semantic match but different naming." },
              { frontend_field: baseFrontendFields[3], status: "missing_in_backend", confidence: "confirmed", message: "Frontend expects this field, but backend serializer does not include it." }
          ]
      }
  ]
};

export const mockSampleResponseCpp: AnalysisResponse = {
  status: "warning",
  summary: { total: 24, matches: 20, possible_mismatches: 2, missing_in_backend: 1, missing_in_frontend: 1, has_issues: true },
  endpoints: [
      {
          endpoint: "/api/users",
          results: [
              { backend_field: { name: "userId", file: "src/controllers/user_controller.cpp", line: 42 }, frontend_field: baseFrontendFields[0], status: "possible_mismatch", confidence: "confirmed", message: "Naming convention mismatch detected (camelCase vs snake_case)." },
              { backend_field: { name: "createdAt", file: "src/controllers/user_controller.cpp", line: 43 }, frontend_field: baseFrontendFields[1], status: "match", confidence: "confirmed", message: "Exact match." },
              { backend_field: { name: "lastLoginIp", file: "src/controllers/user_controller.cpp", line: 45 }, status: "missing_in_frontend", confidence: "high", message: "Field returned by backend but not expected/typed in frontend." }
          ]
      },
      {
          endpoint: "/api/settings/profile",
          results: [
              { backend_field: { name: "avatarUrl", file: "src/controllers/settings_controller.cpp", line: 112 }, frontend_field: baseFrontendFields[2], status: "possible_mismatch", confidence: "high", message: "Possible semantic match but different naming." },
              { frontend_field: baseFrontendFields[3], status: "missing_in_backend", confidence: "confirmed", message: "Frontend expects this field, but backend serializer does not include it." }
          ]
      }
  ]
};


export const analyzeProject = async (file?: File, samplePath?: string): Promise<AnalysisResponse> => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://localhost:5000/api/upload-and-analyze", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to analyze uploaded archive.");
    return response.json();
  } else {
    const payload: any = {};
    if (samplePath) payload.project_path = samplePath;
    
    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to run analysis.");
    return response.json();
  }
};