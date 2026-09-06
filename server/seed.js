// ============================================================
// SELF-CONTAINED SEED FILE — NO data.js NEEDED
// Place this file in: MERN-Blog/server/seed.js
// Run with: node seed.js (from inside the server folder)
// ============================================================

const path = require("path");
const mongoose = require("mongoose");
const Article = require("./models/Article");
const { connectDB } = require("./db");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const articles = [
    {
        name: "rajasthan",
        title: "Exploring Rajasthan – Forts, Deserts and Royal Heritage",
        image: "/images/rajasthan.jpg",
        image2: "/images/rajasthan1.jpg",
        state: "Rajasthan",
        sourceLink: "https://www.tourism.rajasthan.gov.in/",
        comments: [],
        content: "## Introduction\n\nRajasthan is one of the most culturally rich and visually spectacular states in India. Known for its magnificent forts, royal palaces, and vast desert landscapes, the state reflects the glorious legacy of Rajput warriors and vibrant traditions that have endured for centuries. It is a land where history lives and breathes in every street, every fort wall, and every folk song sung under a desert sky.\n\n## Top Attractions\n\nCities like Jaipur, Udaipur, and Jodhpur attract travelers from across the world. The Pink City of Jaipur dazzles with Amber Fort, Hawa Mahal, and the City Palace. Udaipur, set around shimmering lakes and crowned with white marble palaces, is consistently ranked among the most romantic cities in the world. Jodhpur's Mehrangarh Fort rises 120 metres above the blue city below. Jaisalmer, the Golden City, rises from the Thar Desert like a mirage — its honey-coloured sandstone fort glowing at sunset in shades of amber and gold.\n\n## Culture & Food\n\nThe colorful festivals of Rajasthan are legendary. The Pushkar Camel Fair, held every November, draws over 50,000 camels and is one of the most photographed events in the world. The Desert Festival in Jaisalmer features folk music, camel races, and turban-tying competitions. Rajasthani cuisine is a culinary adventure — Dal Baati Churma, Laal Maas (fiery red mutton curry), Ker Sangri, and the sweet Ghewar reflect the bold, unforgettable flavours of the desert state.\n\n## Why Visit\n\nThe best time to visit is between October and March. A camel safari through the Thar Desert at sunset, followed by a bonfire dinner and folk music under a sky blazing with stars, is an experience you will carry with you for a lifetime. Rajasthan's craft traditions — blue pottery, block printing, leatherwork, and miniature painting — make it one of the finest shopping destinations in India.\n\n## Conclusion\n\nRajasthan is not just a destination — it is a state of mind, steeped in colour, courage, and the eternal romance of the desert. Whether you come for the forts, the festivals, the food, or simply the feeling of stepping into a living fairy tale, Rajasthan will exceed every expectation and leave you longing to return."
    },
    {
        name: "kerala",
        title: "Discovering Kerala – Backwaters, Spices and Natural Beauty",
        image: "/images/kerala.jpg",
        image2: "/images/kerala1.jpg",
        state: "Kerala",
        sourceLink: "https://www.keralatourism.org/",
        comments: [],
        content: "## Introduction\n\nKerala, often called God's Own Country, is a narrow sliver of extraordinary natural diversity tucked between the Western Ghats and the Arabian Sea. Famous for its peaceful backwaters, lush greenery, and beautiful coastal landscapes stretching for over 600 kilometres, Kerala is a place where the forest meets the sea and ancient traditions flourish alongside modern life.\n\n## Top Attractions\n\nHouseboat journeys through Alleppey's backwaters are Kerala's most iconic experience — gliding through a 900-kilometre network of lakes, canals, and lagoons surrounded by coconut trees and fishing villages. Munnar's rolling tea gardens at 1,600 metres produce some of India's finest teas. The Periyar Wildlife Sanctuary is one of the best places in India to spot wild elephants. Wayanad's forests, Thekkady's spice gardens, and the beaches of Kovalam complete Kerala's remarkable landscape variety.\n\n## Culture & Food\n\nKerala is the birthplace of Ayurveda — the ancient Indian system of natural healing — and dozens of world-class wellness retreats offer authentic Panchakarma treatments. Kathakali, the classical dance drama with elaborate makeup, and Kalaripayattu, one of the world's oldest martial arts, are Kerala's most celebrated art forms. The cuisine — coconut milk curries, fresh seafood, appam with stew, and the legendary Kerala sadya feast served on banana leaves — is distinct from any other Indian regional cooking.\n\n## Why Visit\n\nThe best time to visit is between September and March. The monsoon season transforms Kerala into an extraordinarily lush paradise and is considered the ideal season for Ayurveda treatments. Kerala has one of India's highest literacy rates and is known for its progressive values, making it one of the most welcoming destinations in the country.\n\n## Conclusion\n\nKerala is a destination that rewards slow travel. The more time you spend — drifting on the backwaters, learning to cook a fish curry, or lying in an Ayurveda spa listening to the rain — the deeper its beauty reveals itself. God's Own Country is not a marketing slogan. It is an honest description of a place that feels genuinely blessed."
    },
    {
        name: "himachal-pradesh",
        title: "Himachal Pradesh – Mountains, Adventure and Monastery Trails",
        image: "/images/himachal.jpg",
        image2: "/images/himachal1.jpg",
        state: "Himachal Pradesh",
        sourceLink: "https://himachaltourism.gov.in/",
        comments: [],
        content: "## Introduction\n\nHimachal Pradesh is a paradise for nature lovers, adventure seekers, and spiritual travelers alike. Located deep in the Himalayan region of northern India, this breathtaking state offers snow-capped mountain peaks, ancient Buddhist monasteries perched on cliffsides, dense alpine forests, and some of India's most thrilling adventure sports. From the colonial hill station charm of Shimla to the raw, dramatic high-altitude landscape of Spiti Valley, Himachal Pradesh is a state of extraordinary contrasts.\n\n## Top Attractions\n\nShimla, once the summer capital of British India, retains its colonial charm with Victorian architecture and the famous Mall Road. Manali serves as the gateway to Rohtang Pass and the dramatic landscapes of Lahaul-Spiti. Dharamshala, home to the Dalai Lama and the Tibetan government-in-exile, is a unique cultural melting pot. The Spiti Valley at an average of 3,800 metres features Tabo Monastery (over 1,000 years old, the Ajanta of the Himalayas) and Key Monastery housing over 300 monks.\n\n## Culture & Food\n\nThe Buddhist culture of Spiti and Kinnaur valleys adds a deeply spiritual dimension to any visit. Ancient thangka paintings, prayer flags, and the chanting of monks in centuries-old halls create an atmosphere of profound peace. Himachali cuisine features hearty mountain dishes — Dham (the traditional festive meal), Sidu (steamed wheat bread), and Chha Gosht (lamb in yoghurt and spices) — food designed to fuel life at altitude.\n\n## Why Visit\n\nAdventure activities here are world-class. Paragliding in Bir Billing — considered the paragliding capital of India — attracts flyers globally. River rafting on the Beas and Sutlej, mountain biking, rock climbing, and trekking on routes like the Hampta Pass draw thousands every season. Best time: May to October for trekking, December to February for skiing.\n\n## Conclusion\n\nHimachal Pradesh is a state that changes you. Whether it is the silence of a Spiti monastery at dawn, the rush of paragliding over green valleys, or the joy of watching the first snow fall on Shimla's rooftops, Himachal offers experiences that strip away the noise of everyday life and remind you what it feels like to be truly alive."
    },
    {
        name: "goa",
        title: "Goa – Golden Beaches, Portuguese Heritage and Spice Trails",
        image: "/images/goa.jpg",
        image2: "/images/goa1.jpg",
        state: "Goa",
        sourceLink: "https://goa-tourism.com/",
        comments: [],
        content: "## Introduction\n\nGoa is India's most famous beach destination — a sun-soaked paradise known for its relaxed lifestyle, golden beaches stretching for 105 kilometres, vibrant nightlife, and a unique cultural identity shaped by over 450 years of Portuguese colonial rule. It is a place where Indian and European cultures have fused into something entirely its own: a warm, festive, laid-back spirit that draws millions of visitors every year.\n\n## Top Attractions\n\nNorth Goa buzzes with energy — Baga, Calangute, and Anjuna beaches host beach shacks, water sports, and legendary nightlife. South Goa offers tranquility — Palolem and Agonda are among the most beautiful beaches in Asia. Old Goa, a UNESCO World Heritage Zone, features the magnificent Basilica of Bom Jesus (1605), which holds the preserved remains of Saint Francis Xavier. Dudhsagar Falls, one of India's tallest waterfalls at 310 metres, crashes through the Western Ghats jungle in a spectacular curtain of white.\n\n## Culture & Food\n\nGoa's Portuguese heritage lives in its whitewashed baroque churches, colonial mansions in the Latin Quarter of Fontainhas, and in local Konkani-Portuguese traditions. The Goa Carnival in February fills Panaji streets with parades and dancing. Goan seafood is a culinary tradition to experience at a local family restaurant — prawn balchão, fish curry rice, crab xacuti, and bebinca (the traditional seven-layered coconut dessert) are dishes unlike anything else in India.\n\n## Why Visit\n\nThe best time to visit is between November and February. Christmas and New Year in Goa are spectacular — midnight masses, large outdoor celebrations, and a festive atmosphere that lasts for weeks. The interior spice plantations of cardamom, pepper, vanilla, and nutmeg offer a completely different, quieter side of Goa that most visitors never discover.\n\n## Conclusion\n\nGoa is a state of many moods — wild and festive, quiet and contemplative, historically rich and naturally beautiful. Whether you come for the parties, the Portuguese churches, the seafood, or just to sit on a beach and watch the sun melt into the Arabian Sea, Goa delivers an experience that is entirely and unmistakably its own."
    },
    {
        name: "gujarat",
        title: "Gujarat – White Desert, Asiatic Lions and Vibrant Culture",
        image: "/images/gujarat.jpg",
        image2: "/images/gujarat1.jpg",
        state: "Gujarat",
        sourceLink: "https://www.gujarattourism.com/",
        comments: [],
        content: "## Introduction\n\nGujarat is a state of extraordinary contrasts and compelling stories. From the blinding white salt flats of the Rann of Kutch — the world's largest salt desert — to the dense forests of Gir National Park, from ancient stepwells of breathtaking geometric complexity to thriving modern cities, Gujarat rewards curious travelers with experiences they cannot find anywhere else on Earth.\n\n## Top Attractions\n\nThe Rann of Kutch, stretching 7,500 square kilometres of shimmering white salt crust, transforms into an otherworldly landscape during full moon nights in winter. Gir National Park is the last natural habitat of the Asiatic lion — with over 600 lions, it is one of the world's great conservation success stories. The Rani ki Vav stepwell at Patan is a UNESCO World Heritage Site descending seven storeys into the earth with over 500 principal sculptures. The Modhera Sun Temple (1026 AD) is aligned so the sun illuminates the sanctum at every equinox.\n\n## Culture & Food\n\nGujarat is spiritually significant — Somnath Temple is one of the twelve Jyotirlingas of Lord Shiva, and Dwarka is one of the four sacred Char Dham pilgrimage sites. The Rann Utsav festival celebrates art, music, and handicrafts in a spectacular tent city at the desert's edge. Gujarati cuisine — Dhokla, Thepla, Undhiyu, and the famous thali with its sweet-salty-spicy balance — is one of India's finest vegetarian food traditions.\n\n## Why Visit\n\nThe Rann Utsav alone is worth the journey — full moon walks across glowing white salt flats have no equivalent anywhere in the world. The state's handcraft tradition — Kutchi embroidery, mirror work, Patola silk weaving — produces some of the most beautiful textiles in Asia and makes Gujarat one of the best shopping destinations in India.\n\n## Conclusion\n\nGujarat is a state that surprises at every turn. You come for the Rann and stay for the lions. You visit the temples and discover the stepwells. You taste one dish and end up learning to cook an entire thali. It is a state that gives generously to every traveler who arrives with curiosity."
    },
    {
        name: "varanasi",
        title: "Varanasi – The Eternal City on the Banks of the Ganges",
        image: "/images/varanasi.jpg",
        image2: "/images/varanasi1.jpg",
        state: "Uttar Pradesh",
        sourceLink: "https://uptourism.gov.in/",
        comments: [],
        content: "## Introduction\n\nVaranasi is one of the oldest continuously inhabited cities in the world — older than history, older than legend, older than most of the world's great civilisations. Located on the western banks of the sacred Ganges River in Uttar Pradesh, it is the spiritual heart of India and holds a unique place in the consciousness of over a billion Hindus worldwide. Mark Twain wrote that Varanasi is older than history, older than tradition, and looks twice as old as all of them put together.\n\n## Top Attractions\n\nThe 88 ghats of Varanasi line the Ganges in a continuous arc, each with its own history and mythology. Dashashwamedh Ghat hosts the Ganga Aarti every evening — a spectacular fire ritual performed by seven priests in perfectly synchronised movements that draws thousands of pilgrims nightly. The Kashi Vishwanath Temple, one of the twelve Jyotirlingas, is the most sacred Shiva temple in the world. Sarnath, 13 km away, is where the Buddha delivered his first sermon and is one of the holiest Buddhist pilgrimage sites on Earth.\n\n## Culture & Food\n\nVaranasi is a labyrinth of thousands of narrow winding galis packed with ancient temples, silk weavers, and flower shops. The city's Banarasi silk sarees — handwoven with intricate brocade patterns in real gold and silver threads — are the most coveted wedding sarees in India. The Dev Deepawali festival, when all 88 ghats are lit with over a million earthen lamps, is one of the most visually breathtaking spectacles in the world. The food is legendary — Banarasi chaat, kachori sabzi, malaiyo (winter milk foam dessert), and the famous Banarasi paan.\n\n## Why Visit\n\nThere is nowhere else on Earth quite like Varanasi. Watching the Ganga Aarti from a wooden rowboat on the dark river as the flames reflect in the water is an experience that marks people for life. The city confronts you with the full cycle of existence — birth, faith, death, and the river flowing on — in a way that no other place can.\n\n## Conclusion\n\nVaranasi does not merely entertain — it transforms. Whether you are a pilgrim, a photographer, a philosopher, or simply a traveler seeking something real, Varanasi will give you more than you came looking for. It is the city where India's soul is most visible, most raw, and most honest."
    },
    {
        name: "sikkim",
        title: "Sikkim – Himalayan Monasteries, Orchids and Mountain Views",
        image: "/images/sikkim.jpg",
        image2: "/images/sikkim1.jpg",
        state: "Sikkim",
        sourceLink: "https://sikkimtourism.gov.in/",
        comments: [],
        content: "## Introduction\n\nSikkim is India's smallest state and arguably one of its most breathtakingly beautiful. Nestled in the eastern Himalayas between Nepal, Tibet, and Bhutan, this peaceful and deeply spiritual state became India's 22nd state only in 1975, and its relatively recent integration has helped preserve much of its original Himalayan character. Known for stunning mountain landscapes, ancient Buddhist monasteries, and extraordinary floral diversity, Sikkim feels like a world apart.\n\n## Top Attractions\n\nGangtok, the capital set on a ridge at 1,650 metres, offers breathtaking views of Mount Kanchenjunga — the third-highest peak in the world at 8,586 metres — on clear mornings. Tsomgo Lake at 3,753 metres blooms with rhododendrons in spring and freezes in winter. Yumthang Valley, the Valley of Flowers, erupts with 24 varieties of rhododendrons every April and May. Rumtek and Pemayangtse monasteries are among the most significant in the Kagyu lineage of Tibetan Buddhism.\n\n## Culture & Food\n\nSikkim is home to over 600 species of orchids — more than any other region in India — earning it the title of orchid capital of the country. In 2016, it became the world's first fully organic state, banning all chemical fertilisers. The Losar and Saga Dawa festivals are celebrated with colourful mask dances and community prayers. Sikkimese cuisine — Thukpa, Momos, Phagshapa (pork with radish), and Tongba (millet beer in bamboo) — reflects rich Tibetan and Nepali influences.\n\n## Why Visit\n\nSikkim's biodiversity is extraordinary — the Himalayan Zoological Park is home to red pandas, snow leopards, and Himalayan black bears. Birdwatchers consider it one of the finest destinations in Asia with over 550 species recorded. The entire state has a calm, unhurried atmosphere that is increasingly rare in modern India.\n\n## Conclusion\n\nSikkim offers something increasingly rare in the modern world — genuine silence, unspoiled nature, and a spiritual atmosphere that settles over you slowly and stays long after you leave. It is the kind of place that makes you want to stay longer than you planned, and return sooner than you expected."
    },
    {
        name: "manipur",
        title: "Manipur – The Jewel of Northeast India and its Living Arts",
        image: "/images/manipur.jpg",
        image2: "/images/manipur1.jpg",
        state: "Manipur",
        sourceLink: "https://manipurtourism.gov.in/",
        comments: [],
        content: "## Introduction\n\nManipur is widely known as the Jewel of Northeast India — a title that perfectly captures the state's precious combination of natural beauty, extraordinary cultural traditions, and artistic heritage that remain largely undiscovered by mainstream tourism. Tucked in India's far northeast bordering Myanmar, Manipur is a land of hills and valleys, sacred lakes and ancient polo grounds, classical dancers and fierce martial artists — a state that has been quietly perfecting its arts for millennia.\n\n## Top Attractions\n\nLoktak Lake — the largest freshwater lake in Northeast India — is famous for its phumdis: unique circular floating islands of vegetation that drift across the surface. The Keibul Lamjao National Park, the world's only floating national park, sits on these phumdis and is the last refuge of the endangered Sangai deer. The Mapal Kangjeibung in Imphal is the world's oldest polo ground — still in use today. Polo was invented here over 3,000 years ago and exported to the rest of the world by British officers in the 19th century.\n\n## Culture & Food\n\nManipur classical dance is one of the eight classical dance forms of India, known for its graceful lyrical movements and devotional themes from the Radha-Krishna legend. The Manipuri martial art of Thang-Ta — combining swordsmanship and spear techniques — is one of the oldest combat systems in South Asia. The Ima Keithel (Mothers' Market) in Imphal, the largest all-women market in Asia, has been run entirely by women for over 500 years. Manipuri cuisine features Eromba (fermented fish chutney) and Chamthong (light vegetable stew).\n\n## Why Visit\n\nManipur's handloom industry is one of the finest in India — the traditional Moirangphee fabric and Wangkhei Phee silk are prized internationally. Dzükou Valley, shared with Nagaland, is one of Northeast India's most beautiful alpine valleys, blooming with rare seasonal flowers every monsoon. The state offers authentic cultural experiences completely off the beaten tourist trail.\n\n## Conclusion\n\nManipur is India's best-kept secret. It is a state where the oldest sport in the world was born, where women have run the market economy for five centuries, and where classical arts have survived and flourished through every challenge. To visit Manipur is to discover an India that most travelers never see — and never forget."
    },
    {
        name: "jammu-kashmir",
        title: "Jammu & Kashmir – Paradise on Earth Across Three Regions",
        image: "/images/jammu-Kashmir.jpg",
        image2: "/images/jammu-Kashmir1.jpg",
        state: "Jammu & Kashmir",
        sourceLink: "https://www.jktdc.co.in/",
        comments: [],
        content: "## Introduction\n\nJammu and Kashmir is often called Paradise on Earth — and it lives up to that extraordinary title across its three dramatically different regions: the Hindu-majority plains of Jammu, the lush lake-studded beauty of the Kashmir Valley, and the Buddhist high-altitude desert of Ladakh. Each region offers a completely different landscape, culture, and spiritual atmosphere, making Jammu and Kashmir one of the most diverse travel destinations in the world.\n\n## Top Attractions\n\nSrinagar, the summer capital, is built around the legendary Dal Lake where traditional shikara boats glide past floating gardens and ornately decorated houseboats. Gulmarg at 2,650 metres is India's premier ski resort in winter and a wildflower meadow in summer, home to one of the world's highest gondola cable cars. Pahalgam, the Valley of Shepherds, is the base for the annual Amarnath Yatra pilgrimage. The Mughal gardens — Shalimar Bagh (built by Emperor Jahangir in 1619) and Nishat Bagh — are among the finest examples of Mughal landscape architecture in the world.\n\n## Culture & Food\n\nThe chinar leaf-fall of October, when Srinagar's trees turn brilliant crimson and gold, is one of the most beautiful seasonal transformations in Asia. Kashmiri handicrafts are world-renowned — Pashmina shawls from Changthangi goat wool, hand-knotted silk carpets that take years to complete, and delicate papier-mâché painted with miniature scenes represent 600 years of craftsmanship. Kashmiri cuisine — Rogan Josh, Gushtaba, Yakhni, and the legendary multi-course Wazwan feast — is one of India's most celebrated culinary traditions.\n\n## Why Visit\n\nThe Kashmir Valley in spring — when chinar trees bud, mustard fields turn yellow, and almond blossoms carpet the valley floor — is one of the most beautiful natural spectacles in Asia. Ladakh offers high-altitude adventure, ancient monasteries, and a landscape so dramatic it is used as a stand-in for other planets in films.\n\n## Conclusion\n\nJammu and Kashmir is a destination that exceeds every expectation. The beauty is real, the hospitality is legendary, and the experience — whether on a houseboat on Dal Lake, trekking through alpine meadows, or sitting in a centuries-old mosque at evening prayer — stays with you permanently."
    },
    {
        name: "ram-mandir",
        title: "Ayodhya Ram Mandir – A Living Symbol of Faith, Architecture and Heritage",
        image: "/images/ram-mandir.jpg",
        image2: "/images/ram-mandir1.jpg",
        state: "Uttar Pradesh",
        sourceLink: "https://uptourism.gov.in/",
        comments: [],
        content: "## Introduction\n\nThe Ram Mandir in Ayodhya is one of the most significant religious, cultural, and architectural landmarks in modern India. Consecrated in January 2024, the temple stands as a living monument to the faith of hundreds of millions of Hindus across generations and as a masterpiece of traditional Nagara-style Hindu temple architecture. Its inauguration was witnessed by over a billion people, making it one of the most watched events in Indian history.\n\n## Top Attractions\n\nThe Ram Mandir complex spans 70 acres. The main temple rises 161 feet, built entirely from Rajasthan's pink Bansi Paharpur sandstone without steel or iron. Over 200 intricately carved pillars depict scenes from the Ramayana, Mahabharata, and the Puranas. The sanctum sanctorum houses the idol of Ram Lalla — the child form of Lord Ram — carved from a single block of black shaligramite stone. The complex also houses shrines to Surya, Ganesha, Shiva, Durga, Annapurna, and Hanuman.\n\n## Culture & Food\n\nAyodhya is one of the seven sacred cities of Hinduism — believed to be the birthplace of Lord Ram. Walking its ancient lanes past temples that have stood for a thousand years feels like moving through living scripture. The Hanuman Garhi temple, Kanak Bhawan, and the Nageshwarnath Temple are among the most revered sites in the city. Ayodhya's local cuisine features puri sabzi, rabdi, and the famous temple prasad of pedas and laddoos.\n\n## Why Visit\n\nThe Saryu River ghats at dawn — when priests perform the morning aarti and thousands of pilgrims take their holy dip — offer a deeply moving spiritual experience. The best time to visit is Ram Navami (March-April), when the city transforms into a sea of devotees and celebrations lasting for days. Diwali in Ayodhya — millions of earthen diyas lit along the Saryu ghats — is a spectacle of unparalleled beauty.\n\n## Conclusion\n\nThe Ram Mandir is more than a temple — it is a testament to the enduring power of faith, the artistry of Indian craftsmanship, and the continuity of a civilisation that has kept its traditions alive across thousands of years. To visit Ayodhya is to touch something ancient, something living, and something that belongs to the deepest layer of India's identity."
    },
    {
        name: "maharashtra",
        title: "Maharashtra – Caves, Coasts and Cultural Capitals",
        image: "/images/maharashtra.jpg",
        image2: "/images/maharashtra1.jpg",
        state: "Maharashtra",
        sourceLink: "https://maharashtratourism.gov.in/",
        comments: [],
        content: "## Introduction\n\nMaharashtra is a state of remarkable diversity, home to India's financial capital, Mumbai, and ancient rock-cut caves that have stood the test of time. From the bustling streets of its cities to the serene beaches of the Konkan coast, it offers an incredible mix of modernity and tradition.\n\n## Top Attractions\n\nThe Ajanta and Ellora Caves, UNESCO World Heritage Sites, showcase exquisite ancient Indian art and rock-cut architecture. Mumbai, the city of dreams, features iconic landmarks like the Gateway of India and Marine Drive. The hill stations of Mahabaleshwar and Lonavala provide breathtaking views of the Western Ghats.\n\n## Culture & Food\n\nMaharashtra's culture is vibrant, celebrated through festivals like Ganesh Chaturthi. The cuisine is flavorful, with popular dishes including Vada Pav, Misal Pav, Puran Poli, and the coastal seafood delicacies of Malvan.\n\n## Why Visit\n\nWhether you're exploring the historic forts of Shivaji Maharaj, relaxing on the pristine beaches of Ganpatipule, or experiencing the high energy of Mumbai, Maharashtra caters to every kind of traveler.\n\n## Conclusion\n\nMaharashtra offers a dynamic blend of history, nature, and urban culture. It is a state where ancient traditions seamlessly coexist with the rapid pace of modern life."
    },
    {
        name: "punjab",
        title: "Punjab – Land of Five Rivers and the Golden Temple",
        image: "/images/punjab.jpg",
        image2: "/images/punjab1.jpg",
        state: "Punjab",
        sourceLink: "https://punjabtourism.punjab.gov.in/",
        comments: [],
        content: "## Introduction\n\nPunjab, the land of five rivers, is known for its rich agricultural heritage, vibrant culture, and the indomitable spirit of its people. It is the heart of Sikhism and a state that welcomes visitors with open arms and hearty hospitality.\n\n## Top Attractions\n\nThe Golden Temple in Amritsar is the holiest shrine of Sikhism, radiating peace and spiritual energy. The Jallianwala Bagh stands as a poignant reminder of India's freedom struggle. The Wagah Border ceremony near Amritsar is a patriotic spectacle that draws thousands daily.\n\n## Culture & Food\n\nPunjabi culture is synonymous with exuberance, expressed through the energetic Bhangra dance and colorful festivals like Baisakhi. The food is legendary—Makki di Roti with Sarson da Saag, Butter Chicken, Amritsari Kulcha, and massive glasses of sweet Lassi are culinary experiences not to be missed.\n\n## Why Visit\n\nVisiting Punjab is about experiencing the warmth of its people. The community kitchen (Langar) at the Golden Temple, which feeds thousands daily regardless of their background, is a profound testament to the state's ethos of equality and service.\n\n## Conclusion\n\nPunjab offers a journey full of vibrant colors, rich flavors, and spiritual depth. It is a state that celebrates life in its truest sense, leaving every visitor with a full heart and a satisfied palate."
    }
];

const seed = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await connectDB();
        console.log("Connected!");

        await Article.deleteMany({});
        console.log("Old articles cleared.");

        const inserted = await Article.insertMany(articles);
        console.log(`Seeded ${inserted.length} articles successfully!\n`);

        console.log("Verifying image2 fields:");
        inserted.forEach(a => {
            const status = a.image2 ? "OK" : "MISSING";
            console.log(`  [${status}] ${a.name}: ${a.image2}`);
        });

        console.log("\nDone! Now restart your server: nodemon server.js");
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seed();