const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const connectDB = require("./db/connectDB")
const usersRouter = require("./routes/Users")
const tasksRouter = require("./routes/Tasks")
const {NotFound} = require("./middlewares/NotFound")
const DefaultError = require("./middlewares/DefaultError")

const app = express()

const NODE_ENV = process.argv[2] || "development";

const envConfig = dotenv.config({
	path: path.resolve(__dirname, `.env${NODE_ENV === "production" ? ".production" : ""}`)	
})

let env = {}
if(envConfig.error) console.log(envConfig)
else env = envConfig.parsed

// Middlewares
app.use(function(req, res, next) {
	if(process.env.FRONTEND_ORIGIN){
		res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN)		// update to match the domain you will make the request from
	}
	if(process.env.ALLOW_ALL_ORIGIN && process.env.ALLOW_ALL_ORIGIN?.toLowerCase() === 'true'){
		res.header("Access-Control-Allow-Origin", "*");
	}
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
	// headers.append('Access-Control-Allow-Credentials', 'true')
	next();
});
app.use(express.static("./public"))
app.use(express.json())

// Routes
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/tasks', tasksRouter)

// Default Route
app.use(NotFound)

// Default Error
app.use(DefaultError)

// Server
const start = async () => {
	const port = process.env.PORT || 5002
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(port, () =>
			console.log(`Server is listening on port http://localhost:${port}/ ...`)
		)
	} catch (error) {
		console.log(error)
	}
}

start()
