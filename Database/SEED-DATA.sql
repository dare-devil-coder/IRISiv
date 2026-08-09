-- IRISiv Production Demo Seed Data

-- 1. Create Demo Organizations
INSERT INTO organizations (id, name, organization_type) VALUES
('11111111-1111-1111-1111-111111111111', 'XYZ Foundation', 'NGO'),
('22222222-2222-2222-2222-222222222222', 'ABC Corporation', 'CORPORATE'),
('33333333-3333-3333-3333-333333333331', 'Business A', 'BUSINESS'),
('33333333-3333-3333-3333-333333333332', 'Business B', 'BUSINESS'),
('33333333-3333-3333-3333-333333333333', 'Business C', 'BUSINESS')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Demo Projects in various states
INSERT INTO csr_projects (
  id, project_code, title, category, beneficiaries, estimated_budget, status,
  ngo_organization_id, corporate_organization_id, selected_business_organization_id
) VALUES
(
  '44444444-4444-4444-4444-444444444442',
  'CSR-1022',
  'Clean Water Initiative',
  'Environment',
  2000,
  150000,
  'PROPOSALS_OPEN',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  NULL
),
(
  '44444444-4444-4444-4444-444444444444',
  'CSR-1024',
  'School Kit Distribution',
  'Education',
  500,
  50000,
  'IN_PROGRESS',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333332'
),
(
  '44444444-4444-4444-4444-444444444446',
  'CSR-1026',
  'Solar Panel Installation',
  'Energy',
  1000,
  300000,
  'COMPLETED',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333331'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Add Demo Proposals
INSERT INTO proposals (
  id, project_id, business_organization_id, bid_amount, delivery_timeline_days, status, description
) VALUES
(
  '55555555-5555-5555-5555-555555555551',
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333332',
  48000,
  15,
  'SELECTED',
  'Business B proposal for school kit delivery within 15 days.'
),
(
  '55555555-5555-5555-5555-555555555552',
  '44444444-4444-4444-4444-444444444442',
  '33333333-3333-3333-3333-333333333333',
  145000,
  30,
  'SUBMITTED',
  'Business C proposal for clean water installation.'
)
ON CONFLICT (id) DO NOTHING;
