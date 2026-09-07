Role & Objective: You are an expert Frontend Developer and UI/UX Designer. Your task is to design and build a modern, interactive React dashboard for the "Code2Create 2026 Analysis Engine." This tool analyzes a project's Python backend and React frontend to detect API field name mismatches (e.g., when the backend sends userId but the frontend expects user_id).

Design Language & Vibe:

Theme: Professional developer tool (think VS Code, Linear, Vercel, Sentry). Absolutely NO generic "AI startup" slop (no glowing gradient backgrounds, no floating 3D cards).
Color Scheme: A warm, inviting color palette. Think rich ambers, soft warm whites for light mode, and deep espresso or warm charcoal for dark mode backgrounds.
Theme Toggle: Must include a functional Light / Dark mode toggle switch (sun/moon icon). Use Tailwind dark: classes everywhere.
Responsiveness: Desktop-first (as it's a dev tool), but functional on smaller screens. Include keyboard shortcuts (e.g., / for search, Esc to close panels).
1. Application Flow & Core Screens
Screen 1: Project Upload Screen

UI: A clean drag-and-drop zone with a warm border hover effect (e.g., hover:border-orange-400).
Features: "Drop your project ZIP here" or "[Browse Files]". Show selected project name, file size, and a remove/replace button.
Action: A clear "[ Analyze Project ]" button and a secondary "[ Try Sample Project ]" button.
Instructions: Display clear instructions about the supported structure (Python Backend + React Frontend).
Screen 2: Analysis / Loading Screen (NO FAKE PROGRESS)

UI: Do not just say "Analyzing...". Show local UI states based on what the user is waiting for.
States to show (static checklist with a spinner next to the active step):
✓ Reading files
✓ Detecting API endpoints
● Scanning frontend dependencies (active spinner)
○ Building impact map
Crucial: Do not fake real-time progress from the backend. Just show a structured loading state.
Screen 3: Main Dashboard (Post-Analysis)

Header: Project Health overview.
Summary Cards (Row 1): Total APIs analyzed, Data Fields analyzed, Issues Detected (highlighted in warm terracotta/red), and Detected Frontend Dependencies. Do not invent metrics outside the JSON payload.
Global Actions: A search bar (/ to focus) to search endpoints, fields, or files. A "[ + New Analysis ]" button, and a "[ Download JSON Report ]" button.
2. Key Features & Workspaces
A. Issues Workspace & Endpoint Explorer

Issue Cards: Instead of dumping JSON, show clear issue cards.
Example: /api/user -> ⚠ Possible Mismatch.
Show Backend (userId at backend/api.py:26) vs Frontend (user_id at frontend/UserProfile.jsx:32).
Explain the issue in plain English: "The backend provides userId, but this frontend location expects user_id."
Filters: Allow filtering by: All, Possible Mismatch, Missing in Frontend, Frontend Only, and Matches. Filter by Confidence (Confirmed, Probable, Uncertain).
Endpoint Explorer: A sidebar or accordion listing endpoints (e.g., /api/user -> 2 backend fields, 3 frontend usages, ⚠ 1 issue). Clicking expands details.
Source Location: Show file paths and line numbers clearly. Include a small [Copy] button next to paths (e.g., backend/api.py:26 [Copy]).
B. Impact Map / Interactive Graph (Signature Feature)

Visuals: Create a visual node-and-edge representation of the API payload (SVG + React + CSS is fine, no heavy graph libs needed).
Layout: Backend on the left, Frontend on the right.
Interactions:
Click an endpoint -> Highlight connected fields and files.
Show mismatches visually (e.g., a red line connecting userId to user_id).
Include basic hover tooltips.
C. Edge Cases & Error Handling

Show clear states for: "Frontend Only" (frontend expects a field the backend doesn't send) and "Missing in Frontend" (backend sends a field the frontend never uses).
Show "Match Visualization" (✓ MATCH) to build trust that the tool is working.
Error screens: Invalid ZIP, Backend unavailable, No Python/React files detected.
3. API Contract & Data Structure
The frontend must strictly use this JSON response from POST /api/analyze or POST /api/upload-and-analyze:

json


{
    "status": "warning",
    "summary": {
        "total": 10,
        "matches": 8,
        "possible_mismatches": 2,
        "missing_in_backend": 0,
        "missing_in_frontend": 0,
        "has_issues": true
    },
    "endpoints": [
        {
            "endpoint": "/api/user",
            "results": [
                {
                    "backend_field": {"name": "userId", "file": "backend/api.py", "line": 26},
                    "frontend_field": {"name": "user_id", "file": "frontend/UserProfile.jsx", "line": 32},
                    "status": "possible_mismatch",
                    "confidence": "confirmed",
                    "message": "Mismatch detected."
                }
            ]
        }
    ]
}
4. Recommended React Architecture
Please organize the code cleanly. Do not put everything in App.tsx.



src/
├── components/
│   ├── UploadScreen
│   ├── AnalysisProgress
│   ├── Dashboard
│   ├── SummaryCards
│   ├── IssueList
│   ├── IssueCard
│   ├── EndpointExplorer
│   ├── ImpactMap (DependencyGraph)
│   └── SourceLocation
├── types/
│   └── analysis.ts
├── services/
│   └── api.ts
├── App.tsx
└── index.css
Please generate the React components, Tailwind styling, and logic to fulfill Tier 1 (Upload, Analysis, Dashboard, Issues, Endpoint Explorer, Basic Impact Map) and stub out any complex graph interactions.