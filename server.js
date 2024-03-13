let express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

let app = express();

let DATABASE_URL = process.env.DATABASE_URL;
let CLOUDDATABASE_URL = process.env.CLOUDDATABASE_URL;
let LOCALHOST_URL = process.env.LOCALHOST_URL; // frontend localhosturl

// app.use(cors());

// origins allowed to make an http request to the server
app.use(
  cors({
    origin: [
      `${LOCALHOST_URL}`,
      'https://luminesc.netlify.app',
      'https://luminesc-backend.onrender.com',
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Sets X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');

  // Sets Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Set Content Security Policy headers
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src  https://luminesc.netlify.app,  https://luminesc-backend.onrender.com"
  );

  next();
});

app.get('/testing', (req, res) => {
  res.send('testing luminesc');
});

// this route is for the regular sign up (without google) Inserts the users username and email to database. when they click register in sign up page
app.post('/createuser', async (req, res) => {
  try {
    const { username, email, uid } = req.body;

    // Checks if the user already exists in the database of the googleexpensetrackuser table
    const existingUser = await prisma.expensetrackeruser.findFirst({
      where: {
        email,
      },
    });

    // console.log(existingUser, 'existingUser');

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // if User doesn't exist, creates a new user in the googleexpensetrackuser table
    const newUser = await prisma.expensetrackeruser.create({
      data: {
        username,
        email,
        uid,
      },
    });

    // console.log('New user created:', newUser);

    res.json({
      message: 'User created successfully!',
      user: newUser,
    });
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Inserts the users google username and email to database. when they click sign in with google button in login page
app.post('/creategoogleuser', async (req, res) => {
  try {
    const { username, email, googleuid } = req.body;

    // Checks if the user already exists in the database of the googleexpensetrackuser table
    const existingUser = await prisma.googleexpensetrackuser.findFirst({
      where: {
        email,
      },
    });

    // console.log(existingUser, 'existingUser');

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // if the User doesn't exist, creates a new user in the googleexpensetrackuser table
    const newUser = await prisma.googleexpensetrackuser.create({
      data: {
        username,
        email,
        googleuid,
      },
    });

    // console.log('New user created:', newUser);

    res.json({
      message: 'User created successfully!',
      user: newUser,
    });
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// post income FOR THE GOOGLE USER ACCOUNT (this is not used for the non google accounts)
app.post('/googleincome', async (req, res) => {
  try {
    // console.log(req.body);
    const { amount, source, date, text, googleuid } = req.body;
    // console.log(amount);

    // Creates a new record in the googleincome table using Prisma
    const newIncome = await prisma.googleincome.create({
      data: {
        amount: req.body.amount,
        source: req.body.source,
        date: req.body.date,
        text: req.body.text,
        googleuid: req.body.googleuid,
      },
    });

    // console.log('successfully posted!');
    res.status(201).json(newIncome);
  } catch (error) {
    console.error('Error creating googleincome record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// post income to the non-google user income table
app.post('/income', async (req, res) => {
  try {
    // Extracts data from the request body
    // console.log(req.body, 'income');
    const { amount, source, date, text, googleuid } = req.body;
    // console.log(amount);
    // Create a new record in the googleincome table using Prisma
    const newIncome = await prisma.income.create({
      data: {
        amount: req.body.amount,
        source: req.body.source,
        date: req.body.date,
        text: req.body.text,
        uid: req.body.googleuid, // this is not the googleuid
      },
    });

    // console.log('successfully posted!');
    res.status(201).json(newIncome);
  } catch (error) {
    // If an error occurs, send an error response
    console.error('Error creating expense record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// post expense for the googleuser
app.post('/googleexpense', async (req, res) => {
  try {
    // Extract data from the request body
    // console.log(req.body, 'expense');
    const { amount, source, date, text } = req.body;
    // console.log(amount);

    // Creates a new record in the googleincome table using Prisma
    const newExpense = await prisma.googleexpense.create({
      data: {
        amount: req.body.amount,
        source: req.body.source,
        date: req.body.date,
        text: req.body.text,
        googleuid: req.body.googleuid,
      },
    });

    // console.log('successfully posted!');
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error creating googleexpense record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// post the expense for the non-google user to the expense table
app.post('/expense', async (req, res) => {
  try {
    // console.log(req.body, 'expense');
    const { amount, source, date, text, googleuid } = req.body;
    // console.log(amount);

    // Creates a new record in the googleincome table using Prisma
    const newExpense = await prisma.expense.create({
      data: {
        amount: req.body.amount,
        source: req.body.source,
        date: req.body.date,
        text: req.body.text,
        uid: req.body.googleuid, // this is not the googleuid
      },
    });

    // Sends a success response
    // console.log('successfully posted!');
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error creating expense record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// gets the balance of the user and displays it to the balance component (this is for display the total amount of money)
// Fetch total income amount for a specific user
// Fetch total income and expense amount for a specific user
app.get('/googlegetbalance/:googleuid', async (req, res) => {
  try {
    const { googleuid } = req.params;

    // Fetch total income amount for the specific google user with the googleuid
    const totalIncome = await prisma.googleincome.aggregate({
      where: { googleuid },
      _sum: { amount: true },
    });

    // Fetch total expense amount for the specific google user with the googleuid
    const totalExpense = await prisma.googleexpense.aggregate({
      where: { googleuid },
      _sum: { amount: true },
    });

    // Calculates net income (aka total income)
    const incomeAmount = totalIncome?._sum?.amount || 0;
    const expenseAmount = totalExpense?._sum?.amount || 0;
    const netIncome = Number(incomeAmount) - Number(expenseAmount);

    // console.log(netIncome, 'net income');

    res.json({
      incomeAmount,
      expenseAmount,
      netIncome,
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// gets the balance of the NON-google-user and displays it to the balance component (this is for display the total amount of money)
// Fetch total income amount for a specific user
// Fetch total income and expense amount for a specific user
app.get('/getbalance/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    // Fetch total income amount for the specific google user with the googleuid
    const totalIncome = await prisma.income.aggregate({
      where: { uid },
      _sum: { amount: true },
    });

    // Fetch total expense amount for the specific google user with the googleuid
    const totalExpense = await prisma.expense.aggregate({
      where: { uid },
      _sum: { amount: true },
    });

    // Calculate net income (aka total income)
    const incomeAmount = totalIncome?._sum?.amount || 0;
    const expenseAmount = totalExpense?._sum?.amount || 0;
    const netIncome = Number(incomeAmount) - Number(expenseAmount);

    // console.log(netIncome, 'net inco');
    // sends the data to the frontend
    res.json({
      incomeAmount,
      expenseAmount,
      netIncome,
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// gets the text and amount from the non-google account user and displays them in the tableinferface component
app.get('/gettextandamount/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    // Find all records in the googleincome table for the specific google user with the googleuid
    const incomeRecords = await prisma.income.findMany({
      where: { uid },
    });
    // console.log(incomeRecords, 'incomerecords');

    // Extracts text and amount from each record.  use map to make a new array and and combines income and expense at the end
    const incomeTextAndAmount = incomeRecords.map((record) => ({
      text: record.text,
      amount: record.amount,
      source: record.source,
      googleuid: record.uid,
      id: record.id,
      // experimental
      // date: record.date,
    }));

    // Find all records in the googleexpense table for the specific google user with the googleuid
    const expenseRecords = await prisma.expense.findMany({
      where: { uid },
    });

    const expenseTextAndAmount = expenseRecords.map((record) => ({
      text: record.text,
      amount: record.amount,
      source: record.source,
      googleuid: record.uid,
      id: record.id,
      // experimental
      // date: record.date,
    }));

    // Combines income and expense data
    const allTextAndAmount = [...incomeTextAndAmount, ...expenseTextAndAmount];

    // console.log(allTextAndAmount, 'text and amount');
    // Sends the combined data to the frontend
    res.json(allTextAndAmount);
  } catch (error) {
    console.error('Error fetching text and amount:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/googlegettextandamount/:googleuid', async (req, res) => {
  try {
    const { googleuid } = req.params;

    // Find all records in the googleincome table for the specific google user with the googleuid
    // uses findMany method to retrieve all records from the googleincome table that match the specified googleuid
    const incomeRecords = await prisma.googleincome.findMany({
      where: { googleuid },
    });
    // console.log(incomeRecords, 'incomerecords');

    // Extracts text and amount from each record.  uses map to make a new array of both income and expense, then combines them
    const incomeTextAndAmount = incomeRecords.map((record) => ({
      text: record.text,
      amount: record.amount,
      source: record.source,
      googleuid: record.googleuid,
      id: record.id,
      // experimental
      date: record.date,
    }));

    // Find all records in the googleexpense table for the specific google user with the googleuid
    const expenseRecords = await prisma.googleexpense.findMany({
      where: { googleuid },
    });

    // Extract text and amount from each expense record
    const expenseTextAndAmount = expenseRecords.map((record) => ({
      text: record.text,
      amount: record.amount,
      source: record.source,
      googleuid: record.googleuid,
      id: record.id,

      date: record.date,
    }));

    // Combine income and expense data
    const allTextAndAmount = [...incomeTextAndAmount, ...expenseTextAndAmount];

    // Send the combined data to the frontend
    res.json(allTextAndAmount);
  } catch (error) {
    console.error('Error fetching text and amount:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// find user, then finds id of the item, then deletes the item from the table
app.delete('/googledeleteincome', async (req, res) => {
  try {
    const { googleuid, id } = req.body;

    // Checks if the user exists
    const user = await prisma.googleexpensetrackuser.findUnique({
      where: { googleuid },
    });

    // console.log(user, 'user');

    // Finds the item with the specified id belonging to the user
    const itemToDelete = await prisma.googleincome.findUnique({
      where: { id },
    });
    // console.log(itemToDelete, 'itemtodelete');

    if (!itemToDelete) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Checks if the item belongs to the user
    if (itemToDelete.googleuid !== googleuid) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Item does not belong to user' });
    }

    // Delete the item from the googleincome table
    await prisma.googleincome.delete({
      where: { id },
    });

    // console.log('deleted item', id);

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// find non-google-user,  then find id of the item, then delete the item from the table
app.delete('/deleteincome', async (req, res) => {
  try {
    const { uid, id } = req.body;

    // Checks if the user exists
    const user = await prisma.expensetrackeruser.findUnique({
      where: { uid },
    });

    // console.log(user, 'user');

    // Finds the item with the specified id belonging to the user
    const itemToDelete = await prisma.income.findUnique({
      where: { id },
    });
    // console.log(itemToDelete, 'itemtodelete');

    if (!itemToDelete) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Checks if the item belongs to the user
    if (itemToDelete.uid !== uid) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Item does not belong to user' });
    }

    // Deletes the item from the googleincome table
    await prisma.income.delete({
      where: { id },
    });

    // console.log('deleted item', id);

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// route to delete the google expense
app.delete('/googledeleteexpense', async (req, res) => {
  try {
    const { googleuid, id } = req.body;

    // Checks if the user exists
    const user = await prisma.googleexpensetrackuser.findUnique({
      where: { googleuid },
    });

    // console.log(user, 'user');

    // Finds the item with the specified id belonging to the user
    const itemToDelete = await prisma.googleexpense.findUnique({
      where: { id },
    });
    // console.log(itemToDelete, 'itemtodelete');

    if (!itemToDelete) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Checks if the item belongs to the user
    if (itemToDelete.googleuid !== googleuid) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Item does not belong to user' });
    }

    // Delete the item from the googleincome table
    await prisma.googleexpense.delete({
      where: { id },
    });

    // console.log('deleted item', id);

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// route to delete the expense item from the non-google-user
app.delete('/deleteexpense', async (req, res) => {
  // console.log(req.body, 'this is the req.body');
  try {
    const { uid, id } = req.body;

    // Checks if the user exists
    const user = await prisma.expensetrackeruser.findUnique({
      where: { uid },
    });

    // console.log(user, 'user');

    // Finds the item with the specified id belonging to the user
    const itemToDelete = await prisma.expense.findUnique({
      where: { id },
    });
    // console.log(itemToDelete, 'itemtodelete');

    if (!itemToDelete) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Checks if the item belongs to the user
    if (itemToDelete.id !== id) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Item does not belong to user' });
    }

    // Delete the item from the googleincome table
    await prisma.expense.delete({
      where: { id },
    });

    // console.log('deleted item', id);

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// This route updates the Non-google account users  email
app.post('/update/:uid', async (req, res) => {
  // console.log(req.body);
});

let PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`server is running on ${PORT}`);
});
