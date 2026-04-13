import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

export default function RedFlagScreening({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={1} totalSteps={10} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>I acknowledge</PurpleButton>}>
        {/* Shield icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: C.purpleLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
              <path d="M10 1L2 5v6c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V5L10 1z"
                fill={C.purple} opacity="0.15"/>
              <path d="M10 1L2 5v6c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V5L10 1z"
                stroke={C.purple} strokeWidth="1.5"/>
              <path d="M7 11l2 2 4-4" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 12, lineHeight: 1.3 }}>
          Your safety is our #1 priority.
        </h2>
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 16 }}>
          Bold programming is appropriate for senior members who are cleared for independent, unsupervised exercise.
        </p>

        {/* Conditions box */}
        <div style={{
          border: `1.5px solid ${C.border}`, borderRadius: 12,
          padding: '14px 16px', marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>
            The program may not be suitable for individuals actively managing some health conditions, including but not limited to:
          </p>
          <ul style={{ margin: '10px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              'Bone fracture',
              'Surgery or high force trauma in the past 3 months',
              'Non musculoskeletal origins of pain such as active cancer, infection, or autoimmune disorders',
              'Primary neurological disorders with high severity',
              'Severe heart failure',
              'Suicidal or homicidal ideation',
              'Moderate to severe dementia or severe cognitive impairment',
              'Hospice or palliative care',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>

        <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>
          By continuing, you confirm that you have previously discussed engaging in an exercise routine with a healthcare provider before joining Bold and confirm that there are no other health conditions which might exclude you from safe and productive participation in independent exercise.
        </p>
      </OnboardingScreen>
    </div>
  )
}
