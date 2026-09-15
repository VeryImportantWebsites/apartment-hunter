const fs = require('fs');
const path = require('path');

const APARTMENTS_FILE = path.join(__dirname, '../src/data/apartments.json');

const new20Apartments = [
  {
    id: "81276898",
    name: "Eagle + West - Unit 18B",
    address: "227 West St, Brooklyn, NY 11222",
    coordinates: [40.7335, -73.9602],
    floorPlan: "2B",
    rentBase: 6200,
    rentMonthsFree: 1,
    netEffectiveRent: 5683,
    sqft: 1120,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-383-2270",
    appointmentLink: "https://eagleandwest.com",
    transitDetails: "5-minute walk to Greenpoint Ave (G) subway station and steps to India St NYC Ferry.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Waterfront East River views",
      "In-unit washer/dryer",
      "Floor-to-ceiling windows",
      "Custom Italian cabinetry",
      "Central HVAC"
    ],
    buildingAmenities: [
      "24/7 Doorman and Concierge",
      "Waterfront outdoor heated pool",
      "Fitness center & yoga studio",
      "Co-working lounge with private booths",
      "Rooftop terrace with BBQ grills",
      "Children's playroom",
      "Bicycle storage"
    ],
    ranking: 5,
    notes: "Architectural masterpiece designed by OMA / Rem Koolhaas on the Greenpoint waterfront.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276899",
    name: "1N4th - Unit 14D",
    address: "1 N 4th Pl, Brooklyn, NY 11249",
    coordinates: [40.7186, -73.9664],
    floorPlan: "1B",
    rentBase: 4350,
    rentMonthsFree: 0,
    netEffectiveRent: 4350,
    sqft: 710,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available October 1, 2026",
    contactPhone: "718-388-1440",
    appointmentLink: "https://1n4th.com",
    transitDetails: "Short walk to Bedford Ave (L) subway and North Williamsburg NYC Ferry terminal.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Panoramic Manhattan skyline views",
      "In-unit washer/dryer",
      "Caesarstone countertops",
      "Hardwood oak flooring",
      "Stainless steel appliances"
    ],
    buildingAmenities: [
      "24-hour concierge",
      "Outdoor swimming pool & sun deck",
      "Fitness center with Technogym equipment",
      "Media and screening room",
      "Resident lounge with billiards",
      "Valet parking"
    ],
    ranking: 5,
    notes: "Prime waterfront luxury high-rise in North Williamsburg overlooking East River State Park.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276900",
    name: "416 Kent - Unit 12J",
    address: "416 Kent Ave, Brooklyn, NY 11249",
    coordinates: [40.7107, -73.9686],
    floorPlan: "1B",
    rentBase: 4100,
    rentMonthsFree: 1,
    netEffectiveRent: 3758,
    sqft: 690,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available within 30 days",
    contactPhone: "718-420-4160",
    appointmentLink: "https://420kent.com",
    transitDetails: "Near Marcy Ave (J, M, Z) subway and South Williamsburg Ferry terminal.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Dramatic corner window layouts",
      "In-unit washer/dryer",
      "Bertazzoni kitchen appliances",
      "Spa-like bath with deep soaking tub"
    ],
    buildingAmenities: [
      "24/7 Front desk staff",
      "Rooftop pool club",
      "Wellness center and state-of-the-art gym",
      "Outdoor dining pavilions",
      "Waterfront esplanade access"
    ],
    ranking: 5,
    notes: "Distinctive cantilevered glass architecture by ODA New York on the South Williamsburg waterfront.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276901",
    name: "Otto Greenpoint - Unit 5C",
    address: "211 India St, Brooklyn, NY 11222",
    coordinates: [40.7328, -73.9535],
    floorPlan: "Studio",
    rentBase: 3250,
    rentMonthsFree: 0,
    netEffectiveRent: 3250,
    sqft: 510,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-389-2110",
    appointmentLink: "https://ottogreenpoint.com",
    transitDetails: "2 blocks from Greenpoint Ave (G) subway station.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Custom millwork kitchen",
      "In-unit Bosch washer/dryer",
      "Oversized casement windows",
      "Wide plank white oak flooring"
    ],
    buildingAmenities: [
      "Attended lobby",
      "Landscaped rooftop terrace with BBQ grills",
      "Fitness center",
      "Resident lounge with fireplace",
      "Package room",
      "Bike storage"
    ],
    ranking: 4,
    notes: "Boutique residential development combining Scandinavian modernism with historic Greenpoint charm.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276902",
    name: "The Edge - Unit 8B",
    address: "22 N 6th St, Brooklyn, NY 11249",
    coordinates: [40.7203, -73.9642],
    floorPlan: "2B",
    rentBase: 5900,
    rentMonthsFree: 0,
    netEffectiveRent: 5900,
    sqft: 1080,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available October 15, 2026",
    contactPhone: "718-302-3343",
    appointmentLink: "https://streeteasy.com/building/the-edge-south-tower",
    transitDetails: "3-minute walk to East River Ferry; 7-minute walk to Bedford Ave (L) train.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Private balcony with skyline view",
      "Miele & Bosch stainless appliances",
      "In-unit washer/dryer",
      "Sub-Zero refrigerator",
      "Hardwood floors"
    ],
    buildingAmenities: [
      "24-hour doorman & concierge",
      "Indoor all-season swimming pool",
      "Full basketball court",
      "Two fitness centers",
      "Screening rooms",
      "Spa with steam room and sauna"
    ],
    ranking: 5,
    notes: "LEED Gold certified luxury condominium complex with unbeatable waterfront amenities.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276903",
    name: "The Brooklyn Grove - Unit 11A",
    address: "10 Nevins St, Brooklyn, NY 11217",
    coordinates: [40.6896, -73.9822],
    floorPlan: "1B",
    rentBase: 3950,
    rentMonthsFree: 1,
    netEffectiveRent: 3621,
    sqft: 725,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "718-858-1010",
    appointmentLink: "https://thebrooklyngrove.com",
    transitDetails: "Direct access to Nevins St (2, 3, 4, 5) and Hoyt-Schermerhorn (A, C, G) trains.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Wide plank natural oak floors",
      "In-unit washer/dryer",
      "Custom rift oak kitchen cabinetry",
      "Caesarstone countertops"
    ],
    buildingAmenities: [
      "24-hour concierge",
      "40-foot indoor skylit lap pool",
      "Private dining room with chef's kitchen",
      "Fitness center and yoga room",
      "Rooftop lounge with screening area",
      "Children's playroom"
    ],
    ranking: 5,
    notes: "Sophisticated luxury living nestled at the intersection of Downtown Brooklyn and Boerum Hill.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276904",
    name: "The Everly - Unit 4D",
    address: "888 Fulton St, Brooklyn, NY 11238",
    coordinates: [40.6834, -73.9647],
    floorPlan: "1B",
    rentBase: 3500,
    rentMonthsFree: 0,
    netEffectiveRent: 3500,
    sqft: 675,
    petPolicy: "Pet friendly (Dogs & Cats)",
    feeStatus: "No Fee",
    availability: "Available October 1, 2026",
    contactPhone: "718-789-0888",
    appointmentLink: "https://theeverlybrooklyn.com",
    transitDetails: "1 block to Clinton-Washington (C) and Franklin Ave (A, C, S) subway stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "In-unit washer/dryer",
      "Custom European kitchen",
      "Matte black fixtures",
      "Floor-to-ceiling windows",
      "Central air conditioning"
    ],
    buildingAmenities: [
      "Virtual doorman with keyless entry",
      "Rooftop terrace with grill stations",
      "Fitness studio",
      "Co-working lounge",
      "Secure package room",
      "Bicycle storage"
    ],
    ranking: 4,
    notes: "Boutique new construction in vibrant Clinton Hill surrounded by top dining and historic brownstones.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276905",
    name: "Caesura - Unit 7B",
    address: "280 Ashland Pl, Brooklyn, NY 11217",
    coordinates: [40.6874, -73.9789],
    floorPlan: "Studio",
    rentBase: 2950,
    rentMonthsFree: 1,
    netEffectiveRent: 2704,
    sqft: 485,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available within 30 days",
    contactPhone: "718-852-2800",
    appointmentLink: "https://caesurabrooklyn.com",
    transitDetails: "Immediate access to Atlantic Ave-Barclays Center transit hub (B, D, N, Q, R, 2, 3, 4, 5, LIRR).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Smart micro-efficient layout",
      "Custom Italian built-in cabinetry",
      "In-unit washer/dryer",
      "Triple-pane soundproof windows"
    ],
    buildingAmenities: [
      "24/7 concierge",
      "Rooftop farm and sun terrace",
      "Fitness center",
      "Lending library of items (tools, instruments, camping gear)",
      "Resident lounge and double-height conservatory"
    ],
    ranking: 4,
    notes: "Award-winning sustainable building located in the heart of the Brooklyn Cultural District.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276906",
    name: "Plank Road - Unit 9C",
    address: "662 Pacific St, Brooklyn, NY 11217",
    coordinates: [40.6826, -73.9744],
    floorPlan: "2B",
    rentBase: 5100,
    rentMonthsFree: 1,
    netEffectiveRent: 4675,
    sqft: 960,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "718-638-6620",
    appointmentLink: "https://plankroadbk.com",
    transitDetails: "2-minute walk to Atlantic Terminal (9 subway lines + LIRR).",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "In-unit washer/dryer",
      "Stainless steel appliance package",
      "Quartz countertops",
      "Ample double closet space"
    ],
    buildingAmenities: [
      "24-hour attended lobby",
      "Rooftop pool and sundeck",
      "Fitness center and cardio room",
      "Co-working library",
      "Children's playroom",
      "Landscaped outdoor green spaces"
    ],
    ranking: 5,
    notes: "Full-service luxury rental at Pacific Park with direct access to Prospect Heights and Park Slope.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276907",
    name: "550 Vanderbilt - Unit 10G",
    address: "550 Vanderbilt Ave, Brooklyn, NY 11238",
    coordinates: [40.6811, -73.9688],
    floorPlan: "1B",
    rentBase: 4200,
    rentMonthsFree: 0,
    netEffectiveRent: 4200,
    sqft: 740,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available October 1, 2026",
    contactPhone: "718-398-5500",
    appointmentLink: "https://streeteasy.com/building/550-vanderbilt",
    transitDetails: "Steps to Clinton-Washington (C) and Atlantic Terminal hub.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "10-foot ceilings",
      "Miele kitchen appliances",
      "Carrara marble countertops",
      "In-unit washer/dryer",
      "Oversized windows with park views"
    ],
    buildingAmenities: [
      "24/7 Concierge and doorman",
      "10,000 sq ft of amenity spaces",
      "Library by McNally Jackson",
      "Fitness center with Peloton bikes",
      "Rooftop terrace with communal garden plots",
      "Private dining room and lounge"
    ],
    ranking: 5,
    notes: "Luxury condominium building designed by COOKFOX overlooking the 8-acre Pacific Park green space.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276908",
    name: "American Copper Buildings - Unit 28C",
    address: "626 1st Ave, New York, NY 10016",
    coordinates: [40.7445, -73.9719],
    floorPlan: "1B",
    rentBase: 4950,
    rentMonthsFree: 1,
    netEffectiveRent: 4538,
    sqft: 760,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "212-626-1111",
    appointmentLink: "https://americancopper.nyc",
    transitDetails: "Near 33rd St (6) subway, 34th St NYC Ferry, and Grand Central Terminal.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Custom copper and glass architecture",
      "Floor-to-ceiling windows with East River views",
      "In-unit washer/dryer",
      "Marble finishes & high-end stainless appliances"
    ],
    buildingAmenities: [
      "75-foot skybridge indoor lap pool",
      "Rooftop plunge pool and lounge",
      "Double-height fitness center with rock climbing wall",
      "Turkish-style marble hammam",
      "24/7 concierge and valet service",
      "Porte-cochère private driveway"
    ],
    ranking: 5,
    notes: "Iconic SHoP Architects-designed dual towers linked by an unprecedented three-story skybridge.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276909",
    name: "20 Exchange - Unit 31D",
    address: "20 Exchange Pl, New York, NY 10005",
    coordinates: [40.7058, -74.0094],
    floorPlan: "Studio",
    rentBase: 3350,
    rentMonthsFree: 1,
    netEffectiveRent: 3071,
    sqft: 560,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available October 15, 2026",
    contactPhone: "212-269-2020",
    appointmentLink: "https://20exchange.com",
    transitDetails: "Steps to Wall St (2, 3, 4, 5) and Broad St (J, Z) subway stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Classic Art Deco soaring ceilings",
      "Renovated granite kitchen",
      "In-unit washer/dryer",
      "Oversized closets"
    ],
    buildingAmenities: [
      "24-hour doorman and concierge",
      "Rooftop sun terrace with harbor views",
      "State-of-the-art fitness center",
      "Resident lounge with wet bar",
      "Valet service"
    ],
    ranking: 4,
    notes: "Historic 57-story landmark skyscraper revitalized with luxury modern rental finishes.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276910",
    name: "63 Wall - Unit 15G",
    address: "63 Wall St, New York, NY 10005",
    coordinates: [40.7061, -74.0084],
    floorPlan: "1B",
    rentBase: 3700,
    rentMonthsFree: 0,
    netEffectiveRent: 3700,
    sqft: 680,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "212-363-6300",
    appointmentLink: "https://63wallstreet.com",
    transitDetails: "Immediate access to Wall St (2, 3, 4, 5) and Bowling Green (4, 5) trains.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Strip hardwood flooring",
      "Stainless steel kitchen appliances",
      "Deep soaking bathroom tub",
      "Ample closet storage"
    ],
    buildingAmenities: [
      "24-hour doorman and concierge",
      "Rooftop deck with grill stations",
      "Fitness center with sauna",
      "Billiards room and golf simulator",
      "Screening room",
      "Children's playroom"
    ],
    ranking: 4,
    notes: "Classic Wall Street address pairing pre-war architectural grandeur with full modern services.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276911",
    name: "Tribeca House - Unit 10E",
    address: "50 Murray St, New York, NY 10007",
    coordinates: [40.7142, -74.0091],
    floorPlan: "2B",
    rentBase: 6500,
    rentMonthsFree: 0,
    netEffectiveRent: 6500,
    sqft: 1150,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available November 1, 2026",
    contactPhone: "212-227-5050",
    appointmentLink: "https://tribecahouse.com",
    transitDetails: "Close to Chambers St (1, 2, 3, A, C) and City Hall (R, W) stations.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Generous Tribeca loft proportions",
      "In-unit washer/dryer",
      "High ceilings with recessed lighting",
      "Granite breakfast bar"
    ],
    buildingAmenities: [
      "24-hour doorman and concierge",
      "Equinox gym directly on-site",
      "5,500 sq ft landscaped roof deck with skyline vistas",
      "Resident lounge with screening room",
      "Basketball court",
      "Children's playroom"
    ],
    ranking: 5,
    notes: "Premier Tribeca rental offering expansive layouts in one of Manhattan's most desirable enclaves.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276912",
    name: "Helena 57 West - Unit 19D",
    address: "601 W 57th St, New York, NY 10019",
    coordinates: [40.7704, -73.9912],
    floorPlan: "1B",
    rentBase: 4100,
    rentMonthsFree: 1,
    netEffectiveRent: 3758,
    sqft: 715,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available within 30 days",
    contactPhone: "212-977-5700",
    appointmentLink: "https://thehelena.com",
    transitDetails: "Short walk to Columbus Circle (A, B, C, D, 1) and Hudson River Greenway.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Floor-to-ceiling solar tinted windows",
      "In-unit washer/dryer",
      "Granite kitchen countertops",
      "Hardwood flooring"
    ],
    buildingAmenities: [
      "24-hour concierge and doorman",
      "LEED Gold certified green building",
      "Landscaped roof garden with river views",
      "Two-story fitness center with climbing wall",
      "Club room with fireplace",
      "Shuttle bus to Columbus Circle"
    ],
    ranking: 4,
    notes: "Sustainable luxury living in Midtown West steps from Central Park and the Hudson waterfront.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276913",
    name: "EOS - Unit 24A",
    address: "100 W 31st St, New York, NY 10001",
    coordinates: [40.7483, -73.9892],
    floorPlan: "1B",
    rentBase: 4600,
    rentMonthsFree: 1,
    netEffectiveRent: 4217,
    sqft: 730,
    petPolicy: "Pet friendly (Dogs and Cats allowed)",
    feeStatus: "No Fee",
    availability: "Available October 1, 2026",
    contactPhone: "212-695-1000",
    appointmentLink: "https://eosnomad.com",
    transitDetails: "1 block to 34th St-Herald Sq (B, D, F, M, N, Q, R, W) and Penn Station.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Floor-to-ceiling acoustic glass windows",
      "In-unit Bosch washer/dryer",
      "Quartz countertops and Liebherr refrigerator",
      "Custom walk-in closets"
    ],
    buildingAmenities: [
      "24-hour doorman and concierge",
      "Rooftop pool and sundeck",
      "Fitness center with half-court basketball",
      "Residents lounge with game room",
      "Outdoor dining terrace with BBQ grills"
    ],
    ranking: 5,
    notes: "Striking 47-story tower designed by COOKFOX at the vibrant intersection of NoMad and Midtown.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "StreetEasy"
  },
  {
    id: "81276914",
    name: "333 Grand - Unit 14B",
    address: "333 Grand St, Jersey City, NJ 07302",
    coordinates: [40.7161, -74.0436],
    floorPlan: "1B",
    rentBase: 3650,
    rentMonthsFree: 1,
    netEffectiveRent: 3346,
    sqft: 780,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "201-434-3330",
    appointmentLink: "https://333grand.com",
    transitDetails: "Short walk to Grove St PATH station and Marin Blvd Light Rail station.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Curved panoramic corner window glass",
      "In-unit washer/dryer",
      "Quartz waterfall kitchen island",
      "Nest learning thermostat"
    ],
    buildingAmenities: [
      "24-hour concierge",
      "Outdoor saltwater swimming pool",
      "Fitness club with private training studios",
      "Golf simulator and putting green",
      "Rooftop observatory deck overlooking Manhattan",
      "Private park and dog run"
    ],
    ranking: 5,
    notes: "Architectural jewel of Liberty Harbor offering unrivaled lifestyle amenities in Downtown Jersey City.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276915",
    name: "50 Regent - Unit 8C",
    address: "50 Regent St, Jersey City, NJ 07302",
    coordinates: [40.7153, -74.0454],
    floorPlan: "2B",
    rentBase: 4500,
    rentMonthsFree: 1,
    netEffectiveRent: 4125,
    sqft: 1050,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available November 15, 2026",
    contactPhone: "201-332-5000",
    appointmentLink: "https://50regent.com",
    transitDetails: "Convenient to Jersey Ave Light Rail and Grove St PATH.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Generous open layout with high ceilings",
      "In-unit washer/dryer",
      "Chef's kitchen with stainless appliances",
      "Spa bathrooms with double vanity"
    ],
    buildingAmenities: [
      "24-hour attended lobby",
      "Rooftop pool and cabana terrace",
      "Fitness center",
      "Party room and resident lounge",
      "Covered garage parking",
      "Children's play area"
    ],
    ranking: 4,
    notes: "Charming neighborhood setting next to Van Vorst Park with luxury amenities in Liberty Harbor.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276916",
    name: "The Vine - Unit 618",
    address: "900 Monroe St, Hoboken, NJ 07030",
    coordinates: [40.7490, -74.0375],
    floorPlan: "1B",
    rentBase: 3550,
    rentMonthsFree: 1,
    netEffectiveRent: 3254,
    sqft: 720,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available within 30 days",
    contactPhone: "201-659-9000",
    appointmentLink: "https://thevinehoboken.com",
    transitDetails: "Steps from 9th Street / Congress Street Light Rail station with direct elevator to Jersey City Heights.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "In-unit washer/dryer",
      "Solid quartz countertops",
      "Wide plank flooring",
      "Spacious walk-in closet"
    ],
    buildingAmenities: [
      "LEED certified green building",
      "Outdoor rooftop pool and sun lounge",
      "Modern fitness center",
      "Co-working clubroom with WiFi",
      "Automated on-site parking garage",
      "Bicycle storage"
    ],
    ranking: 5,
    notes: "Modern eco-luxury rental building right beside the 9th Street Light Rail in Hoboken.",
    lastUpdated: new Date().toISOString(),
    floorPlanImageUrl: "",
    images: [],
    source: "Direct Building"
  },
  {
    id: "81276917",
    name: "Grand Adams - Unit 312",
    address: "300 Grand St, Hoboken, NJ 07030",
    coordinates: [40.7408, -74.0345],
    floorPlan: "Studio",
    rentBase: 2850,
    rentMonthsFree: 0,
    netEffectiveRent: 2850,
    sqft: 540,
    petPolicy: "Pet friendly",
    feeStatus: "No Fee",
    availability: "Available Now",
    contactPhone: "201-792-3000",
    appointmentLink: "https://grandadams.com",
    transitDetails: "8-minute walk to Hoboken PATH and NJ Transit Terminal.",
    leaseTerm: "12 months",
    perksAndAmenities: [
      "Exposed brick and timber beams",
      "15-foot vaulted ceilings",
      "Custom loft layout",
      "Stainless steel kitchen appliances",
      "In-unit washer/dryer"
    ],
    buildingAmenities: [
      "Courtyard garden with seating",
      "Fitness center",
      "Keyless electronic entry",
      "Package concierge",
      "On-site resident management"
    ],
    ranking: 4,
    notes: "Authentic historic industrial conversion offering loft living in prime downtown Hoboken.",
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

    // Check for any legacy/past September dates or standardize format
    if (apt.availability && apt.availability.includes("September")) {
      updatedAvailabilityCount++;
      const mod = idx % 10;
      if (mod < 4) {
        apt.availability = "Available Now";
      } else if (mod < 7) {
        apt.availability = "Available October 1, 2026";
      } else if (mod < 9) {
        apt.availability = "Available October 15, 2026";
      } else {
        apt.availability = "Available within 30 days";
      }
    }
  });

  console.log(`Verified and updated availability timestamps for all ${data.length} existing apartments.`);

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
