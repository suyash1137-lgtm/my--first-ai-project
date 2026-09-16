import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Ear, Brain, User, Check, ChevronRight } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PROFILES = [
  {
    id: 'visual',
    label: 'Visual Impairment',
    icon: Eye,
    color: 'border-blue-400 bg-blue-50',
    iconColor: 'text-blue-600',
    selectedColor: 'border-blue-600 bg-blue-100 ring-2 ring-blue-400',
    description: 'Optimized for screen readers and low vision users.',
    features: ['High contrast colors', 'Larger font size', 'Text-to-speech enabled', 'Screen reader friendly']
  },
  {
    id: 'hearing',
    label: 'Hearing Impairment',
    icon: Ear,
    color: 'border-purple-400 bg-purple-50',
    iconColor: 'text-purple-600',
    selectedColor: 'border-purple-600 bg-purple-100 ring-2 ring-purple-400',
    description: 'Optimized for deaf and hard-of-hearing learners.',
    features: ['Live auto-captions always on', 'Visual alerts instead of audio', 'Sound effects disabled', 'Text-first content']
  },
  {
    id: 'cognitive',
    label: 'Cognitive / ADHD',
    icon: Brain,
    color: 'border-amber-400 bg-amber-50',
    iconColor: 'text-amber-600',
    selectedColor: 'border-amber-600 bg-amber-100 ring-2 ring-amber-400',
    description: 'Simplified reading and distraction-free focus mode.',
    features: ['Simple language by default', 'Focus mode (one step at a time)', 'Dyslexia-friendly font', 'Slower TTS speed']
  },
  {
    id: 'general',
    label: 'Standard / Custom',
    icon: User,
    color: 'border-gray-300 bg-gray-50',
    iconColor: 'text-gray-600',
    selectedColor: 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-400',
    description: 'Default settings. Customize everything in Settings.',
    features: ['Standard interface', 'Full customization', 'All features available', 'Configure at any time']
  }
];

export default function ProfileModal({ onComplete }) {
  const [selectedProfile, setSelectedProfile] = useState('general');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { updateSettings } = useAccessibility();
  const { updateOnboarding } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    setSaving(true);
    setError('');
    try {
      const result = await updateOnboarding(selectedProfile);
      if (result.profile) {
        updateSettings(result.profile);
      }
      if (onComplete) onComplete();
      else navigate('/dashboard');
    } catch (err) {
      setError('Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <h1 id="profile-modal-title" className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Saral Shiksha! 🎉
          </h1>
          <p id="profile-modal-description" className="text-gray-600 mb-6">
            Choose an accessibility profile to personalize your learning experience. You can always change this later in Settings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6" role="radiogroup" aria-label="Choose accessibility profile">
            {PROFILES.map((profile) => {
              const Icon = profile.icon;
              const isSelected = selectedProfile === profile.id;
              return (
                <button
                  key={profile.id}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedProfile(profile.id)}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer focus-visible:outline-indigo-600 ${
                    isSelected ? profile.selectedColor : `${profile.color} hover:border-opacity-80`
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-0.5" aria-hidden="true">
                      <Check size={12} />
                    </span>
                  )}
                  <div className={`inline-flex p-2 rounded-lg mb-3 ${profile.color}`}>
                    <Icon size={22} className={profile.iconColor} aria-hidden="true" />
                  </div>
                  <h2 className="font-semibold text-gray-900 text-sm mb-1">{profile.label}</h2>
                  <p className="text-xs text-gray-600 mb-3">{profile.description}</p>
                  <ul className="space-y-1">
                    {profile.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-gray-700">
                        <span className="text-green-500 font-bold" aria-hidden="true">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {error && (
            <div role="alert" className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            aria-label={`Confirm ${PROFILES.find(p => p.id === selectedProfile)?.label} profile and start learning`}
          >
            {saving ? 'Saving…' : (
              <>
                Start Learning
                <ChevronRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
