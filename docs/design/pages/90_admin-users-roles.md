# Screen Prompt: Admin - Users & Roles

## Screen ID
`ADMIN-USERS`

## Route
- Users: `/admin/users`
- Roles: `/admin/roles`
- User Detail: `/admin/users/:id`

## Purpose
System administration for user account management, role assignment, and permission configuration. Enforces multi-tenant isolation and site-based data access control.

## Workflows
Security & Governance

## Requirements
21 CFR Part 11 (user identity management for e-signatures), RBAC + site-based permissions

## Users List

| Column | Content |
|---|---|
| User ID | Mono ID |
| Full Name | Display name |
| Email | Email address |
| Role(s) | Badge list of assigned roles |
| Site(s) | Assigned sites |
| Status | Active / Inactive / Locked |
| Last Login | Date/time |
| Actions | Edit, Deactivate, Reset Password |

Filters: Search, Role, Site, Status

## User Detail / Create

### User Information

| Field | Type | Required |
|---|---|---|
| Username | Text | Yes (immutable after creation) |
| Full Name (EN) | Text | Yes |
| Full Name (CN) | Text | Yes |
| Email | Email | Yes |
| Phone | Phone | No |
| Status | Select | Yes (Active / Inactive) |

### Role Assignment

```
+---------------------------------------------------------------------+
| Assigned Roles                                    [+ Assign Role]    |
+---------------------------------------------------------------------+
| Role                    | Scope          | Assigned By | Date        |
+-------------------------+----------------+-------------+-------------+
| Supply Chain Manager    | All Sites      | Admin       | 2024-01-15  |
| Procurement Reviewer    | Site: Shanghai | Admin       | 2024-01-15  |
+-------------------------+----------------+-------------+-------------+
```

Scope: All Sites or specific site(s)

### Site Access

```
+---------------------------------------------------------------------+
| Site Access                                        [+ Add Site]      |
+---------------------------------------------------------------------+
| Site              | Legal Entity    | Access Level | Active          |
+-------------------+-----------------+--------------+-----------------+
| Shanghai HQ       | Agilis CN       | Full         | ✓              |
| Beijing Factory   | Agilis CN       | Read Only    | ✓              |
+-------------------+-----------------+--------------+-----------------+
```

### Security Settings
- Force password change on next login (toggle)
- Account lockout after N failed attempts (display current policy)
- Last password change date
- E-signature history: count of signatures, last signature timestamp

### Audit Trail
- All account changes tracked: role changes, site access changes, status changes, password resets

## Roles Management

| Column | Content |
|---|---|
| Role Name | Role identifier |
| Description | Role description |
| Users | Count of users with this role |
| Permissions | Count of assigned permissions |
| Actions | Edit, Clone, Delete (if no users) |

### Role Detail

- Role name, description
- Permissions matrix: grid of modules x actions (View, Create, Edit, Delete, Approve, Export)
- Checkboxes for each permission
- Preset templates: Admin, Manager, Operator, Viewer

```
+---------------------------------------------------------------------+
| Permissions: Supply Chain Manager                                    |
+---------------------------------------------------------------------+
| Module          | View | Create | Edit | Delete | Approve | Export  |
+-----------------+------+--------+------+--------+---------+---------+
| Purchase Req.   | ✓    | ✓      | ✓    | ✓      | ✓       | ✓      |
| Purchase Orders | ✓    | ✓      | ✓    | ☐      | ✓       | ✓      |
| RFQ             | ✓    | ✓      | ✓    | ☐      | ✓       | ✓      |
| Inventory       | ✓    | ☐      | ☐    | ☐      | ☐       | ✓      |
| Work Orders     | ✓    | ☐      | ☐    | ☐      | ☐       | ✓      |
| ...             |      |        |      |        |         |         |
+-----------------+------+--------+------+--------+---------+---------+
```
