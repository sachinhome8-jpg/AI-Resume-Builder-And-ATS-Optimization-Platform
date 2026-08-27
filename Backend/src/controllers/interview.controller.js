const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = ""

        if (req.file && req.file.buffer) {
            try {
                const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
                resumeText = resumeContent?.text || ""
            } catch (parseErr) {
                console.error("PDF Parsing Error:", parseErr)
                return res.status(400).json({
                    message: "Failed to extract text from the uploaded PDF. Please make sure it's a valid, readable PDF."
                })
            }
        }

        const { selfDescription, jobDescription } = req.body

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                message: "Job description is required."
            })
        }

        if (!resumeText.trim() && (!selfDescription || !selfDescription.trim())) {
            return res.status(400).json({
                message: "Please upload a resume or provide a self description."
            })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interViewReportByAi
        })

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Generate Interview Report Error:", err)
        return res.status(500).json({
            message: err.message || "An error occurred while generating the interview report."
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume_${interviewReportId}.pdf"`,
            "Content-Length": pdfBuffer.length
        })

        return res.send(pdfBuffer)
    } catch (err) {
        console.error("Generate Resume PDF Controller Error:", err)
        return res.status(500).json({
            message: err.message || "Failed to generate resume PDF."
        })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }