# Security Specification & Threat Model (TDD)

## 1. Data Invariants
- **Authentication**: A client can read and write only their own records (where `userId` == `request.auth.uid`). No public read or write access is allowed.
- **Identity Invariance**: A user cannot spoof or set `userId` to any other uid except `request.auth.uid`. No profile spoofing is permitted.
- **Immutability of Key IDs**: The `id`, `userId`, and `createdAt` fields are strictly immutable once created.
- **Field & Type Strictness**: The `status` field must strictly be one of `['Pending', 'In Progress', 'Completed']`, and `priority` must match `['Low', 'Medium', 'High']`. All numbers and strings must be size-capped to prevent wallet draining resource exhaustion attacks.
- **Action-based Field Lockdowns**: Users can edit keys, but they cannot forge arbitrary fields or bypass core validations.

---

## 2. The "Dirty Dozen" Payloads (Anti-Patterns)
The following 12 JSON payloads must strictly fail authentication or authorization:

### Payload 1: Spoofed userId on Create (Identity Spoofing)
```json
{
  "id": "req-123",
  "client": "Swiss Air",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "Pending",
  "priority": "High",
  "amount": 250,
  "userId": "SOMEONE_ELSES_ID_HERE",
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 2: Missing Authentication (Anonymity Bypass)
```json
{
  "id": "req-124",
  "client": "Swiss Air",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "Pending",
  "priority": "High",
  "amount": 250,
  "userId": "unauthenticated_user_uid",
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 3: Illegal Status Transition or Random Status (Type Poisoning)
```json
{
  "id": "req-125",
  "client": "Swiss Air",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "APPROVED_WITHOUT_PAYMENT",
  "priority": "High",
  "amount": 250,
  "userId": "user_123",
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 4: Invalid Priority Value (Value Poisoning)
```json
{
  "id": "req-126",
  "client": "Swiss Air",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "Pending",
  "priority": "EXTRA_URGENT_URGENT",
  "amount": 250,
  "userId": "user_123",
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 5: Over-sized Client Name Field (Denial of Wallet String Injection)
```json
{
  "id": "req-127",
  "client": "A extremely long client name exceeding standard bounds to attempt database sizing overflow... [10,000 characters repeating]",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "Pending",
  "priority": "High",
  "amount": 250,
  "userId": "user_123",
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 6: Negative Financial Amount Value
```json
{
  "id": "req-128",
  "client": "Swiss Air",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "Pending",
  "priority": "High",
  "amount": -1000000,
  "userId": "user_123",
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 7: Update of Immutable Field (createdAt Modify Attempt)
```json
{
  "id": "req-123",
  "client": "Swiss Air",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "Pending",
  "priority": "High",
  "amount": 250,
  "userId": "user_123",
  "createdAt": "2020-01-01T00:00:00Z", // Trying to change creation date
  "updatedAt": "request.time"
}
```

### Payload 8: Injection of Unlisted Entity Keys (Ghost Fields)
```json
{
  "id": "req-123",
  "client": "Swiss Air",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "Pending",
  "priority": "High",
  "amount": 250,
  "userId": "user_123",
  "createdAt": "request.time",
  "updatedAt": "request.time",
  "isSuperAdminOverride": true
}
```

### Payload 9: Unvetted Email Claiming Admin Role via Document ID Injection
```json
{
  "id": "admins/malicious_user_uid",
  "email": "attacker@notverified.com",
  "role": "Super Admin"
}
```

### Payload 10: Non-standard Request ID (ID format poisoning)
```json
{
  "id": "req-$$%-ILLEGAL-CHARACTERS",
  "client": "Swiss Air",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "Pending",
  "priority": "High",
  "amount": 250,
  "userId": "user_123",
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 11: Future/Past Creation Timestamp Spoofing (Client Clock Spoofing)
```json
{
  "id": "req-123",
  "client": "Swiss Air",
  "service": "Deep Cleaning",
  "date": "2026-05-30",
  "status": "Pending",
  "priority": "High",
  "amount": 250,
  "userId": "user_123",
  "createdAt": "2030-12-31T23:59:59Z", // Client provided future timestamp
  "updatedAt": "request.time"
}
```

### Payload 12: Updating other client's resource
An attempt by `user_other` to overwrite the existing resource owned by `user_123`.

---

## 3. Test Runner Specification
Tests are conceptualized via unit behaviors expecting standard Firestore Rule rejections. Security assertions are mapped inside `firestore.rules` where:
- All write requests undergo `isValidId(id)` and `isValidRequest(incoming)` checks.
- All write requests verify `incoming().userId == request.auth.uid`.
- Security rules enforce `request.auth.token.email_verified == true`.
