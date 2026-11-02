import { useState, useEffect, useRef, useId, useSyncExternalStore, Children, cloneElement } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import "./home.css";
import "./pages.css";

// ─── Icons (inline SVG to avoid lucide import issues) ───────────────────────
const Icon = ({ d, size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const IcoMenu = () => <Icon d="M3 12h18M3 6h18M3 18h18" />;
const IcoX = () => <Icon d="M18 6L6 18M6 6l12 12" />;
const IcoCheck = ({ size }) => <Icon d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" size={size} />;
const IcoSmartphone = () => <Icon d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcoCreditCard = () => <Icon d="M1 4h22v16H1zM1 10h22" />;
const IcoTag = () => <Icon d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" />;
const IcoChevLeft = () => <Icon d="M15 18l-6-6 6-6" />;
const IcoChevRight = () => <Icon d="M9 18l6-6-6-6" />;
const IcoPlus = ({ rotated }) => <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: rotated ? "rotate(45deg)" : "none", transition: "transform 0.3s" }}><path d="M12 5v14M5 12h14" /></svg>;
const IcoInstagram = () => <Icon d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" />;
const IcoFacebook = () => <Icon d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />;
const IcoLinkedin = () => <Icon d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />;
const IcoMail = () => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const IcoUser = () => <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />;
const IcoSend = () => <Icon d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />;
const IcoBriefcase = () => <Icon d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />;
const IcoBuilding = () => <Icon d="M3 21h18M9 21V7l7-4v18M3 21V11l6-4" />;
const IcoInfo = () => <Icon d="M12 22a10 10 0 100-20 10 10 0 000 20zM12 8h.01M11 12h1v4h1" />;
const IcoArrowLeft = () => <Icon d="M19 12H5M12 19l-7-7 7-7" />;
const IcoBook = () => <Icon d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />;
const IcoApple = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
const IcoGoogle = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M4.07 2.18C3.36 1.76 2.5 2.28 2.5 3.1v17.8c0 .82.86 1.34 1.57.92l15-8.9a1.05 1.05 0 000-1.84l-15-8.9z"/>
  </svg>
);
const IcoStar = ({ size = 16, color = "#f4c430" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 7.1-1.01L12 2z"/>
  </svg>
);

const APP_STORE_URL = "https://apps.apple.com/au/app/id6757898214";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.the.tool.box.app";
const VENDOR_PORTAL_URL = "https://admin-vendor-sync.lovable.app";

// ─── Data ────────────────────────────────────────────────────────────────────
// The 18 "New partners" below are deliberately logo: null - no logos supplied
// for these. VendorsPage/VendorProfilePage render a plain initial-letter tile
// in that case instead of a broken image, and the homepage marquee filters
// them out since it only shows real brand marks.
const VENDORS = [
  // Existing partners
  { name: "Elite Supplements", slug: "elite-supplements", category: "Supplements", featured: true, blurb: "Elite Supplements is our anchor vendor and one of the biggest supplement retailers in the country, with 20 stores across Victoria.", description: "Elite Supplements is our anchor vendor and one of the biggest supplement retailers in the country, with 20 stores across Victoria. ToolBox members get 10% off storewide in-store with a unique code, every time.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016410/Copy_of_Elite_Supplements_Logo_RGB_-_Elite_Supps_Chapel_St_brjj39.png" },
  { name: "Anthem Workwear", slug: "anthem-workwear", category: "Workwear", featured: true, blurb: "Anthem Workwear is a Melbourne-based performance workwear brand built for the trade lifestyle.", description: "Anthem Workwear is a Melbourne-based performance workwear brand built for the trade lifestyle. ToolBox members get 20% off storewide, in-store and online, with a unique code.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016355/Black_logo_1_-_Danna_Campos_mnrq6z.png" },
  { name: "BSCO", slug: "bsco", category: "Apparel", blurb: "BSCO makes men's underwear and socks from bamboo and modal fabric, built for comfort through a full day on the tools.", description: "BSCO makes men's underwear and socks from bamboo and modal fabric, built for comfort through a full day on the tools. ToolBox members get 15% off storewide online with a unique code.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016354/Untitled_design_6_b9hlh5.png" },
  { name: "Hard Hat", slug: "hard-hat", category: "Tech", blurb: "Hard Hat Smartwatches makes rugged, Australian-owned smartwatches rated IP68/IP69K, built to survive life on site.", description: "Hard Hat Smartwatches makes rugged, Australian-owned smartwatches rated IP68/IP69K, built to survive life on site. ToolBox members get 20% off storewide online with a unique code.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016353/Untitled_design_8_qgxiky.png" },
  { name: "Tradie Frames", slug: "tradie-frames", category: "Eyewear", blurb: "Tradie Frames makes AS/NZS certified safety glasses that don't look like safety glasses.", description: "Tradie Frames makes AS/NZS certified safety glasses that don't look like safety glasses. ToolBox members get 20% off storewide online with a unique code.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016352/Untitled_design_13_uyvpqx.png" },
  { name: "Nutrition Warehouse", slug: "nutrition-warehouse", category: "Supplements", blurb: "Nutrition Warehouse is one of Australia's largest supplement retailers, with 100+ stores nationwide plus online shopping.", description: "Nutrition Warehouse members get $10 off in-store with a unique code, plus a $10 voucher when you sign up to Active Rewards and free samples while you're in store.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016352/Untitled_design_12_ej4hui.png" },
  { name: "Recovery Lab", slug: "recovery-lab", category: "Recovery", blurb: "Recovery Lab is a recovery clinic based in Maribyrnong.", description: "Recovery Lab is a recovery clinic based in Maribyrnong. ToolBox members get 15% off in-store at the Maribyrnong location.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016352/Untitled_design_11_ykhwa4.png" },
  { name: "Fitspace", slug: "fitspace", category: "Fitness", blurb: "Fitspace Training is a boutique fitness studio in Melbourne offering group classes, personal training and recovery sessions.", description: "ToolBox members get $9 off the $50 Unlimited membership at Fitspace Training online with a set code.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016351/Untitled_design_15_wit0ju.png" },
  { name: "REPS Fitness", slug: "reps-fitness", category: "Fitness", blurb: "REPS Fitness is a 24/7 gym in Bayswater with personal training and modern equipment.", description: "REPS Fitness Bayswater gives ToolBox members 10% off online, with a new code each month.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016351/Untitled_design_17_sf5u7m.png", scale: 1.4 },
  { name: "Sunday Fairway", slug: "sunday-fairway", category: "Golf", blurb: "Sunday Fairway is an Australian brand making lightweight, pocket-sized golf rangefinders.", description: "ToolBox members get 15% off storewide at Sunday Fairway online with a unique code.", logo: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016351/Untitled_design_16_irf3fo.png" },
  // New partners (no logo - see note above)
  { name: "Kamikaze Energy", slug: "kamikaze-energy", category: "Energy Drinks", blurb: "Kamikaze Energy is an Australian energy drink brand with a zero-sugar range and a caffeine-free hydration line.", description: "Kamikaze Energy members get 15% off online with a set code.", logo: null },
  { name: "The Trade Shade", slug: "the-trade-shade", category: "Partner Brand", blurb: "The Trade Shade is an Australian-made magnetic umbrella holder built to keep tradies and their gear out of the sun.", description: "The Trade Shade members get 20% off online.", logo: null },
  { name: "Rosco's Pizza", slug: "roscos-pizza", category: "Food", blurb: "Rosco's Pizza is a Melbourne pizzeria serving classic and gourmet pizzas.", description: "ToolBox members get 10% off in-store at Rosco's Pizza.", logo: null },
  { name: "Ruff Supplied", slug: "ruff-supplied", category: "Workwear", blurb: "Ruff Supplied makes reusable hard hat sweatbands, designed on-site by two Australian tradies tired of throwaway gear.", description: "Ruff Supplied members get 10% off online with a unique code.", logo: null },
  { name: "Gameday Jumbotrons", slug: "gameday-jumbotrons", category: "Tech", blurb: "Gameday Jumbotrons designs and builds patented mini jumbotron screens in Australia for man caves, sports bars and entertainment venues.", description: "ToolBox members get a free RGB light upgrade (valued at $200) at Gameday Jumbotrons online, with a new code each month.", logo: null },
  { name: "TUFFSTRAPS", slug: "tuffstraps", category: "Gear", blurb: "TUFFSTRAPS makes heavy-duty utility straps for securing ladders, timber and gear to roof racks.", description: "TUFFSTRAPS members get 15% off online with a unique code.", logo: null },
  { name: "Roam Essentials", slug: "roam-essentials", category: "Partner Brand", blurb: "Roam Essentials makes a cordless heated lunchbox so you can get a hot meal on the job site without a microwave.", description: "Roam Essentials members get 15% off online with a unique code.", logo: null },
  { name: "Vida Lifestyles", slug: "vida-lifestyles", category: "Recovery", blurb: "Vida Lifestyles is a chiropractic and naturopathy clinic in Sandringham.", description: "ToolBox members get a $99 comprehensive initial consult and report at Vida Lifestyles, saving $350 off the regular price. In-store, monthly code, one per member.", logo: null },
  { name: "The Work Pit", slug: "the-work-pit", category: "Partner Brand", blurb: "The Work Pit is a Ringwood workwear store stocking brands like FXD, Blundstone and Steel Blue, plus custom embroidery.", description: "The Work Pit members get 10% off in-store and online with a unique code.", logo: null },
  { name: "Tradesman Nutrition", slug: "tradesman-nutrition", category: "Supplements", featured: true, blurb: "Tradesman Nutrition is a supplement brand built for tradies, making creatine, pre-workout, fat burners and more.", description: "Tradesman Nutrition members get 10% off online with a set code.", logo: null },
  { name: "Industrial Strength and Fitness", slug: "industrial-strength-and-fitness", category: "Fitness", blurb: "Industrial Strength & Fitness is a 24-hour gym in Reservoir with HIIT, boxing, strength training and martial arts classes.", description: "New members get 15% off memberships at Industrial Strength and Fitness, in-store, one per member.", logo: null },
  { name: "BitPocket", slug: "bitpocket", category: "Tech", blurb: "BitPocket makes a magnetic drill bit holder for tool belts.", description: "BitPocket makes a magnetic drill bit holder for tool belts. ToolBox members get 25% off online with a unique code.", logo: null },
  { name: "Straight Mate", slug: "straight-mate", category: "Tools", featured: true, blurb: "Straight Mate makes the Chippy Square, a carpenter's marking and measuring tool, built on the Mornington Peninsula.", description: "Straight Mate makes the Chippy Square, a carpenter's marking and measuring tool. ToolBox members get 15% off online with a set code.", logo: null },
  { name: "Maroondah Golf Park", slug: "maroondah-golf-park", category: "Golf", blurb: "Maroondah Golf Park is a driving range and mini golf venue in Chirnside Park.", description: "ToolBox members get $3 off 100 range balls ($16 instead of the regular price) at Maroondah Golf Park, in-store.", logo: null },
  { name: "Sigma Movement", slug: "sigma-movement", category: "Fitness", blurb: "Sigma Movement is a gym and recovery studio in South Croydon with private coaching, group programs and a recovery room.", description: "Sigma Movement in South Croydon offers ToolBox members 15% off gym membership and casual recovery visits, in-store.", logo: null },
  { name: "Future Golf", slug: "future-golf", category: "Golf", blurb: "Future Golf is a membership app connecting golfers to 220+ partner courses, driving ranges and simulators across Australia.", description: "ToolBox members get 20% off all annual memberships at Future Golf online with a set code.", logo: null },
  { name: "Jukes Grooming", slug: "jukes-grooming", category: "Grooming", blurb: "Jukes Grooming is a Melbourne-made men's hair and beard care range stocked in salons and barbershops.", description: "Jukes Grooming members get 20% off online with a set code, one per member.", logo: null },
  { name: "The Barber Club", slug: "the-barber-club", category: "Grooming", blurb: "The Barber Club is one of Melbourne's oldest barbershop chains, with locations across Bentleigh, Port Melbourne, Richmond, Ringwood and Yarraville.", description: "ToolBox members get 20% off their first visit at The Barber Club, in-store with a set code, one per member.", logo: null },
];

// Public directory (/vendors) never shows exact discount amounts - those stay
// exclusive to the app. Each vendor gets a researched, non-deal "blurb" where
// we found one (what the brand actually is), else just the fallback line.
const PUBLIC_OFFER_FALLBACK = "Exclusive discount available in the app for ToolBox members.";
function publicOffer(vendor) {
  return vendor.blurb ? `${vendor.blurb} ${PUBLIC_OFFER_FALLBACK}` : PUBLIC_OFFER_FALLBACK;
}

const APP_REVIEWS = [
  { rating: 5, title: "The Best Discount App I've Used", date: "25 July", author: "JTurnbulll", text: "Such a brilliant idea! The Toolbox app has honestly helped me save so much money on things I already buy all the time. The range of discounts is fantastic, especially the tradie discounts, but there are heaps of other offers across everyday brands and services too. It's easy to use, the savings add up quickly, and it's much better than wasting time searching for discount codes online. If you're looking to save money on your regular purchases, I'd definitely recommend giving it a go!" },
  { rating: 5, title: "So Much Value", date: "25 July", author: "Hbbbrown", text: "Heaps of great deals at some of my favourite stores. The app itself is easy to use and I can also track how much I've saved in total!" },
  { rating: 5, title: "10/10", date: "25 July", author: "MJH26016", text: "Extremely functional and easy for all to use, helps me to save money on so many essential things!" },
  { rating: 5, title: "Everyone NEEDS this app!!", date: "25 July", author: "EJP1705", text: "10/10! Can't recommend this app enough!!! Saving so much money on the things I want and love. Everyone needs this 💪" },
  { rating: 5, title: "Ease of use!", date: "29 July", author: "Jjjay78", text: "Such a clean and easy to use app, membership price pays itself back in a couple of purchases." },
  { rating: 5, title: "Great app", date: "31 July", author: "Tomthorn4", text: "Amazing app so easy to use and saving me so much money already, honestly feels like a life hack" },
];

const LOGO = "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016811/TheToolbox-White_2x_iqjf8y.png";

const BLOG_POSTS = [
  {
    id: 1,
    slug: "5-ways-tradies-save-money-on-gear",
    title: "5 Ways to Stretch Your Pay on the Tools",
    category: "Tradie Tips",
    date: "May 20, 2025",
    readTime: "4 min read",
    author: "The ToolBox Team",
    excerpt: "Being on the tools is expensive. Between boots, workwear, supps, and smoko runs  -  it adds up fast. Here's how savvy tradies are keeping more cash in their pocket.",
    content: [
      { type: "p", text: "Let's be real  -  being a tradie is expensive. By the time you've kitted yourself out with proper boots, decent workwear, a few supplements to keep you going, and whatever your ute needs this week, the pay cheque doesn't stretch as far as it should." },
      { type: "p", text: "But there are ways to claw that money back. Here are five things smart tradies are doing to keep more cash in their pocket without cutting corners on quality." },
      { type: "h2", text: "1. Use a Discount Membership App" },
      { type: "p", text: "Discount apps built specifically for tradies  -  like The ToolBox  -  negotiate bulk discounts with the brands you're already buying from. Instead of paying RRP on workwear, supplements, and tools, members pay significantly less just by flashing a digital card. A $4.99 membership pays for itself the first time you use it." },
      { type: "h2", text: "2. Buy Consumables in Bulk" },
      { type: "p", text: "Screws, sandpaper, drill bits, cable ties  -  consumables are a death by a thousand cuts. Buying in bulk from a trade supplier versus grabbing a small pack from the nearest hardware chain can cut costs by 40–60% over a year. One bulk buy sets you up for months." },
      { type: "h2", text: "3. Meal Prep for the Work Week" },
      { type: "p", text: "Smoko and lunch runs might feel small  -  $15 here, $20 there  -  but five days a week, 48 weeks a year, that's potentially $4,000 you've handed to the servo or the burger joint. Spending two hours on Sunday prepping meals is one of the highest-value uses of your weekend." },
      { type: "h2", text: "4. Look After Your Gear" },
      { type: "p", text: "A good pair of work boots costs $200–$400. Proper care  -  cleaning, conditioning, waterproofing  -  can double their lifespan. The same goes for power tools. Regular maintenance and proper storage means fewer replacements and less out of pocket every year." },
      { type: "h2", text: "5. Compare Before You Buy" },
      { type: "p", text: "Most tradies buy from the place they already know. Taking 5 minutes to compare online before heading in regularly saves real money on big purchases. Stack that with a discount membership and you're looking at serious savings over the year." },
      { type: "p", text: "The tradie lifestyle shouldn't mean being the last one to benefit from the industries you literally build. Use every tool at your disposal  -  including the financial ones." },
    ],
  },
  {
    id: 2,
    slug: "fuelling-your-body-on-site",
    title: "Why What You Eat & Drink on Site Matters More Than You Think",
    category: "Health & Fitness",
    date: "May 12, 2025",
    readTime: "5 min read",
    author: "The ToolBox Team",
    excerpt: "Your body is your biggest tool. What you fuel it with on site directly affects how you perform, recover, and feel at the end of a long day.",
    content: [
      { type: "p", text: "Most tradies wouldn't show up to site with a power tool running on empty batteries. But plenty of blokes rock up having skipped breakfast, powering through on two coffees and whatever the smoko run brings. Your body isn't any different to that drill  -  fuel matters." },
      { type: "h2", text: "The Physical Reality of Trade Work" },
      { type: "p", text: "Trade work is physically demanding in ways that are easy to underestimate. Electricians are constantly crouching, reaching, and carrying. Carpenters lift, swing, and maintain balance on scaffolding for hours. Plumbers spend half the day in positions that would make a physio wince. The caloric and nutritional demands are high  -  and most standard dietary advice isn't written for this lifestyle." },
      { type: "h2", text: "Hydration Is the First Priority" },
      { type: "p", text: "Before you think about pre-workouts or protein shakes, get your water intake right. Dehydration of just 2% of body weight has been shown to impair physical performance and cognitive function. On a summer site, that's easy to hit before lunch. A water bottle you actually keep filled  -  ideally with electrolytes on hot days  -  is the highest ROI investment for on-site performance." },
      { type: "h2", text: "Protein for Recovery" },
      { type: "p", text: "Construction and trade work breaks down muscle tissue. Without adequate protein to repair it, you'll feel it in your joints and energy levels within weeks. Aim for 1.6–2.2g of protein per kg of bodyweight if you're doing heavy physical work. A quality protein supplement post-work makes hitting those numbers manageable without eating six chicken breasts a day." },
      { type: "h2", text: "What About Supps?" },
      { type: "p", text: "The supplement market is flooded, and a lot of it is overpriced noise. But a few categories are genuinely useful for tradies: creatine for strength and power output, magnesium for muscle recovery and sleep quality, and omega-3s for joint health. These are supported by solid research and make a real difference with consistent use." },
      { type: "p", text: "The key is buying quality without paying retail markup. Partners like Elite Supplements and Nutrition Warehouse  -  both in The ToolBox network  -  carry the brands worth buying at prices that make consistent supplementation practical on a tradie budget." },
      { type: "h2", text: "The Long Game" },
      { type: "p", text: "Your body is your career. The blokes still running their own business at 55 didn't get there by grinding themselves into the ground at 35. Eating well, recovering properly, and looking after your physical health isn't soft  -  it's the smartest business decision you can make." },
    ],
  },
  {
    id: 3,
    slug: "elite-supps-vendor-spotlight",
    title: "Vendor Spotlight: Elite Supplements",
    category: "Vendor Spotlight",
    date: "May 5, 2025",
    readTime: "3 min read",
    author: "The ToolBox Team",
    excerpt: "Elite Supplements is one of Australia's biggest supplement retailers  -  and one of the first brands to partner with The ToolBox. Here's why it's a no-brainer for tradies.",
    content: [
      { type: "p", text: "When we were putting together the vendor network for The ToolBox, supplements were a category we knew had to be done right. Tradies are physically active, they burn through energy, and they need quality products at a price that makes sense. Elite Supplements was the obvious first call." },
      { type: "h2", text: "Who Are Elite Supplements?" },
      { type: "p", text: "Elite Supplements is one of Australia's largest specialty supplement retailers, with stores across Victoria and a massive online range. They stock everything from protein and pre-workouts through to vitamins, recovery gear, and health foods  -  all from the brands that actually matter." },
      { type: "p", text: "Unlike the generic health aisle at the supermarket, Elite Supplements staff actually know their stuff. If you're not sure what you need, you'll get a straight answer rather than a sales pitch for whatever has the biggest margin." },
      { type: "h2", text: "Why Supplements Matter for Tradies" },
      { type: "p", text: "Trade work is hard on the body. Long days, physical strain, and early starts mean your recovery and energy needs are higher than the average office worker. Quality protein helps repair muscle tissue, creatine supports strength output, and magnesium helps you actually sleep after a big day. These aren't gym bro extras  -  they're practical tools for anyone doing physical work for a living." },
      { type: "h2", text: "What ToolBox Members Get" },
      { type: "p", text: "As a ToolBox member, you get an exclusive discount at Elite Supplements  -  in-store and online. Whether you're picking up your usual protein tub or trying something new for recovery, the savings add up across the year. For members who buy supps regularly, this deal alone covers the membership cost multiple times over." },
      { type: "h2", text: "Find Them in the App" },
      { type: "p", text: "Once you're a member, Elite Supplements appears in your partner deals alongside 60+ other brands. Show your digital card in-store or use the member code online. No hassle, no printing vouchers." },
      { type: "link", text: "View Elite Supplements on The ToolBox", to: "/vendors/elite-supplements" },
    ],
  },
  {
    id: 4,
    slug: "the-toolbox-is-now-live",
    title: "The ToolBox Is Now Live on iOS & Android",
    category: "News",
    date: "July 25, 2026",
    readTime: "3 min read",
    author: "The ToolBox Team",
    excerpt: "After months of building, testing, and signing up 60+ partner brands  -  The ToolBox is officially live on the App Store and Google Play. Here's what that means for Australian tradies.",
    content: [
      { type: "p", text: "It's here. The ToolBox  -  Australia's first discount membership app built specifically for tradies  -  is now available to download on the App Store and Google Play. For $4.99 a month, members get instant access to exclusive deals across workwear, supplements, fitness, grooming, food, tech, and more." },
      { type: "h2", text: "What We Built and Why" },
      { type: "p", text: "The idea behind The ToolBox is simple: tradies spend serious money on the gear, food, and lifestyle that keeps them going  -  but they never get the bulk buying power that corporate memberships or big brands take for granted. We fixed that." },
      { type: "p", text: "We went out and negotiated directly with 60+ Australian brands to lock in real discounts  -  not token offers, but genuine savings on the stuff you're already buying. Then we packaged it all into an app that lives in your pocket and pays for itself the first time you use it." },
      { type: "h2", text: "200 Founding Members Before We Even Launched" },
      { type: "p", text: "One of the things that made this launch special: over 200 people joined the waitlist before we went live. That's 200 tradies who saw the value before a single deal was redeemable. Those are our Founding Members  -  they're locked in at $4.99/mo for life, no matter where pricing goes." },
      { type: "p", text: "Founding Member spots are still available for the first people who download and subscribe, but they're limited to the first 500 - check the app for real-time availability. Once those are gone, they're gone." },
      { type: "h2", text: "What's Available Right Now" },
      { type: "p", text: "From day one, the app includes deals across a huge range of categories: workwear from Anthem Workwear and Ruff Supplied, supplements from Elite Supplements and Nutrition Warehouse, energy from Kamikaze Energy, fitness at Industrial Strength and Fitness, Reps Fitness Bayswater, and Fitspace Training, recovery at Resilient Recovery, grooming at Jukes Grooming and The Barber Club, tech from BitPocket and Hard Hat Smartwatches, golf at Future Golf, Sundayfairway, and Maroondah Golf Park, and a lot more." },
      { type: "h2", text: "Download It Now" },
      { type: "p", text: "The ToolBox is free to download on both the App Store and Google Play. The $4.99/mo membership unlocks every partner deal in the app. If you do the numbers on even two or three of the deals available, it pays for itself before the end of the month." },
      { type: "p", text: "Search 'The ToolBox' on the App Store or Google Play, or head to thetoolboxapp.com.au and tap the download button. We'll see you in there." },
    ],
  },
  {
    id: 5,
    slug: "best-tradie-workwear-deals-australia",
    title: "The Best Workwear Deals for Tradies in Australia Right Now",
    category: "Tradie Tips",
    date: "July 18, 2026",
    readTime: "5 min read",
    author: "The ToolBox Team",
    excerpt: "Good workwear isn't cheap  -  but it should last. Here's how Australian tradies are getting quality gear at real prices, and which brands are worth your money.",
    content: [
      { type: "p", text: "Tradie workwear is one of those categories where you genuinely get what you pay for. A cheap pair of work pants falls apart in a month. Boots that aren't rated properly are a safety hazard. But quality gear at full retail adds up fast  -  especially if you're kitting out a crew or replacing items regularly." },
      { type: "p", text: "Here's what's actually worth buying, and how to get it at a price that doesn't hurt." },
      { type: "h2", text: "Anthem Workwear  -  Purpose-Built for the Site" },
      { type: "p", text: "Anthem Workwear designs gear specifically for tradies  -  not rebranded outdoor clothing, but workwear engineered for the demands of the site. ToolBox members get an exclusive member discount both online and in-store, which on a full kit makes a meaningful difference." },
      { type: "h2", text: "Ruff Supplied  -  Built Tough, No Fluff" },
      { type: "p", text: "Ruff Supplied has built a following in the tradie community for exactly what the name suggests: gear that holds up to real work. ToolBox members save on every order, and on regular purchases for consumables and workwear it stacks up fast over a year." },
      { type: "h2", text: "Tradie Frames  -  Protect Your Eyes on Site" },
      { type: "p", text: "Eye protection is non-negotiable in most trades, and Tradie Frames makes safety eyewear that doesn't look like it came out of a 1990s safety catalogue. ToolBox members get an exclusive discount  -  for something you're legally required to wear on most sites, getting quality at member price is a no-brainer." },
      { type: "h2", text: "The Trade Shade  -  Sun Protection That Works on Site" },
      { type: "p", text: "Outdoor tradies cop more UV than almost anyone. The Trade Shade makes sun-protection gear built for working conditions  -  not beach holidays. ToolBox members save on a brand that takes skin protection seriously for people who spend their lives under the Australian sun." },
      { type: "h2", text: "How to Stack Your Savings" },
      { type: "p", text: "The real play with workwear isn't getting a one-off discount  -  it's having a consistent supplier you're getting a discount from every time. A ToolBox membership at $4.99/mo gives you ongoing access to all of these brands, so every workwear purchase across the year is cheaper than retail." },
      { type: "p", text: "If you spend $600 a year on workwear, the member savings across these brands add up well beyond what the membership costs. You're ahead before you've bought a single supplement or paid for a gym session." },
    ],
  },
  {
    id: 6,
    slug: "tradie-fitness-recovery-guide",
    title: "The Tradie's Guide to Fitness and Recovery in 2026",
    category: "Health & Fitness",
    date: "July 10, 2026",
    readTime: "6 min read",
    author: "The ToolBox Team",
    excerpt: "Trade work is physically brutal. Here's how to train smart, recover faster, and keep your body working for you  -  not against you  -  with help from The ToolBox's fitness partners.",
    content: [
      { type: "p", text: "Trade work puts serious miles on your body. The repetitive movements, heavy lifts, awkward positions, and long days in the sun take a physical toll that most fitness advice doesn't account for. The goal isn't to go harder  -  it's to last longer." },
      { type: "h2", text: "Train to Support the Work, Not Compete With It" },
      { type: "p", text: "The biggest mistake active tradies make in the gym is training the same muscles they've been hammering all day. If you're a carpenter spending eight hours with a hammer in your dominant hand, you don't need more pressing volume at the gym. You need antagonist work  -  pulling movements, rotator cuff stability, and hip mobility that counterbalances what the job demands." },
      { type: "p", text: "Industrial Strength and Fitness is one of the best gym partners in The ToolBox network for this. As a specialist strength facility with an exclusive member discount, it's built for people who take training seriously  -  not a casual spin bike and sauna setup." },
      { type: "h2", text: "Recovery Is Where the Gains Are Made" },
      { type: "p", text: "Resilient Recovery specialises in exactly what the name says: helping your body bounce back faster. For tradies, soft tissue work, compression, and structured recovery isn't a luxury  -  it's maintenance. ToolBox members get an exclusive discount, and for anyone with ongoing joint or muscle issues from the job, it's one of the most valuable deals in the app." },
      { type: "h2", text: "Gym Options for Every Lifestyle" },
      { type: "p", text: "Not every tradie wants the same gym experience. Reps Fitness Bayswater offers a solid facility with a member discount for ToolBox users  -  good for members who want straightforward, no-frills training access. Fitspace Training gives members a discount per session that across the week adds up to real money." },
      { type: "h2", text: "Nutrition Makes the Difference" },
      { type: "p", text: "You can train perfectly and still feel ordinary if your nutrition is off. Nutrition Warehouse has one of the widest ranges of health and supplement products available, with exclusive in-store savings for ToolBox members. Sigma Movement  -  another ToolBox partner  -  covers functional health from a movement-first perspective." },
      { type: "h2", text: "Fuel for the Day" },
      { type: "p", text: "Edge Endurance rounds out the fitness ecosystem in the app with member savings for ToolBox users. For tradies who need sustained energy performance  -  not just a pre-workout spike  -  performance nutrition from a brand that understands endurance is worth keeping in the kit." },
      { type: "p", text: "Building a fitness and recovery routine that actually works around trade hours is hard. Having the right partners at member prices makes it easier to stay consistent without blowing the budget." },
    ],
  },
  {
    id: 7,
    slug: "tradie-lifestyle-perks-toolbox-partners",
    title: "Life Beyond the Site: Tradie Lifestyle Perks With The ToolBox",
    category: "Lifestyle",
    date: "July 3, 2026",
    readTime: "4 min read",
    author: "The ToolBox Team",
    excerpt: "The ToolBox isn't just about workwear and supps. From golf and grooming to food and crypto, here's what founding members are actually using it for.",
    content: [
      { type: "p", text: "When we designed The ToolBox, we didn't want to build just another discount on hard hats. Tradies work hard and they spend money across a full life  -  not just on site. So we went out and built a partner network that covers the whole lifestyle." },
      { type: "h2", text: "Golf  -  Because You've Earned It" },
      { type: "p", text: "Golf has always been the tradie's sport of choice on the weekend, and the ToolBox has three partners making it more accessible. Future Golf, Sundayfairway  -  the online golf retail destination  -  and Maroondah Golf Park all offer exclusive member discounts, so your regular Saturday hit doesn't cost what it used to." },
      { type: "h2", text: "Grooming  -  Looking the Part Off the Tools" },
      { type: "p", text: "Jukes Grooming gives ToolBox members an exclusive discount  -  a grooming brand that actually understands the tradie market. The Barber Club also offers a member discount in-store, with a one-per-member policy that keeps the deal fair. For guys who get a regular cut, that's real money over the year." },
      { type: "h2", text: "Food  -  Smoko Done Right" },
      { type: "p", text: "Rosco's Pizza is in the ToolBox network with a member discount  -  because not every meal needs to be a protein shake. Good food, solid savings, no questions asked." },
      { type: "h2", text: "Energy  -  Keeping You Sharp Through the Day" },
      { type: "p", text: "Kamikaze Energy gives members an exclusive discount. Whether you're running on black coffee or prefer a clean energy product that actually works on a long day, having a member rate on your regular energy brand is one of those small saves that adds up without you noticing." },
      { type: "h2", text: "Tech  -  Smarter Gear for the Modern Tradie" },
      { type: "p", text: "Hard Hat Smartwatches  -  a brand making watches that actually hold up on site, rather than the fashion-forward stuff that doesn't survive a week in the field  -  gives members an exclusive discount. BitPocket rounds out the tech category with a magnetic drill bit holder built for tool belts, and one of the biggest member discounts in the app." },
      { type: "h2", text: "One App, All of It" },
      { type: "p", text: "The point of The ToolBox isn't to be a coupon book. It's to be the one membership that actually covers the way tradies live  -  hard during the week, enjoying it on the weekend. $4.99 a month, and every deal is in your pocket the moment you download the app." },
    ],
  },
  {
    id: 8,
    slug: "30-vendor-partners-toolbox-network",
    title: "60+ Brand Partnerships: How The ToolBox Built Australia's Best Tradie Deal Network",
    category: "Vendor Spotlight",
    date: "June 25, 2026",
    readTime: "5 min read",
    author: "The ToolBox Team",
    excerpt: "Getting 60+ brands on board before launch wasn't easy. Here's how The ToolBox built a deal network that actually works for tradies  -  and what it means for members.",
    content: [
      { type: "p", text: "Building a discount network that tradies would actually use meant doing two things most apps don't bother with: finding brands tradies already love, and negotiating deals that are genuinely worth redeeming. Here's how we got to 60+ partners before we even launched." },
      { type: "h2", text: "Why Vendor Partnerships Matter" },
      { type: "p", text: "A discount app is only as good as its partners. Generic 5%-off vouchers at brands nobody uses don't save anyone money. From the start, we focused on building relationships with brands that already had tradie audiences  -  and negotiating minimums that made the membership worth carrying." },
      { type: "p", text: "The result: real deals across categories that cover the full tradie lifestyle  -  not token offers, but savings members actually notice." },
      { type: "h2", text: "Workwear & Protection" },
      { type: "p", text: "Anthem Workwear, Ruff Supplied, Tradie Frames, and The Trade Shade cover everything from hi-vis and pants to sun protection and safety eyewear. These are brands built for people working outdoors in Australian conditions  -  not fashion brands with a workwear line. Every one of them offers exclusive member pricing through the app." },
      { type: "h2", text: "Fitness, Health & Supplements" },
      { type: "p", text: "This is the biggest category in the app. Elite Supplements, Nutrition Warehouse, and Edge Endurance cover nutrition and supplements at member rates, while BSCO (bamboo underwear and socks) and Roam Essentials (a cordless heated lunchbox) cover the everyday gear. For fitness, Industrial Strength and Fitness, Reps Fitness Bayswater, Fitspace Training, and Sigma Movement give members access to quality facilities at exclusive prices. Resilient Recovery rounds out the health stack for anyone managing the physical wear of trade work." },
      { type: "h2", text: "Lifestyle, Grooming & Tech" },
      { type: "p", text: "Jukes Grooming and The Barber Club both offer exclusive member discounts. Hard Hat Smartwatches and BitPocket cover the tech angle with some of the best deals in the app. Roam Essentials keeps lunch hot on site. Rosco's Pizza handles the smoko runs." },
      { type: "h2", text: "Golf & Recreation" },
      { type: "p", text: "Three golf partners  -  Future Golf, Sundayfairway, and Maroondah Golf Park  -  make The ToolBox one of the few memberships that actually rewards tradies for how they spend their weekends, with exclusive member rates across online retail and on-course rounds." },
      { type: "h2", text: "More Coming" },
      { type: "p", text: "We're actively signing new partners. The brief we give every potential partner is simple: tradies spend real money in your category. Give them a deal worth having. If that sounds like your brand, reach out through the Vendor Portal  -  we'd love to talk." },
      { type: "p", text: "If you're a tradie, the best time to join is now. Founding member spots are limited, the price won't stay this low forever, and the network is only getting bigger." },
    ],
  },
];

// ─── SEO Helper ──────────────────────────────────────────────────────────────
const BASE_URL = "https://thetoolboxapp.com.au";
const DEFAULT_OG_IMAGE = "https://res.cloudinary.com/awdppzgh/image/upload/v1789191420/Start_saving_today.png";
function setPageMeta(title, description, path, opts = {}) {
  const { type = "website", image = DEFAULT_OG_IMAGE, publishedTime = null } = opts;
  document.title = title;
  const url = `${BASE_URL}${path}`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
  document.querySelector('meta[property="og:type"]')?.setAttribute("content", type);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:image"]')?.setAttribute("content", image);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
  document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", image);

  let publishedMeta = document.querySelector('meta[property="article:published_time"]');
  if (publishedTime) {
    if (!publishedMeta) {
      publishedMeta = document.createElement("meta");
      publishedMeta.setAttribute("property", "article:published_time");
      document.head.appendChild(publishedMeta);
    }
    publishedMeta.setAttribute("content", publishedTime);
  } else if (publishedMeta) {
    publishedMeta.remove();
  }
}

function setJsonLd(id, data) {
  let script = document.getElementById(id);
  if (data == null) { script?.remove(); return; }
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

// ─── Site chrome (shared by every page) ───────────────────────────────────────
const MOBILE_NAV_ITEMS = [
  { label: "Vendors", sub: "Browse 60+ partner brands", href: "/#vendors", icon: IcoTag },
  { label: "How it works", sub: "See the app step by step", href: "/#about", icon: IcoSmartphone },
  { label: "Pricing", sub: "Plans from $4.99/mo", href: "/#pricing", icon: IcoCreditCard },
  { label: "FAQ", sub: "Got a question?", href: "/#faq", icon: IcoInfo },
  { label: "Blog", sub: "Tips & savings guides", to: "/blog", icon: IcoBook },
  { label: "Partner with us", sub: "List your brand", to: "/vendor", icon: IcoBriefcase },
];

// Fades .rv elements in as they scroll into view (and reveals anything already scrolled past).
function useReveal(rootRef) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting && e.boundingClientRect.top >= 0) return;
        e.target.classList.add("in");
        observer.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rootRef.current?.querySelectorAll(".rv").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef]);
}

function SiteNav({ onGetApp }) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // The nav is dark while its midline sits over a [data-nav="dark"] section (hero, page header, navy bands).
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 24);
      setDark([...document.querySelectorAll('[data-nav="dark"]')].some(el => {
        const r = el.getBoundingClientRect();
        return r.top <= 48 && r.bottom > 48;
      }));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const current = (p) => (pathname === p || pathname.startsWith(`${p}/`) ? "page" : undefined);

  return (
    <>
      <nav className={`h-nav ${scrolled ? "is-scrolled" : ""} ${dark ? "is-dark" : ""}`} aria-label="Main">
        <div className="h-nav__inner">
          <div className="h-nav__left">
            <Link to="/" aria-label="The ToolBox home" className="h-brandlink"><img src={LOGO} alt="The ToolBox" className="h-logo" /></Link>
            <div className="h-nav__links">
              <a className="h-link" href="/#vendors">Vendors</a>
              <a className="h-link" href="/#about">How it works</a>
              <a className="h-link" href="/#pricing">Pricing</a>
              <a className="h-link" href="/#faq">FAQ</a>
              <Link className="h-link" to="/blog" aria-current={current("/blog")}>Blog</Link>
              <Link className="h-link" to="/vendor" aria-current={current("/vendor")}>Partner with us</Link>
            </div>
          </div>
          <div className="h-nav__cta">
            <button className="btn btn--yellow btn--app" onClick={onGetApp}>Get the App</button>
            <a className="btn btn--ghost btn--portal" href={VENDOR_PORTAL_URL} target="_blank" rel="noopener noreferrer">Vendor Portal</a>
            <button className="btn h-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><IcoMenu /></button>
          </div>
        </div>
      </nav>

      <div className={`h-sheet ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="h-sheet__bar">
          <img src={LOGO} alt="The ToolBox" className="h-logo" style={{ filter: "brightness(0)" }} />
          <button className="btn h-menu-btn" style={{ display: "inline-flex" }} onClick={() => setMenuOpen(false)} aria-label="Close menu"><IcoX /></button>
        </div>
        <div className="h-sheet__body">
          <p className="h-sheet__q">Where do you want to go?</p>
          <div className="h-sheet__grid">
            {MOBILE_NAV_ITEMS.map((item, i) => {
              const ItemIcon = item.icon;
              const inner = (
                <>
                  <div className="h-tile__ico"><ItemIcon /></div>
                  <strong>{item.label}</strong>
                  <span>{item.sub}</span>
                </>
              );
              return item.to ? (
                <Link key={item.label} className="h-tile" style={{ "--i": i }} to={item.to} onClick={() => setMenuOpen(false)}>{inner}</Link>
              ) : (
                <a key={item.label} className="h-tile" style={{ "--i": i }} href={item.href} onClick={() => setMenuOpen(false)}>{inner}</a>
              );
            })}
          </div>
        </div>
        <div className="h-sheet__foot">
          <button className="btn btn--yellow" onClick={() => { setMenuOpen(false); onGetApp(); }}>Get the App</button>
          <a className="btn" href={VENDOR_PORTAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Vendor Portal</a>
        </div>
      </div>
    </>
  );
}

const FOOTER_COLS = [
  { title: "Company", links: [
    { label: "Partner Brands", href: "/#vendors" },
    { label: "How it works", href: "/#about" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Contact Us", to: "/contact" },
    { label: "FAQ", href: "/#faq" },
    { label: "Blog", to: "/blog" },
  ]},
  { title: "Partners", links: [
    { label: "Vendor Directory", to: "/vendors" },
    { label: "Partner With Us", to: "/vendor" },
    { label: "Vendor Portal", href: VENDOR_PORTAL_URL, external: true },
  ]},
  { title: "Legal", links: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Refund Policy", to: "/refunds" },
  ]},
];

function Footer() {
  return (
    <>
      <div className="h-hazard" aria-hidden="true" />
      <footer className="h-footer" data-nav="dark">
        <div className="h-footer__in">
          <div className="h-footer__grid">
            <div>
              <img src={LOGO} alt="The ToolBox" className="h-footer__logo" />
              <p className="h-footer__blurb">Australia's first discount membership app built for the trade lifestyle. Real deals for people who earn it.</p>
            </div>
            {FOOTER_COLS.map(col => (
              <nav key={col.title} aria-label={col.title}>
                <p className="h-footer__title">{col.title}</p>
                <ul>
                  {col.links.map(l => (
                    <li key={l.label}>
                      {l.to ? <Link className="h-flink" to={l.to}>{l.label}</Link>
                        : <a className="h-flink" href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{l.label}</a>}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="h-footer__bar">
            <p>&copy; {new Date().getFullYear()} The ToolBox App Pty Ltd. All rights reserved.</p>
            <div className="h-footer__social">
              {[
                { icon: <IcoInstagram />, href: "https://www.instagram.com/thetoolboxau/", label: "Instagram" },
                { icon: <IcoFacebook />, href: "https://www.facebook.com/thetoolboxau", label: "Facebook" },
                { icon: <IcoLinkedin />, href: "https://www.linkedin.com/company/thetoolboxau", label: "LinkedIn" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.icon}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// Wraps every inner page: nav, download modal, footer.
function PageShell({ children }) {
  const rootRef = useRef(null);
  const [showDL, setShowDL] = useState(false);
  useReveal(rootRef);
  useEffect(() => {
    document.body.classList.add("theme-light");
    return () => document.body.classList.remove("theme-light");
  }, []);
  return (
    <div className="home" ref={rootRef}>
      {showDL && <DownloadModal onClose={() => setShowDL(false)} />}
      <SiteNav onGetApp={() => setShowDL(true)} />
      {children}
      <Footer />
    </div>
  );
}

// Navy page header with a hazard stripe underneath; the nav sits on it like the homepage hero.
function PageHeader({ eyebrow, title, lede, meta, narrow = false }) {
  return (
    <header className="pg-head" data-nav="dark">
      <div className={`pg-head__in ${narrow ? "narrow" : ""}`}>
        {eyebrow && <span className="h-eyebrow h-rise" style={{ "--i": 0 }}>{eyebrow}</span>}
        <h1 className="h-rise" style={{ "--i": 1 }}>{title}</h1>
        {lede && <p className="pg-head__lede h-rise" style={{ "--i": 2 }}>{lede}</p>}
        {meta && <div className="pg-meta h-rise" style={{ "--i": 3 }}>{meta}</div>}
      </div>
      <div className="h-hazard" aria-hidden="true" />
    </header>
  );
}

// Highlights the last word of a title with the yellow label tape.
function markLast(title) {
  const words = title.split(" ");
  const last = words.pop();
  return <>{words.join(" ")} <span className="h-mark">{last}.</span></>;
}

function CtaBand() {
  return (
    <section className="pg-cta">
      <div className="h-wrap">
        <h2 className="h-h2">Start saving today.</h2>
        <p className="h-p">Download The ToolBox and start saving on workwear, supplements, tools and more. $4.99/mo, cancel anytime.</p>
        <a className="btn btn--ink btn--lg" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"><IcoApple size={20} /> Download on the App Store</a>
      </div>
    </section>
  );
}

// ─── Legal Layout ─────────────────────────────────────────────────────────────
function LegalPage({ title, children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <PageShell>
      <PageHeader eyebrow="Legal document" title={markLast(title)} narrow />
      <main className="pg-main pg-prose narrow">{children}</main>
    </PageShell>
  );
}

function LegalSection({ title, children }) {
  return (
    <section className="pg-sec">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function PrivacyPage() {
  useEffect(() => {
    setPageMeta("Privacy Policy | The ToolBox", "Read The ToolBox privacy policy  -  how we collect, use, and protect your personal data.", "/privacy");
  }, []);
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection title="1. Introduction">
        <p>The ToolBox App Pty Ltd ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.</p>
      </LegalSection>
      <LegalSection title="2. Information Collection">
        <p>We collect information that you provide directly to us when you create an account, subscribe to our membership, or communicate with us. This may include:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Name and contact information (email address, phone number).", "Trade information and business details.", "Payment information (processed securely through third-party providers).", "Usage data and device information."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="3. Use of Information">
        <p>We use the information we collect to:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Provide, maintain, and improve our services.", "Process your membership and transactions.", "Send you technical notices, updates, and support messages.", "Communicate with you about discounts, offers, and partner updates.", "Monitor and analyze trends, usage, and activities."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="4. Disclosure of Information">
        <p>We do not sell your personal information. We may share information with:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {[
            "Partner vendors (only to verify membership for discounts).",
            "Mailchimp (Intuit Inc.)  -  used to manage our email list and send launch and membership communications.",
            "Apple Inc. and Google LLC  -  for app distribution and in-app purchase processing.",
            "Payment processors  -  to handle subscription billing securely. We do not store your full card details.",
            "Legal authorities if required by law or to protect our rights.",
          ].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="5. Security">
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. However, no data transmission over the internet can be guaranteed to be 100% secure.</p>
      </LegalSection>
      <LegalSection title="6. Your Rights & Data Deletion">
        <p>You have the right to access, correct, or delete the personal information we hold about you. To request deletion of your account and associated data, please contact us at <strong>admin@thetoolbox.group</strong> with the subject line "Data Deletion Request". We will process your request within 30 days.</p>
        <p style={{ marginTop: 12 }}>You may also unsubscribe from marketing emails at any time using the unsubscribe link included in every email we send.</p>
      </LegalSection>
      <LegalSection title="7. Children's Privacy">
        <p>The ToolBox is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child under 13, please contact us immediately at admin@thetoolbox.group and we will take steps to delete that information.</p>
      </LegalSection>
      <LegalSection title="8. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date below. Continued use of the app after changes constitutes acceptance of the updated policy.</p>
      </LegalSection>
      <LegalSection title="9. Contact Us">
        <p>If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us at <strong>admin@thetoolbox.group</strong>.</p>
      </LegalSection>
      <p className="pg-updated">Last updated: July 10, 2026</p>
    </LegalPage>
  );
}

function TermsPage() {
  useEffect(() => {
    setPageMeta("Terms of Service | The ToolBox", "The ToolBox terms of service  -  membership, subscription, usage rules, and governing law.", "/terms");
  }, []);
  return (
    <LegalPage title="Terms of Service">
      <LegalSection title="1. Acceptance of Terms">
        <p>By accessing or using The ToolBox application, you agree to be bound by these Terms of Service. If you do not agree, you are prohibited from using the app.</p>
      </LegalSection>
      <LegalSection title="2. Membership & Subscription">
        <p>The ToolBox offers a paid membership service. By subscribing, you agree to pay the fee stated at the time of purchase. Subscriptions automatically renew unless cancelled.</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Monthly Pro: $4.99 per month.", "Annual Gold Saver: $49.99 per year.", "Membership is for individual use only and non-transferable."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="3. Discount Redemptions">
        <p>Discounts provided by partner vendors are subject to the vendor's own terms and availability. We do not guarantee the evergreen availability of any specific discount and partner lists may change without notice.</p>
      </LegalSection>
      <LegalSection title="4. Prohibited Use">
        <p>You may not:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Share your membership credentials with non-members.", "Attempt to decompile or reverse engineer the application.", "Use the application for any illegal or unauthorized purpose.", "Misrepresent your trade status to obtain membership."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="5. Limitation of Liability">
        <p>The ToolBox App Pty Ltd shall not be liable for any damages arising out of the use or inability to use the services, or for any disputes between members and partner vendors.</p>
      </LegalSection>
      <LegalSection title="6. Governing Law">
        <p>These terms are governed by and construed in accordance with the laws of Victoria, Australia.</p>
      </LegalSection>
      <p className="pg-updated">Last updated: April 21, 2026</p>
    </LegalPage>
  );
}

function RefundsPage() {
  useEffect(() => {
    setPageMeta("Refund Policy | The ToolBox", "The ToolBox refund policy  -  subscription cancellations, exceptional circumstances, and vendor disputes.", "/refunds");
  }, []);
  return (
    <LegalPage title="Refund Policy">
      <LegalSection title="1. Subscription Refunds">
        <p>Due to the immediate access provided to digital discounts and vendor codes, we generally do not offer refunds on membership fees once a subscription period has commenced or the member has accessed the benefits.</p>
      </LegalSection>
      <LegalSection title="2. Cancellation">
        <p>You can cancel your subscription at any time through the app settings or by contacting our support team. Upon cancellation, you will continue to have access until the end of your current billing cycle.</p>
      </LegalSection>
      <LegalSection title="3. Exceptional Circumstances">
        <p>We may, at our sole discretion, provide a refund in exceptional circumstances, such as:</p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          {["Technical errors preventing access to the service.", "Accidental double-billing.", "Requests made within 24 hours of an accidental renewal (provided no benefits were used)."].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}
        </ul>
      </LegalSection>
      <LegalSection title="4. Partner Vendor Disputes">
        <p>The ToolBox is not responsible for the products or services provided by partner vendors. Any refunds for purchases made at a partner vendor must be handled directly with that vendor.</p>
      </LegalSection>
      <LegalSection title="5. Contact Support">
        <p>To discuss a refund request, please email admin@thetoolbox.group with your account details and the reason for the request.</p>
      </LegalSection>
      <p className="pg-updated">Last updated: April 21, 2026</p>
    </LegalPage>
  );
}

// ─── Forms (partner application + contact) ────────────────────────────────────
async function submitForm(form) {
  const res = await fetch("https://formsubmit.co/ajax/admin@thetoolbox.group", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: new FormData(form),
  });
  const json = await res.json();
  return json.success === "true" || json.success === true;
}

function Field({ label, icon, textarea = false, ...props }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="pg-label">{label}</label>
      <div className={`pg-control ${icon ? "has-icon" : ""}`}>
        {icon && <span className="pg-control__ico" aria-hidden="true">{icon}</span>}
        {textarea ? <textarea id={id} className="pg-input" {...props} /> : <input id={id} className="pg-input" {...props} />}
      </div>
    </div>
  );
}

function FormDone({ title, text, again, onAgain }) {
  return (
    <div className="pg-done" role="status">
      <div className="pg-done__tick"><IcoCheck size={40} /></div>
      <h3>{title}</h3>
      <p>{text}</p>
      <button className="btn" onClick={onAgain}>{again}</button>
    </div>
  );
}

function SubmitButton({ status, children }) {
  return (
    <button className="btn btn--yellow btn--lg btn--block" disabled={status === "submitting"}>
      {status === "submitting" ? <span className="pg-spin" role="status" aria-label="Sending" /> : children}
    </button>
  );
}

function VendorPage() {
  const [status, setStatus] = useState("idle");
  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    setPageMeta("Partner With Us | The ToolBox", "Apply to become a vendor partner on The ToolBox  -  reach thousands of Australian tradies with exclusive deals.", "/vendor");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try { setStatus((await submitForm(e.target)) ? "success" : "error"); } catch { setStatus("error"); }
  };
  return (
    <PageShell>
      <PageHeader
        eyebrow="Partner with us"
        title={<>Join the <span className="h-mark">network.</span></>}
        lede="Ready to get your brand in front of thousands of people living the trade lifestyle? Fill out the form and we'll be in touch."
      />
      <main className="pg-main">
        <div className="pg-split">
          <aside className="pg-aside">
            <p className="h-p">How vendors join: submit the application, and our team reviews it and gets in touch. We manually vet every partner before their offer goes live in the app.</p>
            <div className="pg-infobox"><IcoInfo /><p>We manually vet all partners to ensure the best value for our members.</p></div>
          </aside>
          <div className="pg-formcard">
            {status === "success" ? (
              <FormDone title="Application sent!" text="We'll review your details and get back to you within 48 hours." again="Submit another application" onAgain={() => setStatus("idle")} />
            ) : (
              <form onSubmit={handleSubmit} className="pg-form">
                <input type="hidden" name="_subject" value="New vendor application - The ToolBox" />
                <input type="hidden" name="_captcha" value="false" />
                <div className="pg-row">
                  <Field label="Contact Name *" placeholder="John Smith" type="text" name="contact_name" icon={<IcoUser />} required />
                  <Field label="Job Title" placeholder="Director" type="text" name="job_title" icon={<IcoBriefcase />} />
                </div>
                <div className="pg-row">
                  <Field label="Email Address *" placeholder="john@business.com" type="email" name="email" icon={<IcoMail />} required />
                  <Field label="Business Name *" placeholder="The ToolBox Co." type="text" name="business_name" icon={<IcoBuilding />} required />
                </div>
                <Field label="Offer / Discount *" textarea required name="offer" placeholder="20% off storewide, Buy 1 get 1 Free, etc." rows={5} />
                {status === "error" && <p className="pg-error" role="alert">Something went wrong. Please email us at admin@thetoolbox.group</p>}
                <SubmitButton status={status}><IcoSend />Submit Application</SubmitButton>
              </form>
            )}
          </div>
        </div>
      </main>
    </PageShell>
  );
}

function ContactPage() {
  const [status, setStatus] = useState("idle");
  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    setPageMeta("Contact Us | The ToolBox", "Get in touch with The ToolBox team  -  questions about your membership, partnerships, or anything else.", "/contact");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try { setStatus((await submitForm(e.target)) ? "success" : "error"); } catch { setStatus("error"); }
  };
  return (
    <PageShell>
      <PageHeader
        eyebrow="Get in touch"
        title={<>Contact <span className="h-mark">us.</span></>}
        lede="Have a question about your membership? Or just want to have a yarn? Send us a message and we'll get back to you shortly."
      />
      <main className="pg-main">
        <div className="pg-split">
          <aside className="pg-aside">
            {[
              { icon: <IcoMail />, label: "Email us", value: "admin@thetoolbox.group", href: "mailto:admin@thetoolbox.group" },
              { icon: <IcoInstagram />, label: "Follow us", value: "@thetoolboxau", href: "https://www.instagram.com/thetoolboxau/" },
            ].map(c => (
              <a key={c.label} className="pg-contact" href={c.href} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <span className="pg-contact__ico">{c.icon}</span>
                <span><small>{c.label}</small><strong>{c.value}</strong></span>
              </a>
            ))}
          </aside>
          <div className="pg-formcard">
            {status === "success" ? (
              <FormDone title="Message sent!" text="We've received your message and will get back to you as soon as possible." again="Send another message" onAgain={() => setStatus("idle")} />
            ) : (
              <form onSubmit={handleSubmit} className="pg-form">
                <input type="hidden" name="_subject" value="New message from The ToolBox website" />
                <input type="hidden" name="_captcha" value="false" />
                <Field label="Your Name *" placeholder="John Smith" type="text" name="name" icon={<IcoUser />} required />
                <Field label="Email Address *" placeholder="john@email.com" type="email" name="email" icon={<IcoMail />} required />
                <Field label="Message *" textarea required name="message" placeholder="How can we help?" rows={5} />
                {status === "error" && <p className="pg-error" role="alert">Something went wrong. Please email us directly at admin@thetoolbox.group</p>}
                <SubmitButton status={status}><IcoSend />Send Message</SubmitButton>
              </form>
            )}
          </div>
        </div>
      </main>
    </PageShell>
  );
}

// ─── Mailchimp Submit ─────────────────────────────────────────────────────────
function submitToMailchimp(email, onSuccess, onError) {
  const MAILCHIMP_URL = "https://us9.list-manage.com/subscribe/post-json?u=481c0bed00a009906e41e9f2f&id=88ab48ec0d&c=?";
  // We need the u param - extract from a hidden input workaround
  // Use the direct post-json endpoint with JSONP
  const url = `https://us9.list-manage.com/subscribe/post-json?u=481c0bed00a009906e41e9f2f&id=88ab48ec0d&EMAIL=${encodeURIComponent(email)}&c=mailchimpCallback`;
  
  window.mailchimpCallback = (data) => {
    delete window.mailchimpCallback;
    if (data.result === "success") {
      onSuccess();
    } else {
      onError(data.msg);
    }
  };

  const script = document.createElement("script");
  script.src = url;
  script.onerror = () => onError("Network error");
  document.head.appendChild(script);
  setTimeout(() => {
    if (window.mailchimpCallback) {
      delete window.mailchimpCallback;
      onError("Request timed out");
    }
    document.head.removeChild(script);
  }, 8000);
}

// ─── Download modal ───────────────────────────────────────────────────────────
function DownloadModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="h-modal" onClick={onClose}>
      <div className="h-modal__card" role="dialog" aria-modal="true" aria-labelledby="dl-title" onClick={e => e.stopPropagation()}>
        <button className="btn h-modal__close" onClick={onClose} aria-label="Close"><IcoX /></button>
        <h2 id="dl-title">Download The ToolBox</h2>
        <p className="h-modal__sub">Choose your device to get started.</p>
        <div className="h-modal__stores">
          <a className="btn btn--ink btn--lg btn--block h-store" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            <IcoApple size={30} />
            <span><small>Download on the</small><strong>App Store</strong></span>
          </a>
          <a className="btn btn--lg btn--block h-store" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
            <IcoGoogle size={30} />
            <span><small>Get it on</small><strong>Google Play</strong></span>
          </a>
        </div>
        <p className="h-modal__fine">Free to download · $4.99/mo membership</p>
      </div>
    </div>
  );
}

function AppStoreCTA({ onDownload }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
      <button onClick={onDownload}
        style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#fff", color: "#0d1f4e", padding: "18px 36px", borderRadius: 18, fontWeight: 900, fontSize: "1.1rem", border: "none", cursor: "pointer", transition: "all 0.25s", animation: "glowPulseWhite 3s ease-in-out infinite", boxShadow: "0 8px 40px rgba(255,255,255,0.15)", fontFamily: "inherit" }}
        onMouseOver={e => { e.currentTarget.style.background = "#5ba4cf"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.animation = "none"; }}
        onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0d1f4e"; e.currentTarget.style.animation = "glowPulseWhite 3s ease-in-out infinite"; }}>
        Download Free
      </button>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>iOS & Android · $4.99/mo membership</p>
    </div>
  );
}


// ─── Blog ─────────────────────────────────────────────────────────────────────
const CATEGORY_TINTS = {
  "Tradie Tips": "#8cc4e6",
  "Health & Fitness": "#86d9a0",
  "Vendor Spotlight": "#ffcf1f",
  "News": "#ffab6b",
  "Lifestyle": "#d9b8f5",
};

function BlogPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    setPageMeta("Blog | The ToolBox", "Tradie tips, health & fitness advice, and vendor spotlights from The ToolBox Journal.", "/blog");
  }, []);
  return (
    <PageShell>
      <PageHeader
        eyebrow="The ToolBox Journal"
        title={<>Tips, trades &amp; the <span className="h-mark">build life.</span></>}
        lede="Practical advice, vendor spotlights, and stories from the trade lifestyle community. Written by people who actually get it."
      />
      <main className="pg-main">
        <div className="pg-grid">
          {BLOG_POSTS.map((post, i) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="pg-card rv" style={{ "--i": i % 3 }}>
              <div className="pg-card__art" style={{ "--tint": CATEGORY_TINTS[post.category] || "#8cc4e6" }}>
                <strong>{post.category}</strong>
              </div>
              <div className="pg-card__body">
                <p className="pg-card__meta">{post.date} · {post.readTime}</p>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="pg-card__more">Read article <IcoChevRight /></span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </PageShell>
  );
}

function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => {
    if (!post) return;
    const publishedTime = new Date(post.date).toISOString();
    setPageMeta(`${post.title} | The ToolBox`, post.excerpt, `/blog/${post.slug}`, { type: "article", publishedTime });
    setJsonLd("blogposting-jsonld", {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: DEFAULT_OG_IMAGE,
      datePublished: publishedTime,
      dateModified: publishedTime,
      author: { "@type": "Organization", name: post.author },
      publisher: {
        "@type": "Organization",
        name: "The ToolBox",
        logo: { "@type": "ImageObject", url: "https://res.cloudinary.com/dy4rpazlk/image/upload/v1777016811/TheToolbox-White_2x_iqjf8y.png" },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
    });
    return () => setJsonLd("blogposting-jsonld", null);
  }, [post]);
  if (!post) return <Navigate to="/blog" replace />;

  const renderBlock = (block, i) => {
    if (block.type === "p") return <p key={i}>{block.text}</p>;
    if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
    if (block.type === "ul") return <ul key={i}>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ul>;
    if (block.type === "link") return (
      <button key={i} className="pg-textlink" onClick={() => navigate(block.to)}>{block.text} <IcoChevRight /></button>
    );
    return null;
  };

  return (
    <PageShell>
      <PageHeader
        narrow
        eyebrow={post.category}
        title={post.title}
        meta={<><span>{post.author}</span><i /><span>{post.date}</span><i /><b>{post.readTime}</b></>}
      />
      <main className="pg-main pg-prose narrow">
        <Link to="/blog" className="pg-back"><IcoArrowLeft /> Back to blog</Link>
        {post.content.map(renderBlock)}
      </main>
      <CtaBand />
    </PageShell>
  );
}

function VendorsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    setPageMeta("Vendor Directory | The ToolBox", "Browse 60+ partner brands on The ToolBox across workwear, supplements, fitness, recovery, golf and more.", "/vendors");
  }, []);
  return (
    <PageShell>
      <PageHeader
        eyebrow="Our network"
        title={<>Partnered <span className="h-mark">vendors.</span></>}
        lede="60+ brands across tools, workwear, supplements, fitness and more, growing every week. Every one is manually vetted before it goes live in the app."
      />
      <main className="pg-main">
        <div className="pg-grid pg-grid--sm">
          {[...VENDORS].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).map((v, i) => (
            <Link key={v.slug} to={`/vendors/${v.slug}`} className="pg-card pg-card--vendor rv" style={{ "--i": i % 4 }}>
              {v.featured && <span className="pg-flag">Featured</span>}
              <div className="pg-card__body">
                <span className="h-chip">{v.category}</span>
                <h2>{v.name}</h2>
                <p>{publicOffer(v)}</p>
                <span className="pg-card__more">View partner <IcoChevRight /></span>
              </div>
            </Link>
          ))}
        </div>
        <div className="pg-note rv">
          <h2>Don't see your brand here?</h2>
          <p>We're always looking for genuine deals to add. Fill out the partner application and we'll be in touch.</p>
          <Link className="btn btn--yellow btn--lg" to="/vendor">Partner with us</Link>
        </div>
      </main>
    </PageShell>
  );
}

function VendorProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const vendor = VENDORS.find(v => v.slug === slug);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => {
    if (!vendor) { navigate("/vendors", { replace: true }); return; }
    const description = publicOffer(vendor);
    setPageMeta(`${vendor.name} | The ToolBox`, description, `/vendors/${vendor.slug}`);
    setJsonLd("vendor-jsonld", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: vendor.name,
      description,
    });
    return () => setJsonLd("vendor-jsonld", null);
  }, [vendor, navigate]);
  if (!vendor) return null;

  return (
    <PageShell>
      <PageHeader
        narrow
        eyebrow={vendor.category}
        title={vendor.name}
        meta={<span>ToolBox Partner Brand</span>}
      />
      <main className="pg-main pg-prose narrow">
        <Link to="/vendors" className="pg-back"><IcoArrowLeft /> Back to directory</Link>
        <p>{publicOffer(vendor)}</p>
        <p className="pg-aside-note">Not listed yet but think you should be? <Link className="pg-inlinelink" to="/vendor">Partner with us</Link>.</p>
      </main>
      <CtaBand />
    </PageShell>
  );
}

// ─── Homepage (light, hi-vis) ─────────────────────────────────────────────────
// Styles live in home.css; tokens in index.css.
const FOUNDING_CLAIMED = 325, FOUNDING_TOTAL = 500;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function FoundingProgress() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [claimed, setClaimed] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setInView(true);
      if (prefersReducedMotion()) { setClaimed(FOUNDING_CLAIMED); return; }
      const duration = 900;
      let start = null;
      const step = (ts) => {
        if (start === null) start = ts;
        const t = Math.min((ts - start) / duration, 1);
        setClaimed(Math.round(FOUNDING_CLAIMED * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`h-prog ${inView ? "in" : ""}`} style={{ "--fill": FOUNDING_CLAIMED / FOUNDING_TOTAL }}>
      <div className="h-prog__row">
        <span>{claimed} of {FOUNDING_TOTAL} claimed</span>
        <span>{FOUNDING_TOTAL - claimed} spots left</span>
      </div>
      <div className="h-prog__track"><div className="h-prog__fill" /></div>
      <p className="h-prog__note"><i />Spots filling fast</p>
    </div>
  );
}

function useMediaQuery(query) {
  return useSyncExternalStore(
    (notify) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", notify);
      return () => m.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// Auto-scrolling strip. Items are repeated so the loop is seamless; copies are hidden from screen readers.
// Anyone who has asked their OS for reduced motion gets it paused (and manually scrollable) with a play button.
function Marquee({ copies = 2, speed = 60, label, children }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [userPaused, setUserPaused] = useState(null);
  const paused = userPaused ?? reduced;
  const items = Children.toArray(children);
  return (
    <div className="h-marquee-wrap">
      <div className={`h-marquee ${paused ? "is-paused" : ""}`} role="group" aria-label={label}>
        <div className="h-marquee__track" style={{ "--dur": `${speed}s` }}>
          {Array.from({ length: copies }, (_, c) =>
            items.map(el => cloneElement(el, { key: `${c}-${el.key}`, ...(c > 0 ? { "aria-hidden": "true" } : {}) })))}
        </div>
      </div>
      {reduced && (
        <button className="btn h-marquee__ctl" onClick={() => setUserPaused(!paused)} aria-pressed={!paused} aria-label={paused ? `Play ${label}` : `Pause ${label}`}>
          {paused
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l14 8-14 8z" /></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>}
          {paused ? "Play" : "Pause"}
        </button>
      )}
    </div>
  );
}

const HOW_STEPS = [
  { num: "01", title: "Browse the App", desc: "Search 60+ partner brands by category - workwear, supplements, fitness, food, golf, and more. New vendors added every month.", img: "/app-screens/how-1.webp" },
  { num: "02", title: "Find a Deal Near You", desc: "Locate partner stores near you on the map, or grab your online member code for stores you can't visit in person.", img: "/app-screens/how-2.webp" },
  { num: "03", title: "Redeem Your Discount", desc: "Tap to reveal your promo code. Show staff before payment, or paste it at checkout online. Done - savings in your pocket.", img: "/app-screens/how-3.webp" },
  { num: "04", title: "Track Every Dollar Saved", desc: "The app totals up every deal you redeem so you can see exactly what your membership is worth. Most members are ahead within their first week.", img: "/app-screens/how-4.webp" },
];

// Desktop: the phone and a tight stack of steps pin to the middle of the screen; the stack moves by scroll
// progress (a fraction of the scroll distance), so the text travels slower than the page.
function HowDesktop() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const gridRef = useRef(null);
  const pinRef = useRef(null);
  const stackRef = useRef(null);
  const stepRefs = useRef([]);
  const last = HOW_STEPS.length - 1;

  useEffect(() => {
    const grid = gridRef.current, pin = pinRef.current, stack = stackRef.current;
    if (!grid || !pin || !stack) return;
    const update = () => {
      const pitch = stepRefs.current[0].offsetHeight;
      const h = pin.offsetHeight;
      const pinTop = parseFloat(getComputedStyle(pin).top) || 0;
      const travel = grid.offsetHeight - h;
      const p = Math.min(1, Math.max(0, (pinTop - grid.getBoundingClientRect().top) / travel));
      stack.style.transform = `translate3d(0, ${h / 2 - pitch / 2 - p * last * pitch}px, 0)`;
      const i = Math.round(p * last);
      if (i !== activeRef.current) { activeRef.current = i; setActive(i); }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [last]);

  const jump = (i) => {
    const grid = gridRef.current, pin = pinRef.current;
    const pinTop = parseFloat(getComputedStyle(pin).top) || 0;
    const travel = grid.offsetHeight - pin.offsetHeight;
    const gridTop = grid.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: gridTop - pinTop + (i / last) * travel + 1, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div className="h-how__grid" ref={gridRef}>
      <div className="h-how__visual">
        <div className="h-how__screens">
          {HOW_STEPS.map((s, i) => (
            <img key={s.num} src={s.img} alt={s.title} width="970" height="2000" loading={i === 0 ? "eager" : "lazy"} className={active === i ? "on" : ""} />
          ))}
        </div>
        <div className="h-dots">
          {HOW_STEPS.map((s, i) => (
            <button key={s.num} className={`h-dot ${active === i ? "on" : ""}`} onClick={() => jump(i)} aria-label={`Jump to step ${s.num}`} aria-current={active === i} />
          ))}
        </div>
      </div>
      <div className="h-how__text" ref={pinRef}>
        <div className="h-how__stack" ref={stackRef}>
          {HOW_STEPS.map((s, i) => (
            <div key={s.num} ref={el => { stepRefs.current[i] = el; }} className={`h-step ${active === i ? "on" : ""}`}>
              <span className="h-step__num" aria-hidden="true">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Phones: a swipeable row of cards (snap scrolling), each with its step and a peek of the app screen.
function HowMobile() {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    cardRefs.current.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setActive(best);
  };
  const jump = (i) => {
    const track = trackRef.current, card = cardRefs.current[i];
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="h-hm" ref={trackRef} onScroll={onScroll} role="group" aria-label="How it works steps">
        {HOW_STEPS.map((s, i) => (
          <article key={s.num} ref={el => { cardRefs.current[i] = el; }} className="h-hm__card">
            <span className="h-hm__num" aria-hidden="true">{s.num}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="h-hm__phone">
              <div className="h-hm__plate" />
              <img src={s.img} alt={`${s.title} - app screen`} width="970" height="2000" loading={i === 0 ? "eager" : "lazy"} />
            </div>
          </article>
        ))}
      </div>
      <div className="h-dots h-dots--center">
        {HOW_STEPS.map((s, i) => (
          <button key={s.num} className={`h-dot ${active === i ? "on" : ""}`} onClick={() => jump(i)} aria-label={`Go to step ${s.num}`} aria-current={active === i} />
        ))}
      </div>
    </>
  );
}

function HowItWorksSection({ onDownload }) {
  const stacked = useMediaQuery("(max-width: 900px)");
  return (
    <section id="about" className="h-section h-how" data-nav="dark">
      <div className="h-wrap">
        <div className="h-how__head rv">
          <span className="h-eyebrow">Inside the App</span>
          <h2 className="h-h2">How it <em>works.</em></h2>
        </div>
      </div>
      {stacked ? <HowMobile /> : <div className="h-wrap"><HowDesktop /></div>}
      <div className="h-wrap">
        <div className="h-how__cta rv">
          <button className="btn btn--yellow btn--lg" onClick={onDownload}>Download Free</button>
          <p className="h-fine">iOS &amp; Android · $4.99/mo membership</p>
        </div>
      </div>
    </section>
  );
}

const SAVINGS_EXAMPLES = [
  { brand: "Anthem Workwear", example: "Work pants + shirt pack", save: "~$45", tag: "per order" },
  { brand: "Elite Supplements", example: "Monthly supplement order", save: "~$38", tag: "per month" },
  { brand: "Future Golf", example: "Annual golf membership (20% off)", save: "~$80", tag: "$399 plan · up to $180 saved" },
];

const FOUNDING_PERKS = [
  { perk: "Price locked at $4.99/mo, forever", detail: "After 500 spots fill, the price goes up. Founding members keep $4.99/mo for life." },
  { perk: "Exclusive Founding 500 vendor deals", detail: "Access to special deals only Founding members ever see." },
  { perk: "First access to every new vendor drop", detail: "Be first in line when new partners join each month." },
  { perk: "Priority access to member events", detail: "Invites to exclusive trade and lifestyle events." },
  { perk: "Numbered Founding Member badge in-app", detail: "A permanent badge showing your founding member status." },
];

const PLANS = [
  { name: "Monthly Pro", price: "$4.99", period: "/ mo", desc: "Founding 500 Rate · Cancel Anytime", highlight: false, badge: null,
    feats: ["Discounts across 60+ tradie-relevant brands", "Instant digital membership card on your phone", "Saves you more than it costs in the first redemption"] },
  { name: "Annual Gold Saver", price: "$49.99", period: "/ yr", desc: "Founding 500 Rate · Save $10/yr", highlight: true, badge: "BEST VALUE",
    feats: ["Everything in Monthly, plus 2 months completely free", "Priority access to new vendors and drops", "Members-only giveaways and exclusive deals"] },
];

const FAQS = [
  { q: "What is The ToolBox?", a: "The ToolBox is a trade lifestyle membership app for Australia. For $4.99/mo, members get real discounts at 60+ partner brands across workwear, supplements, fitness, recovery, food and tech." },
  { q: "How does membership work?", a: "Download the app, pick Monthly Pro ($4.99/mo) or Annual Gold Saver ($49.99/yr), and your digital membership card unlocks every partner deal straight away. No lock-in contract on the monthly plan." },
  { q: "How do vendors join?", a: "Fill out the partner application on our vendor page and our team will be in touch. We manually vet every partner to make sure the discount is worth a member's time before it goes live in the app." },
  { q: "How do I use my discount?", a: "Once you're a member, simply open the app and show your digital membership card in-store at any of our partner vendors, or use the provided promo code for online orders." },
  { q: "Is there a lock-in contract?", a: "No way. Our Monthly Pro plan is cancel-anytime. Our Annual plan offers the best value but you're never forced to stay if you don't want to." },
  { q: "Which brands are included?", a: "We have 60+ vendors and growing across tools, workwear, supplements, recovery and more. You can see the full list of our partners directly inside the app." },
  { q: "Can I use it anywhere in Australia?", a: "We're actively scoping out vendors across every state in Australia. If there's a business near you that should be on The ToolBox, let us know - we'd love to add them!" },
  { q: "How do I know the discounts are legit?", a: "Every vendor on The ToolBox is personally vetted and onboarded by us. We only partner with brands that offer genuine, meaningful savings - not token 5% deals. If it's not worth your time, it doesn't make the cut." },
];

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
);
const Tick = ({ color = "#0f1318" }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M2 6.5l3.5 3.5 5.5-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function LandingPage() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showDL, setShowDL] = useState(false);

  useEffect(() => {
    setPageMeta("The ToolBox | Discounts for the Australian Trade Lifestyle", "Save on workwear, supplements, fitness, golf and more. Australia's first discount membership app for the trade lifestyle. From $4.99/mo.", "/");
  }, []);

  useEffect(() => {
    document.body.classList.add("theme-light");
    return () => document.body.classList.remove("theme-light");
  }, []);

  useEffect(() => {
    // arriving from another page via /#section: the sections exist once this effect runs
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, []);

  useReveal(rootRef);

  const logoBrands = VENDORS.filter(v => v.logo);

  return (
    <div className="home" ref={rootRef}>
      {showDL && <DownloadModal onClose={() => setShowDL(false)} />}

      <SiteNav onGetApp={() => setShowDL(true)} />

      {/* Hero */}
      <header className="h-hero" data-nav="dark">
        <div className="h-hero__grid">
          <div>
            <h1 className="h-rise" style={{ "--i": 1 }}>Stop paying <span className="h-mark">full price.</span></h1>
            <p className="h-lede h-rise" style={{ "--i": 2 }}>
              Australia's trade lifestyle membership app. Join for $4.99/mo and save at 60+ partner brands across workwear, supplements, fitness and more.
            </p>
            <div className="h-hero__ctas h-rise" style={{ "--i": 3 }}>
              <a className="btn btn--yellow btn--lg" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"><IcoApple size={22} /> Download on iOS</a>
              <a className="btn btn--lg" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"><IcoGoogle size={22} /> Download on Android</a>
            </div>
            <p className="h-fine h-rise" style={{ "--i": 4 }}>Free to download · $4.99/mo for Founding 500 members · Price increases after 500 spots fill</p>
          </div>
          <div className="h-visual h-rise" style={{ "--i": 2 }}>
            <div className="h-visual__plate" />
            <img className="h-visual__phone" src="/app-screens/app-hero.png" width="1223" height="1400" fetchPriority="high" alt="The ToolBox app home screen showing featured partner deals" />
            <div className="h-sticker" aria-hidden="true"><small>From</small><strong>$4.99</strong><small>per month</small></div>
          </div>
        </div>

        {/* Reviews */}
        <div className="h-reviews">
          <div className="h-wrap h-reviews__head rv"><span className="h-eyebrow">What members say</span></div>
          <Marquee copies={2} speed={60} label="App reviews">
            {APP_REVIEWS.map((r, i) => (
              <article key={i} className="h-review">
                <div className="h-review__top">
                  <p className="h-review__title">{r.title}</p>
                  <div className="h-review__meta"><p>{r.date}</p><p>{r.author}</p></div>
                </div>
                <div className="h-stars">{Array.from({ length: r.rating }).map((_, s) => <IcoStar key={s} size={14} color="#f2a900" />)}</div>
                <p className="h-review__text">{r.text}</p>
              </article>
            ))}
          </Marquee>
        </div>
        <div className="h-hazard" aria-hidden="true" />
      </header>

      {/* Story */}
      <section className="h-section">
        <div className="h-wrap h-story">
          <div className="rv">
            <span className="h-eyebrow">Our Story</span>
            <h2 className="h-h2">Built for the trade lifestyle.</h2>
            <p className="h-p">The ToolBox wasn't born in a boardroom - it was born on site. We got sick of seeing everyone else get the perks while the people doing the hard yards got the short end of the stick.</p>
            <p className="h-p">Whether you're on the tools or just live that lifestyle, this app is built to put real money back in your pocket.</p>
          </div>
          <div className="h-photo rv" style={{ "--i": 1 }}>
            <img src="https://res.cloudinary.com/dy4rpazlk/image/upload/f_auto,q_auto/v1777162843/IMG_1781_l8ffof_tp09hu.heic" alt="On site" loading="lazy" />
            <div className="h-photo__cap">
              <strong>"Reclaiming value for those who earn it."</strong>
              <span>Founded in Melbourne, VIC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section id="vendors" className="h-brands">
        <div className="h-wrap">
          <div className="h-brands__head rv">
            <div>
              <span className="h-eyebrow">Our Network</span>
              <h2 className="h-h2">Partnered vendors.</h2>
            </div>
            <div className="h-brands__side">
              <p className="h-p">60+ brands across tools, workwear, supplements, fitness &amp; more. Growing every week.</p>
              <button className="h-more" onClick={() => navigate("/vendors")}>See all 60+ partners <IcoChevRight /></button>
            </div>
          </div>
        </div>
        <Marquee copies={4} speed={70} label="Partner brands">
          {logoBrands.map(v => (
            <div key={v.slug} className="h-brand"><img src={v.logo} alt={v.name} referrerPolicy="no-referrer" /></div>
          ))}
        </Marquee>
      </section>

      <HowItWorksSection onDownload={() => setShowDL(true)} />

      {/* Savings */}
      <section className="h-section h-savings">
        <div className="h-wrap">
          <div className="h-savings__head rv">
            <span className="h-eyebrow">Real Value, Every Use</span>
            <h2 className="h-h2">Your first deal pays for the year.</h2>
            <p className="h-p">Most members cover their $49.99 annual membership in just 2–3 uses. Everything after that is pure savings in your pocket.</p>
          </div>
          <div className="h-cards3">
            {SAVINGS_EXAMPLES.map((item, i) => (
              <div key={item.brand} className="rv" style={{ "--i": i }}>
                <div className="h-save">
                  <span className="h-chip">{item.brand}</span>
                  <p className="ex">{item.example}</p>
                  <div className="h-save__n">{item.save}<small>{item.tag}</small></div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-callout rv">
            <div>
              <span className="h-tag"><span className="h-tag__dot" />Guaranteed Savings</span>
              <h3>Real savings. <em>Not left to chance.</em></h3>
              <p className="h-p">Every deal in The ToolBox is available every single time you open the app. No draws, no waiting, no luck required - just guaranteed discounts on the brands you already buy, ready whenever you are.</p>
            </div>
            <ul className="h-checks">
              {["Discounts guaranteed, every single use", "No draws, no waiting, no luck", "Save from the very first redemption", "Pays for the annual fee in 2–3 uses", "60+ brands growing every month"].map(perk => (
                <li key={perk}><span className="h-tick"><Tick /></span>{perk}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Founding 500 */}
      <section className="h-section h-found" data-nav="dark">
        <div className="h-wrap h-found__grid">
          <div className="rv">
            <span className="h-eyebrow">Limited Availability</span>
            <h2 className="h-h2">Founding <em>500.</em></h2>
            <p className="h-p">Be part of the first 500 members and lock in $4.99/mo forever - even when pricing goes up. These perks won't come back once the spots are gone.</p>
            <FoundingProgress />
            <button className="btn btn--yellow btn--lg" onClick={() => setShowDL(true)}>Claim Your Spot</button>
          </div>
          <div className="h-perks rv" style={{ "--i": 1 }}>
            <p className="h-perks__label">What founding members get</p>
            {FOUNDING_PERKS.map(item => (
              <div key={item.perk} className="h-perk">
                <span className="h-tick" style={{ marginTop: 2 }}><Tick /></span>
                <div><strong>{item.perk}</strong><span>{item.detail}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="h-section">
        <div className="h-wrap">
          <div className="h-pricing__head rv">
            <span className="h-eyebrow">Simple Pricing</span>
            <h2 className="h-h2">Pick your plan.</h2>
            <p className="h-p">These are <strong>Founding 500 prices</strong> - locked in for life. Once spots fill, pricing goes up.</p>
            <p className="h-p">How membership works: pick a plan, and your digital membership card unlocks every partner deal in the app straight away. No lock-in contract on Monthly Pro.</p>
          </div>
          <div className="h-plans">
            {PLANS.map((plan, i) => (
              <div key={plan.name} className={`h-plan rv ${plan.highlight ? "h-plan--hi" : ""}`} style={{ "--i": i }}>
                {plan.badge && <span className="h-plan__badge">{plan.badge}</span>}
                <p className="h-plan__name">{plan.name}</p>
                <div className="h-plan__price"><strong>{plan.price}</strong><span>{plan.period}</span></div>
                <p className="h-plan__desc">{plan.desc}</p>
                <ul>{plan.feats.map(f => <li key={f}><IcoCheck size={20} />{f}</li>)}</ul>
                <div className="h-plan__note"><i />Founding 500 members lock in this price forever + get an exclusive in-app badge.</div>
                <button className={`btn btn--lg btn--block ${plan.highlight ? "btn--ink" : "btn--yellow"}`} onClick={() => setShowDL(true)}>Download Now</button>
              </div>
            ))}
          </div>

          <div className="h-momentum rv">
            <span className="h-eyebrow">Membership Momentum</span>
            <h3>Stay a member. Keep stacking savings.</h3>
            <p className="h-p">Based on an average member spending $250/mo across workwear, supplements and gear at ~15% off. Your membership rate stays locked while the savings keep adding up.</p>
            {(() => {
              const avgMonthlySpend = 250, avgDiscount = 0.15, annualMembership = 49.99;
              const netPerYear = avgMonthlySpend * 12 * avgDiscount - annualMembership;
              return (
                <div className="h-years">
                  {[1, 2, 3].map(year => (
                    <div key={year} className="h-year">
                      <small>Year {year}</small>
                      <strong>${Math.round(netPerYear * year).toLocaleString("en-AU")}</strong>
                      <span>net savings</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="h-section h-faq">
        <div className="h-faq__inner">
          <div className="h-faq__head rv">
            <span className="h-eyebrow">FAQ</span>
            <h2 className="h-h2">Got questions?</h2>
          </div>
          <div className="h-faq__list">
            {FAQS.map((item, i) => (
              <div key={item.q} className="rv" style={{ "--i": i }}>
                <div className={`h-faq__item ${openFaq === i ? "open" : ""}`}>
                  <h3>
                    <button className="h-faq__q" aria-expanded={openFaq === i} aria-controls={`faq-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{item.q}</span><PlusIcon />
                    </button>
                  </h3>
                  <div className="h-faq__a" id={`faq-${i}`} role="region"><div><p>{item.a}</p></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─── 404 ──────────────────────────────────────────────────────────────────────
function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta("Page not found | The ToolBox", "That page doesn't exist. Head back to The ToolBox homepage.", "/");
  }, []);
  return (
    <PageShell>
      <PageHeader
        eyebrow="Error 404"
        title={<>Page <span className="h-mark">not found.</span></>}
        lede="That link has gone off site. Head back to the homepage, or have a look around."
      />
      <main className="pg-main">
        <div className="pg-actions">
          <Link className="btn btn--yellow btn--lg" to="/">Back to home</Link>
          <Link className="btn btn--lg" to="/vendors">Browse vendors</Link>
          <Link className="btn btn--lg" to="/blog">Read the blog</Link>
        </div>
      </main>
    </PageShell>
  );
}

// ─── App Router ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/vendor" element={<VendorPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendors/:slug" element={<VendorProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refunds" element={<RefundsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
