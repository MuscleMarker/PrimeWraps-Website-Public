# Prime Wraps Expense Management System

## Overview
The Prime Wraps website now includes a comprehensive expense management and split sheet system integrated into the admin dashboard. This system allows team members to track expenses, manage jobs, and automatically calculate settlements between team members.

## Features

### 1. Expense Management
- **Add/Edit/Delete Expenses**: Full CRUD operations for expense tracking
- **Categories**: Materials, tools, travel, meals, utilities, insurance, subscriptions, marketing, office supplies, equipment, maintenance, and more
- **Status Tracking**: Pending, approved, reimbursed, rejected
- **Advanced Features**:
  - Tax deductibility tracking
  - Recurring expense support (monthly, quarterly, yearly)
  - Shared expense splitting
  - Receipt/image support (URL field)
  - Job association
  - Notes and descriptions

### 2. Job Tracking
- **Job Management**: Create and manage projects/jobs
- **Team Assignment**: Assign team members to specific jobs
- **Status Tracking**: Planning, in progress, on hold, completed, cancelled
- **Financial Tracking**: Revenue, expenses, and profit margin calculations
- **Client Information**: Track client names and job locations

### 3. Settlement Calculator
- **Automatic Calculations**: Automatically calculates who owes who money
- **Shared Expense Handling**: Tracks expenses split between team members
- **Balance Overview**: Shows each team member's financial position
- **Settlement Reports**: Clear breakdown of required payments

### 4. Admin Dashboard Integration
- **Tabbed Interface**: Four main sections:
  - Contact Submissions (existing)
  - Expense Management (new)
  - Settlements (new)
  - Job Management (new)
  - User Management (existing)
- **Consistent UI**: Maintains the existing design language and styling
- **JWT Authentication**: Secure access for admin users only

## Database Schema

### New Entities
1. **Expense**: Core expense tracking with categories, status, and relationships
2. **Job**: Project/job management with team assignments
3. **JobAssignment**: Individual team member assignments with hours and earnings
4. **Settlement**: Payment tracking between team members

### Enums
- **ExpenseCategory**: Materials, tools, travel, etc.
- **ExpenseStatus**: Pending, approved, reimbursed, rejected
- **JobStatus**: Planning, in progress, on hold, completed, cancelled
- **AssignmentStatus**: Assigned, in progress, completed, cancelled
- **SettlementStatus**: Pending, paid, overdue, cancelled

## API Endpoints

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/{id}` - Get expense by ID
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `PUT /api/expenses/{id}/status` - Update expense status
- `GET /api/expenses/status/{status}` - Get expenses by status
- `GET /api/expenses/category/{category}` - Get expenses by category
- `GET /api/expenses/user/{userId}` - Get expenses by user
- `GET /api/expenses/job/{jobId}` - Get expenses by job
- `GET /api/expenses/pending` - Get pending expenses
- `GET /api/expenses/shared` - Get shared expenses
- `GET /api/expenses/tax-deductible` - Get tax deductible expenses
- `GET /api/expenses/recurring` - Get recurring expenses

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/{id}` - Get job by ID
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job
- `PUT /api/jobs/{id}/status` - Update job status

## Frontend Components

### 1. ExpenseForm
- Comprehensive form for adding/editing expenses
- Dynamic fields based on expense type (recurring, shared, etc.)
- User and job selection dropdowns
- Validation and error handling

### 2. ExpenseManagement
- Table view of all expenses with filtering and search
- Status management and bulk operations
- Summary cards showing totals and pending amounts
- Edit and delete functionality

### 3. SettlementCalculator
- Automatic settlement calculations
- User balance overview
- Settlement recommendations
- Clear payment instructions

### 4. JobManagement
- Job overview with financial summaries
- Team assignment management
- Status tracking and updates
- Client and location information

## Usage Instructions

### Adding an Expense
1. Navigate to Admin Dashboard → Expense Management
2. Click "Add Expense"
3. Fill in the required fields:
   - Description and amount
   - Category and date
   - Who paid for it
   - Job association (optional)
   - Shared expense settings
   - Tax deductibility and recurring options
4. Click "Add Expense"

### Managing Jobs
1. Navigate to Admin Dashboard → Job Management
2. Click "Add Job"
3. Fill in job details:
   - Title and description
   - Start/end dates
   - Client information
   - Team member assignments
4. Track job progress and update status as needed

### Viewing Settlements
1. Navigate to Admin Dashboard → Settlements
2. View automatic calculations of who owes who money
3. See individual user balances
4. Get clear settlement instructions

## Security Features
- JWT token authentication required for all operations
- Admin-only access to sensitive financial data
- Input validation and sanitization
- Proper error handling and logging

## Future Enhancements
- Receipt image upload and storage
- Email notifications for approvals and settlements
- Mobile-responsive design improvements
- Export functionality (PDF, Excel)
- Advanced reporting and analytics
- Integration with accounting software
- Time tracking and hourly rate calculations
- Budget management and alerts

## Technical Notes
- Built with Spring Boot backend and React frontend
- Uses JPA/Hibernate for database operations
- Implements proper transaction management
- Follows existing code patterns and error handling
- Maintains consistent UI/UX with existing components
- Scalable architecture for small to medium teams (5-20 people)

## Support
For technical support or feature requests, contact the development team. The system is designed to be intuitive and user-friendly while providing powerful expense management capabilities for the Prime Wraps team.
