# Specification

## Summary
**Goal:** Allow authorized users to view the total number of registered members.

**Planned changes:**
- Add a new backend query method (e.g., `getMemberCount`) that returns the total number of registered users by counting entries in the existing `profiles` in-memory map, with authentication required.
- Add a React Query hook to fetch and cache the member count from the backend actor under a stable query key (e.g., `['memberCount']`) and only run when the actor is ready.
- Update the Employer Dashboard page to show a small stats card near the top labeled "Total members" with loading placeholder behavior and a safe fallback on errors.

**User-visible outcome:** The Employer Dashboard displays a "Total members" stat showing the current total registered user count, with appropriate loading and error-safe behavior.
