import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import hipaaLogo from '../../assets/hipaa-logo.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, ConsentCheckbox } from './shared.jsx'

const PARAGRAPHS = [
  `The law requires us to maintain the privacy of certain health information called "Protected Health Information" or "PHI". Protected Health Information is the information that you provide us or that we create or receive about your health care. The law also requires us to provide you with this Notice of our legal duties and privacy practices. When we use or disclose (share) your Protected Health Information, we are required to follow the terms of this Notice or other notice in effect at the time we use or share the PHI. Finally, the law provides you with certain rights described in this Notice. Furthermore, we are required to notify you following a breach of unsecured PHI.`,
  `This Notice describes the privacy practices of Practice. It applies to the health services you receive from the Practice. The Practice will be referred to herein as "we" or "us." We will share your health information among ourselves to carry out our treatment, payment, and health care operations.`,
  `Ways We Can Use and Share Your PHI Without Your Written Permission (Authorization)`,
  `In many situations, we can use and share your PHI for activities that are common in many hospitals and clinics. In certain other situations, which we will describe under "Uses and Disclosures Requiring Your Written Permission (Authorization)."`,
  `In some circumstances, we must have your written permission (authorization) to use and/or share your PHI. We do not need any type of permission from you for the following uses and disclosures:`,
  `THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND SHARED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.`,
  `Uses and Disclosures for Treatment, Payment and Health Care Operations`,
  `We may use and share your PHI to provide "Treatment," obtain "Payment" for your Treatment, and perform our "Health Care Operations." These three terms are defined as:`,
  `Definitions • Treatment. We use and share your PHI to provide care and other services to you--for example, to diagnose and treat your injury or illness. In addition, we may contact you to provide appointment reminders or information about treatment options. We may tell you about other health-related benefits and services that might interest you. We may also share PHI with other doctors, nurses, and others involved in your care.`,
  `• Payment. We may use and share your PHI to receive payment for services that we provide to you. As an example, we may share your PHI with the person who you told us is primarily responsible for paying for your treatment, such as your spouse or parent.`,
  `• Health Care Operations. We may use and share your PHI for our health care operations, which include management, planning, and activities that improve the quality and lower the cost of the care that we deliver. For example, we may use PHI to review the quality and skill of our Clinicians. However, you have the right to restrict disclosure to a health plan for healthcare services for which you pay in full out of pocket (excluding a deductible).`,
  `• Business Associates. In addition, we may share PHI with certain others who help us with our activities, including those we hire to perform services. All such Business Associates are required to sign an agreement that protects your PHI.`,
  `Your Other Health Care Providers`,
  `We may also share PHI with your doctor and other health care providers when they need it to provide Treatment to you, to obtain Payment for the care they give to you, to perform certain Health Care Operations, such as reviewing the quality and skill of health care professionals, or to review their actions in following the law.`,
  `Disclosure to Relatives, Close Friends and Your Other Caregivers`,
  `We may share your PHI with your family member/relative, a close personal friend, or another person who you identify in writing to us if we: (1) first provide you with the chance to object to the disclosure and you do not object; (2) reasonably infer that you do not object to the disclosure; or (3) obtain your written permission to share your PHI with these individuals. If you are not present at the time we share your PHI, or you are not able to agree or disagree to our sharing your PHI because you are not capable or there is an emergency circumstance, we may use our professional judgment to decide that sharing the PHI is in your best interest. We may also use or share your PHI to notify (or assist in notifying) these individuals about your location and general condition.`,
  `Public Health Activities`,
  `We are required or are permitted by law to report PHI to certain government agencies and others. For example, we may share your PHI for the following:`,
  `• to report health information to public health authorities for the purpose of preventing or controlling disease, injury, or disability;`,
  `• to report abuse and neglect to government authorities, including a social service or protective services agency, that are legally permitted to receive the reports;`,
  `• to report information about products and services to the U.S. Food and Drug Administration;`,
  `• to alert a person who may have been exposed to a communicable disease or may otherwise be at risk of developing or spreading a disease or condition;`,
  `• to report information to your employer as required under laws addressing work-related illnesses and injuries or workplace medical surveillance; and`,
  `• to prevent or lessen a serious and imminent threat to a person for the public's health or safety, or to certain government agencies with special functions such as the State Department.`,
  `Health Oversight Activities`,
  `We may share your PHI with a health oversight agency that oversees the health care system and ensures the rules of government health programs, such as Medicare or Medicaid, are being followed.`,
  `Judicial and Administrative Proceedings`,
  `We may share your PHI in the course of a judicial or administrative proceeding in response to a legal order or other lawful process.`,
  `Law Enforcement Purposes`,
  `We may share your PHI with the police or other law enforcement officials as required or permitted by law or in compliance with a court order or a subpoena.`,
  `Decedents`,
  `We may share PHI with a coroner or medical examiner as authorized by law. We may share your PHI with a family member who was involved in your care or payment for your care prior to death, unless such disclosure would be inconsistent with any prior expression you have communicated to us. Under federal law, the privacy rights described herein will expire fifty years after your death.`,
  `Organ and Tissue Procurement`,
  `We may share your PHI with organizations that facilitate organ, eye, or tissue procurement, banking, or transplantation.`,
  `Research`,
  `We may use or share your PHI if the group that oversees our research, the Institutional Review Board/Privacy Board, approves a waiver of permission (authorization) for disclosure or for a researcher to begin the research process.`,
  `Workers' Compensation`,
  `We may share your PHI as permitted by or required by state law relating to workers' compensation or other similar programs.`,
  `Disaster Relief`,
  `We may share your PHI to a public or private entity authorized by law or by its charter to assist in disaster relief efforts.`,
  `School Immunization Requests`,
  `We may share your PHI for purposes of school immunization requests if the school is required by law to have documentation of such immunization(s) for enrollment.`,
  `Fundraising`,
  `We may contact you to raise funds for Practice. You may tell us you do not wish to be contacted for this purpose, and will agree to remove you from the list. To do so, please contact the HIPAA Privacy Officer at the address below.`,
  `As required by law we may use and share your PHI when required to do so by any other law not already referred to above.`,
  `Uses and Disclosures Requiring Your Written Permission (Authorization)`,
  `Use or Disclosure with Your Permission (Authorization)`,
  `For any purpose other than the ones described above under "Ways We Can Use and Share Your PHI Without Your Written Permission (Authorization)," we may only use or share your PHI when you grant us your written permission (authorization). For example, you will need to give us your permission before we send your PHI to your life insurance company.`,
  `Marketing`,
  `We must also obtain your written permission (authorization) prior to using your PHI to send you any marketing materials paid for by a third party. However, we may communicate with you face to face about products or services related to your treatment, case management, or care coordination, or alternative treatments, therapies, health care providers, or care settings. In addition, we may not sell your PHI without your written authorization.`,
  `Uses and Disclosures of Your Highly Confidential Information`,
  `Federal and state law requires special privacy protections for certain highly confidential information about you ("Highly Confidential Information"), including: (1) any portion of your PHI that is kept in psychotherapy notes; (2) about mental health and developmental disabilities services; (3) about alcohol and drug abuse prevention, treatment and referral; (4) about HIV/AIDS testing, diagnosis or treatment; (5) about sexually transmitted disease(s); (6) about genetic testing; (7) about child abuse and neglect; (8) about domestic abuse of an adult with a disability; (9) about sexual assault; or (10) In Vitro Fertilization (IVF). Before we share your Highly Confidential Information for a purpose other than those permitted by law, we must obtain your written permission.`,
  `Your Rights Regarding Your Protected Health Information`,
  `Complaints`,
  `If you want more information about your privacy rights, are concerned that we have violated your privacy rights, or disagree with a decision that we made about access to your PHI, you may contact our HIPAA Privacy Officer at the address below. You may also file written complaints with the Office for Civil Rights ("OCR") of the U.S. Department of Health and Human Services by sending a letter to 200 Independence Avenue, S.W., Washington D.C. 20201, calling 1-877-696-6775, or visiting www.hhs.gov/ocr/privacy/hipaa/complaints. We will not take any action against you if you file a complaint with us or with the OCR.`,
  `Right to Receive Confidential Communications`,
  `You may ask us to send PHI to a different location than the address that you gave us, or in a special way, or to contact You at a different phone number. You will need to ask for this in writing. For example, You may ask us to send a copy of your medical records to a different address than your home address. We will accept all reasonable requests.`,
  `Right to Revoke Your Written Permission (Authorization)`,
  `You may change your mind about your authorization or any written permission regarding your PHI by giving or sending a written "revocation statement" to the HIPAA Privacy Officer at the address below. The revocation will not apply to the extent that we have already taken action where we relied on your permission.`,
  `Right to Inspect and Copy Your Health Information`,
  `You may request copies (for a reasonable fee) and/or access to your medical record file, billing records, and other records. You have a right to a copy of your records, if part of a "designated record set" in electronic format, as reasonably available. You can review your medical records and/or ask for hard copies. Under limited circumstances, we may deny you access to a portion of your records. If you want to access your records, you may obtain a record request form from Practice. Return the completed form to the HIPAA Privacy Officer at the address provided below.`,
  `Right to Amend Your Records`,
  `You have the right to request that we amend PHI maintained in medical record files, billing records, and other records used to make decisions about your Treatment and payment for your Treatment. If you want to amend your records, you may obtain an amendment request form from the HIPAA Privacy Officer. After which, you can return the completed form to the HIPAA Privacy Officer. We will comply with your request unless we believe that the information that would be amended is correct and complete or that other circumstances apply. In the case of a requested amendment concerning information about the Treatment of a mental illness or developmental disability, you have the right to appeal to a state court our decision not to amend your PHI.`,
  `Right to Receive an Accounting of Disclosures`,
  `You may ask for an accounting of certain disclosures of Your PHI made by us. These disclosures must have occurred before the time of Your request, and we will not go back more than six (6) years before the date of Your request. If you request an accounting more than once during a twelve (12) month period, we will charge You based on the rate sheet. Direct Your request for an accounting to the HIPAA Privacy Officer at the address provided below.`,
  `Right to Request Restrictions`,
  `You have the right to ask us to restrict or limit the PHI we use or disclose about You for treatment, payment, or health care operations. With one exception, we are not required to agree to Your request. If we do agree, we will comply unless the information is needed to provide emergency treatment. Your request for restrictions must be made in writing and submitted to the HIPAA Privacy Officer at the address provided below. We must grant Your request to a restriction on disclosure of your PHI to a health plan if You have paid for Medical Services provided to you in full out of pocket.`,
  `Right to Receive a Copy of this Notice`,
  `If You ask, you may obtain a copy of this Notice, even if You have agreed to receive the notice electronically.`,
  `Effective Date`,
  `This Notice is effective as of August 4, 2025.`,
  `Right to Change Terms of this Notice`,
  `We may change the terms of this Notice at any time. If we change this Notice, we may make the new notice terms effective for all Protected Health Information that we maintain, including any information created or received prior to issuing the new notice. If we change this Notice, we will post the new notice in common areas throughout our facility, and on our Internet site at https://www.agebold.com/. You also may obtain any new notice by contacting the HIPAA Privacy Officer at the address provided below.`,
  `Federal & State Law`,
  `Federal and state laws require the Practice to protect your medical information and federal law requires Practice to describe to you how we handle that information. When federal and state privacy laws differ, and the state law is more protective of your information or provides you with greater access to your information, then state law will override federal law.`,
  `Questions or Concerns`,
  `You may contact the HIPAA Privacy Officer for additional information:`,
  `Data Privacy Officer. email: privacy@agebold.com telephone: (833) 701-1545, address: 8549 Wilshire Blvd #5080, Beverly Hills, CA 90211`,
  `Patient Bill of Rights`,
  `Many states have adopted a patient bill of rights applicable to patients of Clinicians and/or hospitals and other health care facilities. Some of those states require that physicians provide a copy of the bill of rights to their patients. The portion of the bill of rights that is relevant to any Medical Services provided to You here on behalf of Practice. Please note that it includes patient responsibilities as well. • A patient has the right to be treated with courtesy and respect, with appreciation of his or her individual dignity, and with protection of his or her need for privacy. • A patient has the right to a prompt and reasonable response to questions and requests within the context of the Service. • A patient has the right to know who is providing medical services and who is responsible for his or her care. • A patient has the right to know what patient support services are available, including whether an interpreter is available if he or she does not speak English. • A patient has the right to know what rules and regulations apply to his or her conduct. • A patient has the right to be given information by the health care provider concerning diagnosis, planned course of treatment, alternatives, risks, and prognosis. • A patient has the right to refuse any treatment provided via the Service unless otherwise required by law. • A patient has the right to receive a copy of a reasonably clear and understandable, itemized bill and/or receipt and, upon request, to have the charges explained. • A patient has the right to impartial access to medical treatment or accommodations, regardless of race, national origin, religion, handicap, or source of payment, subject to the technical limitations of the Service. • A patient has the right to express grievances regarding any violation of his or her rights, as stated in state law, through the grievance procedure of the health care provider which served him or her and to the appropriate state licensing agency. • A patient is responsible for providing to the Provider, to the best of his or her knowledge, accurate and complete information about present complaints, past illnesses, hospitalizations, medications, and other matters relating to his or her health. • A patient is responsible for reporting unexpected changes in his or her condition to the Provider. • A patient is responsible for reporting to the Provider whether he or she comprehends a contemplated course of action and what is expected of him or her. • A patient is responsible for following the treatment plan recommended by the Provider. • A patient is responsible for his or her actions if he or she refuses treatment or does not follow the Provider's instructions.`,
  `State Specific Notifications`,
  `FOR CALIFORNIA RESIDENTS • You or your legal representative retain the option to withhold or withdraw consent to receive health care services via the Medical Services at any time without affecting your right to future care or treatment nor risking the loss or withdrawal of any benefits to which You or Your legal representative would otherwise be entitled. • All existing confidentiality protections apply. • All existing laws regarding patient access to medical information and copies of medical records apply. • Dissemination of any of Your identifiable images or information from the telemedicine interaction to researchers or other entities shall not occur without Your consent. • All provisions herein, including Your informed consent to receive services via the Service are for the benefit of the treating provider as well as for your benefit. • Medical doctors are licensed and regulated by the Medical Board of California, (800) 632-2322, www.mbc.ca.gov`,
  `FOR FLORIDA RESIDENTS • Each provider is a physician licensed by the Florida Board of Medicine or the Florida Board of Osteopathic Medicine. Each provider's hours are variable. To access a provider's in-office schedule, go to that provider's login page where the provider's in-office hours are posted.`,
  `FOR TEXAS RESIDENTS • An additional in-person medical evaluation may be necessary to meet Your needs if the provider is unable to gather all the clinical information via the Service to safely treat You. • Unless Your provider specifically discloses otherwise, with the exception of charges for Services delivered to patients, providers do not have any financial interest in any information, products, or services offered through the Service. • The response time for emails, electronic messages and other communications can be found on Your provider's login page. • NOTICE CONCERNING COMPLAINTS • Complaints about physicians, as well as other licensees and registrants of the Texas Medical Board, including physician assistants, acupuncturists, and surgical assistants may be reported for investigation at the following address: § Texas Medical Board Attention: Investigations 333 Guadalupe, Tower 3, Suite 610 P.O. Box 2018, MC-263 Austin, Texas 78768-2018, Assistance in filing a complaint is available by calling the following telephone number: 1-800-201-9353, For more information please visit the website at www.tmb.state.tx.us`,
]

export default function ConsentHipaa({ onNext, onBack }) {
  const [checked, setChecked] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack onBack={onBack} logoSrc={boldLogo} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!checked}>Continue</PurpleButton>}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: C.text, margin: '0 0 4px' }}>Your privacy matters</h2>
          <p style={{ fontSize: 18, color: C.text, lineHeight: 1.4, margin: 0 }}>
            Bold is HIPAA compliant. We're committed to protecting your personal information.
          </p>
        </div>

        <div style={{
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 16, maxHeight: 300, overflowY: 'auto', marginBottom: 16,
        }}>
          <img src={hipaaLogo} alt="HIPAA Compliance" style={{ height: 40, marginBottom: 12, display: 'block' }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: C.textSec, margin: '0 0 8px' }}>Our Privacy Obligations</h3>
          <div style={{ fontSize: 16, color: C.textSec, lineHeight: 1.5 }}>
            {PARAGRAPHS.map((p, i) => (
              <p key={i} style={{ margin: '0 0 12px' }}>{p}</p>
            ))}
          </div>
        </div>

        <ConsentCheckbox checked={checked} onToggle={() => setChecked(c => !c)}>
          I acknowledge the HIPAA notice of privacy practices
        </ConsentCheckbox>
      </OnboardingScreen>
    </div>
  )
}
