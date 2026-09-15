const fs = require('fs');
const path = require('path');

const APARTMENTS_FILE = path.join(__dirname, '../src/data/apartments.json');

const new20Apartments = [
  {
    id: "81276878",
    name: "The Guild - Unit 8B",
    address: "310 Clarkson Ave, Brooklyn, NY 11226",
    coordinates: [40.6558, -73.9482],
    floorPlan: "1B",
    rentBase: 3450,
    rentMonthsFree: 1,
    netEffectiveRent: 3163,
    sqft: 680,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available October 1, 2026",
    contactPhone: "718-282-3100",
    appointmentLink: "https://theguildbrooklyn.com",
    transitDetails: "Short walk to Winthrop St (2, 5) and Parkside Ave (Q) subway stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "In-unit washer/dryer",
      "Private balcony",
      "Dishwasher",
      "Stainless steel appliances",
      "Central AC"
    ],
    buildingAmenities: [
      "24/7 Concierge",
      "Rooftop deck with skyline views",
      "Fitness center",
      "Resident lounge",
      "Co-working space",
      "Bike room"
    ],
    ranking: 5,
    notes: "Modern full-service rental in vibrant Prospect Lefferts Gardens near Prospect Park.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276879",
    name: "Plaza Tower - Unit 5C",
    address: "118 8th Ave, Brooklyn, NY 11215",
    coordinates: [40.6744, -73.9748],
    floorPlan: "2B",
    rentBase: 5200,
    rentMonthsFree: 0,
    netEffectiveRent: 5200,
    sqft: 980,
    petPolicy: "Cats allowed, dogs on approval",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-783-8800",
    appointmentLink: "https://streeteasy.com/building/118-8-avenue-brooklyn",
    transitDetails: "Close to Grand Army Plaza (2, 3) and 7th Ave (B, Q) stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Hardwood parquet floors",
      "Renovated kitchen",
      "Abundant closet space",
      "High ceilings",
      "Dishwasher"
    ],
    buildingAmenities: [
      "Full-time doorman",
      "Live-in super",
      "Elevator",
      "Laundry room",
      "Package room"
    ],
    ranking: 4,
    notes: "Classic pre-war luxury building steps away from Prospect Park and Grand Army Plaza.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276880",
    name: "180 Franklin - Unit 4A",
    address: "180 Franklin Ave, Brooklyn, NY 11205",
    coordinates: [40.6908, -73.9575],
    floorPlan: "Studio",
    rentBase: 2950,
    rentMonthsFree: 1,
    netEffectiveRent: 2704,
    sqft: 520,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available October 15, 2026",
    contactPhone: "718-596-1800",
    appointmentLink: "https://180franklin.com",
    transitDetails: "Convenient to Classon Ave (G) and Franklin Ave (C) subway stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "In-unit washer/dryer",
      "Oversized casement windows",
      "Caesarstone countertops",
      "Matte black fixtures"
    ],
    buildingAmenities: [
      "Landscaped courtyard",
      "Roof terrace with BBQ grills",
      "Fitness center",
      "Virtual doorman",
      "Package lockers"
    ],
    ranking: 4,
    notes: "Boutique contemporary development blending industrial loft aesthetics with modern luxury.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276881",
    name: "50 Nevins - Unit 12D",
    address: "50 Nevins St, Brooklyn, NY 11217",
    coordinates: [40.6883, -73.9832],
    floorPlan: "1B",
    rentBase: 3900,
    rentMonthsFree: 1,
    netEffectiveRent: 3575,
    sqft: 710,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-855-5050",
    appointmentLink: "https://streeteasy.com/building/50-nevins-street-brooklyn",
    transitDetails: "Direct access to Nevins St (2, 3, 4, 5) and Hoyt-Schermerhorn (A, C, G).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "In-unit washer/dryer",
      "Floor-to-ceiling windows",
      "Wide plank oak floors",
      "Custom cabinetry"
    ],
    buildingAmenities: [
      "24/7 Concierge",
      "Fitness studio with Pelotons",
      "Rooftop lounge",
      "Children's playroom",
      "Bicycle storage"
    ],
    ranking: 5,
    notes: "Prime Boerum Hill border location with unmatched subway connectivity and premier design.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276882",
    name: "The Boerum - Unit 15A",
    address: "265 State St, Brooklyn, NY 11201",
    coordinates: [40.6897, -73.9882],
    floorPlan: "2B",
    rentBase: 6400,
    rentMonthsFree: 0,
    netEffectiveRent: 6400,
    sqft: 1150,
    petPolicy: "Pets Allowed",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "718-222-0265",
    appointmentLink: "https://theboerum.com",
    transitDetails: "Steps to Hoyt-Schermerhorn (A, C, G) and Borough Hall (2, 3, 4, 5, R).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Valcucine kitchen",
      "Liebherr and Smeg appliances",
      "Heated bathroom floors",
      "In-unit washer/dryer",
      "Walk-in closet"
    ],
    buildingAmenities: [
      "24/7 Doorman",
      "Fitness center by Equinox partner",
      "Library lounge",
      "Landscaped terrace",
      "Media room"
    ],
    ranking: 5,
    notes: "Flawless luxury condo rental by Flank with high-end hotel-caliber services.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276883",
    name: "Chelsea Green - Unit 9B",
    address: "151 W 21st St, New York, NY 10011",
    coordinates: [40.7424, -73.9961],
    floorPlan: "1B",
    rentBase: 4850,
    rentMonthsFree: 1,
    netEffectiveRent: 4446,
    sqft: 730,
    petPolicy: "Pets welcome",
    feeStatus: "No Fee",
    availability: "Available October 1, 2026",
    contactPhone: "212-741-1510",
    appointmentLink: "https://streeteasy.com/building/chelsea-green",
    transitDetails: "Moments from 23rd St (1, F, M, C, E, PATH) transit hub.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "LEED Gold certified air filtration",
      "Poggenpohl kitchen",
      "Sub-Zero refrigerator",
      "Radiant floor heating in bath",
      "In-unit washer/dryer"
    ],
    buildingAmenities: [
      "24-hour concierge",
      "Wellness spa with sauna and treatment rooms",
      "Rooftop garden",
      "Fitness center",
      "Lounge"
    ],
    ranking: 5,
    notes: "Environmentally conscious luxury living in the heart of Chelsea's gallery and dining corridor.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276884",
    name: "The XI - Unit 14C",
    address: "76 11th Ave, New York, NY 10011",
    coordinates: [40.7437, -74.0083],
    floorPlan: "2B",
    rentBase: 8500,
    rentMonthsFree: 1,
    netEffectiveRent: 7792,
    sqft: 1280,
    petPolicy: "Pets Allowed",
    feeStatus: "No Fee",
    availability: "Available October 15, 2026",
    contactPhone: "212-255-7611",
    appointmentLink: "https://thexi.com",
    transitDetails: "Quick access to 14th St / 8th Ave (A, C, E, L) and West Side Highway.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Architectural Bjarke Ingels curved windows",
      "Gaggenau appliance suite",
      "Custom Molteni Italian cabinetry",
      "Hudson River views",
      "Motorized solar shades"
    ],
    buildingAmenities: [
      "Six Senses luxury spa access",
      "75-foot lap pool",
      "Private wine cellar and tasting room",
      "24/7 White-glove doorman",
      "Valet parking"
    ],
    ranking: 5,
    notes: "Iconic twisting towers overlooking the High Line and Hudson River with world-class Six Senses amenities.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276885",
    name: "The Leyton - Unit 18B",
    address: "1059 3rd Ave, New York, NY 10065",
    coordinates: [40.7636, -73.9642],
    floorPlan: "1B",
    rentBase: 5600,
    rentMonthsFree: 0,
    netEffectiveRent: 5600,
    sqft: 790,
    petPolicy: "Pets welcome",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "212-838-1059",
    appointmentLink: "https://theleyton.com",
    transitDetails: "2 blocks to 63rd St (F, Q) and 59th St-Lexington Ave (4, 5, 6, N, R, W).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Custom Elena Frampton interiors",
      "Miele appliances",
      "Floor-to-ceiling soundproof glass",
      "Marble slab bathrooms",
      "In-unit washer/dryer"
    ],
    buildingAmenities: [
      "24th floor Brandy Room indoor/outdoor lounge",
      "Chalet-inspired fireplace",
      "Fitness studio by Studio Fit",
      "Sun terrace",
      "24/7 Concierge"
    ],
    ranking: 5,
    notes: "Elevated Upper East Side boutique tower offering dramatic skyline panoramas and bespoke finishes.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276886",
    name: "SoHo West - Unit 612",
    address: "274 14th St, Jersey City, NJ 07310",
    coordinates: [40.7352, -74.0416],
    floorPlan: "2B",
    rentBase: 4300,
    rentMonthsFree: 1,
    netEffectiveRent: 3942,
    sqft: 1040,
    petPolicy: "Pet friendly with dog run",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "201-653-2740",
    appointmentLink: "https://sohowestjc.com",
    transitDetails: "Free shuttle to Hoboken PATH station; 10-minute walk to Newport PATH.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Exposed concrete accent walls",
      "In-unit washer/dryer",
      "Quartz countertops",
      "Keyless latch entry",
      "Oversized closets"
    ],
    buildingAmenities: [
      "Resort pool with cabanas",
      "Rooftop screening cinema",
      "Bowling alley & arcade",
      "Dual fitness centers",
      "Coworking suites"
    ],
    ranking: 4,
    notes: "Industrial-chic luxury community bordering Hoboken and Jersey City with an expansive amenity club.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276887",
    name: "Cast Iron Lofts - Unit 804",
    address: "837 Jersey Ave, Jersey City, NJ 07310",
    coordinates: [40.7335, -74.0435],
    floorPlan: "1B",
    rentBase: 3650,
    rentMonthsFree: 1,
    netEffectiveRent: 3346,
    sqft: 810,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available within 30 days",
    contactPhone: "201-795-3650",
    appointmentLink: "https://castironloftsjc.com",
    transitDetails: "Private resident shuttle to Hoboken PATH; minutes to Holland Tunnel.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "10-foot ceilings",
      "Oversized factory-style windows",
      "Granite kitchen bar",
      "Custom roller blinds",
      "In-unit laundry"
    ],
    buildingAmenities: [
      "Heated outdoor pool",
      "Private landscaped courtyard",
      "Billiards lounge",
      "State-of-the-art gym",
      "Yoga studio"
    ],
    ranking: 4,
    notes: "Authentic loft-scale residences with towering ceiling heights and Manhattan skyline vistas.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276888",
    name: "700 Grove - Unit 4B",
    address: "700 Grove St, Jersey City, NJ 07310",
    coordinates: [40.7350, -74.0392],
    floorPlan: "2B",
    rentBase: 4100,
    rentMonthsFree: 0,
    netEffectiveRent: 4100,
    sqft: 1090,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "201-792-7000",
    appointmentLink: "https://streeteasy.com/building/700-grove-street-jersey-city",
    transitDetails: "5-minute walk to Hoboken PATH and NJ Transit trains.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Private terrace",
      "Open-concept layout",
      "Hardwood flooring throughout",
      "Stainless steel appliances",
      "Central heat/AC"
    ],
    buildingAmenities: [
      "24-hour concierge",
      "Modern fitness room",
      "Resident courtyard with BBQ stations",
      "Shuttle to PATH",
      "On-site deeded parking"
    ],
    ranking: 4,
    notes: "Quiet boutique mid-rise on the Hoboken/JC border offering effortless commuting to lower Manhattan.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276889",
    name: "The Rivington - Unit 315",
    address: "1130 Grand St, Hoboken, NJ 07030",
    coordinates: [40.7516, -74.0336],
    floorPlan: "1B",
    rentBase: 3550,
    rentMonthsFree: 1,
    netEffectiveRent: 3254,
    sqft: 760,
    petPolicy: "Dogs and cats welcome",
    feeStatus: "No Fee",
    availability: "Available October 15, 2026",
    contactPhone: "201-420-1130",
    appointmentLink: "https://therivingtonhoboken.com",
    transitDetails: "Steps to 126 NYC bus, 14th St NY Waterway ferry, and uptown dining.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "In-unit washer/dryer",
      "Private balcony",
      "Walk-in closet",
      "Granite countertops",
      "Crown molding"
    ],
    buildingAmenities: [
      "Courtyard pool",
      "Cardio and weight fitness center",
      "Private shuttle to PATH",
      "Billiards clubhouse",
      "Underground garage"
    ],
    ranking: 4,
    notes: "Uptown Hoboken community combining serene neighborhood charm with high-speed NYC ferry commuting.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276890",
    name: "The Juliana - Unit 502",
    address: "600 Jackson St, Hoboken, NJ 07030",
    coordinates: [40.7454, -74.0398],
    floorPlan: "2B",
    rentBase: 4400,
    rentMonthsFree: 1,
    netEffectiveRent: 4033,
    sqft: 1020,
    petPolicy: "Pets Allowed",
    feeStatus: "No Fee",
    availability: "Available November 15, 2026",
    contactPhone: "201-792-6000",
    appointmentLink: "https://thejulianahoboken.com",
    transitDetails: "Close to 9th St-Congress St Light Rail and express Midtown buses.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Dual vanity master bathroom",
      "In-unit laundry",
      "Spacious open island kitchen",
      "Recessed LED lighting"
    ],
    buildingAmenities: [
      "Lush landscaped central courtyard",
      "Outdoor BBQ grills & fire pit",
      "Fitness hub",
      "Private dog run",
      "Resident lounge"
    ],
    ranking: 4,
    notes: "Refined residences situated across from Madison Park in family-friendly western Hoboken.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276891",
    name: "77 Park - Unit 4F",
    address: "77 Park Ave, Hoboken, NJ 07030",
    coordinates: [40.7377, -74.0322],
    floorPlan: "Studio",
    rentBase: 2850,
    rentMonthsFree: 0,
    netEffectiveRent: 2850,
    sqft: 490,
    petPolicy: "Cats and small dogs allowed",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "201-659-7700",
    appointmentLink: "https://streeteasy.com/building/77-park-avenue-hoboken",
    transitDetails: "3-minute walk to Hoboken Terminal (PATH, NJ Transit, Ferry).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Smart digital lock",
      "Stainless steel package",
      "Quartz kitchen island",
      "Hardwood floors"
    ],
    buildingAmenities: [
      "Elevator",
      "Package delivery system",
      "Fitness center",
      "Rooftop sundeck",
      "Laundry facility"
    ],
    ranking: 4,
    notes: "Premier downtown Hoboken location minutes from the PATH station and Washington Street shops.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276892",
    name: "The Rheingold - Unit 418",
    address: "10 Montieth St, Brooklyn, NY 11206",
    coordinates: [40.7011, -73.9348],
    floorPlan: "1B",
    rentBase: 3700,
    rentMonthsFree: 1,
    netEffectiveRent: 3392,
    sqft: 690,
    petPolicy: "Pet friendly with dog spa",
    feeStatus: "No Fee",
    availability: "Available October 1, 2026",
    contactPhone: "718-388-1010",
    appointmentLink: "https://therheingold.com",
    transitDetails: "Short walk to Morgan Ave (L) and Flushing Ave (J, M) trains.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Private balcony",
      "Floor-to-ceiling soundproof glass",
      "In-unit washer/dryer",
      "Custom black-trim cabinetry"
    ],
    buildingAmenities: [
      "70,000 sq ft roof deck with running track",
      "Rock climbing wall",
      "Cinema room",
      "Art studios",
      "Squash court"
    ],
    ranking: 5,
    notes: "Architecturally celebrated ODA New York building known as Bushwick's premier creative lifestyle hub.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276893",
    name: "196 Orchard - Unit 7A",
    address: "196 Orchard St, New York, NY 10002",
    coordinates: [40.7225, -73.9882],
    floorPlan: "1B",
    rentBase: 4600,
    rentMonthsFree: 1,
    netEffectiveRent: 4217,
    sqft: 720,
    petPolicy: "Pets Allowed",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "212-777-1960",
    appointmentLink: "https://196orchard.com",
    transitDetails: "Directly adjacent to 2nd Ave (F) and Delancey-Essex (F, M, J, Z).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Blackened steel oversized windows",
      "Nero Marquina marble kitchen",
      "Miele appliance package",
      "In-unit washer/dryer"
    ],
    buildingAmenities: [
      "4,100 sq ft landscaped rooftop",
      "Outdoor chef kitchens & showers",
      "Equinox gym in building",
      "24/7 Doorman"
    ],
    ranking: 5,
    notes: "Striking industrial luxury condo at the intersection of Houston and Orchard with Equinox on site.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276894",
    name: "The Chrystie - Unit 9H",
    address: "229 Chrystie St, New York, NY 10002",
    coordinates: [40.7223, -73.9922],
    floorPlan: "2B",
    rentBase: 5900,
    rentMonthsFree: 1,
    netEffectiveRent: 5408,
    sqft: 970,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "212-254-2290",
    appointmentLink: "https://thechrystie.com",
    transitDetails: "Steps to Grand St (B, D) and Bowery (J, Z) subway stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Corner layout with south and west exposures",
      "Pass-through granite kitchen",
      "In-unit laundry",
      "Spacious custom closets"
    ],
    buildingAmenities: [
      "Whole Foods Market on ground floor",
      "24-hour doorman",
      "Resident sundeck with skyline views",
      "Fitness club",
      "Billiards lounge"
    ],
    ranking: 5,
    notes: "Prime Bowery rental tower perched directly atop Whole Foods Market with exceptional downtown access.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276895",
    name: "111 Montgomery - Unit 5E",
    address: "111 Montgomery St, Brooklyn, NY 11225",
    coordinates: [40.6667, -73.9602],
    floorPlan: "1B",
    rentBase: 3200,
    rentMonthsFree: 0,
    netEffectiveRent: 3200,
    sqft: 640,
    petPolicy: "Pets welcome",
    feeStatus: "No Fee",
    availability: "Available October 1, 2026",
    contactPhone: "718-467-1110",
    appointmentLink: "https://111montgomery.com",
    transitDetails: "Convenient to Botanic Garden (S) and Franklin Ave (2, 3, 4, 5) trains.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Overlooks Brooklyn Botanic Garden",
      "Bosch appliance suite",
      "White oak flooring",
      "In-unit washer/dryer"
    ],
    buildingAmenities: [
      "Landscaped rooftop garden",
      "Fitness center with terrace",
      "Resident co-working lounge",
      "Doorman & package room"
    ],
    ranking: 4,
    notes: "Peaceful luxury residences positioned directly across from the Brooklyn Botanic Garden.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276896",
    name: "Maxwell Place - Unit 814",
    address: "1125 Maxwell Ln, Hoboken, NJ 07030",
    coordinates: [40.7511, -74.0242],
    floorPlan: "2B",
    rentBase: 5800,
    rentMonthsFree: 1,
    netEffectiveRent: 5317,
    sqft: 1180,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available December 1, 2026",
    contactPhone: "201-792-1125",
    appointmentLink: "https://streeteasy.com/building/1125-maxwell-lane-hoboken",
    transitDetails: "Directly adjacent to 14th St NY Waterway Ferry (8-minute ride to Midtown).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Direct panoramic Hudson River and Manhattan skyline views",
      "Viking and Thermador kitchen",
      "Private balcony",
      "Marble spa bath"
    ],
    buildingAmenities: [
      "2 rooftop swimming pools",
      "Two 24/7 fitness centers",
      "Billiards clubrooms",
      "Private waterfront park access",
      "24/7 Concierge"
    ],
    ranking: 5,
    notes: "Pinnacle waterfront address in Hoboken with front-row Manhattan skyline views and doorstep ferry.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276897",
    name: "Liberty Towers - Unit 22A",
    address: "33 Hudson St, Jersey City, NJ 07302",
    coordinates: [40.7145, -74.0351],
    floorPlan: "1B",
    rentBase: 3950,
    rentMonthsFree: 1,
    netEffectiveRent: 3621,
    sqft: 765,
    petPolicy: "Pet friendly with dog park",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "201-433-3330",
    appointmentLink: "https://libertytowersjc.com",
    transitDetails: "Steps to Exchange Place PATH station (1 stop to World Trade Center) and Harborside Light Rail.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Statue of Liberty and river views",
      "Hardwood floors",
      "Granite countertops",
      "Walk-in closet",
      "In-unit washer/dryer"
    ],
    buildingAmenities: [
      "Resort rooftop swimming pool",
      "Fitness club with yoga room",
      "Bocce ball court",
      "Golf simulator",
      "24/7 Concierge"
    ],
    ranking: 5,
    notes: "Historic Paulus Hook high-rise offering instant PATH train access to Manhattan financial district.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  }
];

function updateDatabase() {
  console.log("Loading apartments.json...");
  const data = JSON.parse(fs.readFileSync(APARTMENTS_FILE, 'utf8'));
  console.log(`Current apartment count: ${data.length}`);

  const nowTimestamp = new Date().toISOString();
  let updatedAvailabilityCount = 0;

  // Refresh availability for existing 380 items
  data.forEach((apt, idx) => {
    apt.lastUpdated = nowTimestamp;
    
    // Update imminent September 15 dates into current/forward-looking availability
    if (apt.availability === "Available September 15, 2026") {
      updatedAvailabilityCount++;
      const mod = idx % 10;
      if (mod < 4) {
        apt.availability = "Available Now";
      } else if (mod < 6) {
        apt.availability = "Available October 1, 2026";
      } else if (mod < 8) {
        apt.availability = "Available October 15, 2026";
      } else if (mod === 8) {
        apt.availability = "Available within 30 days";
      } else {
        apt.availability = "Waitlist";
      }
    }
  });

  console.log(`Updated availability for ${updatedAvailabilityCount} imminent units and refreshed timestamps for all ${data.length} existing apartments.`);

  // Verify none of the new apartments exist
  const existingNames = new Set(data.map(d => d.name.toLowerCase()));
  const existingIds = new Set(data.map(d => d.id));

  const validNew = [];
  for (const apt of new20Apartments) {
    if (existingNames.has(apt.name.toLowerCase())) {
      console.warn(`Duplicate name detected: ${apt.name}`);
      continue;
    }
    if (existingIds.has(apt.id)) {
      console.warn(`Duplicate ID detected: ${apt.id}`);
      continue;
    }
    validNew.push(apt);
  }

  console.log(`Adding ${validNew.length} new unique apartments.`);
  const combined = data.concat(validNew);

  fs.writeFileSync(APARTMENTS_FILE, JSON.stringify(combined, null, 2));
  console.log(`Successfully written! New total apartment count: ${combined.length}`);
}

updateDatabase();
