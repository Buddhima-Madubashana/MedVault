# **MedVault** 🛡️🏥

## **Secure Patient Data Management System with Context-Aware Access Control**

## **Overview**

MedVault is a full-stack web application designed to demonstrate advanced cybersecurity principles in healthcare data management. Unlike traditional systems with static security, MedVault implements **Context-Aware Access Control (CAAC)** that dynamically adjusts user permissions based on real-time factors such as **shift schedules**, **leave status**, and **temporary privilege escalation**.

The system enforces **Role-Based Access Control (RBAC)** across three primary roles — **Administrator**, **Doctor**, and **Nurse** — with additional contextual dimensions including **Temporary Admin** privileges, **Off-Time (Shift-Based) restrictions**, and **Leave Day access blocking**. All sensitive patient data is protected with **AES-256 field-level encryption** and **role-specific data masking**.

---

## **✨ Key Features**

### **🔐 Advanced Security Controls**
- **Context-Aware Access Control (CAAC):** Shift-based access windows dynamically restrict write/edit privileges for Doctors and Nurses when outside active shift hours.
- **Leave Day Access Blocking:** Users on approved leave are blocked from system login entirely, unless an emergency override is granted by an Administrator.
- **Temporary Admin Escalation:** Doctors can request time-limited admin permissions that automatically expire after a configured duration.
- **Active Session Self-Defense:** Automated idle lock screen (admin-configurable inactivity timeout) that blurs the workstation and requires user activity to resume.
- **Role-Based Access Control (RBAC):** Three distinct user roles (Administrator, Doctor, Nurse) with granular permissions.
- **AES-256 Field-Level Encryption:** Sensitive patient fields (Age, Disease, Ward, Email, Phone, Address, Guardian Name) are encrypted at rest using AES-256-CBC.
- **Role-Specific Data Masking:** Contact information is masked (`****`) for Doctors and Nurses; only Admins (and active Temporary Admins) see fully decrypted data.
- **Comprehensive Audit Logging:** Immutable logs capturing user ID, name, role, action type, details, IP address, and timestamp for every significant event.
- **Account Lockout Protection:** Configurable max failed login attempts with automatic account lockout and Admin notification.
- **Password Policy Enforcement:** Admin-configurable minimum password length and special character requirements, with forced password reset on policy tightening.
- **Session Expiry:** JWT-based session management with configurable timeouts (Admins: 24h, Doctors/Nurses: admin-configurable).

### **🏥 Healthcare-Specific Design**
- **Patient Admission/Discharge Workflow:** Nurses submit patient requests (Add/Delete) that require Doctor approval before taking effect.
- **Treatment Timeline:** Doctors can add timeline entries and update medical history, status, and vitals for patients.
- **Task Assignment:** Doctors can assign tasks to Nurses with notification support.
- **Emergency Access Override:** Administrators can grant time-limited emergency access to staff members on approved leave.
- **Announcements System:** Admin-managed announcements with priority levels (Low, Normal, High) visible to all staff.
- **Real-Time Notifications:** In-app notification bell with unread count, individual/bulk mark-as-read, and deep-link navigation.

---

## **👥 User Roles & Detailed Permissions**

### **🟣 Administrator (Admin)**

The Administrator has full, unrestricted access to the entire system. Admins are not subject to shift-based or leave-based restrictions.

| Category | Permission | Access |
|---|---|---|
| **Dashboard** | View Dashboard Analytics & Statistics | ✅ |
| **User Management** | Register new Doctors and Nurses | ✅ |
| **User Management** | Delete user accounts (Doctors, Nurses, other Admins) | ✅ |
| **User Management** | View All Users list | ✅ |
| **User Management** | Unlock locked accounts | ✅ |
| **User Management** | Assign/update shift schedules for Doctors and Nurses | ✅ |
| **Patient Data** | View patient records (fully decrypted, unmasked) | ✅ |
| **Patient Data** | Add patients directly (bypassing request workflow) | ✅ |
| **Patient Data** | Delete patient records directly | ✅ |
| **Patient Data** | View encrypted field details (Email, Phone, Address, Guardian) | ✅ |
| **Security** | View and manage Audit Logs | ✅ |
| **Security** | Configure System Settings (password policy, session timeout, lockout, inactivity timeout) | ✅ |
| **Security** | View Permission Matrix | ✅ |
| **Admin Requests** | Review and approve/reject temporary admin requests from Doctors | ✅ |
| **Admin Requests** | Revoke active temporary admin permissions | ✅ |
| **Leave Management** | View all leave requests from all staff | ✅ |
| **Leave Management** | Approve/reject leave requests | ✅ |
| **Leave Management** | Grant emergency access override to staff on leave | ✅ |
| **Leave Management** | Revoke emergency access override | ✅ |
| **Announcements** | Create, update, and delete announcements | ✅ |
| **Announcements** | Set announcement priority (Low, Normal, High) | ✅ |
| **Notifications** | Receive security alerts (account lockouts, admin requests, leave requests, emergency requests) | ✅ |

---

### **🔵 Doctor**

Doctors have clinical-level access focused on patient medical records. Their write access is **shift-dependent** — outside assigned shift hours, Doctors operate in **read-only mode**.

| Category | Permission | In Shift | Off Shift |
|---|---|---|---|
| **Dashboard** | View Dashboard Analytics & Statistics | ✅ | ✅ |
| **Patient Data** | View patient records (contact info masked as `****`) | ✅ | ✅ |
| **Patient Data** | View patient medical history | ✅ | ✅ |
| **Patient Data** | View patient vitals & treatment timeline | ✅ | ✅ |
| **Patient Data** | Edit patient medical history | ✅ | ❌ |
| **Patient Data** | Update patient status | ✅ | ❌ |
| **Patient Data** | Update patient vitals (Heart Rate, BP, Temperature) | ✅ | ❌ |
| **Patient Data** | Add treatment timeline entries | ✅ | ❌ |
| **Patient Data** | Add new patients directly | ✅ | ❌ |
| **Patient Data** | Delete patients directly | ✅ | ❌ |
| **Approvals** | Review and approve/reject Nurse patient requests (Add/Delete) | ✅ | ❌ |
| **Task Management** | Assign tasks to Nurses | ✅ | ❌ |
| **Admin Requests** | Request temporary admin permissions from an Administrator | ✅ | ❌ |
| **Staff Directory** | View Nurse list | ✅ | ✅ |
| **Staff Directory** | View Doctor list | ✅ | ✅ |
| **Leave Management** | Apply for leave | ✅ | ✅ |
| **Leave Management** | View own leave request history | ✅ | ✅ |
| **Notifications** | Receive notifications (request approvals, task completions, permission updates) | ✅ | ✅ |

> **Note:** If no shift is assigned to a Doctor, they default to **unrestricted** (always in-shift) access.

---

### **🩷 Nurse**

Nurses have limited clinical access focused on patient intake, vitals updates, and request submission. Their write access is also **shift-dependent**.

| Category | Permission | In Shift | Off Shift |
|---|---|---|---|
| **Dashboard** | View Dashboard Analytics & Statistics | ✅ | ✅ |
| **Patient Data** | View patient records (contact info masked as `****`) | ✅ | ✅ |
| **Patient Data** | View patient medical history (read-only) | ✅ | ✅ |
| **Patient Data** | View patient vitals & treatment timeline | ✅ | ✅ |
| **Patient Data** | Update patient vitals only (Heart Rate, BP, Temperature) | ✅ | ❌ |
| **Patient Data** | Edit patient medical history | ❌ | ❌ |
| **Patient Data** | Update patient status | ❌ | ❌ |
| **Patient Data** | Add treatment timeline entries | ❌ | ❌ |
| **Patient Requests** | Submit patient admission requests (to Doctor for approval) | ✅ | ❌ |
| **Patient Requests** | Submit patient discharge requests (to Doctor for approval) | ✅ | ❌ |
| **Patient Requests** | View pending approvals & request history | ✅ | ✅ |
| **Task Management** | View assigned tasks | ✅ | ✅ |
| **Task Management** | Mark tasks as completed | ✅ | ❌ |
| **Staff Directory** | View Nurse list | ✅ | ✅ |
| **Staff Directory** | View Doctor list | ✅ | ✅ |
| **Leave Management** | Apply for leave | ✅ | ✅ |
| **Leave Management** | View own leave request history | ✅ | ✅ |
| **Notifications** | Receive notifications (request approvals/rejections, task assignments) | ✅ | ✅ |

> **Note:** Nurses can **never** edit medical history, change patient status, or add timeline entries — even when in shift. They are restricted to vitals updates only.

---

### **🟡 Temporary Admin (Doctor with Elevated Privileges)**

When a Doctor is granted temporary admin access, their account is **promoted to the Admin portal** with a combined permission set. The temporary admin operates in the Admin dashboard with an additional "Doctor Access" section in the sidebar.

| Category | Permission | Access |
|---|---|---|
| **Dashboard** | View Dashboard Analytics & Statistics | ✅ |
| **Patient Data** | View patient records (fully decrypted, unmasked) | ✅ |
| **Patient Data** | All Doctor clinical permissions (edit history, vitals, timeline, status) | ✅ |
| **Patient Data** | Add/Delete patients directly | ✅ |
| **Approvals** | Review and approve/reject Nurse requests | ✅ |
| **User Management** | View All Users list | ✅ |
| **User Management** | Unlock locked accounts | ✅ |
| **Security** | View Audit Logs | ✅ |
| **Announcements** | Create, update, and delete announcements | ✅ |
| **Staff Directory** | View Nurse list | ✅ |
| **Staff Directory** | View Doctor list | ✅ |
| **Leave Management** | Manage Doctor leave requests | ✅ |
| **Leave Management** | View all leave requests | ✅ |
| **Admin Requests** | View/manage admin requests directed to them | ❌ (hidden) |
| **System Settings** | Modify system security policies | ✅ |
| **Permission Matrix** | View Permission Matrix | ✅ |

**Temporary Admin Behavior:**
- The Doctor's `isTempAdmin` flag is set to `true` with a `tempAdminExpiresAt` timestamp.
- The frontend promotes the Doctor's role to `Admin` in the AuthContext, redirecting them to the Admin dashboard.
- The sidebar displays both Admin items and Doctor-specific items under a "Doctor Access" divider.
- The "Admin Requests" sidebar item is **hidden** for Temporary Admins (they cannot review admin permission requests).
- When the expiration time passes, the temporary privileges are automatically invalid (checked on every authenticated API request).
- Admins can manually revoke temporary access at any time via the Admin Requests page.

---

### **⏰ Off-Time (Shift-Based Restrictions)**

Shift-based access control is a core CAAC feature. Administrators assign shift windows (start/end times in `HH:MM` format) to Doctors and Nurses.

**How It Works:**
1. **Shift Assignment:** Admins set `shiftStart` and `shiftEnd` times for each Doctor/Nurse via the User Management page.
2. **Shift Evaluation:** The frontend utility `isUserInShift()` evaluates the current local time against the assigned shift window. Overnight shifts (e.g., 22:00 → 06:00) are handled correctly.
3. **Enforcement:** When a Doctor or Nurse is **outside their shift**, all write/edit actions are disabled in the UI (buttons are hidden or disabled). The user operates in **read-only mode**.
4. **No Shift = Unrestricted:** If no shift start/end is configured for a user, they default to always being in-shift (unrestricted access).

**Restrictions Applied When Off-Shift:**

| Action | Doctor (Off-Shift) | Nurse (Off-Shift) |
|---|---|---|
| View patient records | ✅ Read-only | ✅ Read-only |
| Edit vitals | ❌ | ❌ |
| Edit medical history | ❌ | N/A (never allowed) |
| Update patient status | ❌ | N/A (never allowed) |
| Add timeline entries | ❌ | N/A (never allowed) |
| Add/Delete patients | ❌ | ❌ (requests blocked) |
| Approve/Reject Nurse requests | ❌ | N/A |
| Assign tasks to Nurses | ❌ | N/A |
| Request admin permissions | ❌ | N/A |

---

### **📅 Leave Days (Leave-Based Access Blocking)**

Leave management is a security feature that completely blocks system access for staff on approved leave.

**How It Works:**
1. **Leave Application:** Doctors and Nurses apply for leave by specifying start date, end date, and a reason.
2. **Admin Approval:** Administrators review and approve/reject leave requests.
3. **Login Blocking:** When a user with an **approved** leave covering today's date attempts to login, the system **blocks authentication** with the message: _"Access Denied: You are currently on leave."_
4. **API Middleware Blocking:** Even if a token is somehow obtained, the `authMiddleware` checks leave status on every authenticated request and denies access if the user is on leave without an active override.
5. **Emergency Access Override:** If a staff member on leave needs emergency access:
   - The user can submit an **Emergency Access Request** from the login page (providing email, reason, and requested duration).
   - All Admins receive a notification about the emergency request.
   - An Admin can **grant an emergency override** with a specified duration in hours.
   - The override has an expiration time; once expired, access is blocked again.
   - Admins can also **revoke** an active emergency override at any time.

**Leave Day Permissions:**

| Action | Doctor/Nurse (On Leave) | With Emergency Override |
|---|---|---|
| Login to system | ❌ Blocked | ✅ Allowed |
| Access any API endpoint | ❌ Blocked | ✅ Allowed |
| Request emergency access | ✅ (from login page) | N/A |
| Normal role permissions | ❌ None | ✅ Full role permissions |

---

## **🛠️ Technology Stack**

### **Backend**
| Technology | Purpose |
|---|---|
| **Node.js** | Server runtime |
| **Express.js v5** | Web framework |
| **MongoDB** with **Mongoose** ODM | Database and data modeling |
| **JWT** (`jsonwebtoken`) | Stateless authentication |
| **bcryptjs** | Password hashing |
| **AES-256-CBC** (Node.js `crypto`) | Field-level encryption |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

### **Frontend**
| Technology | Purpose |
|---|---|
| **React 19** with Hooks | UI framework |
| **Vite 7** | Build tool and dev server |
| **React Router v7** | Client-side routing |
| **Context API** | State management (Auth, Theme, Toast) |
| **TailwindCSS 3** | Utility-first CSS framework |
| **Framer Motion** | Animations and transitions |
| **Lucide React** | Icon library |
| **jwt-decode** | Client-side JWT parsing |

---

## **🚀 Quick Start**

### **Prerequisites**
- Node.js 18 or higher
- MongoDB 6.0 or higher (local or cloud via MongoDB Atlas)
- npm

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medvault.git
   cd medvault
   ```

2. **Install backend dependencies**
   ```bash
   cd back-end
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../front-end
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `back-end/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/medvault
   JWT_SECRET=your_jwt_secret_key
   ENCRYPTION_KEY=your_32_character_encryption_key
   ```
   > **Important:** The `ENCRYPTION_KEY` must be exactly 32 characters (256 bits) for AES-256 encryption.

5. **Seed the Admin account**
   ```bash
   cd back-end
   node seedAdmin.js
   ```
   This creates the default Admin account:
   - **Email:** `admin@medvault.com`
   - **Password:** `admin123`

6. **Start the development servers**
   ```bash
   # Terminal 1 — Backend (Port 5000)
   cd back-end
   npm run dev
   
   # Terminal 2 — Frontend (Vite dev server)
   cd front-end
   npm run dev
   ```

7. **Access the application**
   - Open browser and navigate to `http://localhost:5173` (Vite default)
   - Login with the seeded Admin account to begin creating Doctors and Nurses

---

## **🔧 Project Structure**

```
medvault/
├── back-end/
│   ├── index.js                    # Express server entry point & route registration
│   ├── seedAdmin.js                # Database seeder for initial Admin account
│   ├── .env                        # Environment variables
│   ├── package.json
│   │
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification, user lookup, leave status check
│   │
│   ├── models/
│   │   ├── User.js                 # User schema (roles, shifts, temp admin, lockout)
│   │   ├── Patient.js              # Patient schema (encrypted fields, vitals, timeline)
│   │   ├── PatientRequest.js       # Nurse-submitted patient add/delete requests
│   │   ├── AdminRequest.js         # Doctor-submitted temporary admin requests
│   │   ├── LeaveRequest.js         # Leave requests with emergency override support
│   │   ├── Task.js                 # Doctor-to-Nurse task assignments
│   │   ├── Announcement.js         # System announcements with priority levels
│   │   ├── AuditLog.js             # Immutable security audit trail
│   │   ├── Notification.js         # In-app notification entries
│   │   └── SystemSettings.js       # Configurable security policies
│   │
│   ├── routes/
│   │   ├── auth.js                 # Login & Register (password policy validation)
│   │   ├── users.js                # User CRUD, shift config, unlock, password reset
│   │   ├── patients.js             # Patient CRUD with role-based masking
│   │   ├── patientRequests.js      # Nurse request workflow (submit/approve/reject)
│   │   ├── adminRequests.js        # Temp admin request workflow
│   │   ├── leaveRequests.js        # Leave CRUD, emergency override, emergency request
│   │   ├── tasks.js                # Task assignment and completion
│   │   ├── announcements.js        # Announcement CRUD (Admin/Temp Admin only)
│   │   ├── auditLogs.js            # Audit log retrieval and manual log creation
│   │   ├── notifications.js        # Notification retrieval and mark-as-read
│   │   └── systemSettings.js       # Security settings CRUD, compliance status
│   │
│   └── utils/
│       ├── encryption.js           # AES-256-CBC encrypt/decrypt functions
│       ├── maskData.js             # Role-based data masking (contact info)
│       ├── leaveChecker.js         # Leave status & emergency override checker
│       └── logger.js               # Audit log creation helper
│
├── front-end/
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # TailwindCSS configuration
│   ├── package.json
│   │
│   └── src/
│       ├── App.jsx                 # Root component with routing & role-based guards
│       ├── main.jsx                # React entry point
│       ├── index.css               # Global styles
│       │
│       ├── contexts/
│       │   ├── AuthContext.jsx      # Authentication state, login/logout, temp admin promotion
│       │   ├── ThemeContext.jsx      # Dark/Light mode toggle
│       │   └── ToastContext.jsx      # Toast notification system
│       │
│       ├── components/
│       │   ├── DashboardLayout.jsx   # Sidebar, header, notifications, idle lock
│       │   ├── Navigation.jsx        # Navigation component
│       │   ├── Notification.jsx      # Notification dropdown
│       │   └── AdminRequestModal.jsx # Temp admin request dialog
│       │
│       ├── pages/
│       │   ├── Landing.jsx           # Login page with emergency access request
│       │   │
│       │   ├── dashboards/
│       │   │   ├── AdminDashboard.jsx   # Admin layout (merged sidebar for Temp Admins)
│       │   │   ├── DoctorDashboard.jsx  # Doctor layout
│       │   │   ├── NurseDashboard.jsx   # Nurse layout
│       │   │   └── DashboardHome.jsx    # Shared analytics home page
│       │   │
│       │   ├── admin/
│       │   │   ├── UserManagement.jsx   # Register new users
│       │   │   ├── AllUsers.jsx         # View/manage all users
│       │   │   ├── LockedAccounts.jsx   # View/unlock locked accounts
│       │   │   ├── AuditLogs.jsx        # Security audit log viewer
│       │   │   ├── SystemSettings.jsx   # Security policy configuration
│       │   │   ├── AdminRequests.jsx    # Review temp admin requests
│       │   │   ├── AdminLeaves.jsx      # Manage staff leave requests & overrides
│       │   │   ├── AdminAnnouncements.jsx # Manage announcements
│       │   │   └── PermissionMatrix.jsx  # Visual role-permission matrix
│       │   │
│       │   ├── doctor/
│       │   │   └── ReviewApprovals.jsx  # Review/approve Nurse patient requests
│       │   │
│       │   ├── nurse/
│       │   │   └── PendingApprovals.jsx # Submit patient requests & view status
│       │   │
│       │   └── shared/
│       │       ├── PatientRecords.jsx   # Patient list with role-based actions
│       │       ├── PatientDetails.jsx   # Individual patient view/edit
│       │       ├── DoctorList.jsx       # Staff directory (Doctors)
│       │       ├── NurseList.jsx        # Staff directory (Nurses)
│       │       ├── LeaveManagement.jsx  # Apply for leave & view history
│       │       └── Appointments.jsx     # Appointments placeholder
│       │
│       └── utils/
│           ├── shiftHelper.js       # Shift time evaluation (handles overnight shifts)
│           └── exportUtils.js       # CSV export utility for data tables
│
└── README.md                        # This file
```

---

## **📊 Context-Aware Security Dimensions**

MedVault evaluates multiple contextual factors to make dynamic access control decisions:

### **1. Shift Schedule Context**
- Administrators assign `shiftStart` and `shiftEnd` times (HH:MM format) to Doctors and Nurses.
- The system evaluates the current time against the shift window on every page interaction.
- **Within Shift:** Full role-based read/write access is active.
- **Outside Shift:** Read-only access; all write actions are disabled in the UI.
- **Overnight Shifts:** The system correctly handles shifts that cross midnight (e.g., 22:00 → 06:00).

### **2. Leave Status Context**
- The `leaveChecker.js` utility queries approved leave requests covering today's date.
- **On Login:** Leave status is checked, blocking authentication for users on approved leave.
- **On Every Request:** The `authMiddleware` re-checks leave status, blocking API access mid-session if leave becomes active.
- **Emergency Override:** Time-limited override that temporarily allows access despite active leave.

### **3. Temporary Privilege Escalation Context**
- Doctors can request temporary admin access by selecting a target Admin and specifying a reason and duration (in minutes).
- The assigned Admin receives a notification and can approve/reject the request.
- On approval, the Doctor's user record is updated with `isTempAdmin: true` and a `tempAdminExpiresAt` timestamp.
- The frontend AuthContext detects this and promotes the Doctor to the Admin dashboard.
- Expiration is enforced both server-side (middleware checks) and client-side.

### **4. Inactivity Detection Context**
- A configurable inactivity timeout (default: 60 seconds) triggers a **blur overlay** that hides screen content.
- The overlay is dismissed immediately when the user interacts (mouse move, click, keypress).
- The timeout value is fetched from `SystemSettings` and can be adjusted by Admins.

---

## **🔒 Data Security Architecture**

### **Encryption (At Rest)**
- **Algorithm:** AES-256-CBC
- **Encrypted Patient Fields:** `age`, `disease`, `ward`, `email`, `phone`, `address`, `guardianName`
- **Implementation:** Mongoose getter/setter hooks automatically encrypt on save and decrypt on retrieval.
- **Key Management:** 32-character encryption key stored in environment variables.

### **Data Masking (In Transit)**
- **Admin / Active Temp Admin:** Full access to all decrypted fields.
- **Doctor / Nurse:** Contact fields (`email`, `phone`, `address`, `guardianName`) are masked as `****`.
- **Masking Layer:** Applied server-side via `maskData.js` utility before sending API responses.

### **Authentication & Session Management**
- **Password Hashing:** bcryptjs with salt rounds of 10.
- **JWT Tokens:** Signed with configurable secret, role-based expiry (Admin: 24h, others: configurable minutes).
- **Session Expiry Overlay:** Frontend displays a session expired modal with a 5-second countdown before redirect.

### **Account Security**
- **Failed Login Tracking:** Each failed attempt is counted; upon reaching the configurable max attempts, the account is automatically locked.
- **Account Lockout:** Locked accounts cannot login until an Admin manually unlocks them.
- **Admin Notification:** All Admins are notified when an account is locked due to failed attempts.
- **Password Policy Enforcement:** When an Admin tightens password policies (increases min length or enables special characters), all non-Admin users are flagged to reset their passwords.
- **Compliance Dashboard:** Admins can view how many users still need to reset their passwords after a policy change.

---

## **🔔 Notification System**

MedVault includes a real-time in-app notification system:

| Event | Recipients | Icon |
|---|---|---|
| Account locked (failed login attempts) | All Admins | 🔒 |
| Temporary admin access requested | Target Admin | 🛡️ |
| Temporary admin access approved | Requesting Doctor | ✅ |
| Temporary admin access rejected | Requesting Doctor | ❌ |
| Temporary admin access revoked | Affected Doctor | ⚠️ |
| Patient admission request submitted | Target Doctor | 👤+ |
| Patient discharge request submitted | Target Doctor | 🗑️ |
| Patient request approved | Submitting Nurse | ✅ |
| Patient request rejected | Submitting Nurse | ❌ |
| Task assigned to Nurse | Assigned Nurse | 📋 |
| Task completed by Nurse | Assigning Doctor | ✅ |
| Leave request submitted | All Admins | 📅 |
| Leave request approved/rejected | Requesting Staff | ✅/❌ |
| Emergency access requested | All Admins | ⚠️ |
| Emergency access granted | Requesting Staff | 🔑 |
| Emergency access revoked | Affected Staff | 🔒 |

Notifications are polled every 15 seconds and displayed in a dropdown accessible from the header bell icon.

---

## **📝 Audit Log Events**

All significant actions are recorded in an immutable audit trail:

| Event Code | Description |
|---|---|
| `LOGIN_SUCCESS` | User successfully logged in |
| `LOGIN_FAILED` | Failed login attempt with attempt count |
| `LOGIN_BLOCKED` | Login attempt while account locked or on leave |
| `ACCOUNT_LOCKED` | Account locked due to max failed attempts |
| `ACCOUNT_UNLOCKED` | Admin unlocked a user account |
| `USER_REGISTERED` | New user account created |
| `USER_DELETED` | User account deleted by Admin |
| `PASSWORD_RESET` | User reset password (policy compliance) |
| `PATIENT_ADD_DIRECT` | Patient added directly by Doctor/Admin |
| `PATIENT_DELETE_DIRECT` | Patient record deleted |
| `PATIENT_RECORD_UPDATE` | Patient medical record updated |
| `REQUEST_ADMISSION_SENT` | Nurse submitted admission request |
| `REQUEST_DISCHARGE_SENT` | Nurse submitted discharge request |
| `REQUEST_ADMISSION_APPROVED` | Doctor approved admission request |
| `REQUEST_DISCHARGE_APPROVED` | Doctor approved discharge request |
| `REQUEST_REJECTED` | Doctor rejected a patient request |
| `ADMIN_GRANT` | Admin granted temporary admin access |
| `ADMIN_REVOKE` | Admin revoked temporary admin access |
| `SHIFT_CONFIG_UPDATE` | Shift schedule updated for a user |
| `SYSTEM_CONFIG_UPDATE` | System security settings updated |
| `TASK_ASSIGNED` | Doctor assigned a task to a Nurse |
| `TASK_COMPLETED` | Nurse completed an assigned task |
| `LEAVE_REQUEST_CREATED` | Staff submitted a leave request |
| `LEAVE_REQUEST_APPROVE` | Admin approved a leave request |
| `LEAVE_REQUEST_REJECT` | Admin rejected a leave request |
| `LEAVE_OVERRIDE_REQUESTED` | Staff requested emergency access while on leave |
| `LEAVE_OVERRIDE_GRANTED` | Admin granted emergency access override |
| `LEAVE_OVERRIDE_REVOKED` | Admin revoked emergency access override |

---

## **⚙️ Configurable System Settings**

Administrators can configure the following security parameters via the System Settings page:

| Setting | Default | Description |
|---|---|---|
| `minPasswordLength` | 8 | Minimum password length for all users |
| `requireSpecialChars` | `true` | Require at least one special character in passwords |
| `sessionTimeout` | 15 min | JWT session duration for Doctors and Nurses |
| `maxLoginAttempts` | 3 | Maximum failed login attempts before account lockout |
| `accountLockoutDuration` | 30 min | Duration of account lockout (informational) |
| `inactivityTimeout` | 60 sec | Idle time before workstation blur screen activates |

---

## **🗂️ API Endpoints**

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/login` | User login | Public |
| `POST` | `/api/auth/register` | Register new user | Admin |

### Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/users` | List users (with optional role filter) | Authenticated |
| `GET` | `/api/users/doctors` | List all Doctors | Authenticated |
| `GET` | `/api/users/nurses` | List all Nurses | Authenticated |
| `GET` | `/api/users/locked` | List locked accounts | Admin |
| `GET` | `/api/users/:id` | Get single user | Authenticated |
| `POST` | `/api/users/:id/unlock` | Unlock account | Admin |
| `POST` | `/api/users/:id/reset-password` | Reset user password | Authenticated |
| `PUT` | `/api/users/:id/shift` | Update shift schedule | Admin |
| `DELETE` | `/api/users/:id` | Delete user | Admin |

### Patients
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/patients` | List all patients (masked by role) | Authenticated |
| `GET` | `/api/patients/:id` | Get single patient (masked by role) | Authenticated |
| `POST` | `/api/patients` | Add patient directly | Doctor/Admin |
| `PATCH` | `/api/patients/:id` | Update patient record | Doctor/Nurse/Admin |
| `DELETE` | `/api/patients/:id` | Delete patient | Doctor/Admin |

### Patient Requests
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/patient-requests` | Submit admission/discharge request | Nurse |
| `GET` | `/api/patient-requests` | List pending requests | Doctor/Nurse |
| `POST` | `/api/patient-requests/:id/approve` | Approve request | Doctor |
| `DELETE` | `/api/patient-requests/:id` | Reject request | Doctor |

### Admin Requests (Temporary Admin)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/admin-requests` | Request temp admin access | Doctor |
| `GET` | `/api/admin-requests` | List requests | Admin/Doctor |
| `PUT` | `/api/admin-requests/:id/approve` | Approve request | Target Admin |
| `PUT` | `/api/admin-requests/:id/reject` | Reject request | Target Admin |
| `PUT` | `/api/admin-requests/:id/revoke` | Revoke permission | Any Admin |

### Leave Requests
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/leave-requests` | Apply for leave | Doctor/Nurse |
| `GET` | `/api/leave-requests` | List leave requests | Admin (all) / Staff (own) |
| `PUT` | `/api/leave-requests/:id/:action` | Approve/reject leave | Admin |
| `POST` | `/api/leave-requests/:id/override` | Grant emergency override | Admin |
| `POST` | `/api/leave-requests/:id/revoke-override` | Revoke override | Admin |
| `POST` | `/api/leave-requests/emergency-request` | Request emergency access | Public (from login) |

### Tasks
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/tasks` | Assign task to Nurse | Doctor |
| `GET` | `/api/tasks` | List tasks | Doctor/Nurse/Admin |
| `PUT` | `/api/tasks/:id/complete` | Mark task complete | Nurse |

### Announcements
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/announcements` | Get active announcements | Authenticated |
| `GET` | `/api/announcements/all` | Get all announcements | Admin/Temp Admin |
| `POST` | `/api/announcements` | Create announcement | Admin/Temp Admin |
| `PUT` | `/api/announcements/:id` | Update announcement | Admin/Temp Admin |
| `DELETE` | `/api/announcements/:id` | Delete announcement | Admin/Temp Admin |

### System Settings
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/settings` | Get current settings | Public |
| `PUT` | `/api/settings` | Update settings | Admin |
| `GET` | `/api/settings/compliance` | Get password compliance status | Admin |

### Audit Logs
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/audit-logs` | Get audit logs (with optional limit) | Authenticated |
| `POST` | `/api/audit-logs` | Create manual log entry | Authenticated |

### Notifications
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/notifications` | Get unread notifications | Authenticated |
| `PUT` | `/api/notifications/:id/read` | Mark notification as read | Authenticated |
| `PUT` | `/api/notifications/read-all` | Mark all as read | Authenticated |

---

## **📈 MongoDB Data Models**

| Model | Key Fields | Purpose |
|---|---|---|
| **User** | name, email, password, role, shiftStart, shiftEnd, isTempAdmin, tempAdminExpiresAt, isLocked, failedLoginAttempts, mustResetPassword | System user accounts |
| **Patient** | name, age*, disease*, ward*, email*, phone*, address*, guardianName*, vitals, medicalHistory, treatmentTimeline, status | Patient records (*encrypted fields) |
| **PatientRequest** | requestType (Add/Delete), nurseId, doctorId, patient data fields*, status | Nurse-submitted patient workflows |
| **AdminRequest** | requester, admin, reason, duration, status, expiresAt | Temp admin permission requests |
| **LeaveRequest** | requester, startDate, endDate, reason, status, emergencyOverride, emergencyRequest | Staff leave management |
| **Task** | assignedTo, assignedBy, patientId, description, status, completedAt | Doctor-to-Nurse task assignments |
| **Announcement** | title, message, priority, isActive, author | System-wide announcements |
| **AuditLog** | userId, userName, userRole, action, details, ipAddress, timestamp | Security audit trail |
| **Notification** | recipientId, type, title, message, link, icon, isRead | In-app notifications |
| **SystemSettings** | minPasswordLength, requireSpecialChars, sessionTimeout, maxLoginAttempts, accountLockoutDuration, inactivityTimeout | Security configuration (singleton) |

---

## **⚠️ Important Notes**

- **Educational Purpose:** This is a demonstration system designed for academic research and cybersecurity education, not production-ready software.
- **No Real Data:** Use only synthetic data for testing. Do not store actual patient information.
- **Security Research:** Intended for defensive security education and Context-Aware Access Control research.
- **Default Credentials:** The seeded Admin account uses `admin@medvault.com` / `admin123`. Change these immediately in any non-local environment.
- **Encryption Key:** The default encryption key is for development only. Generate a secure 32-character key for any deployed instance.

---

## **📄 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **🙏 Acknowledgments**

- Inspired by real-world healthcare security challenges
- Built with guidance from cybersecurity best practices
- Thanks to the open-source community for invaluable tools and libraries
- Special thanks to academic advisors for their support and guidance

---

**"Security is not a product, but a process."** — Bruce Schneier

*MedVault demonstrates how intelligent, adaptive security processes can protect healthcare data in our increasingly digital world.*

---

<div align="center">

**Built with ❤️ for Healthcare Security Research**

</div>
