[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hxTav0v1)
Login with your Northeastern credentials and read the Project Specifications [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EcUflH7GXMBEjXGjx-qRQMkB7cfHNaHk9LYqeHRm7tgrKg?e=oZEef3).

Add design docs in *images/*

## Instructions to setup and run project

Detailed instructions with all relevant commands go here.


TO start running this project npm install must first be ran to ensure all of the node_modules are installed this command must be ran in 
- the client directory
- the server directory 
- and the parent directory
  
  
 Next for middleware authentication to work a folder must be created with the name of: 
-'config' 

You must also create three files in that direcotry 
- deafault.json
- produciton.json
- development.json

Inside each of those files a jwt token must be generated to ensure the token is sent properly: 

{
  "jwtSecret": "mySuperSecretKey"
}


Next we can begin starting the client by navigating to the client dir and running 
-npm run

Next we can begin starting the client by navigating to the server dir and running 
-npm run

Next you must make sure to have the MongoDB running on the specifed port

Now the website can be accesed at localhost:3000 on your local browser.




## Team Member 1 Contribution
Veniamin Home Page, Answer Page and corresponding server side routes and code, middelware authentication on server side



## Team Member 2 Contribution
Vaibhav: User Profile and corresponding server side routes and code
implenetd design pattern on client side 

## Test cases

| Use-case Name   | Test case Name |
|-----------------|----------------|
| Home Page       | Un-registered Home Page tests         
|                 | Registered Home Page tests adding         
                  | Registered Home page tests voting
| Answer Page     | un-registered Answer Page tests
|                 | Registered Answer Page test adding
|                 | Registred Anser page test voting 
| Login           | Create Account/ Login/ Logout          
|                 | Test-2         
| Search          | search 
|  tag            | tags 
|  User Profile   | User Profile Design Tests
|                 | User Profile input test
|                 | User Profile delete test
|                 | User Profile update test


## Design Patterns Used

- Design Pattern Name: Factory pattern used 

- Problem Solved:

- Location in code where pattern is used: