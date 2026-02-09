import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState, useMemo } from 'react';
import { 
  Users, 
  Shield, 
  MessageSquare, 
  Coins, 
  Gift, 
  Heart, 
  Crown, 
  BookOpen, 
  Megaphone,
  Info,
  CheckCircle2,
  Award,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocumentationTab() {
  const { t, locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const knowledgeBaseSections = [
    {
      id: 'membership',
      icon: Users,
      titleEn: 'Membership',
      titleFr: 'Adhésion',
      topics: [
        {
          id: 'join-process',
          titleEn: 'How to Join Phil3',
          titleFr: 'Comment rejoindre Phil3',
          contentEn: 'To join Phil3, first log in with Internet Identity. After creating your profile, click "Request to Join" on the Overview tab. Your request will be reviewed by admins or existing members. Once approved, you become a Member and gain access to consensus meetings and community features.',
          contentFr: 'Pour rejoindre Phil3, connectez-vous d\'abord avec Internet Identity. Après avoir créé votre profil, cliquez sur "Demander à rejoindre" dans l\'onglet Aperçu. Votre demande sera examinée par les administrateurs ou les membres existants. Une fois approuvé, vous devenez Membre et accédez aux réunions de consensus et aux fonctionnalités communautaires.',
        },
        {
          id: 'user-categories',
          titleEn: 'User Categories',
          titleFr: 'Catégories d\'utilisateurs',
          contentEn: 'Phil3 has three user categories: Non-Member (not yet approved), Member (approved but not recently active), and Active Member (participated in a consensus meeting within the last month). Active Members have additional privileges including access to the Members directory and ability to create blog posts.',
          contentFr: 'Phil3 a trois catégories d\'utilisateurs : Non-Membre (pas encore approuvé), Membre (approuvé mais pas récemment actif) et Membre Actif (a participé à une réunion de consensus au cours du dernier mois). Les Membres Actifs ont des privilèges supplémentaires, notamment l\'accès au répertoire des Membres et la possibilité de créer des articles de blog.',
        },
        {
          id: 'profile-management',
          titleEn: 'Managing Your Profile',
          titleFr: 'Gérer votre profil',
          contentEn: 'You can edit your profile at any time from the Overview tab. Update your username, bio, and profile picture to personalize your presence in the community. Your email and principal address are set during initial setup and cannot be changed.',
          contentFr: 'Vous pouvez modifier votre profil à tout moment depuis l\'onglet Aperçu. Mettez à jour votre nom d\'utilisateur, votre bio et votre photo de profil pour personnaliser votre présence dans la communauté. Votre email et votre adresse principale sont définis lors de la configuration initiale et ne peuvent pas être modifiés.',
        },
      ],
    },
    {
      id: 'governance',
      icon: Shield,
      titleEn: 'Governance',
      titleFr: 'Gouvernance',
      topics: [
        {
          id: 'admin-roles',
          titleEn: 'Admin Roles',
          titleFr: 'Rôles d\'administrateur',
          contentEn: 'Admins have full platform access including member management, UCA updates, consensus meeting creation, and tokenomics configuration. The first user to join becomes the initial admin. Admins can promote other members to admin status.',
          contentFr: 'Les administrateurs ont un accès complet à la plateforme, y compris la gestion des membres, les mises à jour de l\'UCA, la création de réunions de consensus et la configuration des tokenomics. Le premier utilisateur à rejoindre devient l\'administrateur initial. Les administrateurs peuvent promouvoir d\'autres membres au statut d\'administrateur.',
        },
        {
          id: 'council-system',
          titleEn: 'Council System',
          titleFr: 'Système du conseil',
          contentEn: 'The first five approved members automatically become council members. Council members have special governance privileges including creating announcements, proposing multi-signature actions, and managing treasury allocations. Council membership is recalculated based on REP token balances.',
          contentFr: 'Les cinq premiers membres approuvés deviennent automatiquement membres du conseil. Les membres du conseil ont des privilèges de gouvernance spéciaux, notamment la création d\'annonces, la proposition d\'actions multi-signatures et la gestion des allocations de trésorerie. L\'adhésion au conseil est recalculée en fonction des soldes de jetons REP.',
        },
        {
          id: 'multisig-actions',
          titleEn: 'Multi-Signature Actions',
          titleFr: 'Actions multi-signatures',
          contentEn: 'Important governance decisions require approval from at least 3 of 5 council members through the multi-signature system. Council members can propose actions and approve pending proposals. Once 3 approvals are reached, the action is automatically executed.',
          contentFr: 'Les décisions de gouvernance importantes nécessitent l\'approbation d\'au moins 3 des 5 membres du conseil via le système multi-signatures. Les membres du conseil peuvent proposer des actions et approuver les propositions en attente. Une fois que 3 approbations sont atteintes, l\'action est automatiquement exécutée.',
        },
      ],
    },
    {
      id: 'consensus-meetings',
      icon: MessageSquare,
      titleEn: 'Consensus Meetings',
      titleFr: 'Réunions de consensus',
      topics: [
        {
          id: 'meeting-phases',
          titleEn: 'Meeting Phases',
          titleFr: 'Phases de réunion',
          contentEn: 'Consensus meetings have 4 phases: Sign-up (24 hours, minimum 3 participants), Contribution (5 days, submit your work and get grouped), Ranking (24 hours, rank group members by contribution quality), and Finalize (consensus validation and token distribution).',
          contentFr: 'Les réunions de consensus ont 4 phases : Inscription (24 heures, minimum 3 participants), Contribution (5 jours, soumettez votre travail et soyez regroupé), Classement (24 heures, classez les membres du groupe par qualité de contribution) et Finalisation (validation du consensus et distribution des jetons).',
        },
        {
          id: 'participation',
          titleEn: 'How to Participate',
          titleFr: 'Comment participer',
          contentEn: 'Only Members can join consensus meetings. Sign up during the sign-up phase, submit your weekly contribution with text and optional files during the contribution phase, then rank your group members during the ranking phase. Participation earns you REP and PHIL tokens.',
          contentFr: 'Seuls les Membres peuvent rejoindre les réunions de consensus. Inscrivez-vous pendant la phase d\'inscription, soumettez votre contribution hebdomadaire avec du texte et des fichiers optionnels pendant la phase de contribution, puis classez les membres de votre groupe pendant la phase de classement. La participation vous fait gagner des jetons REP et PHIL.',
        },
        {
          id: 'consensus-rewards',
          titleEn: 'Consensus Rewards',
          titleFr: 'Récompenses de consensus',
          contentEn: 'When your group reaches consensus (identical rankings from required participants), tokens are distributed using Fibonacci sequence weighting. Higher-ranked participants receive more tokens. REP tokens are non-transferable reputation points, while PHIL tokens are transferable rewards.',
          contentFr: 'Lorsque votre groupe atteint le consensus (classements identiques des participants requis), les jetons sont distribués en utilisant une pondération de séquence de Fibonacci. Les participants mieux classés reçoivent plus de jetons. Les jetons REP sont des points de réputation non transférables, tandis que les jetons PHIL sont des récompenses transférables.',
        },
      ],
    },
    {
      id: 'tokenomics',
      icon: Coins,
      titleEn: 'Tokenomics',
      titleFr: 'Tokenomics',
      topics: [
        {
          id: 'token-types',
          titleEn: 'REP and PHIL Tokens',
          titleFr: 'Jetons REP et PHIL',
          contentEn: 'Phil3 uses two tokens: REP (Reputation) is non-transferable and earned through governance participation and consensus meetings. PHIL is transferable and serves as the reward token. You can donate PHIL to other users or treasury accounts, and use it to tip blog post authors.',
          contentFr: 'Phil3 utilise deux jetons : REP (Réputation) est non transférable et gagné grâce à la participation à la gouvernance et aux réunions de consensus. PHIL est transférable et sert de jeton de récompense. Vous pouvez donner des PHIL à d\'autres utilisateurs ou à des comptes de trésorerie, et l\'utiliser pour donner des pourboires aux auteurs d\'articles de blog.',
        },
        {
          id: 'bitcoin-model',
          titleEn: 'Bitcoin-like Model',
          titleFr: 'Modèle de type Bitcoin',
          contentEn: 'PHIL has a maximum supply of 21,000,000 tokens with a halving mechanism every 3 months. Minting rewards decrease by half each cycle. After reaching maximum supply, the system transitions to 2% annual inflation. Tokens are distributed across three treasuries: Rewards (70%), Marketing (20%), and Council (10%).',
          contentFr: 'PHIL a une offre maximale de 21 000 000 de jetons avec un mécanisme de halving tous les 3 mois. Les récompenses de frappe diminuent de moitié à chaque cycle. Après avoir atteint l\'offre maximale, le système passe à une inflation annuelle de 2 %. Les jetons sont distribués dans trois trésoreries : Récompenses (70 %), Marketing (20 %) et Conseil (10 %).',
        },
        {
          id: 'treasury-system',
          titleEn: 'Treasury System',
          titleFr: 'Système de trésorerie',
          contentEn: 'Phil3 maintains three treasury accounts: Rewards Treasury (funds consensus meeting distributions), Marketing Treasury (funds daily rewards), and Council Treasury (managed by council for special initiatives). Admins and council members can configure allocation percentages and distribution rules.',
          contentFr: 'Phil3 maintient trois comptes de trésorerie : Trésorerie des Récompenses (finance les distributions des réunions de consensus), Trésorerie Marketing (finance les récompenses quotidiennes) et Trésorerie du Conseil (gérée par le conseil pour des initiatives spéciales). Les administrateurs et les membres du conseil peuvent configurer les pourcentages d\'allocation et les règles de distribution.',
        },
      ],
    },
    {
      id: 'rewards',
      icon: Gift,
      titleEn: 'Rewards',
      titleFr: 'Récompenses',
      topics: [
        {
          id: 'daily-rewards',
          titleEn: 'Daily Rewards',
          titleFr: 'Récompenses quotidiennes',
          contentEn: 'Claim daily PHIL rewards once every 24 hours. Reward amounts vary by user category: Non-Members receive the base amount, Members receive more, and Active Members receive the highest amount. Daily rewards are funded from a configurable percentage of the Marketing Treasury (default 30%).',
          contentFr: 'Réclamez des récompenses PHIL quotidiennes une fois toutes les 24 heures. Les montants des récompenses varient selon la catégorie d\'utilisateur : les Non-Membres reçoivent le montant de base, les Membres reçoivent plus et les Membres Actifs reçoivent le montant le plus élevé. Les récompenses quotidiennes sont financées par un pourcentage configurable de la Trésorerie Marketing (par défaut 30 %).',
        },
        {
          id: 'consensus-distribution',
          titleEn: 'Consensus Meeting Distribution',
          titleFr: 'Distribution des réunions de consensus',
          contentEn: 'Weekly consensus meetings distribute tokens from the Rewards Treasury. A configurable percentage (default 70%) of the Rewards Treasury is available for weekly distributions. Tokens are allocated using Fibonacci sequence weighting based on consensus rankings.',
          contentFr: 'Les réunions de consensus hebdomadaires distribuent des jetons de la Trésorerie des Récompenses. Un pourcentage configurable (par défaut 70 %) de la Trésorerie des Récompenses est disponible pour les distributions hebdomadaires. Les jetons sont alloués en utilisant une pondération de séquence de Fibonacci basée sur les classements de consensus.',
        },
        {
          id: 'earning-strategies',
          titleEn: 'Earning Strategies',
          titleFr: 'Stratégies de gain',
          contentEn: 'Maximize your token earnings by: claiming daily rewards consistently, participating in weekly consensus meetings, submitting high-quality contributions, achieving consensus with your group, and maintaining Active Member status through regular participation.',
          contentFr: 'Maximisez vos gains de jetons en : réclamant des récompenses quotidiennes de manière cohérente, participant aux réunions de consensus hebdomadaires, soumettant des contributions de haute qualité, atteignant le consensus avec votre groupe et maintenant le statut de Membre Actif grâce à une participation régulière.',
        },
      ],
    },
    {
      id: 'donations',
      icon: Heart,
      titleEn: 'Donations',
      titleFr: 'Dons',
      topics: [
        {
          id: 'phil-transfers',
          titleEn: 'PHIL Transfers',
          titleFr: 'Transferts PHIL',
          contentEn: 'Transfer PHIL tokens to other users or treasury accounts from the Donate PHIL card on the Overview tab. Select a recipient (user or treasury), enter the amount, and confirm the transaction. Your balance is updated immediately after successful donation.',
          contentFr: 'Transférez des jetons PHIL à d\'autres utilisateurs ou à des comptes de trésorerie depuis la carte Donner PHIL dans l\'onglet Aperçu. Sélectionnez un destinataire (utilisateur ou trésorerie), entrez le montant et confirmez la transaction. Votre solde est mis à jour immédiatement après un don réussi.',
        },
        {
          id: 'treasury-donations',
          titleEn: 'Treasury Donations',
          titleFr: 'Dons à la trésorerie',
          contentEn: 'Support the community by donating PHIL to treasury accounts: Rewards Treasury (funds consensus distributions), Marketing Treasury (funds daily rewards), or Council Treasury (funds special initiatives). Treasury donations help sustain the platform\'s reward systems.',
          contentFr: 'Soutenez la communauté en donnant des PHIL aux comptes de trésorerie : Trésorerie des Récompenses (finance les distributions de consensus), Trésorerie Marketing (finance les récompenses quotidiennes) ou Trésorerie du Conseil (finance des initiatives spéciales). Les dons à la trésorerie aident à maintenir les systèmes de récompense de la plateforme.',
        },
        {
          id: 'blog-tips',
          titleEn: 'Blog Post Tips',
          titleFr: 'Pourboires d\'articles de blog',
          contentEn: 'Show appreciation for quality blog content by tipping authors with PHIL tokens. Click the "Tip" button on any blog post, enter the amount, and send. Tips are transferred directly from your balance to the author\'s balance.',
          contentFr: 'Montrez votre appréciation pour un contenu de blog de qualité en donnant des pourboires aux auteurs avec des jetons PHIL. Cliquez sur le bouton "Pourboire" sur n\'importe quel article de blog, entrez le montant et envoyez. Les pourboires sont transférés directement de votre solde au solde de l\'auteur.',
        },
      ],
    },
    {
      id: 'council',
      icon: Crown,
      titleEn: 'Council',
      titleFr: 'Conseil',
      topics: [
        {
          id: 'council-membership',
          titleEn: 'Becoming a Council Member',
          titleFr: 'Devenir membre du conseil',
          contentEn: 'The first five approved members automatically become council members. Council membership is later recalculated based on total REP token balances. Members with the highest REP balances are selected as council members.',
          contentFr: 'Les cinq premiers membres approuvés deviennent automatiquement membres du conseil. L\'adhésion au conseil est ensuite recalculée en fonction des soldes totaux de jetons REP. Les membres avec les soldes REP les plus élevés sont sélectionnés comme membres du conseil.',
        },
        {
          id: 'council-responsibilities',
          titleEn: 'Council Responsibilities',
          titleFr: 'Responsabilités du conseil',
          contentEn: 'Council members oversee membership approvals, manage treasury allocations, configure token distribution rules, create announcements, and propose multi-signature actions. They work collaboratively to ensure fair governance and sustainable platform operations.',
          contentFr: 'Les membres du conseil supervisent les approbations d\'adhésion, gèrent les allocations de trésorerie, configurent les règles de distribution de jetons, créent des annonces et proposent des actions multi-signatures. Ils travaillent en collaboration pour assurer une gouvernance équitable et des opérations de plateforme durables.',
        },
        {
          id: 'council-decisions',
          titleEn: 'Council Decision-Making',
          titleFr: 'Prise de décision du conseil',
          contentEn: 'Major decisions require 3-of-5 multi-signature approval. Council members propose actions with unique IDs and descriptions. Other council members review and approve proposals. Once 3 approvals are reached, the action executes automatically.',
          contentFr: 'Les décisions majeures nécessitent une approbation multi-signatures 3 sur 5. Les membres du conseil proposent des actions avec des identifiants uniques et des descriptions. Les autres membres du conseil examinent et approuvent les propositions. Une fois que 3 approbations sont atteintes, l\'action s\'exécute automatiquement.',
        },
      ],
    },
    {
      id: 'blog',
      icon: BookOpen,
      titleEn: 'Blog',
      titleFr: 'Blog',
      topics: [
        {
          id: 'creating-posts',
          titleEn: 'Creating Blog Posts',
          titleFr: 'Créer des articles de blog',
          contentEn: 'Admins and Active Members can create blog posts. Click "Create Post" on the Blog tab, enter a title and content using the rich text editor, and publish. Posts support formatted text, images, and videos. Edit your posts anytime by clicking the edit button.',
          contentFr: 'Les administrateurs et les Membres Actifs peuvent créer des articles de blog. Cliquez sur "Créer un article" dans l\'onglet Blog, entrez un titre et un contenu à l\'aide de l\'éditeur de texte enrichi et publiez. Les articles prennent en charge le texte formaté, les images et les vidéos. Modifiez vos articles à tout moment en cliquant sur le bouton de modification.',
        },
        {
          id: 'engagement',
          titleEn: 'Engaging with Posts',
          titleFr: 'Interagir avec les articles',
          contentEn: 'All authenticated users can engage with blog posts by liking, commenting, sharing, and tipping. Like posts to show appreciation, add comments to join discussions, share links to spread content, and tip authors with PHIL tokens to support quality contributions.',
          contentFr: 'Tous les utilisateurs authentifiés peuvent interagir avec les articles de blog en aimant, commentant, partageant et donnant des pourboires. Aimez les articles pour montrer votre appréciation, ajoutez des commentaires pour rejoindre les discussions, partagez des liens pour diffuser le contenu et donnez des pourboires aux auteurs avec des jetons PHIL pour soutenir les contributions de qualité.',
        },
        {
          id: 'blog-guidelines',
          titleEn: 'Blog Guidelines',
          titleFr: 'Directives du blog',
          contentEn: 'Create valuable content that benefits the community. Share insights, updates, and thoughtful perspectives. Be respectful in comments and discussions. Only post authors and admins can edit or delete posts. Quality content may earn you tips from appreciative readers.',
          contentFr: 'Créez du contenu précieux qui profite à la communauté. Partagez des idées, des mises à jour et des perspectives réfléchies. Soyez respectueux dans les commentaires et les discussions. Seuls les auteurs d\'articles et les administrateurs peuvent modifier ou supprimer des articles. Un contenu de qualité peut vous rapporter des pourboires de lecteurs reconnaissants.',
        },
      ],
    },
    {
      id: 'announcements',
      icon: Megaphone,
      titleEn: 'Announcements',
      titleFr: 'Annonces',
      topics: [
        {
          id: 'announcement-system',
          titleEn: 'Announcement System',
          titleFr: 'Système d\'annonces',
          contentEn: 'Admins and council members can create announcements to share important updates with the community. Announcements appear in the Announcements tab and are visible to all authenticated users. Use announcements for platform updates, governance decisions, and community news.',
          contentFr: 'Les administrateurs et les membres du conseil peuvent créer des annonces pour partager des mises à jour importantes avec la communauté. Les annonces apparaissent dans l\'onglet Annonces et sont visibles par tous les utilisateurs authentifiés. Utilisez les annonces pour les mises à jour de la plateforme, les décisions de gouvernance et les nouvelles de la communauté.',
        },
        {
          id: 'staying-informed',
          titleEn: 'Staying Informed',
          titleFr: 'Rester informé',
          contentEn: 'Check the Announcements tab regularly to stay updated on platform changes, governance decisions, consensus meeting schedules, and community initiatives. Announcements are displayed in reverse chronological order with the newest updates first.',
          contentFr: 'Consultez régulièrement l\'onglet Annonces pour rester informé des changements de plateforme, des décisions de gouvernance, des calendriers de réunions de consensus et des initiatives communautaires. Les annonces sont affichées dans l\'ordre chronologique inverse avec les mises à jour les plus récentes en premier.',
        },
      ],
    },
  ];

  // Filter sections and topics based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return knowledgeBaseSections;
    }

    const query = searchQuery.toLowerCase();
    
    return knowledgeBaseSections
      .map(section => {
        const sectionTitle = locale === 'en' ? section.titleEn : section.titleFr;
        const sectionMatches = sectionTitle.toLowerCase().includes(query);
        
        const filteredTopics = section.topics.filter(topic => {
          const topicTitle = locale === 'en' ? topic.titleEn : topic.titleFr;
          const topicContent = locale === 'en' ? topic.contentEn : topic.contentFr;
          
          return (
            topicTitle.toLowerCase().includes(query) ||
            topicContent.toLowerCase().includes(query)
          );
        });

        // Include section if section title matches OR if any topics match
        if (sectionMatches || filteredTopics.length > 0) {
          return {
            ...section,
            topics: sectionMatches ? section.topics : filteredTopics,
          };
        }
        
        return null;
      })
      .filter((section): section is NonNullable<typeof section> => section !== null);
  }, [searchQuery, locale, knowledgeBaseSections]);

  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) {
      return text;
    }

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const hasResults = filteredSections.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {locale === 'en' ? 'Documentation' : 'Documentation'}
              </CardTitle>
              <CardDescription>
                {locale === 'en' 
                  ? 'Comprehensive guide to Phil3 platform features and functionality'
                  : 'Guide complet des fonctionnalités et de la fonctionnalité de la plateforme Phil3'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <CardTitle>
                {locale === 'en' ? 'Knowledge Base' : 'Base de connaissances'}
              </CardTitle>
              <CardDescription>
                {locale === 'en'
                  ? 'Learn about Phil3\'s core features and how to use them effectively'
                  : 'Découvrez les fonctionnalités principales de Phil3 et comment les utiliser efficacement'
                }
              </CardDescription>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={locale === 'en' ? 'Search documentation...' : 'Rechercher dans la documentation...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasResults && searchQuery.trim() && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {locale === 'en' ? 'No results found' : 'Aucun résultat trouvé'}
              </h3>
              <p className="text-muted-foreground">
                {locale === 'en' 
                  ? `No documentation matches "${searchQuery}". Try different keywords.`
                  : `Aucune documentation ne correspond à "${searchQuery}". Essayez d'autres mots-clés.`
                }
              </p>
            </div>
          )}

          {hasResults && filteredSections.map((section) => {
            const SectionIcon = section.icon;
            const sectionTitle = locale === 'en' ? section.titleEn : section.titleFr;
            
            return (
              <div key={section.id} className="space-y-3">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <SectionIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {searchQuery.trim() ? highlightText(sectionTitle, searchQuery) : sectionTitle}
                  </h3>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {section.topics.map((topic) => {
                    const topicTitle = locale === 'en' ? topic.titleEn : topic.titleFr;
                    const topicContent = locale === 'en' ? topic.contentEn : topic.contentFr;
                    
                    return (
                      <AccordionItem key={topic.id} value={topic.id}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">
                              {searchQuery.trim() ? highlightText(topicTitle, searchQuery) : topicTitle}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2 pl-6 text-muted-foreground leading-relaxed">
                            {searchQuery.trim() ? highlightText(topicContent, searchQuery) : topicContent}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            {locale === 'en' ? 'Need More Help?' : 'Besoin d\'aide supplémentaire ?'}
          </CardTitle>
          <CardDescription>
            {locale === 'en'
              ? 'If you have questions not covered in this documentation, reach out to admins or council members through the community channels.'
              : 'Si vous avez des questions non couvertes dans cette documentation, contactez les administrateurs ou les membres du conseil via les canaux communautaires.'
            }
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
