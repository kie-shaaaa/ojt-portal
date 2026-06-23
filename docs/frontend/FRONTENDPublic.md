# NTC-Application Frontend Documentation

## Public Pages

---

## Introduction
The NTC Application Portal is a web-based platform developed for the National Telecommunications Commission (NTC) to streamline the application and recruitment process for applicants. The system provides an accessible and user-friendly interface for submitting applications, tracking application status, and managing applicant-related information online.

---

## Journey Overview

1. The user lands on the Home page via direct link or search engine
2. The user explores the website,including the FAQs, and Contact section
3. The user clicks **Submit Application** to begin the application process 
4. The user fills out the application form and submit the required information and documents
5. The system will validate and stores applicantion data
6. The user can use **Track Application** to check the status of their submission

# Home (Landing) Page

## Purpose
The Home page serves as the first point of contact for users. It introduces NTC Application Portal, and guides users towards submitting an application or tracking existing application.

## UI Elements

* **Hero Section:** Display portal introduction, NTC Logo, and primary call-to-action buttons
* **Feature Highlights:** Showcases the key features and services of the portal
* **Call-to-Action Buttons:** Submit Application, Track Application, Login
* **Navigation Bar:** Provides access to FAQs, Contact and Login page
* **Footer:** Contains QuickLinks, Contact Info, OJT Requirements, Legal otices
* **Responsive Design:** Optimize for all devices

## User Flow

1. User arrives on the Home page
2. Views hero section and the whole website
3. User clicks a CTA (**Submit Application** or **Track Application**)
4. If the user selects **Submit Application** 
    - User is directed to the application form
    - User fills out all required fields
    - User upload necessary documents
    - User reviews entered information
    - User reads and agrees with the Data Privacy Policy before submission
    - User submits the application
    - System validates and stores the applicant's data
    - System displays confirmation message
5. If the user selects **Track Application**
    - User enters Application ID and Email Address
    -Users views current application progress
6. Users scrolls to FAQs and Contact section if addition information is needed

## UX & Design Notes

* Clean design
* Clean and concise messaging
* Accessible 
* Fast loading performance
* Trust indicators (Quick Links, Contact Info, Resources)

## Technical Notes

* Built with Next.js and Typescript
* Client-side routing for smooth navigation


## Best Practices
* Keep CTAs visible and prominent
* Regularly update visuals and content

---

# Submit Application 

## Purpose

Enables users to submit application easily and efficiently through an online submission process. 

## UI Elements

* Personal Information Fields
* Education Information Fields
* File Upload Section/Required Document checklist
* Data Privacy Policy notice
* Submit Button
* Cancel/Reset Button
* Previous & Next Button
* Progress Indicator
* Validation Messages

## Process Overview

1. User access the application form
2. User fills out the required information
3. User uploads the necessary documents
4. System validates the entered data
5. User reviews the information before submission
6. Users agree to the Data Privacy Policy
7. Users submits the application
8. System stores the application and displays a confirmation message

## Step-by-Step

1. Enter personal information
2. Enter OJT details
3. Upload required documents
4. Accept the Data Privacy Agreement
5. Click the Submit button
6. Receive confirmation via email and Application ID

## Validation Rules

* Required fields must not be empty
* Email must follow a valid email format
* Contact numbers must contain valid digits only
* Uploade files must meet allowed file type and size requirements
* Duplicate submission may be restricted

## Error Handling

* Display inline validation messages for incorrect inputs
* Show upload errors for unsupported file types or oversized files
* Prevent submission when required fields are incomplete
* Display a message when the application submission period is closed
* Display server or network messages when submission fails

## Security Considerations

* Validate and sanitize all user inputs
* Restrict malicious file uploads
* Protect applicant data through secure storage and transmission

## Design Notes

* Maintain a clean and user-friendly interface
* Use responsive design for mobile, tablet, and desktop devices
* Keep the form layout organized and easy to follow
* Highlight required fields clearly


# Track Application

## Purpose

Allow users to monitor the status and progress of their submitted application using their Application ID and Email Address.

## UI Elements

* Application ID Input Field
* Email Address Input Field
* Track Application Button
* User Personal Infromation Display Section
* Application Progress Indicator
* Error Messages

## Process Overview

* User access the Track Application page
* User enters the Application ID and Email Address
* System validates the entered credentials
* System retrieves the application data
* User views the current application and progress

## Step-by-Step

1. Enter the Application ID
2. Enter the registered Email Address 
3. Click the Track Application button
4. View the application status and updates

## Validation Rules

* Application ID field must not be empty
* Email Address field must not be empty or must follow a valid email format
* Application ID and Email Address must match the existing record

## Error Handling

* Display an error message for invalid Application ID and Email Address
* Notify users when no matching application record is found
* Prevents submission when fields are incomplete
* Display server or network messages when retrieval fails

## Security Considerations

* Protect applicant information from unauthorized access
* Validate and sanitize users inputs

## Design Notes

* Keep the interface simple and easy to use
* Clearly display the application and status and progress
* Ensure responsive layout accross devices

---

# Resubmit Application

## Purpose

Allow applicants to resubmit documents that were marked as rejected during the application review process.

## Process Overview

* Reviewer rejects one or more submitted documents and provides remarks.
* System sends an email notification to the applicant containing a secure resubmission link.
* Applicant opens the link and accesses the Resubmit Application page.
* Applicant reviews the rejected document(s) and corresponding remarks.
* Applicant uploads the corrected document(s).
* Applicant submits the revised document(s).
* System stores the new files and updates the application for re-evaluation.

## Step-by-Step

1. Applicant receives an email notification regarding the rejected document(s).
2. Applicant clicks the resubmission link provided in the email.
3. Applicant reviews the rejected document(s) and reviewer remarks.
4. Applicant uploads the corrected file(s).
5. Applicant clicks the Submit button.
6. System confirms successful resubmission.
7. Application returns to the review process.

## Validation Rules

* Resubmission page is accessible only through a valid resubmission link.
* Only documents marked as rejected can be replaced.
* Uploaded files must follow the allowed file formats and size limits.
* All required rejected documents must be uploaded before submission.

## Error Handling

* Display an error message when the resubmission link is invalid or expired.
* Display an error message when uploaded files exceed the allowed size.
* Display an error message when unsupported file formats are uploaded.
* Prevent submission when required rejected documents are missing.
* Display server or network error messages when upload fails.

## Security Considerations

* Restrict access to only the applicant associated with the application.
* Validate and sanitize uploaded files.
* Prevent unauthorized modification of approved documents.

---

# Schedule Rescheduling

## Purpose 

* Allow applicants to accept or request changes to scheduled activities, such as interviews and orientations, when a schedule is updated by the administrator.

## Applicable Activities

* Interview Schedule
* Orientation Schedule

## Process Overview

* System sends an email notification containing the schedule details and a secure scheduling link.
* Applicant chooses to either accept the schedule or request a reschedule.
    * If the applicant accepts, the schedule is confirmed.
    * If the applicant requests a reschedule, the system notifies the admin.
* Administrator reviews the request and either approves or reschedule it.

## Step-by-Step

1. System sends an email notification to the applicant.
2. Applicant reviews the scheduled activity details.
3. Applicant selects one of the following actions:
    * Accept Schedule
    * Request Reschedule
4. If Request Reschedule is selected:
    * Applicant selects a preferred date and time.
    * Applicant submits the request.
    * System notifies the admin.
    * Admin reviews the request.
    * Admin approves or reschedule the appointment.

## Validation Rules

* Scheduling must be accessible only through a valid scheduling link.
* Applicants can only respond to active schedules.
* Requested schedules must fall within available dates and times.
* Past dates and times are not allowed.

---
V
# Login

## Purpose

Allows authorized administrators and employees to securely access the NTC Application Portal management system.

## UI Elements

* Username or Email Input Field
* Password Input Field
* Login Button
* Error Message Display

## Process Overview

* Authorized user accesses the Login page
* User enters login credentials
* System validates the credentials
* System authenticates the account
* User is redirected to the dashboard

## Step-by-Step

1. Enter registered username or email address
2. Enter password
3. Click the Login button
4. System verifies credentials
5. User gains access to the dashboard

## Validation Rules

* Username or Email field must not be empty
* Password field must not be empty
* Credentials must match an existing authorized account

## Error Handling

* Display an error message for incorrect credentials
* Prevent login when required fields are incomplete
* Notify users when the account is unauthorized
* Display server or network error messages when login fails

## Accessibility 

* Support keyboard navigation for form inputs
* Provide clearly labeled input fields
* Ensure readable error messages and sufficient color contrast

## Security Considerations

* Passwords should be securely encrypted
* Implement secure authentication and session management
* Protect against unauthorized access and brute-force attacks






