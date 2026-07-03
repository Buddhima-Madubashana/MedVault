# **MedVault** 🛡️🏥

## **Secure Patient Data Management System with Context-Aware Access Control**

## **Overview**

MedVault is a cutting-edge web application designed to demonstrate advanced cybersecurity principles in healthcare data management. Unlike traditional systems with static security, MedVault implements **Context-Aware Access Control (CAAC)** that dynamically adjusts user permissions based on real-time factors like time, location, device, and user behavior patterns.

This project serves as both a functional prototype and an educational platform for understanding how modern security controls can protect sensitive healthcare data while maintaining usability for medical professionals.

## **✨ Key Features**

### **🔐 Advanced Security Controls**
- **Context-Aware Access Control (CAAC):** Dynamic permissions based on time, location, and device context
- **Active Session Self-Defense:** Automated idle lock screen (admin-configurable timeout) requiring login password verification, and a floating 'Panic Camouflage' button to instantly obscure patient records with a mock operational schedule.
- **Role-Based Access Control (RBAC):** Four distinct user roles (Patient, Nurse, Doctor, Administrator)
- **AES-256 Encryption:** Field-level encryption for sensitive patient data (Age, Condition, Contact Info)
- **Granular Data Masking:** Role-specific data visibility (Admins see all, Doctors see medical, Nurses see basic info)
- **Comprehensive Audit Logging:** Immutable logs with full context capture

### **🎓 Educational Demonstrations**
- **Hack Mode vs Secure Mode:** Toggle between vulnerable and protected states
- **Live Security Visualization:** Real-time dashboard showing security decisions
- **Attack Simulation:** Pre-built scenarios demonstrating security effectiveness
- **Interactive Learning:** Step-by-step security concept explanations

### **🏥 Healthcare-Specific Design**
- **Emergency Override:** Controlled break-glass access for critical situations
- **HIPAA Compliance Features:** Built-in privacy and security controls
- **Medical Workflow Integration:** Security that adapts to healthcare realities
- **Patient Privacy Focus:** Granular data access with minimum necessary principle

## **🛠️ Technology Stack**

### **Backend**
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, bcryptjs
- **Encryption:** AES-256 via Node.js crypto module
- **Security:** Helmet.js, rate limiting, input validation

### **Frontend**
- **Framework:** React 18 with Hooks
- **State Management:** Context API
- **Routing:** React Router v6
- **Styling:** CSS Modules with modern CSS features
- **Charts:** Recharts for security visualizations

### **Development Tools**
- **Version Control:** Git
- **Package Manager:** npm
- **API Testing:** Postman/Insomnia
- **Containerization:** Docker (optional)
- **CI/CD:** GitHub Actions

## **🚀 Quick Start**

### **Prerequisites**
- Node.js 18 or higher
- MongoDB 6.0 or higher
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medvault.git
   cd medvault
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # Backend (.env)
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ENCRYPTION_KEY=your_encryption_key
   NODE_ENV=development
   PORT=5000
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the application**
   - Open browser and navigate to `http://localhost:3000`
   - Use demo credentials to explore different roles

## **👥 User Roles & Access**

### **Nurse**
- View basic patient identification (Name, Ward, Age)
- **Privacy Control:** Sensitive medical & contact details are masked (`****`)
- Emergency patient management capabilities (Requests)

### **Doctor**
- View patient medical records (Condition, Ward, Age)
- **Privacy Control:** Personal contact information is masked (`****`)
- Context-aware restrictions for external access

### **Administrator**
- Full access to decrypted patient details (via "View Encrypted Details")
- User management (Doctors, Nurses, Patients)
- Security policy management
- Audit log review and analysis
- Demonstration mode control

## **🔧 Project Structure**

```
medvault/
├── back-end/
│   ├── index.js           # Entry point
│   ├── middleware/        # Security, Auth, & Context middleware
│   ├── models/            # MongoDB schemas (Patient, User, etc.)
│   ├── routes/            # API routes
│   ├── utils/             # Helpers (Encryption, Logging, Masking)
│   ├── .env               # Environment variables
│   └── package.json
│
├── front-end/
│   ├── src/
│   │   ├── components/    # Reusable UI (Forms, Modals, etc.)
│   │   ├── contexts/      # AuthContext & Global State
│   │   ├── pages/         # Application Views (Admin, Doctor, Nurse)
│   │   │   ├── admin/     # Admin-specific pages
│   │   │   ├── doctor/    # Doctor-specific pages
│   │   │   ├── nurse/     # Nurse-specific pages
│   │   │   └── shared/    # Common views (Patient Details)
│   │   └── App.jsx        # Main Component & Routing
│   └── package.json
│
├── docs/                  # Documentation
├── scripts/              # Utility scripts
└── README.md            # This file
```

## **📊 Context-Aware Security**

MedVault evaluates four context dimensions to make dynamic security decisions:

### **Temporal Context**
- Time of day and business hours
- Emergency periods vs normal operations
- Shift patterns and typical access times

### **Spatial Context**
- Network location and IP geolocation
- Hospital internal vs external access
- Trusted vs untrusted locations

### **Device Context**
- Device fingerprint and registration status
- Corporate vs personal devices
- New device detection and response

### **Behavioral Context**
- User access pattern analysis
- Typical workflow sequences
- Anomaly detection and risk scoring

## **🎯 Demonstration Scenarios**

### **Scenario 1: Nurse After-Hours Access**
Demonstrates how context restrictions prevent unauthorized access during off-hours while allowing emergency work.

### **Scenario 2: External Doctor Access**
Shows context-triggered MFA and restricted functionality when accessing from outside the hospital network.

### **Scenario 3: Insider Threat Detection**
Illustrates how behavioral analysis identifies suspicious access patterns even with valid credentials.

### **Scenario 4: Emergency Override**
Demonstrates controlled break-glass access during critical patient care situations.

## **🔍 Security Testing**

The project includes comprehensive security testing:

- **Unit Tests:** Jest for individual component testing
- **Integration Tests:** API endpoint testing with security validation
- **Penetration Testing:** Simulated attack scenarios
- **Usability Testing:** Medical workflow compatibility assessment
- **Performance Testing:** Security feature impact analysis

## **📈 Future Roadmap**

### **Phase 1 (Current)**
- Core CAAC implementation
- Basic healthcare data management
- Educational demonstration framework

### **Phase 2 (Planned)**
- Machine learning for anomaly detection
- Mobile application support
- Advanced biometric authentication
- Blockchain-based audit trails

### **Phase 3 (Future)**
- Predictive threat intelligence
- Automated compliance reporting
- Cross-institution data sharing protocols

## **📝 Academic Use**

This project is ideal for:
- Computer Science/Software Engineering students
- Cybersecurity research and education
- Healthcare IT security training
- Academic project demonstrations

## **⚠️ Important Notes**

- **Educational Purpose:** This is a demonstration system, not production-ready software
- **No Real Data:** Use only synthetic data for testing
- **Security Research:** Intended for defensive security education
- **Compliance:** While designed with HIPAA principles, consult experts for production use

## **📄 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **🙏 Acknowledgments**

- Inspired by real-world healthcare security challenges
- Built with guidance from cybersecurity best practices
- Thanks to the open-source community for invaluable tools and libraries
- Special thanks to academic advisors for their support and guidance

---

**"Security is not a product, but a process."** - Bruce Schneier

*MedVault demonstrates how intelligent, adaptive security processes can protect healthcare data in our increasingly digital world.*

---

<div align="center">

</div>
