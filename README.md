KLCC
====

A simple application which retreives tweests from tweeter based on a specific query, stores them in an SQL database and an Elasticsearch database, and allows searching the content of the tweets in a simple web page.

## Prerequisites

- node
- elasticsearch

## Configuration

- Elasticsearch configuration: `config/elasticsearch.json`
- SQL database configuration: `config/config.json`
- Twitter keys & server configuration: `.env` (see `.env.example`)

## Usage
`npm start`
