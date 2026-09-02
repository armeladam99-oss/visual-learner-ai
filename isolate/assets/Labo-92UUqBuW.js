import{j as e,m as L,A as Q}from"./framer-motion-BvaNpmMv.js";import{r as w}from"./react-vendor-JCQNFPHa.js";import{C as I,b as $,d as O,a as V}from"./card-CygWrJ1m.js";import{B as D}from"./badge-oDXke36r.js";import{B as G}from"./button-BQav3u3K.js";import{A as H,T as X,S as Y,a as R}from"./textarea-BK7rGWAr.js";import{c as z,a as K,b as Z,F as W,L as F}from"./index-jEux9jD8.js";import{B as ee}from"./brain-qaCJKIH7.js";import"./charts-MayRO--o.js";import"./radix-ui-uSompVeq.js";const se=[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],te=z("camera",se);const ne=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],ie=z("zap",ne),J={limites:{keywords:["limite","limites","continuité","tend vers"],response:`**Les limites** décrivent le comportement d'une fonction quand x tend vers une valeur.

**Définition intuitive :**
La limite de f(x) quand x → a est ℓ si f(x) se rapproche de ℓ quand x se rapproche de a.

**Notation :** lim(x→a) f(x) = ℓ

**Limites usuelles :**
• lim(x→0) sin(x)/x = 1
• lim(x→+∞) e^x = +∞
• lim(x→+∞) 1/x = 0
• lim(x→0) ln(x) = −∞

**Règles :**
• lim(f + g) = lim f + lim g
• lim(f × g) = lim f × lim g
• lim(f/g) = lim f / lim g

**Indéterminations :** 0/0, ∞/∞, 0×∞, ∞−∞`,experiment:"fonction",suggestions:["Montre-moi une fonction logarithme","Explique-moi la continuité","Résous un exercice"]},derivation:{keywords:["dérivée","derivée","dérivation","pente","tangente","variation","extremum"],response:`**La dérivée** d'une fonction en un point est la pente de la tangente.

**Définition :**
f'(x₀) = lim(h→0) [f(x₀+h) − f(x₀)] / h

**Interprétation :**
• f'(x) > 0 → croissante
• f'(x) < 0 → décroissante
• f'(x) = 0 → extremum

**Formules essentielles :**
• (xⁿ)' = n·xⁿ⁻¹
• (eˣ)' = eˣ
• (ln x)' = 1/x
• (sin x)' = cos x
• (u×v)' = u'×v + u×v'`,experiment:"fonction",suggestions:["Montre-moi une parabole avec sa dérivée","Résous un exercice"]},suite:{keywords:["suite","suites","suites numériques","convergence"],response:`**Une suite numérique** est une application de ℕ dans ℝ.

**Modes de génération :**
• Explicite : uₙ = f(n)
• Récurrence : uₙ₊₁ = f(uₙ)

**Suites usuelles :**
• Arithmétique : uₙ = u₀ + n×r
• Géométrique : uₙ = u₀×qⁿ

**Convergence :**
• Arithmétique : ⟺ r = 0
• Géométrique : ⟺ |q| < 1

**Théorème des gendarmes :**
Si aₙ ≤ uₙ ≤ bₙ et lim aₙ = lim bₙ = ℓ, alors lim uₙ = ℓ.`,suggestions:["Montre-moi une suite arithmétique","Montre-moi une suite géométrique"]},circuit_rc:{keywords:["circuit rc","condensateur","charge","décharge","constante de temps"],response:`**Circuit RC** = Résistance + Condensateur en série.

**Constante de temps :** τ = R × C

**Charge :** Uc(t) = U₀(1 − e^(−t/τ))
**Décharge :** Uc(t) = U₀ × e^(−t/τ)

**Points clés :**
• t = τ : 63% chargé
• t = 3τ : 95%
• t = 5τ : 99%`,experiment:"circuit",suggestions:["Lance la simulation circuit RC","Que se passe-t-il si on double R ?"]},projectile:{keywords:["projectile","mouvement","parabolique","chute libre","trajectoire"],response:`**Mouvement parabolique :**
• Horizontal : x(t) = v₀·cos(θ)·t
• Vertical : y(t) = v₀·sin(θ)·t − ½gt²

**Portée :** R = v₀²·sin(2θ)/g
**Hauteur max :** H = v₀²·sin²(θ)/(2g)
**Angle optimal :** θ = 45°`,experiment:"projectile",suggestions:["Lance la simulation projectile","Pourquoi 45° est optimal ?"]},ondes:{keywords:["onde","ondes","fréquence","longueur d'onde","propagation"],response:`**Onde :** transporte de l'énergie sans matière.

**v = λ × f**

**Types :**
• Mécaniques : son, vagues
• EM : lumière, radio

**Phénomènes :** réflexion, réfraction, diffraction, interférence.`,experiment:"onde",suggestions:["Lance la simulation onde","Différence son/lumière ?"]},dosage:{keywords:["dosage","ph","acide","base","acido-basique","titrage","équivalence"],response:`**Dosage acido-basique :**
• pH = −log[H₃O⁺]
• Point d'équivalence : n_acide = n_base
• Formule : C₁V₁ = C₂V₂

**Acide fort + Base forte → pH = 7**
**Acide faible + Base forte → pH > 7**`,experiment:"dosage",suggestions:["Lance la simulation dosage","Acide fort vs faible ?"]},moleculaire:{keywords:["molécule","molécules","liaison","structure","atome","composé"],response:`**Liaisons chimiques :**
• Ionique : transfert e⁻ (NaCl)
• Covalente : partage e⁻ (H₂O)
• Métallique : bain d'e⁻ (Fe)

**Géométrie :**
• Linéaire : CO₂ (180°)
• Coudée : H₂O (104,5°)
• Tétrédrique : CH₄ (109,5°)`,suggestions:["Montre-moi des molécules en 3D","Ionique vs covalente ?"]}},oe=[{keywords:["salut","bonjour","bonsoir","coucou","hey","hello","ça va","ca va","comment ça va","comment vas-tu","ça roule","wesh","yo"],response:`Salut ! 😊 Comment ça va ?

Je suis ton assistant, et je suis aussi là pour discuter de tout ce que tu veux. Tu veux qu'on parle de quelque chose en particulier ?`},{keywords:["minecraft","jeux","jeu","gaming","playstation","xbox","nintendo","fortnite","valorant","lol","league of legends","fifa","rocket league"],response:`Minecraft ! 🎮 Un classique !

Le jeu de construction et de survie par Mojang. Tu peux construire des maisons, explorer des cavernes, affronter des monstres...

Et savais-tu que Minecraft utilise des algorithmes de **génération procédurale** pour créer les mondes ? C'est un peu comme des maths appliquées au divertissement ! 🧮

Tu veux qu'on parle d'autre chose, ou tu as une question ?`},{keywords:["musique","chanson","concert","spotify","rap","pop","rock","drill","afro","melanie","booba","damso","navy","gazo"],response:`La musique, c'est super ! 🎵

Tu écoutes quoi en ce moment ? Moi je trouve ça fascinant comment les ondes sonores créent de la musique — c'est de la physique pure ! Les fréquences, les harmoniques, le rythme...

Si tu veux, je peux t'expliquer la physique du son, ou on peut juste discuter de musique. Comme tu veux ! 😊`},{keywords:["film","films","série","séries","netflix","disney","anime","naruto","one piece","jujutsu","demon slayer"],response:`Ah les séries et films ! 🎬

Tu regardes quoi en ce moment ? Les animes c'est pas mal aussi — il y a beaucoup de science dedans si tu y prêtes attention !

Tu veux continuer à discuter ou tu as un cours à réviser ?`},{keywords:["sport","football","basketball","basket","f1","formula 1","mma","boxe","tennis","atletico","real madrid","barcelona","psg","inter","juventus"],response:`Le sport ! ⚽🏀

C'est un domaine où la physique est très présente — les trajectoires, la vitesse, l'énergie cinétique...

Tu suis quel sport ? Et si tu veux, je peux t'expliquer la physique derrière un tir au but, un dunk, ou un virage en F1 ! 😊`},{keywords:["techno","technologie","tech","iphone","samsung","ai","intelligence artificielle","robot","spacex","tesla","google"],response:`La technologie, c'est passionnant ! 🚀

Tu t'intéresses à quoi ? L'IA, la space, les phones, les voitures électriques ?

C'est marrant parce que derrière toute la tech, il y a des maths et de la physique — des circuits, des algorithmes, des ondes électromagnétiques...

Tu veux qu'on parle tech ou tu as une question ?`},{keywords:["voyage","voyager","pays","maroc","france","dubai","japon","travel"],response:`Les voyages, c'est génial ! ✈️🌍

Tu veux aller où ? Le Maroc a des trucs incroyables — l'Atlas, le Sahara, les riads de Fès...

Et savais-tu que la navigation utilise des calculs mathématiques complexes ? Les coordonnées GPS, les fuseaux horaires...

On continue à discuter ou tu veux réviser ?`},{keywords:["humour","blague","drôle","rire","meme","mème"],response:`Tu veux une blague ? 😄

Pourquoi les maths sont tristes ?
Parce qu'elles ont trop de problèmes ! 😂

Bon, sur ce, tu veux qu'on passe à un sujet plus sérieux ou on continue à rigoler ?`},{keywords:["merci","thanks","super","génial","bravo","parfait","excellent"],response:`Merci à toi ! 😊

N'hésite pas si tu as d'autres questions, que ce soit de cours ou autre chose. Je suis là ! 💪`},{keywords:["ok","d'accord","d'acc","ok merci","c'est bon","compris","c'est clair","noté","oui","ouais"],response:`Parfait ! 😊

N'hésite pas si tu as besoin de quoi que ce soit — cours, exercice, ou juste discuter. Je suis là ! 💪`},{keywords:["non","nan","non merci","c'est tout","rien","pas maintenant"],response:`Pas de souci ! 😊

Je reste là si tu changes d'avis. On peut discuter de tout, pas juste de cours ! 💬`},{keywords:["qui es-tu","qui es tu","t'es qui","tu es qui","présentation","présente-toi","c'est quoi ton nom","comment tu t'appelles","ton nom"],response:`Je suis ton **assistant IA** ! 🧪

Mon rôle est de t'aider dans tes révisions, t'expliquer les cours, te montrer des expériences, et répondre à tes questions — que ce soit scolaires ou non !

Je connais les cours de 2e BAC marocain en maths, physique et chimie. Mais je peux aussi discuter de musique, de jeux, de films... de tout ce que tu veux ! 😊`},{keywords:["âge","age","t'es vieux","t'es jeune","tu es un humain","t'es un robot","es-tu un robot","t'es une ia","t'es une intelligence","tu es une ia","es tu humain","tu es humain"],response:`Je suis une intelligence artificielle ! 🤖

Je ne suis pas humain, mais je suis là pour t'aider du mieux possible. Je peux te parler de n'importe quoi — cours, sport, musique, technologie...

Et si tu as besoin d'aide pour réviser, je suis ton meilleur allié ! 💪`},{keywords:["dormir","fatigué","fatigue","coupé","las","je suis crevé","fatigant","ennuyeux","ennui","chiant","saoule","marre","lourd"],response:`Je comprends, ça arrive d'être fatigué ou ennuyé ! 😅

Tu veux qu'on fasse quelque chose de plus interactif ? Je peux te monter une simulation dans le labo, ou on peut discuter de quelque chose qui t'intéresse vraiment.

Sinon, prends une pause — réviser c'est important mais le repos aussi ! 💤`},{keywords:["j'ai faim","manger","nourriture","repas","faim","pizza","couscous","tajine","kefta"],response:`La faim, c'est un sérieux sujet ! 🍕😋

Tu veux manger quoi ? Le Maroc a des plats incroyables — le couscous, le tajine, les brochettes...

Bon, je ne peux pas te cuisiner, mais je peux te distraire pendant que tu attends ! Tu veux qu'on discute ou tu veux réviser pendant que ça cuit ? 😄`},{keywords:["ami","amis","copain","copine","pote","meilleur ami","relation","amour","amoureuse","crush"],response:`Les relations, c'est un sujet important ! 😊

C'est bien d'avoir des amis et des gens autour de soi. Les amitiés du lycée sont souvent celles qu'on retient le plus !

Tu veux en parler, ou tu préfères qu'on fasse autre chose ? 💬`},{keywords:["bref","bon","quoi d'autre","sinon","et toi","parle moi","discute","raconte"],response:`Allez, on discute ! 😊

Dis-moi, qu'est-ce qui te passe par la tête ? On peut parler de n'importe quoi — ton jour, la vie, des projets, des trucs rigolos... 🎯`},{keywords:["pourquoi","comment","quest-ce que","c'est quoi","ça veut dire","définition"],response:`Bonne question ! 🤔

Dis-moi exactement de quoi tu parles, et je t'explique clairement. Tu peux me poser des questions sur n'importe quoi — cours ou pas cours !`},{keywords:["non merci","pas envie","j'en ai marre","laisse tomber","oublie","stop","arrête"],response:`Pas de souci, j'arrête ! 😊

Tu me diras quand tu voudras reprendre. Je suis toujours là. 💬`}],ae=[{patterns:[/^(ah|ah ok|ah ouais|ah oui|oh|oho|waw|wow|waouh|pff|ptdr|mdr|haha|lol|gg|bg|cool|magnifique|incroyable|dingue|ouf|folie)$/i],responses:["Haha 😄 On continue sur la lancée ou tu veux autre chose ?","Ah ouais ? 😊 Dis-moi plus, je suis curieux !","😅 En tout cas je suis là si tu as besoin de quoi que ce soit.","😄 Toujours là pour toi ! Tu veux qu'on fasse quoi ?"]},{patterns:[/^(attends|att|patiente|wait|sec)$/i],responses:["Je suis là, prends ton temps ! 👍","Pas de rush, je t'attends. 😊","Prends le temps qu'il te faut ! 💪"]},{patterns:[/^(oui|ouais|yep|yes|si|exact|exactement|c'est ça|bien sûr|je veux|je vais)$/i],responses:["Top ! 👍 Dis-moi ce que tu veux faire.","Parfait, dis-moi la suite ! 😊","OK ! Qu'est-ce que tu veux qu'on fasse maintenant ? 💪"]},{patterns:[/^(non|nan|nah|nope|pas du tout|jamais)$/i],responses:["Pas de souci ! 😊 On fait quoi d'autre alors ?","D'accord, tu me diras ! 💬","OK, je reste là si tu changes d'avis ! 😊"]},{patterns:[/^(test|cc|slm|salam|alaikoum|aslema|ahlan|bzef|jihan|mzyan|zwina)$/i],responses:["Wa 3alikoum salam ! 😊 Comment je peux t'aider ?","Salam ! 👋 Tout va bien ? Dis-moi comment je peux t'aider.","Hey ! 😊 Je suis là, dis-moi ce que tu veux."]},{patterns:[/^(lol|mdr|ptdr|ahaha|hahaha|jaja|💀|😂|🤣)$/i],responses:["Haha 😄 Tu es de bonne humeur ! Continue, dis-moi ce que tu veux faire.","MDR 😂 Tu es trop marrant ! On fait quoi maintenant ?","😂👍 Je suis là si tu as besoin de quoi que ce soit."]}];function re(o){const i=o.toLowerCase();return/[\u0600-\u06FF]/.test(o)?"ar":["kif","shno","chno","bghit","bgha","3lach","kayn","mashi","daba","safi","wakil","l3robi"].some(a=>i.includes(a))?"darija":/^(what|how|why|when|where|show|explain|help)/.test(i)?"en":"fr"}function le(o){const i=o.toLowerCase();if(i.includes("circuit")||i.includes("condensateur")||i.includes("décharge"))return"circuit";if(i.includes("dosage")||i.includes("ph")||i.includes("titrage"))return"dosage";if(i.includes("fonction")||i.includes("graphique")||i.includes("courbe")||i.includes("parabole")||i.includes("quadratique")||i.includes("sinus")||i.includes("exponentielle")||i.includes("logarithme"))return"fonction";if(i.includes("onde")||i.includes("propagation")||i.includes("fréquence"))return"onde";if(i.includes("pendule")||i.includes("oscillation")||i.includes("ressort"))return"oscillation";if(i.includes("molécule")||i.includes("molecule")||i.includes("structure"))return"molecule"}function ue(o){const i=o.toLowerCase().trim();return i.split(/\s+/).length<=3||i.replace(/[\p{Emoji}\p{Emoji_Component}]/gu,"").trim().length<5}function ce(o,i){const p=o.trim(),a=p.toLowerCase(),y=re(p);if(i.currentExercise&&i.learningMode==="help"){const r=i.hintStep,t=i.currentExercise;if(a.includes("indice")||a.includes("hint")||a.includes("aide")){const n=["💡 Indice 1 : Regarde les données de l'exercice. Qu'est-ce qui te est donné ?","💡 Indice 2 : Quelle formule pourrait s'appliquer ici ?","💡 Indice 3 : Essaie de remplacer les valeurs dans la formule.",`✅ Voici la solution complète :

${t.steps.map(u=>`**Étape ${u.number} — ${u.label} :** ${u.content}`).join(`

`)}

**Résultat :** ${t.finalAnswer}`];if(r<n.length)return i.hintStep++,{response:n[r],experiment:void 0,hints:n.slice(r+1).map((u,b)=>b===0?"➡️ Étape suivante":"✅ Voir la solution"),suggestions:["Je comprends maintenant","Donne-moi un autre indice","Voir la solution complète"],mode:"exercise"}}if((a.includes("comprends")||a.includes("suivant"))&&(i.hintStep++,i.hintStep<4))return{response:["💡 Indice 1 : Regarde les données de l'exercice.","💡 Indice 2 : Quelle formule pourrait s'appliquer ?","💡 Indice 3 : Essaie de remplacer les valeurs.","✅ Solution complète"][Math.min(i.hintStep,3)],experiment:void 0,hints:[],suggestions:["Donne-moi un autre indice","Je veux la solution"],mode:"exercise"}}const g=le(p);let x=null,c=0;for(const[r,t]of Object.entries(J)){let n=0;for(const u of t.keywords)a.includes(u)&&(n+=u.length);n>c&&(c=n,x=r)}if(a.includes("pas compris")||a.includes("reformule")||a.includes("autrement")){const r=[`Je vais t'expliquer autrement :

`,`Pas de souci, voici une autre approche :

`,`Compris, je reformule plus simplement :

`];return{response:`${r[Math.floor(Math.random()*r.length)]}En termes simples, cette notion décrit le comportement d'une grandeur quand une variable évolue.

Essaie de me poser une question plus précise, et je t'expliquerai étape par étape. 💪`,experiment:void 0,hints:[],suggestions:["Explique-moi avec un exemple","Montre-moi un graphique","Donne-moi un exercice"],mode:"education"}}if(a.includes("exemple")||a.includes("exercice"))return{response:`**Exercice d'entraînement** 📝

Soit f(x) = 2x² − 8x + 6

1. Calculer Δ
2. Trouver les racines
3. Déterminer le sommet de la parabole
4. Étudier le signe de f(x)

**Données :** a = 2, b = −8, c = 6

Tu veux que je t'aide ou que je te donne la solution ?`,experiment:g,hints:["Commence par calculer le discriminant","Δ = b² − 4ac","Ensuite, applique la formule des racines"],suggestions:["Aide-moi (mode indices)","Donne-moi la solution complète","Montre-moi le graphique"],mode:"exercise"};if(x&&c>0){const r=J[x];return{response:r.response,experiment:g||r.experiment||void 0,hints:r.suggestions||[],suggestions:r.suggestions||[],mode:g?"lab":"education"}}if(c===0&&!g){for(const r of oe)if(r.keywords.some(t=>a.includes(t)))return{response:r.response,experiment:void 0,hints:[],suggestions:[],mode:"general"}}if(ue(p)&&c===0&&!g){for(const t of ae)if(t.patterns.some(n=>n.test(a)))return{response:t.responses[Math.floor(Math.random()*t.responses.length)],experiment:void 0,hints:[],suggestions:["Explique-moi les limites","Montre-moi un circuit RC","Dis-moi une blague"],mode:"general"};const r=[`Hmm, "${p}" 😄

Dis-moi plus et je te réponds ! On peut parler de tout — cours, sport, musique, ou n'importe quoi d'autre.`,`"${p}" — interesting ! 🤔

Tu veux qu'on en parle, ou tu avais autre chose en tête ?`,"OK ! 😊 Tu veux qu'on discute de ça, ou tu veux passer à autre chose ?",`Hmm, je vois ! 🤔

Explique-moi un peu plus et je te réponds du mieux que je peux.`];return{response:r[Math.floor(Math.random()*r.length)],experiment:void 0,hints:[],suggestions:["Explique-moi les limites","Montre-moi un circuit RC","Dis-moi une blague"],mode:"general"}}if(y==="ar")return{response:`أنا هنا لمساعدتك! 🎓

يمكنني مساعدتك في:
• 📐 الرياضيات: حدود، اشتقاق، تكامل
• ⚛️ الفيزياء: دوائر، ميكانيك، أمواج
• 🧪 الكيمياء: تراكيز، تفاعلات، جزيئات

حاول تطرح سؤال أكثر تحديداً!`,experiment:void 0,hints:[],suggestions:[],mode:"education"};const s=[`Hmm, "${p}" 🤔

Je ne suis pas sûr de comprendre, mais je suis là pour toi ! On peut discuter de tout — cours, musique, sport, jeux...

Ou si tu veux de l'aide scolaire, essaie : "explique-moi les limites" ou "montre-moi un circuit RC". 😊`,`Intéressant ! 🤔

Je ne suis pas sûr de saisir le sujet exact, mais je peux :
• 💬 Discuter de n'importe quoi
• 📐 T'aider en maths, physique ou chimie
• 🧪 Te montrer des simulations

Essaie de reformuler ou demande-moi n'importe quoi ! 💪`,`Ah, "${p}" ! 😊

Dis-moi un peu plus et je te réponds. Je suis là pour discuter ou pour t'aider à réviser — comme tu veux !`];return{response:s[Math.floor(Math.random()*s.length)],experiment:void 0,hints:[],suggestions:["Explique-moi les limites","Montre-moi un circuit RC","Dis-moi une blague"],mode:"general"}}function de(){return{conversationHistory:[],currentSubject:null,currentExperiment:null,simulationParams:null,currentExercise:null,hintStep:0,learningMode:"explain",studentLevel:"2bac",photos:[],currentMode:"general"}}const me=`Tu es l'assistant scientifique de ProfVisuel, une application éducative pour les élèves de 2e année Bac au Maroc.

IDENTITÉ :
- Tu es un assistant amical, patient et pédagogique.
- Tu parles en français (tu peux aussi comprendre l'arabe et le darija marocain).
- Tu t'adresses à un adolescent de 16-18 ans.

COMPORTEMENT :
- Tu peux discuter de N'IMPORTE QUOI : musique, jeux vidéo, films, sport, technologie, voyages, humour, vie quotidienne.
- Tu peux passer naturellement d'une conversation générale à une explication scolaire.
- Tu n'es JAMAIS limité aux sujets scolaires.
- Tu es naturel, amical, et tu utilises des emojis avec modération.

QUAND L'ÉLÈVE PARLE DE COURS :
- Tu expliques clairement, étape par étape.
- Tu donnes des exemples concrets.
- Tu utilises des formules mathématiques quand pertinent.
- Tu t'adresses au programme de 2e BAC marocain : mathématiques, physique, chimie.
- Tu résous les exercices étape par étape, pas juste la réponse finale.
- Tu peux proposer des expériences ou simulations quand c'est pertinent.

FORMAT :
- Réponds de manière concise mais complète.
- Utilise le markdown quand c'est utile (gras, listes, formules).
- Ne sois pas trop long sauf si l'élève demande des détails.
- Si tu ne comprends pas, demande de reformuler.

IMPORTANT :
- Tu es un assistant conversationnel, pas un moteur de recherche.
- Tu gardes le contexte de la conversation.
- Tu reformules si l'élève dit qu'il n'a pas compris.`;function pe(o,i){const p=[],a=o.slice(-20);for(const y of a)p.push({role:y.role==="user"?"user":"model",parts:[{text:y.content}]});return p.push({role:"user",parts:[{text:i}]}),p}function xe(o){let i=me;return o.currentExperiment&&(i+=`

EXPÉRIENCE ACTIVE : ${o.currentExperiment}`,o.simulationParams&&(i+=`
Paramètres : ${JSON.stringify(o.simulationParams)}`)),o.learningMode==="help"&&(i+=`

MODE AIDE-MOI : L'élève veut des indices progressifs. Ne donne pas la réponse directement. Commence par un indice, puis laisse-le chercher.`),i}function he({params:o,onParamsChange:i}){const p=w.useRef(null),a=o.R||100,y=o.C||100,g=o.U0||5,x=a*y/1e3;return w.useEffect(()=>{const c=p.current;if(!c)return;const s=c.getContext("2d");if(!s)return;const r=c.width,t=c.height;s.fillStyle="#0f172a",s.fillRect(0,0,r,t),s.strokeStyle="rgba(99,102,241,0.1)",s.lineWidth=.5;for(let l=0;l<r;l+=30)s.beginPath(),s.moveTo(l,0),s.lineTo(l,t),s.stroke();for(let l=0;l<t;l+=30)s.beginPath(),s.moveTo(0,l),s.lineTo(r,l),s.stroke();const n=50,u=20,b=r-100,m=t-60;s.strokeStyle="rgba(148,163,184,0.5)",s.lineWidth=1,s.beginPath(),s.moveTo(n,u+m),s.lineTo(n+b,u+m),s.stroke(),s.beginPath(),s.moveTo(n,u),s.lineTo(n,u+m),s.stroke(),s.fillStyle="#94a3b8",s.font="10px monospace",s.fillText("Uc (V)",n-5,u-5),s.fillText("t (s)",n+b-20,u+m+15);const h=x*5;s.strokeStyle="#4f46e5",s.lineWidth=2.5,s.beginPath();for(let l=0;l<=h;l+=h/200){const N=g*(1-Math.exp(-l/x)),T=n+l/h*b,d=u+m-N/g*m;l===0?s.moveTo(T,d):s.lineTo(T,d)}s.stroke(),s.strokeStyle="#f59e0b",s.lineWidth=1.5,s.setLineDash([4,4]),s.beginPath();for(let l=0;l<=h;l+=h/200){const N=g/a*Math.exp(-l/x),T=n+l/h*b,d=u+m-N/(g/a)*m*.8;l===0?s.moveTo(T,d):s.lineTo(T,d)}s.stroke(),s.setLineDash([]);const q=n+x/h*b,v=g*(1-Math.exp(-1)),f=u+m-v/g*m;s.strokeStyle="rgba(220,38,38,0.6)",s.lineWidth=1,s.setLineDash([3,3]),s.beginPath(),s.moveTo(q,u+m),s.lineTo(q,f),s.stroke(),s.beginPath(),s.moveTo(n,f),s.lineTo(q,f),s.stroke(),s.setLineDash([]),s.fillStyle="#dc2626",s.beginPath(),s.arc(q,f,4,0,Math.PI*2),s.fill(),s.font="9px monospace",s.fillText(`τ=${x.toFixed(2)}s`,q+8,f-5),s.fillStyle="#4f46e5",s.fillRect(n+b-100,u+5,10,3),s.fillStyle="#94a3b8",s.font="9px sans-serif",s.fillText("Uc(t)",n+b-87,u+9),s.fillStyle="#f59e0b",s.fillRect(n+b-100,u+18,10,3),s.fillStyle="#94a3b8",s.fillText("i(t)",n+b-87,u+22),s.fillStyle="#10b981",s.font="bold 10px monospace",s.fillText(`τ = RC = ${x.toFixed(2)}s | Charge 63% à t=τ | Charge 99% à t=5τ=${(x*5).toFixed(1)}s`,n+5,u+m+15)},[a,y,g,x]),e.jsxs(I,{className:"border-cyan-500/20 bg-slate-900/50 overflow-hidden",children:[e.jsx($,{className:"pb-2 border-b border-cyan-500/10",children:e.jsxs(O,{className:"text-sm font-semibold flex items-center gap-2 text-cyan-400",children:[e.jsx(ie,{className:"size-4"})," Circuit RC — Charge / Décharge",e.jsx(D,{variant:"secondary",className:"text-[10px] ml-auto bg-cyan-500/10 text-cyan-400",children:"Expérience"})]})}),e.jsxs(V,{className:"p-4 space-y-3",children:[e.jsx("canvas",{ref:p,width:500,height:200,className:"w-full rounded-lg"}),e.jsx("div",{className:"grid grid-cols-3 gap-3",children:[{label:"Résistance R",symbol:"R",unit:"Ω",min:10,max:1e3,param:"R"},{label:"Capacité C",symbol:"C",unit:"μF",min:10,max:1e3,param:"C"},{label:"Tension U₀",symbol:"U₀",unit:"V",min:1,max:20,param:"U0"}].map(c=>e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-[10px] text-cyan-300",children:c.label}),e.jsxs("span",{className:"text-[10px] font-mono font-bold text-cyan-400",children:[o[c.param]||c.min,c.unit]})]}),e.jsx(R,{min:c.min,max:c.max,step:c.param==="U0"?.5:10,value:[o[c.param]||c.min],onValueChange:([s])=>i({...o,[c.param]:s}),className:"[&_[role=slider]]:bg-cyan-500"})]},c.param))}),e.jsxs("div",{className:"rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2 text-[10px] text-cyan-300 space-y-0.5",children:[e.jsx("p",{children:"Uc(t) = U₀(1 − e^(−t/τ))"}),e.jsx("p",{children:"i(t) = (U₀/R) × e^(−t/τ)"})]})]})]})}function fe({params:o,onParamsChange:i}){const p=w.useRef(null),a=o.acidConc||.1,y=o.baseConc||.1,g=o.acidVol||50,x=o.volume||0,c=a*g/y,s=t=>{const n=a*g/1e3,u=y*t/1e3,b=(g+t)/1e3;return u<n?-Math.log10((n-u)/b):u===n?7:14+Math.log10((u-n)/b)};w.useEffect(()=>{const t=p.current;if(!t)return;const n=t.getContext("2d");if(!n)return;const u=t.width,b=t.height;n.fillStyle="#0f172a",n.fillRect(0,0,u,b);const m=50,h=20,q=u-100,v=b-60,f=c*2;n.strokeStyle="rgba(148,163,184,0.5)",n.lineWidth=1,n.beginPath(),n.moveTo(m,h+v),n.lineTo(m+q,h+v),n.stroke(),n.beginPath(),n.moveTo(m,h),n.lineTo(m,h+v),n.stroke(),n.fillStyle="#94a3b8",n.font="10px monospace",n.fillText("pH",m-20,h-5),n.fillText("V NaOH (mL)",m+q-60,h+v+15);const l=h+v-7/14*v;n.fillStyle="rgba(239,68,68,0.05)",n.fillRect(m,l,q,h+v-l),n.fillStyle="rgba(59,130,246,0.05)",n.fillRect(m,h,q,l-h),n.strokeStyle="#a855f7",n.lineWidth=2.5,n.beginPath();for(let M=0;M<=f;M+=.2){const C=Math.max(0,Math.min(14,s(M))),k=m+M/f*q,P=h+v-C/14*v;M===0?n.moveTo(k,P):n.lineTo(k,P)}n.stroke();const N=m+c/f*q;n.strokeStyle="rgba(220,38,38,0.5)",n.lineWidth=1,n.setLineDash([4,4]),n.beginPath(),n.moveTo(N,h),n.lineTo(N,h+v),n.stroke(),n.setLineDash([]),n.fillStyle="#dc2626",n.font="9px monospace",n.fillText(`Équiv. ${c.toFixed(1)}mL`,N+5,h+15);const T=Math.max(0,Math.min(14,s(x))),d=m+x/f*q,j=h+v-T/14*v;n.fillStyle="#10b981",n.beginPath(),n.arc(d,j,5,0,Math.PI*2),n.fill(),n.strokeStyle="white",n.lineWidth=2,n.stroke()},[a,y,g,x,c]);const r=Math.max(0,Math.min(14,s(x)));return e.jsxs(I,{className:"border-purple-500/20 bg-slate-900/50 overflow-hidden",children:[e.jsx($,{className:"pb-2 border-b border-purple-500/10",children:e.jsxs(O,{className:"text-sm font-semibold flex items-center gap-2 text-purple-400",children:[e.jsx(W,{className:"size-4"})," Dosage acido-basique",e.jsx(D,{variant:"secondary",className:"text-[10px] ml-auto bg-purple-500/10 text-purple-400",children:"Expérience"})]})}),e.jsxs(V,{className:"p-4 space-y-3",children:[e.jsx("canvas",{ref:p,width:500,height:200,className:"w-full rounded-lg"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-[10px] text-purple-300",children:"[Acide] mol/L"}),e.jsx("span",{className:"text-[10px] font-mono font-bold text-purple-400",children:a})]}),e.jsx(R,{min:.01,max:1,step:.01,value:[a],onValueChange:([t])=>i({...o,acidConc:t}),className:"[&_[role=slider]]:bg-purple-500"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-[10px] text-purple-300",children:"[Base] mol/L"}),e.jsx("span",{className:"text-[10px] font-mono font-bold text-purple-400",children:y})]}),e.jsx(R,{min:.01,max:1,step:.01,value:[y],onValueChange:([t])=>i({...o,baseConc:t}),className:"[&_[role=slider]]:bg-purple-500"})]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-[10px] text-purple-300",children:"Volume NaOH ajouté"}),e.jsxs("span",{className:"text-[10px] font-mono font-bold text-green-400",children:[x.toFixed(1)," mL"]})]}),e.jsx(R,{min:0,max:c*2,step:.5,value:[x],onValueChange:([t])=>i({...o,volume:t}),className:"[&_[role=slider]]:bg-purple-500"})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-2 text-center",children:[e.jsxs("div",{className:"rounded-lg bg-purple-500/10 border border-purple-500/20 p-1.5",children:[e.jsx("p",{className:"text-[9px] text-purple-300",children:"pH"}),e.jsx("p",{className:"text-sm font-mono font-bold",style:{color:r<7?"#ef4444":r>7?"#3b82f6":"#10b981"},children:r.toFixed(1)})]}),e.jsxs("div",{className:"rounded-lg bg-purple-500/10 border border-purple-500/20 p-1.5",children:[e.jsx("p",{className:"text-[9px] text-purple-300",children:"Équiv."}),e.jsxs("p",{className:"text-xs font-mono font-bold text-amber-400",children:[c.toFixed(1),"mL"]})]}),e.jsxs("div",{className:"rounded-lg bg-purple-500/10 border border-purple-500/20 p-1.5",children:[e.jsx("p",{className:"text-[9px] text-purple-300",children:"État"}),e.jsx("p",{className:"text-[10px] font-bold",style:{color:x<c*.95?"#ef4444":x>c*1.05?"#3b82f6":"#10b981"},children:x<c*.95?"Acide":x>c*1.05?"Basique":"≈ Équiv."})]})]})]})]})}function ge({params:o,onParamsChange:i}){const p=w.useRef(null),a=o.funcType||0,y=o.a??1,g=o.b??0,x=o.c??0;w.useEffect(()=>{const r=p.current;if(!r)return;const t=r.getContext("2d");if(!t)return;const n=r.width,u=r.height,b=n/2,m=u/2,h=n/20,q=u/12;t.fillStyle="#0f172a",t.fillRect(0,0,n,u),t.strokeStyle="rgba(99,102,241,0.08)",t.lineWidth=.5;for(let f=-10;f<=10;f++){const l=b+f*h;t.beginPath(),t.moveTo(l,0),t.lineTo(l,u),t.stroke()}for(let f=-6;f<=6;f++){const l=m-f*q;t.beginPath(),t.moveTo(0,l),t.lineTo(n,l),t.stroke()}t.strokeStyle="rgba(148,163,184,0.5)",t.lineWidth=1,t.beginPath(),t.moveTo(0,m),t.lineTo(n,m),t.stroke(),t.beginPath(),t.moveTo(b,0),t.lineTo(b,u),t.stroke(),t.fillStyle="#64748b",t.font="10px monospace",t.fillText("x",n-15,m-5),t.fillText("y",b+5,15),t.strokeStyle="#4f46e5",t.lineWidth=2.5,t.beginPath();let v=!1;for(let f=0;f<n;f++){const l=(f-b)/h;let N=0;if(a===0)N=y*l*l+g*l+x;else if(a===1)N=y*Math.exp(g*l)+x;else if(a===2){const d=l+Math.abs(g)+.1;N=d>0?y*Math.log(d)+x:NaN}else N=y*Math.sin(g*l+x);if(isNaN(N)||!isFinite(N)||Math.abs(N)>20){v=!1;continue}const T=m-N*q;v?t.lineTo(f,T):(t.moveTo(f,T),v=!0)}if(t.stroke(),a===0){t.strokeStyle="rgba(220,38,38,0.5)",t.lineWidth=1.5,t.setLineDash([5,5]),t.beginPath(),v=!1;for(let f=0;f<n;f++){const l=(f-b)/h,N=2*y*l+g;if(Math.abs(N)>20){v=!1;continue}const T=m-N*q;v?t.lineTo(f,T):(t.moveTo(f,T),v=!0)}t.stroke(),t.setLineDash([]),t.fillStyle="#4f46e5",t.fillRect(10,10,10,3),t.fillStyle="#94a3b8",t.font="9px sans-serif",t.fillText("f(x)",24,13),t.fillStyle="rgba(220,38,38,0.5)",t.fillRect(10,20,10,3),t.fillStyle="#94a3b8",t.fillText("f'(x)",24,23)}},[a,y,g,x]);const c=["f(x) = ax² + bx + c","f(x) = a·e^(bx) + c","f(x) = a·ln(x) + c","f(x) = a·sin(bx + c)"],s=["Quadratique","Exponentielle","Logarithme","Sinusoïde"];return e.jsxs(I,{className:"border-indigo-500/20 bg-slate-900/50 overflow-hidden",children:[e.jsx($,{className:"pb-2 border-b border-indigo-500/10",children:e.jsxs(O,{className:"text-sm font-semibold flex items-center gap-2 text-indigo-400",children:[e.jsx(H,{className:"size-4"})," Explorateur de fonctions",e.jsx(D,{variant:"secondary",className:"text-[10px] ml-auto bg-indigo-500/10 text-indigo-400",children:"Interactive"})]})}),e.jsxs(V,{className:"p-4 space-y-3",children:[e.jsx("canvas",{ref:p,width:500,height:250,className:"w-full rounded-lg"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:s.map((r,t)=>e.jsx("button",{onClick:()=>i({...o,funcType:t}),className:`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${a===t?"bg-indigo-500 text-white":"bg-slate-800 text-slate-400 hover:bg-slate-700"}`,children:r},t))}),e.jsx("div",{className:"rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-1.5 text-center",children:e.jsx("code",{className:"text-[10px] font-mono font-bold text-indigo-400",children:c[a]})}),e.jsx("div",{className:"grid grid-cols-3 gap-2",children:["a","b","c"].map(r=>e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-[10px] text-indigo-300",children:r}),e.jsx("span",{className:"text-[10px] font-mono font-bold text-indigo-400",children:(o[r]??(r==="a"?1:0)).toFixed(1)})]}),e.jsx(R,{min:-5,max:5,step:.1,value:[o[r]??(r==="a"?1:0)],onValueChange:([t])=>i({...o,[r]:t}),className:"[&_[role=slider]]:bg-indigo-500"})]},r))})]})]})}function be({msg:o}){const i=o.role==="user";return e.jsx(L.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:`flex ${i?"justify-end":"justify-start"}`,children:e.jsxs("div",{className:`max-w-[85%] rounded-2xl px-4 py-3 ${i?"bg-cyan-600 text-white rounded-br-md":"bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-md"}`,children:[!i&&e.jsxs("div",{className:"flex items-center gap-1.5 mb-2",children:[e.jsx(ee,{className:"size-3 text-cyan-400"}),e.jsx("span",{className:"text-[10px] font-semibold text-cyan-400",children:"Prof IA"})]}),e.jsx("div",{className:"text-sm leading-relaxed whitespace-pre-line",children:o.content.split("**").map((p,a)=>a%2===1?e.jsx("strong",{className:"text-white",children:p},a):e.jsx("span",{children:p},a))}),o.hints&&o.hints.length>0&&e.jsx("div",{className:"flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-700/50",children:o.hints.map((p,a)=>e.jsx("span",{className:"px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px]",children:p},a))})]})})}function Se(){const[o,i]=w.useState(de()),[p,a]=w.useState(""),[y,g]=w.useState(null),[x,c]=w.useState({R:100,C:100,U0:5,acidConc:.1,baseConc:.1,acidVol:50,volume:0,funcType:0,a:1,b:0,c:0}),[s,r]=w.useState("explain"),[t,n]=w.useState(!1),u=w.useRef(null),b=w.useRef(null);w.useEffect(()=>{u.current?.scrollIntoView({behavior:"smooth"})},[o.conversationHistory]);const m=K(Z.aiChat.chat),[h,q]=w.useState(!1),v=w.useCallback(async d=>{const j=d||p.trim();if(!j||h)return;const M={role:"user",content:j,timestamp:new Date};i(S=>({...S,conversationHistory:[...S.conversationHistory,M]})),a(""),q(!0);const C=ce(j,o),k=j.toLowerCase(),P=!!C.experiment,B=o.currentExercise&&o.learningMode==="help"&&(k.includes("indice")||k.includes("hint")||k.includes("aide")||k.includes("comprends")||k.includes("suivant"));if(C.mode==="education"&&C.response.length>100,B){const S={role:"assistant",content:C.response,timestamp:new Date,hints:C.hints};i(E=>({...E,conversationHistory:[...E.conversationHistory,S],learningMode:s,currentMode:"exercise"})),q(!1);return}if(P){const S={role:"assistant",content:C.response,timestamp:new Date,experiment:C.experiment||void 0};i(E=>({...E,conversationHistory:[...E.conversationHistory,S],learningMode:s,currentMode:"lab"})),C.experiment&&g(C.experiment),q(!1);return}try{const S=xe(o),E=pe(o.conversationHistory,j),_={role:"assistant",content:(await m({messages:E,systemPrompt:S})).response,timestamp:new Date,hints:[]};i(U=>({...U,conversationHistory:[...U.conversationHistory,_],learningMode:s,currentMode:f(j)}))}catch{const E={role:"assistant",content:C.response,timestamp:new Date,hints:C.hints};i(A=>({...A,conversationHistory:[...A.conversationHistory,E],learningMode:s,currentMode:C.mode}))}finally{q(!1)}},[p,o,s,m,h]);function f(d){const j=d.toLowerCase();return j.includes("photo")||j.includes("image")?"image":j.includes("exercice")||j.includes("résous")?"exercise":j.includes("circuit")||j.includes("dosage")||j.includes("simulation")?"lab":j.includes("explique")||j.includes("cours")||j.includes("dérivée")?"education":"general"}const l=()=>{b.current?.click()},N=d=>{const j=d.target.files?.[0];if(!j)return;const M={role:"user",content:`📷 Photo importée : ${j.name}`,timestamp:new Date},C={role:"assistant",content:`🔎 **Analyse de l'image :**

J'ai reçu ta photo "${j.name}".

En V1, je ne peux pas encore analyser les images directement. Cependant, je suis prêt à接收 de vraies images via une API IA multimodale (GPT-4V, Claude Vision, etc.).

**Pour l'instant, tu peux :**
1. Décrire ce que tu vois dans la photo
2. Copier le texte de l'exercice
3. Je résoudrai l'exercice étape par étape

Dis-moi ce qu'il y a dans ta photo ! 👇`,timestamp:new Date,hints:["Décris l'exercice","Copie le texte","Explique le contexte"]};i(k=>({...k,conversationHistory:[...k.conversationHistory,M,C]}))},T=o.conversationHistory;return e.jsxs("div",{className:"min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",children:[e.jsx("header",{className:"sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl",children:e.jsxs("div",{className:"mx-auto flex h-14 max-w-5xl items-center justify-between px-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(W,{className:"size-5 text-cyan-400"}),e.jsx("span",{className:"text-base font-bold text-white",children:"🧪 Labo IA"}),e.jsx(D,{variant:"secondary",className:"text-[10px] bg-cyan-500/10 text-cyan-400",children:"2e BAC"}),T.length>0&&e.jsxs("span",{className:"text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-400",children:[o.currentMode==="general"&&"💬 Discussion",o.currentMode==="education"&&"🎓 Éducation",o.currentMode==="lab"&&"🧪 Laboratoire",o.currentMode==="image"&&"📷 Image",o.currentMode==="exercise"&&"🧮 Exercice"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>r("explain"),className:`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${s==="explain"?"bg-cyan-500/20 text-cyan-300 border border-cyan-500/30":"bg-slate-800 text-slate-500"}`,children:"💬 Explique-moi"}),e.jsx("button",{onClick:()=>r("help"),className:`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${s==="help"?"bg-amber-500/20 text-amber-300 border border-amber-500/30":"bg-slate-800 text-slate-500"}`,children:"💡 Aide-moi"})]})]})}),e.jsxs("div",{className:"mx-auto max-w-5xl px-4 py-6 space-y-6",children:[T.length===0&&e.jsxs(L.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"text-center space-y-4 py-8",children:[e.jsx("div",{className:"w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 mx-auto flex items-center justify-center",children:e.jsx(H,{className:"size-10 text-cyan-400"})}),e.jsx("h2",{className:"text-2xl font-bold text-white",children:"Assistant Scientifique IA"}),e.jsx("p",{className:"text-sm text-slate-400 max-w-md mx-auto",children:"Pose ta question, importe une photo, ou choisis une expérience. L'IA t'explique, te montre et t'accompagne."}),e.jsx("div",{className:"grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto pt-4",children:[{key:"circuit",icon:"⚡",title:"Circuit RC",desc:"Charge/décharge condensateur",color:"cyan"},{key:"dosage",icon:"🧪",title:"Dosage",desc:"Titration acido-basique",color:"purple"},{key:"fonction",icon:"📐",title:"Fonctions",desc:"Explorateur de courbes",color:"indigo"}].map(d=>e.jsxs("button",{onClick:()=>v(`Montre-moi ${d.title.toLowerCase()}`),className:`rounded-xl border border-${d.color}-500/20 bg-${d.color}-500/5 p-4 text-left hover:bg-${d.color}-500/10 transition-all`,children:[e.jsx("span",{className:"text-2xl",children:d.icon}),e.jsx("p",{className:"text-sm font-semibold text-white mt-2",children:d.title}),e.jsx("p",{className:"text-[10px] text-slate-400 mt-1",children:d.desc})]},d.key))})]}),T.length>0&&e.jsxs("div",{className:"space-y-4",children:[T.map((d,j)=>e.jsx(be,{msg:d},j)),h&&e.jsxs(L.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"flex gap-3 max-w-3xl",children:[e.jsx("div",{className:"w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0",children:e.jsx(H,{className:"size-3.5 text-white"})}),e.jsx("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(F,{className:"size-3.5 text-cyan-400 animate-spin"}),e.jsx("span",{className:"text-xs text-slate-400",children:"Réflexion..."})]})})]}),e.jsx("div",{ref:u})]}),e.jsx(Q,{children:y&&e.jsxs(L.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},children:[y==="circuit"&&e.jsx(he,{params:x,onParamsChange:c}),y==="dosage"&&e.jsx(fe,{params:x,onParamsChange:c}),y==="fonction"&&e.jsx(ge,{params:x,onParamsChange:c})]})}),e.jsxs("div",{className:"sticky bottom-16 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4 space-y-2",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:l,className:"flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-all",children:e.jsx(te,{className:"size-4"})}),e.jsx("input",{ref:b,type:"file",accept:"image/*",className:"hidden",onChange:N}),e.jsx(X,{placeholder:s==="help"?"💡 Pose ta question (je te donnerai des indices)...":"💬 Pose ta question au Prof IA...",value:p,onChange:d=>a(d.target.value),className:"min-h-[44px] text-sm resize-none bg-slate-800 border-slate-700 text-white placeholder:text-slate-500",onKeyDown:d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),v())}}),e.jsx(G,{onClick:()=>v(),disabled:!p.trim()||h,className:"flex-shrink-0 bg-cyan-600 hover:bg-cyan-500",children:h?e.jsx(F,{className:"size-4 animate-spin"}):e.jsx(Y,{className:"size-4"})})]}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:["Explique-moi les limites","Montre-moi un circuit RC","Montre-moi un dosage","Résous un exercice","Donne-moi un indice"].map(d=>e.jsx("button",{onClick:()=>v(d),className:"px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 hover:bg-slate-700 transition-colors",children:d},d))})]})]})]})}export{Se as default};
