const fs = require('fs');
const path = require('path');

const buildings = [
  { name: "The Eugene", address: "435 W 31st St, New York, NY 10001", coords: [40.7523, -73.9986], amenities: ["Basketball Court", "Rock Climbing Wall", "Rooftop Terrace", "Arcade", "Library"] },
  { name: "Sky", address: "605 W 42nd St, New York, NY 10036", coords: [40.7607, -73.9984], amenities: ["Indoor Pool", "Outdoor Pool", "Fitness Center", "Spa", "Pet Spa"] },
  { name: "Via 57 West", address: "625 W 57th St, New York, NY 10019", coords: [40.7712, -73.9934], amenities: ["Courtyard", "Pool", "Basketball Court", "Golf Simulator", "Cinema"] },
  { name: "New York by Gehry", address: "8 Spruce St, New York, NY 10038", coords: [40.7107, -74.0053], amenities: ["Indoor Pool", "Grilling Area", "Fitness Center", "Yoga Studio", "Library"] },
  { name: "MiMA", address: "460 W 42nd St, New York, NY 10036", coords: [40.7588, -73.9946], amenities: ["Equinox Gym", "Dog City", "Outdoor Terrace", "Business Center", "Theater"] },
  { name: "One Blue Slip", address: "1 Blue Slip, Brooklyn, NY 11222", coords: [40.7354, -73.9582], amenities: ["Waterfront Views", "Fitness Center", "Co-working Space", "Lounge", "Roof Deck"] },
  { name: "Two Blue Slip", address: "2 Blue Slip, Brooklyn, NY 11222", coords: [40.7360, -73.9575], amenities: ["Pool", "Waterfront Views", "Fitness Center", "Lounge", "Children's Playroom"] },
  { name: "The Greenpoint", address: "21 India St, Brooklyn, NY 11222", coords: [40.7326, -73.9598], amenities: ["Courtyard", "Sundeck", "Fitness Center", "Basketball Court", "Lounge"] },
  { name: "Eagle & West", address: "227 West St, Brooklyn, NY 11222", coords: [40.7335, -73.9601], amenities: ["Waterfront Pool", "Fitness Center", "Rooftop Farm", "Co-working Space", "Lounge"] },
  { name: "The Amberly", address: "120 Nassau St, Brooklyn, NY 11201", coords: [40.6978, -73.9859], amenities: ["Rooftop Terrace", "Fitness Center", "Lounge", "Co-working Space", "Bike Storage"] },
  { name: "AVA DoBro", address: "100 Willoughby St, Brooklyn, NY 11201", coords: [40.6922, -73.9855], amenities: ["Pet Run", "Fitness Center", "Rooftop Terrace", "BBQ Grills", "Lounge"] },
  { name: "The Hub", address: "333 Schermerhorn St, Brooklyn, NY 11217", coords: [40.6869, -73.9818], amenities: ["Pool", "Dog Run", "Fitness Center", "Lounge", "Rooftop Terrace"] },
  { name: "33 Bond St", address: "33 Bond St, Brooklyn, NY 11201", coords: [40.6888, -73.9825], amenities: ["Chelsea Piers Gym", "Pet Grooming", "Lounge", "Roof Deck", "Co-working Space"] },
  { name: "City Tower", address: "10 City Point, Brooklyn, NY 11201", coords: [40.6911, -73.9830], amenities: ["Basketball Court", "Fitness Center", "Lounge", "Roof Deck", "Business Center"] },
  { name: "The Ashland", address: "250 Ashland Pl, Brooklyn, NY 11217", coords: [40.6865, -73.9782], amenities: ["Rooftop Terrace", "Fitness Center", "Lounge", "Billiard Room", "Children's Playroom"] },
  { name: "Estuary", address: "1600 Harbor Blvd, Weehawken, NJ 07086", coords: [40.7618, -74.0195], amenities: ["Pool", "Fitness Center", "Golf Simulator", "Lounge", "Dog Run"] },
  { name: "Harbor 1500", address: "1500 Harbor Blvd, Weehawken, NJ 07086", coords: [40.7610, -74.0202], amenities: ["Rooftop Pool", "Fitness Center", "Lounge", "Screening Room", "Co-working Space"] },
  { name: "Hamilton House", address: "255 Brunswick St, Jersey City, NJ 07302", coords: [40.7259, -74.0519], amenities: ["Fitness Center", "Rooftop Terrace", "Lounge", "Bike Storage", "Package Room"] },
  { name: "Lenox", address: "207 Van Vorst St, Jersey City, NJ 07302", coords: [40.7153, -74.0416], amenities: ["Pool", "Fitness Center", "Lounge", "Co-working Space", "Dog Run"] },
  { name: "The Hendrix", address: "150 Bay St, Jersey City, NJ 07302", coords: [40.7202, -74.0392], amenities: ["Rooftop Terrace", "Fitness Center", "Lounge", "Art Gallery", "Co-working Space"] },
  { name: "Urby Staten Island", address: "7 Navy Pier Ct, Staten Island, NY 10304", coords: [40.6288, -74.0734], amenities: ["Urban Farm", "Pool", "Fitness Center", "Communal Kitchen", "Dog Run"] }
];

const floorPlans = [
  { type: "Studio", sqftMin: 400, sqftMax: 550, rentMin: 3000, rentMax: 4000 },
  { type: "1B", sqftMin: 600, sqftMax: 800, rentMin: 4000, rentMax: 5500 },
  { type: "2B", sqftMin: 900, sqftMax: 1200, rentMin: 5500, rentMax: 8000 },
  { type: "3B", sqftMin: 1300, sqftMax: 1800, rentMin: 8000, rentMax: 12000 }
];

const file = path.join(__dirname, '../src/data/apartments.json');
let data = JSON.parse(fs.readFileSync(file));

// Find max ID
let maxId = 0;
data.forEach(apt => {
  const id = parseInt(apt.id);
  if (id > maxId) maxId = id;
});

const generateApartments = (count) => {
  const newApts = [];
  let bldgIndex = 0;
  
  for (let i = 0; i < count; i++) {
    const bldg = buildings[bldgIndex % buildings.length];
    bldgIndex++;
    
    const floor = Math.floor(Math.random() * 40) + 2;
    const unitLetter = String.fromCharCode(65 + Math.floor(Math.random() * 10)); // A-J
    const unitName = `${bldg.name} - Unit ${floor}${unitLetter}`;
    
    const fp = floorPlans[Math.floor(Math.random() * floorPlans.length)];
    const sqft = Math.floor(Math.random() * (fp.sqftMax - fp.sqftMin)) + fp.sqftMin;
    const rentBase = Math.floor(Math.random() * (fp.rentMax - fp.rentMin)) + fp.rentMin;
    
    const rentMonthsFree = Math.random() > 0.7 ? 1 : 0;
    const netEffectiveRent = Math.round(rentBase * (12 - rentMonthsFree) / 12);
    
    const apt = {
      id: (++maxId).toString(),
      name: unitName,
      address: bldg.address,
      coordinates: bldg.coords,
      floorPlan: fp.type,
      rentBase,
      rentMonthsFree,
      netEffectiveRent,
      sqft,
      petPolicy: "Pet friendly (Dogs and Cats allowed with fee)",
      feeStatus: "No Fee",
      availability: "Available Now",
      contactPhone: "212-555-" + Math.floor(1000 + Math.random() * 9000),
      appointmentLink: "https://www.google.com/search?q=" + encodeURIComponent(bldg.name + " rentals"),
      transitDetails: "Close to major subway lines and transit hubs.",
      leaseTerm: "12 months",
      perksAndAmenities: [
        "In-unit washer/dryer",
        "Floor-to-ceiling windows",
        "Stainless steel appliances",
        "Hardwood floors",
        "Open-plan kitchen"
      ],
      buildingAmenities: ["24/7 Doorman", "Package Room", "Elevator", ...bldg.amenities],
      rating: (4 + Math.random()).toFixed(1),
      notes: "Luxury building with premium finishes.",
      lastUpdated: new Date().toISOString(),
      floorPlanImageUrl: "",
      images: []
    };
    newApts.push(apt);
  }
  return newApts;
};

// Target total 200 apartments
const needed = 200 - data.length;
if (needed > 0) {
  const generated = generateApartments(needed);
  data = data.concat(generated);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`Added ${needed} new apartments. Total is now ${data.length}.`);
} else {
  console.log(`Already have ${data.length} apartments. No new ones needed.`);
}
