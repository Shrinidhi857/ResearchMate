# Admin Dashboard - Complete Implementation Guide

## Overview

A fully functional admin dashboard with complete integration of your Flask backend admin API endpoints.

## ✨ Key Features

### 1. **Dashboard Statistics**

- **Total Users**: All registered users on the platform
- **Total Tokens Issued**: Cumulative tokens distributed across all users
- **Average Tokens per User**: Average token distribution metric
- **Verified Users**: Number of email-verified users

### 2. **Users Management Tab** ⭐

Comprehensive user management interface:

- **Search & Filter**: Search users by email or name in real-time
- **Pagination**: Navigate through users (20 per page)
- **User Information Table**:
  - User name (first + last)
  - Email address
  - Token balance (with badge)
  - Verification status (verified/unverified)
  - Admin status (admin/user)
  - Join date

**Action Buttons per User**:

- **Tokens**: Open dialog to add/deduct/set user tokens
- **Verify**: Mark user as verified (if not already verified)
- **Grant Admin**: Promote user to admin (if not admin)
- **Revoke Admin**: Remove admin privileges (if admin)
- **Delete**: Permanently delete user account (with confirmation)

### 3. **Analytics Tab** 📊

- **Verification Status Chart**: Pie chart showing verified vs unverified users
- **Platform Summary**:
  - Total users count
  - Admin users count
  - Verified users count
  - Unverified users count
  - Total token pool

### 4. **Recent Users Tab** 👥

- Display 5 most recently registered users
- Quick view of user details and verification status

## 📁 File Structure

```
src/
├── pages/
│   └── AdminPage.tsx                  # Main admin dashboard (340+ lines)
├── hooks/
│   └── admin/
│       └── useAdminData.ts           # Custom hook for data management
├── components/
│   └── ui/
│       ├── table.tsx                  # Table UI component
│       └── alert-dialog.tsx          # Alert dialog for confirmations
├── main.tsx                           # Updated with /admin route
└── package.json                       # Updated with @radix-ui/react-alert-dialog
```

## 🔗 Backend API Integration

### User Management Endpoints

#### GET /admin/users

Get paginated users with optional search

```
Query Parameters:
  page: number (default: 1)
  per_page: number (default: 20)
  search: string (searches email, first_name, last_name)
```

#### POST /admin/users/<user_id>/verify

Manually verify a user account

#### POST /admin/users/<user_id>/grant-admin

Grant admin access to a user

#### POST /admin/users/<user_id>/revoke-admin

Revoke admin access from a user

#### DELETE /admin/users/<user_id>/delete

Permanently delete a user (with protections for primary admin)

### Token Management Endpoints

#### POST /admin/users/<user_id>/tokens/add

Add tokens to a user account

```json
{
  "amount": number,
  "reason": string (optional)
}
```

#### POST /admin/users/<user_id>/tokens/deduct

Deduct tokens from a user account

```json
{
  "amount": number,
  "reason": string (optional)
}
```

#### POST /admin/users/<user_id>/tokens/set

Set user tokens to specific amount

```json
{
  "amount": number
}
```

### Analytics Endpoints

#### GET /admin/analytics

Get platform analytics and summary

Response includes:

- User counts (total, verified, admin, unverified)
- Token statistics (issued, average per user, total pool)
- Recent users (5 most recent)
- Timestamp

#### GET /admin/token-usage-report

Get detailed token usage report with sorting/filtering

## 🎯 useAdminData Hook

Complete hook providing state and methods:

```typescript
const {
  // State
  adminInfo, // AdminInfo | null - Platform analytics
  users, // UserDetail[] - Current page users
  totalUsers, // number - Total users count
  loading, // boolean - Loading state
  error, // string | null - Error messages
  currentPage, // number - Current page
  search, // string - Current search term

  // Pagination & Search
  setCurrentPage, // (page: number) => void
  setSearch, // (search: string) => void

  // Data Fetching
  refetchData, // () => Promise<void>

  // Token Management
  addTokensToUser, // (userId, amount, reason?) => Promise
  deductTokensFromUser, // (userId, amount, reason?) => Promise
  setUserTokens, // (userId, amount) => Promise

  // User Management
  verifyUser, // (userId) => Promise<void>
  grantAdmin, // (userId) => Promise<void>
  revokeAdmin, // (userId) => Promise<void>
  deleteUser, // (userId) => Promise<void>
} = useAdminData();
```

## 🔐 Security Features

1. **Authentication**: Bearer token from localStorage attached to all requests
2. **Admin Authorization**: Backend validates admin role with `@admin_required` decorator
3. **Primary Admin Protection**:
   - Cannot delete primary admin account
   - Cannot revoke admin from primary admin
4. **Input Validation**:
   - Positive integers only for token amounts
   - Prevents deducting more tokens than user has
5. **Error Handling**: User-friendly error messages from backend

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

The required package `@radix-ui/react-alert-dialog` is already added to package.json.

### 2. Environment Setup

Ensure `.env` contains:

```
VITE_SERVER_API_URL=http://your-backend-url
```

### 3. Access Admin Page

- Navigate to `/admin` in your app
- Or click "Admin" in the sidebar

### 4. Verify Backend Endpoints

Ensure all Flask endpoints are properly implemented with `@admin_required` decorator.

## 📊 Common Actions

### Add Tokens to User

1. Click "Tokens" button next to user
2. Dialog opens showing current balance
3. Select "Add" action
4. Enter amount (e.g., 1000)
5. Click "Confirm"
6. Toast confirms success

### Search Users

1. Type email or name in search field
2. Results filter automatically
3. Pagination resets to page 1
4. Clear search to show all users

### Change User Roles

- **Verify**: Click "Verify" button for unverified users
- **Grant Admin**: Click "Grant" button to promote user
- **Revoke Admin**: Click "Revoke" button to demote admin

### Delete User

1. Click trash icon
2. Confirmation dialog appears
3. Shows user email for confirmation
4. Click "Delete" to permanently remove

## ⚙️ Component Architecture

```
AdminPage
├── Header (Title + Refresh Button)
├── Stats Cards (4 KPI cards)
└── Tabs
    ├── Users Management Tab
    │   ├── Search Bar
    │   ├── Users Table
    │   │   └── Action Buttons
    │   └── Pagination Controls
    ├── Analytics Tab
    │   ├── Verification Pie Chart
    │   └── Platform Summary Card
    └── Recent Users Tab
        └── Recent Users Table

Alert Dialogs
├── Token Management Dialog
│   ├── Action Selector (Add/Deduct/Set)
│   └── Amount Input
└── Delete Confirmation Dialog
```

## 🎨 UI Technologies

- **Recharts**: Analytics visualizations (Pie chart)
- **Radix UI**: Alert dialogs, dropdown menus
- **Shadcn/ui**: Tables, cards, buttons, badges
- **Tailwind CSS**: Responsive styling
- **Lucide Icons**: UI icons

## 📱 Responsive Design

- **Mobile**: Single column, stacked tabs
- **Tablet**: 2-column grid for analytics
- **Desktop**: Full multi-column layout
- All tables are horizontally scrollable on mobile

## 🐛 Troubleshooting

| Issue                       | Solution                                   |
| --------------------------- | ------------------------------------------ |
| "Unauthorized access" error | Verify user has admin role on backend      |
| No users displayed          | Check `/admin/users` endpoint returns data |
| Token operations fail       | Ensure user has sufficient tokens          |
| Search not working          | Verify backend search uses `.ilike()`      |
| Loading states stuck        | Check browser console for API errors       |

## 🔄 Data Refresh Strategy

- Auto-refresh on page/search changes
- Manual refresh via "Refresh" button
- Auto-refresh after token/user operations
- Toast notifications for all actions
- Error toasts with backend messages

## ✅ Validation

**Token amounts**:

- Must be positive integers
- Cannot deduct more than user has
- Set can use any non-negative integer

**User operations**:

- Cannot delete primary admin
- Cannot revoke primary admin
- Search filters case-insensitive

## 🚀 Performance Optimizations

- Pagination limits to 20 users per page
- Efficient search with backend filtering
- Loading skeletons for better UX
- Debounced search (on keystroke)
- Minimal re-renders with proper hook dependencies

## 📈 Future Enhancement Ideas

- [ ] Export user data to CSV
- [ ] Advanced filtering (date range, token range)
- [ ] Bulk user operations
- [ ] User activity timeline
- [ ] Token transaction history
- [ ] Real-time activity monitoring
- [ ] Scheduled reports
- [ ] User role customization
- [ ] Token purchase history
- [ ] API usage analytics

## 📝 Notes

- All user data is fetched from Flask backend
- Token management shows immediate feedback
- Admin dashboard respects role-based access control
- All operations are logged on backend (implement as needed)
- Suitable for growing platforms with 1000s of users
