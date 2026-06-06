# Security Specification: shared_photos

## 1. Data Invariants
- **Collection**: `/shared_photos/{photoId}`
- **Path variables**: `photoId` must be a valid ID representing the tourist spot (e.g. `chimei_shuangxin`).
- **Required fields**: Each document must contain:
  - `id`: string (must match the document ID)
  - `spotId`: string (must match the document ID)
  - `photoData`: string (compressed image Base64 format, maximum size of 200KB to safeguard Firestore performance and document limits)
  - `uploadedAt`: timestamp (must be equal to the request time)

## 2. Invalidation and "Dirty Dozen" Threat Payloads
The following payloads must be rejected by `firestore.rules`:
1. **Unsigned-in Write (when restricted)** / **Invalid ID injection**: Document ID is wider than 128 characters or contains malicious characters.
2. **Missing required fields**: Creating a photo document with no `photoData` field.
3. **Invalid Photo ID vs spotId**: A document where the `id` field does not match the document ID `photoId`.
4. **Data size abuse**: `photoData` field contains a payload larger than 200KB characters to trigger denial-of-wallet billing.
5. **Timestamp spoofing**: The `uploadedAt` field is set to a timestamp in the future or past instead of `request.time`.
6. **Immutable field tampering**: An update attempting to change the underlying `spotId` or `id` once created.
7. **Type pollution**: `photoData` containing a boolean or number instead of a string.
8. **Malicious spotIds**: `spotId` set to non-existent or unsupported characters.

## 3. Rules Matrix & Access Policies
- **Read**: Allow read requests without auth so all users can see everyone's photos.
- **Write**: Allow create and update requests if they satisfy the validation constraints (`isValidSharedPhoto`).
