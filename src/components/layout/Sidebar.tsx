import React, { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  KeyRound,
  Send,
  Users,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Radio,
} from 'lucide-react';
import { NavigationSection, PartnerProfile } from '../../types';

interface SidebarProps {
  currentSection: NavigationSection;
  onNavigate: (section: NavigationSection) => void;
  partner: PartnerProfile;
  unreadCount: number;
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenQuickSms: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  partner,
  unreadCount,
  isOpen,
  onCloseMobile,
}) => {
  const [openBilling, setOpenBilling] = useState(
    currentSection.startsWith('billing')
  );
  const [openApi, setOpenApi] = useState(
    currentSection.startsWith('api')
  );
  const [openSms, setOpenSms] = useState(
    currentSection.startsWith('sms')
  );
  const [openSettings, setOpenSettings] = useState(
    currentSection.startsWith('settings')
  );
  const [openContacts, setOpenContacts] = useState(
    currentSection.startsWith('contacts')
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNav = (section: NavigationSection) => {
    onNavigate(section);
    onCloseMobile();
  };

  const isNavActive = (section: NavigationSection) => currentSection === section;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xs`}
      >
        {/* Brand / Logo Area */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shadow-xs shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                SIMConnect
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                SMS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate font-medium">
              Business Partner Portal
            </p>
          </div>
        </div>

        {/* Navigation Items Scrollable Area */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm">
          {/* Main Dashboard item */}
          <button
            onClick={() => handleNav('dashboard-overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left font-medium ${
              currentSection.startsWith('dashboard')
                ? 'text-blue-700 bg-blue-50/90 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard
              className={`w-4 h-4 shrink-0 ${
                currentSection.startsWith('dashboard') ? 'text-blue-600' : 'text-slate-500'
              }`}
            />
            <span className="truncate">Dashboard</span>
          </button>

          {/* Sub items under dashboard if active */}
          {currentSection.startsWith('dashboard') && (
            <div className="pl-9 pr-2 space-y-0.5 pb-2">
              <button
                onClick={() => handleNav('dashboard-overview')}
                className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                  currentSection === 'dashboard-overview'
                    ? 'text-blue-700 font-semibold bg-blue-50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleNav('dashboard-sms-usage')}
                className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                  currentSection === 'dashboard-sms-usage'
                    ? 'text-blue-700 font-semibold bg-blue-50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                SMS Usage
              </button>
              <button
                onClick={() => handleNav('dashboard-delivery')}
                className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                  currentSection === 'dashboard-delivery'
                    ? 'text-blue-700 font-semibold bg-blue-50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Delivery Statistics
              </button>
            </div>
          )}

          {/* Billing Section (Collapsible) */}
          <div>
            <button
              onClick={() => setOpenBilling(!openBilling)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <div className="flex items-center gap-3 truncate">
                <CreditCard className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">Billing</span>
              </div>
              {openBilling ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {openBilling && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                <button
                  onClick={() => handleNav('billing-overview')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('billing-overview')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Billing Management
                </button>
                <button
                  onClick={() => handleNav('billing-usage')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('billing-usage')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Usage / Charges
                </button>
                <button
                  onClick={() => handleNav('billing-transactions')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('billing-transactions')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Transaction Log
                </button>
                <button
                  onClick={() => handleNav('billing-invoices')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('billing-invoices')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Invoices & Statements
                </button>
              </div>
            )}
          </div>

          {/* API Management Section (Collapsible) */}
          <div>
            <button
              onClick={() => setOpenApi(!openApi)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <div className="flex items-center gap-3 truncate">
                <KeyRound className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">API Management</span>
              </div>
              {openApi ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {openApi && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                <button
                  onClick={() => handleNav('api-keys')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('api-keys')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  API Keys
                </button>
                <button
                  onClick={() => handleNav('api-whitelist')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('api-whitelist')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  IP Whitelist
                </button>
                <button
                  onClick={() => handleNav('api-usage')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('api-usage')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  API Usage
                </button>
                <button
                  onClick={() => handleNav('api-docs')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('api-docs')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  API Documentation
                </button>
              </div>
            )}
          </div>

          {/* SMS Management Section (Collapsible) */}
          <div>
            <button
              onClick={() => setOpenSms(!openSms)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <div className="flex items-center gap-3 truncate">
                <Send className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">SMS Management</span>
              </div>
              {openSms ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {openSms && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                <button
                  onClick={() => handleNav('sms-send')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('sms-send')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Send SMS
                </button>
                <button
                  onClick={() => handleNav('sms-bulk')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('sms-bulk')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Bulk SMS
                </button>
                <button
                  onClick={() => handleNav('sms-templates')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('sms-templates')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Templates
                </button>
                <button
                  onClick={() => handleNav('sms-schedule')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('sms-schedule')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Schedule SMS
                </button>
                <button
                  onClick={() => handleNav('sms-sender-ids')}
                  className={`w-full flex items-center justify-between text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('sms-sender-ids')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>Sender ID Status</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                    Review
                  </span>
                </button>
                <button
                  onClick={() => handleNav('sms-bulk-monitor')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('sms-bulk-monitor')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Bulk Monitor
                </button>
                <button
                  onClick={() => handleNav('sms-log')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('sms-log')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  SMS Log
                </button>
                <button
                  onClick={() => handleNav('sms-delivery-reports')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('sms-delivery-reports')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Delivery Reports
                </button>
              </div>
            )}
          </div>

          {/* Contacts Section (Collapsible) */}
          <div>
            <button
              onClick={() => setOpenContacts(!openContacts)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <div className="flex items-center gap-3 truncate">
                <Users className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">Contacts</span>
              </div>
              {openContacts ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {openContacts && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                <button
                  onClick={() => handleNav('contacts-list')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('contacts-list')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Contact List
                </button>
                <button
                  onClick={() => handleNav('contacts-groups')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('contacts-groups')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Contact Groups
                </button>
                <button
                  onClick={() => handleNav('contacts-import')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('contacts-import')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Import Contacts
                </button>
              </div>
            )}
          </div>

          {/* Notifications Item */}
          <button
            onClick={() => handleNav('notifications')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left font-medium ${
              isNavActive('notifications')
                ? 'text-blue-700 bg-blue-50/90 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Bell className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="truncate">Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings Section (Collapsible) */}
          <div>
            <button
              onClick={() => setOpenSettings(!openSettings)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <div className="flex items-center gap-3 truncate">
                <Settings className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">Settings</span>
              </div>
              {openSettings ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {openSettings && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                <button
                  onClick={() => handleNav('settings-profile')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('settings-profile')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Business Profile
                </button>
                <button
                  onClick={() => handleNav('settings-preferences')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('settings-preferences')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Account Preferences
                </button>
                <button
                  onClick={() => handleNav('settings-team')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('settings-team')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  User Access / Team
                </button>
                <button
                  onClick={() => handleNav('settings-security')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('settings-security')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Security Settings
                </button>
                <button
                  onClick={() => handleNav('settings-help')}
                  className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${
                    isNavActive('settings-help')
                      ? 'text-blue-700 font-semibold bg-blue-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Help & Support
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Account Area at bottom of sidebar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white hover:shadow-2xs transition-all border border-transparent hover:border-slate-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs shrink-0">
                IT
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {partner.tradeName}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {partner.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              title="Log Out of Partner Portal"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm p-6 rounded-xl bg-white border border-slate-200 shadow-xl text-slate-800">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Sign Out of Partner Portal?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              You are signed in as <span className="text-slate-800 font-medium">{partner.tradeName}</span> ({partner.email}). In this prototype dashboard, signing out returns you to the active demo session.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleNav('dashboard-overview');
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
