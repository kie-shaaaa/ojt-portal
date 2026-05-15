**NTC-Application Frontend Documentation: Private Pages**

# NTC-Application Frontend Documentation: Private (Authenticated) Side

## 1. Introduction

The private side of the NTC-Application Portal is accessible only to authenticated users (admins and employees). It provides a comprehensive suite of tools for application management, applicant monitoring, document verification, status tracking, and internal portal operations. This documentation outlines the user journey, UI components, workflows, validation handling, accessibility considerations, and best practices for all private pages.

## 2. Authenticated User Journey

1. **Login:** User authenticates via secure login form.
2. **Landing:** User is redirected to the Dashboard upon successful login.
3. **Navigation:** User access the system through the sidebar navigation to open Applications, Calendar, OJT Data, Accounts pages.
4. **Applications:** Displays a table of applicant information and appplication statuses, the authorized user can view applicant's details and edit the status of the application.
5. **Calendar:** Displays interview or orientation schedules. Authorized user can change the appointment dates and times. 
6. **OJT Data:** Displays a table of verified interns.
7. **Accounts:** Displays a list of admin and employees accounts.
8. **Logout:** End session securely.

---

## Dashboard

### Purpose

The Dashboard serves as the main overview page for authenticated users. It provides summarized analytics, application statistics, status monitoring, and quick access to key system modules.

### UI Elements

- **Header:** Displays a quick stats, and notifications.
- **Applications Widgets:** Displays weekly, monthly, and status distribution analytics. 
- **Application Control:** Displays the current portal status. Authorized users open, close, or schedule application availability.
- **Recent Activity:** Displays recent activities performed by admins and employees.
- **Applicant's School:** Displays the schools of recent applicants.

### Authenticated User Flow (Step-by-Step)

1. Enter valid login credentials  
2. Access the Dashboard after successful authentication  
3. Review analytics cards and application summaries  
4. Analyze charts and application statistics  
5. Use the sidebar navigation to access other pages  
6. Logout when finished  

### Technical Notes

- Dashboard data is dynamically retrieved from the database  
- Charts and analytics update in real time or upon refresh  
- Responsive layout supports desktop and mobile devices  
- Sidebar navigation remains accessible across authenticated pages

### Accessibility & UX

- Maintain clear visual hierarchy for analytics and charts  
- Use readable font sizes and sufficient color contrast  
- Ensure sidebar navigation supports keyboard interaction  
- Provide responsive layouts for different screen sizes  
- Use intuitive icons and labels for easier navigation  
- Display loading states or fallback messages when data is unavailable  


--- 