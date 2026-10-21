export type NavigationSection =
  | 'dashboard-overview'
  | 'dashboard-sms-usage'
  | 'dashboard-delivery'
  | 'billing-overview'
  | 'billing-usage'
  | 'billing-transactions'
  | 'billing-invoices'
  | 'api-keys'
  | 'api-whitelist'
  | 'api-usage'
  | 'api-docs'
  | 'sms-send'
  | 'sms-bulk'
  | 'sms-templates'
  | 'sms-schedule'
  | 'sms-sender-ids'
  | 'sms-bulk-monitor'
  | 'sms-log'
  | 'sms-delivery-reports'
  | 'contacts-list'
  | 'contacts-groups'
  | 'contacts-import'
  | 'notifications'
  | 'settings-profile'
  | 'settings-preferences'
  | 'settings-team'
  | 'settings-security'
  | 'settings-help';

export type SenderIdStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'pending_external_approval' // Ethio telecom SMMP
  | 'approved_configured'
  | 'rejected'
  | 'suspended';

export interface SenderIdRequest {
  id: string;
  senderId: string;
  businessPurpose: string;
  brandName: string;
  status: SenderIdStatus;
  rejectionReason?: string;
  submissionDate: string;
  externalApprovalDate?: string;
  smmpJobRef?: string;
  reviewNotes?: string;
  contactPerson: string;
  contactPhone: string;
}

export interface AuthorizedSenderId {
  id: string;
  senderId: string;
  status: 'active' | 'suspended';
  channelType: 'promotional' | 'transactional' | 'otp';
  configuredAt: string;
  dailyQuota?: number;
}

export type SmsStatus =
  | 'submitted'
  | 'dispatched'
  | 'delivered'
  | 'failed'
  | 'buffered';

export interface SmsMessage {
  id: string;
  senderId: string;
  recipient: string;
  messageText: string;
  segments: number;
  charCount: number;
  encoding: 'GSM_7BIT' | 'UNICODE';
  status: SmsStatus;
  failureReason?: string;
  channel: 'api' | 'dashboard';
  createdAt: string;
  deliveredAt?: string;
  costETB: number;
}

export interface BulkBatch {
  id: string;
  batchName: string;
  senderId: string;
  totalRecipients: number;
  validRecipients: number;
  invalidRecipients: number;
  processedRecipients: number;
  deliveredCount: number;
  failedCount: number;
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'cancelled';
  scheduledAt?: string;
  createdAt: string;
  messagePreview: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  groupIds: string[];
  createdAt: string;
  status: 'valid' | 'invalid';
}

export interface ContactGroup {
  id: string;
  name: string;
  description: string;
  contactCount: number;
  createdAt: string;
}

export interface SmsTemplate {
  id: string;
  title: string;
  category: 'OTP/Authentication' | 'Transaction Alert' | 'Promotional' | 'Notification' | 'Appointment';
  content: string;
  variables: string[];
  updatedAt: string;
}

export interface ScheduledMessage {
  id: string;
  senderId: string;
  recipientOrGroup: string;
  type: 'single' | 'bulk';
  scheduledTime: string;
  messageText: string;
  status: 'scheduled' | 'processing' | 'sent' | 'cancelled';
  timeZone: string;
}

export interface ApiKey {
  id: string;
  label: string;
  keyPrefix: string;
  maskedKey: string;
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
  permissions: string[];
  ipRestricted: boolean;
}

export interface IpWhitelistEntry {
  id: string;
  ipAddress: string;
  label: string;
  addedAt: string;
  status: 'active' | 'pending_backend_enforcement';
  description: string;
}

export interface BillingTransaction {
  id: string;
  reference: string;
  type: 'credit_recharge' | 'sms_deduction' | 'sender_id_registration' | 'monthly_fee';
  amountETB: number;
  currency: 'ETB';
  status: 'settled' | 'pending' | 'failed';
  description: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'sender_id' | 'system' | 'delivery' | 'billing';
  timestamp: string;
  read: boolean;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Dispatcher' | 'Developer' | 'Finance';
  status: 'active' | 'invited';
  lastActive: string;
}

export interface PartnerProfile {
  id: string;
  tradeName: string;
  registeredName: string;
  tin: string;
  email: string;
  phone: string;
  status: 'approved' | 'pending_kyc' | 'suspended';
  balanceETB: number;
  tier: 'Enterprise Partner' | 'Standard Partner' | 'Growth Partner';
  contactPerson: string;
  registeredAddress: string;
  city: string;
  country: string;
  defaultSenderId: string;
  ratePerSmsETB: number;
}
