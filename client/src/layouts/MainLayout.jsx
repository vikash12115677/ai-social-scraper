import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import TranslationModal from '../components/common/TranslationModal';
import ScrapeStatusBar from '../components/common/ScrapeStatusBar';

export default function MainLayout() {
  const { sidebarOpen, translationModal, scrapeStatus } = useSelector((s) => s.ui);

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Navbar />

        {/* Scrape status banner */}
        {scrapeStatus && <ScrapeStatusBar status={scrapeStatus} />}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Translation Modal */}
      {translationModal.open && <TranslationModal />}
    </div>
  );
}
