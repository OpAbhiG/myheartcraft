/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Creation, INITIAL_CREATIONS } from './types';
import { parseCreationFromUrl } from './utils/share';
import { 
  fetchGlobalCreationsFromCloud, 
  syncCreationToCloud,
  syncScrapbookToCloud,
  fetchScrapbookFromCloud
} from './utils/cloudSync';
import LandingScreen, { LandingAnims } from './components/LandingScreen';
import ExploreScreen from './components/ExploreScreen';
import DashboardScreen from './components/DashboardScreen';
import WizardScreen, { WizardAnims } from './components/WizardScreen';
import SuccessScreen from './components/SuccessScreen';
import RecipientFlow from './components/RecipientFlow';

// Scrapbook Module Imports
import ScrapbookDashboard from './components/scrapbook/ScrapbookDashboard';
import ScrapbookEditor from './components/scrapbook/ScrapbookEditor';
import ScrapbookPublicView from './components/scrapbook/ScrapbookPublicView';
import { ScrapbookProject, ScrapbookTemplate } from './components/scrapbook/types';
import { INITIAL_SCRAPBOOK_TEMPLATES } from './components/scrapbook/templates';

export default function App() {
  const [screen, setScreen] = useState<
    'landing' | 'explore' | 'dashboard' | 'wizard' | 'success' | 'recipient-flow' |
    'scrapbook-dashboard' | 'scrapbook-editor' | 'scrapbook-preview'
  >('landing');

  // Existing Creations States
  const [userCreations, setUserCreations] = useState<Creation[]>([]);
  const [allGlobalCreations, setAllGlobalCreations] = useState<Creation[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('birthday');
  const [editCreationId, setEditCreationId] = useState<string | undefined>(undefined);
  const [activeCreation, setActiveCreation] = useState<Creation | null>(null);

  // Scrapbook States
  const [scrapbookProjects, setScrapbookProjects] = useState<ScrapbookProject[]>([]);
  const [activeScrapbookTemplate, setActiveScrapbookTemplate] = useState<ScrapbookTemplate | null>(null);
  const [activeScrapbookProject, setActiveScrapbookProject] = useState<ScrapbookProject | null>(null);
  const [scrapbookPersonalization, setScrapbookPersonalization] = useState<any>(null);

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

    // 2. Scrapbook Local Storage Init
    const savedScraps = localStorage.getItem('memora_scrapbook_projects');
    if (savedScraps) {
      try {
        setScrapbookProjects(JSON.parse(savedScraps));
      } catch (e) {}
    }

    // 3. URL Router checks
    const params = new URLSearchParams(window.location.search);
    const shortData = params.get('g');
    const giftId = params.get('c') || params.get('giftId');
    const sId = params.get('sId') || params.get('s');

    if (sId) {
      fetchScrapbookFromCloud(sId).then(cloudScrap => {
        if (cloudScrap) {
          setActiveScrapbookProject(cloudScrap);
          setScreen('scrapbook-preview');
        }
      });
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

  // --- Scrapbook Handlers ---
  const handleSaveScrapbook = (project: ScrapbookProject) => {
    let updated: ScrapbookProject[];
    const exists = scrapbookProjects.some(p => p.id === project.id);
    if (exists) {
      updated = scrapbookProjects.map(p => p.id === project.id ? project : p);
    } else {
      updated = [project, ...scrapbookProjects];
    }
    setScrapbookProjects(updated);
    localStorage.setItem('memora_scrapbook_projects', JSON.stringify(updated));
    syncScrapbookToCloud(project);
  };

  const handleDeleteScrapbook = (id: string) => {
    if (window.confirm('Permanently delete this scrapbook?')) {
      const updated = scrapbookProjects.filter(p => p.id !== id);
      setScrapbookProjects(updated);
      localStorage.setItem('memora_scrapbook_projects', JSON.stringify(updated));
    }
  };

  const handleDuplicateScrapbook = (id: string) => {
    const orig = scrapbookProjects.find(p => p.id === id);
    if (orig) {
      const dup: ScrapbookProject = {
        ...orig,
        id: `scrapbook-${Date.now()}`,
        title: `${orig.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updated = [dup, ...scrapbookProjects];
      setScrapbookProjects(updated);
      localStorage.setItem('memora_scrapbook_projects', JSON.stringify(updated));
      syncScrapbookToCloud(dup);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background relative" id="app-root">
      
      {/* Dynamic Screen Routing Render Switch */}
      {screen === 'landing' && (
        <LandingScreen
          onNavigateToExplore={() => setScreen('explore')}
          onNavigateToWizard={(id) => handleNavigateToWizard(id)}
          onNavigateToDashboard={() => setScreen('dashboard')}
          onNavigateToScrapbook={() => setScreen('scrapbook-dashboard')}
        />
      )}

      {screen === 'explore' && (
        <ExploreScreen
          onNavigateToWizard={(id) => handleNavigateToWizard(id)}
          onNavigateToHome={() => setScreen('landing')}
          onNavigateToDashboard={() => setScreen('dashboard')}
          onNavigateToScrapbook={() => setScreen('scrapbook-dashboard')}
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
          onNavigateToScrapbook={() => setScreen('scrapbook-dashboard')}
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

      {/* --- Scrapbook Module Screens --- */}
      {screen === 'scrapbook-dashboard' && (
        <ScrapbookDashboard
          userProjects={scrapbookProjects}
          onSelectTemplate={(template, personalization) => {
            setActiveScrapbookTemplate(template);
            setScrapbookPersonalization(personalization);
            setActiveScrapbookProject(null);
            setScreen('scrapbook-editor');
          }}
          onOpenProject={(id) => {
            const proj = scrapbookProjects.find(p => p.id === id);
            if (proj) {
              const tmpl = INITIAL_SCRAPBOOK_TEMPLATES.find(t => t.id === proj.templateId) || INITIAL_SCRAPBOOK_TEMPLATES[0];
              setActiveScrapbookTemplate(tmpl);
              setActiveScrapbookProject(proj);
              setScreen('scrapbook-editor');
            }
          }}
          onDeleteProject={handleDeleteScrapbook}
          onDuplicateProject={handleDuplicateScrapbook}
          onNavigateToCards={() => setScreen('dashboard')}
        />
      )}

      {screen === 'scrapbook-editor' && activeScrapbookTemplate && (
        <ScrapbookEditor
          template={activeScrapbookTemplate}
          existingProject={activeScrapbookProject}
          initialPersonalization={scrapbookPersonalization}
          onSave={(project) => {
            handleSaveScrapbook(project);
          }}
          onClose={() => setScreen('scrapbook-dashboard')}
        />
      )}

      {screen === 'scrapbook-preview' && activeScrapbookProject && (
        <ScrapbookPublicView
          project={activeScrapbookProject}
          onExit={() => setScreen('scrapbook-dashboard')}
        />
      )}

      {/* Global CSS animation injections */}
      <LandingAnims />
      <WizardAnims />
    </div>
  );
}
