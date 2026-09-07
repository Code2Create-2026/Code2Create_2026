"""Quick script to test the analysis engine on a given project path."""
import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from analysis_engine.engine import run_analysis

project_path = sys.argv[1] if len(sys.argv) > 1 else "sample_project"
print(f"Analyzing: {project_path}")

result = run_analysis(project_path)

print("\n" + "=" * 60)
print("SUMMARY:")
print(json.dumps(result["summary"], indent=2))
print(f"\nTotal results across all endpoints: {result['summary']['total']}")
print(f"Number of endpoints found: {len(result['endpoints'])}")

for ep in result["endpoints"]:
    endpoint = ep["endpoint"]
    n_results = len(ep["results"])
    n_backend_fields = len(ep["backend_fields"])
    n_frontend_fields = len(ep["frontend_fields"])
    print(f"\n  Endpoint: {endpoint}")
    print(f"    Backend fields: {n_backend_fields}")
    print(f"    Frontend fields in response: {n_frontend_fields}")
    print(f"    Comparison results: {n_results}")
    for r in ep["results"]:
        status = r["status"]
        confidence = r["confidence"]
        bf = r.get("backend_field", {})
        ff = r.get("frontend_field", {})
        bf_name = bf.get("name", "N/A") if bf else "N/A"
        ff_name = ff.get("name", "N/A") if ff else "N/A"
        print(f"      [{status}][{confidence}] backend='{bf_name}' frontend='{ff_name}' — {r['message']}")
