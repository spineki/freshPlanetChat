### Specs

[x] A user can see the list of forums he has joined.  
[x] A user can create a new forum (and join it automatically)
[x] A user can see the list of available forum
[x] and can join any
[x] He can also join a forum if he knows the forum id

Once inside a forum, he can:

[x] see the list of previous messages, ordered by most recent. To be displayed in our client, a message should at least have a text, a sending time and name/picture of the sender
[x] see the name and picture of the members of the forum
[x] post a message in the forum

### Specs

The app now has a notion of public and private forums.  
When a user creates a forum, he can mark it as private. He will automatically be the admin of this forum.  
When a forum is private, no-one can see it in the list of available forums.  
A user can ask to join a private forum only if he knows the forum ID.
When an ask request is sent, the admin of this forum can accept or refuse the request.  
If the request is accepted, the user automatically joins the forum.  
If the request is refused, the user is not notified.
