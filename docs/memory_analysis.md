# Memory Inefficiency Analysis - Full Stack

## Backend Issues
1. **Unbounded file uploads** - No streaming, everything loaded to memory via Buffer
2. **Synchronous email sending** - Blocks request thread, can accumulate with multiple emails
3. **Sequential file upload loops** - For loops with await inside for multiple file uploads
4. **No pagination offset** - Uses LIMIT but missing OFFSET in many queries
5. **Unbounded logs table** - No retention policy, grows indefinitely
6. **Large payload loads** - SELECT * returns entire rows without column selection

Files affected:
- file-uploads.service.ts: Line 179, Buffer handling
- mailer.service.ts: Synchronous send() operations  
- applications.service.ts: Line 179 (file loop)
- dashboard.service.ts: 4 parallel queries loading all data
- main.ts: bodyLimit 25MB, fileSize 6MB

---

## FRONTEND Issues Found

### 1. MEMORY LEAKS - Event Listeners (Critical)
- **ApplicationDetailsModal.tsx:164** - Event listener without full cleanup verification
- **DatePicker.tsx:87** - addEventListener("mousedown") with cleanup
- **TimePicker.tsx:39** - addEventListener("mousedown") with cleanup  
- **ApplicationsFilterSection.tsx:53** - addEventListener("mousedown") with cleanup
- **EditAccountModal.tsx:42** - window.addEventListener("keydown") with cleanup
- **InternDetailsModal.tsx:140** - window.addEventListener("keydown") with cleanup
- **OJT-Data/FilterInternSection.tsx:35** - addEventListener("mousedown") with cleanup
- **apply/OjtInformationSection.tsx:83** - addEventListener("mousedown")

### 2. LARGE DATA RENDERING - No Virtualization (Critical)
- **ApplicationsTableSection.tsx:370+** - Renders filteredApplications without virtualization (.map() in tbody)
- **VerifiedInternsTableSection.tsx:150+** - Renders interns array without virtualization
- **AdminLogsTable.tsx:200+** - Renders filteredLogs without virtualization (has pagination but no virtual scrolling)
- **Admin Logs page** - Table renders all 10 ITEMS_PER_PAGE items at once

### 3. UNBOUNDED API CALLS (High Impact)
- **applications/page.tsx:123** - Fetches with ?count=50 (OK but max not enforced)
- **accounts/page.tsx:68** - Fetches with ?count=50
- **ojt-data/page.tsx:64** - Fetches with ?count=1000 (!!!) - MASSIVE DATA LOAD
- **applications/page.tsx:156** - Fetches schools with ?count=1000 (!!!) - Loads entire school list
- **ojt-data/page.tsx:93** - Fetches schools with ?count=1000 (!!!)
- **useApplicationFiles.ts:110+** - Sequential API calls for each candidate ID in loop

### 4. POLLING WITHOUT DEBOUNCING (High Impact)  
- **usePendingApplications.ts:44** - setInterval(fetchPendingCount, 30000) every 30 seconds
  - Continuously fetches notifications without debouncing
  - No cleanup if hook unmounts during fetch
  - Fetches even if data hasn't changed

### 5. CONSOLE.LOG IN PRODUCTION (Medium)
- auth-context.tsx:70 - console.log(data) on every login
- api.ts:43 - console.log("Data", data) on every API call (HIGH VOLUME!)
- api.ts:44 - console.log("Response", response) on every API call
- calendar/page.tsx:152, 173 - console.log(response)
- ojt-data/page.tsx:67, 133, 135 - console.log statements
- Multiple table/modal components - console.log for debugging

### 6. IMAGE HANDLING - No Lazy Loading (Medium)
- **ApplicationDetailsModal.tsx:266** - embed src for PDF with full signedUrl
- **ApplicationDetailsModal.tsx:284** - img tag without lazy loading
- **DocumentUploadSection.tsx:386+** - Creates Image object in memory for dimensions check
  - Uses FileReader.readAsDataURL() - entire file loaded into memory as data URL
  - Creates Image object and waits for onload - keeps image in memory
  - No memory cleanup after validation

### 7. INEFFICIENT STATE PATTERNS (Medium)
- **DocumentUploadSection.tsx:308+** - orderedCards array reordered on every render
- **useApplicationFiles.ts:104** - Creates new Map and spread arrays on every render
- Multiple .map() operations without memoization

### 8. UNOPTIMIZED SEARCHES (Medium)  
- **ApplicationsTableSection.tsx** - searchQuery fires on every keystroke without debouncing
- **AdminLogsTable.tsx** - searchQuery input updates state directly without debouncing
- **Accounts page** - searchTerm updates state directly without debouncing

### 9. MISSING MEMOIZATION (Medium)
- **ApplicationDetailsModal.tsx:58** - FileCard component uses memo but receives unstable props
- **VerifiedInternsTableSection.tsx** - Intern rows not memoized, re-renders entire table
- **OJT-Data/FilterInternSection.tsx** - Filter inputs could be memoized

### 10. DOM CLEANUP ISSUES (Low)
- **ApplicationDetailsModal.tsx:234** - Creates link element, appends, removes on download
- **ApplicationDetailsModal.tsx:241** - Opens window.open() without tracking for cleanup
