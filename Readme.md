# V1

## Assumptions and choices:

- The term "forums" will be used instead of "fora" because it better matches the list naming convention (add an "s" at the end)
- Two forums cannot have the same name. This allows forum creation to use names to verify if the forum already exists.
- Siince a database wasn't required, I directly load a `.json` file in the server memory. Data is modified directly by mutation resolver. The code is thus longer that it would have been with database queries. For example, I have to generate a new ID by hand when a forum is added to the "database".

## Tests:

I added several tests in the test folder. They ensure every point of the specs is fullfilled. I'm using jest so you can run `npm t` or `npm run test` to check that everything is working well.
