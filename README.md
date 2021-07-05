# Description
Play Together application to bring together young people who want to do team sports (futsal/volleyball/basketball/minisoccer/soccer) and book a place together.

# Heroku
<https://adonis-vanue-rent.herokuapp.com>

# Definition:
- User table attributes: id, name, password, email, role
Application user data. There are 2 roles: 'user', 'owner'.
user : normal user who can make a booking to one field. Can join/unjoin certain orders.
owner: the owner of the venue who rents out the field (field) for booking.
- Location table attributes: id, name, address, phone
Data for sports facilities. Can be a sports complex that has more than one field and type of sport.
- Field table attributes: id, name, type
Field is part of the Venue. Each field will have a type, namely the type of sports played including: football, minisoccer, futsal, basketball, volleyball
- Booking table attributes: id, user_id, play_date_start, play_date_end, field_id
Reservations are rental schedules or main user schedules in a particular field/place.

# Swagger
<http://localhost:3333/docs>

# Getting started

Install dependencies
```bash
npm install
```

Copy the example env file and make the required configuration changes in the .env file
```bash
cp .env.example .env
```

Generate a new application key
```bash
npx adonis key:generate
```

Run migration
```bash
node ace migration:run
```

Start the local development server
```bash
npm run dev
```

Run tests
```bash
npm test
```

  For more information run
```bash
node ace --help
```

## Environment variables

`.env` - Environment variables can be set in this file

***Note*** : You can quickly set the database information and other variables in this file and have the application fully working.
