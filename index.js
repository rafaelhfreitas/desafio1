const express = require("express");

const server = express();

server.use(express.json());

let numberOfRequets = 0;
const projects = [
  { id: "1", Title: "Bootcamp", Tasks: [] },
  { id: "2", Title: "Django", Tasks: [] },
  { id: "3", Title: "NodeJs", Tasks: [] }
];

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.findIndex(p => String(p.id) === id);
  console.log(`project: ${project}`);
  console.log(`id: ${req.params.id} `);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function logRequests(req, res, next) {
  console.time("Request");
  numberOfRequets++;
  console.log(`Número de requisições: ${numberOfRequets};`);
  return next();
  console.timeEnd("Request");
}

server.use(logRequests);

/**
 * Projects
 */
server.get("/projects", (req, res) => {
  for (var i = 0; i < projects.length; i++)
    console.log(i + ". " + projects[i].id);

  return res.json(projects);
});

server.get("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  return res.json(projects[id]);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Tasks
 */
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
