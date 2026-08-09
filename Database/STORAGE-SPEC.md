# IRISiv — Storage Specification

Use Supabase Storage for project evidence.

## Bucket

Recommended bucket:

`project-evidence`

Set it private unless the frontend explicitly requires public access.

## Object path convention

Recommended:

`projects/{project_id}/deliveries/{delivery_id}/{uuid}-{safe_filename}`

Do not use user-controlled filenames as the complete object key.

## Database relationship

The `evidence.storage_path` column stores the object path.

The binary file is stored in Supabase Storage.

## Metadata

Store in `evidence`:

- storage_path
- file_name
- mime_type
- evidence_type
- uploaded_by
- delivery_id
- created_at

## Access

Only authorized project participants may read relevant evidence.

Selected business may upload evidence for its own delivery.

NGO may read evidence required for verification.

Corporate may read evidence required for review.

Unrelated users must receive no access.

## Security

- Validate MIME type and size at the application layer.
- Do not expose service-role credentials to the frontend.
- Use signed URLs for private objects where required.
- Never construct authorization solely from a filename.
