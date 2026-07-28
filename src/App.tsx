/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Creation, INITIAL_CREATIONS } from './types';
import { parseCreationFromUrl } from './utils/share';
import { 
  fetchGlobalCreationsFromCloud, 
  syncCreationToCloud
} from './utils/cloudSync';
import LandingScreen, { LandingAnims } from './components/LandingScreen';
import ExploreScreen from './components/ExploreScreen';
import DashboardScreen from './components/DashboardScreen';
import WizardScreen, { WizardAnims } from './components/WizardScreen';
import SuccessScreen from './components/SuccessScreen';
import RecipientFlow from './components/RecipientFlow';

export default function App() {
  const [screen, setScreen] = useState<
    'landing' | 'explore' | 'dashboard' | 'wizard' | 'success' | 'recipient-flow'
  >('landing');

  // Existing Creations States
  const [userCreations, setUserCreations] = useState<Creation[]>([]);
  const [allGlobalCreations, setAllGlobalCreations] = useState<Creation[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('birthday');
  const [editCreationId, setEditCreationId] = useState<string | undefined>(undefined);
  const [activeCreation, setActiveCreation] = useState<Creation | null>(null);

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

    // 2. URL Router checks
    const params = new URLSearchParams(window.location.search);
    const shortData = params.get('g');
    const giftId = params.get('c') || params.get('giftId');

    if (shortData) {
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

  return (
    <div className="min-h-screen bg-background text-on-background relative" id="app-root">
      
      {/* Dynamic Screen Routing Render Switch */}
      {screen === 'landing' && (
        <LandingScreen
          onNavigateToExplore={() => setScreen('explore')}
          onNavigateToWizard={(id) => handleNavigateToWizard(id)}
          onNavigateToDashboard={() => setScreen('dashboard')}
        />
      )}

      {screen === 'explore' && (
        <ExploreScreen
          onNavigateToWizard={(id) => handleNavigateToWizard(id)}
          onNavigateToHome={() => setScreen('landing')}
          onNavigateToDashboard={() => setScreen('dashboard')}
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

      {/* Global CSS animation injections */}
      <LandingAnims />
      <WizardAnims />
    </div>
  );
}
