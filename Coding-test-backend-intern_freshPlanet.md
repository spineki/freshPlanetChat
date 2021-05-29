# Test

This coding test consists of two parts, designed to evaluate your skills.  
The first part will test your coding architecture, logic and API design.  
The second part will test your ideas on improving existing APIs.

## Part 1

We want to develop a small chat app, with GraphQL, apollo-server-express, Node.js, written in TypeScript:
We assume here that the user/client is already authenticated and has an ID (no need to have a signup/login API).

### Specs

A user can see the list of forums he has joined.  
A user can create a new forum (and join it automatically)  
A user can see the list of available forum and can join any  
He can also join a forum if he knows the forum id

Once inside a forum, he can:

- see the list of previous messages, ordered by most recent. To be displayed in our client, a message should at least have a text, a sending time and name/picture of the sender
- see the name and picture of the members of the forum
- post a message in the forum

### Delivery

Create a Node.js backend fulfilling the specs above.  
You don't need to have a database to store the forums, users and messages, you can use the server memory instead.  
The server should also have some fixtures (in a separate file, like `fixtures.json`), with pre-populated forums, messages and users that are loaded onto the server memory when the server starts.

The code should be placed in a GitHub project and the repository link sent back to us.  
Create also a README.md containing the whole GraphQL schema (including all created Types, Queries and Mutations)

## Part 2

For this part, the goal is to extend the GraphQL schema of Part 1 (without actually implementing the resolvers/logic)

### Specs

The app now has a notion of public and private forums.  
When a user creates a forum, he can mark it as private. He will automatically be the admin of this forum.  
When a forum is private, no-one can see it in the list of available forums.  
A user can ask to join a private forum only if he knows the forum ID.  
When an ask request is sent, the admin of this forum can accept or refuse the request.  
If the request is accepted, the user automatically joins the forum.  
If the request is refused, the user is not notified.

### Delivery

Create a file CHANGES.md containing the new GraphQL schema (including all created Types, Queries and Mutations).  
This file should be checked in the Github repository created in Part 1

## Notes

You do not need to create a frontend/client for this. As long as GraphiQL is available, queries/mutations will be tested through it.  
If you use other libraries besides graphql, apollo, node, typescript and any linter, please update the README.md to explain why.

# Good luck!

You have around two weeks to finish it.  
If you have any questions, things are unclear, feel free to email me at crenn@freshplanet.com
