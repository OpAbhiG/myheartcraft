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

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'explore' | 'dashboard' | 'wizard' | 'success' | 'recipient-flow'>('landing');
  const [userCreations, setUserCreations] = useState<Creation[]>([]);
  const [allGlobalCreations, setAllGlobalCreations] = useState<Creation[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('birthday');
  const [editCreationId, setEditCreationId] = useState<string | undefined>(undefined);
  const [activeCreation, setActiveCreation] = useState<Creation | null>(null);

  // 1. Initialize Creations: Local User Creations for Dashboard + Global Cloud Store for Admin
  useEffect(() => {
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

    // Fetch all user cards from global cloud store ONLY for Admin Dashboard view
    fetchGlobalCreationsFromCloud().then(cloudCards => {
      if (cloudCards && cloudCards.length > 0) {
        setAllGlobalCreations(cloudCards);
      }
    });

    // 2. Real-time Recipient URL Route detection with short URL support
    const loadCreation = (found: Creation) => {
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

      // Sync to cloud so admin sees card view count & recipient opens
      syncCreationToCloud({ ...found, views: (found.views || 0) + 1 });
    };

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
        // Fetch from global cloud database
        fetchGlobalCreationsFromCloud().then(cloudCards => {
          const cloudFound = cloudCards.find(c => c.id === giftId);
          if (cloudFound) {
            loadCreation(cloudFound);
          } else {
            // Inferred fallback if not found in database (e.g. offline/private link)
            const fallback = parseCreationFromUrl(localCreations);
            if (fallback) loadCreation(fallback);
          }
        });
      }
    }
  }, []);

  // Save creations to local storage helper
  const saveCreationsList = (updatedList: Creation[]) => {
    setUserCreations(updatedList);
    localStorage.setItem('memora_user_creations', JSON.stringify(updatedList));
  };

  // Callback from Creation Wizard to write a new or edited creation
  const handleSaveCreation = (savedCreation: Creation) => {
    let updatedList: Creation[];
    const exists = userCreations.some(c => c.id === savedCreation.id);

    if (exists) {
      // Edit existing
      updatedList = userCreations.map(c => c.id === savedCreation.id ? savedCreation : c);
    } else {
      // Add new
      updatedList = [savedCreation, ...userCreations];
    }

    saveCreationsList(updatedList);

    // Also update global admin list
    setAllGlobalCreations(prev => {
      const gExists = prev.some(c => c.id === savedCreation.id);
      return gExists ? prev.map(c => c.id === savedCreation.id ? savedCreation : c) : [savedCreation, ...prev];
    });

    setActiveCreation(savedCreation);
    setScreen('success');

    // Sync to global cloud store so admin sees it in real-time
    syncCreationToCloud(savedCreation);
  };

  // Callback to delete an experience from Dashboard
  const handleDeleteCreation = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this experience?')) {
      const updatedList = userCreations.filter(c => c.id !== id);
      saveCreationsList(updatedList);
    }
  };

  // Recipient reply callback updates local storage reply state
  const handleUpdateReplies = (updatedCreation: Creation) => {
    const updatedList = userCreations.map(c => c.id === updatedCreation.id ? updatedCreation : c);
    saveCreationsList(updatedList);
    setActiveCreation(updatedCreation);

    // Sync reply to global cloud store so admin sees recipient response
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
            // Check if there was a URL parameter. If so, clean url on exit.
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

