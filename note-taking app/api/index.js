import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { auth } from  'express-oauth2-jwt-bearer'

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});


// express init
const app = express("express");

// express configurations
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const prisma = new PrismaClient();

app.get("/ping", (req, res) => {
    res.send("pong");
  });

//GET: gets public notes from all users
app.get('/notes/public', async (req, res) => {
  try {
    const publicNotes = await prisma.notes.findMany({
      where: {
        privacyLevel: 'PUBLIC',
      },
    });

    res.json(publicNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//GET: gets all the notes of a user
app.get('/notes', requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    const notes = await prisma.notes.findMany({
      where: {
        userId: user.id,
      },
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//GET: gets a note of a user
app.get('/notes/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const note = await prisma.notes.findUnique({
      where: {
        id: id,
      },
    });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//POST: creates a note for a user by ID
app.post('/notes', requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { title, content } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const note = await prisma.notes.create({
      data: {
        title,
        content,
        user: { connect: { id: user.id } },
      },
    });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//PUT: updates a note for a user by ID
app.put('/notes/:noteId', requireAuth, async (req, res) => {
  const noteId = parseInt(req.params.noteId);
  const { title, content, privacyLevel } = req.body;

  try {
    
    const note = await prisma.notes.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updatedNote = await prisma.notes.update({
      where: { id: noteId },
      data: {
        title,
        content,
        privacyLevel
      },
    });

    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//DELETE: deletes a note for a user by ID
app.delete('/notes/:noteId', requireAuth, async (req, res) => {
  const noteId = parseInt(req.params.noteId);

  try {

    const note = await prisma.notes.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await prisma.notes.delete({
      where: { id: noteId },
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//GET: get a user's username from a note id
app.get('/notes/user/:id', async (req, res) => {
    const noteId = parseInt(req.params.id);

    try {
      const note = await prisma.notes.findUnique({
        where: {
          id: noteId,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });
  
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      res.json(note.user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//Profile:
//GET: gets a user's profile
app.get('/profile', requireAuth, async (req, res) => {
    const auth0Id = req.auth.payload.sub;
  
    try {
      const user = await prisma.user.findUnique({
        where: { auth0Id },
        include: { profile: true },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user.profile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

//PUT: updates a user's profile
app.put('/profile', requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
    const { bio, firstName, lastName, birthdate} = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: { auth0Id },
        include: { profile: true },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const updatedProfile = await prisma.profile.update({
        where: { id: user.profile.id },
        data: {
          bio,
          firstName,
          lastName,
          birthdate: birthdate + 'T08:00:00.000Z',
        },
      });
  
      res.json(updatedProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const username = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/nickname`];
  console.log(req.auth.payload);
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        username,
        profile: {
          create: {
            // Provide the initial values for the profile fields
            // You can customize this based on your schema and requirements
            bio: "",
            firstName: "",
            lastName: "",
            birthdate: null,
          },
        },
      },
      include: {
        profile: true, // Include the associated profile in the response
      },
    });

    res.json(newUser);
  }
});

// Starts HTTP Server
app.listen(8000, () => {
    console.log("Server running on http://localhost:8000 🎉 🚀");
});

