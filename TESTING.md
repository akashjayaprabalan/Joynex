# Testing Guide for Joynex

This guide outlines how to test all features of the Joynex application.

## 🔐 Authentication Testing

### Sign Up Flow
1. Visit `/signup`
2. Try invalid email formats:
   - Non-unimelb email (should show error)
   - Empty email (should show error)
3. Try valid unimelb email:
   ```
   test@student.unimelb.edu.au
   ```
4. Check verification code email
5. Try invalid verification codes:
   - Wrong code (should count attempts)
   - Expired code (should show error)
6. Enter correct verification code
7. Should redirect to Discover page

### Sign In Flow
1. Visit `/signin`
2. Try invalid credentials:
   - Wrong password (should show error)
   - Non-existent email (should show error)
3. Try valid credentials
4. Should redirect to Discover page

## 👥 Group Management Testing

### Create Group
1. Visit `/create`
2. Test form validation:
   - Empty fields (should show errors)
   - Invalid Google Maps link (should show error)
   - Past date (should show error)
   - Max members < 2 (should show error)
3. Submit valid form:
   ```json
   {
     "name": "Test Group",
     "type": "Study",
     "date": "2025-12-31",
     "timeSlot": "14:00",
     "location": "South Lawn",
     "locationLink": "https://maps.google.com/...",
     "maxMembers": 5,
     "contactMethod": "WhatsApp",
     "contactInfo": "0123456789"
   }
   ```
4. Should redirect to My Groups

### Join Group
1. Visit `/discover`
2. Find a group
3. Click Join
4. Check:
   - Group disappears from Discover
   - Group appears in My Groups
   - Member count updates
   - Join notification received
   - Email notification received

### Leave Group
1. Visit `/my-groups`
2. Find a joined group
3. Click Leave
4. Check:
   - Group disappears from My Groups
   - Group reappears in Discover
   - Member count updates

## 🔔 Notifications Testing

### Real-time Notifications
1. Open two browsers (one incognito)
2. Sign in with different accounts
3. Test scenarios:
   - User A creates group → User B should see it in Discover
   - User A joins User B's group → User B should get notification
   - User A leaves group → Member count should update
   - User A updates group → Members should get notification

### Email Notifications
1. Check email delivery for:
   - Verification code
   - Welcome email
   - Group join confirmation
   - Group updates

## 📊 Analytics Testing

1. Enable Google Analytics Debug Mode:
   ```javascript
   localStorage.debug = 'ga:*';
   ```

2. Test event tracking:
   - Page views (all pages)
   - Group creation
   - Group joining
   - Search usage
   - Filter usage

## 🐛 Error Tracking Testing

1. Enable Sentry Debug Mode:
   ```javascript
   Sentry.setDebug(true);
   ```

2. Test error scenarios:
   - Network failures
   - Invalid form submissions
   - Authentication errors
   - Database errors

## 🔄 Real-time Updates Testing

1. Test group updates:
   - Member count updates
   - Group status changes
   - Real-time notifications

2. Test concurrent actions:
   - Multiple users joining
   - Group reaching capacity
   - Group updates while viewing

## 📱 Responsive Design Testing

Test on different devices/screens:
- Desktop (1920×1080)
- Laptop (1366×768)
- Tablet (768×1024)
- Mobile (375×667)

Check:
- Navigation menu
- Group cards layout
- Form responsiveness
- Modal displays
- Notification positioning

## 🔍 Search & Filter Testing

1. Test search functionality:
   - Empty search
   - Partial matches
   - Case sensitivity
   - Special characters

2. Test filters:
   - Group type filter
   - Multiple filters
   - Clear filters
   - Filter persistence

## 🔒 Security Testing

1. Test authentication:
   - Session persistence
   - Token expiration
   - Protected routes
   - Email domain validation

2. Test permissions:
   - Group ownership checks
   - Member-only actions
   - Route protection

## 📋 Testing Checklist

### Authentication
- [ ] Sign up with valid email
- [ ] Email verification
- [ ] Sign in
- [ ] Sign out
- [ ] Password validation
- [ ] Email domain validation

### Groups
- [ ] Create group
- [ ] Join group
- [ ] Leave group
- [ ] View members
- [ ] Update group
- [ ] Delete group
- [ ] Member count updates

### Notifications
- [ ] Real-time notifications
- [ ] Email notifications
- [ ] Notification bell updates
- [ ] Mark as read functionality
- [ ] Notification persistence

### Analytics
- [ ] Page view tracking
- [ ] Event tracking
- [ ] User engagement metrics
- [ ] Filter usage tracking
- [ ] Search tracking

### Error Handling
- [ ] Form validation errors
- [ ] API error handling
- [ ] Network error handling
- [ ] Authentication errors
- [ ] Database errors

### UI/UX
- [ ] Responsive design
- [ ] Loading states
- [ ] Error messages
- [ ] Success messages
- [ ] Navigation
- [ ] Modal behavior

## 🚀 Deployment Testing

### Pre-deployment
1. Run build:
   ```bash
   npm run build
   ```
2. Check build output
3. Test with preview:
   ```bash
   npm run preview
   ```

### Post-deployment
1. Check all environment variables
2. Verify all API endpoints
3. Test all features in production
4. Monitor error tracking
5. Verify analytics
6. Check email delivery

## 📝 Bug Reporting Template

When reporting bugs, include:

```markdown
### Description
[Brief description of the bug]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [e.g., Chrome 98]
- OS: [e.g., Windows 10]
- Screen Size: [e.g., 1920×1080]

### Additional Context
[Screenshots, error messages, etc.]
```

## 🔄 Continuous Integration

The CI pipeline will automatically:
1. Run ESLint
2. Build the project
3. Run tests (when added)
4. Deploy to Vercel (on main branch)

To test CI:
1. Make a change
2. Create a pull request
3. Check GitHub Actions
4. Verify deployment preview

---

Remember to:
- Test in multiple browsers
- Test on different devices
- Test with different network conditions
- Document any bugs found
- Update tests when adding features
