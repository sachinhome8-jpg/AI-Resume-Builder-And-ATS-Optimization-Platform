require("dotenv").config()
const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const PDFDocument = require("pdfkit")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

const resumeDataSchema = z.object({
    fullName: z.string().describe("Candidate full name"),
    contact: z.object({
        email: z.string().optional().describe("Email address"),
        phone: z.string().optional().describe("Phone number"),
        location: z.string().optional().describe("City, State or Country"),
        linkedin: z.string().optional().describe("LinkedIn profile URL or username"),
        github: z.string().optional().describe("GitHub profile URL or username"),
        portfolio: z.string().optional().describe("Portfolio website URL")
    }),
    summary: z.string().describe("A powerful 3-4 sentence professional summary tailored specifically to the target job description"),
    skills: z.array(z.object({
        category: z.string().describe("e.g. Technical Skills, Frameworks & Libraries, Tools & Cloud, Core Competencies"),
        items: z.array(z.string()).describe("List of relevant skills matching the job description")
    })),
    experience: z.array(z.object({
        title: z.string().describe("Job title or role"),
        company: z.string().describe("Company or Organization name"),
        location: z.string().optional().describe("Location e.g. San Francisco, CA or Remote"),
        period: z.string().describe("Duration e.g. June 2023 - Present"),
        highlights: z.array(z.string()).describe("3-4 strong, action-oriented bullet points with quantified results and keywords")
    })),
    projects: z.array(z.object({
        name: z.string().describe("Project name"),
        techStack: z.string().optional().describe("Key technologies e.g. React, Node.js, MongoDB"),
        highlights: z.array(z.string()).describe("Key features and achievements")
    })),
    education: z.array(z.object({
        degree: z.string().describe("Degree name e.g. B.Tech in Computer Science"),
        institution: z.string().describe("University / College name"),
        year: z.string().describe("Graduation year or date range"),
        grade: z.string().optional().describe("GPA or Percentage if applicable")
    }))
})

async function callGeminiWithFallback(params) {
    const modelsToTry = [
        process.env.GEMINI_MODEL,
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-2.0-flash",
        "gemini-2.5-flash-lite"
    ].filter(Boolean)
    const uniqueModels = [ ...new Set(modelsToTry) ]
    let lastError = null

    for (const model of uniqueModels) {
        try {
            const response = await ai.models.generateContent({
                ...params,
                model
            })
            return response
        } catch (err) {
            console.warn(`Gemini model ${model} failed (${err.status || err.message}). Attempting fallback...`)
            lastError = err
        }
    }
    throw lastError
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`

    const response = await callGeminiWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)
}

function generatePdfWithPDFKit(data) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margins: { top: 32, bottom: 32, left: 36, right: 36 },
                bufferPages: true
            })

            const chunks = []
            doc.on("data", chunk => chunks.push(chunk))
            doc.on("end", () => resolve(Buffer.concat(chunks)))
            doc.on("error", err => reject(err))

            const primaryColor = "#0f172a" // slate-900
            const accentColor = "#2563eb"  // blue-600
            const textColor = "#334155"    // slate-700
            const mutedColor = "#64748b"   // slate-500
            const dividerColor = "#cbd5e1" // slate-300

            const addSectionHeader = (title) => {
                doc.moveDown(0.5)
                doc.font("Helvetica-Bold").fontSize(10.5).fillColor(accentColor).text(title.toUpperCase(), { characterSpacing: 0.6 })
                const lineY = doc.y + 1
                doc.strokeColor(accentColor).lineWidth(1).moveTo(doc.page.margins.left, lineY).lineTo(doc.page.width - doc.page.margins.right, lineY).stroke()
                doc.moveDown(0.3)
            }

            // 1. Header (Name & Contact)
            if (data.fullName) {
                doc.font("Helvetica-Bold").fontSize(18).fillColor(primaryColor).text(data.fullName, { align: "center" })
            }

            const contactItems = []
            if (data.contact?.email) contactItems.push(data.contact.email)
            if (data.contact?.phone) contactItems.push(data.contact.phone)
            if (data.contact?.location) contactItems.push(data.contact.location)
            if (data.contact?.linkedin) contactItems.push(data.contact.linkedin)
            if (data.contact?.github) contactItems.push(data.contact.github)
            if (data.contact?.portfolio) contactItems.push(data.contact.portfolio)

            if (contactItems.length > 0) {
                doc.moveDown(0.15)
                doc.font("Helvetica").fontSize(8.5).fillColor(mutedColor).text(contactItems.join("   •   "), { align: "center" })
            }

            doc.moveDown(0.2)
            doc.strokeColor(dividerColor).lineWidth(0.5).moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke()

            // 2. Summary
            if (data.summary) {
                addSectionHeader("Professional Summary")
                doc.font("Helvetica").fontSize(9).fillColor(textColor).text(data.summary, { lineGap: 2, align: "justify" })
            }

            // 3. Skills
            if (data.skills && data.skills.length > 0) {
                addSectionHeader("Technical Skills")
                data.skills.forEach(skillGroup => {
                    if (skillGroup.items && skillGroup.items.length > 0) {
                        doc.font("Helvetica-Bold").fontSize(9).fillColor(primaryColor).text(`${skillGroup.category}: `, { continued: true })
                        doc.font("Helvetica").fillColor(textColor).text(skillGroup.items.join(", "), { lineGap: 1.5 })
                    }
                })
            }

            // 4. Experience
            if (data.experience && data.experience.length > 0) {
                addSectionHeader("Professional Experience")
                data.experience.forEach(exp => {
                    doc.moveDown(0.25)
                    const titleCompany = `${exp.title || ""}${exp.company ? " — " + exp.company : ""}${exp.location ? " (" + exp.location + ")" : ""}`.trim()
                    const startY = doc.y

                    doc.font("Helvetica-Bold").fontSize(9.5).fillColor(primaryColor).text(titleCompany, { continued: false })
                    if (exp.period) {
                        doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(mutedColor).text(exp.period, doc.page.margins.left, startY, {
                            align: "right",
                            width: doc.page.width - doc.page.margins.left - doc.page.margins.right
                        })
                    }

                    if (exp.highlights && exp.highlights.length > 0) {
                        doc.moveDown(0.15)
                        exp.highlights.forEach(bullet => {
                            doc.font("Helvetica").fontSize(8.5).fillColor(textColor).text(`•  ${bullet}`, {
                                indent: 8,
                                lineGap: 1.5
                            })
                        })
                    }
                })
            }

            // 5. Projects
            if (data.projects && data.projects.length > 0) {
                addSectionHeader("Key Projects")
                data.projects.forEach(proj => {
                    doc.moveDown(0.25)
                    const projTitle = proj.name || "Project"
                    const startY = doc.y

                    doc.font("Helvetica-Bold").fontSize(9.5).fillColor(primaryColor).text(projTitle, { continued: !!proj.techStack })
                    if (proj.techStack) {
                        doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(mutedColor).text(` | ${proj.techStack}`)
                    }

                    if (proj.highlights && proj.highlights.length > 0) {
                        doc.moveDown(0.15)
                        proj.highlights.forEach(bullet => {
                            doc.font("Helvetica").fontSize(8.5).fillColor(textColor).text(`•  ${bullet}`, {
                                indent: 8,
                                lineGap: 1.5
                            })
                        })
                    }
                })
            }

            // 6. Education
            if (data.education && data.education.length > 0) {
                addSectionHeader("Education")
                data.education.forEach(edu => {
                    doc.moveDown(0.25)
                    const eduTitle = `${edu.degree || ""}${edu.institution ? ", " + edu.institution : ""}`.trim()
                    const startY = doc.y

                    doc.font("Helvetica-Bold").fontSize(9).fillColor(primaryColor).text(eduTitle, { continued: false })
                    if (edu.year || edu.grade) {
                        const meta = [ edu.year, edu.grade ].filter(Boolean).join("  |  ")
                        doc.font("Helvetica").fontSize(8.5).fillColor(mutedColor).text(meta, doc.page.margins.left, startY, {
                            align: "right",
                            width: doc.page.width - doc.page.margins.left - doc.page.margins.right
                        })
                    }
                })
            }

            doc.end()
        } catch (err) {
            reject(err)
        }
    })
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert ATS Resume Builder. Generate a high-impact, tailored resume for this candidate optimized for the given job description:
Candidate Original Resume: ${resume}
Candidate Self Description / Extra Details: ${selfDescription}
Target Job Description: ${jobDescription}

Instructions:
1. Tailor the professional summary, skills, experience bullet points, and projects directly to the target job description.
2. Use strong action verbs (Architected, Developed, Spearheaded, Optimized, Delivered) and include quantifiable metrics wherever applicable.
3. Keep the resume crisp, professional, human-sounding, and 100% ATS-friendly.
4. Extract accurate candidate name and contact information if present in the resume/description.
`

    const response = await callGeminiWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumeDataSchema),
        }
    })

    const resumeData = JSON.parse(response.text)
    const pdfBuffer = await generatePdfWithPDFKit(resumeData)

    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }