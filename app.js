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
app.use('/api/officeShifts',passport.authenticate('jwt', {session: false}), routes.officeShifts);
app.use('/api/designations',passport.authenticate('jwt', {session: false}), routes.designations);
app.use('/api/holidays',passport.authenticate('jwt', {session: false}), routes.holidays);
app.use('/api/leaves',passport.authenticate('jwt', {session: false}), routes.leave);
app.use('/api/employeeContracts',passport.authenticate('jwt', {session: false}), routes.contract);
app.use('/api/paymentProfiles',passport.authenticate('jwt', {session: false}), routes.paymentProfile);
app.use('/api/departments',passport.authenticate('jwt', {session: false}), routes.departments);
app.use('/api/attendances', routes.attendances);
app.use('/api/locations', routes.locations);
app.use('/api/auth', routes.auth);

// Start the server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});