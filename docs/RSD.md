# Kavach – Crime Reporting & Hotspot Mapping System

---

## 1. Functional Requirements

### 1.1 User Authentication & Authorization

- The system must provide **secure registration and login** functionality for:
  - **Citizens**
  - **Administrators**
- Enforce **role-based access control**:
  - Citizens have limited access to reporting and viewing.
  - Administrators have full access to crime management and verification.

### 1.2 Crime Reporting

- Citizens must be able to **report a crime** with the following details:
  - **Crime Type**
  - **Description**
  - **Location** (via GPS or manual address input)
  - **Optional Media Attachments** (images and/or videos)

### 1.3 Crime Management & Verification

- Administrators must be able to:
  - **View** reported crimes
  - **Verify**, **Approve**, or **Reject** reports
- Only **verified crimes** will:
  - Appear on the public map
  - Contribute to hotspot detection

### 1.4 Hotspot Detection & Visualization

- The system must:
  - Automatically **detect hotspots** based on geospatial clustering
    - A **hotspot** is defined as an area with **≥10 crimes within a 1 km radius**
  - Display hotspots on an **interactive map**
    - Use **heatmap visualization** to show intensity of crime

---

## 2. Non-Functional Requirements

### 2.1 Performance & Scalability

- The system must support at least **1000 concurrent users** without performance degradation.
- **Geospatial clustering queries** must return results within **3 seconds**.

### 2.2 Security

- All sensitive data must be encrypted:
  - Use **bcrypt** for password hashing
  - Use **JWT (JSON Web Tokens)** for session management
- The platform must use **HTTPS** for all data transmissions to ensure security.

---

## 3. User Stories

### 3.1 Citizen

- As a **citizen**, I want to **register and log in securely**, so that I can access my account and report crimes.
- As a **citizen**, I want to **report a crime** with a description, type, and location, so that authorities can be informed quickly.
- As a **citizen**, I want to **upload images or videos** related to a crime, so that my report is more credible.
- As a **citizen**, I want to **view verified crime reports on a map**, so that I can stay informed about crime in my area.
- As a **citizen**, I want to **see hotspots highlighted on a map**, so that I can avoid high-risk areas.

### 3.2 Administrator

- As an **administrator**, I want to **log in with elevated access**, so that I can manage reported crimes.
- As an **administrator**, I want to **view all reported crimes**, so that I can verify and take appropriate action.
- As an **administrator**, I want to **approve or reject reported crimes**, so that only legitimate crimes are shown publicly.
- As an **administrator**, I want the system to **automatically detect crime hotspots**, so that I can allocate resources efficiently.
- As an **administrator**, I want to **see clusters and heatmaps**, so that I can visualize areas with high crime rates.

---

## 4. Interface Requirements

### 4.1 User Interface (UI) Requirements

- Responsive web interface for desktops, tablets, and mobile devices.

#### Citizen Interface:
- Crime Reporting Form:
  - Dropdown for crime type
  - Description text area
  - GPS/manual map-based location selection
  - Image/video upload (optional)
- Interactive Map (Leaflet.js):
  - Map markers for individual crimes
  - Heat clusters for hotspots (≥10 crimes in 1 km)
  - Filters by type/date
- Report Tracker:
  - Displays all submitted reports
  - Shows real-time status (Pending, Verified, Rejected)

#### Admin Dashboard:
- Table/list of reported crimes
- Filters for status, date, location
- Approve/Reject/Verify buttons
- Status colors:
  - Pending = Yellow
  - Verified = Green
  - Rejected = Red

---

### 4.2 Application Programming Interface (API) Requirements

- RESTful APIs using JSON format
- API Endpoints:
  - User Authentication (register, login, JWT)
  - Crime Reporting (submit, update, delete, fetch)
  - Crime Verification (admin-only actions)
  - Hotspot Detection (geo-clustering)
  - Analytics (crime trends, types, count)
- HTTPS enforced on all endpoints
- Role-based access control (Citizen vs Admin)

---

### 4.3 Hardware Interface Requirements

- Must support:
  - GPS modules (mobile/tablet)
  - Camera and file access for evidence upload
- Server compatibility:
  - AWS, GCP, Azure (cloud-hosted environments)

---

### 4.4 Software Interface Requirements

- Integrations:
  - MongoDB (geospatial queries)
  - Leaflet.js (map rendering)
  - Express.js (Node.js server)
  - JWT + bcrypt (authentication/security)
- Compatibility:
  - Chrome, Firefox, Edge, Safari
  - Node.js v18+

---

## 5. Acceptance Criteria

### 5.1 User Authentication & Authorization

- [ ] Citizen can register with name, email, password, phone number
- [ ] Passwords hashed using bcrypt
- [ ] Login returns a valid JWT token
- [ ] Admin login grants verification access
- [ ] Unauthorized access is denied

### 5.2 Crime Reporting

- [ ] Citizens can report with:
  - [ ] Crime type
  - [ ] Description (20–500 chars)
  - [ ] Location (GPS/manual)
  - [ ] Media upload (optional)
- [ ] Required fields validated
- [ ] Report saved with geocoordinates in MongoDB
- [ ] User can track their submitted reports and statuses

### 5.3 Crime Management (Admin)

- [ ] Admin sees reports marked "Pending"
- [ ] Admin can:
  - [ ] Approve → changes to Verified
  - [ ] Reject → marked Rejected
- [ ] Verified crimes are publicly visible
- [ ] Reporter notified on status change

### 5.4 Hotspot Detection & Visualization

- [ ] Hotspot triggered when ≥10 crimes within 1 km radius
- [ ] Hotspots rendered as heat clusters
- [ ] Auto-update on new verified crimes
- [ ] Filters: crime type, date range
- [ ] Clickable hotspots show summaries

### 5.5 Performance & Scalability

- [ ] Supports 1000+ concurrent users
- [ ] Geo queries return ≤3s
- [ ] Map renders up to 100k crimes without freezing

### 5.6 Security

- [ ] HTTPS enforced
- [ ] JWT tokens expire (e.g., 1 hour)
- [ ] bcrypt-secured passwords
- [ ] Admin-only access to verification APIs
- [ ] Uploaded files scanned for malicious content

### 5.7 Usability

- [ ] UI responsive on all screen sizes
- [ ] Map supports zoom, pan, filter
- [ ] Form inputs show error messages
- [ ] Crime statuses are color-coded

---

## 6. Wireframe Design (PDF)

📎 **Wireframe Attached:** [📄 Kavach_Wireframes.pdf](./assets/Kavach_UI_UX.pdf)

*Includes layouts for:*
- Crime Reporting Page (Citizen)
- Report Tracker
- Interactive Map View
- Admin Dashboard with verification panel

---

