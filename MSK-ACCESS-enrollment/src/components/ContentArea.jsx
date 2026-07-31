import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PhoneFrame, SafariBrowserChrome } from './content/shared.jsx'

import FacebookAd from './content/FacebookAd.jsx'
import LandingPage from './content/LandingPage.jsx'
import CheckEligibility from './content/CheckEligibility.jsx'
import PCPConsent from './content/PCPConsent.jsx'
import EligibilityVerdict from './content/EligibilityVerdict.jsx'
import Ineligible from './content/Ineligible.jsx'
import OnboardingOutline from './content/OnboardingOutline.jsx'
import EligibilityPrimer from './content/EligibilityPrimer.jsx'
import RedFlagScreening from './content/RedFlagScreening.jsx'
import PainRegions from './content/PainRegions.jsx'
import RegionFocus from './content/RegionFocus.jsx'
import Preferences from './content/Preferences.jsx'
import Reminders from './content/Reminders.jsx'
import PainScale from './content/PainScale.jsx'
import PSFSActivity from './content/PSFSActivity.jsx'
import AccountCreation from './content/AccountCreation.jsx'
import PlanLoading from './content/PlanLoading.jsx'
import PlanResults from './content/PlanResults.jsx'
import RedFlagQuestions from './content/RedFlagQuestions.jsx'
import PrototypeEnd from './content/PrototypeEnd.jsx'
import ConsentHipaa from './content/ConsentHipaa.jsx'
import ConsentAlignment from './content/ConsentAlignment.jsx'
import ConsentCare from './content/ConsentCare.jsx'

const contentMap = {
  'facebook-ad': FacebookAd,
  'landing-page': LandingPage,
  'check-eligibility': CheckEligibility,
  'pcp-consent': PCPConsent,
  'eligibility-verdict': EligibilityVerdict,
  'ineligible': Ineligible,
  'onboarding-outline': OnboardingOutline,
  'eligibility-primer': EligibilityPrimer,
  'red-flag-screening': RedFlagScreening,
  'pain-regions': PainRegions,
  'region-focus': RegionFocus,
  'preferences': Preferences,
  'reminders': Reminders,
  'pain-scale': PainScale,
  'psfs-activity': PSFSActivity,
  'account-creation': AccountCreation,
  'plan-loading': PlanLoading,
  'plan-results': PlanResults,
  'red-flag-questions': RedFlagQuestions,
  'prototype-end': PrototypeEnd,
  'consent-hipaa': ConsentHipaa,
  'consent-alignment': ConsentAlignment,
  'consent-care': ConsentCare,
}

export default function ContentArea({ step, onNext, onBack, onNavigate, selectedRegionLabel, setSelectedRegionLabel }) {
  const [eligibilitySubStep, setEligibilitySubStep] = useState('form')
  const Component = contentMap[step.id]
  const isDesktop = step.viewType === 'desktop'

  // Grey status bar only for the initial modal form; white for confirm + pcp screens
  const statusBarBg = step.id === 'check-eligibility' && eligibilitySubStep === 'form'
    ? 'rgba(60,60,67,0.5)'
    : undefined

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 32px',
      background: '#f0eff4',
      overflow: 'auto',
      minHeight: 0,
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          {isDesktop ? (
            <SafariBrowserChrome>
              {Component ? (
                <Component
                  onNext={onNext}
                  onBack={onBack}
                  onNavigate={onNavigate}
                  selectedRegionLabel={selectedRegionLabel}
                  setSelectedRegionLabel={setSelectedRegionLabel}
                />
              ) : <div style={{ padding: 40, color: '#999' }}>No content</div>}
            </SafariBrowserChrome>
          ) : (
            <div style={{ transform: 'scale(0.82)', transformOrigin: 'center center' }}>
              <PhoneFrame statusBarBg={statusBarBg}>
                {Component ? (
                  <Component
                    onNext={onNext}
                    onBack={onBack}
                    onNavigate={onNavigate}
                    onSubStepChange={step.id === 'check-eligibility' ? setEligibilitySubStep : undefined}
                    selectedRegionLabel={selectedRegionLabel}
                    setSelectedRegionLabel={setSelectedRegionLabel}
                  />
                ) : <div style={{ padding: 40, color: '#999' }}>No content</div>}
              </PhoneFrame>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
