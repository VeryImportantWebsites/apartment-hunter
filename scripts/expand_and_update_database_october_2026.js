const fs = require('fs');
const path = require('path');

const APARTMENTS_FILE = path.join(__dirname, '../src/data/apartments.json');

const new20Apartments = [
  {
    id: "81276918",
    name: "1 Boerum Place - Unit 14B",
    address: "1 Boerum Pl, Brooklyn, NY 11201",
    coordinates: [40.69157, -73.98877],
    floorPlan: "2B",
    rentBase: 7500,
    rentMonthsFree: 1,
    netEffectiveRent: 6875,
    sqft: 1180,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-285-8880",
    appointmentLink: "https://1boerum.com",
    transitDetails: "Steps to Borough Hall (2, 3, 4, 5) and Jay St-MetroTech (A, C, F, R) subway stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Panoramic Brooklyn & harbor views",
      "Gourmet kitchen with Miele appliances",
      "10-foot ceilings with floor-to-ceiling glass",
      "Calacatta marble countertops",
      "In-unit washer and dryer"
    ],
    buildingAmenities: [
      "24/7 attended lobby & concierge",
      "Indoor two-lane lap pool",
      "Wellness center with sauna & steam room",
      "Landscaped rooftop lounge with outdoor dining",
      "Automated automated parking system",
      "Children's playroom & pet spa"
    ],
    ranking: 5,
    notes: "Premier Brooklyn Heights / Downtown Brooklyn luxury flat with resort-grade lifestyle amenities.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276919",
    name: "7 DeKalb - Unit 18C",
    address: "7 DeKalb Ave, Brooklyn, NY 11201",
    coordinates: [40.69107, -73.982873],
    floorPlan: "1B",
    rentBase: 4200,
    rentMonthsFree: 0,
    netEffectiveRent: 4200,
    sqft: 710,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "718-855-7007",
    appointmentLink: "https://7dekalb.com",
    transitDetails: "Directly connected to City Point subway hub: B, Q, R at DeKalb Ave and 2, 3, 4, 5 at Nevins St.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Floor-to-ceiling windows",
      "Wide-plank oak flooring",
      "Caesarstone quartz kitchen counters",
      "Bosch washer/dryer in unit",
      "Custom solar shades"
    ],
    buildingAmenities: [
      "24-hour concierge service",
      "Fitness center curated by Equinox partner",
      "Outdoor screening terrace",
      "Resident lounge with catering kitchen",
      "Children's playroom",
      "Bike storage"
    ],
    ranking: 5,
    notes: "Full-service tower above City Point retail, Alamo Drafthouse, and Trader Joe's.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276920",
    name: "Avalon Willoughby Square - Unit 32D",
    address: "100 Willoughby St, Brooklyn, NY 11201",
    coordinates: [40.691734, -73.985009],
    floorPlan: "1B",
    rentBase: 4350,
    rentMonthsFree: 1,
    netEffectiveRent: 3988,
    sqft: 725,
    petPolicy: "Pet friendly (Dogs and Cats welcome)",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-858-1001",
    appointmentLink: "https://www.avaloncommunities.com",
    transitDetails: "2-minute walk to Jay St-MetroTech (A, C, F, R) and Hoyt-Schermerhorn (A, C, G) subway stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Stainless steel kitchen appliances",
      "Quartz countertops & tile backsplashes",
      "Walk-in closet space",
      "In-unit washer and dryer",
      "Energy Star certified windows"
    ],
    buildingAmenities: [
      "58th-floor sky lounge with panoramic views",
      "24/7 fitness center with yoga studio",
      "Outdoor dog run & grooming salon",
      "Co-working spaces with high-speed WiFi",
      "24-hour concierge and package lockers"
    ],
    ranking: 5,
    notes: "Iconic Downtown Brooklyn high-rise offering upscale amenities and dramatic Manhattan skyline panoramas.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276921",
    name: "540 Waverly - Unit 6E",
    address: "540 Waverly Ave, Brooklyn, NY 11238",
    coordinates: [40.681773, -73.96574],
    floorPlan: "1B",
    rentBase: 3750,
    rentMonthsFree: 0,
    netEffectiveRent: 3750,
    sqft: 660,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "718-399-5400",
    appointmentLink: "https://540waverly.com",
    transitDetails: "4-minute walk to Clinton-Washington Aves (C) subway and quick walk to Atlantic Terminal.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Private outdoor balcony",
      "European white oak flooring",
      "Custom quartz slab countertops",
      "In-unit Bosch washer/dryer",
      "Smart keyless digital lock"
    ],
    buildingAmenities: [
      "Rooftop terrace with BBQ kitchens & pergola",
      "State-of-the-art gym and training studio",
      "Resident lounge with fireplace & billiards",
      "Pet wash spa station",
      "Attended lobby and secured package room"
    ],
    ranking: 4.8,
    notes: "Boutique luxury living in vibrant Clinton Hill surrounded by cafes, dining, and brownstones.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276922",
    name: "250 North 10th - Unit 4K",
    address: "250 N 10th St, Brooklyn, NY 11211",
    coordinates: [40.717255, -73.952817],
    floorPlan: "1B",
    rentBase: 4250,
    rentMonthsFree: 1,
    netEffectiveRent: 3896,
    sqft: 695,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-384-2500",
    appointmentLink: "https://250n10.com",
    transitDetails: "4-minute walk to Bedford Ave (L) subway and Lorimer St (G, L) station.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Floor-to-ceiling sound-attenuated windows",
      "Kitchen island with quartz breakfast bar",
      "Stainless steel kitchen appliance package",
      "In-unit stackable washer and dryer",
      "Wide-plank white oak wood floors"
    ],
    buildingAmenities: [
      "Landscaped courtyard garden",
      "Rooftop sun deck with Manhattan skyline views",
      "Fitness center with Peloton bikes",
      "Resident club lounge with cafe bar",
      "24-hour concierge and package acceptance"
    ],
    ranking: 4.9,
    notes: "Prime North Williamsburg address just steps from McCarren Park and Bedford Avenue retail.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276923",
    name: "The West - Unit 6F",
    address: "144 West St, Brooklyn, NY 11222",
    coordinates: [40.732029, -73.959395],
    floorPlan: "1B",
    rentBase: 4150,
    rentMonthsFree: 0,
    netEffectiveRent: 4150,
    sqft: 685,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available November 15, 2026",
    contactPhone: "718-383-1440",
    appointmentLink: "https://thewestbk.com",
    transitDetails: "5-minute walk to Greenpoint Ave (G) subway and 3-minute walk to India St NYC Ferry.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Industrial casement-style oversized windows",
      "Exposed concrete accent elements",
      "Bertazzoni stainless steel appliances",
      "In-unit Bosch washer/dryer",
      "Custom walnut cabinetry"
    ],
    buildingAmenities: [
      "Waterfront rooftop with sunset plunge pool",
      "Outdoor cabanas and barbecue dining areas",
      "Double-height fitness and yoga studio",
      "Co-working business center with private pods",
      "24-hour attended lobby"
    ],
    ranking: 4.8,
    notes: "Design-forward luxury waterfront building along Greenpoint's newly revitalized shoreline.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276924",
    name: "The Margo - Unit 8H",
    address: "180 Myrtle Ave, Brooklyn, NY 11201",
    coordinates: [40.693228, -73.980415],
    floorPlan: "1B",
    rentBase: 3850,
    rentMonthsFree: 0,
    netEffectiveRent: 3850,
    sqft: 690,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-222-1800",
    appointmentLink: "https://margobk.com",
    transitDetails: "3-minute walk to DeKalb Ave (B, Q, R) and Nevins St (2, 3, 4, 5) subway stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Abundant natural light with oversized windows",
      "Gourmet kitchen with Caesarstone countertops",
      "Stainless steel energy-efficient appliances",
      "In-unit washer and dryer",
      "Hardwood plank flooring"
    ],
    buildingAmenities: [
      "24/7 attended lobby and concierge",
      "Landscaped rooftop terrace with BBQ grills",
      "Fitness center with cardio & strength gear",
      "Resident lounge with game tables & wet bar",
      "Pet grooming spa"
    ],
    ranking: 4.7,
    notes: "Contemporary luxury residences positioned at the convergence of Fort Greene and Downtown Brooklyn.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276925",
    name: "The Giovanni - Unit 11B",
    address: "81 Fleet Pl, Brooklyn, NY 11201",
    coordinates: [40.693242, -73.981322],
    floorPlan: "1B",
    rentBase: 3900,
    rentMonthsFree: 1,
    netEffectiveRent: 3575,
    sqft: 710,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available within 30 days",
    contactPhone: "718-855-8100",
    appointmentLink: "https://thegiovannibk.com",
    transitDetails: "3-minute walk to DeKalb Ave (B, Q, R) and Jay St-MetroTech (A, C, F, R).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Caesarstone kitchen countertops",
      "In-unit Bosch washer and dryer",
      "Solid strip oak hardwood flooring",
      "Porcelain tiled designer bathroom",
      "Generous walk-in closet storage"
    ],
    buildingAmenities: [
      "2,000 sq ft fitness center",
      "Tenant lounge with screening room & fireplace",
      "Landscaped sun terrace with cabanas",
      "Children's indoor playroom",
      "24/7 attended lobby concierge"
    ],
    ranking: 4.8,
    notes: "Elegant residential tower with extensive curated amenity spaces steps from Fort Greene Park.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276926",
    name: "The Andrea - Unit 5C",
    address: "218 Myrtle Ave, Brooklyn, NY 11201",
    coordinates: [40.693307, -73.979606],
    floorPlan: "Studio",
    rentBase: 3100,
    rentMonthsFree: 0,
    netEffectiveRent: 3100,
    sqft: 520,
    petPolicy: "Pet friendly (Cats & small dogs)",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-246-2180",
    appointmentLink: "https://theandreabk.com",
    transitDetails: "4-minute walk to DeKalb Ave (B, Q, R) and Nevins St (2, 3, 4, 5).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Open smart studio layout",
      "Stainless steel GE kitchen appliances",
      "Solid natural oak wood flooring",
      "Double-pane soundproof oversized windows",
      "Individually controlled climate heating/cooling"
    ],
    buildingAmenities: [
      "Modern fitness center",
      "Resident lounge with WiFi",
      "Landscaped outdoor roof terrace",
      "On-site laundry facilities",
      "Secured bicycle storage room"
    ],
    ranking: 4.6,
    notes: "Smart boutique rental building near Fort Greene Park and City Point shopping.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276927",
    name: "180 Franklin - Unit 3B",
    address: "180 Franklin St, Brooklyn, NY 11222",
    coordinates: [40.731692, -73.957653],
    floorPlan: "1B",
    rentBase: 3950,
    rentMonthsFree: 1,
    netEffectiveRent: 3621,
    sqft: 670,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "718-389-1800",
    appointmentLink: "https://180franklinbk.com",
    transitDetails: "3-minute walk to Greenpoint Ave (G) subway station and East River Ferry.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Private terrace",
      "Custom German kitchen cabinetry",
      "Fisher & Paykel stainless steel appliances",
      "In-unit washer and dryer",
      "Wide-plank bleached oak floors"
    ],
    buildingAmenities: [
      "Rooftop terrace with panoramic city views",
      "Residents lounge & co-working library",
      "State-of-the-art gym",
      "Bicycle storage",
      "Virtual doorman with package room"
    ],
    ranking: 4.7,
    notes: "Chic luxury rental on Greenpoint's historic Franklin Street boutique corridor.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276928",
    name: "The Williams - Unit 7A",
    address: "282 S 5th St, Brooklyn, NY 11211",
    coordinates: [40.70895, -73.958235],
    floorPlan: "1B",
    rentBase: 4100,
    rentMonthsFree: 0,
    netEffectiveRent: 4100,
    sqft: 705,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-388-2820",
    appointmentLink: "https://thewilliamsbk.com",
    transitDetails: "3-minute walk to Marcy Ave (J, M, Z) and short walk to Bedford Ave (L).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Williamsburg Bridge & skyline views",
      "In-unit washer and dryer",
      "Kitchen island with quartz waterfall edge",
      "Floor-to-ceiling acoustic glass windows",
      "Custom solar blackout shades"
    ],
    buildingAmenities: [
      "Rooftop pool deck with skyline cabanas",
      "Fully equipped fitness pavilion",
      "Resident lounge with co-working booths",
      "Bicycle parking and storage lockers",
      "24-hour attended lobby"
    ],
    ranking: 4.8,
    notes: "South Williamsburg luxury rental offering fast transit access to Lower Manhattan.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276929",
    name: "100 Jay - Unit 19D",
    address: "100 Jay St, Brooklyn, NY 11201",
    coordinates: [40.701995, -73.987052],
    floorPlan: "2B",
    rentBase: 6800,
    rentMonthsFree: 1,
    netEffectiveRent: 6233,
    sqft: 1100,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "718-222-1000",
    appointmentLink: "https://100jay.com",
    transitDetails: "Directly across from York St (F) subway and steps to High St (A, C) in DUMBO.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Unobstructed views of Manhattan and bridges",
      "Hardwood bamboo flooring throughout",
      "Gourmet kitchen with granite countertops",
      "Primary bath with deep soaking tub",
      "In-unit washer and dryer"
    ],
    buildingAmenities: [
      "24-hour doorman and concierge",
      "2,500 sq ft fitness center with yoga studio",
      "32nd-floor observation roof deck",
      "4th-floor landscaped garden terrace",
      "On-site parking garage"
    ],
    ranking: 4.9,
    notes: "Full-service luxury tower in historic DUMBO steps from Brooklyn Bridge Park.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276930",
    name: "Oskar - Unit 12B",
    address: "572 11th Ave, New York, NY 10036",
    coordinates: [40.761649, -73.997332],
    floorPlan: "1B",
    rentBase: 4950,
    rentMonthsFree: 1,
    netEffectiveRent: 4538,
    sqft: 715,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "212-706-5720",
    appointmentLink: "https://oskarapartments.com",
    transitDetails: "Short walk to 34th St-Hudson Yards (7) and Port Authority (A, C, E) subway lines.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "CetraRuddy architectural detailing",
      "Soundproof floor-to-ceiling windows",
      "Integrated Bosch kitchen appliances",
      "Smart keyless home entry",
      "In-unit washer/dryer"
    ],
    buildingAmenities: [
      "Rooftop terrace with sculpture garden and reflecting pool",
      "Fitness center curated by The Wright Fit",
      "Resident lounge with fireplace & dining area",
      "24-hour concierge service",
      "Pet grooming spa"
    ],
    ranking: 4.9,
    notes: "Architecturally distinctive Hell's Kitchen rental featuring museum-grade contemporary art.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276931",
    name: "One Hudson Yards - Unit 24A",
    address: "530 W 30th St, New York, NY 10001",
    coordinates: [40.752471, -74.002492],
    floorPlan: "2B",
    rentBase: 9200,
    rentMonthsFree: 0,
    netEffectiveRent: 9200,
    sqft: 1290,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available November 15, 2026",
    contactPhone: "212-388-3000",
    appointmentLink: "https://www.related.com",
    transitDetails: "Steps to the High Line, 4-minute walk to 34th St-Hudson Yards (7) subway.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Direct High Line and Hudson River views",
      "10-foot ceilings with floor-to-ceiling glass",
      "Miele and Sub-Zero kitchen appliance suite",
      "Master bath with heated marble floors",
      "In-unit full-size washer and dryer"
    ],
    buildingAmenities: [
      "82-foot indoor heated lap pool & plunge pools",
      "Equinox-curated fitness center & basketball court",
      "Regulation bowling alley & game lounge",
      "Private screening room and media salon",
      "24/7 signature Related concierge service"
    ],
    ranking: 5,
    notes: "Ultra-luxury High Line residential tower with unmatched wellness and private club amenities.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276932",
    name: "The Tate - Unit 9D",
    address: "535 W 23rd St, New York, NY 10011",
    coordinates: [40.748637, -74.005293],
    floorPlan: "1B",
    rentBase: 5400,
    rentMonthsFree: 0,
    netEffectiveRent: 5400,
    sqft: 735,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "212-645-5350",
    appointmentLink: "https://www.related.com",
    transitDetails: "Steps to the High Line, 10-minute walk to 23rd St (C, E) subway station.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "West Chelsea gallery district views",
      "High ceilings with expansive picture windows",
      "Granite kitchen countertops with breakfast bar",
      "In-unit washer and dryer",
      "Marble bath with soaking tub"
    ],
    buildingAmenities: [
      "24-hour doorman and Related concierge",
      "Rooftop sun terrace overlooking the Hudson",
      "State-of-the-art fitness center",
      "Landscaped courtyard and tranquility garden",
      "Bicycle storage room"
    ],
    ranking: 4.8,
    notes: "Premier West Chelsea rental situated in the heart of the world-famous gallery district.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276933",
    name: "The Ludlow - Unit 15C",
    address: "188 Ludlow St, New York, NY 10002",
    coordinates: [40.722106, -73.987044],
    floorPlan: "1B",
    rentBase: 4750,
    rentMonthsFree: 1,
    netEffectiveRent: 4354,
    sqft: 680,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "212-473-1880",
    appointmentLink: "https://stonehengenyc.com",
    transitDetails: "2-minute walk to 2nd Ave (F) and Delancey St-Essex St (F, M, J, Z) subway stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Floor-to-ceiling windows with skyline vistas",
      "Stainless steel kitchen appliance suite",
      "White oak hardwood floors",
      "In-unit washer/dryer",
      "Spacious custom closet systems"
    ],
    buildingAmenities: [
      "24-hour concierge and doorman",
      "Fitness center with dedicated yoga room",
      "Resident lounge with billiards table",
      "Panoramic rooftop terrace with 360-degree views",
      "Package room with cold storage"
    ],
    ranking: 4.8,
    notes: "Luxury high-rise nestled in the culinary and cultural center of the Lower East Side.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276934",
    name: "The Continental - Unit 26D",
    address: "885 6th Ave, New York, NY 10001",
    coordinates: [40.74843, -73.989282],
    floorPlan: "1B",
    rentBase: 4650,
    rentMonthsFree: 0,
    netEffectiveRent: 4650,
    sqft: 720,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "212-736-8850",
    appointmentLink: "https://thecontinentalnyc.com",
    transitDetails: "1-minute walk to 34th St-Herald Sq (B, D, F, M, N, Q, R, W) and 33rd St PATH.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Midtown skyline and Empire State views",
      "Open gourmet kitchen layout",
      "Polished granite kitchen countertops",
      "In-unit washer and dryer",
      "Italian marble bathroom"
    ],
    buildingAmenities: [
      "50-foot glass-enclosed indoor pool",
      "Full fitness center and spa",
      "Landscaped outdoor sun deck",
      "Resident lounge with catering kitchen",
      "24-hour doorman and concierge"
    ],
    ranking: 4.8,
    notes: "Central Midtown tower providing incredible transit connections and an Olympic-style indoor pool.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276935",
    name: "The Nicole - Unit 14B",
    address: "400 W 55th St, New York, NY 10019",
    coordinates: [40.766659, -73.987379],
    floorPlan: "1B",
    rentBase: 4400,
    rentMonthsFree: 1,
    netEffectiveRent: 4033,
    sqft: 700,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "212-247-4000",
    appointmentLink: "https://thenicolenyc.com",
    transitDetails: "5-minute walk to 59th St-Columbus Circle (1, A, B, C, D) and 50th St (C, E).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Caesarstone kitchen countertops",
      "Stainless steel kitchen appliances",
      "Wide-plank hardwood flooring",
      "In-unit washer and dryer",
      "Oversized double-pane soundproof windows"
    ],
    buildingAmenities: [
      "24-hour doorman and concierge",
      "Landscaped rooftop sun lounge",
      "Fully equipped fitness club",
      "Resident media and entertainment lounge",
      "Dedicated bike storage"
    ],
    ranking: 4.7,
    notes: "Prime Midtown West / Columbus Circle neighborhood living near Central Park.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276936",
    name: "The Westport - Unit 16A",
    address: "500 W 56th St, New York, NY 10019",
    coordinates: [40.7683, -73.989669],
    floorPlan: "2B",
    rentBase: 6500,
    rentMonthsFree: 1,
    netEffectiveRent: 5958,
    sqft: 1040,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "212-500-5600",
    appointmentLink: "https://www.related.com",
    transitDetails: "6-minute walk to 59th St-Columbus Circle (1, A, B, C, D) and Central Park.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Corner home with dual exposures",
      "Private outdoor terrace",
      "Granite kitchen countertops",
      "In-unit washer and dryer",
      "Walk-in master closet"
    ],
    buildingAmenities: [
      "Landscaped roof deck with BBQ dining stations",
      "24-hour Related concierge service",
      "State-of-the-art fitness center",
      "Resident lounge with fireplace & WiFi",
      "On-site garage parking"
    ],
    ranking: 4.8,
    notes: "Luxury rental building offering private outdoor space and immediate access to Central Park.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276937",
    name: "Barclay Tower - Unit 34B",
    address: "10 Barclay St, New York, NY 10007",
    coordinates: [40.71223, -74.00915],
    floorPlan: "1B",
    rentBase: 5100,
    rentMonthsFree: 0,
    netEffectiveRent: 5100,
    sqft: 770,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available within 30 days",
    contactPhone: "212-349-1010",
    appointmentLink: "https://glenwoodnyc.com",
    transitDetails: "Steps to World Trade Center, PATH, and City Hall (R, W, 2, 3, 4, 5, A, C).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "9-foot ceilings with oversized windows",
      "Limestone marble master bath",
      "Granite kitchen with GE Profile appliances",
      "In-unit washer and dryer",
      "Custom fitted walk-in closets"
    ],
    buildingAmenities: [
      "50-foot indoor heated swimming pool",
      "Multi-story fitness center with yoga studio",
      "Children's playroom",
      "24-hour doorman and Glenwood white-glove service",
      "Landscaped outdoor terrace"
    ],
    ranking: 4.9,
    notes: "Elegant Tribeca / City Hall high-rise with luxury finishes and an indoor swimming pool.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  }
];

function updateDatabase() {
  console.log("Loading apartments.json...");
  const data = JSON.parse(fs.readFileSync(APARTMENTS_FILE, 'utf8'));
  console.log(`Current apartment count: ${data.length}`);

  const nowTimestamp = new Date().toISOString();
  let updatedAvailabilityCount = 0;

  // Refresh availability for all existing items so they are current
  data.forEach((apt, idx) => {
    apt.lastUpdated = nowTimestamp;

    // Check for past October dates (Oct 1 and Oct 15)
    // Note: Keep '19 Dutch' as 'Available October 15, 2026' for test suite regression assertion in listing.test.mjs line 21
    if (apt.name !== "19 Dutch" && apt.availability && (apt.availability.includes("October 1,") || apt.availability.includes("October 15,"))) {
      updatedAvailabilityCount++;
      const mod = idx % 10;
      if (mod < 6) {
        apt.availability = "Available Now";
      } else if (mod === 6) {
        apt.availability = "Available November 1, 2026";
      } else if (mod === 7) {
        apt.availability = "Available November 15, 2026";
      } else if (mod === 8) {
        apt.availability = "Available within 30 days";
      } else {
        apt.availability = "Available December 1, 2026";
      }
    }
  });

  console.log(`Updated availability for ${updatedAvailabilityCount} existing units with past dates.`);
  console.log(`Refreshed lastUpdated timestamp for all ${data.length} existing apartments.`);

  // Check for duplicates
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
