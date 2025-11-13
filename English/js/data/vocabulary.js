/**
 * Vocabulary Data for Emma's English Practice
 * High-frequency words for 8-year-olds, organized by tier/week
 */

const vocabularyData = {
    // Tier 1: Essential (Week 1-2) - 25 words
    tier1: [
        // Personal pronouns
        { word: 'I', definition: 'me, myself', example: 'I like pizza.', image: 'self', tier: 1 },
        { word: 'you', definition: 'the person I am talking to', example: 'You are nice.', image: 'you', tier: 1 },
        { word: 'me', definition: 'myself', example: 'Give it to me.', image: 'self', tier: 1 },
        { word: 'my', definition: 'belonging to me', example: 'This is my book.', image: 'possession', tier: 1 },
        { word: 'we', definition: 'me and others', example: 'We play together.', image: 'group', tier: 1 },

        // Family
        { word: 'mom', definition: 'mother', example: 'My mom is kind.', image: 'mother', tier: 1 },
        { word: 'dad', definition: 'father', example: 'Dad reads to me.', image: 'father', tier: 1 },
        { word: 'sister', definition: 'girl in my family', example: 'My sister plays.', image: 'sister', tier: 1 },
        { word: 'brother', definition: 'boy in my family', example: 'I have a brother.', image: 'brother', tier: 1 },
        { word: 'family', definition: 'people who live together', example: 'I love my family.', image: 'family', tier: 1 },

        // Common words
        { word: 'the', definition: 'points to a specific thing', example: 'The cat is here.', image: 'article', tier: 1 },
        { word: 'a', definition: 'one thing', example: 'I see a dog.', image: 'article', tier: 1 },
        { word: 'is', definition: 'to be', example: 'The sky is blue.', image: 'verb-be', tier: 1 },
        { word: 'am', definition: 'I be', example: 'I am happy.', image: 'verb-be', tier: 1 },
        { word: 'are', definition: 'you/we/they be', example: 'You are smart.', image: 'verb-be', tier: 1 },
        { word: 'like', definition: 'enjoy', example: 'I like ice cream.', image: 'heart', tier: 1 },
        { word: 'want', definition: 'wish to have', example: 'I want to play.', image: 'desire', tier: 1 },

        // Basic nouns
        { word: 'cat', definition: 'small furry pet', example: 'The cat says meow.', image: 'cat', tier: 1 },
        { word: 'dog', definition: 'pet that barks', example: 'My dog is big.', image: 'dog', tier: 1 },
        { word: 'ball', definition: 'round toy', example: 'Throw the ball.', image: 'ball', tier: 1 },
        { word: 'book', definition: 'pages with stories', example: 'I read a book.', image: 'book', tier: 1 },
        { word: 'car', definition: 'vehicle that drives', example: 'Dad drives a car.', image: 'car', tier: 1 },
        { word: 'house', definition: 'place we live', example: 'I live in a house.', image: 'house', tier: 1 },
        { word: 'friend', definition: 'person I like', example: 'She is my friend.', image: 'friends', tier: 1 },
        { word: 'day', definition: 'time when sun is up', example: 'Today is a good day.', image: 'sun', tier: 1 }
    ],

    // Tier 2: Expanding (Week 3-4) - 25 words
    tier2: [
        // Actions
        { word: 'run', definition: 'move fast', example: 'I run in the park.', image: 'running', tier: 2 },
        { word: 'jump', definition: 'leap up', example: 'Jump over the rope.', image: 'jumping', tier: 2 },
        { word: 'eat', definition: 'have food', example: 'I eat breakfast.', image: 'eating', tier: 2 },
        { word: 'play', definition: 'have fun', example: 'Let\'s play a game.', image: 'playing', tier: 2 },
        { word: 'read', definition: 'look at words', example: 'I read books.', image: 'reading', tier: 2 },
        { word: 'write', definition: 'make words', example: 'I write my name.', image: 'writing', tier: 2 },
        { word: 'walk', definition: 'move on feet', example: 'We walk to school.', image: 'walking', tier: 2 },
        { word: 'sleep', definition: 'rest at night', example: 'I sleep in my bed.', image: 'sleeping', tier: 2 },
        { word: 'see', definition: 'look at', example: 'I see a bird.', image: 'eyes', tier: 2 },
        { word: 'go', definition: 'move to a place', example: 'Let\'s go home.', image: 'arrow', tier: 2 },

        // Descriptors
        { word: 'big', definition: 'large in size', example: 'The elephant is big.', image: 'big', tier: 2 },
        { word: 'small', definition: 'tiny in size', example: 'The ant is small.', image: 'small', tier: 2 },
        { word: 'happy', definition: 'feeling good', example: 'I feel happy today.', image: 'happy-face', tier: 2 },
        { word: 'sad', definition: 'feeling bad', example: 'She looks sad.', image: 'sad-face', tier: 2 },
        { word: 'red', definition: 'color like apple', example: 'The rose is red.', image: 'red', tier: 2 },
        { word: 'blue', definition: 'color like sky', example: 'The sky is blue.', image: 'blue', tier: 2 },
        { word: 'good', definition: 'nice, positive', example: 'This is good food.', image: 'thumbs-up', tier: 2 },
        { word: 'new', definition: 'not old', example: 'I have new shoes.', image: 'new', tier: 2 },

        // Places
        { word: 'home', definition: 'where I live', example: 'I go home now.', image: 'home', tier: 2 },
        { word: 'school', definition: 'where I learn', example: 'I go to school.', image: 'school', tier: 2 },
        { word: 'park', definition: 'place to play outside', example: 'We play at the park.', image: 'park', tier: 2 },
        { word: 'store', definition: 'place to buy things', example: 'Mom shops at the store.', image: 'store', tier: 2 },

        // Time/other
        { word: 'time', definition: 'when something happens', example: 'What time is it?', image: 'clock', tier: 2 },
        { word: 'today', definition: 'this day', example: 'Today is Monday.', image: 'calendar', tier: 2 },
        { word: 'fun', definition: 'enjoyable', example: 'Games are fun!', image: 'fun', tier: 2 }
    ],

    // Tier 3: Advanced (Week 5-8) - 30 words for future expansion
    tier3: [
        { word: 'because', definition: 'for this reason', example: 'I smile because I\'m happy.', image: 'reason', tier: 3 },
        { word: 'help', definition: 'assist someone', example: 'Can you help me?', image: 'helping', tier: 3 },
        { word: 'think', definition: 'use your mind', example: 'I think it\'s true.', image: 'thinking', tier: 3 },
        { word: 'know', definition: 'understand something', example: 'I know the answer.', image: 'lightbulb', tier: 3 },
        { word: 'make', definition: 'create something', example: 'Let\'s make a cake.', image: 'making', tier: 3 },
        { word: 'find', definition: 'discover something', example: 'I found my toy.', image: 'finding', tier: 3 },
        { word: 'give', definition: 'hand to someone', example: 'Give me the ball.', image: 'giving', tier: 3 },
        { word: 'take', definition: 'get and hold', example: 'Take this cookie.', image: 'taking', tier: 3 },
        { word: 'come', definition: 'move here', example: 'Come with me!', image: 'come', tier: 3 },
        { word: 'try', definition: 'attempt to do', example: 'Try to jump high.', image: 'trying', tier: 3 },
        { word: 'beautiful', definition: 'very pretty', example: 'The flower is beautiful.', image: 'beautiful', tier: 3 },
        { word: 'fast', definition: 'quick speed', example: 'The car is fast.', image: 'fast', tier: 3 },
        { word: 'slow', definition: 'not fast', example: 'The turtle is slow.', image: 'slow', tier: 3 },
        { word: 'hot', definition: 'high temperature', example: 'The soup is hot.', image: 'hot', tier: 3 },
        { word: 'cold', definition: 'low temperature', example: 'Ice is cold.', image: 'cold', tier: 3 },
        { word: 'water', definition: 'clear liquid to drink', example: 'I drink water.', image: 'water', tier: 3 },
        { word: 'food', definition: 'what we eat', example: 'I like this food.', image: 'food', tier: 3 },
        { word: 'morning', definition: 'early part of day', example: 'Good morning!', image: 'sunrise', tier: 3 },
        { word: 'night', definition: 'when it\'s dark', example: 'Good night!', image: 'moon', tier: 3 },
        { word: 'year', definition: '12 months', example: 'I am 8 years old.', image: 'calendar', tier: 3 },
        { word: 'love', definition: 'strong like feeling', example: 'I love my family.', image: 'love', tier: 3 },
        { word: 'look', definition: 'use eyes to see', example: 'Look at the sky!', image: 'looking', tier: 3 },
        { word: 'use', definition: 'do something with', example: 'I use a pencil.', image: 'using', tier: 3 },
        { word: 'work', definition: 'do a job', example: 'Dad works hard.', image: 'working', tier: 3 },
        { word: 'way', definition: 'how to do something', example: 'This is the way.', image: 'path', tier: 3 },
        { word: 'many', definition: 'a lot of', example: 'I have many toys.', image: 'many', tier: 3 },
        { word: 'thing', definition: 'an object', example: 'What is this thing?', image: 'thing', tier: 3 },
        { word: 'place', definition: 'a location', example: 'This is a nice place.', image: 'place', tier: 3 },
        { word: 'little', definition: 'small amount', example: 'A little bit more.', image: 'little', tier: 3 },
        { word: 'always', definition: 'every time', example: 'I always brush my teeth.', image: 'always', tier: 3 }
    ]
};

// Sight words (Dolch list - most common)
const sightWords = [
    'the', 'a', 'an', 'and', 'or', 'but',
    'I', 'you', 'he', 'she', 'it', 'we', 'they',
    'am', 'is', 'are', 'was', 'were',
    'can', 'will', 'do', 'have', 'has',
    'this', 'that', 'these', 'those',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'from'
];

// Get all words as flat array
function getAllVocabulary() {
    return [...vocabularyData.tier1, ...vocabularyData.tier2, ...vocabularyData.tier3];
}

// Get words by tier
function getVocabularyByTier(tier) {
    return vocabularyData[`tier${tier}`] || [];
}

// Get random word from tier
function getRandomWord(tier = 1) {
    const words = getVocabularyByTier(tier);
    return words[Math.floor(Math.random() * words.length)];
}

// Get random words (multiple)
function getRandomWords(count, tier = 1) {
    const words = getVocabularyByTier(tier);
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
