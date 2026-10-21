import React from 'react';
import { Menu, Send, Bell } from 'lucide-react';
import { NavigationSection, PartnerProfile } from '../../types';

interface HeaderProps {
  currentSection: NavigationSection;
  onToggleSidebar: () => void;
  onOpenQuickSms: () => void;
  onNavigate: (section: NavigationSection) => void;
  unreadCount: number;
  partner: PartnerProfile;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onToggleSidebar,
  onOpenQuickSms,
  onNavigate,
  unreadCount,
}) => {
  const getSectionTitle = () => {
    switch (currentSection) {
      case 'dashboard-overview':
        return 'Dashboards';
      case 'dashboard-sms-usage':
        return 'SMS Usage Analytics';
      case 'dashboard-delivery':
        return 'Delivery Statistics';
      case 'billing-overview':
        return 'Billing Management';
      case 'billing-usage':
        return 'Usage & Charges';
      case 'billing-transactions':
        return 'Transaction Log';
      case 'billing-invoices':
        return 'Invoices & Statements';
      case 'api-keys':
        return 'API Keys';
      case 'api-whitelist':
        return 'IP Whitelist';
      case 'api-usage':
        return 'API Usage';
      case 'api-docs':
        return 'API Documentation';
      case 'sms-send':
        return 'Send SMS';
      case 'sms-bulk':
        return 'Bulk SMS';
      case 'sms-templates':
        return 'SMS Templates';
      case 'sms-schedule':
        return 'Scheduled SMS';
      case 'sms-sender-ids':
        return 'Sender ID Requests & Approval';
      case 'sms-bulk-monitor':
        return 'Bulk Monitor';
      case 'sms-log':
        return 'SMS Log';
      case 'sms-delivery-reports':
        return 'Delivery Reports';
      case 'contacts-list':
        return 'Contacts List';
      case 'contacts-groups':
        return 'Contact Groups';
      case 'contacts-import':
        return 'Import Contacts';
      case 'notifications':
        return 'Notifications';
      case 'settings-profile':
        return 'Business Profile';
      case 'settings-preferences':
        return 'Account Preferences';
      case 'settings-team':
        return 'Team Access';
      case 'settings-security':
        return 'Security Settings';
      case 'settings-help':
        return 'Help & Documentation';
      default:
        return 'Partner Portal';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Left zone: Sidebar toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">Portal</span>
          <span className="text-xs text-slate-300 hidden sm:inline">/</span>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">
            {getSectionTitle()}
          </h1>
        </div>
      </div>

      {/* Right zone: Environment badge + Notifications + Quick SMS CTA */}
      <div className="flex items-center gap-3">
        {/* Environment Notice Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-slate-400">Environment:</span>
          <span className="font-semibold text-slate-700">Demo Prototype</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigate('notifications')}
          aria-label="View notifications"
          className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>

        {/* Quick SMS CTA Button - Professional Blue with crisp white text */}
        <button
          onClick={onOpenQuickSms}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs hover:shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 fill-current" />
          <span>Quick SMS</span>
        </button>
      </div>
    </header>
  );
};
