# Polling system API

This is a backend api for creating questions and adding options to a specific question. Options can be voted. Questions, options can 
deleted only if it don't have any votes or zero votes if the votes 1 or more than one it cannot be deleted. the question can be deleted only if
any of it's options has any votes, if any option has votes to a question the question cannot be deleted.

## Polling system API Features

- Create questions
- Add options to question
- Delete a question
- Delete an option
- Add vote to an option
- View a question with all of its options
- View all questions with all of its options

## Installation Guide

- Clone this repository.
- Run npm install to install all the dependencies.
- Create an .env file in your project root folder and add your variables.

## Setup

- Run `npm install` to install required dependencies
- Run npm start to start the application.
- Connect to the API using Postman on port 8000.

- PORT = [Your Port]
- DB = [Your MongoDB Ur]

## API Endpoints

| HTTP Verbs | Endpoints                            | Action                                |
| ---------- | ------------------------------------ | ------------------------------------- |
| POST       | /api/v1/questions/create             | To create a question                  |
| POST       | /api/v1/questions/:id/options/create | To add options to a specific question |
| DELETE     | /api/v1/questions/:id/delete         | To delete a question                  |
| DELETE     | /api/v1/options/:id/delete           | To delete an option                   |
| PATCH      | /api/v1/options/:id/add_vote         | To increase the count of votes        |
| GET        | /api/v1/questions/:id                | To view a question and its options    |
| GET        | /api/v1/questions/view               | To view all question and its options  |

## Tech stack

- NodeJS
- ExpressJS
- MongoDB
- Mongoose ODM
- jQuery 
