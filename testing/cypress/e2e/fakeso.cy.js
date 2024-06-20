// Template test file. Change the file to add more tests.

describe('Create Account/ Login/ Logout ', () => {

    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');

      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });
    it('successfully shows All Questions string', () => {
        cy.visit('http://localhost:3000');
        cy.contains('All Questions');
    });

    it('should create a new account', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Register" button
    cy.get('button').contains('Register').click();

    // Fill out the registration form
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('testpassword');

    // Submit the form
    cy.get('form').submit();



  });

  it('should not allow creating an account with an email or username that already exists', () => {
  // Visit the main page
  cy.visit('http://localhost:3000');

  // Click the "Register" button
  cy.get('button').contains('Register').click();

  // Fill out the registration form with an existing user's details
  cy.get('input[name="username"]').type('UserOne');
  cy.get('input[name="email"]').type('userone@example.com');
  cy.get('input[name="password"]').type('password1');

  // Submit the form
  cy.get('form').submit();

  // Check for an error message indicating the username or email already exists
  cy.get('.error-message').should('contain', 'Registration failed');
});

  it('should log in an existing user', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Login" button
    cy.get('button').contains('Login').click();

    // Fill out the login form
    cy.get('input[type="email"]').type('userone@example.com');
    cy.get('input[type="password"]').type('password1');

    // Submit the form
    cy.get('form').find('button[type="submit"]').click()



    // Check that a welcome message is displayed
    cy.contains('Welcome, UserOne!');
  });

  it('should add test questions and answers after login', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Login" button
    cy.get('button').contains('Login').click();

  // Fill out the login form
    cy.get('input[type="email"]').type('userone@example.com');
    cy.get('input[type="password"]').type('password1');

    // Submit the form
    cy.get('form').submit();

    // Check that a welcome message is displayed
    cy.contains('Welcome, UserOne!');

    // Add 10 questions and answers
    for (let i = 1; i <= 5; i++) {
        // Add a question
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type(`Test Question ${i}`);
        cy.get('#formTextInput').type(`Test Question ${i} Text`);
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();

        // Add an answer to the question
        cy.contains(`Test Question ${i}`).click();
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type(`Answer Question ${i}`);
        cy.contains('Post Answer').click();

        // Go back to the main page to add the next question
        cy.visit('http://localhost:3000');
    }
});




  it('should display a menu with options to view all questions, view all tags, and a search box', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Questions').should('exist');
    cy.get('button').contains('Tags').should('exist');
    cy.contains('All Questions').should('exist');
    cy.get('.search-bar').should('exist');
  });



  it('should display next and prev buttons', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Next').should('exist');
    cy.get('button').contains('Prev').should('exist');
  });

  it('should navigate to next 5 questions when next button is clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Next').click();
    // Add assertions to check that the next 5 questions are displayed
  });

  it('should navigate to previous 5 questions when prev button is clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Next').click();
    cy.get('button').contains('Prev').click();
    // Add assertions to check that the previous 5 questions are displayed
  });

  it('should disable prev button when first 5 questions are displayed', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Prev').should('be.disabled');
  });


   it('displays the question list header correctly', () => {
    cy.visit('http://localhost:3000');
    cy.get('.question-list-header').should('exist');
 
  });

  it('shows the correct number of questions and sorting options', () => {
    cy.visit('http://localhost:3000');

    cy.get('.question-list-subheader').should('exist');
    cy.get('button').contains('Newest').should('exist');
    cy.get('button').contains('Active').should('exist');
    cy.get('button').contains('Unanswered').should('exist');
  });

  it('displays each question with details', () => {
    cy.visit('http://localhost:3000');

    cy.get('.question').each(($question) => {
      cy.wrap($question).find('.question-stats').should('exist');
      cy.wrap($question).find('.question-title').should('exist');
      cy.wrap($question).find('.question-post-details').should('exist');
      cy.wrap($question).find('.question-tags').should('exist');
    });
  });


  // check logout at the end:   
  it('should log out an existing user', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Login" button
    cy.get('button').contains('Login').click();

  // Fill out the login form
    cy.get('input[type="email"]').type('userone@example.com');
    cy.get('input[type="password"]').type('password1');

    // Submit the form
    cy.get('form').submit();

    // Check that a welcome message is displayed
    cy.contains('Welcome, UserOne!');

    // Click the "Logout" button
    cy.get('button').contains('Logout').click();



    // Check that the "Logout" button is no longer present
    cy.get('button').contains('Logout').should('not.exist');

    // Check that the "Login" button is present
    cy.get('button').contains('Login').should('exist');

  });


});  


  describe('Un-registered Home Page tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');

      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });

    it('navigates between pages correctly', () => {
      cy.visit('http://localhost:3000');
      cy.get('.pagination-controls').should('exist');
      cy.get('button').contains('Previous').should('exist');
      cy.get('button').contains('Next').should('exist');
    });

    it('should display only 5 questions at a time', () => {
      cy.visit('http://localhost:3000');
      cy.get('.question-list .question').should('have.length', 5);
    });

    it('should find the text: Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.contains('Cloud Computing Basics');
});

it('should find the title of question Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.get('h3.postTitle').contains('Cloud Computing Basics');
});

it('should find the body text of question Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.get('h4.postBody').contains('What are the basics everyone should know about cloud computing?');
});

it('should find the user who asked the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-post-details.lastActivity span').contains('UserThree asked');
});

it('should find the tags of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-tags .tag').contains('javascript');
  cy.get('.question-tags .tag').contains('python');
});

it('should find the score of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-score').contains('Score: 5');
});



  });


    describe('Registered Home Page tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');

        
        cy.visit('http://localhost:3000');


        // Click the "Login" button
        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');

        cy.get('button[type="submit"]').contains('Login').click();

      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });

 it('navigates between pages correctly', () => {
      cy.visit('http://localhost:3000');
      cy.get('.pagination-controls').should('exist');
      cy.get('button').contains('Previous').should('exist');
      cy.get('button').contains('Next').should('exist');
    });

    it('should display only 5 questions at a time', () => {
      cy.visit('http://localhost:3000');
      cy.get('.question-list .question').should('have.length', 5);
    });

    it('should find the text: Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.contains('Cloud Computing Basics');
});

it('should find the title of question Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.get('h3.postTitle').contains('Cloud Computing Basics');
});

it('should find the body text of question Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.get('h4.postBody').contains('What are the basics everyone should know about cloud computing?');
});

it('should find the user who asked the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-post-details.lastActivity span').contains('UserThree asked');
});

it('should find the tags of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-tags .tag').contains('javascript');
  cy.get('.question-tags .tag').contains('python');
});

it('should find the score of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-score').contains('Score: 5');
});


it('should find the Ask a Question button', () => {
  cy.visit('http://localhost:3000');
  cy.get('button.ask-new-question').should('exist');
});

it('should find the welcome message and reputation', () => {
  cy.visit('http://localhost:3000');
  cy.get('span').contains('Welcome, UserOne! (Reputation: 50)');
});

it('should find the Profile button', () => {
  cy.visit('http://localhost:3000');
  cy.get('button').contains('Profile').should('exist');
});




});


    describe('Search', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');

      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });


      
  it('should find the question "CSS Grid vs Flexbox"', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('CSS grid{enter}');
    cy.get('h3.postTitle').contains('CSS Grid vs Flexbox');
  });

  it('should find the question "Effective use of Hooks in React & Database Optimization Strategies"', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('effective{enter}');
    cy.get('h3.postTitle').contains('Effective use of Hooks in React');
    cy.get('h3.postTitle').contains('Database Optimization Strategies');

  });

  it('should find the question "Understanding Async Programming in JavaScript"', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('Understanding{enter}');
    cy.get('h3.postTitle').contains('Understanding Async Programming in JavaScript');
  });


    it('should find the question "Angular Performance Tips" when searching for [reactjs]', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('[reactjs]{enter}');
    cy.get('h3.postTitle').contains('Angular Performance Tips');
  });

  it('should find the question "Securing Web Applications" when searching for [java]', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('[java]{enter}');
    cy.get('h3.postTitle').contains('Securing Web Applications');
  });

  it('should find the question "Cloud Computing Basics" when searching for [nodejs]', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('[nodejs]{enter}');
    cy.get('h3.postTitle').contains('Cloud Computing Basics');
  });


});



describe('tags', () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec('node ../server/init.js');

    cy.visit('http://localhost:3000');
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec('node  ../server/destroy.js');
  });

it('should navigate to the tags page and find 10 tags', () => {
  cy.get('button').contains('Tags').click();
  cy.get('h2').contains('10 Tags'); 
});

  it('should display 10 tags', () => {
    cy.get('button').contains('Tags').click();
    cy.get('h2').contains('10 Tags');
  });

  const tags = [
    { name: 'javascript', count: 3 },
    { name: 'python', count: 3 },
    { name: 'csharp', count: 4 },
  ];

  tags.forEach((tag) => {
    it(`should display correct question count for ${tag.name}`, () => {
      cy.get('button').contains('Tags').click();
      cy.get('.tagNode').contains(tag.name).click();
      cy.get('span').contains(`${tag.count} questions`);
    });
  });
});



describe('un-registered Answer Page tests', () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec('node ../server/init.js');

    cy.visit('http://localhost:3000');

    
    cy.get('h3.postTitle').contains('Understanding Async Programming in JavaScript').click();
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec('node  ../server/destroy.js');
  });

  it('should find the pagination buttons for comments', () => {
    cy.get('button').contains('Previous').should('exist');
    cy.get('button').contains('Next').should('exist');
  });

  it('should find the answer pagination controls', () => {
    cy.get('.pagination-controls').should('exist');
    cy.get('.pagination-controls button').contains('Previous');
    cy.get('.pagination-controls button').contains('Next');
  });

  it('should find the views count', () => {
    cy.get('span').contains('11 views').should('exist');
  });

  it('should find the question body', () => {
    cy.get('p').contains('Can someone explain how async programming works in JavaScript?').should('exist');
  });

  it('should find the answer text', () => {
  cy.get('p.answerText').should('exist');
  });
  
  it('should find the user who asked the question', () => {
  cy.get('small').contains('UserTwo asked');
  });

  it('should find the UserThree who commented three times on the question', () => {
  cy.get('small').contains('UserThree commented');
  });



});

      describe('Registered Answer Page tests', () => {
     beforeEach(() => {
    // Seed the database before each test
    cy.exec('node ../server/init.js');
    cy.wait(1000);
    cy.visit('http://localhost:3000');
            cy.visit('http://localhost:3000');


        // Click the "Login" button
        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');

        cy.get('button[type="submit"]').contains('Login').click();

        cy.get('h3.postTitle').contains('Understanding Async Programming in JavaScript').click();
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec('node  ../server/destroy.js');
  });

  it('should find the pagination buttons for comments', () => {
    cy.get('button').contains('Previous').should('exist');
    cy.get('button').contains('Next').should('exist');
  });

  it('should find the answer pagination controls', () => {
    cy.get('.pagination-controls').should('exist');
    cy.get('.pagination-controls button').contains('Previous');
    cy.get('.pagination-controls button').contains('Next');
  });

  it('should find the views count', () => {
    cy.get('span').contains('11 views').should('exist');
  });

  it('should find the question body', () => {
    cy.get('p').contains('Can someone explain how async programming works in JavaScript?').should('exist');
  });

  it('should find the answer text', () => {
  cy.get('p.answerText').should('exist');
  });
  
  it('should find the user who asked the question', () => {
  cy.get('small').contains('UserTwo asked');
  });

  it('should find the UserThree who commented three times on the question', () => {
  cy.get('small').contains('UserThree commented');
  });


});



      describe('Registered Question Page upvote and Downvote', () => {
     beforeEach(() => {
    // Seed the database before each test
    cy.exec('node ../server/init.js');
    cy.wait(1000);
    cy.visit('http://localhost:3000');
            cy.visit('http://localhost:3000');


        // Click the "Login" button
        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');

        cy.get('button[type="submit"]').contains('Login').click();

  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec('node  ../server/destroy.js');
  });

it('should upvote a question and check the updated score', () => {
  // Find the first upvote button within the div and click it
  cy.get('.question-vote-buttons button').contains('Upvote').first().click();

  // Reload the page
  cy.reload();

  // Check the updated score
  cy.get('.question-score').should('contain', 'Score: 6');
});


it('should downvote a question and check the updated score', () => {
  // Find the first downvote button within the div and click it
  cy.get('.question-vote-buttons button').contains('Downvote').first().click();

  // Reload the page
  cy.reload();

  // Check the updated score
  cy.get('.question-score').should('contain', 'Score: 4'); // Adjust the score as per your application's downvote logic
});



});

describe('User Profile Design Tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');



        cy.visit('http://localhost:3000');


        // Click the "Login" button
        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');
        cy.get('form').submit();
        cy.wait(1000)
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec('node  ../server/destroy.js');
    });
    it('should display the Profile button on the homepage when  logged in', () => {

        cy.visit('http://localhost:3000');
        cy.contains('Welcome, UserOne!');
        cy.contains('Profile').should('exist');

    });

    it('should navigate to the user profile page when Profile button is clicked', () => {
        cy.visit('http://localhost:3000');
        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            .click(); // Click the button
        cy.wait(1000);
        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
    });

    it('in user profile should find user name', () => {
        cy.visit('http://localhost:3000');
        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.contains("UserOne").should('exist');
    });
    it('in user profile should find reputation', () => {
        cy.visit('http://localhost:3000');


        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.contains("Reputation").should('exist');
    });

    it('in user profile should find Tag Link', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('button').contains("Tag").should('exist');
    });
    it('in user profile should find Question link', () => {
        cy.visit('http://localhost:3000');
        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').get('button').contains("Questions").should('exist');
    });
    it('in user profile should find Answer Link', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('button').contains("Answers").should('exist');
    });

    it('in user profile click on Question links', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Questions").should('exist').click();
    });
    it('in user profile questions have pagination', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Questions").should('exist').click();
        cy.get('.user-profile').find('button').contains("Next").should('exist').click();
        cy.get('.user-profile').find('button').contains("Prev").should('exist').click();
    });
});


describe('User Profile Input Tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');


        cy.visit('http://localhost:3000');

        cy.get('button').contains('Register').click();

        // Fill out the registration form
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('testuser@example.com');
        cy.get('input[name="password"]').type('testpassword');

        // Submit the form
        cy.get('form').submit();

        cy.wait(1000);

        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');

        // Submit the form
        cy.get('form').find('button[type="submit"]').click()
        cy.wait(100)
        for (let i = 1; i <= 15; i++) {
            // Add a question
            cy.contains('Ask a Question').click();
            cy.get('#formTitleInput').type(`Test Question ${i}`);
            cy.get('#formTextInput').type(`Test Question ${i} Text`);
            cy.get('#formTagInput').type('javascript,python');
            cy.contains('Post Question').click();

            // Add an answer to the question
            cy.contains(`Test Question ${i}`).click();
            cy.contains('Answer Question').click();
            cy.get('#answerTextInput').type(`Answer Question ${i}`);
            cy.contains('Post Answer').click();

            // Go back to the main page to add the next question
            cy.visit('http://localhost:3000');
        }
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec('node  ../server/destroy.js');
    });

    it('in user profile questions check all the questions for user are present or not', () => {
        cy.visit('http://localhost:3000');



        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'// Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');

        cy.get('.user-profile').find('button').contains("Questions").click();

        let count = 0;
        for (let i = 15; i > 0; i--) {
            count++;
            const questionText = `Test Question ${i}`;


            cy.get('.userQuestionList').contains(questionText).should('exist');
            if (count === 5) {
                cy.get('.user-profile').find('button').contains("Next").should('exist').click();
                count = 0;
            }
        }
    });
    it('in user profile questions check all the answers for user are present or not', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
        // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Answers").should('exist').click();
        let count = 0;
        for (let i = 15; i > 0; i--) {
            count++;
            const answerText = `Answer Question ${i}`;
            cy.get('.useAnswerList').contains(answerText).should('exist');
            if (count === 5) {
                cy.get('.user-profile').find('button').contains("Next").should('exist').click();
                count = 0;
            }
        }
    });
    it('in user profile questions check all the answers for user are present or not', () => {
        cy.visit('http://localhost:3000');


        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
           // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Tags").should('exist').click();
        cy.contains("javascript").should('exist');
        cy.contains("python").should('exist');

    });


});


describe('User Profile Delete Tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');


        cy.visit('http://localhost:3000');

        cy.get('button').contains('Register').click();

        // Fill out the registration form
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('testuser@example.com');
        cy.get('input[name="password"]').type('testpassword');

        // Submit the form
        cy.get('form').submit();

        cy.wait(1000);

        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');

        // Submit the form
        cy.get('form').find('button[type="submit"]').click()
        cy.wait(100)
        for (let i = 1; i <= 5; i++) {
            // Add a question
            cy.contains('Ask a Question').click();
            cy.get('#formTitleInput').type(`Test Question ${i}`);
            cy.get('#formTextInput').type(`Test Question ${i} Text`);
            cy.get('#formTagInput').type('javascript,python');
            cy.contains('Post Question').click();

            // Add an answer to the question
            cy.contains(`Test Question ${i}`).click();
            cy.contains('Answer Question').click();
            cy.get('#answerTextInput').type(`Answer Question ${i}`);
            cy.contains('Post Answer').click();

            // Go back to the main page to add the next question
            cy.visit('http://localhost:3000');
        }
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec('node  ../server/destroy.js');
    });
    //testing deleting question and also whether the answer also gets deleted
    it('first delete answer of the question', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Answers").should('exist').click();
        cy.get('.useAnswerList')
            .find('.answerBlock')
            .first() // Select the first answer block
            .within(() => {
                cy.get('button').contains('Delete').click(); // Click the delete button
                // Perform assertions or actions after delete button click if needed
            });

        // Verify the first answer block is removed (if any assertion needed)
        // Example assertion to check that the string "Answer Question 15" does not exist within a set of elements
        cy.get('.useAnswerList').should('not.contain', 'Answer Question 5');



    });
    it('first delete question and see answer will also be deleted for the question', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Questions").should('exist').click();
        const nthQuestionIndex = 2; // Change this index to target the nth question (0-based index)
        cy.get('.question') // Select all question blocks
            .eq(nthQuestionIndex) // Select the nth question
            .within(() => {
                cy.contains('button', 'Delete').click(); // Click the delete button
            });// Click the delete button
                // Perform assertions or actions after delete button click if needed

        cy.get('.userQuestionList').should('not.contain','Test Question 3');
        // Verify the first answer block is removed (if any assertion needed)
        // Example assertion to check that the string "Answer Question 15" does not exist within a set of elements
        cy.get('.user-profile').find('button').contains("Answers").should('exist').click();
        cy.get('.useAnswerList').should('not.contain', 'Answer Question 3');



    });
    it('Delete Tag', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Tags").should('exist').click();

        const tagNameToDelete = 'javascript';


        cy.contains('.tags-grid .tagNode h2', tagNameToDelete)
            .parent('.tagNode')
            .within(() => {
                cy.contains('button', 'Delete').click();
            });
        cy.get('.main-content').should('not.contain', 'javascript');

    });
});

//update operations
describe('User Profile Update Tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');


        cy.visit('http://localhost:3000');

        cy.get('button').contains('Register').click();

        // Fill out the registration form
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('testuser@example.com');
        cy.get('input[name="password"]').type('testpassword');

        // Submit the form
        cy.get('form').submit();

        cy.wait(1000);

        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');

        // Submit the form
        cy.get('form').find('button[type="submit"]').click()
        cy.wait(100)
        for (let i = 1; i <= 5; i++) {
            // Add a question
            cy.contains('Ask a Question').click();
            cy.get('#formTitleInput').type(`Test Question ${i}`);
            cy.get('#formTextInput').type(`Test Question ${i} Text`);
            cy.get('#formTagInput').type('javascript,python');
            cy.contains('Post Question').click();

            // Add an answer to the question
            cy.contains(`Test Question ${i}`).click();
            cy.contains('Answer Question').click();
            cy.get('#answerTextInput').type(`Answer Question ${i}`);
            cy.contains('Post Answer').click();

            // Go back to the main page to add the next question
            cy.visit('http://localhost:3000');
        }
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec('node  ../server/destroy.js');
    });
    //testing deleting question and also whether the answer also gets deleted
    it('first Update answer of the question', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Answers").should('exist').click();
        cy.get('.useAnswerList')
            .find('.answerBlock')
            .first() // Select the first answer block
            .within(() => {
                cy.get('button').contains('Update').click(); // Click the delete button
                // Perform assertions or actions after delete button click if needed
            });
        const textToSet = 'Updated Answer'; // Specify the text you want to set in the input

        // Set text in the answer input field
        cy.get('#answerTextInput') // Select the input field by its ID
            .type(textToSet) // Type the specified text

        // Click the submit button
        cy.get('form').submit();

        cy.get('.useAnswerList').should('contain', 'Updated Answer');


    });
    it('first Update question text and see on home page', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Questions").should('exist').click();
        const nthQuestionIndex = 2; // Change this index to target the nth question (0-based index)
        cy.get('.question') // Select all question blocks
            .eq(nthQuestionIndex) // Select the nth question
            .within(() => {
                cy.contains('button', 'Update').click(); // Click the delete button
            });// Click the delete button
        const newText = 'I changed'; // Specify the new text
        cy.get('form').should('be.visible');

        cy.get('textarea').clear();

        // Enter the new text in the textarea
        cy.get('textarea').type(newText);

        // Click the submit button to update the question text
        cy.get('button[type="submit"]').click();
        cy.get('#sideBarNav').find('button').contains("Questions").should('exist').click();
        cy.contains("I changed");



    });
    it('Update Tag', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Tags").should('exist').click();

        const tagNameToDelete = 'python';


        cy.contains('.tags-grid .tagNode h2', tagNameToDelete)
            .parent('.tagNode')
            .within(() => {
                cy.contains('button', 'Update').click();
            });

        const updatedTagName = 'Node.js'; // Specify the updated tag name
        cy.get('.modal').should('be.visible');

        cy.get('.modal input[type="text"]').should('have.value', 'python'); // Ensure initially it's empty
        // Enter the updated tag name in the input field
        cy.get('.modal input[type="text"]').type(updatedTagName);
        cy.get('.modal button').contains('Update').click();
        cy.get('.user-profile').find('button').contains("Tags").should('exist').click();

        cy.get('.main-content').should('contain', 'Node.js');
    });
});









