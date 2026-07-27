/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Creation, INITIAL_CREATIONS } from './types';
import { parseCreationFromUrl } from './utils/share';
import { fetchGlobalCreationsFromCloud, syncCreationToCloud } from './utils/cloudSync';
import LandingScreen, { LandingAnims } from './components/LandingScreen';
import ExploreScreen from './components/ExploreScreen';
import DashboardScreen from './components/DashboardScreen';
import WizardScreen, { WizardAnims } from './components/WizardScreen';
import SuccessScreen from './components/SuccessScreen';
import RecipientFlow from './components/RecipientFlow';

// Story Scrapbook Imports
import ScrapbookDashboard from './components/scrapbook/ScrapbookDashboard';
import ScrapbookWizard from './components/scrapbook/ScrapbookWizard';
import ScrapbookEditor from './components/scrapbook/ScrapbookEditor';
import ScrapbookPreview from './components/scrapbook/ScrapbookPreview';
import ScrapbookPrint from './components/scrapbook/ScrapbookPrint';
import { ScrapbookProject } from './components/scrapbook/types';

// Magazine Imports
import MagazineDashboard from './components/magazine/MagazineDashboard';
import MagazineWizard from './components/magazine/MagazineWizard';
import MagazineEditor from './components/magazine/MagazineEditor';
import MagazinePreview from './components/magazine/MagazinePreview';
import MagazinePrint from './components/magazine/MagazinePrint';
import { MagazineProject } from './components/magazine/types';

// Open When Imports
import OpenWhenDashboard from './components/openwhen/OpenWhenDashboard';
import OpenWhenWizard from './components/openwhen/OpenWhenWizard';
import OpenWhenEditor from './components/openwhen/OpenWhenEditor';
import RecipientOpenView from './components/openwhen/RecipientOpenView';
import { OpenWhenProject } from './components/openwhen/types';

export default function App() {
  const [screen, setScreen] = useState<
    'landing' | 'explore' | 'dashboard' | 'wizard' | 'success' | 'recipient-flow' |
    'scrapbook-dashboard' | 'scrapbook-wizard' | 'scrapbook-editor' | 'scrapbook-preview' |
    'magazine-dashboard' | 'magazine-wizard' | 'magazine-editor' | 'magazine-preview' |
    'openwhen-dashboard' | 'openwhen-wizard' | 'openwhen-editor' | 'openwhen-preview'
  >('landing');

  // Existing Creations States
  const [userCreations, setUserCreations] = useState<Creation[]>([]);
  const [allGlobalCreations, setAllGlobalCreations] = useState<Creation[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('birthday');
  const [editCreationId, setEditCreationId] = useState<string | undefined>(undefined);
  const [activeCreation, setActiveCreation] = useState<Creation | null>(null);

  // Story Scrapbook States
  const [scrapbookProjects, setScrapbookProjects] = useState<ScrapbookProject[]>([]);
  const [activeScrapbookId, setActiveScrapbookId] = useState<string | null>(null);
  const [printScrapbookProject, setPrintScrapbookProject] = useState<ScrapbookProject | null>(null);

  // Magazine States
  const [magazineProjects, setMagazineProjects] = useState<MagazineProject[]>([]);
  const [activeMagazineId, setActiveMagazineId] = useState<string | null>(null);
  const [printMagazineProject, setPrintMagazineProject] = useState<MagazineProject | null>(null);
  const [magazinePreviewSource, setMagazinePreviewSource] = useState<'editor' | 'dashboard' | 'external' | null>(null);
  const [scrapbookPreviewSource, setScrapbookPreviewSource] = useState<'editor' | 'dashboard' | 'external' | null>(null);

  // Open When States
  const [openWhenProjects, setOpenWhenProjects] = useState<OpenWhenProject[]>([]);
  const [activeOpenWhenId, setActiveOpenWhenId] = useState<string | null>(null);

  // Initialize and check URLs
  useEffect(() => {
    // 1. Existing Greeting Card Initialization
    let localCreations: Creation[];
    const saved = localStorage.getItem('memora_user_creations') || localStorage.getItem('wishora_user_creations') || localStorage.getItem('myheartcraft_user_creations');
    if (saved) {
      try {
        localCreations = JSON.parse(saved);
      } catch (e) {
        localCreations = INITIAL_CREATIONS;
      }
    } else {
      localCreations = INITIAL_CREATIONS;
    }
    localStorage.setItem('memora_user_creations', JSON.stringify(localCreations));
    setUserCreations(localCreations);
    setAllGlobalCreations(localCreations);

    fetchGlobalCreationsFromCloud().then(cloudCards => {
      if (cloudCards && cloudCards.length > 0) {
        setAllGlobalCreations(cloudCards);
      }
    });

    // 2. Scrapbook Initialization
    let localScrapbooks: ScrapbookProject[] = [];
    const savedScrapbooks = localStorage.getItem('memora_scrapbook_projects');
    if (savedScrapbooks) {
      try { localScrapbooks = JSON.parse(savedScrapbooks); } catch(e) {}
    }
    setScrapbookProjects(localScrapbooks);

    // 3. Magazine Initialization
    let localMagazines: MagazineProject[] = [];
    const savedMagazines = localStorage.getItem('memora_magazine_projects');
    if (savedMagazines) {
      try { localMagazines = JSON.parse(savedMagazines); } catch(e) {}
    }
    setMagazineProjects(localMagazines);

    // 4. Open When Initialization
    let localOpenWhen: OpenWhenProject[] = [];
    const savedOpenWhen = localStorage.getItem('memora_open_when_projects');
    if (savedOpenWhen) {
      try { localOpenWhen = JSON.parse(savedOpenWhen); } catch(e) {}
    }
    setOpenWhenProjects(localOpenWhen);

    // 5. URL Router checks
    const params = new URLSearchParams(window.location.search);
    const shortData = params.get('g');
    const giftId = params.get('c') || params.get('giftId');
    const sId = params.get('sId') || params.get('s');
    const mId = params.get('mId') || params.get('m');
    const oId = params.get('oId') || params.get('o');

    if (oId) {
      const found = localOpenWhen.find(p => p.id === oId);
      if (found) {
        const updated = { ...found, views: (found.views || 0) + 1 };
        const list = localOpenWhen.map(p => p.id === oId ? updated : p);
        setOpenWhenProjects(list);
        localStorage.setItem('memora_open_when_projects', JSON.stringify(list));
        setActiveOpenWhenId(oId);
        setScreen('openwhen-preview');
      }
    } else if (sId) {
      const found = localScrapbooks.find(p => p.id === sId);
      if (found) {
        const updated = { ...found, views: (found.views || 0) + 1 };
        const list = localScrapbooks.map(p => p.id === sId ? updated : p);
        setScrapbookProjects(list);
        localStorage.setItem('memora_scrapbook_projects', JSON.stringify(list));
        setActiveScrapbookId(sId);
        setScreen('scrapbook-preview');
      }
    } else if (mId) {
      const found = localMagazines.find(p => p.id === mId);
      if (found) {
        const updated = { ...found, views: (found.views || 0) + 1 };
        const list = localMagazines.map(p => p.id === mId ? updated : p);
        setMagazineProjects(list);
        localStorage.setItem('memora_magazine_projects', JSON.stringify(list));
        setActiveMagazineId(mId);
        setScreen('magazine-preview');
      }
    } else if (shortData) {
      const found = parseCreationFromUrl(localCreations);
      if (found) loadCreation(found);
    } else if (giftId) {
      const localFound = localCreations.find(c => c.id === giftId);
      if (localFound) {
        loadCreation(localFound);
      } else {
        fetchGlobalCreationsFromCloud().then(cloudCards => {
          const cloudFound = cloudCards.find(c => c.id === giftId);
          if (cloudFound) {
            loadCreation(cloudFound);
          } else {
            const fallback = parseCreationFromUrl(localCreations);
            if (fallback) loadCreation(fallback);
          }
        });
      }
    }

    function loadCreation(found: Creation) {
      const exists = localCreations.some((c) => c.id === found.id);
      let updatedList: Creation[];
      if (exists) {
        updatedList = localCreations.map((c) =>
          c.id === found.id ? { ...c, views: (c.views || 0) + 1 } : c
        );
      } else {
        const newCard = { ...found, views: (found.views || 0) + 1 };
        updatedList = [newCard, ...localCreations];
      }
      localStorage.setItem('memora_user_creations', JSON.stringify(updatedList));
      setUserCreations(updatedList);
      setActiveCreation(found);
      setScreen('recipient-flow');
      syncCreationToCloud({ ...found, views: (found.views || 0) + 1 });
    }
  }, []);

  // Save creations helper
  const saveCreationsList = (updatedList: Creation[]) => {
    setUserCreations(updatedList);
    localStorage.setItem('memora_user_creations', JSON.stringify(updatedList));
  };

  const handleSaveCreation = (savedCreation: Creation) => {
    let updatedList: Creation[];
    const exists = userCreations.some(c => c.id === savedCreation.id);

    if (exists) {
      updatedList = userCreations.map(c => c.id === savedCreation.id ? savedCreation : c);
    } else {
      updatedList = [savedCreation, ...userCreations];
    }

    saveCreationsList(updatedList);
    setAllGlobalCreations(prev => {
      const gExists = prev.some(c => c.id === savedCreation.id);
      return gExists ? prev.map(c => c.id === savedCreation.id ? savedCreation : c) : [savedCreation, ...prev];
    });

    setActiveCreation(savedCreation);
    setScreen('success');
    syncCreationToCloud(savedCreation);
  };

  const handleDeleteCreation = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this experience?')) {
      const updatedList = userCreations.filter(c => c.id !== id);
      saveCreationsList(updatedList);
    }
  };

  const handleUpdateReplies = (updatedCreation: Creation) => {
    const updatedList = userCreations.map(c => c.id === updatedCreation.id ? updatedCreation : c);
    saveCreationsList(updatedList);
    setActiveCreation(updatedCreation);
    syncCreationToCloud(updatedCreation);
  };

  const handleNavigateToWizard = (templateId: string = 'birthday', editId?: string) => {
    setSelectedTemplateId(templateId);
    setEditCreationId(editId);
    setScreen('wizard');
  };

  // --- Story Scrapbook Handlers ---
  const handleSaveScrapbook = (project: ScrapbookProject) => {
    let updated: ScrapbookProject[];
    const exists = scrapbookProjects.some(p => p.id === project.id);
    if (exists) {
      updated = scrapbookProjects.map(p => p.id === project.id ? project : p);
      setScrapbookProjects(updated);
      localStorage.setItem('memora_scrapbook_projects', JSON.stringify(updated));
      setScreen('scrapbook-dashboard');
    } else {
      updated = [project, ...scrapbookProjects];
      setScrapbookProjects(updated);
      localStorage.setItem('memora_scrapbook_projects', JSON.stringify(updated));
      setActiveScrapbookId(project.id);
      setScreen('scrapbook-editor');
    }
  };

  const handleDeleteScrapbook = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this scrapbook?')) {
      const updated = scrapbookProjects.filter(p => p.id !== id);
      setScrapbookProjects(updated);
      localStorage.setItem('memora_scrapbook_projects', JSON.stringify(updated));
    }
  };

  const handleDuplicateScrapbook = (id: string) => {
    const original = scrapbookProjects.find(p => p.id === id);
    if (original) {
      const dup: ScrapbookProject = {
        ...original,
        id: `scrapbook-${Date.now()}`,
        title: `${original.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'DRAFT',
        views: 0
      };
      const updated = [dup, ...scrapbookProjects];
      setScrapbookProjects(updated);
      localStorage.setItem('memora_scrapbook_projects', JSON.stringify(updated));
    }
  };

  // --- Magazine Handlers ---
  const handleSaveMagazine = (project: MagazineProject) => {
    let updated: MagazineProject[];
    const exists = magazineProjects.some(p => p.id === project.id);
    if (exists) {
      updated = magazineProjects.map(p => p.id === project.id ? project : p);
      setMagazineProjects(updated);
      localStorage.setItem('memora_magazine_projects', JSON.stringify(updated));
      setScreen('magazine-dashboard');
    } else {
      updated = [project, ...magazineProjects];
      setMagazineProjects(updated);
      localStorage.setItem('memora_magazine_projects', JSON.stringify(updated));
      setActiveMagazineId(project.id);
      setScreen('magazine-editor');
    }
  };

  const handleDeleteMagazine = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this magazine?')) {
      const updated = magazineProjects.filter(p => p.id !== id);
      setMagazineProjects(updated);
      localStorage.setItem('memora_magazine_projects', JSON.stringify(updated));
    }
  };

  // --- Open When Handlers ---
  const handleSaveOpenWhen = (project: OpenWhenProject) => {
    let updated: OpenWhenProject[];
    const exists = openWhenProjects.some(p => p.id === project.id);
    if (exists) {
      updated = openWhenProjects.map(p => p.id === project.id ? project : p);
    } else {
      updated = [project, ...openWhenProjects];
    }
    setOpenWhenProjects(updated);
    localStorage.setItem('memora_open_when_projects', JSON.stringify(updated));
    setScreen('openwhen-dashboard');
  };

  const handleDeleteOpenWhen = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this collection?')) {
      const updated = openWhenProjects.filter(p => p.id !== id);
      setOpenWhenProjects(updated);
      localStorage.setItem('memora_open_when_projects', JSON.stringify(updated));
    }
  };

  const handleDuplicateOpenWhen = (id: string) => {
    const original = openWhenProjects.find(p => p.id === id);
    if (original) {
      const dup: OpenWhenProject = {
        ...original,
        id: `openwhen-${Date.now()}`,
        title: `${original.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'DRAFT',
        views: 0
      };
      const updated = [dup, ...openWhenProjects];
      setOpenWhenProjects(updated);
      localStorage.setItem('memora_open_when_projects', JSON.stringify(updated));
    }
  };

  // Handles launching linked surprise keepsake (Card, Scrapbook, or Magazine)
  const handleLaunchLinkedKeepsake = (id: string) => {
    const card = userCreations.find(c => c.id === id);
    if (card) {
      setActiveCreation(card);
      setScreen('recipient-flow');
      return;
    }

    const scrapbook = scrapbookProjects.find(s => s.id === id);
    if (scrapbook) {
      setActiveScrapbookId(id);
      setScreen('scrapbook-preview');
      return;
    }

    const magazine = magazineProjects.find(m => m.id === id);
    if (magazine) {
      setActiveMagazineId(id);
      setScreen('magazine-preview');
      return;
    }
    alert("Surprise keepsake project could not be found.");
  };

  const activeScrapbook = scrapbookProjects.find(p => p.id === activeScrapbookId) || null;
  const activeMagazine = magazineProjects.find(p => p.id === activeMagazineId) || null;
  const activeOpenWhen = openWhenProjects.find(p => p.id === activeOpenWhenId) || null;

  // Compiles all existing creations for envelope linking surprise list
  const getExistingCreationsList = () => {
    const cards = userCreations.map(c => ({ id: c.id, title: c.messageTitle || 'Untitled Card', type: 'Greeting Card' }));
    const mags = magazineProjects.map(m => ({ id: m.id, title: m.title, type: 'Magazine' }));
    const scraps = scrapbookProjects.map(s => ({ id: s.id, title: s.title, type: 'Story Scrapbook' }));
    return [...cards, ...mags, ...scraps];
  };

  return (
    <div className="min-h-screen bg-background text-on-background relative" id="app-root">
      
      {/* Dynamic Screen Routing Render Switch */}
      {screen === 'landing' && (
        <LandingScreen
          onNavigateToExplore={() => setScreen('explore')}
          onNavigateToWizard={(id) => handleNavigateToWizard(id)}
          onNavigateToDashboard={() => setScreen('dashboard')}
          onNavigateToScrapbookDashboard={() => setScreen('scrapbook-dashboard')}
          onNavigateToMagazineDashboard={() => setScreen('magazine-dashboard')}
          onNavigateToOpenWhenDashboard={() => setScreen('openwhen-dashboard')}
        />
      )}

      {screen === 'explore' && (
        <ExploreScreen
          onNavigateToWizard={(id) => handleNavigateToWizard(id)}
          onNavigateToHome={() => setScreen('landing')}
          onNavigateToDashboard={() => setScreen('dashboard')}
          onNavigateToScrapbookWizard={() => setScreen('scrapbook-wizard')}
          onNavigateToMagazineWizard={() => setScreen('magazine-wizard')}
          onNavigateToOpenWhenWizard={() => setScreen('openwhen-wizard')}
        />
      )}

      {screen === 'dashboard' && (
        <DashboardScreen
          creations={userCreations}
          allGlobalCreations={allGlobalCreations}
          onNavigateToExplore={() => setScreen('explore')}
          onNavigateToWizard={(tempId, editId) => handleNavigateToWizard(tempId, editId)}
          onPreviewCreation={(id) => {
            const found = userCreations.find(c => c.id === id) || allGlobalCreations.find(c => c.id === id);
            if (found) {
              setActiveCreation(found);
              setScreen('recipient-flow');
            }
          }}
          onDeleteCreation={handleDeleteCreation}
          onUpdateCreations={(updatedList) => saveCreationsList(updatedList)}
          onUpdateGlobalCreations={(updatedGlobal) => setAllGlobalCreations(updatedGlobal)}
          onNavigateToScrapbookDashboard={() => setScreen('scrapbook-dashboard')}
          onNavigateToMagazineDashboard={() => setScreen('magazine-dashboard')}
          onNavigateToOpenWhenDashboard={() => setScreen('openwhen-dashboard')}
        />
      )}

      {screen === 'wizard' && (
        <WizardScreen
          templateId={selectedTemplateId}
          editCreationId={editCreationId}
          initialCreations={userCreations}
          onSave={handleSaveCreation}
          onClose={() => setScreen('dashboard')}
        />
      )}

      {screen === 'success' && activeCreation && (
        <SuccessScreen
          creation={activeCreation}
          onPreview={() => setScreen('recipient-flow')}
          onGoToDashboard={() => setScreen('dashboard')}
        />
      )}

      {screen === 'recipient-flow' && activeCreation && (
        <RecipientFlow
          creation={activeCreation}
          onExit={() => {
            const params = new URLSearchParams(window.location.search);
            if (params.get('giftId')) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            setScreen('dashboard');
          }}
          onUpdateCreation={handleUpdateReplies}
        />
      )}

      {/* --- Story Scrapbook Screens --- */}
      {screen === 'scrapbook-dashboard' && (
        <ScrapbookDashboard
          projects={scrapbookProjects}
          onCreateNew={() => setScreen('scrapbook-wizard')}
          onEditProject={(id) => {
            setActiveScrapbookId(id);
            setScreen('scrapbook-editor');
          }}
          onPreviewProject={(id) => {
            setActiveScrapbookId(id);
            setScreen('scrapbook-preview');
          }}
          onDeleteProject={handleDeleteScrapbook}
          onDuplicateProject={handleDuplicateScrapbook}
          onExportProject={(id) => {
            const proj = scrapbookProjects.find(p => p.id === id);
            if (proj) setPrintScrapbookProject(proj);
          }}
          onNavigateToCards={() => setScreen('dashboard')}
          onNavigateToMagazine={() => setScreen('magazine-dashboard')}
        />
      )}

      {screen === 'scrapbook-wizard' && (
        <ScrapbookWizard
          onSave={handleSaveScrapbook}
          onClose={() => setScreen('scrapbook-dashboard')}
        />
      )}

      {screen === 'scrapbook-editor' && activeScrapbook && (
        <ScrapbookEditor
          project={activeScrapbook}
          onSave={handleSaveScrapbook}
          onClose={() => setScreen('scrapbook-dashboard')}
          onPreview={(id) => {
            setActiveScrapbookId(id);
            setScrapbookPreviewSource('editor');
            setScreen('scrapbook-preview');
          }}
        />
      )}

      {screen === 'scrapbook-preview' && activeScrapbook && (
        <ScrapbookPreview
          project={activeScrapbook}
          onClose={() => {
            const params = new URLSearchParams(window.location.search);
            if (params.get('sId') || params.get('s')) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            if (scrapbookPreviewSource === 'editor') {
              setScreen('scrapbook-editor');
            } else {
              setScreen('scrapbook-dashboard');
            }
          }}
        />
      )}

      {/* --- Magazine Screens --- */}
      {screen === 'magazine-dashboard' && (
        <MagazineDashboard
          projects={magazineProjects}
          onCreateNew={() => setScreen('magazine-wizard')}
          onEditProject={(id) => {
            setActiveMagazineId(id);
            setScreen('magazine-editor');
          }}
          onPreviewProject={(id) => {
            setActiveMagazineId(id);
            setMagazinePreviewSource('dashboard');
            setScreen('magazine-preview');
          }}
          onDeleteProject={handleDeleteMagazine}
          onNavigateToCards={() => setScreen('dashboard')}
          onNavigateToScrapbook={() => setScreen('scrapbook-dashboard')}
        />
      )}

      {screen === 'magazine-wizard' && (
        <MagazineWizard
          onSave={handleSaveMagazine}
          onClose={() => setScreen('magazine-dashboard')}
        />
      )}

      {screen === 'magazine-editor' && activeMagazine && (
        <MagazineEditor
          project={activeMagazine}
          onSave={handleSaveMagazine}
          onClose={() => setScreen('magazine-dashboard')}
          onPreview={(id) => {
            setActiveMagazineId(id);
            setMagazinePreviewSource('editor');
            setScreen('magazine-preview');
          }}
        />
      )}

      {screen === 'magazine-preview' && activeMagazine && (
        <MagazinePreview
          project={activeMagazine}
          onClose={() => {
            const params = new URLSearchParams(window.location.search);
            if (params.get('mId') || params.get('m')) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            if (magazinePreviewSource === 'editor') {
              setScreen('magazine-editor');
            } else {
              setScreen('magazine-dashboard');
            }
          }}
        />
      )}

      {/* --- Open When Screens --- */}
      {screen === 'openwhen-dashboard' && (
        <OpenWhenDashboard
          projects={openWhenProjects}
          onCreateNew={() => setScreen('openwhen-wizard')}
          onEditProject={(id) => {
            setActiveOpenWhenId(id);
            setScreen('openwhen-editor');
          }}
          onPreviewProject={(id) => {
            setActiveOpenWhenId(id);
            setScreen('openwhen-preview');
          }}
          onDeleteProject={handleDeleteOpenWhen}
          onDuplicateProject={handleDuplicateOpenWhen}
          onNavigateToCards={() => setScreen('dashboard')}
          onNavigateToScrapbook={() => setScreen('scrapbook-dashboard')}
          onNavigateToMagazine={() => setScreen('magazine-dashboard')}
        />
      )}

      {screen === 'openwhen-wizard' && (
        <OpenWhenWizard
          onSave={handleSaveOpenWhen}
          onClose={() => setScreen('openwhen-dashboard')}
        />
      )}

      {screen === 'openwhen-editor' && activeOpenWhen && (
        <OpenWhenEditor
          project={activeOpenWhen}
          onSave={handleSaveOpenWhen}
          onClose={() => setScreen('openwhen-dashboard')}
          onPreview={(id) => {
            setActiveOpenWhenId(id);
            setScreen('openwhen-preview');
          }}
          existingMemoraCreations={getExistingCreationsList()}
        />
      )}

      {screen === 'openwhen-preview' && activeOpenWhen && (
        <RecipientOpenView
          project={activeOpenWhen}
          onClose={() => {
            const params = new URLSearchParams(window.location.search);
            if (params.get('oId') || params.get('o')) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            setScreen('openwhen-dashboard');
          }}
          onUpdateProject={(updated) => {
            setOpenWhenProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
            localStorage.setItem('memora_open_when_projects', JSON.stringify(
              openWhenProjects.map(p => p.id === updated.id ? updated : p)
            ));
          }}
          onLaunchKeepsake={handleLaunchLinkedKeepsake}
        />
      )}

      {/* Print Overlays */}
      {printScrapbookProject && (
        <ScrapbookPrint
          project={printScrapbookProject}
          onClose={() => setPrintScrapbookProject(null)}
          onUpdateProject={(updated) => {
            setPrintScrapbookProject(updated);
            handleSaveScrapbook(updated);
          }}
        />
      )}

      {printMagazineProject && (
        <MagazinePrint
          project={printMagazineProject}
          onClose={() => setPrintMagazineProject(null)}
          onUpdateProject={(updated) => {
            setPrintMagazineProject(updated);
            handleSaveMagazine(updated);
          }}
        />
      )}

      {/* Global CSS animation injections */}
      <LandingAnims />
      <WizardAnims />
    </div>
  );
}
