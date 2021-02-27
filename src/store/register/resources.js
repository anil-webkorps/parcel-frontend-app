import CompanyImg from "assets/images/register/company.svg";
import DaoImg from "assets/images/register/dao.png";
import IndividualImg from "assets/images/register/individual.svg";

export const organisationInfo = [
  {
    id: 1,
    name: "Individual",
    subtitle: "Manage your personal crypto assets",
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
    subtitle: "Fully customize how you manage your company crypto assets",
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
      "Collaborate with people all over the world and work toward shared goals.",
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
  [STEPS.ZERO]: {
    title: "Connect",
    subtitle: "",
  },
  [STEPS.ONE]: {
    title: "About you",
    subtitle: "Please choose what defines you the best.",
  },
  [STEPS.TWO]: {
    title: "Company Name",
    subtitle: "You’ll be registered with this name on Parcel.",
  },
  [STEPS.THREE]: {
    title: "Owner Name and Address",
    subtitle: "You can add multiple owners",
  },
  [STEPS.FOUR]: {
    title: "Threshold",
    subtitle: "How many people should authorize transactions?",
  },
  [STEPS.FIVE]: {
    title: "Privacy",
    subtitle: "Please sign this message.",
  },
  [STEPS.SIX]: {
    title: "Review your entry",
    subtitle: "Kindly verify the details before creating an account.",
  },
};

export const DAO_REGISTER_STEPS = {
  [STEPS.ZERO]: {
    title: "Connect",
    subtitle: "",
  },
  [STEPS.ONE]: {
    title: "About you",
    subtitle: "Please choose what defines you the best.",
  },
  [STEPS.TWO]: {
    title: "Organization Name",
    subtitle: "You’ll be registered with this name on Parcel.",
  },
  [STEPS.THREE]: {
    title: "Owner Name and Address",
    subtitle: "You can add multiple owners",
  },
  [STEPS.FOUR]: {
    title: "Threshold",
    subtitle: "How many people should authorize transactions?",
  },
  [STEPS.FIVE]: {
    title: "Privacy",
    subtitle: "Please sign this message.",
  },
  [STEPS.SIX]: {
    title: "Review your entry",
    subtitle: "Kindly verify the details before creating an account.",
  },
};

export const INDIVIDUAL_REGISTER_STEPS = {
  [STEPS.ZERO]: {
    title: "Connect",
    subtitle: "",
  },
  [STEPS.ONE]: {
    title: "About you",
    subtitle: "Please choose what defines you the best.",
  },
  [STEPS.TWO]: {
    title: "Your Name",
    subtitle: "You’ll be registered with this name on Parcel.",
  },
  [STEPS.THREE]: {
    title: "Owner Name and Address",
    subtitle: "You can add multiple owners",
  },
  [STEPS.FOUR]: {
    title: "Threshold",
    subtitle: "How many people should authorize transactions?",
  },
  [STEPS.FIVE]: {
    title: "Privacy",
    subtitle: "Please sign this message.",
  },
  [STEPS.SIX]: {
    title: "Review your entry",
    subtitle: "Kindly verify the details before creating an account.",
  },
};
