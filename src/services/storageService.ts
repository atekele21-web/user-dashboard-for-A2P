import {
  PartnerProfile,
  AuthorizedSenderId,
  SenderIdRequest,
  SmsMessage,
  BulkBatch,
  Contact,
  ContactGroup,
  SmsTemplate,
  ScheduledMessage,
  ApiKey,
  IpWhitelistEntry,
  BillingTransaction,
  NotificationItem,
  TeamMember,
} from '../types';
import {
  INITIAL_PARTNER_PROFILE,
  INITIAL_AUTHORIZED_SENDER_IDS,
  INITIAL_SENDER_ID_REQUESTS,
  INITIAL_MESSAGES,
  INITIAL_BATCHES,
  INITIAL_CONTACTS,
  INITIAL_CONTACT_GROUPS,
  INITIAL_TEMPLATES,
  INITIAL_SCHEDULED_MESSAGES,
  INITIAL_API_KEYS,
  INITIAL_IP_WHITELIST,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TEAM_MEMBERS,
} from './initialData';

const STORAGE_KEYS = {
  PROFILE: 'simconnect_partner_profile',
  AUTHORIZED_SENDER_IDS: 'simconnect_authorized_sender_ids',
  SENDER_ID_REQUESTS: 'simconnect_sender_id_requests',
  MESSAGES: 'simconnect_messages',
  BATCHES: 'simconnect_batches',
  CONTACTS: 'simconnect_contacts',
  GROUPS: 'simconnect_groups',
  TEMPLATES: 'simconnect_templates',
  SCHEDULED: 'simconnect_scheduled',
  API_KEYS: 'simconnect_api_keys',
  IP_WHITELIST: 'simconnect_ip_whitelist',
  TRANSACTIONS: 'simconnect_transactions',
  NOTIFICATIONS: 'simconnect_notifications',
  TEAM: 'simconnect_team',
};

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore local storage errors in sandboxed environments
  }
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export const StorageService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getProfile(): PartnerProfile {
    return getStoredItem<PartnerProfile>(STORAGE_KEYS.PROFILE, INITIAL_PARTNER_PROFILE);
  },

  updateProfile(profile: Partial<PartnerProfile>): PartnerProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    setStoredItem(STORAGE_KEYS.PROFILE, updated);
    emitChange();
    return updated;
  },

  getAuthorizedSenderIds(): AuthorizedSenderId[] {
    return getStoredItem<AuthorizedSenderId[]>(
      STORAGE_KEYS.AUTHORIZED_SENDER_IDS,
      INITIAL_AUTHORIZED_SENDER_IDS
    );
  },

  getSenderIdRequests(): SenderIdRequest[] {
    return getStoredItem<SenderIdRequest[]>(
      STORAGE_KEYS.SENDER_ID_REQUESTS,
      INITIAL_SENDER_ID_REQUESTS
    );
  },

  submitSenderIdRequest(data: {
    senderId: string;
    businessPurpose: string;
    brandName: string;
    contactPerson: string;
    contactPhone: string;
  }): { success: boolean; request: SenderIdRequest; note: string } {
    const requests = this.getSenderIdRequests();
    const cleanId = data.senderId.trim();

    // Check if duplicate request exists
    const existing = requests.find(
      (r) => r.senderId.toLowerCase() === cleanId.toLowerCase() && r.status !== 'rejected'
    );
    if (existing) {
      throw new Error(`A request for Sender ID "${cleanId}" is already active or in review.`);
    }

    const newRequest: SenderIdRequest = {
      id: `sid_req_${Date.now()}`,
      senderId: cleanId,
      businessPurpose: data.businessPurpose,
      brandName: data.brandName,
      status: 'submitted',
      submissionDate: new Date().toISOString(),
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      reviewNotes: 'Submitted by partner. Queued for SIMConnect preliminary compliance check before Ethio telecom SMMP registration.',
    };

    const updated = [newRequest, ...requests];
    setStoredItem(STORAGE_KEYS.SENDER_ID_REQUESTS, updated);

    // Also add an audit notification
    this.addNotification({
      title: `Sender ID "${cleanId}" Submitted for Review`,
      message: `Your request has been queued. It will undergo SIMConnect compliance review before being submitted to Ethio telecom SMMP.`,
      category: 'sender_id',
      severity: 'info',
    });

    emitChange();
    return {
      success: true,
      request: newRequest,
      note: 'Sender ID submitted for review. It will become active only after Ethio telecom SMMP approval and configuration.',
    };
  },

  getMessages(): SmsMessage[] {
    return getStoredItem<SmsMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  },

  sendSingleSms(data: {
    senderId: string;
    recipient: string;
    messageText: string;
    channel?: 'dashboard' | 'api';
  }): { success: boolean; message: SmsMessage; simulated: boolean; notice: string } {
    // Validation: Sender ID must belong to authorized active sender IDs
    const authorized = this.getAuthorizedSenderIds();
    const isAuthorized = authorized.some(
      (a) => a.senderId.toLowerCase() === data.senderId.toLowerCase() && a.status === 'active'
    );

    if (!isAuthorized) {
      throw new Error(
        `Sender ID "${data.senderId}" is not authorized or configured for this partner account.`
      );
    }

    // Calculate segments and encoding
    const hasUnicode = /[^\u0000-\u007F]/.test(data.messageText);
    const encoding = hasUnicode ? 'UNICODE' : 'GSM_7BIT';
    const singleLimit = hasUnicode ? 70 : 160;
    const multiLimit = hasUnicode ? 67 : 153;
    const charCount = data.messageText.length;
    const segments = charCount <= singleLimit ? 1 : Math.ceil(charCount / multiLimit);

    const profile = this.getProfile();
    const cost = Number((segments * profile.ratePerSmsETB).toFixed(2));

    const newMessage: SmsMessage = {
      id: `msg_${Date.now()}`,
      senderId: data.senderId,
      recipient: data.recipient,
      messageText: data.messageText,
      segments,
      charCount,
      encoding,
      status: 'delivered', // simulated successful acceptance
      channel: data.channel || 'dashboard',
      createdAt: new Date().toISOString(),
      deliveredAt: new Date(Date.now() + 2500).toISOString(),
      costETB: cost,
    };

    const messages = this.getMessages();
    setStoredItem(STORAGE_KEYS.MESSAGES, [newMessage, ...messages]);

    // Record billing deduction transaction
    const transactions = this.getTransactions();
    const newTxn: BillingTransaction = {
      id: `txn_${Date.now()}`,
      reference: `TXN-${Date.now().toString().slice(-8)}`,
      type: 'sms_deduction',
      amountETB: -cost,
      currency: 'ETB',
      status: 'settled',
      description: `Dispatched SMS to ${data.recipient} via ${data.senderId}`,
      date: new Date().toISOString(),
    };
    setStoredItem(STORAGE_KEYS.TRANSACTIONS, [newTxn, ...transactions]);

    // Update partner balance
    this.updateProfile({
      balanceETB: Math.max(0, profile.balanceETB - cost),
    });

    emitChange();

    return {
      success: true,
      message: newMessage,
      simulated: true,
      notice: 'Demo submission recorded in local audit log — no live SMS was sent to carrier.',
    };
  },

  getBatches(): BulkBatch[] {
    return getStoredItem<BulkBatch[]>(STORAGE_KEYS.BATCHES, INITIAL_BATCHES);
  },

  createBulkBatch(data: {
    batchName: string;
    senderId: string;
    recipients: string[];
    messageText: string;
    scheduledAt?: string;
  }): { success: boolean; batch: BulkBatch; notice: string } {
    // Validate Sender ID
    const authorized = this.getAuthorizedSenderIds();
    const isAuthorized = authorized.some(
      (a) => a.senderId.toLowerCase() === data.senderId.toLowerCase() && a.status === 'active'
    );

    if (!isAuthorized) {
      throw new Error(`Sender ID "${data.senderId}" is not authorized or active.`);
    }

    // Validate recipients (Ethiopian mobile phone format validation: +251 9... or +251 7... or 09... or 07...)
    const valid: string[] = [];
    const invalid: string[] = [];

    data.recipients.forEach((num) => {
      const clean = num.trim().replace(/[\s-]/g, '');
      if (/^(\+251|0)(9|7)\d{8}$/.test(clean)) {
        valid.push(clean);
      } else {
        invalid.push(num);
      }
    });

    if (valid.length === 0) {
      throw new Error('No valid Ethiopian mobile numbers found in recipient audience.');
    }

    const hasUnicode = /[^\u0000-\u007F]/.test(data.messageText);
    const singleLimit = hasUnicode ? 70 : 160;
    const multiLimit = hasUnicode ? 67 : 153;
    const charCount = data.messageText.length;
    const segments = charCount <= singleLimit ? 1 : Math.ceil(charCount / multiLimit);
    const profile = this.getProfile();
    const totalCost = Number((valid.length * segments * profile.ratePerSmsETB).toFixed(2));

    const newBatch: BulkBatch = {
      id: `batch_${Date.now()}`,
      batchName: data.batchName,
      senderId: data.senderId,
      totalRecipients: data.recipients.length,
      validRecipients: valid.length,
      invalidRecipients: invalid.length,
      processedRecipients: valid.length,
      deliveredCount: Math.round(valid.length * 0.98),
      failedCount: Math.max(0, valid.length - Math.round(valid.length * 0.98)),
      status: data.scheduledAt ? 'queued' : 'completed',
      scheduledAt: data.scheduledAt,
      createdAt: new Date().toISOString(),
      messagePreview: data.messageText,
    };

    const batches = this.getBatches();
    setStoredItem(STORAGE_KEYS.BATCHES, [newBatch, ...batches]);

    // Record transaction
    const transactions = this.getTransactions();
    const newTxn: BillingTransaction = {
      id: `txn_${Date.now()}`,
      reference: `TXN-BULK-${Date.now().toString().slice(-6)}`,
      type: 'sms_deduction',
      amountETB: -totalCost,
      currency: 'ETB',
      status: 'settled',
      description: `Bulk campaign "${data.batchName}" (${valid.length} recipients)`,
      date: new Date().toISOString(),
    };
    setStoredItem(STORAGE_KEYS.TRANSACTIONS, [newTxn, ...transactions]);

    this.updateProfile({
      balanceETB: Math.max(0, profile.balanceETB - totalCost),
    });

    this.addNotification({
      title: `Bulk Batch "${data.batchName}" Processed`,
      message: `Batch job executed for ${valid.length} valid recipients with Sender ID "${data.senderId}".`,
      category: 'delivery',
      severity: 'success',
    });

    emitChange();

    return {
      success: true,
      batch: newBatch,
      notice: 'Simulated bulk campaign processed — no live SMS messages were dispatched to SMSC.',
    };
  },

  getContacts(): Contact[] {
    return getStoredItem<Contact[]>(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS);
  },

  addContact(contact: Omit<Contact, 'id' | 'createdAt' | 'status'>): Contact {
    const contacts = this.getContacts();
    const cleanPhone = contact.phone.trim().replace(/[\s-]/g, '');
    const isValidPhone = /^(\+251|0)(9|7)\d{8}$/.test(cleanPhone);

    const newContact: Contact = {
      id: `cnt_${Date.now()}`,
      ...contact,
      phone: cleanPhone,
      status: isValidPhone ? 'valid' : 'invalid',
      createdAt: new Date().toISOString(),
    };

    setStoredItem(STORAGE_KEYS.CONTACTS, [newContact, ...contacts]);
    emitChange();
    return newContact;
  },

  deleteContact(id: string): void {
    const contacts = this.getContacts().filter((c) => c.id !== id);
    setStoredItem(STORAGE_KEYS.CONTACTS, contacts);
    emitChange();
  },

  getGroups(): ContactGroup[] {
    return getStoredItem<ContactGroup[]>(STORAGE_KEYS.GROUPS, INITIAL_CONTACT_GROUPS);
  },

  addGroup(name: string, description: string): ContactGroup {
    const groups = this.getGroups();
    const newGroup: ContactGroup = {
      id: `grp_${Date.now()}`,
      name,
      description,
      contactCount: 0,
      createdAt: new Date().toISOString(),
    };
    setStoredItem(STORAGE_KEYS.GROUPS, [...groups, newGroup]);
    emitChange();
    return newGroup;
  },

  getTemplates(): SmsTemplate[] {
    return getStoredItem<SmsTemplate[]>(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
  },

  saveTemplate(template: Omit<SmsTemplate, 'id' | 'updatedAt'> & { id?: string }): SmsTemplate {
    const templates = this.getTemplates();
    const variables = Array.from(template.content.matchAll(/\{\{([^}]+)\}\}/g)).map((m) => m[1]);

    if (template.id) {
      const updated = templates.map((t) =>
        t.id === template.id
          ? { ...t, ...template, variables, updatedAt: new Date().toISOString() }
          : t
      );
      setStoredItem(STORAGE_KEYS.TEMPLATES, updated);
      emitChange();
      return updated.find((t) => t.id === template.id)!;
    } else {
      const newTemplate: SmsTemplate = {
        id: `tmpl_${Date.now()}`,
        ...template,
        variables,
        updatedAt: new Date().toISOString(),
      };
      setStoredItem(STORAGE_KEYS.TEMPLATES, [newTemplate, ...templates]);
      emitChange();
      return newTemplate;
    }
  },

  deleteTemplate(id: string): void {
    const templates = this.getTemplates().filter((t) => t.id !== id);
    setStoredItem(STORAGE_KEYS.TEMPLATES, templates);
    emitChange();
  },

  getScheduledMessages(): ScheduledMessage[] {
    return getStoredItem<ScheduledMessage[]>(STORAGE_KEYS.SCHEDULED, INITIAL_SCHEDULED_MESSAGES);
  },

  cancelScheduledMessage(id: string): void {
    const scheduled = this.getScheduledMessages().map((s) =>
      s.id === id ? { ...s, status: 'cancelled' as const } : s
    );
    setStoredItem(STORAGE_KEYS.SCHEDULED, scheduled);
    emitChange();
  },

  getApiKeys(): ApiKey[] {
    return getStoredItem<ApiKey[]>(STORAGE_KEYS.API_KEYS, INITIAL_API_KEYS);
  },

  generateApiKey(data: { label: string; permissions: string[]; ipRestricted: boolean }): {
    keyRecord: ApiKey;
    plaintextSecret: string;
  } {
    const keys = this.getApiKeys();
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const fullKey = `sim_live_${randomHex}`;
    const masked = `sim_live_${randomHex.slice(0, 4)}••••••••••••••••${randomHex.slice(-4)}`;

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      label: data.label,
      keyPrefix: 'sim_live_',
      maskedKey: masked,
      createdAt: new Date().toISOString(),
      status: 'active',
      permissions: data.permissions,
      ipRestricted: data.ipRestricted,
    };

    setStoredItem(STORAGE_KEYS.API_KEYS, [newKey, ...keys]);
    emitChange();

    return {
      keyRecord: newKey,
      plaintextSecret: fullKey,
    };
  },

  revokeApiKey(id: string): void {
    const keys = this.getApiKeys().map((k) =>
      k.id === id ? { ...k, status: 'revoked' as const } : k
    );
    setStoredItem(STORAGE_KEYS.API_KEYS, keys);
    emitChange();
  },

  getIpWhitelist(): IpWhitelistEntry[] {
    return getStoredItem<IpWhitelistEntry[]>(STORAGE_KEYS.IP_WHITELIST, INITIAL_IP_WHITELIST);
  },

  addIpWhitelist(data: { ipAddress: string; label: string; description: string }): IpWhitelistEntry {
    const current = this.getIpWhitelist();
    const newEntry: IpWhitelistEntry = {
      id: `ip_${Date.now()}`,
      ipAddress: data.ipAddress.trim(),
      label: data.label.trim(),
      addedAt: new Date().toISOString(),
      status: 'active',
      description: data.description.trim(),
    };
    setStoredItem(STORAGE_KEYS.IP_WHITELIST, [...current, newEntry]);
    emitChange();
    return newEntry;
  },

  removeIpWhitelist(id: string): void {
    const current = this.getIpWhitelist().filter((e) => e.id !== id);
    setStoredItem(STORAGE_KEYS.IP_WHITELIST, current);
    emitChange();
  },

  getTransactions(): BillingTransaction[] {
    return getStoredItem<BillingTransaction[]>(
      STORAGE_KEYS.TRANSACTIONS,
      INITIAL_TRANSACTIONS
    );
  },

  getNotifications(): NotificationItem[] {
    return getStoredItem<NotificationItem[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_NOTIFICATIONS
    );
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = this.getNotifications();
    const newItem: NotificationItem = {
      id: `notif_${Date.now()}`,
      ...notif,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, [newItem, ...list]);
    emitChange();
    return newItem;
  },

  markNotificationRead(id: string): void {
    const list = this.getNotifications().map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, list);
    emitChange();
  },

  markAllNotificationsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, list);
    emitChange();
  },

  getTeamMembers(): TeamMember[] {
    return getStoredItem<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM_MEMBERS);
  },

  resetToDemoDefaults(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
    emitChange();
  },
};
