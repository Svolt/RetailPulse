/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { CommandPalette } from './components/common/CommandPalette';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { InvoiceUploadModal } from './components/retailer/InvoiceUploadModal';
import { InvoiceClaimsView } from './components/retailer/InvoiceClaimsView';
import { PointsWalletView } from './components/retailer/PointsWalletView';
import { RewardsCatalogueView } from './components/retailer/RewardsCatalogueView';
import { MyOrdersView } from './components/retailer/MyOrdersView';
import { PaymentsView } from './components/retailer/PaymentsView';
import { PerformanceView } from './components/retailer/PerformanceView';
import { TasksTrainingView } from './components/retailer/TasksTrainingView';
import { StoreProfileKycView } from './components/retailer/StoreProfileKycView';
import { SupportTicketsView } from './components/retailer/SupportTicketsView';
import { RetailerDirectory } from './components/crm/RetailerDirectory';
import { ClaimsReviewQueue } from './components/crm/ClaimsReviewQueue';
import { PayoutOperations } from './components/crm/PayoutOperations';
import { RulesEngineSimulator } from './components/crm/RulesEngineSimulator';
import { CampaignsManager } from './components/crm/CampaignsManager';
import { AuditLogView } from './components/crm/AuditLogView';
import { UserManagementView } from './components/crm/UserManagementView';
import { ExperienceStudioView } from './components/crm/ExperienceStudioView';
import { AuthModal } from './components/auth/AuthModal';

const MainContent: React.FC = () => {
  const { activeNav, isAuthModalOpen, setIsAuthModalOpen } = useApp();

  const renderCurrentView = () => {
    switch (activeNav) {
      case 'overview':
        return <OverviewDashboard />;
      case 'invoices':
        return <InvoiceClaimsView />;
      case 'wallet':
        return <PointsWalletView />;
      case 'rewards':
        return <RewardsCatalogueView />;
      case 'orders':
        return <MyOrdersView />;
      case 'payments':
        return <PaymentsView />;
      case 'performance':
        return <PerformanceView />;
      case 'tasks':
        return <TasksTrainingView />;
      case 'profile':
        return <StoreProfileKycView />;
      case 'tickets':
        return <SupportTicketsView />;
      case 'crm-users':
        return <UserManagementView />;
      case 'crm-experience':
        return <ExperienceStudioView />;
      case 'crm-retailers':
        return <RetailerDirectory />;
      case 'crm-claims':
        return <ClaimsReviewQueue />;
      case 'crm-payouts':
        return <PayoutOperations />;
      case 'crm-rules':
        return <RulesEngineSimulator />;
      case 'crm-campaigns':
        return <CampaignsManager />;
      case 'crm-audit':
        return <AuditLogView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F3]">
      <Header />
      <div className="flex-1 flex w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <CommandPalette />
      <InvoiceUploadModal />
      <NotificationDrawer />
      <MobileNav />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}
