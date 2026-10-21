import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { QuickSmsModal } from './components/layout/QuickSmsModal';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { SmsUsageView } from './components/dashboard/SmsUsageView';
import { DeliveryStatsView } from './components/dashboard/DeliveryStatsView';
import { SendSmsView } from './components/sms/SendSmsView';
import { BulkSmsView } from './components/sms/BulkSmsView';
import { BulkMonitorView } from './components/sms/BulkMonitorView';
import { TemplatesView } from './components/sms/TemplatesView';
import { ScheduleSmsView } from './components/sms/ScheduleSmsView';
import { SenderIdView } from './components/sms/SenderIdView';
import { SmsLogView } from './components/sms/SmsLogView';
import { DeliveryReportsView } from './components/sms/DeliveryReportsView';
import { ApiKeysView } from './components/api/ApiKeysView';
import { IpWhitelistView } from './components/api/IpWhitelistView';
import { ApiUsageView } from './components/api/ApiUsageView';
import { ApiDocsView } from './components/api/ApiDocsView';
import { BillingOverviewView } from './components/billing/BillingOverviewView';
import { UsageChargesView } from './components/billing/UsageChargesView';
import { TransactionLogView } from './components/billing/TransactionLogView';
import { InvoicesView } from './components/billing/InvoicesView';
import { ContactsView } from './components/contacts/ContactsView';
import { ContactGroupsView } from './components/contacts/ContactGroupsView';
import { ImportContactsView } from './components/contacts/ImportContactsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { BusinessProfileView } from './components/settings/BusinessProfileView';
import { AccountPreferencesView } from './components/settings/AccountPreferencesView';
import { TeamMembersView } from './components/settings/TeamMembersView';
import { SecuritySettingsView } from './components/settings/SecuritySettingsView';
import { HelpSupportView } from './components/settings/HelpSupportView';

import { StorageService } from './services/storageService';
import { NavigationSection } from './types';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard-overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickSmsOpen, setQuickSmsOpen] = useState(false);

  // Reactive state loaded from StorageService
  const [partner, setPartner] = useState(StorageService.getProfile());
  const [authorizedSenderIds, setAuthorizedSenderIds] = useState(StorageService.getAuthorizedSenderIds());
  const [senderIdRequests, setSenderIdRequests] = useState(StorageService.getSenderIdRequests());
  const [messages, setMessages] = useState(StorageService.getMessages());
  const [batches, setBatches] = useState(StorageService.getBatches());
  const [contacts, setContacts] = useState(StorageService.getContacts());
  const [groups, setGroups] = useState(StorageService.getGroups());
  const [templates, setTemplates] = useState(StorageService.getTemplates());
  const [scheduled, setScheduled] = useState(StorageService.getScheduledMessages());
  const [apiKeys, setApiKeys] = useState(StorageService.getApiKeys());
  const [ipWhitelist, setIpWhitelist] = useState(StorageService.getIpWhitelist());
  const [transactions, setTransactions] = useState(StorageService.getTransactions());
  const [notifications, setNotifications] = useState(StorageService.getNotifications());

  const reloadData = () => {
    setPartner(StorageService.getProfile());
    setAuthorizedSenderIds(StorageService.getAuthorizedSenderIds());
    setSenderIdRequests(StorageService.getSenderIdRequests());
    setMessages(StorageService.getMessages());
    setBatches(StorageService.getBatches());
    setContacts(StorageService.getContacts());
    setGroups(StorageService.getGroups());
    setTemplates(StorageService.getTemplates());
    setScheduled(StorageService.getScheduledMessages());
    setApiKeys(StorageService.getApiKeys());
    setIpWhitelist(StorageService.getIpWhitelist());
    setTransactions(StorageService.getTransactions());
    setNotifications(StorageService.getNotifications());
  };

  useEffect(() => {
    const unsubscribe = StorageService.subscribe(reloadData);
    return () => unsubscribe();
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard-overview':
        return (
          <DashboardOverview
            partner={partner}
            messages={messages}
            authorizedSenderIds={authorizedSenderIds}
            senderIdRequests={senderIdRequests}
            contactsCount={contacts.length}
            onNavigate={(sec) => setCurrentSection(sec)}
            onOpenQuickSms={() => setQuickSmsOpen(true)}
          />
        );
      case 'dashboard-sms-usage':
        return <SmsUsageView messages={messages} partner={partner} />;
      case 'dashboard-delivery':
        return <DeliveryStatsView messages={messages} />;

      // SMS Management
      case 'sms-send':
        return (
          <SendSmsView
            authorizedSenderIds={authorizedSenderIds}
            templates={templates}
            onMessageSent={reloadData}
          />
        );
      case 'sms-bulk':
        return (
          <BulkSmsView
            authorizedSenderIds={authorizedSenderIds}
            contactGroups={groups}
            onBatchCreated={reloadData}
          />
        );
      case 'sms-bulk-monitor':
        return <BulkMonitorView batches={batches} />;
      case 'sms-templates':
        return <TemplatesView templates={templates} onUpdate={reloadData} />;
      case 'sms-schedule':
        return <ScheduleSmsView scheduledMessages={scheduled} onUpdate={reloadData} />;
      case 'sms-sender-ids':
        return (
          <SenderIdView
            senderIdRequests={senderIdRequests}
            authorizedSenderIds={authorizedSenderIds}
            onUpdate={reloadData}
          />
        );
      case 'sms-log':
        return <SmsLogView messages={messages} />;
      case 'sms-delivery-reports':
        return <DeliveryReportsView messages={messages} />;

      // API Management
      case 'api-keys':
        return <ApiKeysView apiKeys={apiKeys} onUpdate={reloadData} />;
      case 'api-whitelist':
        return <IpWhitelistView whitelist={ipWhitelist} onUpdate={reloadData} />;
      case 'api-usage':
        return <ApiUsageView messages={messages} />;
      case 'api-docs':
        return <ApiDocsView />;

      // Billing
      case 'billing-overview':
        return <BillingOverviewView partner={partner} transactions={transactions} />;
      case 'billing-usage':
        return <UsageChargesView partner={partner} messages={messages} />;
      case 'billing-transactions':
        return <TransactionLogView transactions={transactions} />;
      case 'billing-invoices':
        return <InvoicesView partner={partner} />;

      // Contacts
      case 'contacts-list':
        return <ContactsView contacts={contacts} groups={groups} onUpdate={reloadData} />;
      case 'contacts-groups':
        return <ContactGroupsView groups={groups} onUpdate={reloadData} />;
      case 'contacts-import':
        return <ImportContactsView onUpdate={reloadData} />;

      // Notifications
      case 'notifications':
        return <NotificationsView notifications={notifications} onUpdate={reloadData} />;

      // Settings
      case 'settings-profile':
        return <BusinessProfileView partner={partner} onUpdate={reloadData} />;
      case 'settings-preferences':
        return (
          <AccountPreferencesView
            partner={partner}
            authorizedSenderIds={authorizedSenderIds}
            onUpdate={reloadData}
          />
        );
      case 'settings-team':
        return <TeamMembersView />;
      case 'settings-security':
        return <SecuritySettingsView />;
      case 'settings-help':
        return <HelpSupportView />;

      default:
        return (
          <DashboardOverview
            partner={partner}
            messages={messages}
            authorizedSenderIds={authorizedSenderIds}
            senderIdRequests={senderIdRequests}
            contactsCount={contacts.length}
            onNavigate={(sec) => setCurrentSection(sec)}
            onOpenQuickSms={() => setQuickSmsOpen(true)}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
        {/* Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onNavigate={(sec) => setCurrentSection(sec)}
          partner={partner}
          unreadCount={unreadNotifications}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          onOpenQuickSms={() => setQuickSmsOpen(true)}
        />

        {/* Main Workspace Frame */}
        <div className="flex flex-col flex-1 lg:pl-64 transition-all duration-200">
          <Header
            currentSection={currentSection}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onOpenQuickSms={() => setQuickSmsOpen(true)}
            onNavigate={(sec) => setCurrentSection(sec)}
            unreadCount={unreadNotifications}
            partner={partner}
          />

          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderContent()}
          </main>
        </div>

        {/* Quick SMS Overlay Modal */}
        <QuickSmsModal
          isOpen={quickSmsOpen}
          onClose={() => setQuickSmsOpen(false)}
          authorizedSenderIds={authorizedSenderIds}
          onMessageSent={reloadData}
        />
      </div>
    </ErrorBoundary>
  );
}
