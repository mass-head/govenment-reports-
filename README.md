# Public Grievance Portal
### AI-Assisted Government Complaint Management System
> **Report. Track. Resolve.**

An integrated, multi-tier public grievance redressal platform engineered for transparent citizen grievance reporting, time-bound departmental redressal, verified photographic resolution proofs, and hierarchical administrative monitoring.

Designed strictly following the official government design specification (**Inter** typography, `#344B40` primary green, `#788C7E` sage secondary, `#F5F6F3` page background, `1120px` maximum content width, and $\ge 44\text{px}$ touch targets).

---

## Key Highlights & Capabilities

- **Strict Government Design System**:
  - Exact color tokens: `#344B40` (Primary), `#788C7E` (Secondary), `#F5F6F3` (Background), `#FFFFFF` (Card), `#252C28` (Primary Text), `#747D76` (Subtext), `#E3E7E2` (Border), `#EDF1EC` (Hover Tint).
  - Clean Inter typography hierarchy with minimum 14px body text.
  - Semantic status indicators where status colors only appear in labeled badges.
  - Zero permanent sidebar — clean top navigation on desktop with a collapsible menu below 820px.
  - Multilingual expansion readiness ($\ge 30\%$) for Telugu and Hindi labels.

- **Email-OTP Authentication & Restricted Staff Access (RBAC)**:
  - **Citizens** sign in with a 6-digit code emailed to them (or, for older accounts, mobile/email + password). Registration verifies the email *before* the account is created.
  - **Field staff & administrators** cannot self-register. Only people on the **staff allowlist** can sign in, and they do so with an emailed one-time code. Anyone not on the list is turned away before any email is sent.
  - 6 distinct administrative tiers:
    1. `public_visitor`: Explores public statistics, government departments directory, and tracks complaints.
    2. `citizen`: Submits grievances, uploads photo evidence, monitors stage-by-stage timelines, and verifies resolution proofs.
    3. `village_employee`: Conducts field inspections, logs ground remarks, and uploads mandatory photographic resolution proof.
    4. `mandal_admin`: Assigns grievances to local field staff, oversees mandal performance, and manages subordinates.
    5. `district_admin`: Reallocates inter-departmental grievances, monitors district SLA escalations, and manages mandal admins.
    6. `state_admin`: Statewide oversight, department configuration, global audit logs, and policy compliance.

- **Live Database Statistics (No Hardcoded Numbers)**:
  - Total, Resolved, Pending, and Average Resolution Time metrics are computed dynamically from actual records in the database.
  - Handles empty production database states with graceful empty states.

- **Real-Time Grievance Tracking**:
  - Look up any complaint by unique ID (e.g. `GRV-2026-01490`).
  - Displays assigned departmental nodal officers, current status badge, inspection milestones, and full chronological audit trail.

- **Verifiable Resolution Proofs**:
  - Staff cannot resolve complaints without mandatory photographic proof and completion date.
  - Citizens can inspect evidence and confirm satisfaction or request reopening.

- **Dual Storage Engine**:
  - Full PostgreSQL & Supabase schema ready with Row Level Security (RLS) policies.
  - Built-in zero-configuration local persistence fallback so the entire application is 100% interactive out of the box even before configuring Supabase credentials.

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool & Bundler** | Vite 6 |
| **Styling & Design Tokens**| Tailwind CSS + PostCSS |
| **Icons** | Lucide React |
| **Data Visualizations** | Recharts |
| **Backend & Database** | PostgreSQL via Supabase (or Browser Storage Engine fallback) |
| **Security & Authorization**| Row Level Security (RLS) + Context-based RBAC |

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18.x` or later (tested on Node v24)
- **npm**: `v9.x` or later

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your Supabase credentials (optional — the portal operates with full local persistence if left unset):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_NAME="Public Grievance Portal"
VITE_APP_TAGLINE="Report. Track. Resolve."
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## Database Architecture (`supabase/schema.sql`)

The database is structured into 13 normalized relational tables:
1. `profiles`: Citizen and officer contact details, roles, and masked identification.
2. `departments`: Government departments (Municipal Administration, Water Supply, Electricity, Roads & Buildings, etc.).
3. `administrative_areas`: Hierarchical areas (District $\rightarrow$ Mandal $\rightarrow$ Village/Ward).
4. `employees`: Staff designations, reporting officers, and jurisdictions.
5. `complaints`: Grievances with auto-generated ID (`GRV-YYYY-XXXXX`), priorities, and statuses.
6. `complaint_categories`: Mapped grievance sub-types.
7. `complaint_assignments`: Detailed assignment and reassignment audit records.
8. `complaint_status_history`: Chronological lifecycle status transitions.
9. `complaint_attachments`: Photos and documents submitted by citizens.
10. `resolution_proofs`: Mandatory completion remarks, photos, and citizen confirmation.
11. `employee_permissions`: Granular permissions for administrative actions.
12. `notifications`: In-app status updates for citizens and officers.
13. `audit_logs`: Immutable security audit logs.

To initialize your Supabase instance, execute the SQL script in `supabase/schema.sql` via your Supabase SQL Editor.

---

## Authentication & Access Control

### How each group signs in

| Group | Can self-register? | Sign-in |
|---|---|---|
| **Citizen** | Yes: name, email, mobile, locality. Email is verified by OTP. | Email OTP (default) or password for legacy accounts |
| **Field staff** (ward/village employees, subordinates) | **No.** Enrolled by a superior. | Employee code or official email, then email OTP |
| **Administrators** (mandal, district, state) | **No.** Granted by a higher tier. | Employee code or official email, then email OTP |

OTP rules: 6 digits, valid 5 minutes, single use, 5 wrong tries burns the code, 30 s resend cooldown, 5 codes/hour per email. Staff sessions expire after 8 hours; citizen sessions after 30 days.

### Who can grant staff access (the allowlist)

| Granting officer | May grant |
|---|---|
| State admin | Any role, including other state admins |
| District admin | Mandal admins + field staff |
| Mandal admin | Field staff |
| Village/ward employee | Subordinate field employees |

- **Enrolling an officer** (Officers tab, *Enroll Officer*) automatically authorizes them. An official email is required, because that is where their sign-in codes go.
- **Manage Access** (Officers tab) lists everyone with access, lets you add admins, and **revoke / restore** access. Revoked people are locked out on their next sign-in or page load. Nobody can revoke themselves.
- Grants and revocations are written to the audit log (`STAFF_ACCESS_GRANTED`, `STAFF_ACCESS_REVOKED`, `STAFF_ACCESS_RESTORED`), as are staff sign-ins (`STAFF_LOGIN`).
- The signed-in role always comes from the allowlist, never from anything the user types.

### Demo mode vs. live mode

| | Demo mode (no Supabase in `.env`) | Live mode (Supabase configured) |
|---|---|---|
| Email OTP | Generated in the browser and **shown on screen** | Real email via Supabase Auth; **never shown on screen** |
| Staff allowlist | Browser storage, seeded with the demo officials | `authorized_staff` table with Row Level Security |
| Demo logins | `rajesh.citizen@ap.gov.in`, `AP-W14-004`, `AP-GJW-003`, `AP-VSP-002`, `AP-HQ-001` | Only addresses you put in `authorized_staff` |

### Setting up live mode (Supabase)

1. Run `supabase/schema.sql`, then **`supabase/migrations/002_email_otp_staff_access.sql`** in the SQL Editor.
2. **Authentication → Providers → Email**: enable it and make sure *Confirm email* / OTP is on.
3. **Authentication → Email Templates → Magic Link**: include the code, e.g. `Your sign-in code is {{ .Token }}`. Without `{{ .Token }}` users get a link and no code.
4. **Authentication → SMTP Settings**: add a real SMTP provider (Resend, Brevo, SES...). Supabase's built-in sender allows only a handful of emails per hour and is not for production.
5. **Give yourself a way in.** The seeded staff emails are fake `@ap.gov.in` addresses. Point your first administrator at an inbox you own:
   ```sql
   UPDATE public.authorized_staff SET email = 'you@yourdomain.com' WHERE employee_code = 'AP-HQ-001';
   ```
6. Sign in at the Admin portal with `AP-HQ-001`, then use **Manage Access** to add everyone else.

### Known limits (read before going live)

- **Mobile numbers are collected but not SMS-verified.** SMS OTP needs a paid provider (Twilio, MSG91...). Email OTP is the verified channel.
- **Other tables are still open.** `schema.sql` still has `Allow public full access` policies on `profiles`, `complaints`, etc., and a plaintext `profiles.password` column used by legacy citizen accounts. The allowlist is enforced server-side, but a determined person with your public anon key could still read/write those tables directly. Locking them down (policies keyed to `auth.uid()` and `my_staff_role()`) is the next hardening step.
- Dashboard routing in the browser trusts the stored session; real enforcement of *what staff can do* must be done by RLS, not by React.

---

## Segregated Audit & Activity Logging System

Accessible in the Administrator Portal under the **"Audit & Activity Logs"** tab:
- **Administrator Governance Logs**: Tracks policy directives, department creations, category additions, officer allocations, and jurisdictional escalations.
- **Employee Subordinate Logs**: Tracks ground inspections, GPS verification events, work start timestamps, resolution photo uploads, and ward field updates.
- Records immutable chronological event metadata including actor name, role, action code, reference entity ID, details, and terminal IP address.

---

## Reference Accounts (demo mode only)
Sign in with the identifier below; the OTP is shown on screen in demo mode. Citizens can also use the legacy password `Demo@1234`.

## Reference Accounts & Credentials:
| Portal | Designation | Identifier (Code / Email / Mobile) | Legacy password (citizen only) | Jurisdiction |
|---|---|---|---|---|
| **Citizen** | Resident Citizen | `9848022338`<br>`rajesh.citizen@ap.gov.in` | `Demo@1234` | Ward 14, Gajuwaka, Visakhapatnam |
| **Field Staff** | Assistant Engineer (PHED) | `AP-W14-004`<br>`ramana.ward@ap.gov.in` | n/a (email code only) | Ward 14 (Water Supply & Sanitation) |
| **Field Subordinate** | Sanitary Inspector | `AP-W14-007`<br>`srinivas.sanitation@ap.gov.in` | n/a (email code only) | Ward 14 (Krishna Nagar) |
| **Field Subordinate** | Ward Secretary | `AP-W14-008`<br>`anitha.wardsec@ap.gov.in` | n/a (email code only) | Ward 14 (Krishna Nagar) |
| **Mandal Admin** | Mandal Revenue Officer (MRO) | `AP-GJW-003`<br>`mandal.admin@ap.gov.in` | n/a (email code only) | Gajuwaka Mandal, Visakhapatnam |
| **District Admin** | District Collector & Magistrate | `AP-VSP-002`<br>`district.collector@ap.gov.in` | n/a (email code only) | Visakhapatnam District Collectorate |
| **State Admin** | State Director of Grievance Redressal | `AP-HQ-001`<br>`state.director@ap.gov.in` | n/a (email code only) | AP State Secretariat, Velagapudi |

### Pre-Configured Grievance Tracking IDs:
- **`GRV-2026-01490`**: Severe drinking water contamination (*Status: In progress*)
- **`GRV-2026-01488`**: Broken high-mast street light (*Status: Resolved with photo proof*)
- **`GRV-2026-01479`**: Open drainage breach (*Status: Pending*)
- **`GRV-2026-01440`**: Private boundary demarcation dispute (*Status: Rejected*)

---

## Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── layout/            # Top Navbar (with Bell Notifications), Footer, Mobile Navigation
│   │   ├── modals/            # Track Complaint, Support, Legal modals
│   │   └── ui/                # Button, Card, Input, Textarea, Select, Badge, Modal, Toast, Container
│   ├── context/               # AuthContext (sessions, 6 demo roles, credentials)
│   ├── lib/                   # Supabase client initialization
│   ├── pages/
│   │   ├── admin/             # AdminDashboard (Executive analytics with Recharts, allocation, depts)
│   │   ├── auth/              # LoginPage, RegisterPage, OtpStep, ForgotPasswordModal
│   │   ├── citizen/           # CitizenDashboard, ComplaintSubmissionPage, detail/resolution modals
│   │   ├── employee/          # EmployeeDashboard, Field Inspection, Resolution Proof, Subordinate modals
│   │   └── public/            # LandingPage, AboutPage, DepartmentsPage, ComplaintTrackingPage
│   ├── services/              # db.ts, otp.ts (email OTP), staffAccess.ts (allowlist & tier rules)
│   ├── styles/                # index.css (design tokens, typography, container)
│   ├── types/                 # Domain TypeScript interfaces (Complaints, Employees, Departments, Proofs)
│   ├── App.tsx                # Application router and layout controller
│   └── main.tsx               # Root entry point with Auth & Toast providers
├── supabase/
│   └── schema.sql             # Complete PostgreSQL schema with 13 tables, RLS & indexes
├── .env.example               # Environment variables template
├── tailwind.config.js         # Design system tokens configuration
└── tsconfig.json              # TypeScript configuration
```

---

## Phased Implementation Roadmap

- [x] **Phase 1: Project Architecture & Design System**: Core tokens, colors, typography, UI components, and PostgreSQL schema.
- [x] **Phase 2: Public Landing Page & Navigation**: Hero, live dynamic statistics, feature cards, 5-step process, department section, tracking modal, and footer.
- [x] **Phase 3: Authentication & Role-Based Access**: Email OTP sign-in, email-verified citizen registration, staff allowlist with tiered grants, and revocation.
- [x] **Phase 4: Citizen Dashboard & Profile**: Personal statistics (Total, Pending, In-Progress, Resolved, Rejected), searchable/filterable complaints table, action modals, resolution proof confirmation, and citizen profile.
- [x] **Phase 5: Complaint Submission & Identity Verification**: 4-step submission wizard, category selection, location details, photo evidence upload, privacy-preserving identity masking, and unique complaint ID generation (`GRV-2026-XXXXX`).
- [x] **Phase 6: Complaint Tracking & Status Timeline**: Dedicated public tracking page, 10-stage visual timeline stepper, mobile phone unlock verification for sensitive citizen details, and citizen feedback triggers.
- [x] **Phase 7: Employee Dashboard & Grievance Actions**: Village/Ward employee portal, assigned complaints table, 1-click "Start Work", "Field Inspection" observation logger, and "Forward Grievance" modal.
- [x] **Phase 8: Employee & Subordinate Management**: Team subordinates directory, "Enroll Subordinate" form with code and designation validation, and reporting hierarchy links.
- [x] **Phase 9: Complaint Assignment & Resolution Proof**: Department assignment and delegation modal, mandatory photographic resolution proof upload, completion date validation, and citizen verification loop.
- [x] **Phase 10: Administrator Dashboards**: Executive portals for Mandal Admins, District Collectors, and State Directors with real-time interactive Recharts analytics.
- [x] **Phase 11: Department & Administrative Area Management**: Department directory management, new department registration modal, and service category creation.
- [x] **Phase 12: Notification System**: Header notification bell popover with live activity stream, status transition alerts, and deep links.
- [x] **Phase 13: Reports & Analytics**: Real-time CSV export with full grievance register, SLA compliance tracking, and department workload breakdown.
- [x] **Phase 14: Security Hardening & Audit Logs**: PostgreSQL Row Level Security policies, masked PII identification, and chronological lifecycle audit logs.
- [x] **Phase 15: Demo Mode & Final Polish**: Live demo data seed, and persistent database fallback.

---

## License
Developed under Government Citizen Charter guidelines for transparent public service administration.

