export type Locale = 'en' | 'fi'

export type Certification = {
  id: string
  title: string
  provider: string
  year: string
  accent: string
  iconLabel: string
  type: 'image' | 'pdf'
  src: string
  description: Record<Locale, string>
  skills: Record<Locale, string[]>
}

const img = (name: string) => encodeURI(`/images/${name}`)

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'gda',
    title: 'Google Data Analytics',
    provider: 'Coursera · Google',
    year: '2023',
    accent: '#22c55e',
    iconLabel: 'DA',
    type: 'image',
    src: img('Google data analytics.jpg.jpeg'),
    description: {
      en: 'End-to-end analytics: collecting, cleaning and transforming data, then building dashboards for insight.',
      fi: 'Koko analytiikkaputki: datan keruu, puhdistus ja muokkaus sekä dashboardien rakentaminen oivalluksia varten.',
    },
    skills: {
      en: ['SQL', 'Tableau', 'R', 'Data Cleaning'],
      fi: ['SQL', 'Tableau', 'R', 'Datan puhdistus'],
    },
  },
  {
    id: 'git-python',
    title: 'Google IT Automation with Python',
    provider: 'Coursera · Google',
    year: '2024',
    accent: '#0ea5e9',
    iconLabel: 'GP',
    type: 'pdf',
    src: img('Google IT Automation With Python.pdf'),
    description: {
      en: 'Python, Git and IT automation for modern IT support and systems administration roles.',
      fi: 'Python, Git ja IT-automaatiotyökalut nykyaikaisiin IT-tuki- ja järjestelmänhallintatehtäviin.',
    },
    skills: {
      en: ['Python', 'Git & GitHub', 'Automation', 'Cloud Config'],
      fi: ['Python', 'Git & GitHub', 'Automaatiot', 'Pilvikonfigurointi'],
    },
  },
  {
    id: 'gpm',
    title: 'Google Project Management',
    provider: 'Coursera · Google',
    year: '2023',
    accent: '#f59e0b',
    iconLabel: 'PM',
    type: 'pdf',
    src: img('Google Project Management Certificate.pdf'),
    description: {
      en: 'Initiating, planning and running projects from kickoff to delivery using both Agile and waterfall.',
      fi: 'Projektien käynnistys, suunnittelu ja toteutus aloituksesta toimitukseen — Agile ja vesiputous.',
    },
    skills: {
      en: ['Agile', 'Project Planning', 'Risk Management'],
      fi: ['Agile', 'Projektisuunnittelu', 'Riskienhallinta'],
    },
  },
  {
    id: 'cloud-cyber',
    title: 'Elements of Cloud & Cybersecurity',
    provider: 'Microsoft Skills for Jobs · Kajaanin AMK',
    year: '2024',
    accent: '#06b6d4',
    iconLabel: 'CC',
    type: 'image',
    src: img('Cloud and cybersecurity certificate.PNG'),
    description: {
      en: 'Fundamentals of cloud platforms, identity, and cybersecurity concepts for securing modern infrastructure.',
      fi: 'Pilvialustojen, identiteetin ja kyberturvan perusteet modernin infrastruktuurin suojaamiseksi.',
    },
    skills: {
      en: ['Cloud Basics', 'Cybersecurity', 'Identity & Access'],
      fi: ['Pilven perusteet', 'Kyberturvallisuus', 'Identiteetti & pääsynhallinta'],
    },
  },
  {
    id: 'azure-badge',
    title: 'Azure Fundamentals',
    provider: 'Microsoft Skills for Jobs',
    year: '2024',
    accent: '#3b82f6',
    iconLabel: 'AZ',
    type: 'image',
    src: img('Microsoft Azure Fundamental badge.png'),
    description: {
      en: 'Core Azure services, pricing, governance and security – a solid base for cloud and DevOps roles.',
      fi: 'Azuressa keskeiset palvelut, hinnoittelu, hallintamallit ja tietoturva — vahva perusta pilvi- ja DevOps-rooleihin.',
    },
    skills: {
      en: ['Azure Services', 'Cloud Concepts', 'Security'],
      fi: ['Azure-palvelut', 'Pilvikonseptit', 'Tietoturva'],
    },
  },
  {
    id: 'ibm-it',
    title: 'IT Technical Support Programme',
    provider: 'IBM SkillsBuild · SkillUp Online',
    year: '2023',
    accent: '#8b5cf6',
    iconLabel: 'IT',
    type: 'image',
    src: img('ibm-it-support-certificate.jpg'),
    description: {
      en: 'Hands-on IT support: troubleshooting, ticketing, escalation and clear communication with users.',
      fi: 'Käytännön IT-tuki: vianhaku, tikettityö, eskalointi ja selkeä viestintä käyttäjien kanssa.',
    },
    skills: {
      en: ['IT Support', 'Troubleshooting', 'Customer Focus'],
      fi: ['IT-tuki', 'Vianmääritys', 'Asiakaspalvelu'],
    },
  },
  {
    id: 'udemy-it',
    title: 'IT Support Technical Skills Bootcamp',
    provider: 'Udemy',
    year: '2023',
    accent: '#a855f7',
    iconLabel: 'TS',
    type: 'image',
    src: img('it-support-technical-skills-bootcamp.jpg'),
    description: {
      en: 'Bootcamp covering networking basics, Windows administration and day-to-day helpdesk workflows.',
      fi: 'Bootcamp: verkkoperusteet, Windows-hallinta ja arjen helpdesk-työskentely.',
    },
    skills: {
      en: ['Networking Basics', 'Windows', 'Helpdesk'],
      fi: ['Verkkoperusteet', 'Windows', 'Helpdesk'],
    },
  },
  {
    id: 'primavera',
    title: 'Primavera P6 Project Planning',
    provider: 'Udemy',
    year: '2024',
    accent: '#f97316',
    iconLabel: 'P6',
    type: 'image',
    src: img('Primavera-P6.jpeg'),
    description: {
      en: 'Planning and controlling complex timelines with Primavera P6 – WBS, dependencies, baselines and tracking.',
      fi: 'Aikataulujen suunnittelu ja ohjaus Primavera P6:lla — WBS, riippuvuudet, baseline ja seuranta.',
    },
    skills: {
      en: ['Project Planning', 'Scheduling', 'Primavera P6'],
      fi: ['Projektisuunnittelu', 'Aikataulutus', 'Primavera P6'],
    },
  },
  {
    id: 'python-bootcamp',
    title: 'Complete Python Bootcamp: Zero to Hero',
    provider: 'Udemy',
    year: '2021',
    accent: '#38bdf8',
    iconLabel: 'PY',
    type: 'image',
    src: img('Pyhton-Bootcamp.jpg'),
    description: {
      en: 'From Python basics to OOP and working with data through real projects and coding exercises.',
      fi: 'Pythonin perusteista OOP:hen ja dataan — harjoituksia ja projekteja käytännön kautta.',
    },
    skills: {
      en: ['Python', 'Scripting', 'OOP'],
      fi: ['Python', 'Skriptaus', 'OOP'],
    },
  },
  {
    id: 'freecodecamp',
    title: 'Responsive Web Design',
    provider: 'freeCodeCamp',
    year: '2019',
    accent: '#10b981',
    iconLabel: 'RW',
    type: 'pdf',
    src: img('freecodecamp.pdf'),
    description: {
      en: '300 hours of coursework in responsive web design, HTML and CSS fundamentals for the modern web.',
      fi: '300 tuntia responsiivisen web-suunnittelun opintoja: HTML- ja CSS-perusteet moderniin webiin.',
    },
    skills: {
      en: ['HTML', 'CSS', 'Responsive Design', 'Accessibility'],
      fi: ['HTML', 'CSS', 'Responsiivinen design', 'Saavutettavuus'],
    },
  },
  {
    id: 'fsecure',
    title: 'F-Secure PMCS Technical Training',
    provider: 'F-Secure Corporation',
    year: '2020',
    accent: '#ef4444',
    iconLabel: 'FS',
    type: 'pdf',
    src: img('F-secure.pdf'),
    description: {
      en: 'Technical certification on F-Secure PMCS features, security concepts and deployment best practices.',
      fi: 'Tekninen sertifiointi: F-Secure PMCS -ominaisuudet, tietoturvakäsitteet ja käyttöönoton parhaat käytännöt.',
    },
    skills: {
      en: ['Cybersecurity', 'PMCS', 'Security Products'],
      fi: ['Kyberturvallisuus', 'PMCS', 'Tietoturvatuotteet'],
    },
  },
  {
    id: 'dude',
    title: 'DUDE Project Participation',
    provider: 'Centria University of Applied Sciences',
    year: '2020',
    accent: '#14b8a6',
    iconLabel: 'DU',
    type: 'pdf',
    src: img('dude.pdf'),
    description: {
      en: 'Integrated Pipedrive data via API into SQL and planned a video stream website — 81 hours of project work.',
      fi: 'Pipedrive-datan integrointi API:n kautta SQL:ään sekä videosuoratoistosivuston suunnittelu — 81 tuntia projektityötä.',
    },
    skills: {
      en: ['API Integration', 'SQL', 'Web Development'],
      fi: ['API-integraatio', 'SQL', 'Web-kehitys'],
    },
  },
  {
    id: 'sap',
    title: 'SAP Introduction',
    provider: 'SAP',
    year: '2019',
    accent: '#f59e0b',
    iconLabel: 'SP',
    type: 'pdf',
    src: img('SAP.pdf'),
    description: {
      en: 'Introduction to SAP ERP and business systems, finishing with an online knowledge test on core concepts.',
      fi: 'Johdanto SAP ERP:hen ja yritysjärjestelmiin — lopuksi verkkotentti ydinkäsitteistä.',
    },
    skills: {
      en: ['SAP', 'ERP', 'Business Systems'],
      fi: ['SAP', 'ERP', 'Yritysjärjestelmät'],
    },
  },
  {
    id: 'softcherry',
    title: 'Frontend Developer — Soft Cherry',
    provider: 'Soft Cherry Pvt. Ltd.',
    year: '2018–2019',
    accent: '#f43f5e',
    iconLabel: 'SC',
    type: 'pdf',
    src: img('softcherry.pdf'),
    description: {
      en: 'Experience letter from a frontend role: UI mockups with Photoshop, Adobe XD, Figma and Illustrator.',
      fi: 'Työtodistus frontend-roolista: UI-mockupit Photoshopilla, Adobe XD:llä, Figmalla ja Illustratorilla.',
    },
    skills: {
      en: ['Figma', 'Adobe XD', 'UI Design', 'UX Research'],
      fi: ['Figma', 'Adobe XD', 'UI-suunnittelu', 'UX-tutkimus'],
    },
  },
]