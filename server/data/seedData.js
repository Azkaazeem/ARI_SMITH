// Authentic Google Reviews from https://arismith.co.uk/
export const initialReviews = [
  {
    clientName: "Nathan Monath",
    eventCategory: "Verified Google Review • Private Celebration",
    quote: "Ari is an incredible magician, mentalist and all-round entertainer. He has a brilliant way of engaging a crowd and leaving everyone genuinely amazed. Professional, charismatic and seriously talented — highly recommended for anyone looking to make an event memorable!",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-07-15")
  },
  {
    clientName: "Amber Harrison",
    eventCategory: "Verified Google Review • Corporate Event (50+ Guests)",
    quote: "Ari was amazing at our work event for 50+ people! He was really engaging with multiple smaller groups so everybody got to participate, and his magic was absolutely mind blowing! Everybody had a great time. He was also a pleasure to speak with throughout the whole booking process which makes a huge difference as an organiser. Please book him for your event, you will be delighted that you did.",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-07-28")
  },
  {
    clientName: "Natan Levine",
    eventCategory: "Verified Google Review • Evening Gala",
    quote: "We had the best experience with Ari recently - he had everyone gripped to what he was doing and brought a different dynamic to the evening. Would 100% recommend",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-08-02")
  },
  {
    clientName: "Oli Assor",
    eventCategory: "Verified Google Review • Repeat Performance Client",
    quote: "Having seen his performances multiple times, I can safely say I am always truly blown away. He is not only incredible at what he does, but does it in a way that encapsulates an audience or just an individual seeing his magic in action. I would highly recommend having Ari at your next event!",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-08-10")
  },
  {
    clientName: "Samuel Jones",
    eventCategory: "Verified Google Review • Annual Company Summit",
    quote: "Ari hosted on our annual company event, he spent time going round the audience and getting participation from us all to engage us in some mind blowing magic & illusion. We were all blown away and left in awe. Would highly recommend for any event to add a little magic to it!",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-08-14")
  },
  {
    clientName: "Jade W",
    eventCategory: "Verified Google Review • Team Celebration",
    quote: "Ari came to our team night out and absolutely blew our minds. I'm still thinking about how what he did was even possible. He was super friendly and probably a wizard... Cannot recommend Ari enough, I've not got a clue how he pulls off these impossible tricks.",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-08-18")
  },
  {
    clientName: "Tom Ailes",
    eventCategory: "Verified Google Review • Private Gathering",
    quote: "Great energy, great illusions, really lovely dude. Responsive and thorough back of house. What's not to like!",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-08-22")
  },
  {
    clientName: "Amber King",
    eventCategory: "Verified Google Review • Wedding Reception",
    quote: "WOW. What a fantastic magician, absolutely blew our minds!",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-08-26")
  },
  {
    clientName: "Gershy Dome",
    eventCategory: "Verified Google Review • Special Occasion",
    quote: "Literally blew my mind!!! Class act!!",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-08-28")
  },
  {
    clientName: "Ari Rubin",
    eventCategory: "Verified Google Review • Performance Guest",
    quote: "This man bleeds magic, and I was seriously impressed with his skill. Would highly recommend for any event.",
    rating: 5,
    verifiedBadge: true,
    createdAt: new Date("2026-08-30")
  }
];

export const initialBlockedDates = [
  "2026-09-12",
  "2026-09-18",
  "2026-09-25",
  "2026-10-02",
  "2026-10-15",
  "2026-10-31",
  "2026-11-14",
  "2026-11-28",
  "2026-12-12",
  "2026-12-24",
  "2026-12-31"
];

export const initialBookings = [];

export const initialSettings = {
  activeNotice: "Accepting select bookings across Manchester, the UK, and international destinations.",
  blockedDates: initialBlockedDates,
  defaultTheme: "abyssal",
  contactEmail: "contact@arismith.co.uk",
  instagram: "@AriSmith_Magic",
  website: "www.arismith.co.uk",
  location: "Manchester · UK & International",
  adminUser: "ari@smith-illusion.co.uk",
  adminPasswordHash: "theillusionist"
};
