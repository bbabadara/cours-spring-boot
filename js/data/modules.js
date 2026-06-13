const MODULES = [
  {
    id: 'module-1',
    number: 1,
    title: 'Démystifier la "Magie" de Spring Boot',
    subtitle: 'Sous le capot',
    color: 'from-blue-600 to-cyan-500',
    icon: '🔧',
    summary: 'Comprendre le fonctionnement interne de Spring Boot pour le debugger, le configurer et l\'optimiser en production.',
    sections: [
      {
        title: 'Cycle de vie du contexte Spring',
        desc: 'Inversion of Control (IoC) et gestion des Beans',
        content: `Le cœur de Spring repose sur le conteneur IoC (Inversion of Control). Au démarrage, Spring Boot instancie un ApplicationContext qui va scanner, créer et gérer le cycle de vie de tous les beans. Comprendre ce cycle est essentiel pour diagnostiquer les problèmes d'initialisation et optimiser le démarrage.

Le cycle de vie d'un bean suit un ordre précis : instantiation → injection des dépendances → post-processing via les BeanPostProcessors → initialisation (@PostConstruct, InitializingBean) → prêt pour l'utilisation → destruction (@PreDestroy, DisposableBean).`,
        details: [
          'ApplicationContext : ClassPathXmlApplicationContext vs AnnotationConfigApplicationContext',
          'BeanFactory vs ApplicationContext (lazy vs eager loading)',
          'Scopes : singleton, prototype, request, session, application',
          'BeanPostProcessors : intervention personnalisée avant/après l\'initialisation',
          'Events : ApplicationEventPublisher pour la communication découplée',
          'Problèmes courants : circular dependencies, bean not found, proxy issues'
        ],
        code: `@Bean
public CommandLineRunner demo(UserRepository repo) {
    return args -> {
        // Ce bean s'exécute après l'initialisation complète du contexte
        System.out.println("Application prête !");
    };
}

// Ou avec @PostConstruct pour une initialisation par bean
@Component
public class CacheInitializer {
    @PostConstruct
    public void warmUp() {
        log.info("Cache préchauffé avec succès");
    }
}`
      },
      {
        title: 'Auto-configuration',
        desc: '@EnableAutoConfiguration et @Conditional',
        content: `L'auto-configuration est le mécanisme qui distingue Spring Boot de Spring Framework. Elle repose sur des annotations conditionnelles (@Conditional) qui activent ou désactivent automatiquement des configurations selon le classpath, les beans présents, les propriétés, etc.

Chaque auto-configuration est une classe Java annotée avec @Configuration et @ConditionalOnClass, @ConditionalOnMissingBean, etc. Spring Boot évalue ces conditions au démarrage et n'applique que les configurations pertinentes.`,
        details: [
          'spring.factories et org.springframework.boot.autoconfigure.EnableAutoConfiguration',
          '@ConditionalOnClass, @ConditionalOnMissingBean, @ConditionalOnProperty',
          '@ConditionalOnExpression pour des conditions SpEL complexes',
          'Debugger l\'auto-configuration : --debug, spring-boot-maven-plugin:run',
          'Exclure une auto-configuration : @SpringBootApplication(exclude = ...)',
          'Créer sa propre auto-configuration pour une bibliothèque maison'
        ],
        code: `// Exemple : Détection automatique d'un datasource
@Configuration
@ConditionalOnClass(DataSource.class)
@ConditionalOnMissingBean(DataSource.class)
@ConditionalOnProperty(name = "spring.datasource.url")
public class DataSourceAutoConfiguration {

    @Bean
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder()
                .build();
    }
}

// Debug : activer le rapport d'auto-configuration
// application.yml
debug: true
// ou via CLI : java -jar app.jar --debug`
      },
      {
        title: 'Gestion des propriétés',
        desc: 'Hiérarchie des sources de configuration',
        content: `Spring Boot propose un mécanisme de résolution des propriétés par ordre de priorité. Les variables d'environnement, les arguments de ligne de commande et les fichiers de configuration sont fusionnés dans un Environment abstrait. Maîtriser cette hiérarchie est crucial pour le déploiement en production.`,
        details: [
          'Ordre de priorité : CLI args > JNDI > System props > OS env > application.yml > @PropertySource',
          'Relaxed Binding : SPRING_DATASOURCE_URL = spring.datasource.url',
          '@ConfigurationProperties vs @Value (type-safe vs simple)',
          'Properties validés avec @Validated et javax.validation',
          'Configuration hiérarchique avec YAML (documents multiples)',
          'Externalisation : spring.config.import, spring.config.additional-location'
        ],
        code: `// application.yml — configuration complète
server:
  port: \${PORT:8080}
spring:
  datasource:
    url: jdbc:postgresql://\${DB_HOST}:5432/mydb
    username: \${DB_USER}
    password: \${DB_PASSWORD}

---
spring:
  config:
    activate:
      on-profile: staging
server:
  port: 8081`
      },
      {
        title: 'Profiles Spring',
        desc: 'Stratégies avancées pour la séparation des environnements',
        content: `Les profiles permettent d'activer différents ensembles de beans et de configurations selon l'environnement. Une stratégie bien conçue utilise les profiles pour isoler les configurations de développement, de test, de staging et de production, tout en partageant la configuration commune.`,
        details: [
          'application-{profile}.yml : fichiers dédiés par environnement',
          'Activation : spring.profiles.active, SPRING_PROFILES_ACTIVE',
          '@Profile sur les beans pour activer/désactiver conditionnellement',
          'Groupes de profiles (Spring Boot 3+) : spring.profiles.group',
          'Combinaison avec @ConditionalOnExpression pour des règles avancées',
          'Anti-pattern : ne pas utiliser les profiles pour des features flags métier'
        ],
        code: `// Groupe de profiles (application.yml)
spring:
  profiles:
    group:
      "production": "prod,monitoring,redis-cluster"

// Utilisation dans le code
@Configuration
@Profile("!test")
public class ProductionOnlyConfig {
    @Bean
    public MetricsCollector metrics() {
        return new PrometheusMetricsCollector();
    }
}`
      }
    ],
    keyTakeaways: [
      'Le cycle de vie IoC est la fondation : maîtrisez-le pour débuguer efficacement',
      'L\'auto-configuration repose sur des conditions : utilisez --debug pour comprendre ce qui s\'active',
      'Les propriétés suivent une hiérarchie stricte : variables d\'environnement pour la production',
      'Les profiles isolent les environnements sans dupliquer la configuration'
    ]
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Modélisation et Architectures Modernes',
    subtitle: 'Focus Architecte',
    color: 'from-emerald-600 to-teal-500',
    icon: '🏗️',
    summary: 'Structurer le code pour qu\'il soit maintenable, testable et évolutif dans un contexte microservices.',
    sections: [
      {
        title: 'Architecture Hexagonale / Clean Architecture',
        desc: 'Isoler le domaine métier des contraintes techniques',
        content: `L'architecture hexagonale (ports & adapters) place le domaine métier au centre, totalement isolé des frameworks, bases de données et API. Les adapters (Spring Data, Controllers) deviennent des détails interchangeables. Cette approche garantit la testabilité du domaine sans infrastructure et facilite les changements technologiques.`,
        details: [
          'Domain Layer : entités, value objects, services métier — zéro dépendance Spring',
          'Ports : interfaces définies par le domaine (repository port, event publisher)',
          'Adapters : implémentations techniques (JpaRepository, RestController, KafkaProducer)',
          'Tests : domaine testable sans base de données, sans serveur web',
          'Avantage DevOps : remplacer PostgreSQL par MongoDB ou REST par gRPC sans toucher au domaine'
        ],
        code: `// Domaine pur — pas d'annotation Spring
public class Commande {
    private final CommandeId id;
    private final Montant total;

    public Facture facturer(TvaCalculator tva) {
        Montant ttc = tva.calculeSur(total);
        return new Facture(this, ttc);
    }
}

// Port — interface définie par le domaine
public interface CommandeRepository {
    Commande findById(CommandeId id);
    void save(Commande commande);
}

// Adapter — implémentation technique avec Spring
@Repository
public class CommandeJpaRepository implements CommandeRepository {
    private final JpaCommandeRepository jpa;

    @Override
    public Commande findById(CommandeId id) {
        return jpa.findById(id.value())
                .map(CommandeMapper::toDomain)
                .orElseThrow(() -> new CommandeNotFoundException(id));
    }
}`
      },
      {
        title: 'Paradigmes de communication',
        desc: 'Synchrone, Asynchrone et Réactif',
        content: `Le choix du paradigme de communication impacte directement la résilience, la performance et la maintenabilité du système. REST convient pour les interactions CRUD simples, gRPC pour les communications inter-services à haute performance, Kafka/RabbitMQ pour l'intégration événementielle, et WebFlux pour les flux réactifs à forte concurrence.`,
        details: [
          'REST (Spring WebMVC) : mature, découplé, idéal pour les APIs publiques',
          'gRPC : performances élevées (Protobuf), streaming bidirectionnel, typage fort',
          'Spring Cloud Stream : abstraction uniforme pour Kafka/RabbitMQ, binders interchangeables',
          'Spring WebFlux / Project Reactor : non-bloquant, backpressure, concurrence massive',
          'Choisir : REST pour l\'externe, gRPC pour l\'interne, Events pour le découplage fort',
          'Anti-pattern : communication synchrone en cascade dans un graphe de microservices'
        ],
        code: `// Événement asynchrone avec Spring Cloud Stream
@Component
public class CommandeProcessor {

    @StreamListener(Sink.INPUT)
    public void handle(CommandeCreeeEvent event) {
        log.info("Commande {} créée, déclenchement workflows...", event.commandeId());
        // Appels asynchrones découplés
    }
}

// Flux réactif avec WebFlux
@RestController
public class CommandeController {

    @GetMapping("/flux/commandes")
    public Flux<Commande> streamCommandes() {
        return Flux.interval(Duration.ofSeconds(1))
                .map(i -> commandeService.random());
    }
}`
      },
      {
        title: 'Accès aux données',
        desc: 'Spring Data JPA vs R2DBC, Cache Redis',
        content: `L'accès aux données doit être choisi selon le cas d'usage : JPA pour les applications transactionnelles avec relations complexes, R2DBC pour les pipelines réactifs nécessitant une faible latence. Redis vient en complément pour la mise en cache distribué et les sessions. L'optimisation des requêtes est cruciale pour éviter les N+1 queries et les deadlocks.`,
        details: [
          'Spring Data JPA : mature, requêtes dérivées, auditing, locking optimiste',
          'N+1 queries : @EntityGraph, @BatchSize, JOIN FETCH explicites',
          'R2DBC : réactif de bout en bout, pas de lazy loading, requêtes explicites',
          'Redis : @Cacheable, @CacheEvict, cache distribué, session store',
          'Optimisation : pagination (Slice vs Page), querydsl pour les recherches dynamiques'
        ],
        code: `// Optimisation des requêtes : éviter le N+1
@Entity
@NamedEntityGraph(name = "Commande.lignes",
        attributeNodes = @NamedAttributeNode("lignes"))
public class Commande {
    @OneToMany(mappedBy = "commande", fetch = LAZY)
    private List<LigneCommande> lignes;
}

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    @EntityGraph("Commande.lignes")
    @Query("SELECT c FROM Commande c WHERE c.id = :id")
    Optional<Commande> findWithLignes(@Param("id") Long id);
}

// Cache Redis
@Cacheable(value = "catalog", key = "#productId")
public Product findProduct(Long productId) {
    return productRepository.findById(productId)
            .orElseThrow();
}`
      }
    ],
    keyTakeaways: [
      'L\'architecture hexagonale isole le métier des frameworks : changez de technologie sans toucher au domaine',
      'Chaque paradigme de communication a sa place : REST (externe), gRPC (interne), Events (intégration)',
      'JPA pour le relationnel transactionnel, R2DBC pour le réactif, Redis pour le cache distribué',
      'L\'optimisation des requêtes SQL est un impératif : EntityGraph et pagination'
    ]
  },
  {
    id: 'module-3',
    number: 3,
    title: 'L\'Écosystème Microservices',
    subtitle: 'Spring Cloud & Résilience',
    color: 'from-purple-600 to-violet-500',
    icon: '☁️',
    summary: 'Concevoir des systèmes distribués résilients avec Spring Cloud et les patterns de tolérance aux pannes.',
    sections: [
      {
        title: 'Service Discovery & Registries',
        desc: 'Eureka, Consul ou intégration native Kubernetes',
        content: `Dans une architecture microservices, les instances démarrent et s'arrêtent dynamiquement. Le Service Registry permet aux services de se découvrir mutuellement sans configuration statique. Eureka offre une intégration Spring Cloud simple, Consul ajoute la gestion de configuration et le health checking, tandis que Kubernetes native supprime le besoin d'un registry externe.`,
        details: [
          'Eureka Server : @EnableEurekaServer, auto-enregistrement, heartbeats, auto-pruning',
          'Consul : service discovery + KV store + health checks + multi-datacenter',
          'Kubernetes : DNS-based discovery (Headless Services), pas de registry supplémentaire',
          'Ribbon (legacy) vs Spring Cloud LoadBalancer : client-side load balancing moderne',
          'Stratégie : Eureka pour cloud VM, Kubernetes native service pour K8s'
        ],
        code: `// Configuration Eureka Server
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServiceApplication.class, args);
    }
}

// Configuration Client
spring:
  application:
    name: commande-service
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
  instance:
    preferIpAddress: true
    leaseRenewalIntervalInSeconds: 10`
      },
      {
        title: 'API Gateway',
        desc: 'Routage, filtrage et rate-limiting avec Spring Cloud Gateway',
        content: `L'API Gateway est le point d'entrée unique du système. Spring Cloud Gateway (non-bloquant, basé sur WebFlux) route les requêtes, applique des filtres transversaux (authentification, logging, rate-limiting) et protège les services internes. Contrairement à Zuul (legacy), il est réactif et offre un meilleur contrôle du flux.`,
        details: [
          'Routes : predicates (path, header, query param) + filters (addRequestHeader, circuitBreaker)',
          'Rate Limiting : RequestRateLimiter avec Redis (token bucket)',
          'Filtres personnalisés : implémenter GatewayFilter pour des besoins spécifiques',
          'Sécurité : authentication au niveau gateway, propagation du token JWT',
          'Circuit Breaker intégré avec Resilience4j au niveau des routes'
        ],
        code: `spring:
  cloud:
    gateway:
      routes:
        - id: commande-service
          uri: lb://commande-service
          predicates:
            - Path=/api/commandes/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200
            - name: CircuitBreaker
              args:
                fallbackUri: forward:/fallback/commandes`
      },
      {
        title: 'Configuration Centralisée',
        desc: 'Spring Cloud Config Server avec backend Git/Vault',
        content: `La configuration centralisée permet de gérer les propriétés de tous les microservices depuis un point unique. Spring Cloud Config Server peut utiliser Git comme backend (versionné, auditable) ou HashiCorp Vault pour les secrets. Les clients reçoivent leur configuration au démarrage et peuvent être refreshés dynamiquement.`,
        details: [
          'Config Server : @EnableConfigServer, backend Git, Vault, JDBC, ou custom',
          'Config Client : bootstrap.yml (Spring Boot 2) vs spring.config.import (Spring Boot 3+)',
          '@RefreshScope : rechargement à chaud via /actuator/refresh ou Spring Cloud Bus',
          'Spring Cloud Bus : propagation des changements à toutes les instances via Kafka/RabbitMQ',
          'Vault : secrets chiffrés au repos, rotation automatique, politique d\'accès fine'
        ],
        code: `// Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}

// application.yml du Config Server
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/company/config-repo
          searchPaths: '{application}'
          default-label: main
        vault:
          host: vault.prod.internal
          port: 8200
          scheme: https

// Client — Spring Boot 3+
spring:
  config:
    import: configserver:http://config-server:8888`
      },
      {
        title: 'Résilience et Tolérance aux Pannes',
        desc: 'Circuit Breaker, Retries, Bulkheads avec Resilience4j',
        content: `Dans un système distribué, les défaillances sont inévitables. Resilience4j implémente les patterns de résilience avec une approche modulaire et légère (contrairement à Hystrix, aujourd'hui en maintenance). Le Circuit Breaker évite les appels à un service défaillant, les Retries gèrent les échecs transitoires, et les Bulkheads isolent les ressources par thread pool.`,
        details: [
          'Circuit Breaker : 3 états (CLOSED, OPEN, HALF_OPEN), sliding window, seuils configurables',
          'Retry : backoff exponentiel, jitter pour éviter le thundering herd',
          'Bulkhead : isolation par sémaphores ou thread pools, éviter l\'effet domino',
          'Time Limiter : timeout des appels externes',
          'Rate Limiter : limiter le débit d\'appels entrants',
          'Actuator endpoints : /actuator/circuitbreakers, /actuator/retries'
        ],
        code: `@Service
public class PaiementService {

    @CircuitBreaker(name = "paiementService", fallbackMethod = "fallback")
    @Retry(name = "paiementService", fallbackMethod = "fallback")
    @Bulkhead(name = "paiementService", type = THREAD_POOL)
    public PaiementResult traiterPaiement(Commande commande) {
        return paiementClient.charger(commande.total(), commande.carte());
    }

    private PaiementResult fallback(Commande commande, Throwable t) {
        log.warn("Paiement échoué pour commande {}, mode dégradé", commande.id(), t);
        return PaiementResult.EN_ATTENTE;
    }
}

// Configuration Resilience4j
resilience4j:
  circuitbreaker:
    configs:
      default:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 30s
        permittedNumberOfCallsInHalfOpenState: 3`
      }
    ],
    keyTakeaways: [
      'Le Service Discovery élimine la configuration statique : Eureka pour VM, DNS K8s pour Kubernetes',
      'Spring Cloud Gateway est le point d\'entrée unique : rate-limiting et sécurité transversale',
      'Config Server + Git : configuration versionnée, auditable, refreshable à chaud',
      'Resilience4j est la boîte à outils de résilience : Circuit Breaker, Retry, Bulkhead'
    ]
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Sécurité "Zero Trust"',
    subtitle: 'OAuth2, OIDC & JWT',
    color: 'from-red-600 to-rose-500',
    icon: '🛡️',
    summary: 'Sécuriser les applications dans une architecture distribuée avec le modèle Zero Trust.',
    sections: [
      {
        title: 'Architecture de Spring Security',
        desc: 'Filtres, gestionnaires d\'authentification et d\'autorisation',
        content: `Spring Security repose sur une chaîne de filtres (FilterChain) qui intercepte chaque requête HTTP. Comprendre cette chaîne est essentiel pour configurer correctement la sécurité sans la subir. Chaque filtre a une responsabilité unique : authentification, autorisation, CSRF, CORS, etc.`,
        details: [
          'SecurityFilterChain : ordre des filtres, RequestMatcher pour la sélectivité',
          'AuthenticationManager : délègue aux AuthenticationProviders (LDAP, JWT, DB, etc.)',
          'SecurityContextHolder : stratégie de stockage du contexte (MODE_INHERITABLETHREADLOCAL pour l\'async)',
          'Method Security : @PreAuthorize, @PostAuthorize, @Secured pour la sécurité au niveau méthode',
          'CORS & CSRF : configuration pour les SPA et APIs RESTful',
          'Spring Security 6+ : nouvelle configuration lambda-based (plus type-safe)'
        ],
        code: `// Configuration Spring Security 6+
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .securityMatcher("/api/**")
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(GET, "/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthConverter())
                )
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(STATELESS)
            )
            .cors(cors -> cors.configurationSource(corsConfig()))
            .build();
    }
}`
      },
      {
        title: 'OAuth2 et OpenID Connect',
        desc: 'Sécurisation des microservices en tant que Resource Servers',
        content: `OAuth2/OIDC est le standard industriel pour la sécurité des microservices. Chaque microservice agit comme un Resource Server qui valide les tokens JWT sans appeler l'Authorization Server à chaque requête. L'intégration avec Keycloak (open-source) ou Okta/Auth0 (SaaS) permet de déléger la gestion des identités à un service spécialisé.`,
        details: [
          'Flux OAuth2 : Authorization Code (avec PKCE) pour les SPA, Client Credentials pour M2M',
          'OIDC : extension d\'OAuth2 avec id_token (JWT contenant l\'identité de l\'utilisateur)',
          'Keycloak : Realm, Clients, Roles, Mappers, événements et Webhooks',
          'Resource Server : validation du JWT sans appel réseau (auto-suffisant)',
          'Propagation du token : RestTemplate Interceptor, WebClient ExchangeFilterFunction'
        ],
        code: `// Resource Server — validation du JWT
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.company.com/realms/company-realm
          jwk-set-uri: https://auth.company.com/realms/company-realm/protocol/openid-connect/certs

// Propagation du token entre microservices
@Component
public class TokenRelayInterceptor implements WebClientCustomizer {

    @Override
    public void customize(WebClient.Builder builder) {
        builder.filter(ExchangeFilterFunction.ofRequestProcessor(
            request -> ReactiveSecurityContextHolder.getContext()
                .map(ctx -> {
                    var token = (JwtAuthenticationToken) ctx.getAuthentication();
                    return ClientRequest.from(request)
                        .header("Authorization", "Bearer " + token.getToken().getTokenValue())
                        .build();
                })
        ));
    }
}`
      },
      {
        title: 'Gestion des tokens JWT',
        desc: 'Validation, propagation et révocation',
        content: `Les JWT sont au cœur de la sécurisation des microservices. Ils contiennent les claims (rôles, permissions, informations utilisateur) et sont signés cryptographiquement. La gestion des clés de signature (JWKS), la validation des claims et la stratégie de révocation sont des préoccupations critiques pour la sécurité en production.`,
        details: [
          'Structure JWT : Header (alg, kid), Payload (sub, roles, exp, iss, aud), Signature',
          'JWKS (JSON Web Key Set) : rotation des clés de signature sans downtime',
          'Validation : signature, expiration (exp), issuer (iss), audience (aud), not before (nbf)',
          'Révocation : blacklist Redis + JWT ID (jti), ou short-lived tokens + refresh tokens',
          'Custom claims : ajouter les permissions métier dans le JWT pour l\'autorisation fine',
          'Sécurité : jamais de secrets dans le payload (le JWT est signé, pas chiffré par défaut)'
        ],
        code: `// Validation personnalisée des claims JWT
@Component
public class JwtValidator {

    public boolean validateToken(String token) {
        try {
            var decoder = NimbusJwtDecoder
                .withJwkSetUri("https://auth.company.com/.well-known/jwks.json")
                .build();
            var jwt = decoder.decode(token);

            // Vérifications supplémentaires
            return jwt.getIssuer().equals("https://auth.company.com")
                && jwt.getAudience().contains("commande-service")
                && !isRevoked(jwt.getId())
                && !jwt.getExpiresAt().isBefore(Instant.now());
        } catch (JwtException e) {
            log.warn("Token JWT invalide : {}", e.getMessage());
            return false;
        }
    }

    private boolean isRevoked(String jwtId) {
        return redisTemplate.opsForSet()
                .isMember("revoked-jwts", jwtId);
    }
}`
      }
    ],
    keyTakeaways: [
      'Spring Security est une chaîne de filtres : chaque filtre a un rôle précis et configurable',
      'OAuth2/OIDC est le standard microservices : déléguez l\'identité à Keycloak ou Okta',
      'Les JWT sont auto-suffisants pour la validation : pas d\'appel réseau à chaque requête',
      'La révocation des JWT nécessite une stratégie explicite : blacklist Redis ou short-lived tokens'
    ]
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Observabilité et Production-Readiness',
    subtitle: 'Focus DevOps',
    color: 'from-amber-600 to-orange-500',
    icon: '📊',
    summary: 'Rendre l\'application transparente pour les équipes d\'exploitation avec métriques, traces et logs.',
    sections: [
      {
        title: 'Spring Boot Actuator',
        desc: 'Exposer métriques de santé, d\'info et de configuration',
        content: `Actuator est le module de production-readiness de Spring Boot. Il expose des endpoints HTTP (/health, /info, /metrics, /env) qui permettent de monitorer et d'interagir avec l'application en production. La configuration fine de ces endpoints est cruciale pour ne pas exposer d'informations sensibles.`,
        details: [
          'Endpoints clés : /health (liveness + readiness), /info (build info, git commit), /metrics',
          'Sécurisation : actuator exposé sur un port séparé (management.server.port)',
          'Endpoints personnalisés : @Endpoint, @ReadOperation, @WriteOperation',
          'Health Indicators : personnalisés (DB, Redis, Kafka, services externes)',
          'InfoContributor : enrichir /info avec des métadonnées de build (Git, CI, version)',
          'Spring Boot 3+ : endpoint /actuator + CORS configurable séparément'
        ],
        code: `// Configuration Actuator
management:
  server:
    port: 9091  # Port séparé pour ne pas exposer au trafic public
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,env,circuitbreakers
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true  # Liveness & Readiness pour Kubernetes

// Health Indicator personnalisé
@Component
public class ExternalServiceHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        try {
            var response = restTemplate.exchange(
                "https://api.externe.com/health",
                HttpMethod.GET, null, String.class);
            return response.getStatusCode().is2xxSuccessful()
                ? Health.up().build()
                : Health.down().withDetail("status", response.getStatusCode()).build();
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}`
      },
      {
        title: 'Métriques avec Micrometer',
        desc: 'Standardisation et exposition Prometheus + Grafana',
        content: `Micrometer est le facade de métriques de Spring Boot. Il fournit une API uniforme pour instrumenter le code et expose les métriques au format Prometheus. Les dashboards Grafana permettent de visualiser en temps réel la santé et les performances du système (latence, throughput, taux d'erreur, saturation des threads).`,
        details: [
          'Micrometer API : Counter, Gauge, Timer, DistributionSummary, LongTaskTimer',
          'Tags : clés/valeurs pour dimensionner les métriques (service, endpoint, status)',
          'Métriques par défaut : JVM (heap, GC, threads), CPU, disk, HTTP requests, DB pool',
          'Custom metrics : @Timed, MeterRegistry custom pour les métriques métier',
          'Prometheus : exposition via /actuator/prometheus, pull model, recording rules',
          'Grafana : dashboards prêts à l\'emploi (Spring Boot Statistics, JVM Micrometer)'
        ],
        code: `// Métriques personnalisées avec Micrometer
@Service
public class CommandeMetricsService {

    private final Counter commandeCreeeCounter;
    private final Timer commandeProcessingTimer;

    public CommandeMetricsService(MeterRegistry registry) {
        this.commandeCreeeCounter = Counter.builder("commandes.crees")
            .description("Nombre total de commandes créées")
            .register(registry);
        this.commandeProcessingTimer = Timer.builder("commande.processing.time")
            .description("Temps de traitement des commandes")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(registry);
    }

    @Timed(value = "commande.traitement", percentiles = {0.5, 0.95, 0.99})
    public Commande creerCommande(CreateCommandeRequest request) {
        return commandeProcessingTimer.record(() -> {
            var commande = commandeRepository.save(request.toDomain());
            commandeCreeeCounter.increment();
            return commande;
        });
    }
}`
      },
      {
        title: 'Traçage Distribué',
        desc: 'OpenTelemetry, Zipkin et Jaeger',
        content: `Le traçage distribué permet de suivre une requête à travers tous les microservices qu'elle traverse. OpenTelemetry est le standard CNCF pour la collecte de traces. Chaque requête se voit attribuer un TraceID unique qui est propagé de service en service via les headers HTTP. Zipkin ou Jaeger visualisent ces traces pour identifier les goulots d'étranglement.`,
        details: [
          'OpenTelemetry : SDK, exporter, context propagation (W3C TraceContext)',
          'TraceID et SpanID : génération et propagation via les headers (traceparent)',
          'Spring Cloud Sleuth (legacy) vs Micrometer Tracing (Spring Boot 3+)',
          'Sampling : head-based (probabilistic), tail-based (pour les traces lentes/erreurs)',
          'Corrélations traces-métriques : exemplars (Prometheus) lient métriques et traces'
        ],
        code: `// Configuration Micrometer Tracing (Spring Boot 3+)
spring:
  application:
    name: commande-service
  tracing:
    sampling:
      probability: 0.1  # 10% des requêtes tracées
    propagation:
      type: w3c  # W3C TraceContext standard

// Propagation manuelle du contexte
@Service
public class CommandeService {

    private final Tracer tracer;
    private final WebClient webClient;

    public CommandeService(Tracer tracer, WebClient.Builder webBuilder) {
        this.tracer = tracer;
        this.webClient = webBuilder.build();
    }

    public void traiterCommande(Commande commande) {
        var span = tracer.spanBuilder("validation-stock")
            .setAttribute("commande.id", commande.id())
            .startSpan();
        try (var ignored = span.makeCurrent()) {
            webClient.get()
                .uri("http://stock-service/api/stock/" + commande.productId())
                .retrieve()
                .bodyToMono(StockResult.class)
                .block();
        } finally {
            span.end();
        }
    }
}`
      },
      {
        title: 'Gestion des Logs',
        desc: 'Logs structurés en JSON, corrélation avec les traces',
        content: `Les logs structurés au format JSON permettent une ingestion efficace par les systèmes de gestion de logs (ELK, Loki). En y ajoutant le TraceID, on peut corréler les logs d'une même requête à travers tous les services. Cela transforme les logs d'un simple outil de debug en une source de diagnostic transverse.`,
        details: [
          'Logback : configuration XML pour le format JSON (logstash-logback-encoder)',
          'MDC (Mapped Diagnostic Context) : enrichir les logs avec TraceID, userID, requestID',
          'ELK Stack : Elasticsearch (stockage + recherche), Logstash (parsing + ingestion), Kibana (visualisation)',
          'Grafana Loki : agrégation de logs cloud-native, promtail pour la collecte',
          'Structured logging : level, message, service.name, trace.id, span.id, user, duration'
        ],
        code: `<!-- logback-spring.xml -->
<configuration>
    <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <includeMdc>true</includeMdc>
            <customFields>{"service":"commande-service","environment":"\${ENV:-dev}"}</customFields>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="JSON"/>
    </root>
</configuration>

// Résultat dans Elasticsearch :
// {
//   "@timestamp": "2025-06-13T10:30:00.000Z",
//   "level": "ERROR",
//   "logger": "c.c.CommandeService",
//   "message": "Échec validation stock",
//   "trace.id": "abc123...",
//   "span.id": "def456...",
//   "commande.id": "CMD-2025-001"
// }`
      }
    ],
    keyTakeaways: [
      'Actuator est le tableau de bord de l\'application en production : endpoints sécurisés sur port dédié',
      'Micrometer standardise les métriques pour Prometheus : ajoutez des métriques métier avec des tags',
      'OpenTelemetry + Distributed Tracing = debug transverse des requêtes multi-services',
      'Logs structurés JSON + TraceID = corrélation parfaite dans ELK/Loki'
    ]
  },
  {
    id: 'module-6',
    number: 6,
    title: 'CI/CD, Conteneurisation et Déploiement',
    subtitle: 'Cloud & Kubernetes',
    color: 'from-sky-600 to-indigo-500',
    icon: '🚀',
    summary: 'Optimiser l\'application Spring Boot pour le cloud, Kubernetes et les architectures serverless.',
    sections: [
      {
        title: 'Optimisation des conteneurs',
        desc: 'Cloud Native Buildpacks vs Dockerfiles multi-stages',
        content: `L'optimisation des images Docker est cruciale pour réduire la taille, accélérer les déploiements et améliorer la sécurité. Les Cloud Native Buildpacks (CNB) génèrent automatiquement une image optimisée sans Dockerfile, tandis que les Dockerfiles multi-stages offrent un contrôle total sur chaque couche. Les Layered Jars de Spring Boot exploitent le cache Docker pour des builds plus rapides.`,
        details: [
          'Cloud Native Buildpacks : pack build, spring-boot-maven-plugin:build-image, pas de Dockerfile',
          'Dockerfile multi-stage : JDK slim pour builder, JRE distroless pour runtime',
          'Layered Jars : spring-boot-jarmode-layertools, 4 couches (dependencies, snapshot, resources, application)',
          'Optimisation cache Docker : dépendances dans une couche stable, application dans une couche volatile',
          'Distroless : images sans OS (gVisor, Google distroless) pour réduire la surface d\'attaque',
          'Comparaison : Buildpacks (automatique) vs Dockerfile (contrôle) — quel choix pour quelle équipe ?'
        ],
        code: `// Layered Jar — configuration dans pom.xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <layers>
            <enabled>true</enabled>
        </layers>
    </configuration>
</plugin>

# Dockerfile multi-stage optimisé
FROM eclipse-temurin:21-jre-alpine AS builder
WORKDIR /app
COPY target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/resources/ ./
COPY --from=builder /app/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]`
      },
      {
        title: 'Spring Boot sur Kubernetes',
        desc: 'Probes, Configuration, Graceful Shutdown',
        content: `Kubernetes est la plateforme d'orchestration de référence pour les microservices Spring Boot. La configuration des Liveness et Readiness Probes via Actuator permet à K8s de gérer le cycle de vie des pods (démarrage, arrêt, redémarrage). L'externalisation de la configuration via ConfigMaps et Secrets sépare le code de la configuration.`,
        details: [
          'Liveness Probe : /actuator/health/liveness — le pod doit-il être redémarré ?',
          'Readiness Probe : /actuator/health/readiness — le pod peut-il recevoir du trafic ?',
          'Startup Probe : pour les applications lentes à démarrer (évite les redémarrages en boucle)',
          'ConfigMap : configuration non-sensible (propriétés partagées, profiles)',
          'Secret : configuration sensible (passwords, API keys, certificats) en base64 + chiffrement',
          'Graceful Shutdown : server.shutdown=graceful + spring.lifecycle.timeout-per-shutdown-phase'
        ],
        code: `# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: commande-service
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: commande-service
          image: registry.company.com/commande-service:1.0.0
          ports:
            - containerPort: 8080
            - containerPort: 9091  # Actuator
          envFrom:
            - configMapRef:
                name: commande-service-config
            - secretRef:
                name: commande-service-secrets
          startupProbe:
            httpGet: { path: /actuator/health/liveness, port: 9091 }
            initialDelaySeconds: 10
            periodSeconds: 5
            failureThreshold: 30
          livenessProbe:
            httpGet: { path: /actuator/health/liveness, port: 9091 }
            periodSeconds: 10
          readinessProbe:
            httpGet: { path: /actuator/health/readiness, port: 9091 }
            periodSeconds: 5`
      },
      {
        title: 'La révolution GraalVM (Spring Native)',
        desc: 'Compilation AOT, avantages pour Serverless et K8s',
        content: `GraalVM Native Image compile l'application Spring Boot en un exécutable natif via la compilation Ahead-Of-Time (AOT). Le résultat : un démarrage instantané (quelques millisecondes), une empreinte mémoire réduite (10-20 Mo vs 200+ Mo pour la JVM), idéal pour le Serverless (AWS Lambda, Knative) et les environnements Kubernetes où chaque milliseconde et chaque Mo compte.`,
        details: [
          'AOT (Ahead-Of-Time) : compilation statique, élimination du bytecode interprété',
          'Avantages : démarrage < 100ms, RAM < 50MB, image binaire unique (pas de JRE requis)',
          'Contraintes : pas de réflexion dynamique, pas de CGLIB proxies, pas de serialization Java native',
          'Spring Native / Spring Boot 3 AOT : hints pour la réflexion, ressources, proxys',
          'Cas d\'usage : Serverless (AWS Lambda, Azure Functions), sidecars, scale-to-zero K8s',
          'Alternatives : CRaC (Coordinated Restore at Checkpoint) pour JVM standard checkpoint/restore'
        ],
        code: `// GraalVM Native — configuration Maven
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
    <configuration>
        <buildArgs>
            <arg>-H:ReflectionConfigurationFiles=reflect-config.json</arg>
            <arg>--enable-https</arg>
            <arg>--initialize-at-build-time=</arg>
        </buildArgs>
    </configuration>
</plugin>

// Hints pour la réflexion (Spring Boot 3 AOT)
@RegisterReflectionForBinding({ Commande.class, Facture.class })
public class ReflectionConfig {}

// Build commande
// mvn -Pnative native:compile
// ./target/commande-service  (binaire natif, ~50MB)
// Démarrage en 50ms au lieu de 3s !`
      }
    ],
    keyTakeaways: [
      'Buildpacks pour la simplicité, Dockerfile multi-stage pour le contrôle : choisissez selon votre maturité',
      'Les probes Kubernetes transforment Actuator en boucle de rétroaction pour l\'orchestrateur',
      'ConfigMap/Secret externalisent la configuration : le même artifact se déploie partout',
      'GraalVM Native est le futur du Serverless : démarrage instantané, mémoire minimale'
    ]
  }
];

window.SB = window.SB || {};
window.SB.MODULES = MODULES;
