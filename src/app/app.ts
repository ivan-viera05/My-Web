import { Component, OnInit, AfterViewInit, HostListener, ElementRef, signal, computed, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
  // --- Translation Logic ---
  private _currentLang = signal<'es' | 'en'>('es');
  readonly currentLang = computed(() => this._currentLang());

  allContent: any = {
    es: {
      ui: {
        nav: { about: 'Sobre Mí', experience: 'Experiencia', skills: 'Habilidades', projects: 'Proyectos', education: 'Educación', contact: 'Contacto', cta: 'Hablemos' },
        hero: { greeting: 'Hola, soy', subtitle: 'Desarrollador Full Stack apasionado por crear soluciones digitales innovadoras y experiencias de usuario excepcionales.', viewProjects: 'Ver Proyectos', experience: 'Experiencia' },
        about: {
          title: 'Sobre Mí', header: 'Construyendo el futuro digital', subtitle: 'Desarrollador Full Stack | Estudiante de Lic. en Tecnologías Digitales',
          p1: 'Soy un desarrollador apasionado por la tecnología con una sólida base en el ecosistema <span class="highlight">.NET</span> y <span class="highlight">Angular</span>. Mi enfoque se centra en crear aplicaciones robustas, escalables y con una experiencia de usuario excepcional.',
          p2: 'Actualmente, complemento mi experiencia laboral con estudios de grado en la <strong>Universidad de la Ciudad de Buenos Aires</strong>, lo que me permite mantenerse a la vanguardia de las tendencias digitales y metodologías de desarrollo innovadoras.',
          locationLabel: 'Localización', locationValue: 'Buenos Aires, Argentina', studiesLabel: 'Estudios', studiesValue: 'Lic. en Tecnologías Digitales (En curso) | Técnico Analista y Desarrollador de Sistemas (Egresado)', expBadge: 'Años de formación intensiva', downloadCV: 'Descargar CV',
          cards: [
            { title: 'Profesionalismo', desc: 'Comunicación efectiva y resolución de problemas técnicos complejos.' },
            { title: 'Colaboración', desc: 'Experiencia trabajando en equipos multidisciplinarios bajo metodologías ágiles.' },
            { title: 'Aprendizaje', desc: 'Adaptabilidad constante y pasión por dominar nuevas tecnologías.' }
          ]
        },
        experience: { title: 'Experiencia Laboral' },
        projects: { title: 'Proyectos Destacados', modal: { metrics: 'Métricas de Rendimiento', efficiency: 'Eficiencia Operativa', responseTime: 'Tiempo de Respuesta', accuracy: 'Precisión de IA', viewDemo: 'Ver Demo', viewCode: 'Código' } },
        skills: { title: 'Habilidades Técnicas' },
        education: { title: 'Educación y Certificaciones', eduHeader: 'Educación', certHeader: 'Certificaciones' },
        contact: { title: 'Contacto', header: '¿Tienes un proyecto en mente?', subtitle: 'Estoy disponible para nuevos desafíos y colaboraciones.', namePlaceholder: 'Nombre', emailPlaceholder: 'Email', messagePlaceholder: 'Mensaje', send: 'Enviar Mensaje' },
        game: { title: 'Un Pequeño Recreo', subtitle: '¡Esquiva los obstáculos para ganar puntos!', start: 'Iniciar Juego', restart: 'Reiniciar', controls: 'Presiona Espacio para saltar' },
        footer: { copy: 'Diseñado con ❤️ y Angular.' }
      },
      skillCategories: [
        { name: 'Frontend', icon: 'ph ph-browsers', skills: ['HTML', 'CSS', 'Bootstrap', 'Tailwind', 'JavaScript', 'Angular', 'React', 'TypeScript', 'Node JS', 'Windows Form'] },
        { name: 'Backend', icon: 'ph ph-code-block', skills: ['C#', '.NET', 'Node.js', 'MiroFish'] },
        { name: 'IA y Ciencia de Datos', icon: 'ph ph-brain', skills: ['TensorFlow', 'RASA IA', 'Power BI', 'LLMs (GPT)', 'n8n'] },
        { name: 'APIs & Arquitectura', icon: 'ph ph-tree-structure', skills: ['APIs REST', 'JWT', 'Swagger', 'Microservicios', 'Arquitectura en capas', 'Arquitectura hexagonal', 'WebSockets', 'Microfrontend'] },
        { name: 'Gestión & DevOps', icon: 'ph ph-gear', skills: ['BPM Camunda', 'BPMN', 'Scrum', 'Git', 'GitHub', 'BitBucket', 'Docker'] },
        { name: 'Bases de Datos', icon: 'ph ph-database', skills: ['SQL SERVER', 'PostgreSQL'] },
        { name: 'Testing', icon: 'ph ph-bug-beetle', skills: ['Postman', 'Testing funcional', 'Test unitario'] }
      ],
      experience: [
        { company: 'Proyecto - Agendifly', role: 'Full Stack Developer', period: 'Julio 2025 – Enero 2026', description: 'Desarrollé un sistema de gestión de turnos full-stack con backend .NET y frontend Angular, diseñando APIs REST con autenticación/roles y lógica de negocio. Modelé la base de datos y migraciones con EF Core, incorporé validaciones y manejo de errores, e integré pagos y gestión de suscripciones con Mercado Pago, además de optimizar rendimiento y seguridad mediante caching, rate limiting y validación.' },
        { company: 'Thankit', role: 'Desarrollador Full Stack', period: 'Enero 2024 – Mayo 2025', description: 'Me desempeñé como desarrollador full stack participando activamente en el desarrollo de aplicaciones web tanto en frontend como en backend. Implementé interfaces de usuario aplicando principios de UX/IU y traduciendo requerimientos funcionales en interfaces web mediante Angular. Desarrollé funcionalidades backend orientadas a negocio, incluyendo manejo y persistencia de datos, seguridad y control de accesos. Diseñé e implementé APIs REST para la integración entre sistemas, trabajando con bases de datos relacionales como SQL SERVER y PostgreSQL. Realicé tareas de mantenimiento evolutivo, corrección de errores y mejoras de performance, colaborando de forma continua con los equipos de QA y producto.' },
        { company: 'Thankit', role: 'QA Junior', period: 'Octubre 2023 – Enero 2024', description: 'Me desempeñé como QA Junior realizando análisis funcional y técnico de aplicaciones web. Diseñé planes de prueba y casos de prueba, ejecutando pruebas frontend y backend para validar el correcto funcionamiento del sistema. Realicé pruebas sobre APIs REST utilizando Postman, validando request, responses y manejo de errores. Detecté, documenté y di seguimiento a incidencias, colaborando estrechamente con los equipos de desarrollo.' }
      ],
      education: [
        { institution: 'Universidad de la Ciudad de Buenos Aires', title: 'Licenciatura en Tecnologías Digitales', period: '2026 - Actualidad', description: 'Carrera de grado enfocada en la intersección de la tecnología, el diseño y la innovación digital.' },
        { institution: 'I.S.FT N°93', title: 'Técnico Analista y Desarrollador de Sistemas (Egresado)', period: '2023-2025', description: 'Formación orientada al desarrollo de software, programación estructurada y orientada a objetos, bases de datos y funcionamiento de sistemas.' },
        { institution: 'Instituto Ricatti', title: 'Inglés Británico nivel B1+', period: '', description: '' }
      ],
      certifications: [
        { title: 'CoderHouse “Desarrollo Web (HTML, CSS )”', date: '2023' },
        { title: 'CoderHouse “JavaScript”', date: '2023' },
        { title: 'C.F.P N°403 ”Especialización Profesional en Administración Base De Datos”', date: '2024' },
        { title: 'Udemy “Desarrollo C# .NET avanzado”', date: '2024' },
        { title: 'Udemy “Desarrollando Aplicaciones en Angular 19 y ASP.NET Core 9”', date: '2024' },
        { title: 'Udemy “Mastering HTML5”', date: '2024' },
        { title: 'Udemy “Desarrollo De sistemas Market C#”', date: '2024' }
      ],
      languages: [
        { name: 'Español', level: 'Nativo' },
        { name: 'Inglés', level: 'B1+' },
        { name: 'Portugués', level: 'Básico' }
      ],
      projects: [
        {
          title: 'MiroFish - Entrenamiento IA de Ventas y Soporte',
          description: 'Plataforma de simulación de role-play que utiliza agentes de IA para actuar como "clientes difíciles" o "negociadores agresivos". El personal de ventas puede practicar sus scripts contra una IA con memoria y reacciones humanas, optimizando su desempeño antes de interactuar con clientes reales.',
          image: 'mirofish.jpg',
          images: [
            { url: 'mirofish.jpg', title: 'Simulador de Negociación Crítica', description: 'Módulo donde los agentes de IA adoptan personalidades desafiantes. La IA recuerda objeciones pasadas del vendedor, forzando un entrenamiento dinámico que mejora la capacidad de respuesta y el manejo de presión.' },
            { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', title: 'Optimización de Cierre de Negocios', description: 'Herramienta diseñada para reducir drásticamente la curva de aprendizaje. Al practicar en un entorno seguro pero realista, los equipos de ventas aumentan su tasa de cierre en operaciones reales mediante el perfeccionamiento de sus scripts.' }
          ],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['Entrenamiento de Ventas', 'IA con Memoria', 'Simulación de Clientes', 'n8n', 'OpenAI'],
          results: { efficiency: 'Mejora en Tasa de Cierre', response: 'Reacción Humana 1:1', accuracy: 'Reducción Curva Aprendizaje' }
        },
        {
          title: 'FitFlow - Gestión de Gimnasio',
          description: 'Sistema integral para la administración de gimnasios, control de membresías y seguimiento de rutinas con interfaz intuitiva y reportes de rendimiento.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', video: 'WhatsApp Video 2026-04-16 at 12.15.01.mp4',
          images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', video: 'WhatsApp Video 2026-04-16 at 12.15.01.mp4', title: 'Demostración del Sistema', description: 'Video demostrativo de las funcionalidades principales del sistema: gestión de socios, control de pagos, y asignación de rutinas personalizadas. Diseñado para optimizar la administración diaria de un centro deportivo.' }],
          currentImageIndex: 0, link: '#', repo: 'https://github.com/IvanViera05/FitFlow', tags: ['Angular', '.NET Core', 'SQL Server', 'Video Demo']
        },
        {
          title: 'GastroBot AI - Reservas Inteligentes',
          description: 'Asistente inteligente para restaurantes que automatiza la reserva de mesas, consultas de menú y pedidos mediante n8n e integración de APIs.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', video: 'WhatsApp Video 2026-05-06 at 11.23.53.mp4',
          images: [{ url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', video: 'WhatsApp Video 2026-05-06 at 11.23.53.mp4', title: 'Automatización de Reservas', description: 'Flujo de trabajo avanzado en n8n que gestiona reservas en tiempo real, verifica disponibilidad mediante APIs de calendario y envía confirmaciones automáticas por WhatsApp, mejorando la eficiencia operativa del restaurante.' }],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['n8n', 'IA', 'WhatsApp API', 'Restaurante', 'Automatización']
        },
        {
          title: 'Agendifly - Agenda Virtual',
          description: 'Agenda virtual creada con Angular y .NET para turnos y gestión de disponibilidad.',
          image: 'channels4_profile.jpg',
          images: [{ url: 'channels4_profile.jpg', title: 'Agendifly UI', description: 'Interfaz principal de Agendifly.' }],
          currentImageIndex: 0, link: '#', repo: 'https://github.com/IvanViera05/Agendifly', youtubeUrl: 'https://youtu.be/vUkhRzdYchU', tags: ['Angular', '.NET', 'Sistema Empresarial sass']
        },
        {
          title: 'OmniFlow BPM - Gestión de Procesos Camunda',
          description: 'Implementación y personalización de un motor de workflows basado en Camunda BPM, integrando una API en .NET Web API y un frontend en Angular, con foco en la adaptación visual, consumo de endpoints y orquestación de procesos empresariales.',
          image: 'Camunda.png',
          images: [
            { url: 'Camunda.png', title: 'Customización Tasklist', description: 'Personalización completa de la interfaz de Camunda Tasklist/UX para una experiencia de usuario optimizada.' }
          ],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['Camunda BPM', '.NET Web API', 'Angular', 'BPMN 2.0', 'Custom UX'],
          results: { efficiency: 'Personalización UX', response: 'Arquitectura .NET/Angular', accuracy: 'Orquestación de Procesos' },
          fullDescription: 'Proyecto de integración de un motor de procesos de negocio basado en Camunda BPM, orientado a la automatización y orquestación de flujos empresariales.\n\nSe desarrolló una arquitectura desacoplada donde el backend en .NET Web API expone servicios para interactuar con el motor de procesos, mientras que el frontend en Angular consume dichos servicios y presenta las tareas de usuario.\n\nComo parte del trabajo, se realizó una customización completa de la interfaz de Camunda Tasklist/UX, adaptando estilos y componentes para alinearlos con el diseño del sistema, mejorando la experiencia de usuario.'
        },
        {
          title: 'Gestión de Bomberos',
          description: 'Sistema integral de gestión para los Bomberos Voluntarios de San Vicente con seguimiento e informes en tiempo real.',
          image: 'bomberos.png',
          images: [
            { url: 'bomberos.png', title: 'Pantalla de Inicio', description: 'Panel principal del sistema de gestión de bomberos. Esta interfaz proporciona una visión completa de todas las operaciones del sistema, incluyendo seguimiento de emergencias, gestión de personal y monitoreo de estado en tiempo real.' },
            { url: 'LoginBomberos.PNG', title: 'Login de Bomberos', description: 'Interfaz de inicio de sesión segura diseñada específicamente para el personal de bomberos.' },
            { url: 'LoginAdministrador.PNG', title: 'Login de Administrador', description: 'Panel de acceso administrativo con características de seguridad mejoradas para administradores del sistema.' },
            { url: 'inicioBomberos.PNG', title: 'Funcionalidades Importantes', description: 'Resumen de las principales características y capacidades del sistema. Construido con C#, .NET y SQL Server.' }
          ],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['C#', '.NET', 'SQL Server', 'Sistema Empresarial']
        },
        {
          title: 'Centro de Estética',
          description: 'Sitio web responsivo moderno para un centro de belleza con sistema de citas y vitrina de servicios.',
          image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
          images: [{ url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800', title: 'Home', description: 'Diseño moderno y minimalista.' }],
          currentImageIndex: 0, link: 'https://estetica-mar.vercel.app', repo: 'https://github.com/IvanViera05/estetica-mar', tags: ['HTML', 'CSS', 'JS', 'Bootstrap', 'UI/UX', 'Sitio Web Empresarial']
        },
        {
          title: 'LibroGest - Ecosistema de Gestión Editorial',
          description: 'Sistema robusto de gestión empresarial diseñado para el sector editorial. Optimiza el flujo de inventario, registros de venta automatizados y control de stock en tiempo real, proporcionando métricas clave para la toma de decisiones estratégicas.',
          image: '1366_2000.jpg',
          images: [
            { url: '1366_2000.jpg', title: 'Interfaz de Gestión Inteligente', description: 'Dashboard principal con analíticas avanzadas y métricas de rendimiento en tiempo real.' },
            { url: 'librogest-hero.png', title: 'Vista Analítica Moderna', description: 'Panel de visualización de datos con diseño premium.' },
            { url: 'Elgitano1.PNG', title: 'Panel de Control de Inventario', description: 'Vista detallada del stock y niveles de inventario con alertas automáticas de reposición.' },
            { url: 'Gitano2.PNG', title: 'Registro de Ventas y Facturación', description: 'Módulo de transacciones diseñado para la rapidez y precisión en el punto de venta.' }
          ],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['C#', '.NET', 'SQL Server', 'ERP', 'Arquitectura en Capas'],
          results: { efficiency: 'Optimización de Stock', response: 'Ventas en Tiempo Real', accuracy: 'Control de Caja 100%' }
        }
      ]
    },
    en: {
      ui: {
        nav: { about: 'About Me', experience: 'Experience', skills: 'Skills', projects: 'Projects', education: 'Education', contact: 'Contact', cta: 'Let\'s Talk' },
        hero: { greeting: 'Hi, I am', subtitle: 'Full Stack Developer passionate about creating innovative digital solutions and exceptional user experiences.', viewProjects: 'View Projects', experience: 'Experience' },
        about: {
          title: 'About Me', header: 'Building the Digital Future', subtitle: 'Full Stack Developer | Digital Technologies Student',
          p1: 'I am a developer passionate about technology with a solid foundation in the <span class="highlight">.NET</span> and <span class="highlight">Angular</span> ecosystem. My focus is on creating robust, scalable applications with an exceptional user experience.',
          p2: 'Currently, I complement my professional experience with undergraduate studies at the <strong>University of the City of Buenos Aires</strong>, which allows me to stay at the forefront of digital trends and innovative development methodologies.',
          locationLabel: 'Location', locationValue: 'Buenos Aires, Argentina', studiesLabel: 'Studies', studiesValue: 'B.S. in Digital Technologies (In progress) | Systems Analyst and Developer Technician (Graduated)', expBadge: 'Years of intensive training', downloadCV: 'Download CV',
          cards: [
            { title: 'Professionalism', desc: 'Effective communication and resolution of complex technical problems.' },
            { title: 'Collaboration', desc: 'Experience working in multidisciplinary teams under agile methodologies.' },
            { title: 'Learning', desc: 'Constant adaptability and passion for mastering new technologies.' }
          ]
        },
        experience: { title: 'Work Experience' },
        projects: { title: 'Featured Projects', modal: { metrics: 'Performance Metrics', efficiency: 'Operational Efficiency', responseTime: 'Response Time', accuracy: 'AI Accuracy', viewDemo: 'View Demo', viewCode: 'Code' } },
        skills: { title: 'Technical Skills' },
        education: { title: 'Education & Certifications', eduHeader: 'Education', certHeader: 'Certifications' },
        contact: { title: 'Contact', header: 'Have a project in mind?', subtitle: 'I am available for new challenges and collaborations.', namePlaceholder: 'Name', emailPlaceholder: 'Email', messagePlaceholder: 'Message', send: 'Send Message' },
        game: { title: 'A Little Break', subtitle: 'Dodge the obstacles to earn points!', start: 'Start Game', restart: 'Restart', controls: 'Press Space to jump' },
        footer: { copy: 'Designed with ❤️ and Angular.' }
      },
      skillCategories: [
        { name: 'Frontend', icon: 'ph ph-browsers', skills: ['HTML', 'CSS', 'Bootstrap', 'Tailwind', 'JavaScript', 'Angular', 'React', 'TypeScript', 'Node JS', 'Windows Form'] },
        { name: 'Backend', icon: 'ph ph-code-block', skills: ['C#', '.NET', 'Node.js', 'MiroFish'] },
        { name: 'AI & Data Science', icon: 'ph ph-brain', skills: ['TensorFlow', 'RASA IA', 'Power BI', 'LLMs (GPT)', 'n8n'] },
        { name: 'APIs & Architecture', icon: 'ph ph-tree-structure', skills: ['REST APIs', 'JWT', 'Swagger', 'Microservices', 'Layered Architecture', 'Hexagonal Architecture', 'WebSockets', 'Microfrontend'] },
        { name: 'Management & DevOps', icon: 'ph ph-gear', skills: ['BPM Camunda', 'BPMN', 'Scrum', 'Git', 'GitHub', 'BitBucket', 'Docker'] },
        { name: 'Databases', icon: 'ph ph-database', skills: ['SQL SERVER', 'PostgreSQL'] },
        { name: 'Testing', icon: 'ph ph-bug-beetle', skills: ['Postman', 'Functional Testing', 'Unit Testing'] }
      ],
      experience: [
        { company: 'Project - Agendifly', role: 'Full Stack Developer', period: 'July 2025 – January 2026', description: 'Developed a full-stack appointment management system with .NET backend and Angular frontend, designing REST APIs with authentication/roles and business logic. Modeled the database and migrations with EF Core, incorporated validations and error handling, and integrated payments and subscription management with Mercado Pago, in addition to optimizing performance and security through caching, rate limiting, and validation.' },
        { company: 'Thankit', role: 'Full Stack Developer', period: 'January 2024 – May 2025', description: 'Served as a full stack developer actively participating in the development of web applications in both frontend and backend. Implemented user interfaces applying UX/UI principles and translating functional requirements into web interfaces using Angular. Developed business-oriented backend functionalities, including data management and persistence, security, and access control. Designed and implemented REST APIs for system integration, working with relational databases such as SQL SERVER and PostgreSQL. Performed evolutionary maintenance, error correction, and performance improvements, continuously collaborating with QA and product teams.' },
        { company: 'Thankit', role: 'Junior QA', period: 'October 2023 – January 2024', description: 'Served as a Junior QA performing functional and technical analysis of web applications. Designed test plans and test cases, executing frontend and backend tests to validate correct system operation. Performed tests on REST APIs using Postman, validating requests, responses, and error handling. Detected, documented, and followed up on incidents, collaborating closely with development teams.' }
      ],
      education: [
        { institution: 'University of the City of Buenos Aires', title: 'B.S. in Digital Technologies', period: '2026 - Present', description: 'Degree program focused on the intersection of technology, design, and digital innovation.' },
        { institution: 'I.S.FT N°93', title: 'Systems Analyst and Developer Technician (Graduated)', period: '2023-2025', description: 'Training oriented to software development, structured and object-oriented programming, databases, and system operation.' },
        { institution: 'Instituto Ricatti', title: 'British English level B1+', period: '', description: '' }
      ],
      certifications: [
        { title: 'CoderHouse “Web Development (HTML, CSS)”', date: '2023' },
        { title: 'CoderHouse “JavaScript”', date: '2023' },
        { title: 'C.F.P N°403 ”Professional Specialization in Database Administration”', date: '2024' },
        { title: 'Udemy “Advanced C# .NET Development”', date: '2024' },
        { title: 'Udemy “Developing Applications in Angular 19 and ASP.NET Core 9”', date: '2024' },
        { title: 'Udemy “Mastering HTML5”', date: '2024' },
        { title: 'Udemy “Market Systems Development C#”', date: '2024' }
      ],
      languages: [
        { name: 'Spanish', level: 'Native' },
        { name: 'English', level: 'B1+' },
        { name: 'Portuguese', level: 'Basic' }
      ],
      projects: [
        {
          title: 'MiroFish - Sales Training AI',
          description: 'Advanced Role-Play platform powered by AI for high-performance team training. It simulates complex interactions with real clients to perfect sales scripts and negotiation strategies.',
          image: 'mirofish.jpg',
          images: [
            { url: 'mirofish.jpg', title: 'Critical Negotiation Simulator', description: 'Module where AI agents adopt challenging personalities. The AI remembers the seller\'s past objections, forcing a dynamic training that improves response capacity and pressure handling.' },
            { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', title: 'Business Closing Optimization', description: 'Tool designed to drastically reduce the learning curve. By practicing in a safe but realistic environment, sales teams increase their closing rate in real operations by perfecting their scripts.' }
          ],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['Sales Training', 'AI with Memory', 'Client Simulation', 'n8n', 'OpenAI'],
          results: { efficiency: 'Closing Rate Improvement', response: '1:1 Human Reaction', accuracy: 'Learning Curve Reduction' }
        },
        {
          title: 'FitFlow - Gym Management',
          description: 'Integral system for gym administration, membership control, and routine tracking with an intuitive interface and performance reports.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', video: 'WhatsApp Video 2026-04-16 at 12.15.01.mp4',
          images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', video: 'WhatsApp Video 2026-04-16 at 12.15.01.mp4', title: 'System Demonstration', description: 'Demonstration video of the main system features: member management, payment control, and personalized routine assignment. Designed to optimize the daily administration of a sports center.' }],
          currentImageIndex: 0, link: '#', repo: 'https://github.com/IvanViera05/FitFlow', tags: ['Angular', '.NET Core', 'SQL Server', 'Video Demo']
        },
        {
          title: 'GastroBot AI - Smart Reservations',
          description: 'Smart assistant for restaurants that automates table reservations, menu inquiries, and orders using n8n e integración de APIs.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', video: 'WhatsApp Video 2026-05-06 at 11.23.53.mp4',
          images: [{ url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', video: 'WhatsApp Video 2026-05-06 at 11.23.53.mp4', title: 'Reservation Automation', description: 'Advanced workflow in n8n that manages reservations in real time, verifies availability through calendar APIs, and sends automatic confirmations via WhatsApp, improving the restaurant\'s operational efficiency.' }],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['n8n', 'IA', 'WhatsApp API', 'Restaurant', 'Automation']
        },
        {
          title: 'Agendifly - Virtual Agenda',
          description: 'Virtual agenda created with Angular and .NET for appointments and availability management.',
          image: 'channels4_profile.jpg',
          images: [{ url: 'channels4_profile.jpg', title: 'Agendifly UI', description: 'Main UI.' }],
          currentImageIndex: 0, link: '#', repo: 'https://github.com/IvanViera05/Agendifly', youtubeUrl: 'https://youtu.be/vUkhRzdYchU', tags: ['Angular', '.NET', 'SaaS Business System']
        },
        {
          title: 'OmniFlow BPM - Camunda Process Management',
          description: 'Implementation and customization of a workflow engine based on Camunda BPM, integrating a .NET Web API and an Angular frontend, focusing on visual adaptation, endpoint consumption, and business process orchestration.',
          image: 'Camunda.png',
          images: [
            { url: 'Camunda.png', title: 'Tasklist Customization', description: 'Full customization of the Camunda Tasklist/UX interface for an optimized user experience.' }
          ],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['Camunda BPM', '.NET Web API', 'Angular', 'BPMN 2.0', 'Custom UX'],
          results: { efficiency: 'UX Customization', response: '.NET/Angular Architecture', accuracy: 'Process Orchestration' },
          fullDescription: 'Business process engine integration project based on Camunda BPM, aimed at automation and orchestration of business workflows.\n\nA decoupled architecture was developed where the .NET Web API backend exposes services to interact with the process engine, while the Angular frontend consumes these services and presents user tasks.\n\nAs part of the work, a complete customization of the Camunda Tasklist/UX interface was carried out, adapting styles and components to align them with the system design, improving the user experience.'
        },
        {
          title: 'Firefighters Management',
          description: 'Comprehensive management system for the Volunteer Firefighters of San Vicente with real-time tracking and reports.',
          image: 'bomberos.png',
          images: [
            { url: 'bomberos.png', title: 'Home Screen', description: 'Main panel of the firefighter management system. This interface provides a complete view of all system operations, including emergency tracking, personnel management, and real-time status monitoring.' },
            { url: 'LoginBomberos.PNG', title: 'Firefighter Login', description: 'Secure login interface specifically designed for firefighter personnel.' },
            { url: 'LoginAdministrador.PNG', title: 'Administrator Login', description: 'Administrative access panel with enhanced security features for system administrators.' },
            { url: 'inicioBomberos.PNG', title: 'Important Features', description: 'Summary of the main features and capabilities of the system. Built with C#, .NET, and SQL Server.' }
          ],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['C#', '.NET', 'SQL Server', 'Business System']
        },
        {
          title: 'Aesthetic Center',
          description: 'Modern responsive website for a beauty center with an appointment system and service showcase.',
          image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
          images: [{ url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800', title: 'Home', description: 'Modern and minimalist design.' }],
          currentImageIndex: 0, link: 'https://estetica-mar.vercel.app', repo: 'https://github.com/IvanViera05/estetica-mar', tags: ['HTML', 'CSS', 'JS', 'Bootstrap', 'UI/UX', 'Business Website']
        },
        {
          title: 'LibroGest - Editorial Management Ecosystem',
          description: 'A robust business management system designed for the editorial sector. Optimizes inventory flow, automated sales records, and real-time stock control, providing key metrics for strategic decision-making.',
          image: '1366_2000.jpg',
          images: [
            { url: '1366_2000.jpg', title: 'Smart Management Interface', description: 'Main dashboard with advanced analytics and real-time performance metrics.' },
            { url: 'librogest-hero.png', title: 'Modern Analytical View', description: 'Data visualization panel with premium design.' },
            { url: 'Elgitano1.PNG', title: 'Detailed view of stock levels with automatic replenishment alerts.', description: 'Detailed view of stock levels with automatic replenishment alerts.' },
            { url: 'Gitano2.PNG', title: 'Sales & Invoicing Registry', description: 'Transaction module designed for speed and accuracy at the point of sale.' }
          ],
          currentImageIndex: 0, link: '#', repo: '#', tags: ['C#', '.NET', 'SQL Server', 'ERP', 'Layered Architecture'],
          results: { efficiency: 'Stock Optimization', response: 'Real-time Sales', accuracy: '100% Cash Control' }
        }
      ]
    }
  };

  get t() { return this.allContent[this.currentLang()].ui; }
  get skillCategories() { return this.allContent[this.currentLang()].skillCategories; }
  get experience() { return this.allContent[this.currentLang()].experience; }
  get education() { return this.allContent[this.currentLang()].education; }
  get certifications() { return this.allContent[this.currentLang()].certifications; }
  get languages() { return this.allContent[this.currentLang()].languages; }
  get projects() { return this.allContent[this.currentLang()].projects; }



  toggleLanguage() {
    this._currentLang.update(l => l === 'es' ? 'en' : 'es');
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  // --- UI State & Logic ---
  isScrolled = false;
  timelineProgress = 0;
  selectedProject: any = null;
  isModalOpen = false;
  currentProjectSlide = 0;
  visibleCards = 3;
  isMobileMenuOpen = false;
  private touchStartX = 0;

  // Contact Form State
  contactData = { name: '', email: '', message: '' };
  isSendingEmail = false;
  emailSentSuccess = false;
  emailSentError = false;

  private sanitizer = inject(DomSanitizer);

  constructor(private el: ElementRef) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    this.reveal();
    this.updateTimelineProgress();
    if (this.isMobileMenuOpen) this.closeMobileMenu();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateVisibleCards();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (cursor && follower) {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

      const target = e.target as HTMLElement;
      const isClickable = target.closest('a, button, .clickable');
      if (isClickable) {
        cursor.classList.add('active');
        follower.classList.add('active');
      } else {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      }
    }
  }

  ngOnInit() {
    this.updateVisibleCards();
    setTimeout(() => {
      this.reveal();
      this.updateTimelineProgress();
    }, 100);
  }

  ngAfterViewInit() {
    this.renderRecaptcha();
  }

  private renderRecaptcha() {
    if (typeof (window as any).grecaptcha !== 'undefined' && (window as any).grecaptcha.render) {
      const container = document.getElementById('recaptcha-container');
      if (container && !container.innerHTML.trim()) {
        try {
          (window as any).grecaptcha.render('recaptcha-container', {
            'sitekey': '6LcK-t4sAAAAAB_ADSe-aTMUejCyakz-4Fhj_64o'
          });
        } catch (e) {
          console.error('Error al renderizar reCAPTCHA:', e);
        }
      }
    } else {
      setTimeout(() => this.renderRecaptcha(), 500);
    }
  }

  updateVisibleCards() {
    const width = window.innerWidth;
    if (width <= 768) this.visibleCards = 1;
    else if (width <= 1024) this.visibleCards = 2;
    else this.visibleCards = 3;

    const maxSlide = Math.max(0, this.projects.length - this.visibleCards);
    if (this.currentProjectSlide > maxSlide) this.currentProjectSlide = maxSlide;
  }

  reveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-on-scroll, .timeline-item');
    reveals.forEach((el: any) => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 100;
      if (elementTop < windowHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  }

  updateTimelineProgress() {
    const timeline = document.querySelector('.timeline');
    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = (windowHeight * 0.8 - rect.top) / (rect.height + windowHeight * 0.6);
      this.timelineProgress = Math.min(Math.max(progress * 100, 0), 100);
    }
  }

  // --- Project Modal Logic ---
  openProjectModal(project: any) {
    if (project.images?.length > 0) {
      this.selectedProject = project;
      this.selectedProject.currentImageIndex = 0;
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeProjectModal() {
    this.isModalOpen = false;
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }

  nextImage(project: any, event: Event) {
    event.stopPropagation();
    project.currentImageIndex = (project.currentImageIndex + 1) % project.images.length;
  }

  prevImage(project: any, event?: Event) {
    if (event) event.stopPropagation();
    project.currentImageIndex = (project.currentImageIndex - 1 + project.images.length) % project.images.length;
  }

  // --- Contact Form ---
  public sendEmail(e: Event) {
    e.preventDefault();
    if (!this.contactData.name || !this.contactData.email || !this.contactData.message) return;

    this.isSendingEmail = true;
    this.emailSentSuccess = false;
    this.emailSentError = false;

    // Obtener token de reCAPTCHA
    let recaptchaResponse = '';
    if (typeof (window as any).grecaptcha !== 'undefined') {
      recaptchaResponse = (window as any).grecaptcha.getResponse();
      if (!recaptchaResponse) {
        alert(this.currentLang() === 'es' ? 'Por favor, confirma que no eres un robot.' : 'Please confirm you are not a robot.');
        this.isSendingEmail = false;
        return;
      }
    }

    // Usa las credenciales desde el archivo de entorno (.env equivalente en Angular)
    const serviceID = environment.emailjs.serviceId;
    const templateID = environment.emailjs.templateId;
    const publicKey = environment.emailjs.publicKey;

    // Usa los datos directamente, que es más seguro y fácil en Angular
    const templateParams = {
      from_name: this.contactData.name,
      reply_to: this.contactData.email,
      message: this.contactData.message,
      to_name: 'Ivan',
      'g-recaptcha-response': recaptchaResponse
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then((result) => {
        this.isSendingEmail = false;
        this.emailSentSuccess = true;
        this.contactData = { name: '', email: '', message: '' };
        if (typeof (window as any).grecaptcha !== 'undefined') {
          (window as any).grecaptcha.reset();
        }
        setTimeout(() => this.emailSentSuccess = false, 5000);
      }, (error) => {
        console.error('Error exacto de EmailJS:', error);
        this.isSendingEmail = false;
        this.emailSentError = true;
        if (typeof (window as any).grecaptcha !== 'undefined') {
          (window as any).grecaptcha.reset();
        }
        setTimeout(() => this.emailSentError = false, 5000);
      });
  }

  nextProjectSlide() {
    const maxSlide = Math.max(0, this.projects.length - this.visibleCards);
    this.currentProjectSlide = (this.currentProjectSlide >= maxSlide) ? 0 : this.currentProjectSlide + 1;
  }

  prevProjectSlide() {
    const maxSlide = Math.max(0, this.projects.length - this.visibleCards);
    this.currentProjectSlide = (this.currentProjectSlide <= 0) ? maxSlide : this.currentProjectSlide - 1;
  }

  get projectDots() {
    const maxSlide = Math.max(0, this.projects.length - this.visibleCards);
    return new Array(maxSlide + 1);
  }

  onCarouselTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].clientX;
  }

  onCarouselTouchEnd(e: TouchEvent) {
    const diff = this.touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.nextProjectSlide();
      else this.prevProjectSlide();
    }
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update active state manually if needed, but the scroll listener already does this via reveal()
    }
  }

  scrollToTop(event: Event) {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // --- Dino Game Logic ---
  public gameActive = false;
  public isGameOver = false;
  public gameScore = 0;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private imgDino = new Image();
  private imgCactus1 = new Image();
  private imgCactus2 = new Image();
  private imgSuelo = new Image();
  private assetsLoaded = false;
  private dino = { x: 50, y: 0, width: 60, height: 55, velocityY: 0, isJumping: false, frame: 0, frameTimer: 0 };
  private obstacles: any[] = [];
  private groundX = 0;
  private speed = 1.0;
  private lastObstacleTime = 0;
  private animationFrameId: any;
  private groundY = 250;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && (this.gameActive || this.isGameOver)) {
      e.preventDefault();
      if (this.gameActive) this.jump();
      else if (this.isGameOver) this.onResetGame();
    }
  }

  onGameTouch(e: Event) {
    // Prevent double processing on mobile (touchstart + mousedown)
    if (e.type === 'mousedown' && 'ontouchstart' in window) return;

    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }

    if (this.gameActive) {
      e.preventDefault();
      this.jump();
    } else if (this.isGameOver) {
      e.preventDefault();
      this.onResetGame();
    }
  }

  onStartGame() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const container = document.getElementById('gameContenedor');
    if (this.canvas && container) {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx = this.canvas.getContext('2d')!;
      this.ctx.scale(dpr, dpr);
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height}px`;
      this.groundY = rect.height - 50;
    }
    this.loadAssets().then(() => this.startGame());
  }

  onResetGame(e?: Event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.isGameOver = false;
    this.startGame();
  }

  private async loadAssets() {
    if (this.assetsLoaded) return;
    const loadImg = (img: HTMLImageElement, src: string) => new Promise(resolve => { img.onload = resolve; img.src = src; });
    await Promise.all([loadImg(this.imgDino, '/animacionsprite.png'), loadImg(this.imgCactus1, '/cactus1.png'), loadImg(this.imgCactus2, '/cactus2.png'), loadImg(this.imgSuelo, '/suelo.png')]);
    this.assetsLoaded = true;
  }

  private startGame() {
    this.gameActive = true;
    this.isGameOver = false;
    this.gameScore = 0;
    this.speed = 1.0;
    this.obstacles = [];
    this.lastObstacleTime = 0;
    this.dino.y = this.groundY - this.dino.height;
    this.dino.velocityY = 0;
    this.dino.isJumping = false;

    let lastTime = performance.now();
    const loop = (now: number) => {
      if (!this.gameActive) return;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      this.updateGame(dt);
      this.drawGame();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private updateGame(dt: number) {
    this.dino.velocityY += 3000 * dt;
    this.dino.y += this.dino.velocityY * dt;
    if (this.dino.y >= this.groundY - this.dino.height) { this.dino.y = this.groundY - this.dino.height; this.dino.velocityY = 0; this.dino.isJumping = false; }
    if (!this.dino.isJumping) { this.dino.frameTimer += dt; if (this.dino.frameTimer > 0.1) { this.dino.frame = (this.dino.frame + 1) % 2; this.dino.frameTimer = 0; } }
    this.lastObstacleTime += dt;
    if (this.lastObstacleTime > 1.6 / this.speed) { this.spawnObstacle(); this.lastObstacleTime = 0; }
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= 450 * dt * this.speed;
      if (obs.x + obs.width < 0) { this.obstacles.splice(i, 1); this.gameScore++; this.speed += 0.02; }
      if (this.checkCollision(this.dino, obs)) this.endGame();
    }
    this.groundX -= 450 * dt * this.speed;
  }

  private drawGame() {
    const ctx = this.ctx;
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    const sueloW = this.imgSuelo.width;
    const offset = this.groundX % sueloW;
    for (let x = offset; x < w; x += sueloW) ctx.drawImage(this.imgSuelo, x, this.groundY, sueloW, 12);
    const frameX = this.isGameOver ? 450 : (this.dino.frame * 150);
    ctx.drawImage(this.imgDino, frameX, 0, 150, 137, this.dino.x, this.dino.y, this.dino.width, this.dino.height);
    this.obstacles.forEach(obs => ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height));
  }

  private spawnObstacle() {
    const isType2 = Math.random() > 0.5;
    const img = isType2 ? this.imgCactus2 : this.imgCactus1;
    const width = isType2 ? 60 : 30;
    const height = isType2 ? 40 : 60;
    this.obstacles.push({ x: (this.canvas.width / (window.devicePixelRatio || 1)) + 100, y: this.groundY - height, width, height, img });
  }

  private jump() { if (!this.dino.isJumping) { this.dino.velocityY = -1000; this.dino.isJumping = true; } }

  private checkCollision(a: any, b: any) {
    const px = 10, py = 5;
    return a.x + px < b.x + b.width && a.x + a.width - px > b.x && a.y + py < b.y + b.height && a.y + a.height - py > b.y;
  }

  private endGame() { this.gameActive = false; this.isGameOver = true; cancelAnimationFrame(this.animationFrameId); this.drawGame(); }
}
