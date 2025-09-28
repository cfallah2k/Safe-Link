# SafeLink Authentication Flow Documentation

## Complete Authentication Flow Overview

### 1. **Entry Point - LoginForm.tsx**
**Location**: `src/components/Auth/LoginForm.tsx`

**User Journey**:
1. User opens SafeLink application
2. Sees login form with code input field
3. Enters either:
   - **Regular User Code**: 8-character alphanumeric (e.g., "ABCD1234")
   - **Stakeholder Code**: Predefined codes (e.g., "SAFELINK_ADMIN_2024")

**Code Validation Logic**:
```typescript
// Stakeholder codes mapping
const stakeholderCodes = {
  'SAFELINK_ADMIN_2024': 'ADMIN',
  'SAFELINK_POLICE_2024': 'POLICE', 
  'SAFELINK_SAFE_2024': 'SAFEHOUSE',
  'SAFELINK_MED_2024': 'MEDICAL',
  'SAFELINK_NGO_2024': 'NGO'
};
```

**Flow Decision**:
- **Stakeholder Code** → Redirects to `/dashboard?role={ROLE}`
- **Regular User Code** → Validates via `secretCodeManager` → Main App

---

### 2. **Stakeholder Dashboard Access - DashboardAccessManager.tsx**
**Location**: `src/components/Dashboard/DashboardAccessManager.tsx`

**Process**:
1. Receives role from URL parameter (`?role=ADMIN`)
2. Shows `PortalLogin` component for that specific role
3. User completes OTP verification
4. Redirects to appropriate dashboard

---

### 3. **Portal Login - PortalLogin.tsx**
**Location**: `src/pages/PortalLogin.tsx`

**Authentication Steps**:
1. **Phone/Email Entry**: User enters contact details
2. **OTP Verification**: 6-digit code verification
3. **Role Assignment**: Based on stakeholder code used
4. **Permission Setup**: Role-specific permissions assigned

**Role-Specific Configurations**:
- **ADMIN**: System administration and management
- **POLICE**: Emergency response and case management  
- **SAFEHOUSE**: Resident management and security
- **MEDICAL**: Patient care and medical services
- **NGO**: Community programs and outreach

---

### 4. **Dashboard Routing - DashboardRouter.tsx**
**Location**: `src/components/Dashboard/DashboardRouter.tsx`

**Role-Based Routing**:
```typescript
switch (role) {
  case 'ADMIN': return <AdminDashboard />
  case 'POLICE': return <PoliceDashboard />
  case 'SAFEHOUSE': return <SafeHouseDashboard />
  case 'MEDICAL': return <MedicalDashboard />
  case 'NGO': return <NGODashboard />
}
```

---

### 5. **Regular User Flow - App.tsx**
**Location**: `src/App.tsx`

**For Regular Users**:
1. Code validation via `secretCodeManager`
2. Access to main SafeLink features
3. No dashboard redirection

---

## Code Examples

### Stakeholder Code Detection
```typescript
// In LoginForm.tsx - handleSubmit()
if (stakeholderCodes[code]) {
  window.location.href = `/dashboard?role=${stakeholderCodes[code]}`;
  return;
}
```

### Role-Based Permissions
```typescript
// In PortalLogin.tsx
const getRolePermissions = (role: string) => {
  const permissions = {
    'ADMIN': ['system_access', 'user_management', 'analytics'],
    'POLICE': ['emergency_alerts', 'case_management', 'location_access'],
    'SAFEHOUSE': ['resident_management', 'access_control', 'security_alerts'],
    'MEDICAL': ['patient_records', 'appointments', 'medical_resources'],
    'NGO': ['program_management', 'community_outreach', 'resource_distribution']
  };
  return permissions[role] || [];
};
```

---

## Security Features

### 1. **Code Validation**
- Stakeholder codes are hardcoded and validated
- Regular user codes use `secretCodeManager` with localStorage
- Input sanitization and formatting

### 2. **OTP Verification**
- Phone number and email verification
- 6-digit OTP system
- Resend functionality with rate limiting

### 3. **Role-Based Access Control**
- Each role has specific permissions
- Dashboard access is role-restricted
- Session management with logout functionality

---

## File Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── LoginForm.tsx          # Main entry point
│   └── Dashboard/
│       ├── DashboardAccessManager.tsx  # Dashboard entry
│       └── DashboardRouter.tsx    # Role-based routing
├── pages/
│   ├── PortalLogin.tsx           # Stakeholder authentication
│   └── DashboardAccess.tsx       # Access management
├── utils/
│   └── secretCode.ts              # Regular user code management
└── App.tsx                       # Main app routing
```

---

## User Experience Flow

### Regular Users:
1. **Login** → Enter 8-character code → **Main App**

### Stakeholders:
1. **Login** → Enter stakeholder code → **Dashboard Portal**
2. **Portal Login** → Phone/Email + OTP → **Role-Specific Dashboard**

### Error Handling:
- Invalid codes show error messages
- Network issues have retry mechanisms
- Access denied for invalid roles

---

## Testing the Flow

### Test Stakeholder Codes:
- `SAFELINK_ADMIN_2024` → Admin Dashboard
- `SAFELINK_POLICE_2024` → Police Dashboard
- `SAFELINK_SAFE_2024` → Safe House Dashboard
- `SAFELINK_MED_2024` → Medical Dashboard
- `SAFELINK_NGO_2024` → NGO Dashboard

### Test Regular User Flow:
- Create a new code via "Create New" button
- Use the generated code to access main app features

---

This documentation shows the complete authentication flow from user entry to dashboard access, with all the security measures and role-based routing in place.
