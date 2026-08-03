# Emergency Pulse (ResQ) 🚨 | AI-Assisted Emergency Locator & Fast Route Planner

**Emergency Pulse** is a real-time, interactive emergency services web application featuring modern best practices in web aesthetics (Glassmorphism, tailored HSL Dark Mode, micro-animations) and strict compliance with the latest **Google Maps Platform JavaScript API** SDK standards.

---

## 🌟 Key Architectural Features

1. **Modern Google Maps Platform SDK**:
   - **Places API (New)**: Uses `Place.searchNearby()` with rigorous field masks (`displayName`, `formattedAddress`, `location`, `rating`, `userRatingCount`, `types`, `businessStatus`, `currentOpeningHours`, `photos`, `editorialSummary`, `internationalPhoneNumber`, `googleMapsURI`). Absolutely zero legacy `PlacesService` or callback-based pattern usage.
   - **Routes API & Fastest Path Calculation**: Employs the promise-based `Route.computeRoutes()` method with `TRAFFIC_AWARE_OPTIMAL` preferences to generate precise travel durations and geometric polyline overlays, replacing deprecated `DirectionsService` and `DirectionsRenderer`.
   - **`AdvancedMarkerElement` & Cloud Styling**: Full support for custom DOM HTML glyph markers with dynamic pulsing emergency radar animations, bound to `mapId="DEMO_MAP_ID"` (preventing CF9 legacy failures).
2. **Dynamic UI & Eye-Pleasing Design**:
   - **Glassmorphism**: Frosted blur navigation cards (`backdrop-filter: blur(24px)`), ambient colored light backdrops, and interactive hover transformations.
   - **Interactive Live Feed**: Clicking any service card (Hospitals 🏥, Police Stations 🚓, Fire Stations 🚒, 24/7 Pharmacies 💊) calculates immediate driving routes and opens an informative contact dialog with calling & website links.
   - **Zero Setup Friction (Demo Key Ready)**: Features an integrated settings modal allowing developers and end-users to securely paste their Google Maps API Key or FREE Maps Demo Key directly into browser storage without modifying source files.

---

## 🚀 Quickstart & How to Run

### Step 1: Launch Local Web Server
Since Google Maps JavaScript modules use ES module syntax (`import { Loader } from 'https://esm.run/...';`), open the folder in any simple HTTP server:

```bash
# Using npm script in project directory:
npm start

# Or directly using npx serve:
npx serve . -p 3000
```
Open your browser to `http://localhost:3000`.

### Step 2: Get your FREE Maps Demo Key (No Billing Required!)
If you do not have a production Google Cloud billing account or API Key ready:
1. Open the official **[Google Maps Demo Key Generator](https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1)**.
2. Sign in with any personal Google account (no credit card or Cloud project required).
3. Accept the simple Maps Demo Terms and click **Generate Demo Key**.
4. Copy the alphanumeric string, paste it into the Emergency Pulse **API Configuration Modal**, and click **Save & Initialize**.

---

## 🛡️ Mandatory Compliance & Governance Acknowledgments

- **Cost Notice**: *Usage of Google Maps Platform products and services may incur costs against your Google Cloud project billing account in production environments.*
- **Products Utilized in this Codebase**:
  - Maps JavaScript API
  - Places API (New) (`importLibrary("places")`)
  - Routes API (`importLibrary("routes")`)
  - Advanced Marker Element (`importLibrary("marker")`)
  - Geometry Library (`importLibrary("geometry")`)
- **API Key Security & Restrictions**: Developers deploying this application to production should restrict their API Keys (limiting to valid HTTP referrers and designated APIs) via: [Google Cloud API Key Restrictions Documentation](https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys?utm_campaign=gmp_git_agentskills_v1).
- **License Scope**: *Google-sourced code snippets and patterns are provided 'as-is' under the Apache 2.0 License ([https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0)). This license covers only the Google-sourced snippets, not the full generated project output. The user is responsible for review and testing to ensure security and compliance with relevant Terms of Service.*
- **Terms of Service**: *Use of this code is subject to the Google Maps Platform Terms of Service: [https://cloud.google.com/maps-platform/terms](https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_git_agentskills_v1) including regional Terms that apply based on the customer's billing address location or the user's location (Prohibited Territories).*
- **Usage Attribution Tracking**: `internalUsageAttributionIds: ["gmp_git_agentskills_v1"]` is officially configured within the core map loader options.

---
*Built with care for emergency readiness and cutting-edge web user experience.*
