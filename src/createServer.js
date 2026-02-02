/* eslint-disable no-console */
'use strict';

const express = require('express');
const cors = require('cors');

function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  let users = [];

  let expenses = [];

  let usersNumber = 1;
  let expenseNumber = 1;

  app.get('/users', (req, res) => {
    res.status(200).send(users);
  });

  app.post('/users', (req, res) => {
    const { name, id } = req.body;

    if (id) {
      res.status(400).send('Bad request');

      return;
    }

    if (typeof name !== 'string') {
      res.status(400).send('Bad request');

      return;
    }

    const user = {
      name: name,
      id: usersNumber,
    };

    usersNumber++;

    users.push(user);
    res.status(201).send(user);
  });

  app.get('/users/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).send('Bad request');

      return;
    }

    const user = users.find((u) => u.id === +id);

    if (!user) {
      res.status(404).send('Not found');

      return;
    }

    res.status(200).send(user);
  });

  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((u) => u.id === +id);

    if (!user) {
      res.status(404).send('Not found');

      return;
    }

    users = users.filter((u) => u.id !== +id);
    res.sendStatus(204);
  });

  app.patch('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (typeof name !== 'string') {
      res.status(400).send('Bad request');

      return;
    }

    const user = users.find((u) => u.id === +id);

    if (!user) {
      res.status(404).send('Not found');

      return;
    }

    user.name = name;

    res.status(200).send(user);
  });

  app.get('/expenses', (req, res) => {
    const { userId, category, from, to } = req.query;
    let result = [...expenses];
    // let result = expenses;

    if (userId !== undefined) {
      result = result.filter((e) => String(e.userId) === String(userId));
    }

    if (category !== undefined) {
      result = result.filter((e) => e.category === category);
    }

    if (from !== undefined) {
      result = result.filter((e) => new Date(e.spentAt) >= new Date(from));
    }

    if (to !== undefined) {
      result = result.filter((e) => new Date(e.spentAt) <= new Date(to));
    }

    res.status(200).send(result);
  });

  app.post('/expenses', (req, res) => {
    const { userId, spentAt, title, amount, category, note } = req.body;

    const user = users.find((u) => u.id === +userId);

    if (!user) {
      res.status(400).send('Bad request');

      return;
    }

    if (
      !userId ||
      typeof spentAt !== 'string' ||
      typeof title !== 'string' ||
      typeof amount !== 'number' ||
      typeof category !== 'string' ||
      (note !== undefined && typeof note !== 'string')
    ) {
      res.status(400).send('Bad request');

      return;
    }

    const newExpense = {
      id: expenseNumber,
      userId,
      spentAt,
      title,
      amount,
      category,
      note,
    };

    expenseNumber++;

    expenses.push(newExpense);
    res.status(201).send(newExpense);
  });

  app.get('/expenses/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).send('Bad request');

      return;
    }

    const expense = expenses.find((exp) => exp.id === +id);

    if (!expense) {
      res.status(404).send('Not found');

      return;
    }

    res.status(200).send(expense);
  });

  app.delete('/expenses/:id', (req, res) => {
    const { id } = req.params;

    const expense = expenses.find((exp) => exp.id === +id);

    if (!expense) {
      res.status(404).send('Not found');

      return;
    }

    expenses = expenses.filter((exp) => exp.id !== +id);
    res.sendStatus(204);
  });

  app.patch('/expenses/:id', (req, res) => {
    const { id } = req.params;
    const { spentAt, title, amount, category, note } = req.body;

    if (
      (spentAt !== undefined && typeof spentAt !== 'string') ||
      (title !== undefined && typeof title !== 'string') ||
      (amount !== undefined && typeof amount !== 'number') ||
      (category !== undefined && typeof category !== 'string') ||
      (note !== undefined && typeof note !== 'string')
    ) {
      res.status(400).send('Bad request');

      return;
    }

    const expense = expenses.find((exp) => exp.id === +id);

    if (!expense) {
      res.status(404).send('Not found');

      return;
    }

    if (spentAt) {
      expense.spentAt = spentAt;
    }

    if (amount !== undefined) {
      expense.amount = amount;
    }

    if (title) {
      expense.title = title;
    }

    if (category) {
      expense.category = category;
    }

    if (note) {
      expense.note = note;
    }

    res.status(200).send(expense);
  });

  return app;
}

module.exports = {
  createServer,
};
