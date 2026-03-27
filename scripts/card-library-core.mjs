import path from "node:path";

export const TOTAL_CARDS = 365;
export const DEFAULT_DECK_SLUG = "cosmic-core";
export const DECKS = [
  {
    slug: "cosmic-core",
    name: "Cosmic Core",
    description: "The foundational Cosmic Card deck for clarity, courage, trust, and alignment.",
    cover_image_key: "decks/cosmic-core/cover",
    theme_key: "cosmic-classic",
    is_premium: false,
    sort_order: 1,
  },
  {
    slug: "self-love",
    name: "Self-Love",
    description: "A compassionate deck for tenderness, confidence, and self-return.",
    cover_image_key: "decks/self-love/cover",
    theme_key: "rose-glow",
    is_premium: false,
    sort_order: 2,
  },
  {
    slug: "healing",
    name: "Healing",
    description: "Gentle cards for emotional repair, integration, and steadier healing seasons.",
    cover_image_key: "decks/healing/cover",
    theme_key: "silver-moon",
    is_premium: false,
    sort_order: 3,
  },
  {
    slug: "abundance",
    name: "Abundance",
    description: "A deck for grounded prosperity, receiving, and expansive support.",
    cover_image_key: "decks/abundance/cover",
    theme_key: "golden-harvest",
    is_premium: true,
    sort_order: 4,
  },
  {
    slug: "love-relationships",
    name: "Love & Relationships",
    description: "Reflections for reciprocal connection, emotional clarity, and relational warmth.",
    cover_image_key: "decks/love-relationships/cover",
    theme_key: "heart-current",
    is_premium: true,
    sort_order: 5,
  },
  {
    slug: "career-purpose",
    name: "Career & Purpose",
    description: "Focused guidance for meaningful work, leadership, and sustainable momentum.",
    cover_image_key: "decks/career-purpose/cover",
    theme_key: "aurora-work",
    is_premium: true,
    sort_order: 6,
  },
  {
    slug: "inner-reset",
    name: "Inner Reset",
    description: "A restorative deck for release, rest, and emotional reset.",
    cover_image_key: "decks/inner-reset/cover",
    theme_key: "midnight-bloom",
    is_premium: true,
    sort_order: 7,
  },
];

const CATEGORY_TO_DECK = {
  "self-love": "self-love",
  healing: "healing",
  clarity: "cosmic-core",
  abundance: "abundance",
  relationships: "love-relationships",
  career: "career-purpose",
  rest: "inner-reset",
  courage: "cosmic-core",
  alignment: "cosmic-core",
  "letting-go": "inner-reset",
  trust: "cosmic-core",
  "inner-power": "self-love",
};
export const CATEGORY_ORDER = [
  "self-love",
  "healing",
  "clarity",
  "abundance",
  "relationships",
  "career",
  "rest",
  "courage",
  "alignment",
  "letting-go",
  "trust",
  "inner-power",
];

const CATEGORY_CONFIG = {
  "self-love": {
    adjectives: ["Tender", "Radiant", "Gentle", "Sacred", "Soft", "Golden", "Open", "Kind"],
    nouns: ["Mirror", "Return", "Warmth", "Permission", "Heartlight", "Embrace", "Bloom", "Worth"],
    energyTags: ["soft reset", "quiet confidence", "openness", "renewal", "protection", "self-trust"],
    leads: [
      "You are allowed to meet yourself with less pressure today",
      "Your worth does not rise and fall with productivity",
      "Softness becomes strength when it is honest",
      "The way you speak to yourself sets the tone for the day",
      "You do not need to perform ease in order to deserve it",
      "Let your inner world feel less crowded and more kind",
      "Care becomes clearer when you stop withholding it from yourself",
      "There is wisdom in treating your heart like something precious",
    ],
    supports: [
      "Choose the version of care that feels sustainable, not dramatic",
      "Offer yourself the same patience you keep giving away",
      "Let a small act of tenderness count as real progress",
      "Notice what relaxes your body when no one is watching",
      "Make room for the part of you that is still learning softness",
      "Protect your peace before you explain it away",
      "Speak inwardly as though you are someone worth keeping close",
      "Allow enough gentleness for your nervous system to believe you",
    ],
    bodies: [
      "Self-love often begins as a quieter conversation, not a grand breakthrough",
      "The heart opens more easily when it does not feel judged for being human",
      "Inner kindness changes the pace of healing because it removes the need to fight yourself",
      "What you accept with compassion can finally begin to settle",
      "A steadier relationship with yourself is built through repeated moments of honesty and care",
      "When you stop managing how lovable you appear, your energy becomes more whole",
      "The permission to rest, feel, and begin again is part of your dignity",
      "Your softness is most powerful when it is rooted in respect for your own needs",
    ],
    invitations: [
      "let one decision today be shaped by self-respect instead of self-pressure",
      "choose language that leaves you feeling safe inside your own mind",
      "give yourself one moment of care before you give your energy away",
      "return to what helps you feel held rather than evaluated",
      "trust that small acts of gentleness can still change your day",
      "allow your standards to include compassion, not only discipline",
      "notice where your body is asking for kindness, not correction",
      "let your next step feel warm enough to continue",
    ],
  },
  healing: {
    adjectives: ["Quiet", "Restoring", "Silver", "Steady", "Sacred", "Mended", "Patient", "Luminous"],
    nouns: ["Waters", "Release", "Mending", "Lantern", "Breath", "Tide", "Threshold", "Medicine"],
    energyTags: ["emotional release", "renewal", "soft reset", "protection", "restoration", "gentle repair"],
    leads: [
      "Healing does not always look dramatic when it is truly working",
      "A tender season still counts as forward movement",
      "You are allowed to recover without proving how strong you are",
      "The parts of you that feel tired deserve gentleness, not urgency",
      "Repair often begins in places that finally feel safe enough to soften",
      "What aches can still become a doorway to deeper honesty",
      "There is dignity in moving at the speed your heart can trust",
      "Your system is not behind; it is protecting what has been overwhelmed",
    ],
    supports: [
      "Let healing be measured by steadiness, not spectacle",
      "Release the timeline that keeps asking your pain to hurry",
      "Give your body one reason to believe the danger has passed",
      "A small exhale can be a meaningful turning point",
      "Trust the value of gentle repetition over emotional force",
      "Let yourself receive support without apologizing for needing it",
      "What softens slowly often lasts longer",
      "You can honor what happened without staying inside it forever",
    ],
    bodies: [
      "True healing makes room for complexity, because not every wound closes in a straight line",
      "When your inner world feels seen instead of pushed, repair becomes more possible",
      "The nervous system responds to consistency long before it responds to pressure",
      "Recovery is shaped by safety, rest, and the willingness to stop turning pain into identity",
      "Your heart can carry memory without being ruled by it",
      "Some chapters end when you stop demanding certainty from your own process",
      "What has been tender can still become wise, spacious, and beautifully alive again",
      "The pace of healing changes when you trust yourself enough to listen",
    ],
    invitations: [
      "honor what feels fragile without making it permanent",
      "choose one grounding ritual that helps your body feel less alone",
      "let your next act be soothing rather than proving",
      "allow enough rest for insight to arrive naturally",
      "make space for a slower, steadier kind of repair",
      "return to what helps you feel regulated and present",
      "remember that healing can be quiet and still be real",
      "offer yourself a softer landing than yesterday",
    ],
  },
  clarity: {
    adjectives: ["Clear", "Still", "Open", "Focused", "Luminous", "Bright", "Lucid", "Honest"],
    nouns: ["Window", "Signal", "Compass", "Horizon", "Answer", "Blueprint", "Lantern", "View"],
    energyTags: ["grounded action", "discernment", "quiet confidence", "fresh perspective", "inner knowing", "clean focus"],
    leads: [
      "Clarity often arrives after you stop forcing a conclusion",
      "The next truth may be simpler than the fear around it",
      "Confusion loses power when you return to what is essential",
      "You already know more than the noise around you suggests",
      "A calmer mind can hear what urgency keeps interrupting",
      "The answer you need may be waiting beneath the extra story",
      "Discernment grows when you stop negotiating with what feels misaligned",
      "Sometimes the clearest choice is the one that creates more peace",
    ],
    supports: [
      "Let what is obvious be enough for today",
      "Ask what feels true before asking what looks impressive",
      "Return to the facts your body has already noticed",
      "Choose the question that makes your mind feel quieter, not louder",
      "A smaller decision can create the larger opening",
      "Name the thing you know before you collect another opinion",
      "Notice what becomes easier when you stop over-explaining",
      "Give yourself permission to see the pattern as it is",
    ],
    bodies: [
      "Clarity deepens when you reduce the emotional static around the decision in front of you",
      "Truth often becomes visible through stillness, because it does not need to compete to be real",
      "Your inner guidance becomes sharper when you stop rewarding confusion with endless attention",
      "A grounded choice usually feels cleaner in the body than a performative one",
      "You do not need total certainty to recognize what is no longer right for you",
      "Discernment is a practice of honoring what consistently brings coherence",
      "When you simplify the question, the next step can reveal itself without drama",
      "The clearest path is often the one that leaves less residue in your spirit",
    ],
    invitations: [
      "choose one honest next step instead of waiting for the whole map",
      "let today be guided by coherence rather than urgency",
      "write down what already feels known so it can stop circling",
      "release the need to make the perfect choice before making the truthful one",
      "follow what gives your mind and body the same answer",
      "clear one distraction and listen again",
      "allow simplicity to be intelligent",
      "trust what remains true after the overthinking settles",
    ],
  },
  abundance: {
    adjectives: ["Golden", "Overflowing", "Open", "Prosperous", "Bright", "Expansive", "Magnetic", "Generous"],
    nouns: ["Garden", "Current", "Harvest", "Gate", "Pulse", "Reserve", "Bloom", "Promise"],
    energyTags: ["expansion", "openness", "grounded action", "renewal", "magnetism", "receiving"],
    leads: [
      "Abundance grows more easily in spaces that are open, honest, and well tended",
      "Receiving becomes possible when you stop shrinking to feel safe",
      "There is value in what comes slowly and stays rooted",
      "Your life can hold more good than your old scarcity stories expect",
      "Support may arrive through steadiness before it arrives through scale",
      "Prosperity is allowed to feel calm instead of chaotic",
      "You do not need to grip tightly to be well supported",
      "A generous life is built from alignment, not only effort",
    ],
    supports: [
      "Make room for what nourishes you to stay",
      "Let enoughness change the way you choose today",
      "Trust consistency more than spectacle",
      "Notice where your energy wants to expand without strain",
      "Choose what honors your value before you prove your value",
      "Allow support to be practical, visible, and real",
      "What is meant to grow with you does not need you to beg for it",
      "Let your standards rise with your capacity to receive",
    ],
    bodies: [
      "Abundance becomes sustainable when your nervous system no longer confuses receiving with risk",
      "The energy of enoughness creates cleaner decisions than the energy of lack",
      "A well-supported life is often built through grounded choices repeated with trust",
      "Prosperity asks for openness, but it also asks for stewardship and self-respect",
      "What multiplies in your life is often what you are willing to treat as worthy of care",
      "There is wisdom in building slowly where your roots can actually hold the growth",
      "Expansion feels more stable when it is connected to values instead of urgency",
      "You become more magnetic when you stop negotiating away your own capacity",
    ],
    invitations: [
      "say yes to one form of support that feels clean and mutual",
      "practice receiving without immediately making yourself smaller",
      "let your next financial or energetic choice reflect enoughness",
      "tend what is already growing before you chase more",
      "choose stability that can widen over time",
      "notice what opportunity feels nourishing rather than depleting",
      "allow your life to hold beauty and practicality together",
      "treat your resources like something sacred and alive",
    ],
  },
  relationships: {
    adjectives: ["Open", "Sacred", "Steady", "True", "Gentle", "Magnetic", "Honest", "Warm"],
    nouns: ["Bridge", "Language", "Bond", "Listening", "Signal", "Circle", "Promise", "Exchange"],
    energyTags: ["openness", "protection", "honest connection", "soft reset", "reciprocity", "heart wisdom"],
    leads: [
      "Healthy connection leaves room for truth, not just agreement",
      "The relationships that nourish you do not require constant self-abandonment",
      "Your heart can stay open without staying unprotected",
      "Mutuality becomes clearer when you stop overcompensating",
      "Intimacy grows where honesty feels safer than performance",
      "The right connections make your nervous system feel less defended",
      "Love is not proven by how much discomfort you can tolerate",
      "You are allowed to ask whether a bond feels reciprocal",
    ],
    supports: [
      "Notice what becomes easier when you stop carrying the whole emotional weight",
      "Let communication be cleaner than your assumptions",
      "Choose warmth without surrendering your boundaries",
      "Give your relationships the gift of directness",
      "Pay attention to the people who leave you feeling more like yourself",
      "Protect your tenderness with honesty, not distance alone",
      "Make space for the conversations that create relief",
      "Trust the difference between chemistry and safety",
    ],
    bodies: [
      "Relational clarity deepens when you honor what your body feels after each exchange",
      "A meaningful connection does not ask you to disappear in order to stay close",
      "Boundaries and closeness can coexist when they are rooted in self-respect",
      "The strongest bonds often grow from consistent honesty rather than intensity",
      "When you stop rescuing every dynamic, mutual care becomes easier to recognize",
      "The heart softens more naturally in spaces where it does not have to perform for belonging",
      "Love becomes steadier when it is supported by trust, accountability, and emotional presence",
      "Your relationships mirror your standards for peace as much as your standards for affection",
    ],
    invitations: [
      "say what you mean before resentment begins to write the script",
      "notice which connection feels both warm and honest",
      "let your boundaries become a bridge to clearer love",
      "choose reciprocity over emotional overextension",
      "allow the right people to meet the real version of you",
      "return to conversations that make room for repair",
      "trust the bond that does not require self-betrayal",
      "move toward connection that feels calm in your chest",
    ],
  },
  career: {
    adjectives: ["Focused", "Golden", "Steady", "Visionary", "Purposeful", "Clear", "Rooted", "Forward"],
    nouns: ["Path", "Blueprint", "Momentum", "Signal", "Calling", "Direction", "Craft", "Threshold"],
    energyTags: ["grounded action", "expansion", "quiet confidence", "clear leadership", "divine timing", "meaningful progress"],
    leads: [
      "Your work becomes more magnetic when it reflects your actual values",
      "Momentum does not need to feel frantic in order to be real",
      "A purposeful path is built through alignment, not only ambition",
      "You can grow your career without leaving yourself behind",
      "The next professional opening may come from clarity, not more noise",
      "Your pace matters just as much as your direction",
      "What is sustainable will often outlast what is merely impressive",
      "You are allowed to want work that feels both meaningful and stable",
    ],
    supports: [
      "Choose the move that strengthens your foundation",
      "Let your standards include peace as well as progress",
      "Notice where your talent wants structure, not only inspiration",
      "A cleaner priority can create better momentum than ten urgent tasks",
      "Trust the work that asks for depth instead of constant display",
      "Make room for strategy that honors your energy",
      "Support your next step with practical devotion",
      "Let your effort be intelligent enough to last",
    ],
    bodies: [
      "Career alignment is not only about what you do, but also about who you become while doing it",
      "Purpose deepens when your daily choices support the future you say you want",
      "Sustainable success is often built through quiet clarity repeated over time",
      "When your direction is rooted, opportunities feel easier to evaluate",
      "A meaningful career path asks for self-trust as much as skill",
      "Progress accelerates when you stop spending energy on what is clearly misaligned",
      "Your work can expand without demanding that your inner life collapse",
      "Professional clarity grows when your decisions are guided by coherence rather than comparison",
    ],
    invitations: [
      "identify the one move that improves both direction and stability",
      "let your next decision respect the future capacity you want to build",
      "choose disciplined focus over scattered urgency",
      "support your gifts with structure that feels clean and workable",
      "return to the work that feels meaningful enough to refine",
      "notice where your ambition is asking for a steadier container",
      "trust that quieter progress can still be powerful",
      "let your career path reflect what you actually value",
    ],
  },
  rest: {
    adjectives: ["Quiet", "Moonlit", "Soft", "Sacred", "Still", "Gentle", "Rested", "Calm"],
    nouns: ["Pause", "Exhale", "Sanctuary", "Nightfall", "Stillness", "Blanket", "Harbor", "Ease"],
    energyTags: ["soft reset", "restoration", "protection", "deep exhale", "renewal", "nervous system care"],
    leads: [
      "Rest is part of your wisdom, not a reward for exhaustion",
      "A slower pace can be the most intelligent move available",
      "Your body deserves moments that do not ask it to brace",
      "You are allowed to pause before you are completely depleted",
      "Stillness is not empty when it is restoring you",
      "The nervous system heals through safety, rhythm, and enough quiet",
      "Not every day is asking for output; some are asking for repair",
      "Rest can be a form of trust when you stop treating it like weakness",
    ],
    supports: [
      "Let your evening hold less noise and more gentleness",
      "Choose what gives your body permission to unclench",
      "A small reduction in pressure can change the whole tone of the day",
      "Protect the moments that help you feel unhurried",
      "Make space for stillness without turning it into another task",
      "Allow enough softness for your breath to deepen",
      "Listen for what feels nourishing instead of impressive",
      "You do not need to deserve recuperation before taking it",
    ],
    bodies: [
      "Rest creates clarity because it gives your inner world enough room to settle",
      "The body remembers what safety feels like through repeated moments of unforced ease",
      "A rested spirit hears guidance more clearly than an overdriven one",
      "When you stop treating stillness like wasted time, recovery becomes more available",
      "Your capacity expands when recovery is built into the rhythm instead of postponed",
      "Gentle routines can become a powerful form of self-protection",
      "You are easier to hear, trust, and sustain when your system is not in constant demand",
      "The quiet you create today can become tomorrow's steadiness",
    ],
    invitations: [
      "give yourself one unhurried pocket of time and do not defend it",
      "choose the ritual that tells your body it can soften now",
      "let less stimulation become a form of support",
      "allow your next hour to contain more breathing room",
      "release one unnecessary demand before the day ends",
      "protect your energy as carefully as your time",
      "make restoration part of the plan instead of the apology",
      "return to whatever helps you feel gently restored",
    ],
  },
  courage: {
    adjectives: ["Brave", "Steady", "Firelit", "Open", "Bold", "Rising", "Fearless", "True"],
    nouns: ["Step", "Voice", "Spark", "Threshold", "Decision", "Leap", "Signal", "Heartbeat"],
    energyTags: ["grounded action", "quiet confidence", "inner fire", "protection", "forward motion", "truth-telling"],
    leads: [
      "Courage is often quieter than fear expects",
      "The brave choice may be the one that finally feels honest",
      "You do not need to feel fearless to move with integrity",
      "Action becomes possible when truth is allowed to speak first",
      "A small act of bravery can change the shape of a whole season",
      "Your life responds when you stop abandoning what you know",
      "Strength is not the absence of trembling; it is movement with awareness",
      "Some doors open only after you stop asking fear for permission",
    ],
    supports: [
      "Let your next step be supported, not performative",
      "Choose the truth that frees energy instead of draining it",
      "Stand beside your own decision long enough to hear its wisdom",
      "A clearer boundary can be an act of immense bravery",
      "Move with respect for your fear, not obedience to it",
      "Trust the action that leaves you feeling more whole",
      "Allow your voice to take up honest space",
      "The first move only needs to be real, not dramatic",
    ],
    bodies: [
      "Courage gathers momentum when your choices begin to match your inner knowing",
      "The nervous system trusts brave action more when it is paired with steadiness",
      "A meaningful risk is easier to take when it comes from self-respect instead of impulse",
      "Your strength becomes clearer when you stop measuring it by how invisible your fear looks",
      "Bravery is often a return to alignment after too much compromise",
      "The next chapter may ask for truth more than perfection",
      "Every honest move teaches your body that you can be trusted with your own life",
      "A courageous path is built one clean decision at a time",
    ],
    invitations: [
      "take the next step that makes your spirit feel more present",
      "let honesty be your source of momentum today",
      "choose the boundary, conversation, or move that returns your energy to you",
      "make one decision from self-trust instead of self-protection",
      "allow bravery to be grounded, not rushed",
      "support your courage with clear action and enough breath",
      "move toward what feels true, even if it feels new",
      "trust that your strength can be both tender and decisive",
    ],
  },
  alignment: {
    adjectives: ["Aligned", "Clear", "Golden", "Sacred", "True", "Harmonic", "Steady", "Centered"],
    nouns: ["Current", "Signal", "Axis", "Return", "Pathway", "Resonance", "Compass", "Center"],
    energyTags: ["divine timing", "grounded action", "coherence", "quiet confidence", "surrender", "inner knowing"],
    leads: [
      "What is aligned usually asks for less force and more honesty",
      "Your path becomes clearer when your choices stop splitting your energy",
      "Coherence feels calmer in the body than performance ever will",
      "Alignment is often recognized by the peace it returns to you",
      "You do not need to chase what naturally meets you with ease",
      "The right direction tends to create steadiness rather than static",
      "When your inner and outer life agree, momentum feels cleaner",
      "True alignment removes the need to keep convincing yourself",
    ],
    supports: [
      "Let your decisions reflect what you want to sustain",
      "Release the option that costs too much of your spirit",
      "Notice what becomes simpler when you stop bending away from yourself",
      "Choose the path that feels both honest and workable",
      "A quiet yes can be more powerful than a loud maybe",
      "Trust the signal that keeps returning with calm consistency",
      "Let coherence be a form of success",
      "The right fit rarely requires you to become smaller",
    ],
    bodies: [
      "Alignment is less about perfection and more about the reduction of inner contradiction",
      "Your energy becomes more available when you are no longer divided against yourself",
      "A coherent life is built through choices that respect both desire and truth",
      "What is meant to remain usually feels less complicated in your body over time",
      "The path that supports you does not need constant emotional rescue",
      "Your clarity strengthens when your actions begin to agree with your values",
      "Resonance is often subtle, but it leaves a distinct feeling of steadiness behind",
      "When something aligns, your system can exhale into it rather than brace against it",
    ],
    invitations: [
      "make one choice today that reduces inner friction",
      "say yes where your body feels calm and awake",
      "allow enough honesty for the misaligned option to fall away",
      "choose the route that feels sustainable in both heart and schedule",
      "return to the decision that brings coherence, not confusion",
      "let your energy organize itself around what is true",
      "trust the direction that supports your wholeness",
      "take the next step that feels clean in your spirit",
    ],
  },
  "letting-go": {
    adjectives: ["Open", "Released", "Silver", "Light", "Cleared", "Gentle", "Fading", "Quiet"],
    nouns: ["Tide", "Release", "Weight", "Doorway", "Exhale", "Unraveling", "Departure", "Sky"],
    energyTags: ["surrender", "emotional release", "soft reset", "renewal", "clearing", "freedom"],
    leads: [
      "Letting go often begins with telling the truth about what is already over",
      "Release becomes possible when you stop treating heaviness like loyalty",
      "Some chapters close more kindly once you stop reopening them for proof",
      "You do not have to keep carrying what no longer fits your future",
      "Freedom can feel quiet before it feels exciting",
      "What drains your spirit is not always yours to save",
      "You are allowed to leave the old pattern without making it a failure",
      "Space opens when your grip softens around what is already shifting",
    ],
    supports: [
      "Let your energy return from what you keep revisiting out of habit",
      "Choose release that feels clean, not dramatic",
      "A softer hold can create a stronger future",
      "Trust what peace is trying to make easier",
      "Stop negotiating with what has already shown you its shape",
      "Make room for grief without building a home inside it",
      "The next chapter needs some space to arrive",
      "Notice what feels lighter when you stop chasing closure from the wrong place",
    ],
    bodies: [
      "Release is not rejection; it is the willingness to stop asking the past to become something else",
      "You create room for new support when old weight is no longer defining your posture",
      "A graceful ending often begins with self-honesty and enough compassion to move forward",
      "Not everything unfinished needs more of your life force",
      "The body often recognizes completion before the mind gives it permission",
      "Surrender becomes powerful when it is rooted in self-respect instead of defeat",
      "What you release with awareness stops taking your energy in the same way",
      "Your future can become clearer once your hands are no longer full of what is leaving",
    ],
    invitations: [
      "name one attachment that is asking to loosen today",
      "allow enough space for what is complete to remain complete",
      "let your next step come from relief instead of repetition",
      "release the habit of revisiting what no longer nourishes you",
      "make room for a lighter version of your energy",
      "trust that closure can come through your own decision to stop holding on",
      "let what is leaving go with dignity",
      "choose freedom even if it arrives quietly at first",
    ],
  },
  trust: {
    adjectives: ["Faithful", "Steady", "Golden", "Calm", "Open", "Guided", "Patient", "True"],
    nouns: ["Timing", "Bridge", "Knowing", "Current", "Rhythm", "Signal", "Promise", "Path"],
    energyTags: ["divine timing", "surrender", "protection", "quiet confidence", "renewal", "inner trust"],
    leads: [
      "Trust grows when you stop demanding immediate proof from every step",
      "You are still being guided, even when the full shape is not yet visible",
      "What is unfolding for you does not always reveal itself all at once",
      "The pause can be part of the path, not a punishment from it",
      "There is wisdom in allowing life to meet you at the right pace",
      "Not every unanswered question is a sign to panic",
      "Trust becomes steadier when it is practiced in small moments",
      "You do not need to force timing that is asking for readiness",
    ],
    supports: [
      "Let uncertainty be a space for listening instead of spiraling",
      "A grounded pause can still be movement",
      "Choose faith in the next step, not pressure for the whole outcome",
      "Notice where patience is creating more strength than urgency",
      "Return to what is stable while the rest continues unfolding",
      "Allow your body to relax around what is not yet resolved",
      "Trust the season without turning it into a verdict",
      "Let the quiet parts of the journey keep teaching you",
    ],
    bodies: [
      "Trust is built through repeated evidence that you can stay present without controlling everything",
      "Divine timing feels less mysterious when you notice how often clarity arrives after enough preparation",
      "A season of waiting can still be deeply productive when it is shaping your readiness",
      "The unknown becomes less frightening when your relationship with yourself is stable",
      "You are more supported than fear suggests when you remain anchored in what is true now",
      "Patience carries power when it is paired with attentive presence",
      "The next opening often appears once you stop trying to outrun the process",
      "Trust creates room for life to respond in ways your overthinking never could have designed",
    ],
    invitations: [
      "let your next move come from steadiness rather than panic",
      "return to what is certain enough for this moment",
      "allow the unanswered pieces to stay open without chasing them",
      "trust the preparation happening beneath the surface",
      "choose faith in the process over obsession with the timeline",
      "give your body one signal that it is safe to wait with grace",
      "stay present long enough for guidance to feel tangible",
      "let patience become part of your power",
    ],
  },
  "inner-power": {
    adjectives: ["Sovereign", "Bright", "Rooted", "Magnetic", "Steady", "Golden", "Unshaken", "Radiant"],
    nouns: ["Core", "Voice", "Flame", "Center", "Authority", "Pulse", "Strength", "Current"],
    energyTags: ["quiet confidence", "grounded action", "protection", "expansion", "inner fire", "self-leadership"],
    leads: [
      "Your power becomes clearer when it is no longer performing for approval",
      "Inner authority is built through self-trust, not control",
      "You do not need to become louder to become more powerful",
      "The strongest center is the one that stays connected to truth",
      "Power feels different when it is rooted instead of reactive",
      "Your energy sharpens when you stop handing your certainty away",
      "There is strength in choosing yourself without turning hard",
      "Real confidence often sounds quieter than insecurity expects",
    ],
    supports: [
      "Let your decisions reflect the version of you that feels most anchored",
      "Own your pace, your voice, and your standards",
      "Choose composure over performance and watch your energy return",
      "The more grounded you are, the less explaining you need",
      "Protect what is true for you with steady conviction",
      "Lead yourself with clarity before you lead the moment",
      "Trust the power of a calm and honest presence",
      "Stand in what you know without making yourself hard to stay there",
    ],
    bodies: [
      "Inner power is the ability to remain connected to yourself while life keeps moving around you",
      "Confidence becomes sustainable when it is built on integrity rather than image",
      "A rooted center helps you respond with intention instead of reflex",
      "The strength you are looking for may already exist in the decisions you keep avoiding",
      "Self-leadership grows through clear boundaries, honest choices, and emotional steadiness",
      "Your presence becomes more magnetic when it is not diluted by self-betrayal",
      "The body recognizes real power by how safe it feels to inhabit your own truth",
      "You carry more authority when your actions are no longer split by doubt and performance",
    ],
    invitations: [
      "make one decision today from your most anchored self",
      "let your standards reflect your actual worth",
      "own your voice without rushing to justify it",
      "move from steadiness and let that be enough",
      "protect your center before you manage the room",
      "choose the action that makes you feel more self-led",
      "allow calm confidence to shape your next response",
      "trust your ability to hold your own energy with care",
    ],
  },
};

function titleCase(value) {
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sentenceCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function lowerFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildTitlePool(config) {
  const titles = [];

  for (const adjective of config.adjectives) {
    for (const noun of config.nouns) {
      titles.push(titleCase(`${adjective} ${noun}`));
    }
  }

  return titles;
}

function getCategoryQuota(categoryIndex) {
  const base = Math.floor(TOTAL_CARDS / CATEGORY_ORDER.length);
  const remainder = TOTAL_CARDS % CATEGORY_ORDER.length;
  return categoryIndex < remainder ? base + 1 : base;
}

function renderShortMessage(config, index) {
  const lead = config.leads[index % config.leads.length];
  const support = config.supports[(index * 2 + 1) % config.supports.length];
  const patternIndex = index % 4;

  if (patternIndex === 0) return `${lead}. ${support}.`;
  if (patternIndex === 1) return `${support}. ${lead}.`;
  if (patternIndex === 2) return `${lead}. As you move through today, ${lowerFirst(support)}.`;
  return `${lead}. For now, ${lowerFirst(support)}.`;
}

function renderFullMessage(config, index) {
  const body = config.bodies[(index * 3 + 2) % config.bodies.length];
  const invitation = config.invitations[(index * 5 + 3) % config.invitations.length];
  const patternIndex = index % 4;

  if (patternIndex === 0) return `${body}. ${sentenceCase(invitation)}.`;
  if (patternIndex === 1) return `${body}. For now, ${invitation}.`;
  if (patternIndex === 2) return `${body}. If it feels supportive, ${invitation}.`;
  return `${body}. In this moment, ${invitation}.`;
}

export function generateCardLibrary() {
  const cards = [];
  const usedTitles = new Set();
  const usedSlugs = new Set();
  let cardNo = 1;

  CATEGORY_ORDER.forEach((category, categoryIndex) => {
    const config = CATEGORY_CONFIG[category];
    const titlePool = buildTitlePool(config);
    const quota = getCategoryQuota(categoryIndex);

    for (let i = 0; i < quota; i += 1) {
      let titleCursor = i;
      let title = titlePool[titleCursor];

      while (usedTitles.has(title) && titleCursor < titlePool.length - 1) {
        titleCursor += 1;
        title = titlePool[titleCursor];
      }

      usedTitles.add(title);
      let slug = slugify(title);
      const deckSlug = CATEGORY_TO_DECK[category] || DEFAULT_DECK_SLUG;

      if (usedSlugs.has(slug)) {
        slug = `${slug}-${category}`;
      }

      usedSlugs.add(slug);

      cards.push({
        deck_id: deckSlug,
        slug,
        card_no: cardNo,
        title,
        short_message: renderShortMessage(config, i),
        full_message: renderFullMessage(config, i),
        category,
        energy_tag: config.energyTags[i % config.energyTags.length],
        image_key: path.posix.join(category, slug),
        is_active: true,
      });

      cardNo += 1;
    }
  });

  return cards;
}

export function validateCardLibrary(cards) {
  const errors = [];
  const duplicateTitles = [];
  const duplicateSlugs = [];
  const duplicateCardNumbers = [];
  const titleSet = new Set();
  const slugSet = new Set();
  const cardNoSet = new Set();
  const categoryCounts = {};

  if (cards.length !== TOTAL_CARDS) {
    errors.push(`Expected ${TOTAL_CARDS} cards but found ${cards.length}.`);
  }

  cards.forEach((card) => {
    categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;

    if (titleSet.has(card.title)) duplicateTitles.push(card.title);
    titleSet.add(card.title);

    if (slugSet.has(card.slug)) duplicateSlugs.push(card.slug);
    slugSet.add(card.slug);

    if (cardNoSet.has(card.card_no)) duplicateCardNumbers.push(String(card.card_no));
    cardNoSet.add(card.card_no);

    const requiredFields = [
      "slug",
      "title",
      "short_message",
      "full_message",
      "category",
      "energy_tag",
      "image_key",
    ];

    requiredFields.forEach((field) => {
      if (!card[field] || String(card[field]).trim().length === 0) {
        errors.push(`Card ${card.card_no} is missing ${field}.`);
      }
    });
  });

  if (duplicateTitles.length > 0) {
    errors.push(`Duplicate titles detected: ${duplicateTitles.join(", ")}`);
  }

  if (duplicateSlugs.length > 0) {
    errors.push(`Duplicate slugs detected: ${duplicateSlugs.join(", ")}`);
  }

  if (duplicateCardNumbers.length > 0) {
    errors.push(`Duplicate card numbers detected: ${duplicateCardNumbers.join(", ")}`);
  }

  const counts = Object.values(categoryCounts);
  const max = Math.max(...counts);
  const min = Math.min(...counts);

  if (max - min > 1) {
    errors.push("Category distribution is not balanced.");
  }

  return {
    ok: errors.length === 0,
    errors,
    categoryCounts,
  };
}

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

export function buildSeedSql(cards) {
  const managedDeckSlugs = DECKS.map((deck) => `'${escapeSql(deck.slug)}'`).join(", ");
  const slugList = cards.map((card) => `'${escapeSql(card.slug)}'`).join(",\n  ");
  const deckValues = DECKS.map(
    (deck) =>
      `('${escapeSql(deck.name)}', '${escapeSql(deck.slug)}', '${escapeSql(deck.description)}', '${escapeSql(deck.cover_image_key)}', '${escapeSql(deck.theme_key)}', true, ${deck.is_premium ? "true" : "false"}, ${deck.sort_order})`
  ).join(",\n");
  const values = cards
    .map(
      (card) =>
        `((select id from decks where slug = '${escapeSql(card.deck_id)}'), '${escapeSql(card.slug)}', ${card.card_no}, '${escapeSql(card.title)}', '${escapeSql(card.short_message)}', '${escapeSql(card.full_message)}', '${escapeSql(card.category)}', '${escapeSql(card.energy_tag)}', '${escapeSql(card.image_key)}', ${card.is_active ? "true" : "false"})`
    )
    .join(",\n");

  return `-- Generated by scripts/generate-card-library.mjs
begin;

insert into decks (
  name,
  slug,
  description,
  cover_image_key,
  theme_key,
  is_active,
  is_premium,
  sort_order
)
values
${deckValues}
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  cover_image_key = excluded.cover_image_key,
  theme_key = excluded.theme_key,
  is_active = excluded.is_active,
  is_premium = excluded.is_premium,
  sort_order = excluded.sort_order,
  updated_at = now();

update cards
set
  slug = slug || '-legacy-' || substr(id::text, 1, 8),
  card_no = card_no + 1000,
  is_active = false,
  updated_at = now()
where deck_id in (select id from decks where slug in (${managedDeckSlugs}))
  and slug not in (
  ${slugList}
  )
  and slug !~ '-legacy-[0-9a-f]{8}$';

insert into cards (
  deck_id,
  slug,
  card_no,
  title,
  short_message,
  full_message,
  category,
  energy_tag,
  image_key,
  is_active
)
values
${values}
on conflict (slug) do update
set
  deck_id = excluded.deck_id,
  card_no = excluded.card_no,
  title = excluded.title,
  short_message = excluded.short_message,
  full_message = excluded.full_message,
  category = excluded.category,
  energy_tag = excluded.energy_tag,
  image_key = excluded.image_key,
  is_active = excluded.is_active,
  updated_at = now();

update cards
set is_active = false, updated_at = now()
where deck_id in (select id from decks where slug in (${managedDeckSlugs}))
  and slug not in (
  ${slugList}
  );

commit;
`;
}
