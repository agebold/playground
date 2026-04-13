import { AnimatePresence, motion } from 'framer-motion'
import { PhoneFrame, SafariBrowserChrome } from './content/shared.jsx'

import FacebookAd from './content/FacebookAd.jsx'
import LandingPage from './content/LandingPage.jsx'
import CheckEligibility from './content/CheckEligibility.jsx'
import RedFlagPrimer from './content/RedFlagPrimer.jsx'
import RedFlagScreening from './content/RedFlagScreening.jsx'
import PainRegions from './content/PainRegions.jsx'
import RegionFocus from './content/RegionFocus.jsx'
import Preferences from './content/Preferences.jsx'
import RemindersDays from './content/RemindersDays.jsx'
import RemindersTime from './content/RemindersTime.jsx'
import PainScale from './content/PainScale.jsx'
import PSFSActivity from './content/PSFSActivity.jsx'
import AccountCreation from './content/AccountCreation.jsx'
import PlanLoading from './content/PlanLoading.jsx'
import PlanResults from './content/PlanResults.jsx'
import Day1 from './content/Day1.jsx'
import ClassDetails from './content/ClassDetails.jsx'
import ClassTaking from './content/ClassTaking.jsx'
import PostClassBadge from './content/PostClassBadge.jsx'
import WeeklyGoal from './content/WeeklyGoal.jsx'
import WeeklyGoalDone from './content/WeeklyGoalDone.jsx'
import Day2 from './content/Day2.jsx'
import KoosPrimer from './content/KoosPrimer.jsx'
import KoosJr from './content/KoosJr.jsx'
import KoosOutro from './content/KoosOutro.jsx'
import BaselineCaptured from './content/BaselineCaptured.jsx'

const contentMap = {
  'facebook-ad': FacebookAd,
  'landing-page': LandingPage,
  'check-eligibility': CheckEligibility,
  'red-flag-primer': RedFlagPrimer,
  'red-flag-screening': RedFlagScreening,
  'pain-regions': PainRegions,
  'region-focus': RegionFocus,
  'preferences': Preferences,
  'reminders-days': RemindersDays,
  'reminders-time': RemindersTime,
  'pain-scale': PainScale,
  'psfs-activity': PSFSActivity,
  'account-creation': AccountCreation,
  'plan-loading': PlanLoading,
  'plan-results': PlanResults,
  'day-1': Day1,
  'class-details': ClassDetails,
  'class-taking': ClassTaking,
  'post-class-badge': PostClassBadge,
  'weekly-goal': WeeklyGoal,
  'weekly-goal-done': WeeklyGoalDone,
  'day-2': Day2,
  'koos-primer': KoosPrimer,
  'koos-jr': KoosJr,
  'koos-outro': KoosOutro,
  'baseline-captured': BaselineCaptured,
}

export default function ContentArea({ step, onNext }) {
  const Component = contentMap[step.id]
  const isDesktop = step.viewType === 'desktop'

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
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
              {Component ? <Component onNext={onNext} /> : <div style={{ padding: 40, color: '#999' }}>No content</div>}
            </SafariBrowserChrome>
          ) : (
            <PhoneFrame>
              {Component ? <Component onNext={onNext} /> : <div style={{ padding: 40, color: '#999' }}>No content</div>}
            </PhoneFrame>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
