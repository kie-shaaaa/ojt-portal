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

## Applications Page

### Purpose

Allows authorized users to manage applicant applications by viewing, editing, and deleting applications.

### UI Elements

- **Filter Applications Card:** Allows users to filter application records by school and time period.
- **School Dropdown:** Filters applications based on selected school.
- **Time Period Dropdown:** Filters applications based on submission date range.
- **Applications Table:** Displays all submitted applicant records.
- **Search Bar:** Allows users to search applicants by name, email, phone number, or applicant ID.
- **Export Button:** Exports application records for reporting or documentation.
- **Applicant Information Column:** Displays applicant name, email, and contact number.
- **Application Type Column:** Shows the type of application submitted.
- **Details Column:** Displays applicant school, course, required hours, and target completion date.
- **Submission Date Column:** Shows the date the application was submitted.
- **Status Badge:** Displays the current application status (e.g., Pending, Approved, Rejected).
- **Action Buttons:**
    - **View Button:** Opens full applicant details.
    - **Edit Button:** Updates application status.
    - **Delete Button:** Removes the application record.

### Authenticated User Flow (Step-by-Step)

1. The authorized user logs into the admin portal.
2. The system redirects the user to dashboard and switch the Applications page using the sidebar.
3. The user views the list of submitted applications.
4. The user may filter records using:
    - School dropdown
    - Time period dropdown
    - Search bar
5. The system dynamically updates the table based on selected filters.
6. The user may select an application to:
    - View applicant details
    - Edit application status
    - Delete the application
7. If the user edits an application:
    - The system validates the changes.
    - The updated information is saved to the database.
8. If the user deletes an application:
    - The system prompts for confirmation before deletion.
    - The user may export application records for documentation or reporting purposes.
    - The system logs user actions for monitoring and auditing.

### Technical Notes

- Application records are retrieved dynamically from the database.
- Filtering and search functions update the table in real time.
- Export functionality supports downloadable report generation.
- Role-based access control restricts unauthorized actions.
- CRUD operations are connected to backend API endpoints.
- Status updates are persisted in the database immediately after modification.

### Accessibility & UX

- Uses clear labels and readable typography for better usability.
- Status badges use color indicators for quick recognition.
- Action buttons include icons with recognizable functions.
- Search and filter controls are grouped for efficient navigation.
- Responsive layout supports desktop, tablet, and mobile devices.
- Interactive elements include hover and focus states for accessibility.
- Confirmation dialogs prevent accidental deletion of records.
- Table layout maintains proper spacing and alignment for readability.
- Keyboard navigation is supported for search fields.