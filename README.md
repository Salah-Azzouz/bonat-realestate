# Property Management System
This project is a Property Management System built for Bonat using the combination of NestJS and TypeORM to power the backend.

## Features
This project is structured into several modules to encapsulate the business logic and maintain a speration of concerns, in order to make the maintaince of the project easy for developers

### Property Module
- Create property with units
- Retireve a property using id
- Retrieve many properties with untis
- Retrieve many properties without units
- Update a specific property by id
- Delete a specific property by id
- Reset all properties

### Unit Module
- Retrieve all units
- Retrieve many units by criterias
    - type
    - Min Number Of Rooms
    - Max Number Of Rooms
    - Min Price Per Square Meter
    - Max Price Per Square Meter
- Retrieve a unit by id
- Update a unit by id
- Remove a unit by id
- Check if a unit has active leases
- Add many units to a specific property

### Tenant Module
- Create a Tenant
- Retrieve all tenants
- Retrieve tenants with their leases
- Retrieve tenants leases with specif status
- Retrieve one tenant by id
- Update one tenant by id
- Remove one tenant by id
- Reset all tenants
- Check for the unicity of the tenant phone number

### Lease Module (Assumed from context)
- Lease a unit
- Terminate lease for a specific unit
- Check if a unit is available in a specific period
- Retrieve all leases
- Retrieve leases for a specific tenant
- Retrieve leases for a specif tenant with specific status
- Retrieve leases realated to a unit
- Retrieve leases with tenant and unit
- Retrieve leases with specific status
- Remove a lease
- Retrieve a lease by id
- Retrieve update a lease by id
- Update automaticly the status of expired leases using a cron job

## Project Architecture
 This Property Management System is built using NestJS and follows a modular architecture. 
 You can find below is an overview of the project's structure and architecture:

### High-Level Structure
- **Modules**: The project is divided into several modules.
Modules like Property, Unit, Tenant, and Lease encapsulate all the related functionalities.
- **Services**: Each module contains services that hold the business logic. Services interact with the database and perform operations related to their respective modules.
- **Controllers**: Controllers handle incoming requests and delegate actions to services. They are the entry point for data interactions and user commands.
- **Entities**: Entities represent database models and are used by TypeORM for database interactions.

### Code Organization
- The codebase is organized into directories corresponding to each module.
- Within each module, code is further organized into controllers, services,DTO and tests.
- Shared logic, like common decorators, enumrations, exception filters, pipes and types are placed in the `common` directory.
- Configurations are placed into the `config` folder. The folder contains the configuration for the app, postgres and swagger.
- All Entities are placed into a folder named `schema` that contains the lease, property, tenant and unit entities.

### Database Interaction
- The application uses TypeORM for database interactions, providing a clear mapping between objects in the app and database.
- Database relations are carefully managed to reflect real-world relationships.

### Error Handling
- The application implements robust error handling to manage and respond to exceptions in an abstract and global way to avoid rapping the code with duplicated try and catch blocs.
- Custom decorators, transformers and filters are used to handle validation and runtime errors, ensuring consistent error responses accros all the endpoints.

### Scalability and Maintenance
- The modular approach makes the application scalable and easy to maintain. 

## API Documentation 
### Swagger UI
The project is equipped with Swagger UI, which provides a visual representation of all the available RESTful endpoints along with the required DTOs. 
You can access the Swagger UI documentation at: `http://localhost:3000/doc`
### PDF Documentation
Additionally, for offline reference, we have included a detailed PDF document that outlines all the API endpoints along with their required DTOs. 
This document can be found in the `extra` folder at the root of the project. 
It serves as a handy guide for understanding the API structure and capabilities without the need to run the project.


## Project setup 
I invite you to follow these steps to setup the project on a local enviorment.

1. Clone the repository:
```bash
git clone https://github.com/Salah-Azzouz/bonat-realestate.git
cd bonat-realestate
```

2. Install packages:
For this you can use NPM or Yarn as a package manager
```bash
yarn install
```

3. Setup your docker Postgres container
```bash
yarn docker:build
```
then start your container
```bash
yarn docker:up
```

4. Run the application:
```bash
yarn dev
```


## Running the tests
In order to run the test you can use this command:
```bash
yarn test
```

## API
### API PREFIX
All API routes are prefixed with `/api`. 
### Custom 404 Controller
In our application, we have implemented a custom controller dedicated to handling 404 (Not Found) errors.
