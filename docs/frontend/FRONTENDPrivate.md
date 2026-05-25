**NTC-Application Frontend Documentation: Private Pages**

# NTC-Application Frontend Documentation: Private (Authenticated) Side

## 1. Introduction

The private side of the NTC-Application Portal is accessible only to authenticated users (admins and employees). It provides a comprehensive suite of tools for application management, applicant monitoring, document verification, status tracking, and internal portal operations. This documentation outlines the user journey, UI components, workflows, validation handling, accessibility considerations, and best practices for all private pages.

## 2. Authenticated User Journey

1. **Login:** User authenticates via secure login form.
2. **Landing:** User is redirected to the Dashboard upon successful login.
3. **Navigation:** User access the system through the sidebar navigation to open Applications, Calendar, OJT Data, Accounts pages.
4. **Applications:** Displays a table of applicant information and application statuses, the authorized user can view applicant's details and edit the status of the application.
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
- **Export Button:** Exports application records for reporting or documentation in .xlsx format.
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
- Export functionality supports .xlsx format..
- Role-based access control restricts unauthorized actions.
- CRUD operations are connected to backend API endpoints.
- Status updates are persisted in the database immediately after modification.

### Accessibility & UX

- Uses clear labels and readable typography for better usability.
- Status badges use color indicators for quick recognition.
- Action buttons include icons with recognizable functions.
- Search and filter controls are grouped for efficient navigation.
- Interactive elements include hover and focus states for accessibility.
- Confirmation modals to prevent accidental deletion of records.
- Table layout maintains proper spacing and alignment for readability.

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
2. The system redirects the user to Dashboard and use sidebar to open the Calendar page.
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
- Confirmation modals to prevent accidental appointment removal.
- Consistent spacing and typography improve readability.
- Calendar interactions are designed to minimize scheduling errors.

## OJT Data

### Purpose

Allows authorized users to manage verified interns by viewing, editing, and deleting interns.

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
    - Delete the intern from the table
7. If the user edits the intern's details:
    - The system validates the changes.
    - The updated information is saved to the database.
8. If the user deletes the intern from the table:
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
    - **Delete Button:** Removes the account from the table.

### Authorized User Flow (Step-by-Step)

1. The authorized user logs into the admin portal.
2. The system redirects the user to the Dashboard.
3. The user navigates to the Accounts page using the sidebar.
4. The system displays all registered admin and employee accounts.
5. The user may filter accounts using:
    - Account type dropdown
    - Date sorting dropdown
    - Search bar
6. The system dynamically updates the account list based on selected filters.
7. The user may perform the following actions:
    - Create a new account
    - Edit account information
    - Reset account password
    - Delete an account
8. If the user creates or edits an account:
    - The system validates all required fields.
    - The updated account information is saved to the database.
9. If the user resets a password:
    - The system securely updates the account credentials.
    - The user receives confirmation of the password reset.
10. If the user deletes an account:
    - The system displays a confirmation modal before deletion.
    - The selected account is removed from the database after confirmation.
    - The system logs all account management actions for auditing and security monitoring purposes.

### Technical Notes

- Account data is dynamically fetched from the backend database using authenticated API requests.
- Search functionality supports filtering by username and email in real time.
- Filter dropdowns are connected to query parameters for account type and date sorting.
- Role-based access control (RBAC) ensures only authorized administrators can manage accounts.
- CRUD operations (Create, Update, Delete) are handled through secured backend endpoints.
- Password reset functionality uses encrypted password handling and secure validation.
- A confirmation modal appears before deleting accounts to prevent accidental removal.
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
- Error messages are specific and user-friendly during failed actions or invalid inputs.
- Form inputs include validation messages and accessible labels.
- Consistent spacing and alignment improve readability and reduce visual clutter.
- Search and filtering actions update results quickly to maintain smooth user interaction.

## Logs

### Purpose

Tracks and monitors all actions performed by authorized users within the system for auditing, security, and activity monitoring purposes.

### UI Elements

- **Filter Logs Card:** Allows users to filter by action type, user ID, and date.
- **Logs Table:** Displays all the action of authorized users.
- **Search Bar:**  Allows users to search by ID, details or IP.

### Authorized User Flow (Step-by-Step)

1. The authorized user logs into the admin portal.
2. The system redirects the user to the Dashboard.
3. The user navigates to the Logs page using the sidebar.
4. The system displays all recorded administrative and system activities.
5. The user may filter logs using:
    - Action type dropdown
    - User ID field
    - Date range selectors
    - Search bar
6. The system dynamically updates the logs based on selected filters.
7. The user may select a specific log entry to:
    - View detailed activity information
    - Review changes made within the system
8. The system maintains logs for auditing and monitoring purposes.

### Technical Notes

- Log records are dynamically retrieved from the backend database.
- Filtering and searching update log results in real time.
- Logs are generated automatically after important user actions.
- Audit logs may include:
    - User ID
    - Action type
    - Modified data
    - Timestamp
    - IP address
- Role-based access control restricts unauthorized access to logs.
- Log data is connected to secured backend API endpoints.
- System actions are stored persistently for monitoring and security auditing.
- Search and filtering operations are optimized for performance.

### Accessibility & UX

- Uses clear typography and spacing for better readability.
- Action badges use color indicators for quick action identification.
- Search and filter controls are grouped for easier navigation.
- Interactive elements include hover and focus states for accessibility.
- Date picker inputs include clear labels and recognizable icons.
- Pagination controls are accessible and easy to navigate.
- View buttons use recognizable icons for better usability.
- Consistent card and table layouts reduce visual clutter.

## Future Enhancements

- **Responsive Mobile Optimization:** Further optimize private pages and tables for smaller screen sizes and mobile devices.
- **Calendar Notification Reminders:** Send reminders for upcoming interviews and orientations.
- **Document Verification Automation:** Implement automatic validation for uploaded requirements and document completeness. 
