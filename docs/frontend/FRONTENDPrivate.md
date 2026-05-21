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

## Calendar Page 

### Purpose

Allows authorized users to manage interview and orientation schedules by viewing appointments, updating schedule dates and times, marking appointments as completed, or clearing scheduled events.

### UI Elements

- **Calendar Header:** Displays the current month and year.
- **Navigation Buttons:** Allows users to move between previous and next months.
- **Today Button:** Returns the calendar view to the current date.
- **Calendar Grid:** Displays scheduled appointments by date.
- **Appointment Cards:** Shows interview or orientation schedules within the calendar.
- **Schedule Details:** Displays appointment title, date, and appointment type.
- **Edit Schedule Option:** Allows users to update the schedule date and time.
- **Mark as Completed Option:** Updates the appointment status as completed.
- **Clear Appointment Option:** Removes the scheduled appointment from the calendar.

### Authenticated User Flow (Step-by-Step)

1. The authorized user logs into the admin portal.
2. The system redirects the user to Dashboard and use sidebar to open the the Calendar page.
3. The user views all scheduled interviews and orientations.
4. The user navigates between months using the calendar controls.
5. The user selects a scheduled appointment from the calendar.
6. The system displays appointment details and available actions.
7. The user may:
    - Change the appointment date and time
    - Mark the appointment as completed
    - Clear or remove the appointment
8. The system validates and saves the updated schedule information.
9. The calendar automatically refreshes to display the latest appointment data.

### Technical Notes

- Built using an interactive calendar component.
- Appointment schedules are dynamically retrieved from the database.
- Calendar events update in real time after schedule modifications.
- Schedule management is integrated with backend API endpoints.
- Only authorized users can manage appointment schedules.
- Appointment status updates are automatically persisted in the database.

### Accessibility & UX

- Uses a clean calendar layout for easier schedule tracking.
- Appointment cards use visual indicators for quick identification.
- Navigation controls are clearly labeled and accessible.
- Interactive calendar elements support hover and focus states.
- Responsive design supports desktop and tablet viewing.
- Confirmation prompts help prevent accidental appointment removal.
- Consistent spacing and typography improve readability.
- Calendar interactions are designed to minimize scheduling errors.

## OJT Data

### Purpose

Allows authorized users to manage verified intern by viewing, editing, and deleting interns.

### UI Elements

- **Filter Applications Card:** Allows users to filter application records by school and time period.
- **School Dropdown:** Filters applications based on selected school.
- **Time Period Dropdown:** Filters applications based on submission date range.
- **Verified Interns Table:** Displays all verified interns records.
- **Search Bar:** Allows users to search applicants by name or applicant ID.
- **Export Button:** Exports application records for reporting or documentation in .xlsx format.
- **Action Buttons:**
    - **View Button:** Opens full intern details.
    - **Edit Button:** Updates intern details.
    - **Delete Button:** Removes the intern record.

### Authenticated User Flow (Step-by-Step)

1. The authorized user logs into the admin portal.
2. The system redirects the user to dashboard and switch the OJT Data page using the sidebar.
3. The user views the list of verified interns.
4. The user may filter records using:
    - School dropdown
    - Time period dropdown
    - Search bar
5. The system dynamically updates the table based on selected filters.
6. The user may select a verified intern to:
    - View intern details
    - Edit intern details
    - Delete the intern in the table
7. If the user edits detail intern:
    - The system validates the changes.
    - The updated information is saved to the database.
8. If the user deletes an application:
    - The system prompts for confirmation before deletion.
    - The system logs user actions for monitoring and auditing.

### Technical Notes

- Verified intern records are retrieved dynamically from the database.
- Filtering and search functions update the table in real time.
- Export functionality supports .xlsx format.
- CRUD operations are connected to backend API endpoints.
- Status updates are persisted in the database immediately after modification.

### Accessibility & UX

- Uses clear labels and readable typography for better usability.
- Action buttons include icons with recognizable functions.
- Search and filter controls are grouped for efficient navigation.
- Interactive elements include hover and focus states for accessibility.
- Confirmation dialogs prevent accidental deletion of records.
- Table layout maintains proper spacing and alignment for readability.

## Accounts

### Purpose

Allows authorized users to manage accounts by editing, changing, and deleting accounts.

### UI Elements

- **Filter Applications Card:** Allows users to filter accounts by account type and time period.
- **Account type Dropdown:** Filters applications based on account (employee or admin).
- **Time Period Dropdown:** Filters applications based on date range.
- **Accounts Table:** Displays all the authorized users.
- **Search Bar:** Allows users to search applicants by username or email.
- **Create Account Button:** Allows users to create a new account for employee or admin.
- **Action Buttons:**
    - **Edit Account Button:** Update account details (username or account type).
    - **Reset Password Button:** Change account password.
    - **Delete Button:** Removes the account in the table.

### Technical Notes
- Account data is dynamically fetched from the backend database using authenticated API requests.
- Search functionality supports filtering by username and email in real time.
- Filter dropdowns are connected to query parameters for account type and date sorting.
- Role-based access control (RBAC) ensures only authorized administrators can manage accounts.
- CRUD operations (Create, Update, Delete) are handled through secured backend endpoints.
- Password reset functionality uses encrypted password handling and secure validation.
- Confirmation modal/dialog should appear before deleting accounts to prevent accidental removal.
- Form validation is implemented for required fields such as username, and password.
- Audit logs may be integrated to track account management actions for security and monitoring purposes.
- Toast notifications or alerts provide feedback for successful or failed operations.

### Accessibility & UX
- Clear visual hierarchy using cards, tables, badges, and action buttons for easier navigation.
- Search bar includes placeholder text to guide users on searchable fields.
- Dropdown filters use descriptive labels for better usability.
- Action buttons include icons and tooltips to improve recognition and reduce confusion.
- Color-coded account type badges help users quickly distinguish admin and employee accounts.- Interactive elements include hover and focus states for better accessibility feedback.
- Confirmation prompts prevent accidental account deletion.
- Empty states and loading indicators are displayed when no records are available or data is loading.
- Error messages are specific and user-friendly during failed actions or invalid inputs.
- Form inputs include validation messages and accessible labels.
- Consistent spacing and alignment improve readability and reduce visual clutter.
- Search and filtering actions should update results quickly to maintain smooth user interaction.