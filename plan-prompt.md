## Plan: Ballerup Bridge PWA MVP med flere tilmeldingstyper

Vi bygger en dansk-first, i18n-klar, hurtig og responsiv PWA som én Next.js-applikation med separate route groups for admin og brugerflade, PostgreSQL via Prisma ORM, rollebaseret adgang (Admin, Club admin, Player), og Render-klar deployment. MVP udvides med turneringstyper for par (default), hold (min. 4 spillere) og enkeltmand, krav om navn + medlemsnummer på alle spillere, samt mulighed for gæstetilmelding uden login (med e-mail), styret per turnering i admin.

**Steps**
1. Phase 1 - Foundation and Architecture
1. Etabler projektstruktur som monolitisk full-stack Next.js app (TypeScript, App Router, route groups) med separat admin- og brugerflow i samme kodebase: /(public), /(app), /(admin).
2. Frontend UI bygges med Bootstrap 5 som primært design- og komponentframework (grid, forms, nav, modals, utility classes) for hurtig, konsistent og responsiv udvikling.
3. Definer kvalitetsfundament: strict TypeScript, ESLint + Prettier, import boundaries, navngivningskonventioner, og dokumentationsstandard for docblocks (kun ved ikke-triviel domænelogik).
4. Opsæt i18n-arkitektur med dansk som default locale og feature-opdelte oversættelsesnøgler, så ekstra sprog senere kan tilføjes uden refaktorering.
5. Opsæt PWA-baseline: web manifest, service worker strategi (app shell + statiske assets + kritiske læse-caches), installability og performance budget for mobil.

2. Phase 2 - Identity, RBAC, and Domain Model (depends on Phase 1)
1. Implementer auth med kombineret lokal login + OAuth via Auth.js, inkl. sikre sessioner, password hashing, account linking og role claims.
2. Design Prisma schema med centrale entiteter:
3. User, Account/Session/VerificationToken, Club (self-reference parentId), ClubAdminAssignment, Tournament, Registration, RegistrationParticipant, AuditEvent.
4. Udvid Tournament med domænefelter:
5. registrationMode (PAIR default, TEAM, SINGLE), allowGuestSignup (boolean), maxEntries, waitlistEnabled, signupDeadline, status, teamMinPlayers og teamMaxPlayers (kun relevante ved TEAM).
6. Udvid Registration med rollerelateret oprindelse:
7. registrantType (AUTHENTICATED_USER eller GUEST), registrantEmail (påkrævet for guest), createdByUserId (nullable for guest), teamName (påkrævet ved TEAM), og status (CONFIRMED/WAITLIST/CANCELLED).
8. Indfør RegistrationParticipant som obligatorisk spillerliste med validations:
9. Hver deltager skal have fullName + memberNumber (numerisk validering i MVP).
10. PAIR kræver præcis 2 deltagere.
11. TEAM kræver minimum 4 deltagere og skal ligge inden for turneringens teamMinPlayers/teamMaxPlayers.
12. SINGLE kræver præcis 1 deltager.
13. TEAM kræver markeret kontaktperson blandt deltagerne (obligatorisk).
14. Håndter RBAC-regler:
15. Admin kan oprette alle clubs og har implicit club-admin adgang på tværs.
16. Club admin kan administrere tildelte clubs samt sub-clubs.
17. Player kan oprette/redigere egne registreringer.
18. Guest kan oprette registrering uden login kun hvis allowGuestSignup=true for turneringen; guest-redigering styres via permanent redigeringslink.

3. Phase 3 - Admin Interface (depends on Phase 2)
1. Byg admin dashboard med navigation for Clubs, Sub clubs, Tournaments, Registrations, Exports.
2. Clubs-modul: Admin kan oprette/redigere clubs; Club admin kan oprette/redigere sub clubs under egne clubs.
3. Tournament-modul:
4. Opret/rediger turnering med felter for dato, sted, max entries, pris, note, signup-frist, status.
5. Vælg registrationMode (PAIR/TEAM/SINGLE) med PAIR som default.
6. Ved TEAM skal admin kunne definere teamMinPlayers og teamMaxPlayers (med minimum 4 og teamMaxPlayers >= teamMinPlayers).
7. Toggle allowGuestSignup per turnering.
8. Registration management:
9. Liste over registreringer med deltagere (navn + medlemsnr), status og registrant-type (bruger/gæst).
10. Manuel flytning mellem confirmed/waitlist, annullering, søgning/filtrering.
11. Eksport MVP: CSV med semikolon delimiter.
12. CSV-filen indeholder ingen headerlinje.
13. TEAM-format: Holdnavn;medlemsnummer1;medlemsnummer2;medlemsnummer3;medlemsnummer4;... (fortsætter efter antal spillere op til teamMaxPlayers).
14. PAIR-format: medlemsnummer1;medlemsnummer2.
15. SINGLE-format: ét medlemsnummer pr. linje.

4. Phase 4 - Player and Guest Interface (parallel with parts of Phase 3 after shared APIs exist)
1. Byg frontendflow for browsing af åbne turneringer filtreret per club/sub club.
2. Implementer UI med Bootstrap-komponenter og responsivt grid (mobile first), så admin- og spillerflade får ensartet adfaerd og lav vedligeholdelsesomkostning.
3. Dynamiske tilmeldingsformularer baseret på registrationMode:
4. PAIR-form med 2 spillere.
5. TEAM-form med obligatorisk holdnavn og spillerantal inden for teamMinPlayers/teamMaxPlayers, inkl. obligatorisk markering af kontaktperson.
6. SINGLE-form med 1 spiller.
7. Valider altid fullName + memberNumber for hver deltager.
8. Authenticated player kan oprette/redigere egne registreringer.
9. Guest-flow uden login:
10. Hvis allowGuestSignup=true vises gæstetilmelding med obligatorisk e-mail.
11. Efter oprettelse sendes permanent redigeringslink via e-mail til guest for ændring/afmelding.
12. Venteliste-logik anvendes ens for bruger- og gæsteregistreringer ved kapacitetsgrænse.

5. Phase 5 - Notifications, Privacy, and UX Quality (depends on Phases 3-4)
1. Implementer e-mail kvitteringer ved oprettelse, ændring og afmelding for både brugere og guests.
2. Implementer basis privatlivstekst og databehandlingsoplysninger i UI (MVP-niveau).
3. Sikr responsivt design og performance-optimering (mobil først, lazy loading, optimerede queries, cache headers).

6. Phase 6 - Render Readiness and Operational Hardening (depends on all prior phases)
1. Klargør Render deployment med web service + managed PostgreSQL, miljøvariabler, migrations ved deploy og health checks.
2. Opsæt CI til typecheck, lint, tests og build.
3. Definer seed-data for lokal udvikling med eksempler på PAIR/TEAM/SINGLE turneringer.
4. Tilføj observability baseline: struktureret logging, fejlsporing hooks og audit events for adminkritiske handlinger.

7. Phase 7 - Post-MVP Medlemsopslag Integration (planned later)
1. Integrer ekstern API-validering af medlemsnumre med robust timeout/retry, rate limiting og fallback-håndtering.
2. Implementer "hent navn fra medlemsnummer" i tilmeldingsflow med tydelig brugerfeedback ved mismatch eller manglende hit.
3. Implementer autocomplete baseret på medlemslister fra Dansk Bridgeforbund i admin- og brugerrelevante formularer.
4. Indfør synkroniseringsstrategi for medlemsdata (cache + opdateringsjob), så UI forbliver hurtigt ved høj trafik.
5. Tilføj feature flag, så integrationen kan aktiveres gradvist uden at påvirke MVP-stabilitet.

**Relevant files**
- /workspaces/bbc-tournament-signup/README.md - Opdateres med arkitektur, domæneregler for tilmeldingstyper, gæsteflow, miljøvariabler, migrations og Render deployment.

**Verification**
1. Statisk kvalitet: typecheck, lint og formatter-check i CI og lokalt.
2. Datavalidering: migrations apply/reset/seed fungerer deterministisk på lokal Postgres og Render Postgres.
3. Domænetests for registrationMode-regler:
4. PAIR afviser alt andet end 2 deltagere.
5. TEAM afviser færre end 4 deltagere.
6. SINGLE afviser alt andet end 1 deltager.
7. TEAM kræver ikke-tomt holdnavn.
8. TEAM afviser registreringer uden for teamMinPlayers/teamMaxPlayers.
9. Alle modes kræver fullName + numerisk memberNumber per deltager.
10. CSV-tests: eksport bruger semikolon delimiter og korrekt format pr. registrationMode (TEAM/PAIR/SINGLE).
11. CSV-tests: eksport indeholder ingen headerlinje.
12. Guest-tests:
13. Gæstetilmelding blokeres når allowGuestSignup=false.
14. Gæstetilmelding kræver e-mail når allowGuestSignup=true.
15. Guest-redigering kræver gyldigt permanent redigeringslink.
16. Auth/RBAC tests: Admin global adgang, Club admin scoped adgang inkl. sub clubs, Player kun egne registreringer.
17. E2E tests: oprettelse af turnering med mode + guest flag, signup som spiller, signup som guest, venteliste-overgang, admin-håndtering af registrering.
18. UI checks: Bootstrap-baserede sider valideres for responsiv adfaerd pa mobil/tablet/desktop og konsistent komponentbrug.
19. PWA checks: Lighthouse mobilscore, installability, offline baseline og manifest/service worker verifikation.
20. Deployment checks: preview + production deploy på Render, health endpoint, migration-run og rollback-procedure valideret.

**Decisions**
- Inkluderet i MVP: login + RBAC, clubs/sub clubs, tournament CRUD, spiller- og gæstetilmeldinger, venteliste, e-mail kvitteringer, CSV eksport.
- Auth: kombination af lokal konto og OAuth.
- UI-sprog: dansk i MVP med i18n-arkitektur klar til ekstra sprog senere.
- App-opdeling: én Next.js app med separate route groups.
- Frontend bygges med Bootstrap 5 som UI-framework.
- Databeskyttelse: basis privatlivstekst i MVP; avancerede GDPR-workflows er uden for MVP.
- Turneringsdomæne: fokus på tilmelding (ikke parringer/resultatmotor).
- Tilmeldingstyper: PAIR default, TEAM (min. 4), SINGLE.
- Ved TEAM er holdnavn obligatorisk.
- Ved TEAM konfigureres teamMinPlayers og teamMaxPlayers i turnerings-CRUD.
- TEAM kræver obligatorisk kontaktperson.
- Medlemsnummer valideres numerisk i MVP.
- Gæsteadgang: tillades per turnering via allowGuestSignup.
- Guest-redigering sker via permanent redigeringslink sendt på e-mail.
- CSV-eksport bruger semikolon delimiter med mode-specifikt format for TEAM/PAIR/SINGLE.
- CSV-eksport er uden headers (ingen kolonnenavne i filen).
- Ekstern medlemsvalidering, navn-opslag fra medlemsnummer og autocomplete mod Dansk Bridgeforbund planlægges til post-MVP fase.

**Further Considerations**
1. OAuth-providers: vælg hvilke der er i scope i MVP (fx Google alene eller Google + Microsoft).
2. API-kontrakt med Dansk Bridgeforbund: afklar autentifikation, rate limits, SLA og tilladte opslagstyper.
3. Misspelling/fejltastninger i brugerinput: beslut om vi vil have simpel klient-side normalisering (trim/case) i MVP.
