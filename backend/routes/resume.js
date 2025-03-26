import express from "express";
import OpenAI from "openai";
import auth from "../middleware/auth";
import PDFDocument from "pdfkit";
import fs from "fs";
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/generate", auth, async (req, res) => {
  const { experience, education, skills } = req.body;

  const prompt = `Generate a professional resume summary for:
  - Experience: ${experience}
  - Education: ${education}
  - Skills: ${skills}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ resume: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "AI failed to generate resume" });
  }
});


router.post("/generate-pdf", auth, async (req, res) => {
  const { resume } = req.body;
  const doc = new PDFDocument();
  const filename = `resume_${req.user.userId}.pdf`;

  doc.text(resume);
  doc.pipe(fs.createWriteStream(`./pdfs/${filename}`));
  doc.end();

  res.json({ message: "PDF generated", file: `/pdfs/${filename}` });
});


module.exports = router;
