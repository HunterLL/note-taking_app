# App website:  
https://note-taking-app-theta-gules.vercel.app/

# Overview:  
This app empowers users to create, edit, and delete notes seamlessly. Leveraging the YouTube external API within the note detail page, users can spark inspiration by entering keywords into the search bar and seamlessly integrate this inspiration into their notes. Moreover, users have the ability to share their notes with others by configuring them as public. These public notes are prominently displayed on the home page, fostering a sense of community engagement.

## Main Pages:  
- Home page  
- Notes  
- Note detail Page  
- Profile  
- Auth Debugger Page  

## Other Pages:  
- Login(By clicking the login button on Home page, it will show up.)
- Not found page (normally it can't be seen.)
- Verify user page

## Home Page:  
When user clicks the website link, it will direct user to the home page.
On the home page, anonymous user can see a "create your own note" part but when the user
wants to add the note, the website will ask user to log in. After a user log in, the user can see a message above the "create your own note" part, which tells the user how many notes they created. By adding a new note, the number will change dynamically.
The second part of the home page is "latest public notes". This part shows all the notes set by the user as public. Adding a note makes a note private by default.
The last part of the first page is "quote of the day". This part utilizes an external quote api to display a quote.  

## Notes Page:  
Here exit all the notes of a user. Anonymous user can click the Notes link, but only can see "No Notes" on the page. On this page, if a note has a lock sign on its top right corner, this note is private. In each note, there is a "View Details" button. By clicking it, all the content of the note will show up in a new page. Each note page has a unique url.

## Note Detail Page:  
All the details of a note can be seen here. Button "delete" can delete this note. Button "edit" can let user modify title, content, privacy level. If set public, it will appear on the "Home" page. Below the note detail area, there is a Youtube API part "Get Inspiration from YouTube", By typing keyword in the search bar and click search, the top three videos will appear on the page, helping users get inspiration and add them in the note when they edit.

## Profile Page:  
On this page, user can modify bio, first name, last name, birthday info by clicking edit button.

## Auth Debugger:  
On this page, user can see access token and auth0 user info.

## External API:  
- Youtube search API(location: Note details Page)  
- Quote API: quotable(location: Home Page)

## Responsive design: applied through css:  
Nav bar, notes, and button position of login and singup are
the most noticeable places of the implementation of respoisve design.

## Database requirements:  
Three databases user, profile, note including enum PrivacyLevel

## Reference:  
- https://github.com/lukePeavey/quotable  
- https://developers.google.com/youtube/v3/docs/search  
- https://www.w3schools.com/howto/howto_css_notes.asp  

