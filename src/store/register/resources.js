import CompanyImg from "assets/images/register/company.svg";
import DaoImg from "assets/images/register/dao.png";
import IndividualImg from "assets/images/register/individual.svg";

export const organisationInfo = [
  {
    id: 1,
    name: "Individual",
    subtitle:
      "Secure your personal crypto assets with best security and convenience",
    img: IndividualImg,
    points: [
      "Proactively reintermediate impactful platforms vis-a-vis multidisciplinary leadership skills. Distinctively drive error-free ROI and 2.0.",
      'Continually integrate visionary applications before e-business platforms. Rapidiously simplify inexpensive partnerships vis-a-vis accurate bandwidth. Phosfluorescently incubate transparent internal or "organic" sources for vertical functionalities.',
      "Completely engage fully tested infrastructures via worldwide experiences. Holisticly deploy enterprise-wide collaboration and idea-sharing with economically sound paradigms. Distinctively administrate just.",
    ],
  },
  {
    id: 2,
    name: "Company",
    subtitle: "Frictionless management of your corporate crypto treasury",
    img: CompanyImg,
    points: [
      "Proactively reintermediate impactful platforms vis-a-vis multidisciplinary leadership skills. Distinctively drive error-free ROI and 2.0.",
      'Continually integrate visionary applications before e-business platforms. Rapidiously simplify inexpensive partnerships vis-a-vis accurate bandwidth. Phosfluorescently incubate transparent internal or "organic" sources for vertical functionalities.',
      "Completely engage fully tested infrastructures via worldwide experiences. Holisticly deploy enterprise-wide collaboration and idea-sharing with economically sound paradigms. Distinctively administrate just.",
    ],
  },
  {
    id: 3,
    name: "DAO",
    subtitle:
      "Collaborate with co-signers of your multisig and manage payouts seamlessly",
    img: DaoImg,
    points: [
      "Proactively reintermediate impactful platforms vis-a-vis multidisciplinary leadership skills. Distinctively drive error-free ROI and 2.0.",
      'Continually integrate visionary applications before e-business platforms. Rapidiously simplify inexpensive partnerships vis-a-vis accurate bandwidth. Phosfluorescently incubate transparent internal or "organic" sources for vertical functionalities.',
      "Completely engage fully tested infrastructures via worldwide experiences. Holisticly deploy enterprise-wide collaboration and idea-sharing with economically sound paradigms. Distinctively administrate just.",
    ],
  },
];

export const FLOWS = {
  COMPANY: "COMPANY",
  INDIVIDUAL: "INDIVIDUAL",
  DAO: "DAO",
};

export const ORGANISATION_TYPE = {
  PRIVATE: "0",
  PUBLIC: "1",
};

export const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
};

export const COMPANY_REGISTER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "About you",
  [STEPS.TWO]: "Owner Details",
  [STEPS.THREE]: "Owner Name and Address",
  [STEPS.FOUR]: "Threshold",
  [STEPS.FIVE]: "Privacy",
  [STEPS.SIX]: "Review your entry",
};

export const DAO_REGISTER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "About you",
  [STEPS.TWO]: "Owner Details",
  [STEPS.THREE]: "Owner Name and Address",
  [STEPS.FOUR]: "Threshold",
  [STEPS.FIVE]: "Privacy",
  [STEPS.SIX]: "Review your entry",
};

export const INDIVIDUAL_REGISTER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "About you",
  [STEPS.TWO]: "Owner Details",
  [STEPS.THREE]: "Owner Name and Address",
  [STEPS.FOUR]: "Threshold",
  [STEPS.FIVE]: "Privacy",
  [STEPS.SIX]: "Review your entry",
};
