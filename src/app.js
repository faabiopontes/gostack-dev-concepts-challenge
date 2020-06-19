const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  response.json(repositories);
});

app.post('/repositories', (request, response) => {
  // Request Body
  const { title, url, techs } = request.body;
  const id = uuid();
  const likes = 0;

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories.push(repository);
  response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id,
  );
  let repository = repositories[repositoryIndex];

  if (!repository) response.status(400).json({ error: 'Repository not found' });

  if (title) repository.title = title;

  if (url) repository.url = url;

  if (techs) repository.techs = techs;

  repositories[repositoryIndex] = repository;

  response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id,
  );

  if (repositoryIndex === -1)
    response.status(400).json({ error: 'Repository not found' });

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id,
  );

  if (repositoryIndex === -1)
    response.status(400).json({ error: 'Repository not found' });

  const likes = ++repositories[repositoryIndex].likes;
  response.json({ likes });
});

module.exports = app;
