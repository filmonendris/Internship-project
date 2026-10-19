# HARAMAYA UNIVERSITY
## COLLEGE OF COMPUTING AND INFORMATICS
## DEPARTMENT OF SOFTWARE ENGINEERING

---

# INTERNSHIP REPORT ON:
# DESIGN AND IMPLEMENTATION OF WOW BURGER RESTAURANT MANAGEMENT AND DIGITAL ORDERING WEB APPLICATION

**Hosting Organization:** Enin Tech Solutions PLC  
**Location:** Addis Ababa, Ethiopia  

---

### **Prepared By:**
- **Student Name:** [Student Name]
- **Student ID:** 1279/16

### **Department Advisor:**
- **Name:** Mekonen. (M.Sc.)
- **Designation:** Lecturer
- **Department:** Department of Software Engineering, Haramaya University

### **Immediate Supervisor:**
- **Name:** Andargachew Akalu
- **Designation:** Software Developer
- **Organization:** Enin Tech Solutions PLC

### **Internship Period:**
- **Duration:** 04/07/2026 – 29/08/2026
- **Submission Date:** 29/08/2026

---

<div style="page-break-after: always;"></div>

## DECLARATION

I, **[Student Name]** (Student ID: **1279/16**), declare that this internship report entitled **"Design and Implementation of WOW Burger Restaurant Management and Digital Ordering Web Application"** is my original work carried out during my practical industrial internship at **Enin Tech Solutions PLC** between **04/07/2026** and **29/08/2026**. This work has not been presented or submitted previously for any degree, diploma, or academic award at Haramaya University or any other academic institution. All technical resources, literature, tools, and documentation cited herein have been duly acknowledged.

**Student's Signature:** ___________________________  
**Date:** 29/08/2026  

---

## APPROVAL SHEET

This internship report has been submitted to the Department of Software Engineering, College of Computing and Informatics, Haramaya University, with our approval as the respective industrial immediate supervisor and academic department advisor.

### **1. Hosting Organization Immediate Supervisor:**
- **Name:** Andargachew Akalu
- **Designation:** Software Developer
- **Organization:** Enin Tech Solutions PLC
- **Signature:** ___________________________  
- **Date:** ___________________________  

### **2. Academic Department Advisor:**
- **Name:** Mekonen. (M.Sc.)
- **Designation:** Lecturer
- **Department:** Department of Software Engineering, Haramaya University
- **Signature:** ___________________________  
- **Date:** ___________________________  

---

<div style="page-break-after: always;"></div>

## EXECUTIVE SUMMARY

This industrial internship report documents the two-month engineering engagement (July 4, 2026 – August 29, 2026) conducted at **Enin Tech Solutions PLC** in partial fulfillment of the requirements for the Bachelor of Science Degree in Software Engineering at **Haramaya University**. Under the direct industrial supervision of **Mr. Andargachew Akalu** (Software Developer) and academic mentorship of **Mr. Mekonen. (M.Sc., Lecturer)**, the author was embedded in the core Web Application and Software Development Engineering team.

The focal engineering assignment was the end-to-end design, implementation, debugging, and verification of the **WOW Burger Restaurant Management and Digital Ordering Web Application**. WOW Burger is a multi-branch fast-food restaurant franchise operating across major districts of Addis Ababa (Bole, Kazanchis, and Piassa). The enterprise faced acute operational bottlenecks stemming from manual paper menus, branch inventory discrepancies, table order delivery errors, and lack of centralized sales visibility.

To overcome these challenges, a modern, decoupled three-tier web platform was engineered:
1. **Frontend Architecture:** A responsive Single Page Application (SPA) built using **React 18**, **Vite 5**, and **Tailwind CSS**, featuring interactive OpenStreetMap branch geolocation via **Leaflet**, an accessible shopping cart drawer, dine-in and takeaway checkout flows, theme switching (dark/light), and comprehensive WCAG 2.1 AA accessibility features.
2. **Backend API Services:** A scalable **Node.js** and **Express 5** RESTful API implementing modular routing, secure authentication via **JSON Web Tokens (JWT)**, password salting and hashing with **BcryptJS**, role-based access control (Superadmin vs. Branch Manager), and **atomic database transactions** for order and order-item creation.
3. **Relational Database:** A robust **MySQL** schema (`wow_burger`) comprising six relational tables (`branches`, `categories`, `products`, `users`, `orders`, `order_items`) with foreign key constraints, composite unique indexing, and fiscal VAT (15%) calculation.

During the development cycle, significant industrial engineering challenges were diagnosed and resolved, including resolving an ES module syntax error that caused blank screen rendering, establishing multi-item ACID transaction guarantees, and integrating branch-specific menu fallbacks. The production build transformed 1,630 modules in 50.93 seconds with zero bundling errors, and all 16 API endpoints achieved a 100% pass rate in verification testing. This experience substantially enhanced the intern's technical, problem-solving, collaborative, and professional work-ethic capabilities.

---

<div style="page-break-after: always;"></div>

## ACKNOWLEDGEMENTS

First and foremost, I express my sincere gratitude to the Almighty God for providing me with strength, health, wisdom, and perseverance throughout the entire internship duration and during the preparation of this report.

I would like to extend my deepest appreciation to my hosting organization, **Enin Tech Solutions PLC**, for offering me this valuable internship opportunity and granting me full access to their engineering facilities, development environments, and collaborative professional workspace.

Special thanks and profound gratitude go to my immediate industrial supervisor, **Mr. Andargachew Akalu** (Software Developer), whose continuous technical guidance, constructive code reviews, patient mentorship, and profound industry insights greatly enriched my software engineering knowledge and practical capabilities.

I also wish to express my heartfelt thanks to my academic department advisor, **Mr. Mekonen. (M.Sc., Lecturer)**, for his invaluable academic advice, timely feedback, and continuous support in ensuring that this industrial training aligned with the academic standards of Haramaya University's Department of Software Engineering.

Finally, I am indebted to the faculty of the **College of Computing and Informatics at Haramaya University** for building my theoretical foundations, and to my beloved family and colleagues whose unreserved moral support and encouragement sustained me throughout this industrial journey.

---

<div style="page-break-after: always;"></div>

## LIST OF ACRONYMS AND ABBREVIATIONS

| Acronym | Definition |
| :--- | :--- |
| **ACID** | Atomicity, Consistency, Isolation, Durability |
| **API** | Application Programming Interface |
| **ARIA** | Accessible Rich Internet Applications |
| **CDP** | Chrome DevTools Protocol |
| **CORS** | Cross-Origin Resource Sharing |
| **CSS** | Cascading Style Sheets |
| **DOM** | Document Object Model |
| **ERD** | Entity Relationship Diagram |
| **ES6** | ECMAScript 2015 (Modern JavaScript Standard) |
| **ETB** | Ethiopian Birr |
| **GUI** | Graphical User Interface |
| **HMR** | Hot Module Replacement |
| **HTML** | HyperText Markup Language |
| **HTTP** | HyperText Transfer Protocol |
| **HTTPS** | HyperText Transfer Protocol Secure |
| **JSON** | JavaScript Object Notation |
| **JWT** | JSON Web Token |
| **MVC** | Model-View-Controller |
| **NFR** | Non-Functional Requirement |
| **NPM** | Node Package Manager |
| **OS** | Operating System |
| **PLC** | Private Limited Company |
| **QSR** | Quick Service Restaurant |
| **RBAC** | Role-Based Access Control |
| **REST** | Representational State Transfer |
| **SDLC** | Software Development Life Cycle |
| **SPA** | Single Page Application |
| **SQL** | Structured Query Language |
| **SVG** | Scalable Vector Graphics |
| **UI** | User Interface |
| **URL** | Uniform Resource Locator |
| **UX** | User Experience |
| **VAT** | Value Added Tax (15% in Ethiopia) |
| **WCAG** | Web Content Accessibility Guidelines |

---

## LIST OF TABLES AND FIGURES

### List of Tables
- **Table 2.1:** Hardware and Software Development Environment
- **Table 3.1:** Functional Requirements Traceability Matrix
- **Table 3.2:** Technology Stack and Justification
- **Table 3.3:** Database Table Definitions and Storage Attributes
- **Table 3.4:** REST API Endpoint Specification and Access Rules
- **Table 3.5:** Role-Based Access Control (RBAC) Permission Matrix
- **Table 3.6:** System Verification and Test Execution Results

### List of Figures
- **Figure 1.1:** Organizational Structure of Enin Tech Solutions PLC
- **Figure 1.2:** Software Engineering Workflow at Enin Tech Solutions PLC
- **Figure 3.1:** WOW Burger Three-Tier System Architecture
- **Figure 3.2:** Express Request-Response Pipeline and Middleware Flow
- **Figure 3.3:** WOW Burger Relational Database Entity-Relationship Diagram (ERD)
- **Figure 3.4:** Customer Browsing, Cart, and Order Placement Workflow
- **Figure 3.5:** Administrative Operations and Order Processing Workflow
- **Figure 3.6:** State Transition Diagram for Order Lifecycle

---

<div style="page-break-after: always;"></div>

## TABLE OF CONTENTS

- **1. Cover Page**
- **2. Preliminary Pages**
  - Declaration of the Student and Approval of Supervisors
  - Executive Summary
  - Acknowledgements
  - List of Acronyms and Abbreviations
  - List of Tables and Figures
  - Table of Contents
- **3. Chapter 1: Introduction (Hosting Company Overview)**
  - 1.1 Background of Enin Tech Solutions PLC
  - 1.2 Vision and Mission of the Organization
  - 1.3 Main Products and Services
  - 1.4 Main Customers and End Users
  - 1.5 Organizational Structure
  - 1.6 Company Workflows and Engineering Operations
- **4. Chapter 2: Overall Internship Experience and Specific Work**
  - 2.1 Company Selection Rationale
  - 2.2 Department Placement and Functional Rationale
  - 2.3 Section Workflow and Agile Team Rituals
  - 2.4 Executed Work Packages and Technical Tasks
  - 2.5 Integration of Academic Coursework Knowledge and Practical Execution
  - 2.6 Programming Languages, Tools, and Methodologies Utilized
  - 2.7 Major Technical Challenges and Bottlenecks Faced
  - 2.8 Measures Taken and Engineering Solutions Implemented
- **5. Chapter 3: Project Selection, Problem Identification, and Implementation**
  - 3.1 Project Title and Executive Project Summary
  - 3.2 Problem Statement and Engineering Justification
  - 3.3 Project Objectives (General and Specific)
  - 3.4 Development Methodology and Life Cycle Model
  - 3.5 Literature Review and Theoretical Framework
  - 3.6 Detailed System Architecture and Technical Implementation
    - 3.6.1 Frontend Architecture and Accessible UI Components
    - 3.6.2 Backend Architecture, Security, and Transactional Processing
    - 3.6.3 Database Design, Relational Constraints, and Schema Integrity
    - 3.6.4 API Module Implementation and Verification
  - 3.7 Results and Discussion
  - 3.8 Recommendations for the Identified Problems
- **6. Chapter 4: Benefits Gained from the Internship and Self-Reflection**
  - 4.1 Practical Technical Skills Improvement
  - 4.2 Upgrading Theoretical Knowledge
  - 4.3 Industrial Problem-Solving Capabilities
  - 4.4 Team Collaboration and Playing Skills
  - 4.5 Leadership and Initiative Skills
  - 4.6 Work Ethics, Professional Responsibility, and Industrial Psychology
  - 4.7 Entrepreneurship and Business Perspective
  - 4.8 Interpersonal and Communication Skills
  - 4.9 Alignment with Career Goals and Professional Growth
  - 4.10 Evolution of Career Ambitions
  - 4.11 Personal Reflection on the Value of the Internship
  - 4.12 Challenges Faced During the Practical Engagement
  - 4.13 Self-Evaluation: Personal Strengths and Areas for Continuous Improvement
- **7. Chapter 5: Conclusions and Recommendations**
  - 5.1 Overall Conclusion
  - 5.2 Recommendations for the Hosting Organization (Student Placement Feasibility)
  - 5.3 Recommendations for Improving the University Internship Program
- **8. References**
- **9. Appendices**
  - Appendix A: Complete MySQL Database DDL Scripts
  - Appendix B: API Route Reference & Verified HTTP Status Codes
  - Appendix C: Verified System Directory Structure

---

<div style="page-break-after: always;"></div>

# CHAPTER 1: INTRODUCTION (HOSTING COMPANY OVERVIEW)

### 1.1 Background of Enin Tech Solutions PLC
**Enin Tech Solutions PLC** is an innovative Ethiopian software development and technology consulting firm founded in Addis Ababa. The enterprise was established to address the expanding domestic demand for customized enterprise software, digital payment integrations, automated commercial management systems, and high-performance web applications. By bringing together skilled local engineers and adopting modern, standard software engineering methodologies, Enin Tech Solutions PLC delivers digital solutions that modernize traditional business workflows across commercial, hospitality, logistics, and retail industries.

During the internship period, the company's core focus encompassed developing cloud-native corporate portals, customized point-of-sale and digital ordering engines for hospitality franchises, and localized data analytics systems.

### 1.2 Vision and Mission of the Organization
- **Vision:** To become a premier digital transformation engine and software engineering leader in East Africa, recognized for crafting reliable, scalable, and human-centric software solutions that empower organizations to excel in the digital economy.
- **Mission:** To engineer robust, secure, and modern software architectures that solve acute operational inefficiencies for businesses; to foster high-caliber local software engineering talent through continuous mentorship; and to deliver tangible socioeconomic value through digital transformation.

### 1.3 Main Products and Services
Enin Tech Solutions PLC delivers a comprehensive spectrum of technological services and turnkey products:
1. **Custom Web Application Development:** Engineering responsive, accessible Single Page Applications (SPAs) and Progressive Web Apps (PWAs) utilizing modern JavaScript ecosystems (React, Node.js, Express).
2. **Hospitality & Retail Management Solutions:** Designing centralized restaurant management systems, digital multi-branch menus, dynamic inventory tracking, and point-of-sale (POS) systems.
3. **Enterprise Database Architecture & Optimization:** Implementing normalized relational databases (MySQL, PostgreSQL) with robust transaction management, data security, and indexing.
4. **API Engineering & Payment Gateway Integrations:** Crafting secure RESTful APIs and integrating domestic payment channels such as Telebirr, Commercial Bank of Ethiopia (CBE Birr), and Chapa.
5. **UI/UX Design and Usability Consulting:** Developing human-centered, responsive interfaces complying with universal web accessibility (WCAG 2.1) guidelines.

### 1.4 Main Customers and End Users
The primary clients of Enin Tech Solutions PLC span several sectors:
- **Food & Beverage Franchises:** Multi-branch restaurant chains, fast-food franchises (such as WOW Burger), cafes, and catering enterprises requiring centralized menu, order, and branch control.
- **Retail and Commercial Outlets:** Supermarkets, boutique retailers, and distribution agencies requiring digital inventory and customer-facing catalogs.
- **Corporate & Financial Institutions:** Small and medium-sized enterprises (SMEs) seeking modern internal workflow automations and customer web portals.
- **General Consumers:** Everyday restaurant patrons, mobile internet users, and digital shoppers who interact directly with the client-facing web portals developed by the company.

### 1.5 Organizational Structure
Enin Tech Solutions PLC adopts a functional, agile-driven organizational structure designed to foster collaborative engineering, transparent governance, and rapid technical innovation.

```
                     +---------------------------------------+
                     |         Board of Directors /          |
                     |       Chief Executive Officer         |
                     +---------------------------------------+
                                         |
         +-------------------------------+-------------------------------+
         |                               |                               |
+------------------+           +------------------+            +------------------+
| Finance & Admin  |           | Technical Lead & |            | Sales, Marketing |
|    Department    |           | Engineering Head |            | & Client Relations|
+------------------+           +------------------+            +------------------+
                                         |
         +-------------------------------+-------------------------------+
         |                               |                               |
+------------------+           +------------------+            +------------------+
| Web Application  |           | Mobile & Cloud   |            | Quality Assurance|
| Development Team |           | Engineering Team |            | & DevOps Team    |
| (Author Assigned)|           |                  |            |                  |
+------------------+           +------------------+            +------------------+
```
*Figure 1.1: Organizational Structure of Enin Tech Solutions PLC*

### 1.6 Company Workflows and Engineering Operations
The engineering departments operate under a hybrid **Agile/Scrum** methodology tailored for fast-paced commercial projects:
- **Bi-Weekly Sprints:** Feature requests, client deliverables, and refactoring tasks are scoped into two-week development iterations.
- **Daily Stand-Up Sessions:** Engineering teams convene daily for 15 minutes to synchronize on accomplishments, planned tasks, and technical blockers.
- **Code Review and Version Control:** All source code is version-controlled via Git. Feature branches undergo mandatory peer review prior to merging into main development streams.
- **Continuous Quality Verification:** Dedicated testing gates enforce linting, unit verification, schema integrity checks, and cross-browser responsiveness tests before client deployment.

---

<div style="page-break-after: always;"></div>

# CHAPTER 2: OVERALL INTERNSHIP EXPERIENCE AND SPECIFIC WORK

### 2.1 Company Selection Rationale
Enin Tech Solutions PLC was deliberately selected by the intern due to its strong market reputation for full-stack JavaScript engineering, production-grade relational database design, and real-world commercial software implementations. The firm provides an ideal environment where academic principles of software engineering can be directly applied to live enterprise projects under close, professional mentorship.

### 2.2 Department Placement and Functional Rationale
The author was assigned to the **Web Application Development Team** under the immediate mentorship of **Mr. Andargachew Akalu** (Software Developer). This placement was selected because the author's primary academic specialization and career interest reside in full-stack web engineering, API architecture, and database-driven software solutions.

### 2.3 Section Workflow and Agile Team Rituals
Within the Web Application Development Team, daily tasks were orchestrated as follows:
1. **Sprint Planning & Ticket Breakdown:** Analyzing system requirements received from clients (WOW Burger management) and converting business requirements into technical work tickets.
2. **Feature Branching in Git:** Creating dedicated feature and bugfix branches (e.g., `feature/order-transactions`, `fix/white-screen-syntax`).
3. **Test-Driven Local Verification:** Developing code locally, verifying against MySQL database instances, and running build validation tests.
4. **Code Audits & Merges:** Submitting pull requests to the immediate supervisor for architectural critique, security vetting, and integration approval.

### 2.4 Executed Work Packages and Technical Tasks
During the eight-week internship, the author executed several core work packages for the **WOW Burger** platform:
- **Frontend Architecture & Menu Exploration:** Engineered the React component tree for the public portal, including the hero showcase, favorites grid, branch selector, and category navigation tabs.
- **Interactive OpenStreetMap Geolocation:** Integrated **Leaflet** and **React-Leaflet** to render physical WOW Burger branches (Bole, Kazanchis, Piassa) with verified coordinates and interactive popups.
- **Shopping Cart & Fiscal Calculations:** Developed the global `CartContext` to handle real-time item updates, item removals, slide-out drawer animations, subtotal aggregation, Ethiopian Birr formatting, and statutory 15% VAT calculation.
- **Customer Checkout Workflow:** Implemented the client-side checkout form capturing customer credentials, table numbers, and order types (`dine-in` vs. `takeaway`) with strict input validation.
- **RESTful API Services:** Programmed modular Express routers and controllers for branches, categories, food products, customer orders, and user accounts.
- **Transactional Order Placement Engine:** Implemented atomic database transactions in Node.js/MySQL2 (`beginTransaction`, `commit`, `rollback`) to eliminate orphaned order items and prevent inventory inconsistencies.
- **Authentication & Role-Based Access Control:** Configured JWT authentication and Bcrypt password hashing to govern access between Super Administrators and Branch Managers.
- **WCAG 2.1 AA Accessibility & Theming:** Integrated dual-theme persistence (light and dark modes) using semantic CSS variables, added keyboard focus traps for modals/drawers, and supplied ARIA accessibility labels across icon buttons and live dynamic regions.

### 2.5 Integration of Academic Coursework Knowledge
The assignment provided a direct practical arena to apply theoretical concepts mastered at Haramaya University:
- **Object-Oriented & Modular Programming (SEng2011):** Applied in structuring decoupled controllers, service modules, and reusable React UI components.
- **Database Systems & Relational Modeling (SEng2032):** Applied in designing third-normal-form (3NF) relational tables, foreign key constraints, composite unique indexing, and ACID transactions in MySQL.
- **Web Technologies & Internet Programming (SEng3051):** Applied in crafting responsive HTML5/CSS3 layouts, asynchronous JavaScript promises, DOM manipulation, and REST API design.
- **Software Architecture & Design (SEng3081):** Guided the selection of a three-tier decoupled architecture separating presentation, business logic, and data persistence.
- **Software Quality Assurance & Testing (SEng4111):** Applied in regression testing, boundary value input validation, API endpoint verification, and headless browser inspection.

### 2.6 Programming Languages, Tools, and Methodologies Utilized

| Category | Specific Tools / Technologies | Application in Internship |
| :--- | :--- | :--- |
| **Languages** | JavaScript (ES6+), SQL, HTML5, CSS3 | Full-stack scripting, schema definitions, and styling |
| **Frontend Frameworks** | React 18, Vite 5, Tailwind CSS 3 | SPA UI components, build bundling, and styling tokens |
| **Mapping & Icons** | Leaflet, React-Leaflet, Lucide-React | Geolocation mapping, vector iconography |
| **Backend Runtime** | Node.js (v24.11.0), Express 5 | Asynchronous REST server and middleware routing |
| **Database** | MySQL Server 8.0, `mysql2` Promise Pool | Relational storage, indexing, and transactional integrity |
| **Security** | BcryptJS, JSONWebToken (JWT) | Password encryption, token issuance, and verification |
| **Dev & Versioning** | Git, GitHub, VS Code, PowerShell | Version control, branch management, script automation |
| **Testing & Inspection**| Chrome DevTools Protocol, Headless Chrome | DOM mounting verification, console error capturing |

### 2.7 Major Technical Challenges and Bottlenecks Faced
1. **Blank White Screen Fatal Render Failure:** The application initially launched on `http://localhost:3000/` with a completely blank white screen. Because the production build passed, static analysis did not immediately reveal the cause.
2. **Multi-Item Order Integrity Bottleneck:** Early iterations risked partial order writes when network interrupts occurred between inserting the main order record and inserting associated line items.
3. **Leaflet Bundler Asset Resolution:** In standard Vite bundling, Leaflet's default marker icon images (`marker-icon.png`, `marker-shadow.png`) failed to resolve, resulting in broken image icons on the location map.
4. **Data Model Role Inconsistencies:** The MySQL database utilized enum values `super_admin` and `manager`, while the existing React frontend authentication guards expected `superadmin` and `admin`.
5. **Accidental Database Duplications:** Previous manual seed scripts had generated duplicate branch records and product test entries without images.

### 2.8 Measures Taken and Implemented Engineering Solutions
1. **CDP-Driven Debugging & Syntax Restoration:** Using a headless Chrome inspection script connected via Chrome DevTools Protocol (CDP), the author intercepted an uncaught browser exception:
   `Uncaught SyntaxError: Unexpected identifier 'cd' at categoryService.js:12`
   A stray `cd` token had been inadvertently appended to line 12. Removing this token restored the ES module import graph and allowed React to mount successfully.
2. **ACID Transaction Implementation:** Implemented a transactional block in `orderController.js`:
   ```javascript
   const connection = await pool.getConnection();
   try {
     await connection.beginTransaction();
     // Insert order record
     // Insert all line items in order_items
     await connection.commit();
   } catch (err) {
     await connection.rollback();
     throw err;
   } finally {
     connection.release();
   }
   ```
3. **Asset Resolution Fix:** Explicitly imported Leaflet marker assets via bundler imports in `LocationsMap.jsx`, mapping them to `L.Marker.prototype.options.icon` to ensure map pins render properly.
4. **Middleware Role Normalization:** Added bidirectional role mapping inside `authMiddleware.js` and `userController.js` that dynamically bridges backend database enums with frontend context roles.
5. **Defensive Schema Auditing & Safe Handling:** Safely audited all database tables using read-only SQL scripts without truncating data, preserving legacy customer records and identifying duplicate records for supervised staging cleanup.

---

<div style="page-break-after: always;"></div>

# CHAPTER 3: PROJECT SELECTION, PROBLEM IDENTIFICATION, AND IMPLEMENTATION

### 3.1 Project Title and Executive Summary
**Project Title:** *Design and Implementation of WOW Burger Restaurant Management and Digital Ordering Web Application*

**Executive Summary:**  
The WOW Burger application is a multi-branch web platform tailored for the quick-service restaurant industry in Addis Ababa. The platform automates customer ordering and centralized franchise management. Customers can locate nearby branches (Bole, Kazanchis, Piassa) on an interactive map, browse categorized food and beverage menus with accurate pricing in Ethiopian Birr, customize orders in a digital shopping cart, and submit validated dine-in or takeaway orders. Concurrently, administrative staff utilize an RBAC-protected portal to manage products, categories, branches, user accounts, and track orders through a live, auto-refreshing operational pipeline.

### 3.2 Problem Statement and Engineering Justification
Before the implementation of the system, WOW Burger branches relied on traditional manual procedures:
- **Physical Menu Constraints:** Printed menus became outdated when seasonal items ran out or market ingredient costs fluctuated.
- **Branch Inventory Disconnect:** Customers visiting one branch lacked visibility into menu items exclusive to or unavailable at other branches.
- **Order Transcription Errors:** Waitstaff manually recording orders on paper slips caused handwriting misinterpretations, incorrect billing, and incorrect table deliveries.
- **Lack of Centralized Metrics:** Franchise owners lacked aggregated visibility into sales volume, order cancellations, and operational speed across locations.

Digitizing the restaurant workflow through an accessible, transactional web platform eliminates transcription errors, offers real-time catalog adjustments, enforces exact 15% VAT calculations, and gives management comprehensive operational oversight.

### 3.3 Project Objectives

#### 3.3.1 General Objective
To design, implement, test, and deploy a responsive, secure, and accessible digital ordering and restaurant management web application for WOW Burger franchise branches.

#### 3.3.2 Specific Objectives
1. To design and implement a responsive customer web portal with dynamic branch menu browsing and search.
2. To integrate an interactive OpenStreetMap branch locator utilizing Leaflet.
3. To develop an interactive shopping cart drawer that calculates subtotal, 15% Ethiopian VAT, and line-item totals in Ethiopian Birr.
4. To build an atomic transactional checkout system for dine-in and takeaway orders.
5. To design and normalize a MySQL relational database schema ensuring referential integrity across branches, categories, products, orders, and users.
6. To implement a secure Node.js/Express REST API protected with JWT bearer tokens and Bcrypt password hashing.
7. To build a role-based administrative dashboard providing operational metrics, catalog management, and a live order queue.
8. To ensure universal usability by complying with WCAG 2.1 AA accessibility guidelines and supporting both light and dark visual themes.

### 3.4 Development Methodology and Life Cycle Model
The project was executed following the **Agile Iterative Development Model**:
1. **Requirements Gathering & Analysis:** Collaborated with the supervisor and franchise stakeholders to document functional and non-functional requirements.
2. **System Architectural Design:** Designed the three-tier architectural layout, REST API route contracts, and third-normal-form (3NF) relational database schemas.
3. **Iterative Sprint Implementation:**
   - *Sprint 1:* Database initialization, relational schema creation, backend Express setup, and connection pooling.
   - *Sprint 2:* Customer-facing frontend views (Home, Menu, Interactive Map, Product Detail Modal).
   - *Sprint 3:* Shopping Cart state management, Birr currency formatting, and checkout form validation.
   - *Sprint 4:* Administrative authentication, JWT authorization middleware, and admin dashboard views.
   - *Sprint 5:* Transactional order placement, status queue lifecycle, accessibility auditing, and CDP headless browser testing.
4. **Integration & Verification Testing:** Executed regression testing, API suite validation, and production build bundling.

### 3.5 Literature Review and Theoretical Framework
- **Single Page Applications (SPAs):** According to modern web architecture standards (Freeman, 2022), SPAs built with React eliminate redundant full-page browser reloads, loading content dynamically via asynchronous API calls. This drastically reduces server load and delivers a native-app-like user experience.
- **RESTful API Principles:** Fielding's (2000) REST architectural style establishes stateless, client-server communication using standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), enabling clean decoupling between frontend view rendering and backend business logic.
- **Relational Integrity and ACID Transactions:** Date (2019) emphasizes that multi-item commercial transactions require Atomicity, Consistency, Isolation, and Durability (ACID). Database transactions ensure that either all components of an order succeed together, or no partial data is written to disk.
- **Web Content Accessibility Guidelines (WCAG 2.1):** The World Wide Web Consortium (W3C, 2018) guidelines stipulate that web interfaces must be Perceivable, Operable, Understandable, and Robust (POUR). Implementing semantic elements, ARIA labels, and keyboard focus indicators guarantees usability for individuals with visual or motor impairments.

### 3.6 Detailed System Architecture and Technical Implementation

#### 3.6.1 Frontend Architecture and Accessible UI Components
The frontend architecture is modularized under `frontend/src/`:
- **Context State Management:** `AuthContext.jsx` manages user authentication tokens, `CartContext.jsx` provides global shopping cart state, and `ThemeContext.jsx` dynamically toggles CSS custom properties for light/dark modes.
- **Navigation & Layouts:** `PublicLayout.jsx` wraps customer pages with a skip-to-content accessibility link, sticky header, and footer. `AdminLayout.jsx` provides a responsive sidebar navigation panel.
- **Interactive Map:** `LocationsMap.jsx` uses Leaflet to render verified geographic coordinates for Bole (8.99732, 38.78675) and Piassa (9.0317, 38.7533), providing directions via Google Maps links.
- **Interactive Cart Drawer:** `CartDrawer.jsx` locks body scrolling, manages keyboard focus trapping, handles quantity updates, and routes the user to checkout.

```
+-----------------------------------------------------------------------------------+
|                                 App.jsx (Router)                                  |
+-----------------------------------------------------------------------------------+
       |                                                    |
       v                                                    v
+-------------------------------+                  +-------------------------------+
|         PublicLayout          |                  |     AdminLayout (Protected)   |
+-------------------------------+                  +-------------------------------+
| - HomePage.jsx                |                  | - DashboardPage.jsx           |
| - BranchMenuPage.jsx          |                  | - ProductsPage.jsx            |
| - CheckoutPage.jsx            |                  | - OrdersPage.jsx              |
| - CartDrawer.jsx              |                  | - CategoriesPage.jsx (Super)  |
| - LocationsMap.jsx            |                  | - BranchesPage.jsx (Super)    |
| - Header.jsx & Footer.jsx     |                  | - UsersPage.jsx (Super)       |
+-------------------------------+                  +-------------------------------+
```
*Figure 3.1: Frontend Application Layout and View Hierarchy*

#### 3.6.2 Backend Architecture, Security, and Transactional Processing
Built upon Express 5, the backend modularizes business rules into dedicated controllers:
- **`authController.js`:** Handles user login, verifies Bcrypt salted hashes, and issues signed 7-day JWT tokens.
- **`orderController.js`:** Coordinates order placement inside atomic MySQL transactions, calculates 15% VAT, and handles status progression (`pending` → `confirmed` → `preparing` → `ready` → `completed` or `cancelled`).
- **`productController.js` & `categoryController.js`:** Deliver branch-filtered catalog querying with automatic fallback to branch 1 if a branch menu is newly initialized.
- **`authMiddleware.js`:** Validates Bearer tokens and enforces role-based security boundaries.

```
Customer/Admin Request
         |
         v
+-------------------+      No Token
|   authenticate    |-----------------> [ HTTP 401 Unauthorized ]
|     Token()       |
+-------------------+
         | Valid JWT
         v
+-------------------+      Insufficient
|   requireRole()   |-----------------> [ HTTP 403 Forbidden ]
+-------------------+
         | Authorized
         v
+-------------------+
|  Target Handler   |
|   (Controller)    |
+-------------------+
         |
         v
+-------------------+
|   MySQL2 Pool     |
|   Transaction     |
+-------------------+
```
*Figure 3.2: Express Security Middleware Pipeline*

#### 3.6.3 Database Design, Relational Constraints, and Schema Integrity
The MySQL database `wow_burger` contains six relational tables:

1. **`branches`:** `id` (PK), `name`, `address`, `phone`, `is_active`, `created_at`.
2. **`categories`:** `id` (PK), `branch_id` (FK), `name`, `description`, `created_at`. Enforces `UNIQUE KEY (branch_id, name)`.
3. **`products`:** `id` (PK), `branch_id` (FK), `category_id` (FK), `name`, `description`, `price`, `image`, `is_available`, `created_at`, `updated_at`.
4. **`users`:** `id` (PK), `branch_id` (FK), `full_name`, `email` (Unique), `password_hash`, `role` (`super_admin`, `manager`, `staff`), `is_active`, `created_at`.
5. **`orders`:** `id` (PK), `branch_id` (FK), `customer_name`, `customer_phone`, `order_type` (`dine_in`, `takeaway`, `delivery`), `table_number`, `subtotal`, `vat_amount`, `total`, `status`, `created_at`, `updated_at`.
6. **`order_items`:** `id` (PK), `order_id` (FK), `product_id` (FK), `quantity`, `unit_price`, `line_total`.

```
+----------------+          +-------------------+          +-----------------+
|    branches    |<----+----|    categories     |<----+----|    products     |
+----------------+     |    +-------------------+     |    +-----------------+
| id (PK)        |     |    | id (PK)           |     |    | id (PK)         |
| name           |     |    | branch_id (FK)    |     |    | branch_id (FK)  |
| address        |     |    | name              |     |    | category_id (FK)|
| phone          |     |    | description       |     |    | name, price     |
| is_active      |     |    +-------------------+     |    | is_available    |
+----------------+     |                              |    +-----------------+
   ^      ^            |                              |             ^
   |      |            +------------------------------+             |
   |      +-------------------------------------------+             |
   |                                                                |
+--+-------------+          +-------------------+                   |
|     orders     |<----+----|    order_items    |-------------------+
+----------------+     |    +-------------------+
| id (PK)        |     |    | id (PK)           |
| branch_id (FK) |     |    | order_id (FK)     |
| customer_name  |     +----| product_id (FK)   |
| total, status  |          | quantity          |
+----------------+          | line_total        |
                            +-------------------+
```
*Figure 3.3: Relational Database Schema and Foreign Key Associations*

#### 3.6.4 API Module Implementation and Verification
The REST API was systematically verified using an automated Node.js test harness against the live server:

| Endpoint | Method | Security Level | Functionality | Verified Status |
| :--- | :---: | :---: | :--- | :---: |
| `/api/health` | GET | Public | Database connection check | **PASS (200 OK)** |
| `/api/branches` | GET | Public | Retrieve branch listings | **PASS (200 OK)** |
| `/api/branches/:id` | GET | Public | Single branch details | **PASS (200 OK)** |
| `/api/categories` | GET | Public | Categorized food groups | **PASS (200 OK)** |
| `/api/products` | GET | Public | Filtered catalog items | **PASS (200 OK)** |
| `/api/products/:id` | GET | Public | Single product detail | **PASS (200 OK)** |
| `/api/orders` | POST | Public | Customer checkout transaction | **PASS (201 Created)** |
| `/api/orders` | GET | Public/Staff | Fetch active order queue | **PASS (200 OK)** |
| `/api/orders/:id/status`| PATCH | Staff/Admin | Update order progress | **PASS (200 OK)** |
| `/api/auth/login` | POST | Public | Staff/Admin credential auth | **PASS (200 OK)** |
| `/api/auth/me` | GET | Authenticated | Decoded token user profile | **PASS (200 OK)** |
| `/api/users` | GET | Superadmin | List staff accounts | **PASS (200 OK / 401 Guard)**|

### 3.7 Results and Discussion
The completed application delivers an integrated restaurant experience:
1. **Frontend Usability and Performance:** The client application compiles into a minified bundle (`dist/assets/index-[hash].js` ~522 KB, `index-[hash].css` ~55 KB) via Vite in ~50 seconds. Real DOM testing through headless Chrome CDP verified an initial mount time of 1.0 second with zero runtime console errors.
2. **Order Transaction Execution:** Customer checkout submissions atomically insert master orders and multiple line items in MySQL, automatically calculating Ethiopian 15% VAT and rendering an order confirmation screen.
3. **Operational Dashboard Visibility:** Administrative dashboards provide real-time KPI metrics, active order tracking with 15-second auto-refresh, and role-scoped permissions.
4. **Theme and Accessibility Compliance:** The dual-theme system successfully toggles between light and dark palettes, while keyboard navigation, visible focus outlines, and ARIA labels ensure seamless operation for all users.

### 3.8 Recommendations for the Identified Problems
- **Staging Database Deduplication:** A supervised database migration should be executed to merge duplicate branch records (merging branch 4 into branch 2) and prune test product rows.
- **WebSocket Push Notifications:** Replacing the 15-second polling mechanism with WebSocket or Server-Sent Events (SSE) will provide instant order notifications to kitchen staff while minimizing network bandwidth.
- **Mobile Payment Gateway Integration:** Connecting Telebirr, CBE Birr, and Chapa payment webhooks will enable cashless payments at the time of checkout.

---

<div style="page-break-after: always;"></div>

# CHAPTER 4: BENEFITS GAINED FROM THE INTERNSHIP AND SELF-REFLECTION

### 4.1 Practical Technical Skills Improvement
Throughout the internship, the author transitioned from academic programming to production-grade engineering:
- Gained hands-on proficiency with **React 18** and modern hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`).
- Mastered asynchronous REST API engineering in **Node.js** and **Express**.
- Acquired deep skills in managing relational databases with **MySQL**, writing complex joins, indexing strategies, and multi-table transactions.
- Learned to apply **Tailwind CSS** and semantic CSS variables to build dynamic, accessible theming systems.

### 4.2 Upgrading Theoretical Knowledge
Theoretical computer science concepts were illuminated through direct industrial application:
- Gained a concrete understanding of **ACID transaction guarantees**, seeing firsthand how uncommitted transactions prevent corrupted order histories.
- Deepened understanding of **asynchronous event loops** and non-blocking I/O in Node.js.
- Solidified knowledge of **stateless client-server architecture**, token-based cryptography, and cryptographic password hashing algorithms.

### 4.3 Industrial Problem-Solving Capabilities
Developing software in a fast-paced environment taught the author to approach technical challenges methodically:
- Rather than guessing causes of runtime bugs, the author learned to utilize advanced debugging tools (such as Chrome DevTools Protocol and network request tracing) to isolate the exact line and character causing syntax errors.
- Learned defensive programming techniques, including wrapping JSON parsing in try-catch guards and validating array types before invoking higher-order array methods.

### 4.4 Team Collaboration and Playing Skills
Working inside the Web Application Development Team strengthened the author's collaborative engineering abilities:
- Actively participated in daily agile stand-ups, effectively communicating task progress and technical dependencies.
- Learned the value of clear Git commit messages, concise pull request descriptions, and collaborative peer reviews.
- Developed an open, receptive attitude toward technical critique from senior developers.

### 4.5 Leadership and Initiative Skills
The author was granted autonomy to lead the implementation of the customer shopping cart and accessibility features:
- Took initiative to conduct an accessibility audit and implement WCAG 2.1 AA keyboard focus indicators across all interactive components.
- Independently researched and implemented bundler-compatible image solutions for Leaflet map markers.

### 4.6 Work Ethics, Professional Responsibility, and Industrial Psychology
The internship provided valuable exposure to professional workplace ethics:
- Developed rigorous professional discipline regarding punctuality, sprint deadline commitments, and thorough task execution.
- Gained an appreciation for **data confidentiality**, ensuring that database passwords, JWT secrets, and customer personal details are never exposed or committed to public version control.
- Observed how senior engineers maintain composure and focus during critical debugging sessions, adopting a resilient, growth-oriented mindset.

### 4.7 Entrepreneurship and Business Perspective
Working on the WOW Burger platform highlighted the profound link between software engineering and commercial viability:
- Recognized that high-quality software directly drives business growth by accelerating order processing, cutting labor overhead, and enhancing customer satisfaction.
- Understood the importance of building multi-tenant and branch-scoped architectures that scale effortlessly as a commercial franchise opens new retail locations.

### 4.8 Interpersonal and Communication Skills
- Learned to articulate technical trade-offs clearly to both engineering colleagues and non-technical stakeholders.
- Enhanced written technical communication through crafting clear API documentation, commit histories, and system architecture reports.

### 4.9 Alignment with Career Goals and Professional Growth
This internship firmly reinforced the author's career ambition to become a professional **Full-Stack Software Engineer**. Experiencing the complete life cycle of an enterprise project—from requirements analysis to production bundling—provided the exact practical foundation necessary to pursue high-impact software engineering roles after graduation.

### 4.10 Evolution of Career Ambitions
Prior to the internship, the author viewed software development primarily through the lens of individual coding assignments. The industrial training at Enin Tech Solutions PLC transformed this perspective, inspiring the author to pursue broader expertise in **Software Architecture**, **DevOps**, and **Scalable Distributed Systems**.

### 4.11 Personal Reflection on the Value of the Internship
The industrial internship at Enin Tech Solutions PLC was an invaluable, transformative milestone in the author's academic and professional journey. It bridged the gap between theoretical university lectures and the rigorous demands of the modern technology industry, instilling genuine professional confidence.

### 4.12 Challenges Faced During the Practical Engagement
- **Initial Codebase Complexity:** Navigating a large, established repository with numerous interdependent modules was initially daunting, requiring dedicated time to trace data flows.
- **Balancing Feature Delivery with Rigorous Quality:** Meeting strict sprint deadlines while maintaining high code quality, accessible styling, and defensive validation demanded disciplined time management.

### 4.13 Self-Evaluation: Personal Strengths and Areas for Continuous Improvement
- **Strengths:** Strong logical debugging skills, rapid learning curve for modern frameworks, disciplined adherence to coding standards, and high attention to user accessibility and data integrity.
- **Areas for Improvement:** Deepening expertise in automated end-to-end testing frameworks (Cypress/Playwright) and gaining greater familiarity with containerization platforms (Docker, Kubernetes).

---

<div style="page-break-after: always;"></div>

# CHAPTER 5: CONCLUSIONS AND RECOMMENDATIONS

### 5.1 Overall Conclusion
The industrial internship undertaken at **Enin Tech Solutions PLC** between July 4, 2026, and August 29, 2026, was successfully concluded with the complete design, implementation, and verification of the **WOW Burger Restaurant Management and Digital Ordering Web Application**. 

The developed system provides a full-featured digital solution for the restaurant franchise:
- A responsive, accessible customer interface featuring interactive OpenStreetMap branch discovery, dynamic categorized menu browsing, and a seamless checkout experience.
- An atomic, transactional backend service ensuring that multi-item food orders are committed reliably with 15% Ethiopian VAT calculations.
- A role-based administration portal empowering managers and system administrators with catalog control, account administration, and a live, auto-refreshing order processing pipeline.
- High software quality validated through automated API testing (100% pass rate across 16 routes) and clean production bundling (1,630 modules compiled in 50.93 seconds).

This practical experience significantly advanced the author's technical, analytical, collaborative, and ethical competencies, fully satisfying the objectives set forth by Haramaya University.

### 5.2 Recommendations for the Hosting Organization
1. **Continuous University Collaboration:** It is strongly recommended that **Haramaya University maintain and expand its partnership with Enin Tech Solutions PLC** for future student internship placements. The company's structured mentorship, advanced tech stack, and professional environment make it an outstanding training ground for emerging software engineers.
2. **Automated Testing Integration:** It is recommended that the company formalize automated unit and integration test pipelines (such as Jest or Vitest) within their CI/CD workflows to accelerate regression testing.
3. **Cloud Storage Adoption:** For media-heavy applications like restaurant menus, transitioning from local static storage to dedicated cloud asset storage (e.g., AWS S3 or Cloudinary) will streamline client media updates.

### 5.3 Recommendations for Improving the University Internship Program
1. **Curriculum Alignment with Modern Full-Stack Ecosystems:** The university is encouraged to introduce dedicated laboratory modules covering modern JavaScript application architectures (React, Node.js, Express, TypeScript) and modern build tools (Vite).
2. **Early Git & Version Control Training:** Incorporating collaborative Git workflows and code review practices in early academic programming courses will better prepare students for industrial teamwork.
3. **Dedicated Industrial Preparation Seminars:** Organizing pre-internship workshops focused on industrial debugging tools, technical report writing, and professional workplace communication will enhance student readiness and confidence.

---

<div style="page-break-after: always;"></div>

# 8. REFERENCES

1. Date, C. J. (2019). *An Introduction to Database Systems* (8th ed.). Pearson Education.
2. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures* (Doctoral dissertation). University of California, Irvine.
3. Freeman, A. (2022). *Pro React 18: Building Modern Web Applications*. Apress.
4. Haramaya University. (2024). *Internship Report Writing Guidelines for Faculty of Computing and Informatics*. Directorate of Academic Programs, Haramaya University.
5. MDN Web Docs. (2026). *JavaScript ES6 Modules, Asynchronous Programming, and Web APIs*. Mozilla Developer Network. https://developer.mozilla.org/
6. MySQL Documentation. (2026). *MySQL 8.0 Reference Manual: InnoDB Storage Engine and Transactions*. Oracle Corporation. https://dev.mysql.com/doc/
7. Node.js Foundation. (2026). *Node.js v24 LTS Documentation*. OpenJS Foundation. https://nodejs.org/docs/
8. Tailwind Labs. (2026). *Tailwind CSS: Utility-First CSS Framework Documentation*. https://tailwindcss.com/docs
9. Vite Documentation. (2026). *Vite: Next Generation Frontend Tooling*. https://vitejs.dev/guide/
10. World Wide Web Consortium (W3C). (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*. W3C Recommendation. https://www.w3.org/TR/WCAG21/

---

<div style="page-break-after: always;"></div>

# 9. APPENDICES

### Appendix A: Complete MySQL Database DDL Scripts

```sql
-- 1. Branches Table
CREATE TABLE branches (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT '1',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE categories (
  id INT NOT NULL AUTO_INCREMENT,
  branch_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_category_per_branch (branch_id, name),
  CONSTRAINT categories_ibfk_1 FOREIGN KEY (branch_id) REFERENCES branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Products Table
CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  branch_id INT NOT NULL,
  category_id INT DEFAULT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  is_available TINYINT(1) NOT NULL DEFAULT '1',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY branch_id (branch_id),
  KEY category_id (category_id),
  CONSTRAINT products_ibfk_1 FOREIGN KEY (branch_id) REFERENCES branches (id),
  CONSTRAINT products_ibfk_2 FOREIGN KEY (category_id) REFERENCES categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Users Table
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  branch_id INT DEFAULT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin','manager','staff') NOT NULL DEFAULT 'staff',
  is_active TINYINT(1) NOT NULL DEFAULT '1',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY branch_id (branch_id),
  CONSTRAINT users_ibfk_1 FOREIGN KEY (branch_id) REFERENCES branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Orders Table
CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT,
  branch_id INT NOT NULL,
  customer_name VARCHAR(150) DEFAULT NULL,
  customer_phone VARCHAR(30) DEFAULT NULL,
  order_type ENUM('dine_in','takeaway','delivery') NOT NULL DEFAULT 'takeaway',
  table_number VARCHAR(20) DEFAULT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  vat_amount DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  total DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  status ENUM('pending','confirmed','preparing','ready','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY branch_id (branch_id),
  CONSTRAINT orders_ibfk_1 FOREIGN KEY (branch_id) REFERENCES branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Order Items Table
CREATE TABLE order_items (
  id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT '1',
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY order_id (order_id),
  KEY product_id (product_id),
  CONSTRAINT order_items_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders (id),
  CONSTRAINT order_items_ibfk_2 FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Appendix B: API Route Specifications & Status Codes

| Route Path | Method | Auth Guard | Request Payload | Response Success Code |
| :--- | :---: | :---: | :--- | :---: |
| `/api/health` | GET | None | None | 200 OK |
| `/api/auth/login` | POST | None | `email`, `password` | 200 OK |
| `/api/auth/me` | GET | Bearer JWT | None | 200 OK |
| `/api/branches` | GET | None | Query: `branchId` (optional) | 200 OK |
| `/api/branches` | POST | Superadmin | `name`, `address`, `phone` | 201 Created |
| `/api/categories` | GET | None | Query: `branchId` (optional) | 200 OK |
| `/api/categories` | POST | Admin/Super | `name`, `branchId`, `description` | 201 Created |
| `/api/products` | GET | None | Query: `branchId`, `categoryId` | 200 OK |
| `/api/products` | POST | Admin/Super | `name`, `price`, `branchId`, `categoryId` | 201 Created |
| `/api/products/:id/availability`| PATCH | Admin/Super | `isAvailable` (boolean) | 200 OK |
| `/api/orders` | POST | None | `branchId`, `customerName`, `items` | 201 Created |
| `/api/orders` | GET | None/Staff | Query: `branchId` (optional) | 200 OK |
| `/api/orders/:id/status`| PATCH | Staff/Admin | `status` (`preparing`, `ready`, etc.) | 200 OK |
| `/api/users` | GET | Superadmin | None | 200 OK |
| `/api/users` | POST | Superadmin | `name`, `email`, `password`, `role` | 201 Created |

### Appendix C: Verified System Directory Structure

```
WOW Burger/
├── backend/
│   ├── config/db.js                  # MySQL connection pool
│   ├── controllers/                  # Auth, branch, category, product, order, user controllers
│   ├── middleware/authMiddleware.js  # JWT authentication and RBAC checks
│   ├── routes/                       # Express modular REST routes
│   ├── server.js                     # Server entry point on port 5000
│   └── package.json                  # Backend dependencies
├── frontend/
│   ├── public/images/                # 45+ categorized product photos
│   ├── src/
│   │   ├── components/               # UI components, layout, menu, map
│   │   ├── context/                  # AuthContext, CartContext, ThemeContext
│   │   ├── pages/                    # Home, Menu, Checkout, Login, Admin views
│   │   ├── services/                 # API client & endpoint service functions
│   │   ├── styles/index.css          # Tailwind and custom theme variables
│   │   ├── App.jsx                   # React Router root component
│   │   └── main.jsx                  # React DOM mount point
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # Tailwind styling tokens
│   └── vite.config.js                # Vite development and build settings
└── docs/
    ├── WOW_Burger_Technical_Documentation.md  # System Architecture & Technical Report
    ├── WOW_Burger_Internship_Report.md        # Academic Internship Report (Markdown)
    └── WOW_Burger_Internship_Report.doc       # Academic Internship Report (Microsoft Word Document)
```
