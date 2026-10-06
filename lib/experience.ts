export type Locale = 'en' | 'fi'
export type L<T = string> = Record<Locale, T>
export type ExpType = 'Research' | 'Promoted' | 'Engineering'

export type Experience = {
  id: number
  year: string
  color: string
  type: ExpType
  role: L
  company: string
  sub?: string
  location: L
  period: L
  summary: L
  bullets: L<string[]>
  tags: L<string[]>
  promotion?: { from: L; to: L }
}

export type Education = {
  id: number
  color: string
  wm: string
  current: boolean
  level: L
  degree: L
  school: string
  location: L
  period: L
  focus: L
}

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    year: '2022',
    color: '#06b6d4',
    type: 'Research',
    role: { en: 'Research Assistant', fi: 'Tutkimusavustaja' },
    company: 'Åbo Akademi University',
    sub: '× Veri DevOps',
    location: { en: 'Turku, Finland', fi: 'Turku, Suomi' },
    period: { en: 'Dec 2022 — Feb 2023', fi: 'Joulu 2022 — Helmi 2023' },
    summary: {
      en: 'Built a Python CLI tool for real-time network attack detection using traffic pattern analysis.',
      fi: 'Rakensin Python-pohjaisen CLI-työkalun verkkohyökkäysten varhaiseen havaitsemiseen reaaliaikaisen liikennekuvioanalyysin avulla.',
    },
    bullets: {
      en: [
        'Designed a Python-based CLI for early detection of network attacks using real-time traffic pattern analysis.',
        'Tested existing security tools and documented required changes to improve detection accuracy.',
        'Created detailed research documentation collaborating with supervisors and advisors.',
      ],
      fi: [
        'Suunnittelin Python-CLI:n reaaliaikaiseen verkkoliikenteen kuvioanalyysiin ja hyökkäysten varhaiseen havaitsemiseen.',
        'Testasin olemassa olevia tietoturvatyökaluja ja dokumentoin tarvittavat muutokset havaitsemistarkkuuden parantamiseksi.',
        'Tuotin selkeän tutkimusdokumentaation yhteistyössä ohjaajien ja tutkimusryhmän kanssa.',
      ],
    },
    tags: {
      en: ['Python', 'Network Security', 'CLI', 'Research'],
      fi: ['Python', 'Verkkoturva', 'CLI', 'Tutkimus'],
    },
  },
  {
    id: 2,
    year: '2022',
    color: '#22c55e',
    type: 'Promoted',
    role: { en: 'Production Specialist → Team Coach', fi: 'Tuotantoasiantuntija → Tiimivalmentaja' },
    company: 'Swappie Oy',
    location: { en: 'Helsinki, Finland', fi: 'Helsinki, Suomi' },
    period: { en: 'Jan 2022 — Aug 2022', fi: 'Tammi 2022 — Elo 2022' },
    summary: {
      en: 'Grew from the production floor to leading the team — from doing the work to coaching the people doing it.',
      fi: 'Etenin tuotannosta tiimin vetäjäksi — tekemisestä ihmisten valmentamiseen ja prosessien kehittämiseen.',
    },
    bullets: {
      en: [
        'Production Specialist: Oversaw mobile device testing, refurbishment and resale to strict quality standards.',
        'Promoted to Team Coach: Led the production team, streamlined processes and coached members for peak performance.',
        'Aligned production goals with cross-functional teams to consistently exceed output targets.',
      ],
      fi: [
        'Tuotantoasiantuntija: Vastasin laitteiden testauksesta, kunnostuksesta ja laadunvarmistuksesta.',
        'Ylennys tiimivalmentajaksi: Johdin tuotantotiimiä, kehitin prosesseja ja valmensin tiimiläisiä.',
        'Yhteistyö eri tiimien kanssa tuotantotavoitteiden saavuttamiseksi ja laadun varmistamiseksi.',
      ],
    },
    tags: {
      en: ['Production', 'Team Leadership', 'QA', 'Process Optimization', 'Coaching'],
      fi: ['Tuotanto', 'Tiiminjohtaminen', 'QA', 'Prosessikehitys', 'Valmennus'],
    },
    promotion: {
      from: { en: 'Production Specialist', fi: 'Tuotantoasiantuntija' },
      to: { en: 'Team Coach', fi: 'Tiimivalmentaja' },
    },
  },
  {
    id: 3,
    year: '2021',
    color: '#a855f7',
    type: 'Engineering',
    role: { en: 'Test Engineer', fi: 'Testi-insinööri' },
    company: 'Marquishtech',
    location: { en: 'Remote', fi: 'Etätyö' },
    period: { en: 'Sep 2021 — Jan 2023', fi: 'Syys 2021 — Tammi 2023' },
    summary: {
      en: 'Mobile network testing across LTE, 5G and Wi-Fi to ensure optimal device performance.',
      fi: 'Mobiiliverkkojen testaus LTE-, 5G- ja Wi-Fi-ympäristöissä laitteen suorituskyvyn varmistamiseksi.',
    },
    bullets: {
      en: [
        'Conducted mobile manual network tests across LTE, 5G, and Wi-Fi for optimal device performance.',
        'Collaborated on test case development, result analysis, and product improvement recommendations.',
        'Delivered customer-centric quality assurance through continuous learning and precise testing.',
      ],
      fi: [
        'Suoritin manuaalisia mobiiliverkkotestejä LTE-, 5G- ja Wi-Fi-verkoissa.',
        'Osallistuin testitapausten kehittämiseen, tulosten analysointiin ja parannusehdotuksiin.',
        'Tuotin käyttäjälähtöistä laadunvarmistusta jatkuvan oppimisen ja tarkan testauksen avulla.',
      ],
    },
    tags: {
      en: ['Mobile Testing', 'LTE / 5G', 'Wi-Fi', 'QA'],
      fi: ['Mobiilitestaus', 'LTE / 5G', 'Wi-Fi', 'QA'],
    },
  },
  {
    id: 4,
    year: '2020',
    color: '#f59e0b',
    type: 'Promoted',
    role: { en: 'Team Member → Shift Lead', fi: 'Tiimiläinen → Vuoropäällikkö' },
    company: 'Taco Bell Finland',
    location: { en: 'Finland', fi: 'Suomi' },
    period: { en: 'Aug 2020 — Present · 5+ yrs', fi: 'Elo 2020 — Nykyhetki · 5+ v' },
    summary: {
      en: '5+ years of growth — promoted from Team Member to Shift Lead, mastering operations and people leadership.',
      fi: '5+ vuotta kasvua — ylennys tiimiläisestä vuoropäälliköksi, vahva ote operaatioihin ja ihmisten johtamiseen.',
    },
    bullets: {
      en: [
        'Team Member: Delivered fast, friendly service preparing high-volume orders to Taco Bell quality standards.',
        'Promoted to Shift Lead: Now leading the full team — managing operations, inventory, scheduling and cash handling.',
        'Drive team performance through ongoing coaching, feedback and a culture of continuous improvement.',
      ],
      fi: [
        'Tiimiläinen: Palvelin asiakkaita ja valmistin suurivolyymisia tilauksia laatuvaatimusten mukaisesti.',
        'Ylennys vuoropäälliköksi: Johdan tiimiä — vastaan operaatioista, inventaariosta, työvuoroista ja kassasta.',
        'Kehitän tiimin suorituskykyä valmennuksella, palautteella ja jatkuvan parantamisen kulttuurilla.',
      ],
    },
    tags: {
      en: ['Team Leadership', 'Operations', 'Inventory', 'Scheduling', 'Coaching'],
      fi: ['Tiiminjohtaminen', 'Operaatiot', 'Inventaario', 'Työvuorosuunnittelu', 'Valmennus'],
    },
    promotion: {
      from: { en: 'Team Member', fi: 'Tiimiläinen' },
      to: { en: 'Shift Lead', fi: 'Vuoropäällikkö' },
    },
  },
]

export const EDUCATION: Education[] = [
  {
    id: 1,
    color: '#38bdf8',
    wm: 'B.ENG',
    current: false,
    level: { en: 'Bachelor', fi: 'Kandidaatti' },
    degree: { en: 'B.Eng. Information Technology', fi: 'Ins. (AMK) · Tietotekniikka' },
    school: 'Centria University of Applied Sciences',
    location: { en: 'Finland', fi: 'Suomi' },
    period: { en: '2017 — 2020', fi: '2017 — 2020' },
    focus: {
      en: 'Software engineering & web development',
      fi: 'Ohjelmistokehitys ja web-teknologiat',
    },
  },
  {
    id: 2,
    color: '#06b6d4',
    wm: 'M.SC',
    current: true,
    level: { en: 'Master', fi: 'Maisteri' },
    degree: { en: 'M.Sc. Computer Engineering', fi: 'DI / M.Sc. · Tietokonetekniikka' },
    school: 'Åbo Akademi University',
    location: { en: 'Turku, Finland', fi: 'Turku, Suomi' },
    period: { en: '2022 — Present', fi: '2022 — Nykyhetki' },
    focus: {
      en: 'AI, data science & network security',
      fi: 'AI, data science ja verkkoturva',
    },
  },
]