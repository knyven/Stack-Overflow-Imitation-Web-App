// Setup database with initial test data.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Your existing Mongoose models
const User = require('./models/users');
const Tag = require('./models/tags');
const Question = require('./models/questions');
const Answer = require('./models/answers');
const Comment = require('./models/comments');

mongoose.connect('mongodb://127.0.0.1:27017/fake_so');

// Predefined data
const predefinedUsers = [

  {
    username: 'UserOne',
    email: 'userone@example.com',
    password: 'password1',
    reputation: 50
  },
  {
    username: 'UserTwo',
    email: 'usertwo@example.com',
    password: 'password2',
    reputation: 60
  },
  {
    username: 'UserThree',
    email: 'userthree@example.com',
    password: 'password3',
    reputation: 70
  },

];


const predefinedTags = [
  { name: 'javascript' },
  { name: 'python' },
  { name: 'java' },
  { name: 'csharp' },
  { name: 'reactjs' },
  { name: 'angular' },
  { name: 'nodejs' },
  { name: 'html' },
  { name: 'css' },
  { name: 'webdev' },
  
];

const predefinedQuestions = [
  { title: 'How to use JavaScript?', text: 'I am new to JavaScript. Can someone help?', author_email: 'author1@example.com' },
  { title: 'Python vs Java: Which is better?', text: 'I am confused between Python and Java for my new project. Any suggestions?', author_email: 'author2@example.com' },
  { title: 'Best practices in C# programming', text: 'What are some of the best practices in C# programming?', author_email: 'author3@example.com' },
  { title: 'ReactJS State Management', text: 'How do you effectively manage state in a large ReactJS application?', author_email: 'author4@example.com' },
  { title: 'Angular Performance Tips', text: 'Looking for ways to improve the performance of my Angular app.', author_email: 'author5@example.com' },
  { title: 'Getting Started with Node.js', text: 'What are the first steps for a beginner in Node.js?', author_email: 'author6@example.com' },
  { title: 'CSS Grid vs Flexbox', text: 'When should I use CSS Grid and when should I use Flexbox?', author_email: 'author7@example.com' },
  { title: 'Effective use of Hooks in React', text: 'How can I make effective use of hooks in React applications?', author_email: 'author8@example.com' },
  { title: 'Database Optimization Strategies', text: 'What are some effective strategies for optimizing database performance?', author_email: 'author9@example.com' },
  { title: 'Microservices Architecture Best Practices', text: 'What are the best practices for designing a microservices architecture?', author_email: 'author10@example.com' },
  { title: 'Understanding Async Programming in JavaScript', text: 'Can someone explain how async programming works in JavaScript?', author_email: 'author11@example.com' },
  { title: 'Building Responsive UIs', text: 'What are the key considerations for building responsive user interfaces?', author_email: 'author12@example.com' },
  { title: 'Securing Web Applications', text: 'What are the essential steps to secure a web application?', author_email: 'author13@example.com' },
  { title: 'Introduction to Machine Learning', text: 'How should one start learning about machine learning?', author_email: 'author14@example.com' },
  { title: 'Cloud Computing Basics', text: 'What are the basics everyone should know about cloud computing?', author_email: 'author15@example.com' },
];


const predefinedAnswers = [
  { text: 'You can start by learning the basics of JavaScript. There are many online resources available.' },
  { text: 'Python is great for beginners and has a strong community, while Java is widely used in enterprise environments.' },
  { text: 'Make sure to follow SOLID principles in C# for better maintainability of your code.' },
  { text: 'For large applications, consider using Redux or Context API for state management in ReactJS.' },
  { text: 'Optimize your Angular app by lazy loading modules and using change detection strategies effectively.' },
  { text: 'Node.js is excellent for building scalable network applications. Begin with the official documentation.' },
  { text: 'CSS Grid is for layout structure, Flexbox is for alignment. Use Grid for major layout and Flexbox for components.' },
  { text: 'Hooks in React simplify state management and side effects in functional components.' },
  { text: 'Indexing, query optimization, and proper schema design are key for database performance.' },
  { text: 'Ensure isolation, define clear API contracts, and consider a gateway for managing microservices.' },
  { text: 'Async programming in JavaScript is handled through Promises and async/await syntax.' },
  { text: 'For responsive UIs, focus on flexible layouts, responsive images, and understanding CSS media queries.' },
  { text: 'Always validate user input, use HTTPS, and keep your software updated to secure your web applications.' },
  { text: 'Start with basic statistics and algorithms, and then explore libraries like TensorFlow or PyTorch.' },
  { text: 'Understand the core services of cloud providers, like compute, storage, and networking.' },
];



async function createUsers() {
  const users = [];
  for (const userData of predefinedUsers) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    users.push(new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      reputation: userData.reputation, 

      dateCreated: new Date(), 
    }));
  }
  return User.insertMany(users);
}

async function createTags() {
  const tags = predefinedTags.map(tagData => new Tag(tagData));
  return Tag.insertMany(tags);
}

async function createQuestions(users, tags) {
  const questions = predefinedQuestions.map((q, index) => {
    // Calculate start and end indices for slicing tags array
    const start = index % tags.length;
    const numTags = 1 + (index % 3); 
    const end = (start + numTags) % tags.length;

    // Get tags in a round-robin fashion
    let questionTags;
    if (start < end) {
      questionTags = tags.slice(start, end);
    } else {
      // If end index is less than start index, it means we've reached the end of the tags array and need to loop back to the start
      questionTags = [...tags.slice(start), ...tags.slice(0, end)];
    }

    return new Question({
      title: q.title,
      text: q.text,
      tags: questionTags.map(tag => tag._id),
      asked_by: users[index % users.length]._id, 
      author_email: q.author_email,
      views: 10,
      score: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  return Question.insertMany(questions);
}

async function createAnswers(users, questions) {
  const answers = [];
  for (let i = 0; i < predefinedAnswers.length; i++) {
    const a = predefinedAnswers[i];
    const question = questions[i % questions.length];

    const answer = new Answer({
      text: a.text,
      ans_by: users[i % users.length]._id, 
      question: question._id,
      score: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    answers.push(answer);

    // Associate the answer with the question
    question.answers.push(answer._id);

    // Accept the first answer for each question
    if (i % users.length === 0) {
      question.accepted_answer = answer._id;
    }

    // Save the question
    await question.save();
  }

  return Answer.insertMany(answers);
}

async function createComments(users, questions, answers) {
  const comments = [];

  // Add multiple comments to each question
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    for (let j = 0; j < 10; j++) {  
      const comment = new Comment({
        text: `This is comment ${j + 1} on a question.`,
        commented_by: users[(i + j) % users.length]._id, // Round-robin selection of user
        parent: {
          id: question._id,
          type: 'Question'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      comments.push(comment);
      question.comments.push(comment._id); 
    }
    await question.save(); 
  }

  // Add multiple comments to each answer
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    for (let j = 0; j < 3; j++) {  
      const comment = new Comment({
        text: `This is comment ${j + 1} on an answer.`,
        commented_by: users[(i + j) % users.length]._id, // Round-robin selection of user
        parent: {
          id: answer._id,
          type: 'Answer'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      comments.push(comment);
      answer.comments.push(comment._id); 
    }
    await answer.save(); 
  }

  return Comment.insertMany(comments);
}


async function main() {
  try {
    await mongoose.connection.dropDatabase();

    const users = await createUsers();
    const tags = await createTags();
    const questions = await createQuestions(users, tags);
    const answers = await createAnswers(users, questions);
    await createComments(users, questions, answers);

    console.log('Database populated with predefined data!');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

main();
