import express from 'express';
import cors from "cors"
import config from "./config/config.js";
import './config/db.js'
import routes from "./routes/index.js";
import passport from "./config/passport.js";

const app = express();
app.use(cors())

app.use(express.json());

// route
app.use('/api/leaveTypes', passport.authenticate('jwt', {session: false}),routes.leaveTypes);
app.use('/api/branches', routes.branches);
app.use('/api/employees', routes.employees);
app.use('/api/officeShifts', routes.officeShifts);
app.use('/api/designations', routes.designations);
app.use('/api/holidays', routes.holidays);
app.use('/api/leaves', routes.leave);
app.use('/api/employeeContracts', routes.contract);
app.use('/api/paymentProfiles', routes.paymentProfile);
app.use('/api/departments', routes.departments);
app.use('/api/auth', routes.auth);

// Start the server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});