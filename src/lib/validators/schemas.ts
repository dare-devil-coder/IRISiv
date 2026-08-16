import { z } from 'zod';

export const CreateProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  category: z.string().min(2, 'Category required').max(50),
  location: z.string().min(2, 'Location required').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  target_quantity: z.number().int().min(1, 'Target quantity must be at least 1').max(1000000).optional(),
  beneficiaries_impacted: z.number().int().min(1, 'Beneficiaries count must be positive').max(1000000).optional(),
  beneficiaries: z.number().int().min(1).max(1000000).optional(),
  estimated_budget: z.number().positive('Estimated budget must be greater than zero').max(100000000),
  target_unit: z.string().max(50).optional(),
  deadline: z.string().optional(),
  ngo_organization_id: z.string().min(1, 'NGO organization ID required').optional(),
});

export const CreateTenderSchema = z.object({
  project_id: z.string().min(1, 'Project ID required'),
  title: z.string().min(3).max(255),
  description: z.string().min(10).max(5000),
  domain: z.string().min(2).max(100),
  budget_ceiling: z.number().positive('Budget ceiling must be positive').max(100000000),
  delivery_location: z.string().min(2).max(255),
  delivery_deadline_days: z.number().int().min(1, 'Delivery deadline must be at least 1 day').max(365),
  required_quantity: z.number().int().min(1).max(1000000),
  unit_of_measure: z.string().max(50).optional(),
  technical_specifications: z.string().optional(),
});

export const CreateQuotationSchema = z.object({
  tender_id: z.string().min(1, 'Tender ID required').optional(),
  business_organization_id: z.string().min(1, 'Business organization ID required').optional(),
  bid_amount: z.number().positive('Bid amount must be greater than zero'),
  delivery_timeline_days: z.number().int().min(1, 'Delivery timeline must be at least 1 day').max(365),
  capacity: z.string().max(1000).optional(),
  experience: z.string().max(1000).optional(),
  description: z.string().max(2000).optional(),
  specifications: z.string().max(2000).optional(),
  warranty_terms: z.string().max(1000).optional(),
});

export const SubmitDeliverySchema = z.object({
  quantity_delivered: z.number().int().min(1, 'Quantity delivered must be at least 1'),
  delivery_date: z.string().optional(),
  quality_grade: z.enum(['EXCELLENT', 'SATISFACTORY', 'DEFECTIVE']).optional(),
  batch_number: z.string().max(100).optional(),
  invoice_number: z.string().max(100).optional(),
  lr_challan_number: z.string().max(100).optional(),
  tracking_id: z.string().max(100).optional(),
  comments: z.string().max(2000).optional(),
  business_organization_id: z.string().optional(),
});

export const GroundVerificationSchema = z.object({
  received_quantity: z.number().int().min(0, 'Received quantity cannot be negative'),
  quality_acceptable: z.boolean(),
  packaging_acceptable: z.boolean(),
  delivered_on_time: z.boolean(),
  has_issue: z.boolean().optional(),
  issue_description: z.string().max(2000).optional(),
  comments: z.string().max(2000).optional(),
});

export const CreateReviewSchema = z.object({
  project_id: z.string().min(1, 'Project ID required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(3, 'Review comment must be at least 3 characters').max(1000),
  reviewer_org_id: z.string().min(1, 'Reviewer organization ID required'),
  reviewer_role: z.enum(['NGO', 'CORPORATE', 'BUSINESS', 'ADMIN']),
  target_org_id: z.string().min(1, 'Target organization ID required'),
  target_role: z.enum(['NGO', 'CORPORATE', 'BUSINESS', 'ADMIN']),
}).refine((data) => data.reviewer_org_id !== data.target_org_id, {
  message: 'Cannot submit a review for your own organization',
  path: ['target_org_id'],
});

export const PaymentRecordSchema = z.object({
  payment_type: z.enum(['ADVANCE_20', 'FULFILLMENT_40', 'FINAL_40']),
  amount: z.number().positive('Payment amount must be greater than zero').optional(),
  idempotency_key: z.string().max(100).optional(),
});
