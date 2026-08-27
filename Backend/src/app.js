const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")
const fs = require("fs")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        // Allow localhost and requests with no origin (e.g. same origin or tools)
        callback(null, true)
    },
    credentials: true
}))

/* Root API Status */
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "HireReady Backend API is live and running!",
        healthCheck: "/api/health"
    })
})

/* API Health Check */
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "HireReady API is running successfully!",
        endpoints: {
            auth: "/api/auth",
            interview: "/api/interview"
        }
    })
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the API routes */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/* Serve Frontend build files */
const frontendDist = path.join(__dirname, "../../Frontend/dist")
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist))
    app.use((req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"))
    })
}

module.exports = app