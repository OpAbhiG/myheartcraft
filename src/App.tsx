/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Creation, INITIAL_CREATIONS } from './types';
import { parseCreationFromUrl } from './utils/share';
import LandingScreen, { LandingAnims } from './components/LandingScreen';
import ExploreScreen from './components/ExploreScreen';
import DashboardScreen from './components/DashboardScreen';
import WizardScreen, { WizardAnims } from './components/WizardScreen';
import SuccessScreen from './components/SuccessScreen';
import RecipientFlow from './components/RecipientFlow';

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'explore' | 'dashboard' | 'wizard' | 'success' | 'recipient-flow'>('landing');
  const [creations, setCreations] = useState<Creation[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('birthday');
  const [editCreationId, setEditCreationId] = useState<string | undefined>(undefined);
  const [activeCreation, setActiveCreation] = useState<Creation | null>(null);

  // 1. Initialize Creations list from Local Storage or default preset creations
  useEffect(() => {
    let localCreations: Creation[];
    const saved = localStorage.getItem('myheartcraft_creations');
    if (saved) {
      try {
        localCreations = JSON.parse(saved);
      } catch (e) {
        localCreations = INITIAL_CREATIONS;
      }
    } else {
      localCreations = INITIAL_CREATIONS;
      localStorage.setItem('myheartcraft_creations', JSON.stringify(INITIAL_CREATIONS));
    }
    setCreations(localCreations);

    // 2. Real-time Recipient URL Route detection: works for any device/browser!
    const found = parseCreationFromUrl(localCreations);
    if (found) {
      // Save or update in recipient's local storage so they can view it anytime
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

      localStorage.setItem('myheartcraft_creations', JSON.stringify(updatedList));
      setCreations(updatedList);
      setActiveCreation(found);
      setScreen('recipient-flow');
    }
  }, []);

  // Save creations to local storage helper
  const saveCreationsList = (updatedList: Creation[]) => {
    setCreations(updatedList);
    localStorage.setItem('myheartcraft_creations', JSON.stringify(updatedList));
  };

  // Callback from Creation Wizard to write a new or edited creation
  const handleSaveCreation = (savedCreation: Creation) => {
    let updatedList: Creation[];
    const exists = creations.some(c => c.id === savedCreation.id);

    if (exists) {
      // Edit existing
      updatedList = creations.map(c => c.id === savedCreation.id ? savedCreation : c);
    } else {
      // Add new
      updatedList = [savedCreation, ...creations];
    }

    saveCreationsList(updatedList);
    setActiveCreation(savedCreation);
    setScreen('success');
  };

  // Callback to delete an experience from Dashboard
  const handleDeleteCreation = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this beautiful experience?')) {
      const updatedList = creations.filter(c => c.id !== id);
      saveCreationsList(updatedList);
    }
  };

  // Recipient reply callback updates local storage reply state
  const handleUpdateReplies = (updatedCreation: Creation) => {
    const updatedList = creations.map(c => c.id === updatedCreation.id ? updatedCreation : c);
    saveCreationsList(updatedList);
    setActiveCreation(updatedCreation);
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
          creations={creations}
          onNavigateToExplore={() => setScreen('explore')}
          onNavigateToWizard={(tempId, editId) => handleNavigateToWizard(tempId, editId)}
          onPreviewCreation={(id) => {
            const found = creations.find(c => c.id === id);
            if (found) {
              setActiveCreation(found);
              setScreen('recipient-flow');
            }
          }}
          onDeleteCreation={handleDeleteCreation}
          onUpdateCreations={(updatedList) => saveCreationsList(updatedList)}
        />
      )}

      {screen === 'wizard' && (
        <WizardScreen
          templateId={selectedTemplateId}
          editCreationId={editCreationId}
          initialCreations={creations}
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

