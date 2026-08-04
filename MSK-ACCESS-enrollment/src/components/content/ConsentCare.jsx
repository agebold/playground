import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, ConsentCheckbox } from './shared.jsx'

const BENEFITS = [
  'Improved access to medical care by enabling you to consult with your Clinician remotely.',
  'More efficient medical evaluation and management.',
  'Obtaining the expertise of a distant specialist.',
]

const RISKS = [
  'In rare cases, information transmitted may not be sufficient (e.g., poor resolution of images) to allow for appropriate medical decision making by the Clinician.',
  'Delays in medical evaluation and treatment could occur due to deficiencies or failures of the equipment.',
  'In very rare instances, security protocols could fail, causing a breach of privacy of personal medical information, including PHI.',
  'In rare cases, a lack of access to complete medical records may result in adverse drug interactions or allergic reactions or other judgment errors.',
  'There may be other risks that are currently not known.',
]

const ACKNOWLEDGMENTS = [
  'I give my informed consent to receive medical services including telemedicine from Practice, and its primary care practitioners and specialists ("Clinicians") for myself or for the patient for whom I am the parent or legal guardian. This medical care may include services related to my health (or the identified person) and may include (but not be limited to) preventative care, diagnostic testing, therapeutic treatments, rehabilitative care, health maintenance, palliative care, counseling, assessment, or review of physical or mental status/function of the body. This consent includes contact and discussion with other health care professionals for care and treatment.',
  'Age Bold, Inc. ("Age Bold") is a separate entity that is independent from the Practice, is not licensed to practice medicine, and has been contracted by the Practice to furnish administrative services for Practice and to assist with the provision of technologies and administrative services used to support telemedicine encounters.',
  'It is up to the Practice Clinician to determine whether my needs are appropriate for a telemedicine encounter.',
  'I will not be prescribed any controlled substance, as determined by any applicable federal or state agency, and there is no guarantee that I will receive a prescription for any medication.',
  'A variety of alternative methods of medical care may be available to me, and that I may choose one or more of these at any time.',
  'Telemedicine may involve electronic communication of my personal medical information, including PHI, to Practice Clinicians or other healthcare providers who may be located in other areas, including in other states.',
  'It is my duty to inform my Clinician of relationships I may have with other healthcare providers providing treatment to me to ensure my Clinician has a full clinical picture when making treatment decisions.',
  'Some parts of the services involving physical tests may be conducted by individuals at my location, or at a testing facility, at the direction of my Clinician.',
  'I have the right to withhold or withdraw my consent to the use of telemedicine in the course of my care at any time, without affecting my right to future care or treatment.',
  'I may suspend or terminate access to telemedicine services at any time for any reason or for no reason.',
  'I understand that if I am experiencing a medical emergency, that I will be directed to dial 9-1-1 immediately and that neither Practice, nor Clinicians nor Age Bold service specialists may be able to connect me directly to any local emergency services.',
  'I have the right to inspect all information obtained and recorded in the course of a telemedicine interaction, including my medical record, and may receive copies of this information for a reasonable fee.',
  'Video images and audio recordings of me may be captured and stored electronically. I understand that these recordings may be later viewed and used for purposes of evaluation and training, which may include Practice or Age Bold non-clinical personnel. I understand and consent to the use of these images and audio recordings for the telemedicine consultation and, potentially, evaluation, education and training.',
  'I understand that my healthcare information, including PHI, may be shared with other individuals for scheduling and billing purposes. Persons may be present during the consultation other than the Clinicians in order to operate the telemedicine technologies. I further understand that I will be informed of their presence in the consultation and thus will have the right to request the following: (1) omit specific details of my medical history/examination that are personally sensitive to me; (2) ask non-medical personnel to leave the telemedicine examination; and/or (3) terminate the consultation at any time.',
  'The laws that protect privacy and the confidentiality of medical information, particularly PHI, also apply to telemedicine, and that no information obtained in the use of telemedicine that identifies me will be disclosed to researchers or other entities without my express written consent.',
  'I may expect the anticipated benefits from the use of telemedicine in my care, but that no results can be guaranteed or assured.',
  'There is a risk of technical failures during the telemedicine encounter beyond the control of Practice and Age Bold. I agree to hold harmless Practice and Age Bold for delays in evaluation or for information lost due to such technical failures.',
  'In the event of any problem with the website or related services, I agree that my sole remedy is to cease using the website or terminate access to the service.',
  'Under no circumstances will Practice and Age Bold be liable in any way for the use of the telemedicine services, including but not limited to, any errors or omissions in content or infringement by any content on the website of any intellectual property rights or other rights of third parties, or for any losses or damages of any kind arising directly or indirectly out of the use of, inability to use, or the results of use of the website, and any website linked to the website, or the materials or information contained on any or all such websites. I agree that I will not hold the Practice nor Age Bold liable for any punitive, exemplary, consequential, incidental, indirect or special damages (including, without limitation, any personal injury, lost profits, business interruption, loss of programs or other data on my computer or otherwise) arising from or in connection with your use of the website whether under a theory of breach of contract, negligence, strict liability, or otherwise, even if we or they have been advised of the possibility of such damages; provided however that I do not waive any right to bring valid malpractice claims against any Clinicians that have provided Medical Services to me.',
  'Age Bold makes no representation that materials on this website are appropriate or available for use in any other location. I understand that if I access these services from a location outside of the United States, that I do so at my own risk and initiative and that I am ultimately responsible for compliance with any laws or regulations associated with my use.',
  'I have been offered a copy of this consent form.',
]

function H({ children }) {
  return <p style={{ fontSize: 16, fontWeight: 600, color: C.textSec, margin: '16px 0 4px' }}>{children}</p>
}
function P({ children }) {
  return <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.5, margin: '0 0 12px' }}>{children}</p>
}
function UL({ items }) {
  return (
    <ul style={{ fontSize: 16, color: C.textSec, lineHeight: 1.5, margin: '0 0 12px', paddingLeft: 20 }}>
      {items.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
    </ul>
  )
}

export default function ConsentCare({ onNext, onBack }) {
  const [checked, setChecked] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack onBack={onBack} logoSrc={boldLogo} progress={14} totalSteps={15} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!checked}>Continue</PurpleButton>}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: C.text, margin: '0 0 4px' }}>Consent for care</h2>
          <p style={{ fontSize: 18, color: C.text, lineHeight: 1.4, margin: 0 }}>
            This document outlines your care, rights, and consent to treatment from Bold clinicians.
          </p>
        </div>

        <div style={{
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 16, maxHeight: 300, overflowY: 'auto', marginBottom: 16,
        }}>
          <p style={{ fontSize: 20, fontWeight: 600, color: C.textSec, margin: '0 0 8px' }}>New patient agreement</p>

          <P>Age Bold's clinical care is provided by Mighty Health Medical Services of New Jersey, P.C.; Mighty Health Medical Services, P.A.; Bradley J. E. Professional Corporation, and New York City Health Medical, P.C. ("Provider Group") and its contractual affiliates. Age Bold connects you to a Provider Group physician or nurse practitioner to provide medical care and treatment. Age Bold does not provide any medical services, does not practice medicine, and does not influence the practice of medicine or any licensed profession provided by Provider Group's clinicians, each of whom are responsible for his or her services and compliance with the requirements applicable to his or her profession and license.</P>
          <P>This New Patient Agreement (the "Agreement"), effective as of the date of the Patient's signature (the "Effective Date"), is made by and between Age Bold Provider Group, P.A., a Florida professional corporation and its contractual affiliates ("Practice"), and the undersigned patient (the "Patient," "You" or "I" when making affirmative statements in this Agreement). You are a patient of the Practice who receives certain medical services from its clinicians using telehealth technologies ("Medical Services").</P>

          <H>Term, Termination, and Cancellation</H>
          <P>This Agreement will commence on the Effective Date and will extend until after the consult(s).</P>

          <H>Other Providers</H>
          <P>You acknowledge that the signing of this Agreement is strictly voluntary. This Agreement does not restrict or limit your ability to receive professional services from other health care professionals.</P>

          <H>Insurance or Other Medical Coverage</H>
          <P>This Agreement and the Practice's provision of Medical Services are not substitutes for health insurance or other health plan coverage (such as membership in an HMO). You acknowledge that the Practice has advised You to obtain or keep in full force your health insurance policy(ies) or plans in order to cover You and your family members for Medical Services and other healthcare costs. You acknowledge that this Agreement is not a contract that provides health insurance for you, and this Agreement is not intended to replace any insurance coverage provided to You by an Insurer.</P>
          <P>While You remain ultimately responsible for all charges for Medical Services, the Practice will, as a courtesy, submit claims to your health insurance or health plan coverage provider on your behalf, unless You specifically request otherwise in writing. By accepting this Agreement, You authorize the Practice to bill your insurer and to receive direct payment of medical benefits for services described herein. The Practice in no way provides any representations to You that any Medical Services performed by the Practice will be eligible for coverage under any insurance policy held by You, and You understand that You are responsible for any amounts not covered by your insurance, including co-pays, deductibles, or non-covered services.</P>

          <H>Severability</H>
          <P>If for any reason any provision of this Agreement shall be deemed, by a court of competent jurisdiction, to be legally invalid or unenforceable in any jurisdiction to which it applies, the validity of the remainder of the Agreement shall not be affected, and that provision shall be deemed modified to the minimum extent necessary to make that provision consistent with applicable law and in its modified form, and that provision shall then be enforceable.</P>

          <H>Modifications, Termination, Interruption, and Disruptions</H>
          <P>You understand, agree and acknowledge that we may modify, suspend, disrupt or discontinue the Age Bold platform, any part of the platform or the use of the platform, whether to all clients or to You specifically, at any time with or without notice to You. You agree and acknowledge that Provider Group will not be liable for any of the aforementioned actions or for the failure to provide any future Medical Services to You, or for any losses or damages that are caused by any of the aforementioned actions.</P>
          <P>The Age Bold platform depends on various factors such as software, hardware and tools, either our own or those owned and/or operated by our contractors and suppliers. While we make commercially reasonable efforts to ensure the platform's reliability and accessibility, You understand and agree that no platform can be 100% reliable and accessible and so we cannot guarantee that access to the platform will be uninterrupted or that it will be accessible, consistent, timely or error-free at all times.</P>

          <H>Amendment</H>
          <P>We may change this Agreement by posting modifications on the Age Bold platform regarding the Medical Services. Unless otherwise specified by us, all modifications shall be effective upon posting. Therefore, You are encouraged to check the terms of this Agreement frequently. The last update to this Agreement is posted at the bottom of this Agreement. By using the Age Bold platform and the Medical Services after the changes become effective, You agree to be bound by such changes to the Agreement. If You do not agree to the changes, you must terminate your access to the Age Bold platform and participation in the Medical Services.</P>
          <P>Moreover, if federal, state, or local law or regulation ("Applicable Law") requires this Agreement to contain provisions that are not expressly set forth in this Agreement, then, to the extent necessary, such provisions shall be incorporated by reference into this Agreement and shall be deemed a part of this Agreement as though they had been expressly set forth in this Agreement.</P>

          <H>Assignment</H>
          <P>This Agreement, and any rights You may have under it, may not be assigned or transferred by You. This Agreement, and any rights the Practice may have under it, may not be assigned or transferred to its heirs, successors, or assignees.</P>

          <H>Relationship of Parties</H>
          <P>You and the Practice intend and agree that the Practice, in performing the Medical Services under this Agreement, is an independent contractor, as defined by the guidelines promulgated by the United States Internal Revenue Service and/or the United States Department of Labor, and the Practice shall have exclusive control of its work and the manner in which it is performed.</P>

          <H>Legal Significance</H>
          <P>You acknowledge that this Agreement is a legal document and creates certain rights and responsibilities. You also acknowledge that You have had a reasonable time to seek legal advice regarding the Agreement and have either chosen not to do so or have done so and are satisfied with the terms and conditions of the Agreement.</P>

          <H>Notice</H>
          <P>All written notices are deemed delivered and received when sent if sent to the e-mail address of the party.</P>

          <H>Governing Law</H>
          <P>This Agreement shall be governed and construed under the laws of California. This Agreement shall be construed without regard to any presumptions or rules requiring construction against the party causing the instrument to be drafted.</P>

          <H>Headings</H>
          <P>Captions in this Agreement are used for convenience only and shall not limit, broaden, or qualify the text.</P>

          <H>Entire Agreement</H>
          <P>This Agreement contains the entire agreement between the parties regarding the subject matter of this Agreement, and supersedes all prior oral and written understandings and agreements regarding the subject matter of this Agreement. If any provision of this Agreement is held by a court of competent jurisdiction to be illegal, invalid, unenforceable, or otherwise contrary to law, the remaining provisions of this Agreement will remain in full force and effect.</P>
          <P>Medical Services Patient Warning. Patient understands and agrees that email and the internet should never be used to access medical care in the event of an emergency, or any situation that Patient could reasonably expect may develop into an emergency. Patient agrees that in such situations, when a Patient cannot speak to a physician or other appropriated license clinician that may provide Medical Services hereunder (a "Clinician") immediately in person or by telephone, that Patient shall call 911 or the nearest emergency medical assistance provider, and follow the directions of emergency medical personnel.</P>

          <H>Informed consent</H>
          <H>Background on Telemedicine</H>
          <P>Telemedicine involves the use of electronic communications technologies to enable the transfer of medical/health and other information between a health care provider and patient who are in different locations. Telemedicine technologies may include interactive two-way audio and video, interactive audio, remote monitoring, management of patient medical records, medical images, e-mail, output data from medical devices, and sound and video files. Information conveyed using telemedicine may be used for the diagnosis, treatment, follow-up and/or education of patients.</P>
          <P>Electronic systems incorporate network and software security protocols to protect your confidentiality and the confidentiality of Your data, including that which is considered protected health information ("PHI") as further defined under "Notice of Privacy Practices" below. Our system also includes measures to safeguard the data, including all PHI, and to ensure its integrity against intentional or unintentional corruption.</P>

          <H>Expected Benefits of receiving Medical Services via Telemedicine</H>
          <UL items={BENEFITS} />

          <H>Possible Risks of Receiving Medical Services via Telemedicine</H>
          <P>As with any medical procedure, there are potential risks associated with the use of telemedicine. These risks include, but may not be limited to:</P>
          <UL items={RISKS} />

          <P style={{ fontWeight: 600 }}>BY CLICKING ACCEPT, I ACKNOWLEDGE THAT I UNDERSTAND AND AGREE WITH THE FOLLOWING:</P>
          <ol style={{ fontSize: 16, color: C.textSec, lineHeight: 1.5, margin: '0 0 12px', paddingLeft: 20 }}>
            {ACKNOWLEDGMENTS.map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
          </ol>

          <H>Patient Informed Consent for AI Scribe Notice</H>
          <P>The Practice and Age Bold utilize a note taking tool called AI Scribe to accurately and efficiently capture the details of discussions and the outcomes of appointments. AI Scribe ensures that the Practice can focus more on conversations with patients and less on manual note taking, enhancing the quality of care you receive.</P>
          <P>Your consent is required for the Practice to use this technology. Please understand that your information will be handled with care, and AI Scribe's use is aimed solely at improving your healthcare experience.</P>
          <P>By signing this consent form, you are agreeing to allow your clinician to use AI Scribe during your consultation.</P>

          <H>Disclosures</H>
          <P>All Clinicians that provide Medical Services on the Age Bold platform hold professional licenses issued by the professional licensing boards in the states where they practice, hold doctoral degrees in medicine and have undergone post-doctoral training and/or other applicable experience and certification. You can report a complaint relating to services provided by any Clinician by contacting the professional licensing board in the state where the services were received. In a professional relationship, sexual intimacy is never appropriate and should be reported to the board that licenses, registers, or certifies the licensee.</P>
          <P>
            You can find the contact information for each of the state professional licensing boards governing medicine on the Federation of State Medical Boards website at:{' '}
            <a href="https://www.fsmb.org/state-medical-boards/contacts" target="_blank" rel="noreferrer" style={{ color: C.purple, textDecoration: 'underline' }}>
              fsmb.org/state-medical-boards/contacts
            </a>
          </P>
          <P>Any patient medical records created as a result of your use of the site will be securely maintained by the Practice on behalf of your treating Clinician for a period that is no less than the minimum number of years such records are required to be maintained under state and federal law, and which is typically at least six years.</P>
          <P>
            Please report any violations of these New Patient Agreement and Informed Consent to:{' '}
            <a href="mailto:privacy@agebold.com" style={{ color: C.purple, textDecoration: 'underline' }}>
              privacy@agebold.com
            </a>.
          </P>
        </div>

        <ConsentCheckbox checked={checked} onToggle={() => setChecked(c => !c)}>
          I accept and agree to the New Patient Agreement and Informed Consent
        </ConsentCheckbox>
      </OnboardingScreen>
    </div>
  )
}
