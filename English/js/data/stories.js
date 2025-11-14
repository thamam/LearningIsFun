/**
 * Stories Data for Emma's English Practice
 * TPRS-inspired stories with comprehension questions
 */

const storiesData = [
    {
        id: 'story1',
        title: 'The Hungry Cat',
        level: 'easy',
        targetWords: ['cat', 'hungry', 'fish', 'happy', 'eat'],
        sentences: [
            { text: 'The cat was very hungry.', image: 'cat-hungry' },
            { text: 'She looked for food.', image: 'cat-looking' },
            { text: 'She found a big fish.', image: 'cat-fish' },
            { text: 'The cat ate the fish.', image: 'cat-eating' },
            { text: 'Now the cat was happy!', image: 'cat-happy' }
        ],
        questions: [
            {
                question: 'How did the cat feel at the beginning?',
                options: ['hungry', 'happy', 'tired'],
                correct: 0,
                type: 'choice'
            },
            {
                question: 'What did the cat find?',
                options: ['a ball', 'a fish', 'a mouse'],
                correct: 1,
                type: 'choice'
            },
            {
                question: 'How did the cat feel at the end?',
                options: ['sad', 'angry', 'happy'],
                correct: 2,
                type: 'choice'
            }
        ]
    },

    {
        id: 'story2',
        title: 'Going to the Park',
        level: 'easy',
        targetWords: ['park', 'play', 'ball', 'friend', 'fun'],
        sentences: [
            { text: 'Emma went to the park.', image: 'park' },
            { text: 'She saw her friend there.', image: 'two-girls' },
            { text: 'They played with a ball.', image: 'playing-ball' },
            { text: 'They ran and jumped.', image: 'running-jumping' },
            { text: 'It was a fun day!', image: 'happy-kids' }
        ],
        questions: [
            {
                question: 'Where did Emma go?',
                options: ['to school', 'to the park', 'to the store'],
                correct: 1,
                type: 'choice'
            },
            {
                question: 'Who did Emma see?',
                options: ['her mom', 'her friend', 'a dog'],
                correct: 1,
                type: 'choice'
            },
            {
                question: 'What did they play with?',
                options: ['a ball', 'a book', 'a car'],
                correct: 0,
                type: 'choice'
            }
        ]
    },

    {
        id: 'story3',
        title: 'The Big Dog',
        level: 'easy',
        targetWords: ['dog', 'big', 'small', 'friend', 'play'],
        sentences: [
            { text: 'There was a big dog.', image: 'big-dog' },
            { text: 'The dog had a small friend.', image: 'dog-and-cat' },
            { text: 'The small friend was a cat.', image: 'small-cat' },
            { text: 'They liked to play together.', image: 'dog-cat-playing' },
            { text: 'They were good friends.', image: 'dog-cat-friends' }
        ],
        questions: [
            {
                question: 'What was big?',
                options: ['the cat', 'the dog', 'the house'],
                correct: 1,
                type: 'choice'
            },
            {
                question: 'Who was the dog\'s friend?',
                options: ['a cat', 'a bird', 'a fish'],
                correct: 0,
                type: 'choice'
            },
            {
                question: 'What did they like to do?',
                options: ['sleep', 'eat', 'play together'],
                correct: 2,
                type: 'choice'
            }
        ]
    },

    {
        id: 'story4',
        title: 'Breakfast Time',
        level: 'easy',
        targetWords: ['morning', 'eat', 'food', 'family', 'happy'],
        sentences: [
            { text: 'It was morning time.', image: 'sunrise' },
            { text: 'Emma woke up.', image: 'girl-waking' },
            { text: 'Her family was in the kitchen.', image: 'family-kitchen' },
            { text: 'They ate breakfast together.', image: 'eating-breakfast' },
            { text: 'Emma was happy.', image: 'happy-girl' }
        ],
        questions: [
            {
                question: 'When did this happen?',
                options: ['morning', 'night', 'afternoon'],
                correct: 0,
                type: 'choice'
            },
            {
                question: 'Where was Emma\'s family?',
                options: ['in the park', 'in the kitchen', 'at school'],
                correct: 1,
                type: 'choice'
            },
            {
                question: 'What did they do together?',
                options: ['played', 'ate breakfast', 'watched TV'],
                correct: 1,
                type: 'choice'
            }
        ]
    },

    {
        id: 'story5',
        title: 'The Red Ball',
        level: 'easy',
        targetWords: ['ball', 'red', 'blue', 'find', 'look'],
        sentences: [
            { text: 'Emma had a red ball.', image: 'red-ball' },
            { text: 'She could not find it.', image: 'girl-looking' },
            { text: 'She looked in her room.', image: 'looking-room' },
            { text: 'She looked in the park.', image: 'looking-park' },
            { text: 'She found it under a blue car!', image: 'ball-under-car' }
        ],
        questions: [
            {
                question: 'What color was Emma\'s ball?',
                options: ['blue', 'red', 'green'],
                correct: 1,
                type: 'choice'
            },
            {
                question: 'What was Emma trying to do?',
                options: ['find her ball', 'eat lunch', 'go to school'],
                correct: 0,
                type: 'choice'
            },
            {
                question: 'Where was the ball?',
                options: ['in her room', 'under a car', 'at school'],
                correct: 1,
                type: 'choice'
            }
        ]
    }
];

// Medium level stories (for future use)
const mediumStories = [
    {
        id: 'story6',
        title: 'The Birthday Party',
        level: 'medium',
        targetWords: ['birthday', 'party', 'friends', 'cake', 'happy', 'fun'],
        sentences: [
            { text: 'Today was Emma\'s birthday.', image: 'birthday-girl' },
            { text: 'She invited all her friends to a party.', image: 'invitation' },
            { text: 'They played many fun games.', image: 'party-games' },
            { text: 'Mom made a big chocolate cake.', image: 'birthday-cake' },
            { text: 'Emma blew out the candles and made a wish.', image: 'blowing-candles' },
            { text: 'Everyone sang happy birthday.', image: 'singing' },
            { text: 'It was the best day ever!', image: 'happy-celebration' }
        ],
        questions: [
            {
                question: 'Whose birthday was it?',
                options: ['Mom\'s', 'Emma\'s', 'her friend\'s'],
                correct: 1,
                type: 'choice'
            },
            {
                question: 'What kind of cake did Mom make?',
                options: ['vanilla', 'strawberry', 'chocolate'],
                correct: 2,
                type: 'choice'
            },
            {
                question: 'What did Emma do with the candles?',
                options: ['counted them', 'blew them out', 'ate them'],
                correct: 1,
                type: 'choice'
            }
        ]
    }
];

// Get story by ID
function getStoryById(id) {
    return storiesData.find(s => s.id === id) || mediumStories.find(s => s.id === id);
}

// Get stories by level
function getStoriesByLevel(level) {
    if (level === 'easy') {
        return storiesData;
    } else if (level === 'medium') {
        return mediumStories;
    }
    return storiesData;
}

// Get random story
function getRandomStory(level = 'easy') {
    const stories = getStoriesByLevel(level);
    return stories[Math.floor(Math.random() * stories.length)];
}
