// ---------------------------------------------------------------------------
// AttendeAI – Internationalisation (pt / en / es)
// ---------------------------------------------------------------------------

export type Locale = 'pt' | 'en' | 'es'

// ---- message shape used in use-case previews -----------------------------
interface PreviewMessage {
  who: 'bot' | 'user' | 'confirm'
  text: string
}

// ---- use-case shape ------------------------------------------------------
interface UseCase {
  title: string
  desc: string
  points: string[]
  preview: PreviewMessage[]
}

// ---- feature card --------------------------------------------------------
interface FeatureCard {
  title: string
  desc: string
}

// ---- pricing plan --------------------------------------------------------
interface PricingPlan {
  name: string
  price: string
  priceAnnual: string
  desc: string
  features: string[]
  cta: string
  popular?: boolean
}

// ---- FAQ pair ------------------------------------------------------------
interface FaqItem {
  q: string
  a: string
}

// ---- full translation tree -----------------------------------------------
export interface Translations {
  nav: {
    howItWorks: string
    useCases: string
    features: string
    pricing: string
    faq: string
    login: string
    signup: string
  }

  hero: {
    pill: string
    title1: string
    title2: string
    titleEm: string
    title3: string
    sub: string
    cta: string
    trustAvailability: string
    trustResponseRate: string
    trustCostPerMissed: string
  }

  heroConversation: {
    brandName: string
    subtitle: string
    online: string
    bot1: string
    user1: string
    bot2: string
    user2: string
    confirm: string
  }

  heroDashboard: {
    inboxUrl: string
    attendances: string
    scheduled: string
    avgTime: string
    attendancesChange: string
    scheduledChange: string
    avgTimeChange: string
    chartTitle: string
    chartSub: string
    event1Title: string
    event1Sub: string
    event2Title: string
    event2Sub: string
    event3Title: string
    event3Sub: string
  }

  heroPhone: {
    brandName: string
    status: string
    bot1: string
    user1: string
    bot2: string
    user2: string
    confirm: string
  }

  logos: {
    heading: string
    googleCalendar: string
    whatsappBusiness: string
  }

  howItWorks: {
    eyebrow: string
    title: string
    sub: string
    steps: {
      num: string
      label: string
      title: string
      desc: string
    }[]
  }

  useCases: {
    eyebrow: string
    title: string
    sub: string
    tabs: string[]
    salao: UseCase
    clinica: UseCase
    oficina: UseCase
    estudio: UseCase
    restaurante: UseCase
  }

  features: {
    eyebrow: string
    title: string
    sub: string
    cards: FeatureCard[]
  }

  pricing: {
    eyebrow: string
    title: string
    sub: string
    monthly: string
    annual: string
    periodMonthly: string
    periodAnnual: string
    badge: string
    plans: PricingPlan[]
    footer: string
  }

  faq: {
    eyebrow: string
    title: string
    items: FaqItem[]
  }

  ctaFinal: {
    eyebrow: string
    titleStart: string
    titleEm: string
    titleEnd: string
    sub: string
    cta: string
  }

  footer: {
    terms: string
    privacy: string
    support: string
    blog: string
    contact: string
    copyright: string
    madeIn: string
  }

  langSelector: {
    pt: string
    en: string
    es: string
  }
}

// ---------------------------------------------------------------------------
// Portuguese (Brazil) – original
// ---------------------------------------------------------------------------
const pt: Translations = {
  nav: {
    howItWorks: 'Como funciona',
    useCases: 'Casos de uso',
    features: 'Recursos',
    pricing: 'Pre\u00e7os',
    faq: 'FAQ',
    login: 'Entrar',
    signup: 'Criar conta',
  },

  hero: {
    pill: 'IA em produ\u00e7\u00e3o 24/7 no WhatsApp',
    title1: 'Seu neg\u00f3cio',
    title2: 'nunca',
    titleEm: 'para de',
    title3: 'atender clientes.',
    sub: 'Um agente de IA que atende clientes pelo WhatsApp, agenda no Google Calendar, responde d\u00favidas e cuida dos clientes \u2014 enquanto voc\u00ea cuida do que importa.',
    cta: 'Ver demonstra\u00e7\u00e3o',
    trustAvailability: 'disponibilidade',
    trustResponseRate: 'taxa de resposta',
    trustCostPerMissed: 'custo por mensagem perdida',
  },

  heroConversation: {
    brandName: 'Sal\u00e3o da Ana',
    subtitle: 'whatsapp \u00b7 attendeai',
    online: 'online',
    bot1: 'Ol\u00e1! Bem-vinda ao Sal\u00e3o da Ana. Como posso ajudar hoje?',
    user1: 'Quero agendar um corte pra sexta',
    bot2: 'Perfeito! Temos hor\u00e1rios \u00e0s 10h, 14h e 16h na sexta. Qual prefere?',
    user2: '14h t\u00e1 \u00f3timo!',
    confirm: 'Agendado \u2014 sexta, 14h. Te envio um lembrete na v\u00e9spera.',
  },

  heroDashboard: {
    inboxUrl: 'app.attende.ai / inbox',
    attendances: 'Atendimentos',
    scheduled: 'Agendados',
    avgTime: 'Tempo m\u00e9dio',
    attendancesChange: '\u2197 32% esta semana',
    scheduledChange: '\u2197 18%',
    avgTimeChange: '\u2198 45%',
    chartTitle: 'Conversas por dia',
    chartSub: '\u00faltimos 7 dias',
    event1Title: 'Maria Silva confirmou agendamento',
    event1Sub: 'corte \u00b7 sexta 14:00',
    event2Title: 'Chamada atendida \u00b7 2m 18s',
    event2Sub: '+55 11 9\u00b7\u00b7\u00b7\u00b7 \u00b7 belo horizonte',
    event3Title: '3 agendamentos criados',
    event3Sub: 'google calendar \u00b7 sincronizado',
  },

  heroPhone: {
    brandName: 'Sal\u00e3o da Ana',
    status: 'IA ativa \u00b7 respondendo',
    bot1: 'Ol\u00e1! Como posso ajudar?',
    user1: 'Agendar corte sexta',
    bot2: '10h, 14h ou 16h?',
    user2: '14h',
    confirm: 'Agendado!',
  },

  logos: {
    heading: 'Integrado com as ferramentas que voc\u00ea j\u00e1 usa',
    googleCalendar: 'Google Calendar',
    whatsappBusiness: 'WhatsApp Business',
  },

  howItWorks: {
    eyebrow: 'Como funciona',
    title: 'Do contato ao agendamento em segundos.',
    sub: 'Seu agente responde, entende e agenda \u2014 sem precisar de nenhuma a\u00e7\u00e3o sua.',
    steps: [
      {
        num: '01',
        label: 'contato',
        title: 'Cliente entra em contato',
        desc: 'Pelo WhatsApp, o agente atende imediatamente, a qualquer hora do dia ou da noite.',
      },
      {
        num: '02',
        label: 'compreens\u00e3o',
        title: 'IA entende e responde',
        desc: 'O agente entende a inten\u00e7\u00e3o com linguagem natural, responde d\u00favidas e coleta as informa\u00e7\u00f5es necess\u00e1rias.',
      },
      {
        num: '03',
        label: 'agendamento',
        title: 'Agenda automaticamente',
        desc: 'Consulta o Google Calendar em tempo real e confirma o hor\u00e1rio diretamente com o cliente.',
      },
      {
        num: '04',
        label: 'confirmado',
        title: 'Agendamento salvo',
        desc: 'O agendamento \u00e9 registrado no Google Calendar e no painel. Voc\u00ea acompanha tudo em um s\u00f3 lugar, sem precisar fazer nada.',
      },
    ],
  },

  useCases: {
    eyebrow: 'Casos de uso',
    title: 'Feito para o ritmo do seu neg\u00f3cio.',
    sub: 'Veja como a AttendeAI se adapta \u00e0 rotina de diferentes segmentos \u2014 do sal\u00e3o de beleza \u00e0 cl\u00ednica m\u00e9dica.',
    tabs: ['Sal\u00e3o de beleza', 'Cl\u00ednica m\u00e9dica', 'Oficina', 'Est\u00fadio / Academia', 'Restaurante'],

    salao: {
      title: 'Sal\u00e3o de beleza',
      desc: 'Clientes mandando mensagem a qualquer hora querendo agendar corte, barba, colora\u00e7\u00e3o. A IA responde na hora, verifica os hor\u00e1rios livres no calend\u00e1rio e confirma o agendamento \u2014 tudo pelo WhatsApp.',
      points: [
        'Atendimento 24/7 \u2014 inclusive fora do hor\u00e1rio',
        'Verifica\u00e7\u00e3o de disponibilidade em tempo real',
        'Confirma\u00e7\u00e3o autom\u00e1tica pelo WhatsApp',
        'IA treinada com os servi\u00e7os e pre\u00e7os do sal\u00e3o',
      ],
      preview: [
        { who: 'bot', text: 'Ol\u00e1! Bem-vinda ao Sal\u00e3o da Ana. Como posso ajudar hoje?' },
        { who: 'user', text: 'Quero agendar um corte pra sexta' },
        { who: 'bot', text: 'Perfeito! Temos hor\u00e1rios \u00e0s 10h, 14h e 16h na sexta.' },
        { who: 'user', text: '14h t\u00e1 \u00f3timo!' },
        { who: 'confirm', text: 'Agendado \u2014 sexta 14h. At\u00e9 l\u00e1!' },
      ],
    },

    clinica: {
      title: 'Cl\u00ednica m\u00e9dica',
      desc: 'Pacientes ligando fora do hor\u00e1rio, mensagens sem resposta, encaixes dif\u00edceis. A IA atende pelo WhatsApp, verifica disponibilidade da agenda do m\u00e9dico e confirma a consulta.',
      points: [
        'Agendamento 24h sem depender de secret\u00e1ria',
        'Verifica\u00e7\u00e3o de disponibilidade por especialista',
        'Confirma\u00e7\u00e3o e lembrete autom\u00e1tico',
        'IA treinada com especialidades e hor\u00e1rios da cl\u00ednica',
      ],
      preview: [
        { who: 'user', text: 'Preciso marcar uma consulta com dermatologista' },
        { who: 'bot', text: 'Dra. Marina tem hor\u00e1rios quinta 10h e sexta 15h. Qual prefere?' },
        { who: 'user', text: 'Quinta 10h' },
        { who: 'confirm', text: 'Consulta agendada. Dra. Marina \u00b7 quinta 10h.' },
      ],
    },

    oficina: {
      title: 'Oficina mec\u00e2nica',
      desc: 'Clientes mandando mensagem pra saber se podem levar o carro. A IA responde na hora, verifica disponibilidade e agenda o servi\u00e7o no Google Calendar.',
      points: [
        'Agendamento de servi\u00e7os pelo WhatsApp 24h',
        'Consulta de disponibilidade de box em tempo real',
        'Confirma\u00e7\u00e3o autom\u00e1tica e lembrete na v\u00e9spera',
        'IA treinada com os servi\u00e7os da oficina',
      ],
      preview: [
        { who: 'user', text: 'Preciso trocar o \u00f3leo, tem vaga amanh\u00e3?' },
        { who: 'bot', text: 'Amanh\u00e3 temos vaga \u00e0s 8h e \u00e0s 14h. Qual hor\u00e1rio prefere?' },
        { who: 'user', text: '8h da manh\u00e3' },
        { who: 'bot', text: 'Modelo do carro?' },
        { who: 'confirm', text: 'Agendado \u2014 ter\u00e7a 09:30. At\u00e9 l\u00e1!' },
      ],
    },

    estudio: {
      title: 'Est\u00fadio & academia',
      desc: 'Alunos consultando hor\u00e1rios e querendo agendar aulas experimentais. A IA responde na hora, verifica disponibilidade e confirma o agendamento pelo WhatsApp.',
      points: [
        'Agendamento de aulas e experimentais 24h',
        'Consulta de hor\u00e1rios dispon\u00edveis por modalidade',
        'Confirma\u00e7\u00e3o direta no Google Calendar',
        'IA treinada com a grade e servi\u00e7os da sua academia',
      ],
      preview: [
        { who: 'user', text: 'Tem yoga \u00e0 noite?' },
        { who: 'bot', text: 'Sim! Segunda, quarta e sexta \u00e0s 19h.' },
        { who: 'user', text: 'Posso fazer uma aula experimental?' },
        { who: 'bot', text: 'Claro, posso marcar pra segunda 19h?' },
        { who: 'confirm', text: 'Aula experimental agendada. At\u00e9 segunda!' },
      ],
    },

    restaurante: {
      title: 'Restaurante',
      desc: 'Clientes querendo fazer reservas pelo WhatsApp, a qualquer hora. A IA atende, verifica disponibilidade e confirma a reserva no Google Calendar.',
      points: [
        'Reservas 24h sem depender de liga\u00e7\u00e3o',
        'Verifica\u00e7\u00e3o de disponibilidade em tempo real',
        'Confirma\u00e7\u00e3o autom\u00e1tica pelo WhatsApp',
        'IA treinada com hor\u00e1rios e informa\u00e7\u00f5es do restaurante',
      ],
      preview: [
        { who: 'user', text: 'Mesa pra 4 s\u00e1bado 20h?' },
        { who: 'bot', text: 'Temos disponibilidade. Confirmo a reserva?' },
        { who: 'user', text: 'Sim!' },
        { who: 'bot', text: 'Perfeito. Alguma restri\u00e7\u00e3o alimentar?' },
        { who: 'confirm', text: 'Reserva 4 pessoas \u00b7 s\u00e1bado 20h.' },
      ],
    },
  },

  features: {
    eyebrow: 'Recursos',
    title: 'Tudo que um atendente profissional faz \u2014 e mais.',
    sub: 'Sem folgas, sem hora extra, sem atestado. O melhor atendente do seu neg\u00f3cio custa menos que um almo\u00e7o por dia.',
    cards: [
      {
        title: 'WhatsApp inteligente',
        desc: 'Responde mensagens com entendimento contextual, linguagem natural e tom profissional \u2014 como um atendente treinado.',
      },
      {
        title: 'Agendamento em tempo real',
        desc: 'Consulta disponibilidade, cria eventos no Google Calendar e confirma com o cliente \u2014 tudo autom\u00e1tico.',
      },
      {
        title: 'Personaliza\u00e7\u00e3o total',
        desc: 'Configure servi\u00e7os, pre\u00e7os e hor\u00e1rios. A IA se adapta ao seu neg\u00f3cio, n\u00e3o o contr\u00e1rio.',
      },
      {
        title: 'Painel de gest\u00e3o',
        desc: 'Agendamentos organizados num painel limpo. Acompanhe tudo sem precisar abrir o WhatsApp.',
      },
      {
        title: 'Hist\u00f3rico de agendamentos',
        desc: 'Todos os agendamentos registrados, com filtros por data, cliente e servi\u00e7o.',
      },
      {
        title: 'Dispon\u00edvel 24/7',
        desc: 'O agente nunca para. Atende de madrugada, no feriado e no domingo \u2014 sem custo extra.',
      },
    ],
  },

  pricing: {
    eyebrow: 'Planos e pre\u00e7os',
    title: 'Comece hoje. Cancele quando quiser.',
    sub: 'Sem taxa de ades\u00e3o, sem fidelidade. S\u00f3 resultados.',
    monthly: 'Mensal',
    annual: 'Anual',
    periodMonthly: 'por m\u00eas \u00b7 faturado mensalmente',
    periodAnnual: 'por m\u00eas \u00b7 faturado anualmente',
    badge: 'Mais popular',
    plans: [
      {
        name: 'Starter',
        price: 'R$ 97',
        priceAnnual: 'R$ 77',
        desc: 'Para quem est\u00e1 come\u00e7ando e quer testar o poder da IA no atendimento.',
        features: [
          '1 agente de IA',
          'At\u00e9 200 mensagens/m\u00eas',
          'Integra\u00e7\u00e3o com Google Calendar',
          'Painel b\u00e1sico',
          'Suporte por e-mail',
        ],
        cta: 'Come\u00e7ar agora',
      },
      {
        name: 'Pro',
        price: 'R$ 197',
        priceAnnual: 'R$ 157',
        desc: 'Para neg\u00f3cios que j\u00e1 recebem volume e precisam escalar o atendimento.',
        features: [
          '1 agente de IA',
          'Mensagens ilimitadas',
          'Integra\u00e7\u00e3o com Google Calendar',
          'Painel completo com m\u00e9tricas',
          'Hist\u00f3rico de agendamentos',
          'Suporte priorit\u00e1rio',
        ],
        cta: 'Come\u00e7ar agora',
        popular: true,
      },
      {
        name: 'Business',
        price: 'R$ 397',
        priceAnnual: 'R$ 317',
        desc: 'Para opera\u00e7\u00f5es com m\u00faltiplos profissionais e alto volume de atendimento.',
        features: [
          'At\u00e9 5 agentes de IA',
          'Mensagens ilimitadas',
          'Integra\u00e7\u00e3o com Google Calendar',
          'Painel avan\u00e7ado com analytics',
          'API de integra\u00e7\u00e3o',
          'Gerente de conta dedicado',
        ],
        cta: 'Come\u00e7ar agora',
      },
    ],
    footer: 'Pagamento 100% seguro',
  },

  faq: {
    eyebrow: 'Perguntas frequentes',
    title: 'Ainda tem d\u00favidas?',
    items: [
      {
        q: 'Preciso saber programa\u00e7\u00e3o para configurar?',
        a: 'N\u00e3o. A configura\u00e7\u00e3o \u00e9 feita pelo painel, sem c\u00f3digo. Voc\u00ea cadastra seus servi\u00e7os, hor\u00e1rios e pre\u00e7os e a IA j\u00e1 come\u00e7a a atender.',
      },
      {
        q: 'Funciona com qualquer n\u00famero de WhatsApp?',
        a: 'Sim. Basta conectar seu WhatsApp Business pelo QR Code no painel. Em poucos minutos o agente est\u00e1 ativo.',
      },
      {
        q: 'E se a IA n\u00e3o souber responder algo?',
        a: 'O agente \u00e9 treinado para reconhecer seus limites. Se n\u00e3o souber a resposta, ele informa o cliente e pode encaminhar para atendimento humano.',
      },
      {
        q: 'Posso cancelar a qualquer momento?',
        a: 'Sim. Sem fidelidade, sem multa. Voc\u00ea cancela quando quiser diretamente pelo painel.',
      },
    ],
  },

  ctaFinal: {
    eyebrow: 'Comece agora',
    titleStart: 'Seu pr\u00f3ximo cliente est\u00e1',
    titleEm: 'tentando',
    titleEnd: 'te contatar agora.',
    sub: 'Enquanto voc\u00ea dorme, descansa ou est\u00e1 ocupado, a AttendeAI garante que nenhum cliente fique sem resposta.',
    cta: 'Falar com um humano',
  },

  footer: {
    terms: 'Termos',
    privacy: 'Privacidade',
    support: 'Suporte',
    blog: 'Blog',
    contact: 'Fale conosco',
    copyright: '\u00a9 2026 AttendeAI',
    madeIn: 'feito no brasil \ud83c\udde7\ud83c\uddf7',
  },

  langSelector: {
    pt: 'PT',
    en: 'EN',
    es: 'ES',
  },
}

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------
const en: Translations = {
  nav: {
    howItWorks: 'How it works',
    useCases: 'Use cases',
    features: 'Features',
    pricing: 'Pricing',
    faq: 'FAQ',
    login: 'Log in',
    signup: 'Get started',
  },

  hero: {
    pill: 'AI in production 24/7 on WhatsApp',
    title1: 'Your business',
    title2: 'never',
    titleEm: 'stops',
    title3: 'serving customers.',
    sub: 'An AI agent that handles customers on WhatsApp, books on Google Calendar, answers questions, and takes care of your clients \u2014 while you focus on what matters.',
    cta: 'See it in action',
    trustAvailability: 'availability',
    trustResponseRate: 'response rate',
    trustCostPerMissed: 'cost per missed message',
  },

  heroConversation: {
    brandName: "Ana's Salon",
    subtitle: 'whatsapp \u00b7 attendeai',
    online: 'online',
    bot1: "Hi! Welcome to Ana's Salon. How can I help you today?",
    user1: 'I\u2019d like to book a haircut for Friday',
    bot2: 'Perfect! We have slots at 10 AM, 2 PM, and 4 PM on Friday. Which works best?',
    user2: '2 PM is great!',
    confirm: 'Booked \u2014 Friday, 2 PM. I\u2019ll send you a reminder the day before.',
  },

  heroDashboard: {
    inboxUrl: 'app.attende.ai / inbox',
    attendances: 'Conversations',
    scheduled: 'Booked',
    avgTime: 'Avg. time',
    attendancesChange: '\u2197 32% this week',
    scheduledChange: '\u2197 18%',
    avgTimeChange: '\u2198 45%',
    chartTitle: 'Conversations per day',
    chartSub: 'last 7 days',
    event1Title: 'Maria Silva confirmed booking',
    event1Sub: 'haircut \u00b7 Friday 2:00 PM',
    event2Title: 'Call answered \u00b7 2m 18s',
    event2Sub: '+55 11 9\u00b7\u00b7\u00b7\u00b7 \u00b7 belo horizonte',
    event3Title: '3 bookings created',
    event3Sub: 'google calendar \u00b7 synced',
  },

  heroPhone: {
    brandName: "Ana's Salon",
    status: 'AI active \u00b7 responding',
    bot1: 'Hi! How can I help?',
    user1: 'Book haircut Friday',
    bot2: '10 AM, 2 PM, or 4 PM?',
    user2: '2 PM',
    confirm: 'Booked!',
  },

  logos: {
    heading: 'Integrated with the tools you already use',
    googleCalendar: 'Google Calendar',
    whatsappBusiness: 'WhatsApp Business',
  },

  howItWorks: {
    eyebrow: 'How it works',
    title: 'From first contact to booked in seconds.',
    sub: 'Your agent replies, understands, and books \u2014 without any action from you.',
    steps: [
      {
        num: '01',
        label: 'contact',
        title: 'Customer reaches out',
        desc: 'On WhatsApp, the agent responds immediately \u2014 any time of day or night.',
      },
      {
        num: '02',
        label: 'understanding',
        title: 'AI understands and responds',
        desc: 'The agent understands intent using natural language, answers questions, and collects the info it needs.',
      },
      {
        num: '03',
        label: 'booking',
        title: 'Books automatically',
        desc: 'Checks Google Calendar in real time and confirms the slot directly with the customer.',
      },
      {
        num: '04',
        label: 'confirmed',
        title: 'Booking saved',
        desc: 'The booking is saved to Google Calendar and your dashboard. Track everything in one place \u2014 hands-free.',
      },
    ],
  },

  useCases: {
    eyebrow: 'Use cases',
    title: 'Built for the pace of your business.',
    sub: 'See how AttendeAI adapts to the routine of different industries \u2014 from beauty salons to medical clinics.',
    tabs: ['Beauty salon', 'Medical clinic', 'Auto shop', 'Studio / Gym', 'Restaurant'],

    salao: {
      title: 'Beauty salon',
      desc: 'Clients messaging at all hours wanting to book a cut, a shave, or coloring. The AI replies instantly, checks open slots, and confirms the appointment \u2014 all on WhatsApp.',
      points: [
        '24/7 support \u2014 even outside business hours',
        'Real-time availability check',
        'Automatic confirmation via WhatsApp',
        'AI trained on your salon\u2019s services and prices',
      ],
      preview: [
        { who: 'bot', text: "Hi! Welcome to Ana's Salon. How can I help you today?" },
        { who: 'user', text: 'I\u2019d like to book a haircut for Friday' },
        { who: 'bot', text: 'Perfect! We have slots at 10 AM, 2 PM, and 4 PM on Friday.' },
        { who: 'user', text: '2 PM is great!' },
        { who: 'confirm', text: 'Booked \u2014 Friday 2 PM. See you then!' },
      ],
    },

    clinica: {
      title: 'Medical clinic',
      desc: 'Patients calling after hours, unanswered messages, tricky scheduling. The AI answers on WhatsApp, checks the doctor\u2019s availability, and confirms the appointment.',
      points: [
        '24h booking without relying on a receptionist',
        'Availability check by specialist',
        'Automatic confirmation and reminders',
        'AI trained on your clinic\u2019s specialties and hours',
      ],
      preview: [
        { who: 'user', text: 'I need to schedule an appointment with a dermatologist' },
        { who: 'bot', text: 'Dr. Marina has openings Thursday 10 AM and Friday 3 PM. Which do you prefer?' },
        { who: 'user', text: 'Thursday 10 AM' },
        { who: 'confirm', text: 'Appointment booked. Dr. Marina \u00b7 Thursday 10 AM.' },
      ],
    },

    oficina: {
      title: 'Auto repair shop',
      desc: 'Customers texting to see if they can bring the car in. The AI replies instantly, checks availability, and books the service on Google Calendar.',
      points: [
        '24h service booking via WhatsApp',
        'Real-time bay availability check',
        'Automatic confirmation and day-before reminder',
        'AI trained on your shop\u2019s services',
      ],
      preview: [
        { who: 'user', text: 'I need an oil change \u2014 any openings tomorrow?' },
        { who: 'bot', text: 'Tomorrow we have slots at 8 AM and 2 PM. Which works for you?' },
        { who: 'user', text: '8 AM' },
        { who: 'bot', text: 'Car model?' },
        { who: 'confirm', text: 'Booked \u2014 Tuesday 9:30 AM. See you then!' },
      ],
    },

    estudio: {
      title: 'Studio & gym',
      desc: 'Students checking schedules and wanting to book trial classes. The AI answers instantly, checks availability, and confirms the booking on WhatsApp.',
      points: [
        '24h class and trial booking',
        'Schedule lookup by activity type',
        'Direct confirmation on Google Calendar',
        'AI trained on your gym\u2019s schedule and services',
      ],
      preview: [
        { who: 'user', text: 'Do you have evening yoga?' },
        { who: 'bot', text: 'Yes! Monday, Wednesday, and Friday at 7 PM.' },
        { who: 'user', text: 'Can I try a class?' },
        { who: 'bot', text: 'Of course! Want me to book you in for Monday at 7 PM?' },
        { who: 'confirm', text: 'Trial class booked. See you Monday!' },
      ],
    },

    restaurante: {
      title: 'Restaurant',
      desc: 'Customers wanting to make reservations on WhatsApp, any time of day. The AI responds, checks availability, and confirms the reservation on Google Calendar.',
      points: [
        '24h reservations \u2014 no phone call needed',
        'Real-time availability check',
        'Automatic confirmation via WhatsApp',
        'AI trained on your restaurant\u2019s hours and info',
      ],
      preview: [
        { who: 'user', text: 'Table for 4, Saturday 8 PM?' },
        { who: 'bot', text: 'We have availability. Shall I confirm the reservation?' },
        { who: 'user', text: 'Yes!' },
        { who: 'bot', text: 'Great. Any dietary restrictions?' },
        { who: 'confirm', text: 'Reservation for 4 \u00b7 Saturday 8 PM.' },
      ],
    },
  },

  features: {
    eyebrow: 'Features',
    title: 'Everything a pro receptionist does \u2014 and more.',
    sub: 'No days off, no overtime, no sick leave. The best employee your business ever had costs less than lunch.',
    cards: [
      {
        title: 'Smart WhatsApp',
        desc: 'Replies with contextual understanding, natural language, and a professional tone \u2014 like a trained receptionist.',
      },
      {
        title: 'Real-time booking',
        desc: 'Checks availability, creates Google Calendar events, and confirms with the customer \u2014 fully automatic.',
      },
      {
        title: 'Fully customizable',
        desc: 'Set up your services, prices, and hours. The AI adapts to your business, not the other way around.',
      },
      {
        title: 'Management dashboard',
        desc: 'Bookings organized in a clean dashboard. Track everything without opening WhatsApp.',
      },
      {
        title: 'Booking history',
        desc: 'Every booking on record, with filters by date, customer, and service.',
      },
      {
        title: 'Available 24/7',
        desc: 'The agent never sleeps. It works at 3 AM, on holidays, and on weekends \u2014 at no extra cost.',
      },
    ],
  },

  pricing: {
    eyebrow: 'Plans & pricing',
    title: 'Start today. Cancel anytime.',
    sub: 'No setup fee, no lock-in. Just results.',
    monthly: 'Monthly',
    annual: 'Annual',
    periodMonthly: 'per month \u00b7 billed monthly',
    periodAnnual: 'per month \u00b7 billed annually',
    badge: 'Most popular',
    plans: [
      {
        name: 'Starter',
        price: '$19',
        priceAnnual: '$15',
        desc: 'For those getting started and want to see AI-powered support in action.',
        features: [
          '1 AI agent',
          'Up to 200 messages/month',
          'Google Calendar integration',
          'Basic dashboard',
          'Email support',
        ],
        cta: 'Get started',
      },
      {
        name: 'Pro',
        price: '$39',
        priceAnnual: '$31',
        desc: 'For businesses already getting volume and ready to scale their support.',
        features: [
          '1 AI agent',
          'Unlimited messages',
          'Google Calendar integration',
          'Full dashboard with metrics',
          'Booking history',
          'Priority support',
        ],
        cta: 'Get started',
        popular: true,
      },
      {
        name: 'Business',
        price: '$79',
        priceAnnual: '$63',
        desc: 'For operations with multiple professionals and high conversation volume.',
        features: [
          'Up to 5 AI agents',
          'Unlimited messages',
          'Google Calendar integration',
          'Advanced dashboard with analytics',
          'Integration API',
          'Dedicated account manager',
        ],
        cta: 'Get started',
      },
    ],
    footer: '100% secure payment',
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Still have questions?',
    items: [
      {
        q: 'Do I need to know how to code to set it up?',
        a: 'Nope. Everything is configured through the dashboard \u2014 no code required. Just add your services, hours, and prices, and the AI starts working.',
      },
      {
        q: 'Does it work with any WhatsApp number?',
        a: 'Yes. Just connect your WhatsApp Business via QR code in the dashboard. Your agent will be live in minutes.',
      },
      {
        q: 'What if the AI doesn\u2019t know the answer?',
        a: 'The agent is trained to recognize its limits. If it can\u2019t answer, it lets the customer know and can hand off to a human.',
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Absolutely. No lock-in, no penalties. Cancel whenever you want, right from the dashboard.',
      },
    ],
  },

  ctaFinal: {
    eyebrow: 'Get started',
    titleStart: 'Your next customer is',
    titleEm: 'trying',
    titleEnd: 'to reach you right now.',
    sub: 'While you sleep, rest, or are busy, AttendeAI makes sure no customer goes unanswered.',
    cta: 'Talk to a human',
  },

  footer: {
    terms: 'Terms',
    privacy: 'Privacy',
    support: 'Support',
    blog: 'Blog',
    contact: 'Contact us',
    copyright: '\u00a9 2026 AttendeAI',
    madeIn: 'made in brazil \ud83c\udde7\ud83c\uddf7',
  },

  langSelector: {
    pt: 'PT',
    en: 'EN',
    es: 'ES',
  },
}

// ---------------------------------------------------------------------------
// Spanish (Latin America – neutral)
// ---------------------------------------------------------------------------
const es: Translations = {
  nav: {
    howItWorks: 'C\u00f3mo funciona',
    useCases: 'Casos de uso',
    features: 'Funciones',
    pricing: 'Precios',
    faq: 'FAQ',
    login: 'Iniciar sesi\u00f3n',
    signup: 'Crear cuenta',
  },

  hero: {
    pill: 'IA en producci\u00f3n 24/7 en WhatsApp',
    title1: 'Tu negocio',
    title2: 'nunca',
    titleEm: 'deja de',
    title3: 'atender clientes.',
    sub: 'Un agente de IA que atiende clientes por WhatsApp, agenda en Google Calendar, responde preguntas y cuida a tus clientes \u2014 mientras t\u00fa te enfocas en lo que importa.',
    cta: 'Ver demostraci\u00f3n',
    trustAvailability: 'disponibilidad',
    trustResponseRate: 'tasa de respuesta',
    trustCostPerMissed: 'costo por mensaje perdido',
  },

  heroConversation: {
    brandName: 'Sal\u00f3n de Ana',
    subtitle: 'whatsapp \u00b7 attendeai',
    online: 'en l\u00ednea',
    bot1: '\u00a1Hola! Bienvenida al Sal\u00f3n de Ana. \u00bfEn qu\u00e9 puedo ayudarte hoy?',
    user1: 'Quiero agendar un corte para el viernes',
    bot2: '\u00a1Perfecto! Tenemos horarios a las 10h, 14h y 16h el viernes. \u00bfCu\u00e1l prefieres?',
    user2: '\u00a114h est\u00e1 perfecto!',
    confirm: 'Agendado \u2014 viernes, 14h. Te env\u00edo un recordatorio el d\u00eda anterior.',
  },

  heroDashboard: {
    inboxUrl: 'app.attende.ai / inbox',
    attendances: 'Atenciones',
    scheduled: 'Agendados',
    avgTime: 'Tiempo promedio',
    attendancesChange: '\u2197 32% esta semana',
    scheduledChange: '\u2197 18%',
    avgTimeChange: '\u2198 45%',
    chartTitle: 'Conversaciones por d\u00eda',
    chartSub: '\u00faltimos 7 d\u00edas',
    event1Title: 'Mar\u00eda Silva confirm\u00f3 cita',
    event1Sub: 'corte \u00b7 viernes 14:00',
    event2Title: 'Llamada atendida \u00b7 2m 18s',
    event2Sub: '+55 11 9\u00b7\u00b7\u00b7\u00b7 \u00b7 belo horizonte',
    event3Title: '3 citas creadas',
    event3Sub: 'google calendar \u00b7 sincronizado',
  },

  heroPhone: {
    brandName: 'Sal\u00f3n de Ana',
    status: 'IA activa \u00b7 respondiendo',
    bot1: '\u00a1Hola! \u00bfC\u00f3mo puedo ayudarte?',
    user1: 'Agendar corte viernes',
    bot2: '\u00bf10h, 14h o 16h?',
    user2: '14h',
    confirm: '\u00a1Agendado!',
  },

  logos: {
    heading: 'Integrado con las herramientas que ya usas',
    googleCalendar: 'Google Calendar',
    whatsappBusiness: 'WhatsApp Business',
  },

  howItWorks: {
    eyebrow: 'C\u00f3mo funciona',
    title: 'Del contacto a la cita en segundos.',
    sub: 'Tu agente responde, entiende y agenda \u2014 sin que tengas que hacer nada.',
    steps: [
      {
        num: '01',
        label: 'contacto',
        title: 'El cliente se comunica',
        desc: 'Por WhatsApp, el agente responde de inmediato, a cualquier hora del d\u00eda o de la noche.',
      },
      {
        num: '02',
        label: 'comprensi\u00f3n',
        title: 'La IA entiende y responde',
        desc: 'El agente entiende la intenci\u00f3n con lenguaje natural, responde preguntas y recopila la informaci\u00f3n necesaria.',
      },
      {
        num: '03',
        label: 'agendamiento',
        title: 'Agenda autom\u00e1ticamente',
        desc: 'Consulta Google Calendar en tiempo real y confirma el horario directamente con el cliente.',
      },
      {
        num: '04',
        label: 'confirmado',
        title: 'Cita guardada',
        desc: 'La cita queda registrada en Google Calendar y en el panel. T\u00fa lo ves todo en un solo lugar, sin hacer nada.',
      },
    ],
  },

  useCases: {
    eyebrow: 'Casos de uso',
    title: 'Hecho para el ritmo de tu negocio.',
    sub: 'Mira c\u00f3mo AttendeAI se adapta a la rutina de diferentes industrias \u2014 del sal\u00f3n de belleza a la cl\u00ednica m\u00e9dica.',
    tabs: ['Sal\u00f3n de belleza', 'Cl\u00ednica m\u00e9dica', 'Taller mec\u00e1nico', 'Estudio / Gimnasio', 'Restaurante'],

    salao: {
      title: 'Sal\u00f3n de belleza',
      desc: 'Clientes enviando mensajes a toda hora queriendo agendar un corte, barba o coloraci\u00f3n. La IA responde al instante, verifica horarios libres en el calendario y confirma la cita \u2014 todo por WhatsApp.',
      points: [
        'Atenci\u00f3n 24/7 \u2014 incluso fuera de horario',
        'Verificaci\u00f3n de disponibilidad en tiempo real',
        'Confirmaci\u00f3n autom\u00e1tica por WhatsApp',
        'IA entrenada con los servicios y precios del sal\u00f3n',
      ],
      preview: [
        { who: 'bot', text: '\u00a1Hola! Bienvenida al Sal\u00f3n de Ana. \u00bfC\u00f3mo puedo ayudarte hoy?' },
        { who: 'user', text: 'Quiero agendar un corte para el viernes' },
        { who: 'bot', text: '\u00a1Perfecto! Tenemos horarios a las 10h, 14h y 16h el viernes.' },
        { who: 'user', text: '\u00a114h est\u00e1 perfecto!' },
        { who: 'confirm', text: 'Agendado \u2014 viernes 14h. \u00a1Nos vemos!' },
      ],
    },

    clinica: {
      title: 'Cl\u00ednica m\u00e9dica',
      desc: 'Pacientes llamando fuera de horario, mensajes sin respuesta, encajes dif\u00edciles. La IA atiende por WhatsApp, verifica la disponibilidad del m\u00e9dico y confirma la consulta.',
      points: [
        'Agendamiento 24h sin depender de recepcionista',
        'Verificaci\u00f3n de disponibilidad por especialista',
        'Confirmaci\u00f3n y recordatorio autom\u00e1tico',
        'IA entrenada con especialidades y horarios de la cl\u00ednica',
      ],
      preview: [
        { who: 'user', text: 'Necesito agendar una consulta con dermat\u00f3logo' },
        { who: 'bot', text: 'La Dra. Marina tiene horarios el jueves 10h y viernes 15h. \u00bfCu\u00e1l prefieres?' },
        { who: 'user', text: 'Jueves 10h' },
        { who: 'confirm', text: 'Consulta agendada. Dra. Marina \u00b7 jueves 10h.' },
      ],
    },

    oficina: {
      title: 'Taller mec\u00e1nico',
      desc: 'Clientes enviando mensajes para saber si pueden llevar el auto. La IA responde al instante, verifica disponibilidad y agenda el servicio en Google Calendar.',
      points: [
        'Agendamiento de servicios por WhatsApp 24h',
        'Consulta de disponibilidad de bah\u00eda en tiempo real',
        'Confirmaci\u00f3n autom\u00e1tica y recordatorio el d\u00eda anterior',
        'IA entrenada con los servicios del taller',
      ],
      preview: [
        { who: 'user', text: 'Necesito cambiar el aceite, \u00bfhay lugar ma\u00f1ana?' },
        { who: 'bot', text: 'Ma\u00f1ana tenemos lugar a las 8h y a las 14h. \u00bfQu\u00e9 horario prefieres?' },
        { who: 'user', text: '8h de la ma\u00f1ana' },
        { who: 'bot', text: '\u00bfModelo del auto?' },
        { who: 'confirm', text: 'Agendado \u2014 martes 09:30. \u00a1Nos vemos!' },
      ],
    },

    estudio: {
      title: 'Estudio & gimnasio',
      desc: 'Alumnos consultando horarios y queriendo agendar clases de prueba. La IA responde al instante, verifica disponibilidad y confirma la reserva por WhatsApp.',
      points: [
        'Agendamiento de clases y pruebas 24h',
        'Consulta de horarios disponibles por modalidad',
        'Confirmaci\u00f3n directa en Google Calendar',
        'IA entrenada con la grilla y servicios de tu gimnasio',
      ],
      preview: [
        { who: 'user', text: '\u00bfTienen yoga en la noche?' },
        { who: 'bot', text: '\u00a1S\u00ed! Lunes, mi\u00e9rcoles y viernes a las 19h.' },
        { who: 'user', text: '\u00bfPuedo tomar una clase de prueba?' },
        { who: 'bot', text: '\u00a1Claro! \u00bfTe agendo para el lunes a las 19h?' },
        { who: 'confirm', text: 'Clase de prueba agendada. \u00a1Nos vemos el lunes!' },
      ],
    },

    restaurante: {
      title: 'Restaurante',
      desc: 'Clientes queriendo hacer reservas por WhatsApp, a cualquier hora. La IA atiende, verifica disponibilidad y confirma la reserva en Google Calendar.',
      points: [
        'Reservas 24h sin depender de llamadas',
        'Verificaci\u00f3n de disponibilidad en tiempo real',
        'Confirmaci\u00f3n autom\u00e1tica por WhatsApp',
        'IA entrenada con horarios e informaci\u00f3n del restaurante',
      ],
      preview: [
        { who: 'user', text: '\u00bfMesa para 4 el s\u00e1bado a las 20h?' },
        { who: 'bot', text: 'Tenemos disponibilidad. \u00bfConfirmo la reserva?' },
        { who: 'user', text: '\u00a1S\u00ed!' },
        { who: 'bot', text: 'Perfecto. \u00bfAlguna restricci\u00f3n alimentaria?' },
        { who: 'confirm', text: 'Reserva 4 personas \u00b7 s\u00e1bado 20h.' },
      ],
    },
  },

  features: {
    eyebrow: 'Funciones',
    title: 'Todo lo que un recepcionista profesional hace \u2014 y m\u00e1s.',
    sub: 'Sin descansos, sin horas extra, sin licencias. El mejor empleado de tu negocio cuesta menos que un almuerzo al d\u00eda.',
    cards: [
      {
        title: 'WhatsApp inteligente',
        desc: 'Responde mensajes con comprensi\u00f3n contextual, lenguaje natural y tono profesional \u2014 como un recepcionista capacitado.',
      },
      {
        title: 'Agendamiento en tiempo real',
        desc: 'Consulta disponibilidad, crea eventos en Google Calendar y confirma con el cliente \u2014 todo autom\u00e1tico.',
      },
      {
        title: 'Personalizaci\u00f3n total',
        desc: 'Configura servicios, precios y horarios. La IA se adapta a tu negocio, no al rev\u00e9s.',
      },
      {
        title: 'Panel de gesti\u00f3n',
        desc: 'Citas organizadas en un panel limpio. Sigue todo sin necesidad de abrir WhatsApp.',
      },
      {
        title: 'Historial de citas',
        desc: 'Todas las citas registradas, con filtros por fecha, cliente y servicio.',
      },
      {
        title: 'Disponible 24/7',
        desc: 'El agente nunca para. Atiende de madrugada, en feriados y los domingos \u2014 sin costo extra.',
      },
    ],
  },

  pricing: {
    eyebrow: 'Planes y precios',
    title: 'Empieza hoy. Cancela cuando quieras.',
    sub: 'Sin cuota de inscripci\u00f3n, sin permanencia. Solo resultados.',
    monthly: 'Mensual',
    annual: 'Anual',
    periodMonthly: 'por mes \u00b7 facturado mensualmente',
    periodAnnual: 'por mes \u00b7 facturado anualmente',
    badge: 'M\u00e1s popular',
    plans: [
      {
        name: 'Starter',
        price: 'US$ 19',
        priceAnnual: 'US$ 15',
        desc: 'Para quienes est\u00e1n empezando y quieren probar el poder de la IA en la atenci\u00f3n.',
        features: [
          '1 agente de IA',
          'Hasta 200 mensajes/mes',
          'Integraci\u00f3n con Google Calendar',
          'Panel b\u00e1sico',
          'Soporte por correo',
        ],
        cta: 'Empezar ahora',
      },
      {
        name: 'Pro',
        price: 'US$ 39',
        priceAnnual: 'US$ 31',
        desc: 'Para negocios que ya reciben volumen y necesitan escalar la atenci\u00f3n.',
        features: [
          '1 agente de IA',
          'Mensajes ilimitados',
          'Integraci\u00f3n con Google Calendar',
          'Panel completo con m\u00e9tricas',
          'Historial de citas',
          'Soporte prioritario',
        ],
        cta: 'Empezar ahora',
        popular: true,
      },
      {
        name: 'Business',
        price: 'US$ 79',
        priceAnnual: 'US$ 63',
        desc: 'Para operaciones con m\u00faltiples profesionales y alto volumen de atenci\u00f3n.',
        features: [
          'Hasta 5 agentes de IA',
          'Mensajes ilimitados',
          'Integraci\u00f3n con Google Calendar',
          'Panel avanzado con analytics',
          'API de integraci\u00f3n',
          'Gerente de cuenta dedicado',
        ],
        cta: 'Empezar ahora',
      },
    ],
    footer: 'Pago 100% seguro',
  },

  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: '\u00bfA\u00fan tienes dudas?',
    items: [
      {
        q: '\u00bfNecesito saber programar para configurarlo?',
        a: 'No. La configuraci\u00f3n se hace desde el panel, sin c\u00f3digo. Registras tus servicios, horarios y precios, y la IA empieza a atender.',
      },
      {
        q: '\u00bfFunciona con cualquier n\u00famero de WhatsApp?',
        a: 'S\u00ed. Solo conecta tu WhatsApp Business con el c\u00f3digo QR en el panel. En pocos minutos el agente estar\u00e1 activo.',
      },
      {
        q: '\u00bfY si la IA no sabe responder algo?',
        a: 'El agente est\u00e1 entrenado para reconocer sus l\u00edmites. Si no sabe la respuesta, le avisa al cliente y puede derivar a atenci\u00f3n humana.',
      },
      {
        q: '\u00bfPuedo cancelar en cualquier momento?',
        a: 'S\u00ed. Sin permanencia, sin multa. Cancelas cuando quieras directamente desde el panel.',
      },
    ],
  },

  ctaFinal: {
    eyebrow: 'Empieza ahora',
    titleStart: 'Tu pr\u00f3ximo cliente est\u00e1',
    titleEm: 'intentando',
    titleEnd: 'contactarte ahora mismo.',
    sub: 'Mientras duermes, descansas o est\u00e1s ocupado, AttendeAI garantiza que ning\u00fan cliente se quede sin respuesta.',
    cta: 'Hablar con un humano',
  },

  footer: {
    terms: 'T\u00e9rminos',
    privacy: 'Privacidad',
    support: 'Soporte',
    blog: 'Blog',
    contact: 'Cont\u00e1ctanos',
    copyright: '\u00a9 2026 AttendeAI',
    madeIn: 'hecho en brasil \ud83c\udde7\ud83c\uddf7',
  },

  langSelector: {
    pt: 'PT',
    en: 'EN',
    es: 'ES',
  },
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const translations: Record<Locale, Translations> = { pt, en, es }

export function t(locale: Locale): Translations {
  return translations[locale]
}
